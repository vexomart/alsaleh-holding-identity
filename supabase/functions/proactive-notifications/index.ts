/**
 * Proactive Notifications Edge Function
 * Processes scheduled notifications and triggers proactive alerts
 * 
 * Run via cron or manual trigger
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface NotificationResult {
  type: string;
  count: number;
  errors: string[];
}

// Process invoice reminders (72h, 24h, overdue)
async function processInvoiceReminders(): Promise<NotificationResult> {
  const result: NotificationResult = { type: 'invoice_reminders', count: 0, errors: [] };

  try {
    const { data: invoices, error } = await supabase.rpc('get_invoices_needing_reminders');
    
    if (error) {
      result.errors.push(`Failed to get invoices: ${error.message}`);
      return result;
    }

    for (const invoice of invoices || []) {
      const hoursUntilDue = invoice.hours_until_due;
      let severity: 'info' | 'warning' | 'critical' = 'info';
      let titleAr: string;
      let titleEn: string;
      let bodyAr: string;
      let bodyEn: string;

      if (hoursUntilDue < 0) {
        // Overdue
        severity = 'critical';
        titleAr = 'فاتورة متأخرة!';
        titleEn = 'Invoice Overdue!';
        bodyAr = `الفاتورة ${invoice.invoice_number} متأخرة عن موعد السداد. المبلغ: ${invoice.total} ريال`;
        bodyEn = `Invoice ${invoice.invoice_number} is overdue. Amount: ${invoice.total} SAR`;
      } else if (hoursUntilDue <= 25) {
        // 24 hours reminder
        severity = 'warning';
        titleAr = 'تذكير: فاتورة مستحقة غداً';
        titleEn = 'Reminder: Invoice Due Tomorrow';
        bodyAr = `الفاتورة ${invoice.invoice_number} مستحقة خلال 24 ساعة. المبلغ: ${invoice.total} ريال`;
        bodyEn = `Invoice ${invoice.invoice_number} is due in 24 hours. Amount: ${invoice.total} SAR`;
      } else {
        // 72 hours reminder
        severity = 'info';
        titleAr = 'تذكير: فاتورة مستحقة قريباً';
        titleEn = 'Reminder: Invoice Due Soon';
        bodyAr = `الفاتورة ${invoice.invoice_number} مستحقة خلال 3 أيام. المبلغ: ${invoice.total} ريال`;
        bodyEn = `Invoice ${invoice.invoice_number} is due in 3 days. Amount: ${invoice.total} SAR`;
      }

      const idempotencyKey = `invoice_reminder_${invoice.invoice_id}_${Math.floor(hoursUntilDue / 24)}`;

      const { error: notifError } = await supabase.rpc('create_proactive_notification', {
        p_user_id: invoice.customer_id,
        p_tenant_id: invoice.tenant_id,
        p_type: 'invoice_due',
        p_severity: severity,
        p_role_target: 'customer',
        p_title_ar: titleAr,
        p_title_en: titleEn,
        p_body_ar: bodyAr,
        p_body_en: bodyEn,
        p_link: `/app/invoices/${invoice.invoice_id}`,
        p_source_type: 'invoice',
        p_source_id: invoice.invoice_id,
        p_idempotency_key: idempotencyKey,
      });

      if (notifError) {
        result.errors.push(`Failed to create notification for invoice ${invoice.invoice_id}: ${notifError.message}`);
      } else {
        result.count++;
      }
    }
  } catch (err) {
    result.errors.push(`Exception in processInvoiceReminders: ${err.message}`);
  }

  return result;
}

// Process low wallet balance alerts
async function processLowWalletAlerts(): Promise<NotificationResult> {
  const result: NotificationResult = { type: 'low_wallet_balance', count: 0, errors: [] };

  try {
    const { data: wallets, error } = await supabase.rpc('get_wallets_with_low_balance', {
      p_threshold: 100,
    });

    if (error) {
      result.errors.push(`Failed to get wallets: ${error.message}`);
      return result;
    }

    for (const wallet of wallets || []) {
      let severity: 'info' | 'warning' | 'critical' = 'warning';
      let titleAr: string;
      let titleEn: string;
      let bodyAr: string;
      let bodyEn: string;

      if (wallet.balance <= 0) {
        severity = 'critical';
        titleAr = 'رصيد المحفظة صفر!';
        titleEn = 'Wallet Balance is Zero!';
        bodyAr = 'رصيد محفظتك صفر. قم بشحن المحفظة للاستمرار في استخدام الخدمات.';
        bodyEn = 'Your wallet balance is zero. Top up to continue using services.';
      } else {
        titleAr = 'تنبيه: رصيد المحفظة منخفض';
        titleEn = 'Alert: Low Wallet Balance';
        bodyAr = `رصيد محفظتك الحالي ${wallet.balance} ${wallet.currency}. قم بشحن المحفظة لتجنب انقطاع الخدمات.`;
        bodyEn = `Your current balance is ${wallet.balance} ${wallet.currency}. Top up to avoid service interruption.`;
      }

      // Daily idempotency to avoid spam
      const today = new Date().toISOString().split('T')[0];
      const idempotencyKey = `low_balance_${wallet.wallet_id}_${today}`;

      const { error: notifError } = await supabase.rpc('create_proactive_notification', {
        p_user_id: wallet.customer_user_id,
        p_tenant_id: wallet.tenant_id,
        p_type: 'low_wallet_balance',
        p_severity: severity,
        p_role_target: 'customer',
        p_title_ar: titleAr,
        p_title_en: titleEn,
        p_body_ar: bodyAr,
        p_body_en: bodyEn,
        p_link: '/app/wallet',
        p_source_type: 'wallet',
        p_source_id: wallet.wallet_id,
        p_idempotency_key: idempotencyKey,
      });

      if (notifError) {
        result.errors.push(`Failed to create notification for wallet ${wallet.wallet_id}: ${notifError.message}`);
      } else {
        result.count++;
      }
    }
  } catch (err) {
    result.errors.push(`Exception in processLowWalletAlerts: ${err.message}`);
  }

  return result;
}

// Process delayed order alerts
async function processDelayedOrders(): Promise<NotificationResult> {
  const result: NotificationResult = { type: 'order_delayed', count: 0, errors: [] };

  try {
    const { data: orders, error } = await supabase.rpc('get_delayed_orders', {
      p_hours_threshold: 48,
    });

    if (error) {
      result.errors.push(`Failed to get delayed orders: ${error.message}`);
      return result;
    }

    for (const order of orders || []) {
      const daysDelayed = Math.floor(order.hours_since_update / 24);
      
      // Notify customer
      const customerIdempotencyKey = `order_delayed_customer_${order.order_id}_${daysDelayed}`;
      
      const { error: customerError } = await supabase.rpc('create_proactive_notification', {
        p_user_id: order.customer_id,
        p_tenant_id: order.tenant_id,
        p_type: 'order_delayed',
        p_severity: 'warning',
        p_role_target: 'customer',
        p_title_ar: 'تحديث حالة الطلب',
        p_title_en: 'Order Status Update',
        p_body_ar: `الطلب ${order.order_number} في حالة "${order.status}" منذ ${daysDelayed} أيام. سيتم متابعته قريباً.`,
        p_body_en: `Order ${order.order_number} has been in "${order.status}" status for ${daysDelayed} days. We're following up.`,
        p_link: `/app/orders/${order.order_id}`,
        p_source_type: 'order',
        p_source_id: order.order_id,
        p_idempotency_key: customerIdempotencyKey,
      });

      if (!customerError) result.count++;
      
      // Notify admins
      const adminIdempotencyKey = `order_delayed_admin_${order.order_id}_${daysDelayed}`;
      
      const { error: adminError } = await supabase.rpc('create_proactive_notification', {
        p_user_id: null,
        p_tenant_id: order.tenant_id,
        p_type: 'order_delayed',
        p_severity: 'warning',
        p_role_target: 'admin',
        p_title_ar: 'تنبيه: طلب متأخر',
        p_title_en: 'Alert: Delayed Order',
        p_body_ar: `الطلب ${order.order_number} متأخر في حالة "${order.status}" منذ ${daysDelayed} أيام. يرجى المتابعة.`,
        p_body_en: `Order ${order.order_number} has been delayed in "${order.status}" status for ${daysDelayed} days. Please follow up.`,
        p_link: `/admin/orders?id=${order.order_id}`,
        p_source_type: 'order',
        p_source_id: order.order_id,
        p_idempotency_key: adminIdempotencyKey,
      });

      if (!adminError) result.count++;
    }
  } catch (err) {
    result.errors.push(`Exception in processDelayedOrders: ${err.message}`);
  }

  return result;
}

// Process expiring contracts
async function processExpiringContracts(): Promise<NotificationResult> {
  const result: NotificationResult = { type: 'contract_expiring', count: 0, errors: [] };

  try {
    const { data: contracts, error } = await supabase.rpc('get_expiring_contracts', {
      p_days_threshold: 7,
    });

    if (error) {
      result.errors.push(`Failed to get expiring contracts: ${error.message}`);
      return result;
    }

    for (const contract of contracts || []) {
      const idempotencyKey = `contract_expiring_${contract.contract_id}`;

      const { error: notifError } = await supabase.rpc('create_proactive_notification', {
        p_user_id: contract.customer_user_id,
        p_tenant_id: contract.tenant_id,
        p_type: 'contract_pending_signature',
        p_severity: 'warning',
        p_role_target: 'customer',
        p_title_ar: 'تذكير: عقد في انتظار التوقيع',
        p_title_en: 'Reminder: Contract Pending Signature',
        p_body_ar: `العقد ${contract.contract_number} في انتظار توقيعك. يرجى مراجعته والتوقيع عليه.`,
        p_body_en: `Contract ${contract.contract_number} is waiting for your signature. Please review and sign.`,
        p_link: `/app/contracts/${contract.contract_id}`,
        p_source_type: 'contract',
        p_source_id: contract.contract_id,
        p_idempotency_key: idempotencyKey,
      });

      if (notifError) {
        result.errors.push(`Failed to create notification for contract ${contract.contract_id}: ${notifError.message}`);
      } else {
        result.count++;
      }
    }
  } catch (err) {
    result.errors.push(`Exception in processExpiringContracts: ${err.message}`);
  }

  return result;
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔔 Starting proactive notifications processing...');

    const results: NotificationResult[] = [];

    // Run all processors in parallel
    const [invoiceResult, walletResult, orderResult, contractResult] = await Promise.all([
      processInvoiceReminders(),
      processLowWalletAlerts(),
      processDelayedOrders(),
      processExpiringContracts(),
    ]);

    results.push(invoiceResult, walletResult, orderResult, contractResult);

    const totalCreated = results.reduce((sum, r) => sum + r.count, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);

    console.log(`✅ Processed ${totalCreated} notifications with ${totalErrors} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          total_notifications_created: totalCreated,
          total_errors: totalErrors,
        },
        details: results,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Error in proactive notifications:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
