import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TamaraPaymentRequest {
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
    const tamaraApiKey = Deno.env.get("TAMARA_API_KEY");
    if (!tamaraApiKey) {
      throw new Error("TAMARA_API_KEY not configured");
    }

    // Create Supabase client for database operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const requestData: TamaraPaymentRequest = await req.json();
    
    console.log("Creating Tamara payment for:", requestData);

    // Validate phone number and avoid special numbers
    let phoneNumber = requestData.customer_phone?.replace(/[^\d]/g, '') || "";
    if (!phoneNumber || phoneNumber === "500000000" || phoneNumber === "511111111" || phoneNumber === "512345678") {
      phoneNumber = "544337866"; // Use Tamara's success test number
    }

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

    // Validate minimum amount (تمارا تتطلب حد أدنى)
    if (requestData.amount < 100) {
      throw new Error("المبلغ أقل من الحد الأدنى المطلوب لتمارا (100 ريال)");
    }

    // Create checkout session with Tamara
    const tamaraPayload = {
      order_reference_id: "ord_" + Date.now(),
      total_amount: {
        amount: requestData.amount,
        currency: requestData.currency,
      },
      description: requestData.description,
      country_code: "SA",
      payment_type: "PAY_BY_INSTALMENTS",
      instalments: 3,
      locale: "ar_SA",
      items: [
        {
          reference_id: "item_" + Date.now(),
          type: "Digital",
          name: requestData.offer_title,
          sku: "SERVICE-" + Date.now(),
          quantity: 1,
          unit_price: {
            amount: requestData.amount,
            currency: requestData.currency,
          },
          total_amount: {
            amount: requestData.amount,
            currency: requestData.currency,
          },
        },
      ],
      consumer: {
        first_name: requestData.customer_name.split(' ')[0] || requestData.customer_name,
        last_name: requestData.customer_name.split(' ').slice(1).join(' ') || 'User',
        phone_number: phoneNumber,
        email: requestData.customer_email,
      },
      billing_address: {
        first_name: requestData.customer_name.split(' ')[0] || requestData.customer_name,
        last_name: requestData.customer_name.split(' ').slice(1).join(' ') || 'User',
        line1: "الرياض، شارع الملك فهد",
        city: "الرياض",
        country_code: "SA",
        phone_number: phoneNumber,
      },
      shipping_address: {
        first_name: requestData.customer_name.split(' ')[0] || requestData.customer_name,
        last_name: requestData.customer_name.split(' ').slice(1).join(' ') || 'User',
        line1: "الرياض، شارع الملك فهد",
        city: "الرياض",
        country_code: "SA",
        phone_number: phoneNumber,
      },
      merchant_url: {
        success: `${req.headers.get("origin")}/payment-success`,
        failure: `${req.headers.get("origin")}/payment-cancel`,
        cancel: `${req.headers.get("origin")}/payment-cancel`,
        notification: `${req.headers.get("origin")}/api/tamara-webhook`,
      },
    };

    console.log("Tamara payload:", JSON.stringify(tamaraPayload, null, 2));

    console.log("Sending request to Tamara API...");

    const tamaraResponse = await fetch("https://api-sandbox.tamara.co/checkout", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tamaraApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tamaraPayload),
    });

    const tamaraResult = await tamaraResponse.json();
    
    console.log("Tamara API response status:", tamaraResponse.status);
    console.log("Tamara API response headers:", Object.fromEntries(tamaraResponse.headers.entries()));
    console.log("Tamara API response body:", JSON.stringify(tamaraResult, null, 2));

    if (!tamaraResponse.ok) {
      console.error("Tamara API error details:", {
        status: tamaraResponse.status,
        statusText: tamaraResponse.statusText,
        body: tamaraResult
      });
      throw new Error(`Tamara API Error (${tamaraResponse.status}): ${tamaraResult.message || JSON.stringify(tamaraResult)}`);
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
        tamara_order_id: tamaraResult.order_id,
        status: "INITIATED",
        payment_method: "tamara",
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
        order_id: tamaraResult.order_id,
        payment_url: tamaraResult.checkout_url,
        transaction_id: transaction.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error in tamara-payment function:", error);
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