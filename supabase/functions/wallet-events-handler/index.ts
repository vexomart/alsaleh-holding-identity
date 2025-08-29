import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WalletEventRequest {
  event: 'wallet.transaction.status.changed' | 'auth.otp.requested';
  data: {
    transaction_id?: string;
    user_id: string;
    type?: 'deposit' | 'withdraw';
    old_status?: string;
    new_status: string;
    amount?: number;
    currency?: string;
    balance_after?: number;
    approved_by?: string;
    reason?: string;
    otp_code?: string;
  };
}

class WalletEventsHandler {
  private supabase: any;

  constructor(supabase: any) {
    this.supabase = supabase;
  }

  async handleEvent(request: WalletEventRequest): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      console.log(`🎯 Handling wallet event: ${request.event}`);

      switch (request.event) {
        case 'wallet.transaction.status.changed':
          return await this.handleTransactionStatusChanged(request.data);
        
        case 'auth.otp.requested':
          return await this.handleOtpRequested(request.data);
        
        default:
          return { success: false, error: 'Unknown event type' };
      }

    } catch (error: any) {
      console.error('❌ Error handling wallet event:', error);
      return { success: false, error: error.message };
    }
  }

  private async handleTransactionStatusChanged(data: any): Promise<{ success: boolean; message?: string; error?: string }> {
    const { transaction_id, user_id, type, old_status, new_status, amount, currency, balance_after, reason } = data;

    console.log(`💰 Transaction status changed: ${old_status} → ${new_status} (${type})`);

    // التحقق من أنواع الأحداث التي نريد إرسال إيميلات لها
    if (old_status !== 'pending' || !['approved', 'rejected'].includes(new_status)) {
      console.log('ℹ️ No email notification needed for this status change');
      return { success: true, message: 'No notification needed' };
    }

    // تحديد نوع القالب
    let templateKey: string;
    if (type === 'deposit' && new_status === 'approved') {
      templateKey = 'wallet_deposit_approved';
    } else if (type === 'deposit' && new_status === 'rejected') {
      templateKey = 'wallet_deposit_rejected';
    } else if (type === 'withdraw' && new_status === 'approved') {
      templateKey = 'wallet_withdraw_approved';
    } else if (type === 'withdraw' && new_status === 'rejected') {
      templateKey = 'wallet_withdraw_rejected';
    } else {
      console.log('ℹ️ No template defined for this transaction type/status');
      return { success: true, message: 'No template defined' };
    }

    // تحضير البيانات للقالب
    const payload = {
      unique_ref: transaction_id,
      tx_id: transaction_id,
      amount: amount?.toString() || '0',
      currency: currency || 'SAR',
      balance_after: balance_after?.toString() || '0',
      reason: reason || 'غير محدد',
    };

    // إرسال الإيميل عبر خدمة الإيميل
    return await this.sendEmailNotification(user_id, templateKey, payload);
  }

  private async handleOtpRequested(data: any): Promise<{ success: boolean; message?: string; error?: string }> {
    const { user_id, otp_code } = data;

    console.log(`🔐 OTP requested for user: ${user_id}`);

    if (!otp_code) {
      return { success: false, error: 'OTP code is required' };
    }

    const payload = {
      unique_ref: `otp_${Date.now()}`,
      otp_code,
    };

    return await this.sendEmailNotification(user_id, 'otp_code', payload);
  }

  private async sendEmailNotification(userId: string, templateKey: string, payload: any): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      console.log(`📧 Sending email notification: ${templateKey} to user: ${userId}`);

      // استدعاء خدمة الإيميل
      const emailRequest = {
        action: 'send_template',
        user_id: userId,
        template_key: templateKey,
        payload: payload,
      };

      const { data, error } = await this.supabase.functions.invoke('email-service', {
        body: emailRequest,
      });

      if (error) {
        console.error('❌ Email service error:', error);
        return { success: false, error: `Email service error: ${error.message}` };
      }

      if (!data?.success) {
        console.error('❌ Email sending failed:', data?.error);
        return { success: false, error: data?.error || 'Email sending failed' };
      }

      console.log('✅ Email notification sent successfully');
      return { success: true, message: 'Email notification sent' };

    } catch (error: any) {
      console.error('❌ Error sending email notification:', error);
      return { success: false, error: error.message };
    }
  }

  // دالة مساعدة لإرسال إشعار تلقائي عند تغيير حالة المعاملة
  async notifyTransactionStatusChange(transactionId: string, oldStatus: string, newStatus: string, approvedBy?: string): Promise<void> {
    try {
      // جلب تفاصيل المعاملة
      const { data: transaction, error } = await this.supabase
        .from('wallet_transactions')
        .select(`
          *,
          customer_wallets!inner(user_id, balance, currency)
        `)
        .eq('id', transactionId)
        .single();

      if (error || !transaction) {
        console.error('❌ Transaction not found:', error);
        return;
      }

      // إنشاء حدث الإشعار
      const eventData: WalletEventRequest = {
        event: 'wallet.transaction.status.changed',
        data: {
          transaction_id: transactionId,
          user_id: transaction.customer_wallets.user_id,
          type: transaction.type,
          old_status: oldStatus,
          new_status: newStatus,
          amount: parseFloat(transaction.amount),
          currency: transaction.customer_wallets.currency,
          balance_after: parseFloat(transaction.balance_after),
          approved_by: approvedBy,
          reason: transaction.admin_notes,
        },
      };

      // معالجة الحدث
      await this.handleEvent(eventData);

    } catch (error: any) {
      console.error('❌ Error in notifyTransactionStatusChange:', error);
    }
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const eventsHandler = new WalletEventsHandler(supabase);
    const request: WalletEventRequest = await req.json();

    console.log(`🎯 Received wallet event: ${request.event}`);

    const result = await eventsHandler.handleEvent(request);

    const status = result.success ? 200 : 400;
    return new Response(
      JSON.stringify(result),
      { 
        status, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error: any) {
    console.error('❌ Error in wallet events handler:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
};

serve(handler);