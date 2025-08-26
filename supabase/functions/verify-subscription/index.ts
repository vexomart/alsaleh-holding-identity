import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Get environment variables
    const paylinkApiKey = Deno.env.get("PAYLINK_API_KEY");
    
    if (!paylinkApiKey) {
      throw new Error("Paylink API key not found");
    }

    // Initialize Supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Parse request body
    const { subscription_id, transaction_id } = await req.json();
    
    if (!subscription_id && !transaction_id) {
      throw new Error("Subscription ID or Transaction ID is required");
    }

    logStep("Request parsed", { subscription_id, transaction_id });

    // Get subscription details
    let subscription;
    if (subscription_id) {
      const { data, error } = await supabaseClient
        .from('subscriptions')
        .select('*')
        .eq('id', subscription_id)
        .single();
      
      if (error) throw new Error(`Subscription not found: ${error.message}`);
      subscription = data;
    } else {
      const { data, error } = await supabaseClient
        .from('subscriptions')
        .select('*')
        .eq('paylink_transaction_id', transaction_id)
        .single();
      
      if (error) throw new Error(`Subscription not found: ${error.message}`);
      subscription = data;
    }

    logStep("Subscription found", { subscriptionId: subscription.id, status: subscription.status });

    // If already active, return success
    if (subscription.status === 'active' && subscription.payment_status === 'paid') {
      logStep("Subscription already active");
      return new Response(JSON.stringify({
        success: true,
        status: 'active',
        message: 'الاشتراك نشط بالفعل'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Verify payment with Paylink
    const transactionId = subscription.paylink_transaction_id;
    if (!transactionId) {
      throw new Error("No transaction ID found for this subscription");
    }

    logStep("Verifying payment with Paylink", { transactionId });

    const paylinkResponse = await fetch(`https://restapi.paylink.sa/api/getInvoice/${transactionId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${paylinkApiKey}`,
        "Accept": "application/json"
      }
    });

    const paylinkData = await paylinkResponse.json();
    logStep("Paylink verification response", { 
      success: paylinkData.success, 
      orderStatus: paylinkData.orderStatus 
    });

    if (!paylinkData.success) {
      throw new Error(`Paylink verification failed: ${paylinkData.error || 'Unknown error'}`);
    }

    // Check if payment is completed
    const isPaymentCompleted = paylinkData.orderStatus === 'Paid';
    
    if (isPaymentCompleted) {
      // Update subscription to active
      const { error: updateError } = await supabaseClient
        .from('subscriptions')
        .update({
          status: 'active',
          payment_status: 'paid'
        })
        .eq('id', subscription.id);

      if (updateError) {
        throw new Error(`Failed to update subscription: ${updateError.message}`);
      }

      logStep("Subscription activated successfully");

      return new Response(JSON.stringify({
        success: true,
        status: 'active',
        message: 'تم تفعيل الاشتراك بنجاح',
        subscription: {
          id: subscription.id,
          status: 'active',
          current_period_end: subscription.current_period_end
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      // Payment still pending or failed
      const status = paylinkData.orderStatus === 'Pending' ? 'pending' : 'failed';
      
      if (status === 'failed') {
        await supabaseClient
          .from('subscriptions')
          .update({
            status: 'cancelled',
            payment_status: 'failed'
          })
          .eq('id', subscription.id);
      }

      logStep("Payment not completed", { orderStatus: paylinkData.orderStatus, status });

      return new Response(JSON.stringify({
        success: false,
        status: status,
        message: status === 'pending' ? 'الدفع قيد المعالجة' : 'فشل في الدفع',
        payment_status: paylinkData.orderStatus
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in verify-subscription", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});