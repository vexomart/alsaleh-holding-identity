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
  success_url?: string;
  contract_data?: Record<string, unknown>;
}


serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const paylinkApiKey = Deno.env.get("PAYLINK_API_KEY");
    const paylinkApiId = Deno.env.get("PAYLINK_API_ID");
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

    // Create invoice with Paylink (per docs: orderNumber, products, etc.)
    const origin = requestData.success_url || req.headers.get("origin") || new URL(req.url).origin;
    const orderNumber = `ORD-${Date.now()}`;
    const rawPhone = (requestData.customer_phone || "0500000000").replace(/[^\d]/g, "");
    const normalizedPhone = rawPhone.startsWith("05")
      ? rawPhone
      : rawPhone.startsWith("9665")
        ? `0${rawPhone.slice(3)}`
        : rawPhone.startsWith("5")
          ? `0${rawPhone}`
          : rawPhone || "0500000000";

    const paylinkPayload = {
      orderNumber,
      amount: requestData.amount,
      callBackUrl: `${origin}/payment-success`,
      cancelUrl: `${origin}/payment-cancel`,
      clientName: requestData.customer_name,
      clientEmail: requestData.customer_email,
      clientMobile: normalizedPhone,
      currency: requestData.currency || "SAR",
      products: [
        {
          title: requestData.offer_title || "خدمة",
          price: requestData.amount,
          qty: 1,
          description: requestData.description || "",
          isDigital: true
        }
      ],
      supportedCardBrands: ["mada", "visaMastercard"],
      note: requestData.description,
    };

    console.log("Authenticating with Paylink...");
    let token = Deno.env.get("PAYLINK_ACCESS_TOKEN") || "";
    if (!token) {
      if (!paylinkApiId || !paylinkApiKey) {
        throw new Error("PAYLINK_API_ID and PAYLINK_API_KEY are required to fetch token");
      }
      const authResp = await fetch("https://restapi.paylink.sa/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ apiId: paylinkApiId, secretKey: paylinkApiKey, persistToken: "true" })
      });
      const authJson = await authResp.json();
      console.log("Paylink auth status:", authResp.status);
      if (!authResp.ok || !authJson.id_token) {
        console.error("Paylink auth error:", authJson);
        throw new Error("Failed to authenticate with Paylink");
      }
      token = authJson.id_token;
    }

    console.log("Creating invoice on Paylink...");
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    const paylinkResponse = await fetch("https://restapi.paylink.sa/api/addInvoice", {
      method: "POST",
      headers,
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
        contract_data: requestData.contract_data || {},
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