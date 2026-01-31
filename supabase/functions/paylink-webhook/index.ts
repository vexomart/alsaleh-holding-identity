/**
 * Paylink Webhook Handler
 * Handles payment status updates from Paylink
 * Supports both v1 and v2 webhook formats
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paylink-signature',
};

// Ledger account codes
const LEDGER_ACCOUNTS = {
  CASH_BANK: '1000',        // Cash and Banks (asset)
  SERVICE_REVENUE: '4000',  // Service Revenue (revenue)
  VAT_PAYABLE: '2100',      // VAT Payable (liability)
};

interface PaylinkWebhookPayload {
  // V1 fields
  transactionNo?: string;
  orderStatus?: string;
  amount?: {
    total: number;
    subtotal: number;
    tax: number;
    currency: string;
  };
  // V2 fields
  gatewayOrderRequest?: {
    transactionNo: string;
    orderStatus: string;
    amount: number;
    paymentMethod?: string;
  };
  // Common
  orderNumber?: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Get webhook signature for verification (if provided by Paylink)
    const signature = req.headers.get('x-paylink-signature');
    const webhookSecret = Deno.env.get('PAYLINK_WEBHOOK_SECRET');

    // TODO: Implement signature verification when Paylink provides documentation
    // For now, we rely on transaction verification via API

    const payload: PaylinkWebhookPayload = await req.json();
    console.log('Paylink webhook received:', JSON.stringify(payload));

    // Parse webhook data (support both v1 and v2)
    let transactionNo: string;
    let orderStatus: string;
    let totalAmount: number;
    let currency = 'SAR';

    if (payload.gatewayOrderRequest) {
      // V2 format
      transactionNo = payload.gatewayOrderRequest.transactionNo;
      orderStatus = payload.gatewayOrderRequest.orderStatus;
      totalAmount = payload.gatewayOrderRequest.amount;
    } else {
      // V1 format
      transactionNo = payload.transactionNo || '';
      orderStatus = payload.orderStatus || '';
      totalAmount = payload.amount?.total || 0;
      currency = payload.amount?.currency || 'SAR';
    }

    if (!transactionNo) {
      throw new Error('Missing transactionNo in webhook payload');
    }

    console.log(`Processing payment: ${transactionNo}, status: ${orderStatus}`);

    // Find the financial transaction by provider_reference
    const { data: transaction, error: txnError } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('provider_reference', transactionNo)
      .single();

    if (txnError || !transaction) {
      console.error('Transaction not found:', transactionNo);
      // Return 200 to prevent Paylink from retrying
      return new Response(
        JSON.stringify({ success: false, message: 'Transaction not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Idempotency check - don't process if already succeeded
    if (transaction.status === 'succeeded') {
      console.log('Transaction already processed:', transactionNo);
      return new Response(
        JSON.stringify({ success: true, message: 'Already processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Map Paylink status to our status
    let newStatus: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled';
    switch (orderStatus.toLowerCase()) {
      case 'paid':
      case 'completed':
        newStatus = 'succeeded';
        break;
      case 'pending':
        newStatus = 'processing';
        break;
      case 'cancelled':
      case 'canceled':
        newStatus = 'cancelled';
        break;
      case 'failed':
      case 'declined':
        newStatus = 'failed';
        break;
      default:
        newStatus = 'pending';
    }

    // Update transaction status
    const { error: updateTxnError } = await supabase
      .from('financial_transactions')
      .update({
        status: newStatus,
        processed_at: newStatus === 'succeeded' ? new Date().toISOString() : null,
        provider_response: payload,
        updated_at: new Date().toISOString(),
      })
      .eq('id', transaction.id);

    if (updateTxnError) {
      console.error('Error updating transaction:', updateTxnError);
    }

    // If payment succeeded, process the payment
    if (newStatus === 'succeeded') {
      // Update invoice status
      if (transaction.related_invoice_id) {
        const { error: invoiceError } = await supabase
          .from('invoices')
          .update({
            status: 'paid',
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', transaction.related_invoice_id);

        if (invoiceError) {
          console.error('Error updating invoice:', invoiceError);
        }

        // Get invoice details for journal entry and realtime events
        const { data: invoice } = await supabase
          .from('invoices')
          .select('*')
          .eq('id', transaction.related_invoice_id)
          .single();

        if (invoice) {
          // Create double-entry journal entry
          await createJournalEntry(supabase, {
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoice_number,
            subtotal: Number(invoice.subtotal),
            vatAmount: Number(invoice.vat_amount),
            total: Number(invoice.total),
            currency: invoice.currency,
            tenantId: invoice.tenant_id,
            customerId: invoice.customer_id,
            transactionNo,
          });

          // Emit invoice.paid realtime event
          await emitRealtimeEvent(supabase, 'invoice.paid', {
            invoice_id: invoice.id,
            invoice_number: invoice.invoice_number,
            order_id: invoice.order_id,
            customer_id: invoice.customer_id,
            status: 'paid',
            total: Number(invoice.total),
            currency: invoice.currency,
            pdf_url: invoice.pdf_url,
            paid_at: new Date().toISOString(),
          });
        }
      }

      // Update order status if needed
      if (transaction.related_order_id) {
        const { error: orderError } = await supabase
          .from('orders')
          .update({
            status: 'processing',
            updated_at: new Date().toISOString(),
          })
          .eq('id', transaction.related_order_id)
          .eq('status', 'pending'); // Only update if still pending

        if (orderError) {
          console.error('Error updating order:', orderError);
        }
      }

      // Create notification for customer
      if (transaction.customer_user_id) {
        await supabase.from('notifications').insert({
          user_id: transaction.customer_user_id,
          tenant_id: transaction.tenant_id,
          type: 'success',
          title: 'Payment Successful',
          title_ar: 'تم الدفع بنجاح',
          message: `Your payment of ${transaction.amount} ${transaction.currency} has been received.`,
          message_ar: `تم استلام دفعتك بمبلغ ${transaction.amount} ${transaction.currency}.`,
          link: `/app/orders/${transaction.related_order_id}`,
        });
      }
    }

    // If payment failed, emit event
    if (newStatus === 'failed' || newStatus === 'cancelled') {
      if (transaction.related_invoice_id) {
        const { data: invoice } = await supabase
          .from('invoices')
          .select('*')
          .eq('id', transaction.related_invoice_id)
          .single();

        if (invoice) {
          await emitRealtimeEvent(supabase, 'payment.failed', {
            invoice_id: invoice.id,
            invoice_number: invoice.invoice_number,
            order_id: invoice.order_id,
            customer_id: invoice.customer_id,
            status: newStatus,
            total: Number(invoice.total),
            currency: invoice.currency,
            error: orderStatus,
          });
        }
      }

      // Create notification for failed payment
      if (transaction.customer_user_id) {
        await supabase.from('notifications').insert({
          user_id: transaction.customer_user_id,
          tenant_id: transaction.tenant_id,
          type: 'error',
          title: newStatus === 'cancelled' ? 'Payment Cancelled' : 'Payment Failed',
          title_ar: newStatus === 'cancelled' ? 'تم إلغاء الدفع' : 'فشل الدفع',
          message: `Your payment could not be processed. Please try again.`,
          message_ar: `لم تتم معالجة الدفع. يرجى المحاولة مرة أخرى.`,
          link: `/app/orders/${transaction.related_order_id}`,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Webhook processed',
        status: newStatus,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in paylink-webhook:', error);
    // Return 200 to prevent infinite retries
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  }
});

async function createJournalEntry(
  supabase: ReturnType<typeof createClient>,
  params: {
    invoiceId: string;
    invoiceNumber: string;
    subtotal: number;
    vatAmount: number;
    total: number;
    currency: string;
    tenantId: string | null;
    customerId: string;
    transactionNo: string;
  }
) {
  try {
    // Get ledger account IDs
    const { data: accounts } = await supabase
      .from('ledger_accounts')
      .select('id, code')
      .in('code', [LEDGER_ACCOUNTS.CASH_BANK, LEDGER_ACCOUNTS.SERVICE_REVENUE, LEDGER_ACCOUNTS.VAT_PAYABLE]);

    if (!accounts || accounts.length < 3) {
      console.error('Required ledger accounts not found');
      return;
    }

    const accountMap = accounts.reduce((acc, a) => {
      acc[a.code] = a.id;
      return acc;
    }, {} as Record<string, string>);

    // Generate journal entry number
    const { data: entryNumber } = await supabase.rpc('generate_journal_entry_number', {
      p_tenant_id: params.tenantId,
    });

    // Create journal entry
    const { data: journalEntry, error: journalError } = await supabase
      .from('journal_entries')
      .insert({
        entry_number: entryNumber || `JE-${Date.now()}`,
        tenant_id: params.tenantId,
        reference_type: 'invoice_payment',
        reference_id: params.invoiceId,
        description: `Payment received for invoice ${params.invoiceNumber}`,
        description_ar: `استلام دفعة للفاتورة ${params.invoiceNumber}`,
        is_posted: false,
      })
      .select()
      .single();

    if (journalError || !journalEntry) {
      console.error('Error creating journal entry:', journalError);
      return;
    }

    // Create journal lines (double-entry)
    const journalLines = [
      // Debit: Cash/Bank (asset increases with debit)
      {
        entry_id: journalEntry.id,
        account_id: accountMap[LEDGER_ACCOUNTS.CASH_BANK],
        debit: params.total,
        credit: 0,
        currency: params.currency,
        description: `Payment received - ${params.transactionNo}`,
      },
      // Credit: Service Revenue (revenue increases with credit)
      {
        entry_id: journalEntry.id,
        account_id: accountMap[LEDGER_ACCOUNTS.SERVICE_REVENUE],
        debit: 0,
        credit: params.subtotal,
        currency: params.currency,
        description: `Service revenue - Invoice ${params.invoiceNumber}`,
      },
    ];

    // Add VAT line if applicable
    if (params.vatAmount > 0) {
      journalLines.push({
        entry_id: journalEntry.id,
        account_id: accountMap[LEDGER_ACCOUNTS.VAT_PAYABLE],
        debit: 0,
        credit: params.vatAmount,
        currency: params.currency,
        description: `VAT collected - Invoice ${params.invoiceNumber}`,
      });
    }

    const { error: linesError } = await supabase
      .from('journal_lines')
      .insert(journalLines);

    if (linesError) {
      console.error('Error creating journal lines:', linesError);
      return;
    }

    // Post the journal entry
    const { error: postError } = await supabase
      .from('journal_entries')
      .update({
        is_posted: true,
        posted_at: new Date().toISOString(),
      })
      .eq('id', journalEntry.id);

    if (postError) {
      console.error('Error posting journal entry:', postError);
    }

    // Update transaction with journal entry reference
    await supabase
      .from('financial_transactions')
      .update({ journal_entry_id: journalEntry.id })
      .eq('related_invoice_id', params.invoiceId)
      .eq('status', 'succeeded');

    console.log('Journal entry created:', journalEntry.entry_number);

  } catch (error) {
    console.error('Error in createJournalEntry:', error);
  }
}

/**
 * Emit realtime event to customer channels
 */
async function emitRealtimeEvent(
  supabase: ReturnType<typeof createClient>,
  event: 'invoice.paid' | 'payment.failed',
  payload: {
    invoice_id: string;
    invoice_number: string;
    order_id: string;
    customer_id: string;
    status: string;
    total: number;
    currency: string;
    pdf_url?: string | null;
    paid_at?: string;
    error?: string;
  }
) {
  try {
    const eventPayload = {
      event,
      ...payload,
      timestamp: new Date().toISOString(),
    };

    // Emit to customer-specific invoice channel
    const customerInvoiceChannel = supabase.channel(`user:${payload.customer_id}:invoices`);
    await customerInvoiceChannel.send({
      type: 'broadcast',
      event: event,
      payload: eventPayload,
    });

    // Emit to customer notification channel
    const customerNotificationChannel = supabase.channel(`user:${payload.customer_id}:notifications`);
    await customerNotificationChannel.send({
      type: 'broadcast',
      event: event,
      payload: eventPayload,
    });

    console.log(`Realtime event emitted: ${event} for customer ${payload.customer_id}`);
  } catch (error) {
    console.error('Error emitting realtime event:', error);
  }
}
