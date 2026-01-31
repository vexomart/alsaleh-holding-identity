/**
 * Paylink Verify Payment Edge Function
 * Verifies payment status server-side (do NOT trust client redirect)
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PAYLINK_API_URL = 'https://restapi.paylink.sa';

interface VerifyPaymentRequest {
  transaction_no?: string;
  invoice_id?: string;
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

    const body: VerifyPaymentRequest = await req.json();
    const { transaction_no, invoice_id } = body;

    let transactionNo = transaction_no;

    // If invoice_id provided, get transaction_no from database
    if (!transactionNo && invoice_id) {
      const { data: invoice } = await supabase
        .from('invoices')
        .select('provider_invoice_id')
        .eq('id', invoice_id)
        .single();

      if (invoice?.provider_invoice_id) {
        transactionNo = invoice.provider_invoice_id;
      }
    }

    if (!transactionNo) {
      throw new Error('transaction_no or invoice_id is required');
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

    // Get invoice status from Paylink
    const statusResponse = await fetch(`${PAYLINK_API_URL}/api/getInvoice/${transactionNo}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
    });

    if (!statusResponse.ok) {
      const errorText = await statusResponse.text();
      console.error('Paylink status error:', errorText);
      throw new Error(`Failed to get payment status: ${statusResponse.status}`);
    }

    const paylinkInvoice = await statusResponse.json();
    console.log('Paylink invoice status:', JSON.stringify(paylinkInvoice));

    // Map Paylink status
    const orderStatus = paylinkInvoice.orderStatus?.toLowerCase() || 'unknown';
    let paymentStatus: 'pending' | 'succeeded' | 'failed' | 'cancelled';
    
    switch (orderStatus) {
      case 'paid':
      case 'completed':
        paymentStatus = 'succeeded';
        break;
      case 'cancelled':
      case 'canceled':
        paymentStatus = 'cancelled';
        break;
      case 'failed':
      case 'declined':
        paymentStatus = 'failed';
        break;
      default:
        paymentStatus = 'pending';
    }

    // Update our records if payment succeeded
    if (paymentStatus === 'succeeded') {
      // Find and update transaction
      const { data: transaction } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('provider_reference', transactionNo)
        .single();

      if (transaction && transaction.status !== 'succeeded') {
        // Update transaction
        await supabase
          .from('financial_transactions')
          .update({
            status: 'succeeded',
            processed_at: new Date().toISOString(),
            provider_response: paylinkInvoice,
            updated_at: new Date().toISOString(),
          })
          .eq('id', transaction.id);

        // Update invoice
        if (transaction.related_invoice_id) {
          await supabase
            .from('invoices')
            .update({
              status: 'paid',
              paid_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', transaction.related_invoice_id);
        }

        // Update order
        if (transaction.related_order_id) {
          await supabase
            .from('orders')
            .update({
              status: 'processing',
              updated_at: new Date().toISOString(),
            })
            .eq('id', transaction.related_order_id)
            .eq('status', 'pending');
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        transaction_no: transactionNo,
        status: paymentStatus,
        paylink_status: orderStatus,
        amount: paylinkInvoice.amount?.total,
        currency: paylinkInvoice.amount?.currency || 'SAR',
        paid_at: paymentStatus === 'succeeded' ? paylinkInvoice.paymentDate : null,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in paylink-verify-payment:', error);
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
