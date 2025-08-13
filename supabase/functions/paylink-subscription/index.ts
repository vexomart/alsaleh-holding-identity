import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  plan_id: string;
  return_url?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PAYLINK-SUBSCRIPTION] ${step}${detailsStr}`);
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
    const paylinkApiId = Deno.env.get("PAYLINK_API_ID");
    
    if (!paylinkApiKey || !paylinkApiId) {
      throw new Error("Paylink API credentials not found");
    }
    logStep("Paylink credentials verified");

    // Initialize Supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Parse request body first
    const { plan_id, return_url, customer_name, customer_email, customer_phone }: PaymentRequest = await req.json();
    if (!plan_id) {
      throw new Error("Plan ID is required");
    }
    
    if (!customer_email) {
      throw new Error("Customer email is required");
    }
    logStep("Request parsed", { plan_id, return_url, customer_email, customer_name });

    // Authenticate user (optional for guest checkout)
    let user = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
      if (userData?.user?.email) {
        user = userData.user;
        logStep("User authenticated", { userId: user.id, email: user.email });
      }
    }

    // Get subscription plan details
    const { data: plan, error: planError } = await supabaseClient
      .from('subscription_plans')
      .select('*')
      .eq('id', plan_id)
      .eq('is_active', true)
      .single();

    if (planError || !plan) {
      throw new Error("Invalid or inactive subscription plan");
    }
    logStep("Plan found", { planName: plan.name_ar, price: plan.price });

    // Check if user already has an active subscription (only for authenticated users)
    if (user) {
      const { data: existingSubscription, error: subError } = await supabaseClient
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())
        .maybeSingle();

      if (subError) {
        logStep("Error checking existing subscription", { error: subError.message });
      }

      if (existingSubscription) {
        logStep("User already has active subscription");
        return new Response(JSON.stringify({ 
          error: "لديك اشتراك نشط بالفعل",
          existing_subscription: existingSubscription 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
    }

    // Get client name (from request or user profile)
    let clientName = customer_name || 'عميل';
    if (user) {
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single();
      
      clientName = profile?.full_name || customer_name || user.email || 'عميل';
    }

    // Create subscription record with pending status
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1); // 1 month subscription

    const { data: subscription, error: createSubError } = await supabaseClient
      .from('subscriptions')
      .insert({
        user_id: user?.id || null,
        plan_id: plan.id,
        status: 'pending',
        current_period_start: new Date().toISOString(),
        current_period_end: subscriptionEndDate.toISOString(),
        payment_status: 'pending'
      })
      .select()
      .single();

    if (createSubError) {
      throw new Error(`Failed to create subscription: ${createSubError.message}`);
    }
    logStep("Subscription created", { subscriptionId: subscription.id });

    // Prepare Paylink payment request
    const baseUrl = req.headers.get("origin") || "https://c76d2028-73e1-45b9-a970-979a33912db9.lovableproject.com";
    const successUrl = return_url || `${baseUrl}/payment-success?subscription_id=${subscription.id}`;
    const cancelUrl = `${baseUrl}/pricing?cancelled=true`;

    const paylinkPayload = {
      amount: plan.price,
      callBackUrl: successUrl,
      cancelUrl: cancelUrl,
      clientEmail: customer_email,
      clientMobile: customer_phone || "966500000000",
      clientName: clientName,
      note: `اشتراك ${plan.name_ar} - ${plan.description_ar}`,
      orderNumber: subscription.id,
      products: [
        {
          name: plan.name_ar,
          description: plan.description_ar,
          price: plan.price,
          qty: 1,
          imageSrc: ""
        }
      ]
    };

    logStep("Paylink payload prepared", { amount: plan.price, orderNumber: subscription.id });

    // Create Paylink payment
    const paylinkResponse = await fetch("https://restapi.paylink.sa/api/addInvoice", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${paylinkApiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(paylinkPayload)
    });

    const paylinkData = await paylinkResponse.json();
    logStep("Paylink response received", { success: paylinkData.success, transactionNo: paylinkData.transactionNo });

    if (!paylinkData.success) {
      throw new Error(`Paylink error: ${paylinkData.error || 'Unknown error'}`);
    }

    // Update subscription with Paylink transaction ID
    await supabaseClient
      .from('subscriptions')
      .update({ 
        paylink_transaction_id: paylinkData.transactionNo.toString()
      })
      .eq('id', subscription.id);

    logStep("Subscription updated with transaction ID");

    return new Response(JSON.stringify({
      success: true,
      payment_url: paylinkData.url,
      transaction_id: paylinkData.transactionNo,
      subscription_id: subscription.id,
      amount: plan.price,
      currency: plan.currency
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in paylink-subscription", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});