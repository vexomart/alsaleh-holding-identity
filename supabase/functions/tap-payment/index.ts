import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TapPaymentRequest {
  amount: number;
  currency: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  description: string;
  product_details?: {
    name: string;
    description: string;
    category: string;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Tap payment request started');
    
    // Get environment variables
    const tapApiKey = Deno.env.get('TAP_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!tapApiKey) {
      console.error('TAP_API_KEY not configured');
      throw new Error('TAP API key not configured');
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request
    const paymentData: TapPaymentRequest = await req.json();
    console.log('Payment data received:', { 
      amount: paymentData.amount, 
      currency: paymentData.currency,
      customer_email: paymentData.customer_email 
    });

    // Validate required fields
    if (!paymentData.amount || !paymentData.currency || !paymentData.customer_name || !paymentData.customer_email) {
      throw new Error('Missing required payment fields');
    }

    // Validate amount
    if (paymentData.amount < 1) {
      throw new Error('Amount must be at least 1 SAR');
    }

    // Get user ID from Authorization header if present
    let userId = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user } } = await supabase.auth.getUser(token);
        userId = user?.id || null;
      } catch (error) {
        console.log('Could not extract user from token:', error);
      }
    }

    // Create unique transaction ID
    const transactionId = `tap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Prepare Tap payment payload
    const tapPayload = {
      amount: paymentData.amount,
      currency: paymentData.currency,
      threeDSecure: true,
      save_card: false,
      description: paymentData.description,
      statement_descriptor: "TASAHEEL PAYMENT",
      metadata: {
        transaction_id: transactionId,
        customer_name: paymentData.customer_name
      },
      reference: {
        transaction: transactionId,
        order: `ORD_${Date.now()}`
      },
      receipt: {
        email: true,
        sms: true
      },
      customer: {
        first_name: paymentData.customer_name.split(' ')[0] || '',
        last_name: paymentData.customer_name.split(' ').slice(1).join(' ') || '',
        email: paymentData.customer_email,
        phone: {
          country_code: paymentData.customer_phone?.startsWith('+') ? 
            paymentData.customer_phone.substring(0, 4) : "+966",
          number: paymentData.customer_phone?.replace(/[^\d]/g, '') || ""
        }
      },
      source: {
        id: "src_card"
      },
      post: {
        url: `${supabaseUrl}/functions/v1/verify-payment-status`
      },
      redirect: {
        url: `${new URL(req.url).origin}/payment-success`
      }
    };

    console.log('Sending request to Tap API...');

    // Make request to Tap API
    const tapResponse = await fetch('https://api.tap.company/v2/charges', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tapApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tapPayload),
    });

    const tapResult = await tapResponse.json();
    console.log('Tap API response status:', tapResponse.status);

    if (!tapResponse.ok) {
      console.error('Tap API error:', tapResult);
      throw new Error(`Tap API error: ${tapResult.description || 'Unknown error'}`);
    }

    console.log('Tap payment created successfully:', tapResult.id);

    // Save transaction to database
    const { error: dbError } = await supabase
      .from('payment_transactions')
      .insert({
        transaction_id: transactionId,
        user_id: userId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        customer_name: paymentData.customer_name,
        customer_email: paymentData.customer_email,
        customer_phone: paymentData.customer_phone,
        description: paymentData.description,
        payment_method: 'TAP',
        status: 'PENDING_TAP',
        metadata: {
          tap_charge_id: tapResult.id,
          tap_reference: tapResult.reference?.transaction,
          product_details: paymentData.product_details
        }
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save transaction');
    }

    // Create product order if product details provided
    if (paymentData.product_details && userId) {
      const { error: orderError } = await supabase
        .from('product_orders')
        .insert({
          user_id: userId,
          product_name: paymentData.product_details.name,
          product_description: paymentData.product_details.description,
          product_category: paymentData.product_details.category,
          quantity: 1,
          unit_price: paymentData.amount,
          total_price: paymentData.amount,
          currency: paymentData.currency,
          payment_method: 'TAP',
          payment_status: 'pending',
          order_status: 'pending',
          customer_name: paymentData.customer_name,
          customer_email: paymentData.customer_email,
          customer_phone: paymentData.customer_phone,
          transaction_reference: transactionId
        });

      if (orderError) {
        console.error('Product order creation error:', orderError);
      }
    }

    console.log('Transaction saved successfully');

    return new Response(
      JSON.stringify({
        success: true,
        tap_charge_id: tapResult.id,
        payment_url: tapResult.transaction?.url,
        transaction_id: transactionId,
        status: tapResult.status
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Tap payment error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});