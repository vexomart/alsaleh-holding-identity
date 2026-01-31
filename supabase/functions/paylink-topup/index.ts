/**
 * Paylink Wallet Top-up Edge Function
 * Creates a Paylink payment link for wallet top-up
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PAYLINK_API_URL = 'https://restapi.paylink.sa';

interface TopupRequest {
  amount: number;
  callback_url?: string;
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

    const userId = userData.user.id;
    const body: TopupRequest = await req.json();
    const { amount, callback_url } = body;

    // Validate amount
    if (!amount || amount < 10 || amount > 50000) {
      throw new Error('Amount must be between 10 and 50,000 SAR');
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email, phone, tenant_id, customer_uid')
      .eq('id', userId)
      .single();

    // Get or create wallet
    let { data: wallet } = await supabase
      .from('customer_wallets')
      .select('id, wallet_number')
      .eq('customer_user_id', userId)
      .maybeSingle();

    if (!wallet) {
      const { data: newWallet, error: walletError } = await supabase
        .from('customer_wallets')
        .insert({
          customer_user_id: userId,
          tenant_id: profile?.tenant_id || null,
          balance: 0,
          currency: 'SAR',
          status: 'active',
        })
        .select()
        .single();

      if (walletError) {
        throw new Error('Failed to create wallet');
      }
      wallet = newWallet;
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

    // Generate unique order number for top-up
    const topupOrderNumber = `TOP-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Generate idempotency key
    const idempotencyKey = `topup_${userId}_${Date.now()}`;

    // Build callback URL
    const defaultCallback = callback_url || `${supabaseUrl.replace('/rest/v1', '')}/app/wallet?topup=success`;

    // Create Paylink invoice for top-up
    const paylinkPayload = {
      amount: amount,
      callBackUrl: defaultCallback,
      cancelUrl: `${defaultCallback.split('?')[0]}?topup=cancelled`,
      clientEmail: profile?.email || '',
      clientMobile: profile?.phone || '',
      clientName: profile?.full_name || 'Customer',
      currency: 'SAR',
      note: `Wallet Top-up - ${profile?.customer_uid || userId}`,
      orderNumber: topupOrderNumber,
      products: [{
        title: 'Wallet Top-up',
        price: amount,
        qty: 1,
        description: 'شحن رصيد المحفظة',
        isDigital: true,
      }],
      smsMessage: `شحن رصيد المحفظة بمبلغ ${amount} ر.س`,
      supportedCardBrands: ['mada', 'visaMastercard', 'amex', 'stcpay', 'urpay'],
      displayPending: true,
    };

    console.log('Creating Paylink top-up:', JSON.stringify(paylinkPayload));

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
      console.error('Paylink top-up error:', errorText);
      throw new Error(`Failed to create Paylink payment: ${invoiceResponse.status}`);
    }

    const paylinkInvoice = await invoiceResponse.json();
    console.log('Paylink top-up created:', JSON.stringify(paylinkInvoice));

    // Create financial transaction record for top-up
    const { data: txnData, error: txnError } = await supabase
      .from('financial_transactions')
      .insert({
        customer_user_id: userId,
        wallet_id: wallet.id,
        transaction_type: 'topup',
        amount: amount,
        currency: 'SAR',
        status: 'pending',
        provider: 'paylink',
        provider_reference: paylinkInvoice.transactionNo,
        idempotency_key: idempotencyKey,
        description: `Wallet top-up - ${topupOrderNumber}`,
        description_ar: `شحن رصيد المحفظة - ${topupOrderNumber}`,
        tenant_id: profile?.tenant_id || null,
        metadata: {
          topup_order_number: topupOrderNumber,
          paylink_invoice: paylinkInvoice,
        },
      })
      .select()
      .single();

    if (txnError) {
      console.error('Error creating transaction:', txnError);
    }

    // Log transaction events for timeline
    if (txnData) {
      // Log 'created' event
      await supabase.rpc('log_transaction_event', {
        p_transaction_id: txnData.id,
        p_event_type: 'created',
        p_previous_status: null,
        p_new_status: 'pending',
        p_metadata: {
          amount: amount,
          currency: 'SAR',
          transaction_type: 'topup',
          wallet_id: wallet.id,
        },
        p_provider_payload: null,
        p_performed_by: userId,
      });

      // Log 'paylink_invoice_created' event
      await supabase.rpc('log_transaction_event', {
        p_transaction_id: txnData.id,
        p_event_type: 'paylink_invoice_created',
        p_previous_status: 'pending',
        p_new_status: 'pending',
        p_metadata: {
          paylink_transaction_no: paylinkInvoice.transactionNo,
          payment_url: paylinkInvoice.url,
          order_number: topupOrderNumber,
        },
        p_provider_payload: {
          transactionNo: paylinkInvoice.transactionNo,
          url: paylinkInvoice.url,
        },
        p_performed_by: null,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment_url: paylinkInvoice.url,
        transaction_no: paylinkInvoice.transactionNo,
        order_number: topupOrderNumber,
        amount: amount,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in paylink-topup:', error);
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
