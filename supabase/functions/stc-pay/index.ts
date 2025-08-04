import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface STCPaymentRequest {
  amount: number;
  currency: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  offer_title: string;
  description: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client for database operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const requestData: STCPaymentRequest = await req.json();
    
    console.log("Creating STC Pay payment for:", requestData);

    // Get user if authenticated
    let userId = null;
    try {
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const { data } = await supabaseClient.auth.getUser(token);
        userId = data.user?.id || null;
      }
    } catch (error) {
      console.log("No authenticated user, proceeding as guest");
    }

    // STC Pay merchant number (provided by user)
    const stcPayMerchantNumber = "0502463367";
    
    // Generate unique reference
    const paymentReference = "STC" + Date.now();

    // Store transaction in database with pending status
    const { data: transaction, error: dbError } = await supabaseClient
      .from("payment_transactions")
      .insert({
        user_id: userId,
        offer_title: requestData.offer_title,
        amount: requestData.amount,
        currency: requestData.currency,
        customer_name: requestData.customer_name,
        customer_email: requestData.customer_email,
        customer_phone: requestData.customer_phone,
        stc_pay_reference: paymentReference,
        status: "PENDING_STC_PAY",
        payment_method: "stc_pay",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to record transaction");
    }

    console.log("STC Pay transaction recorded:", transaction);

    // Return STC Pay details for manual payment
    return new Response(
      JSON.stringify({
        success: true,
        payment_type: "stc_pay",
        merchant_number: stcPayMerchantNumber,
        amount: requestData.amount,
        currency: requestData.currency,
        reference: paymentReference,
        transaction_id: transaction.id,
        instructions: {
          ar: `لإتمام الدفع، افتح تطبيق STC Pay وأرسل ${requestData.amount} ${requestData.currency} إلى الرقم: ${stcPayMerchantNumber}`,
          en: `To complete payment, open STC Pay app and send ${requestData.amount} ${requestData.currency} to: ${stcPayMerchantNumber}`
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error in stc-pay function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});