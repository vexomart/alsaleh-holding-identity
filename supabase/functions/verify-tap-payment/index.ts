import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🔍 Payment Verification Started');
  console.log('📋 Request method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const chargeId = url.searchParams.get('charge_id');
    const transactionRef = url.searchParams.get('tap_id');
    
    console.log('📋 Verification params:', { chargeId, transactionRef });

    if (!chargeId && !transactionRef) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing charge_id or tap_id parameter' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get TAP API credentials
    const tapApiKey = Deno.env.get('TAP_SECRET_KEY');
    if (!tapApiKey) {
      console.error('❌ TAP API key not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Payment service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify payment with TAP API
    const tapApiUrl = `https://api.tap.company/v2/charges/${chargeId || transactionRef}`;
    console.log('📤 Verifying payment with TAP API:', tapApiUrl);

    const tapResponse = await fetch(tapApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tapApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const tapData = await tapResponse.json();
    console.log('📥 TAP API Response:', JSON.stringify(tapData, null, 2));

    if (!tapResponse.ok) {
      console.error('❌ TAP API error:', tapData);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Payment verification failed',
          details: tapData 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Extract payment information
    const paymentStatus = tapData.status; // CAPTURED, INITIATED, FAILED, etc.
    const paymentAmount = tapData.amount;
    const paymentCurrency = tapData.currency;
    const transactionReference = tapData.reference?.transaction;
    const customerEmail = tapData.customer?.email;

    console.log('💳 Payment Details:', {
      status: paymentStatus,
      amount: paymentAmount,
      currency: paymentCurrency,
      reference: transactionReference,
      customer: customerEmail
    });

    // Update payment transaction in database
    if (transactionReference) {
      const { data: updateData, error: updateError } = await supabase
        .from('payment_transactions')
        .update({
          status: paymentStatus === 'CAPTURED' ? 'COMPLETED' : 
                 paymentStatus === 'FAILED' ? 'FAILED' : 'PENDING',
          payment_date: paymentStatus === 'CAPTURED' ? new Date().toISOString() : null,
          metadata: {
            tap_charge_id: tapData.id,
            tap_status: paymentStatus,
            tap_response: tapData,
            verification_timestamp: new Date().toISOString()
          },
          updated_at: new Date().toISOString()
        })
        .eq('transaction_id', transactionReference);

      if (updateError) {
        console.error('❌ Database update error:', updateError);
      } else {
        console.log('✅ Payment transaction updated successfully');
      }
    }

    // Return verification result
    const isPaymentSuccessful = paymentStatus === 'CAPTURED';
    
    if (isPaymentSuccessful) {
      console.log('✅ Payment verification successful');
      
      // Redirect to success page with payment details
      const successUrl = new URL('https://alialshehriholding.com/payment-success');
      successUrl.searchParams.set('status', 'success');
      successUrl.searchParams.set('amount', paymentAmount.toString());
      successUrl.searchParams.set('currency', paymentCurrency);
      successUrl.searchParams.set('reference', transactionReference || '');
      
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': successUrl.toString()
        }
      });
    } else {
      console.log('❌ Payment verification failed');
      
      // Redirect to cancel page with error details  
      const cancelUrl = new URL('https://alialshehriholding.com/payment-cancel');
      cancelUrl.searchParams.set('status', 'failed');
      cancelUrl.searchParams.set('error', paymentStatus);
      cancelUrl.searchParams.set('reference', transactionReference || '');
      
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': cancelUrl.toString()
        }
      });
    }

  } catch (error) {
    console.error('💥 Verification error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Payment verification failed',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});