import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PayLinkPaymentRequest {
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
    const paylinkApiKey = Deno.env.get("PAYLINK_API_KEY");
    if (!paylinkApiKey) {
      throw new Error("PAYLINK_API_KEY not configured");
    }

    // Create Supabase client for database operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const requestData: PayLinkPaymentRequest = await req.json();
    
    console.log("Creating Paylink payment for:", requestData);

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

    // Create invoice with Paylink
    const paylinkPayload = {
      amount: requestData.amount,
      clientMobile: requestData.customer_phone?.replace(/[^\d]/g, '') || "966500000000",
      clientName: requestData.customer_name,
      note: requestData.description,
      callBackUrl: `${req.headers.get("origin")}/payment-success`,
      clientEmail: requestData.customer_email,
      currency: requestData.currency,
      displayCurrencyIso: requestData.currency,
    };

    console.log("Sending request to Paylink API...");

    const paylinkResponse = await fetch("https://restapi.paylink.sa/api/addInvoice", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${paylinkApiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(paylinkPayload),
    });

    const paylinkResult = await paylinkResponse.json();
    
    console.log("Paylink API response:", paylinkResult);

    if (!paylinkResponse.ok || !paylinkResult.success) {
      console.error("Paylink API error:", paylinkResult);
      throw new Error(paylinkResult.detail || "Failed to create payment");
    }

    // Store transaction in database
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
        paylink_transaction_no: paylinkResult.transactionNo,
        status: "INITIATED",
        payment_method: "paylink",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to record transaction");
    }

    console.log("Transaction recorded:", transaction);

    return new Response(
      JSON.stringify({
        success: true,
        transaction_no: paylinkResult.transactionNo,
        payment_url: paylinkResult.url,
        transaction_id: transaction.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error in paylink-payment function:", error);
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