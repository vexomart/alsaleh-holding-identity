import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TapPaymentRequest {
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
    const tapSecretKey = Deno.env.get("TAP_SECRET_KEY");
    if (!tapSecretKey) {
      throw new Error("TAP_SECRET_KEY not configured");
    }

    // Create Supabase client for database operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const requestData: TapPaymentRequest = await req.json();
    
    console.log("Creating Tap payment for:", requestData);

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

    // Create charge with Tap
    const tapPayload = {
      amount: requestData.amount,
      currency: requestData.currency,
      threeDSecure: true,
      save_card: false,
      description: requestData.description,
      statement_descriptor: "DIGITAL-" + requestData.offer_title.substring(0, 15),
      metadata: {
        offer_title: requestData.offer_title,
        customer_name: requestData.customer_name,
        customer_email: requestData.customer_email,
      },
      reference: {
        transaction: "txn_" + Date.now(),
        order: "ord_" + Date.now(),
      },
      receipt: {
        email: true,
        sms: true
      },
      customer: {
        first_name: requestData.customer_name.split(' ')[0] || requestData.customer_name,
        last_name: requestData.customer_name.split(' ').slice(1).join(' ') || '',
        email: requestData.customer_email,
        phone: {
          country_code: "966",
          number: requestData.customer_phone?.replace(/[^\d]/g, '') || "500000000"
        }
      },
      source: {
        id: "src_all"
      },
      post: {
        url: `${req.headers.get("origin")}/payment-success`
      },
      redirect: {
        url: `${req.headers.get("origin")}/payment-success`
      }
    };

    console.log("Sending request to Tap API...");

    const tapResponse = await fetch("https://api.tap.company/v2/charges", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tapSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tapPayload),
    });

    const tapResult = await tapResponse.json();
    
    console.log("Tap API response:", tapResult);

    if (!tapResponse.ok) {
      console.error("Tap API error:", tapResult);
      throw new Error(tapResult.message || "Failed to create payment");
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
        tap_charge_id: tapResult.id,
        status: tapResult.status,
        payment_method: tapResult.source?.payment_method || 'card',
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
        charge_id: tapResult.id,
        payment_url: tapResult.transaction?.url,
        transaction_id: transaction.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error in tap-payment function:", error);
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