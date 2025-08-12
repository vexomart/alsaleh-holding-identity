import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🚀 Paylink payment started");

    // Parse request body
    const body = await req.json();
    console.log("📦 Request data:", body);

    // Extract payment data with defaults
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

    console.log("💰 Payment details:", {
      amount,
      customer_name,
      customer_email,
      offer_title
    });

    // Get Paylink credentials
    const apiId = Deno.env.get('PAYLINK_API_ID');
    const apiKey = Deno.env.get('PAYLINK_API_KEY');

    if (!apiId || !apiKey) {
      console.log("❌ Missing Paylink credentials");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Paylink credentials not configured" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    console.log("🔐 Credentials found, authenticating...");

    // Authenticate with Paylink
    const authResponse = await fetch('https://restapi.paylink.sa/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiId: apiId,
        secretKey: apiKey,
        persistToken: false
      })
    });

    if (!authResponse.ok) {
      console.log("❌ Authentication failed:", authResponse.status);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Failed to authenticate with Paylink" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    const authData = await authResponse.json();
    console.log("✅ Authentication successful");

    if (!authData.id_token) {
      console.log("❌ No token received");
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
    
    const invoiceData = {
      amount: Number(amount),
      orderNumber: orderNumber,
      callBackUrl: success_url,
      clientEmail: customer_email,
      clientName: customer_name,
      clientMobile: customer_phone.toString().replace(/^\+?966/, "0"),
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

    console.log("📋 Invoice payload prepared");

    const invoiceResponse = await fetch('https://restapi.paylink.sa/api/addInvoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.id_token}`
      },
      body: JSON.stringify(invoiceData)
    });

    if (!invoiceResponse.ok) {
      console.log("❌ Invoice creation failed:", invoiceResponse.status);
      const errorText = await invoiceResponse.text();
      console.log("Error details:", errorText);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Failed to create payment invoice" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    const paylinkResult = await invoiceResponse.json();
    console.log("📄 Invoice created:", {
      success: paylinkResult.success,
      transactionNo: paylinkResult.transactionNo,
      hasUrl: !!paylinkResult.url
    });

    if (!paylinkResult.success || !paylinkResult.url) {
      console.log("❌ Invalid Paylink response:", paylinkResult);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Invalid response from Paylink" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    // Save transaction to database (optional, non-blocking)
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? "",
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ""
      );

      await supabase.from('payment_transactions').insert({
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

      console.log("💾 Transaction saved to database");
    } catch (dbError) {
      console.log("⚠️ Database save failed (continuing):", dbError.message);
    }

    // Return success response
    const response = {
      success: true,
      transaction_no: paylinkResult.transactionNo,
      payment_url: paylinkResult.url,
      url: paylinkResult.url, // For compatibility
      transaction_id: null
    };

    console.log("🎉 Payment created successfully!");

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });

  } catch (error) {
    console.log("💥 Unexpected error:", error.message);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || "Unexpected error occurred" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});