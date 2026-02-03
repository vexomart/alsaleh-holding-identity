import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import React from 'npm:react@18.3.1';

import { WalletDepositEmail } from './_templates/wallet-deposit.tsx';
import { WalletWithdrawalEmail } from './_templates/wallet-withdrawal.tsx';
import { BalanceAlertEmail } from './_templates/balance-alert.tsx';
import { TransactionSummaryEmail } from './_templates/transaction-summary.tsx';
import { WelcomeEmailTemplate } from './_templates/welcome-email.tsx';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WalletEmailRequest {
  type: 'deposit' | 'withdrawal' | 'balance_alert' | 'transaction_summary' | 'welcome';
  customer_name: string;
  customer_email: string;
  data?: any; // بيانات مرنة حسب نوع الإيميل
  
  // الحقول القديمة للتوافق مع الإصدارات السابقة
  customerName?: string;
  customerEmail?: string;
  amount?: number;
  currency?: string;
  newBalance?: number;
  transactionId?: string;
  walletNumber?: string;
  alertThreshold?: number;
  topUpUrl?: string;
  period?: string;
  transactions?: Array<{
    id: string;
    type: 'deposit' | 'withdrawal';
    amount: number;
    date: string;
    description: string;
  }>;
  totalDeposits?: number;
  totalWithdrawals?: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: WalletEmailRequest = await req.json();
    const {
      type,
      customer_name,
      customer_email,
      data,
      // الحقول القديمة للتوافق
      customerName,
      customerEmail,
      amount,
      currency,
      newBalance,
      transactionId,
      walletNumber,
      alertThreshold,
      topUpUrl,
      period,
      transactions,
      totalDeposits,
      totalWithdrawals
    } = requestData;

    // دعم النظام القديم والجديد
    const finalCustomerName = customer_name || customerName;
    const finalCustomerEmail = customer_email || customerEmail;

    console.log(`📧 Processing ${type} email for ${finalCustomerName} (${finalCustomerEmail})`);

    // Validate required fields
    if (!finalCustomerName || !finalCustomerEmail) {
      throw new Error('Missing required fields: customer_name and customer_email');
    }

    if (!finalCustomerEmail.includes('@')) {
      throw new Error('Invalid email address format');
    }

    let emailSubject = '';
    let emailHtml = '';
    const currentDate = new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Riyadh'
    }).format(new Date());

    // Generate appropriate email based on type
    switch (type) {
      case 'deposit':
        const depositAmount = data?.amount || amount;
        const depositTransactionId = data?.transaction_id || transactionId || `TXN_${Date.now()}`;
        const depositWalletNumber = walletNumber || 'W' + Math.random().toString().substr(2, 8);
        
        if (!depositAmount) {
          throw new Error('Amount required for deposit email');
        }
        
        emailSubject = `✅ تم إيداع ${depositAmount?.toLocaleString('ar-SA')} ريال في محفظتك الرقمية`;
        emailHtml = await renderAsync(
          React.createElement(WalletDepositEmail, {
            customerName: finalCustomerName,
            amount: depositAmount,
            currency: currency || 'SAR',
            newBalance: data?.new_balance || newBalance || 0,
            transactionId: depositTransactionId,
            date: currentDate,
            walletNumber: depositWalletNumber,
          })
        );
        break;

      case 'withdrawal':
        const withdrawalAmount = data?.amount || amount;
        const withdrawalTransactionId = data?.transaction_id || transactionId || `TXN_${Date.now()}`;
        const withdrawalWalletNumber = walletNumber || 'W' + Math.random().toString().substr(2, 8);
        
        if (!withdrawalAmount) {
          throw new Error('Amount required for withdrawal email');
        }
        
        emailSubject = `⚠️ تم سحب ${withdrawalAmount?.toLocaleString('ar-SA')} ريال من محفظتك الرقمية`;
        emailHtml = await renderAsync(
          React.createElement(WalletWithdrawalEmail, {
            customerName: finalCustomerName,
            amount: withdrawalAmount,
            currency: currency || 'SAR',
            newBalance: data?.new_balance || newBalance || 0,
            transactionId: withdrawalTransactionId,
            date: currentDate,
            walletNumber: withdrawalWalletNumber,
          })
        );
        break;

      case 'welcome':
        emailSubject = `🎉 مرحباً بك في محفظتك الرقمية - شركة الصالح القابضة`;
        emailHtml = await renderAsync(
          React.createElement(WelcomeEmailTemplate, {
            customerName: finalCustomerName,
            data: data || {
              user_id: 'new-user',
              welcome_message: 'مرحباً بك في منصتنا! تم إنشاء محفظتك الرقمية بنجاح.',
              initial_balance: 0,
              wallet_features: [
                'إيداع وسحب الأموال بسهولة',
                'تتبع جميع المعاملات المالية',
                'إشعارات فورية عند كل معاملة',
                'أمان عالي لحماية أموالك'
              ]
            }
          })
        );
        break;

      case 'balance_alert':
        if (!alertThreshold || !topUpUrl) {
          throw new Error('Alert threshold and top-up URL required for balance alert email');
        }
        
        emailSubject = `🚨 تنبيه: رصيد محفظتك منخفض - ${newBalance?.toLocaleString('ar-SA')} ريال`;
        emailHtml = await renderAsync(
          React.createElement(BalanceAlertEmail, {
            customerName: finalCustomerName,
            currentBalance: newBalance || 0,
            currency: 'SAR',
            walletNumber: walletNumber || 'W' + Math.random().toString().substr(2, 8),
            alertThreshold: alertThreshold || 100,
            topUpUrl: topUpUrl || 'https://alsaleh-holding.com/wallet',
          })
        );
        break;

      case 'transaction_summary':
        if (!period || !transactions || totalDeposits === undefined || totalWithdrawals === undefined) {
          throw new Error('Period, transactions, totalDeposits, and totalWithdrawals required for summary email');
        }
        
        emailSubject = `📊 ملخص معاملات محفظتك الرقمية - ${period}`;
        emailHtml = await renderAsync(
          React.createElement(TransactionSummaryEmail, {
            customerName: finalCustomerName,
            walletNumber: walletNumber || 'W' + Math.random().toString().substr(2, 8),
            currentBalance: newBalance || 0,
            currency: 'SAR',
            period: period || 'الشهر الحالي',
            transactions: transactions || [],
            totalDeposits: totalDeposits || 0,
            totalWithdrawals: totalWithdrawals || 0,
          })
        );
        break;

      default:
        throw new Error(`Invalid email type: ${type}`);
    }

    // Determine sender name based on email type
    const senderName = type === 'balance_alert' 
      ? "تنبيهات المحفظة - علي الشهري القابضة" 
      : type === 'transaction_summary'
      ? "التقارير المالية - علي الشهري القابضة"
      : "المحفظة الرقمية - علي الشهري القابضة";

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "المحفظة الرقمية - ASH HOLDING <info@ash-holding.sa>",
      to: [finalCustomerEmail],
      subject: emailSubject,
      html: emailHtml,
      headers: {
        'X-Entity-Ref-ID': (data?.transaction_id || transactionId || `${type}-${Date.now()}`),
        'X-Priority': type === 'balance_alert' ? '1' : type === 'withdrawal' ? '2' : '3',
        'X-Wallet-Number': walletNumber || 'N/A',
        'X-Email-Type': type,
      },
    });

    console.log(`✅ Email sent successfully to ${finalCustomerEmail}:`, emailResponse);

    // تحقق من وجود خطأ في الإرسال
    if (emailResponse.error) {
      console.error('❌ Resend API error:', emailResponse.error);
      throw new Error(`Failed to send email: ${emailResponse.error.message || 'Unknown error'}`);
    }

    // Log the email sending for audit purposes
    const logData = {
      timestamp: new Date().toISOString(),
      type,
      recipient: finalCustomerEmail,
      customerName: finalCustomerName,
      amount: (data?.amount || amount) || 0,
      newBalance: (data?.new_balance || newBalance) || 0,
      transactionId: (data?.transaction_id || transactionId),
      walletNumber: walletNumber || 'N/A',
      emailId: emailResponse.data?.id,
      success: true,
      priority: type === 'balance_alert' ? 'high' : type === 'withdrawal' ? 'medium' : 'normal'
    };

    console.log(`📊 Email audit log:`, logData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailResponse.data?.id,
        type,
        recipient: finalCustomerEmail,
        walletNumber: walletNumber || 'N/A',
        timestamp: new Date().toISOString(),
        message: `${type} email sent successfully to ${finalCustomerName}`
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("❌ Error in wallet-email-notifications function:", error);
    
    // Enhanced error logging
    const errorLog = {
      timestamp: new Date().toISOString(),
      functionName: 'wallet-email-notifications',
      error: error.message,
      stack: error.stack,
      requestMethod: req.method,
      success: false,
      severity: 'error'
    };
    console.error(`📊 Error audit log:`, errorLog);

    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        details: "تحقق من سجلات الدالة للحصول على مزيد من المعلومات"
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);