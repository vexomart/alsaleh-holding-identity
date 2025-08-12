import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log("✅ OPTIONS request handled");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🚀 Paylink payment started");
    
    // Parse request body
    const body = await req.json();
    console.log("📦 Request data received:", JSON.stringify(body, null, 2));

    // Extract payment data with validation
    const {
      amount = 1499,
      currency = 'SAR', 
      customer_name = 'عميل محتمل',
      customer_email = 'customer@example.com',
      customer_phone = '966500000000',
      offer_title = 'خدمة تسويقية',
      description = 'دفع خدمة تسويقية',
      success_url = 'https://preview--alsaleh-holding-identity.lovable.app/payment-success'
    } = body;

    // Validate required fields
    if (!amount || amount <= 0) {
      console.log("❌ Invalid amount:", amount);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Invalid amount provided" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      });
    }

    console.log("💰 Processing payment:", {
      amount,
      currency,
      customer_name,
      offer_title
    });

    // Get credentials from environment
    const apiId = Deno.env.get('PAYLINK_API_ID');
    const apiKey = Deno.env.get('PAYLINK_API_KEY');

    console.log("🔑 Checking credentials...");
    console.log("API ID exists:", !!apiId);
    console.log("API Key exists:", !!apiKey);

    if (!apiId || !apiKey) {
      console.log("❌ Missing Paylink credentials");
      console.log("Available env vars:", Object.keys(Deno.env.toObject()));
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Paylink credentials not configured" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    console.log("🔐 Authenticating with Paylink API...");

    // Authenticate with Paylink
    const authPayload = {
      apiId: apiId,
      secretKey: apiKey,
      persistToken: false
    };

    console.log("📡 Sending auth request to Paylink...");

    const authResponse = await fetch('https://restapi.paylink.sa/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authPayload)
    });

    console.log("📡 Auth response status:", authResponse.status);

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.log("❌ Authentication failed:", authResponse.status, errorText);
      return new Response(JSON.stringify({ 
        success: false, 
        error: `Authentication failed: ${authResponse.status}` 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    const authData = await authResponse.json();
    console.log("✅ Authentication successful, token received:", !!authData.id_token);

    if (!authData.id_token) {
      console.log("❌ No token in auth response:", JSON.stringify(authData, null, 2));
      return new Response(JSON.stringify({ 
        success: false, 
        error: "No authentication token received" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    // Create invoice
    console.log("📄 Creating invoice...");
    const orderNumber = `ORD-${Date.now()}`;
    
    // Clean phone number
    const cleanPhone = customer_phone.toString().replace(/^\+?966/, "0");
    
    const invoiceData = {
      amount: Number(amount),
      orderNumber: orderNumber,
      callBackUrl: success_url,
      clientEmail: customer_email,
      clientName: customer_name,
      clientMobile: cleanPhone,
      note: description,
      cancelUrl: "https://preview--alsaleh-holding-identity.lovable.app/payment-cancel",
      products: [{
        title: offer_title,
        price: Number(amount),
        qty: 1,
        description: description,
        isDigital: true,
        imageSrc: null,
        specificVat: null,
        productCost: null
      }],
      supportedCardBrands: ["mada", "visaMastercard"],
      currency: currency,
      smsMessage: null,
      displayPending: null,
      receivers: null,
      partnerPortion: null,
      metadata: null
    };

    console.log("📋 Invoice data prepared:", JSON.stringify(invoiceData, null, 2));

    const invoiceResponse = await fetch('https://restapi.paylink.sa/api/addInvoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.id_token}`
      },
      body: JSON.stringify(invoiceData)
    });

    console.log("📄 Invoice response status:", invoiceResponse.status);

    if (!invoiceResponse.ok) {
      const errorText = await invoiceResponse.text();
      console.log("❌ Invoice creation failed:", invoiceResponse.status, errorText);
      return new Response(JSON.stringify({ 
        success: false, 
        error: `Invoice creation failed: ${invoiceResponse.status}` 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    const paylinkResult = await invoiceResponse.json();
    console.log("📄 Invoice created successfully:", JSON.stringify(paylinkResult, null, 2));

    if (!paylinkResult.success || !paylinkResult.url) {
      console.log("❌ Invalid Paylink response");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Invalid response from Paylink API" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    // Try to save to database (non-blocking)
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? "",
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ""
      );

      const { error: dbError } = await supabase.from('payment_transactions').insert({
        offer_title: offer_title,
        amount: Number(amount),
        currency: currency,
        customer_name: customer_name,
        customer_email: customer_email,
        customer_phone: customer_phone,
        status: 'INITIATED',
        payment_method: 'paylink',
        paylink_transaction_no: paylinkResult.transactionNo,
        contract_data: {}
      });

      if (dbError) {
        console.log("⚠️ Database save error (continuing):", dbError.message);
      } else {
        console.log("💾 Transaction saved to database");
      }
    } catch (dbError) {
      console.log("⚠️ Database save failed (continuing):", dbError.message);
    }

    // Success response
    const response = {
      success: true,
      transaction_no: paylinkResult.transactionNo,
      payment_url: paylinkResult.url,
      url: paylinkResult.url
    };

    console.log("🎉 Payment URL created successfully!");

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });

  } catch (error) {
    console.log("💥 Unexpected error:", error.message);
    console.log("💥 Error stack:", error.stack);
    return new Response(JSON.stringify({ 
      success: false, 
      error: `Server error: ${error.message}` 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});