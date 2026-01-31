/**
 * Paylink Create Invoice Edge Function
 * Creates a Paylink invoice for customer payment
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PAYLINK_API_URL = 'https://restapi.paylink.sa';

interface CreateInvoiceRequest {
  invoice_id: string;
  callback_url?: string;
}

interface PaylinkInvoiceProduct {
  title: string;
  price: number;
  qty: number;
  description?: string;
  isDigital?: boolean;
  imageSrc?: string;
  specificVat?: number;
  productCost?: number;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: corsHeaders }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify user
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: corsHeaders }
      );
    }

    const body: CreateInvoiceRequest = await req.json();
    const { invoice_id, callback_url } = body;

    if (!invoice_id) {
      throw new Error('invoice_id is required');
    }

    // Get invoice details
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select(`
        *,
        orders (
          id,
          title,
          title_ar,
          service_id,
          services (
            name,
            name_ar
          )
        ),
        profiles:customer_id (
          full_name,
          email,
          phone
        )
      `)
      .eq('id', invoice_id)
      .single();

    if (invoiceError || !invoice) {
      throw new Error('Invoice not found');
    }

    // Check if invoice already has a payment URL
    if (invoice.payment_url && invoice.status !== 'cancelled') {
      return new Response(
        JSON.stringify({
          success: true,
          payment_url: invoice.payment_url,
          provider_invoice_id: invoice.provider_invoice_id,
          message: 'Payment URL already exists',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Get Paylink auth token
    const vendorId = Deno.env.get('PAYLINK_VENDOR_ID');
    const vendorSecret = Deno.env.get('PAYLINK_VENDOR_SECRET');

    if (!vendorId || !vendorSecret) {
      throw new Error('Paylink credentials not configured');
    }

    // Authenticate with Paylink
    const authResponse = await fetch(`${PAYLINK_API_URL}/api/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        apiId: vendorId,
        secretKey: vendorSecret,
        persistToken: false,
      }),
    });

    if (!authResponse.ok) {
      throw new Error('Paylink authentication failed');
    }

    const authData = await authResponse.json();
    const idToken = authData.id_token;

    // Prepare invoice products
    const serviceName = invoice.orders?.services?.name || invoice.orders?.title || 'Service';
    const serviceNameAr = invoice.orders?.services?.name_ar || invoice.orders?.title_ar || 'خدمة';
    
    const products: PaylinkInvoiceProduct[] = [{
      title: serviceName,
      price: Number(invoice.subtotal),
      qty: 1,
      description: serviceNameAr,
      isDigital: true,
    }];

    // Generate idempotency key
    const idempotencyKey = `paylink_${invoice_id}_${Date.now()}`;

    // Build callback URL
    const baseUrl = Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.supabase.co') || '';
    const defaultCallback = callback_url || `${baseUrl.replace('/rest/v1', '')}/app/orders/${invoice.order_id}`;

    // Create Paylink invoice
    const paylinkPayload = {
      amount: Number(invoice.total),
      callBackUrl: defaultCallback,
      cancelUrl: `${defaultCallback}?payment=cancelled`,
      clientEmail: invoice.profiles?.email || '',
      clientMobile: invoice.profiles?.phone || '',
      clientName: invoice.profiles?.full_name || 'Customer',
      currency: invoice.currency || 'SAR',
      note: `Invoice ${invoice.invoice_number}`,
      orderNumber: invoice.invoice_number,
      products: products,
      smsMessage: `فاتورة رقم ${invoice.invoice_number} - المبلغ ${invoice.total} ${invoice.currency}`,
      supportedCardBrands: ['mada', 'visaMastercard', 'amex', 'tabby', 'tamara', 'stcpay', 'urpay'],
      displayPending: true,
    };

    console.log('Creating Paylink invoice:', JSON.stringify(paylinkPayload));

    const invoiceResponse = await fetch(`${PAYLINK_API_URL}/api/addInvoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify(paylinkPayload),
    });

    if (!invoiceResponse.ok) {
      const errorText = await invoiceResponse.text();
      console.error('Paylink invoice error:', errorText);
      throw new Error(`Failed to create Paylink invoice: ${invoiceResponse.status}`);
    }

    const paylinkInvoice = await invoiceResponse.json();
    console.log('Paylink invoice created:', JSON.stringify(paylinkInvoice));

    // Update invoice with Paylink details
    const { error: updateError } = await supabase
      .from('invoices')
      .update({
        payment_url: paylinkInvoice.url,
        provider: 'paylink',
        provider_invoice_id: paylinkInvoice.transactionNo,
        updated_at: new Date().toISOString(),
      })
      .eq('id', invoice_id);

    if (updateError) {
      console.error('Error updating invoice:', updateError);
    }

    // Create financial transaction record
    const { error: txnError } = await supabase
      .from('financial_transactions')
      .insert({
        customer_user_id: invoice.customer_id,
        transaction_type: 'invoice_payment',
        amount: Number(invoice.total),
        currency: invoice.currency,
        status: 'pending',
        provider: 'paylink',
        provider_reference: paylinkInvoice.transactionNo,
        related_invoice_id: invoice_id,
        related_order_id: invoice.order_id,
        idempotency_key: idempotencyKey,
        description: `Payment for invoice ${invoice.invoice_number}`,
        description_ar: `دفع الفاتورة رقم ${invoice.invoice_number}`,
        metadata: {
          paylink_invoice: paylinkInvoice,
        },
      });

    if (txnError) {
      console.error('Error creating transaction:', txnError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment_url: paylinkInvoice.url,
        provider_invoice_id: paylinkInvoice.transactionNo,
        transaction_no: paylinkInvoice.transactionNo,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in paylink-create-invoice:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
