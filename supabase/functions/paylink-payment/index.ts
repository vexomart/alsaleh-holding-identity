import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

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
    console.log("🚀 Starting Paylink payment integration");
    
    const body = await req.json();
    console.log("📦 Request body received:", JSON.stringify(body, null, 2));

    // Extract payment details
    const {
      amount = 1499,
      customer_name = 'عميل محتمل',
      customer_email = 'customer@example.com',
      customer_phone = '966500000000',
      offer_title = 'خدمة تسويقية',
      description = 'دفع خدمة'
    } = body;

    console.log(`💰 Processing payment - Amount: ${amount} SAR, Customer: ${customer_name}`);

    // Get API credentials
    const paylinkApiId = Deno.env.get('PAYLINK_API_ID');
    const paylinkApiKey = Deno.env.get('PAYLINK_API_KEY');

    console.log("🔐 Checking API credentials...");
    if (!paylinkApiId || !paylinkApiKey) {
      console.error("❌ Missing Paylink API credentials");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Missing Paylink API credentials" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    console.log("✅ API credentials found, proceeding with authentication");

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Authenticate with Paylink
    console.log("🔑 Authenticating with Paylink API...");
    const authResponse = await fetch('https://restapi.paylink.sa/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        apiId: paylinkApiId,
        secretKey: paylinkApiKey,
        persistToken: false
      })
    });

    console.log(`🔍 Auth response status: ${authResponse.status}`);
    
    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error("❌ Paylink authentication failed:", errorText);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Failed to authenticate with Paylink" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    const authData = await authResponse.json();
    console.log("✅ Paylink authentication successful");

    if (!authData.id_token) {
      console.error("❌ No authentication token received from Paylink");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "No authentication token received" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    // Prepare invoice data
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const invoicePayload = {
      amount: Number(amount),
      orderNumber: orderNumber,
      callBackUrl: 'https://preview--alsaleh-holding-identity.lovable.app/payment-success',
      cancelUrl: 'https://preview--alsaleh-holding-identity.lovable.app/payment-cancel',
      clientEmail: customer_email,
      clientName: customer_name,
      clientMobile: customer_phone.toString().replace(/^\+?966/, "0"),
      note: description,
      products: [{
        title: offer_title,
        price: Number(amount),
        qty: 1,
        description: description,
        isDigital: true
      }],
      supportedCardBrands: ["mada", "visaMastercard"],
      currency: "SAR"
    };

    console.log("📄 Creating invoice with Paylink:", JSON.stringify(invoicePayload, null, 2));

    // Create invoice
    const invoiceResponse = await fetch('https://restapi.paylink.sa/api/addInvoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${authData.id_token}`
      },
      body: JSON.stringify(invoicePayload)
    });

    console.log(`🔍 Invoice response status: ${invoiceResponse.status}`);

    if (!invoiceResponse.ok) {
      const errorText = await invoiceResponse.text();
      console.error("❌ Invoice creation failed:", errorText);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Failed to create payment invoice" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    const invoiceResult = await invoiceResponse.json();
    console.log("📋 Invoice creation result:", JSON.stringify(invoiceResult, null, 2));

    if (!invoiceResult.success || !invoiceResult.url) {
      console.error("❌ Invalid invoice response - no payment URL");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Invalid payment response - no URL received" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    // Save transaction to database
    console.log("💾 Saving transaction to database...");
    const { error: dbError } = await supabase
      .from('payment_transactions')
      .insert({
        transaction_id: invoiceResult.transactionNo || orderNumber,
        amount: Number(amount),
        currency: 'SAR',
        customer_name,
        customer_email,
        customer_phone,
        offer_title,
        description,
        payment_method: 'paylink',
        status: 'pending',
        paylink_transaction_no: invoiceResult.transactionNo,
        order_number: orderNumber
      });

    if (dbError) {
      console.error("⚠️ Database save failed:", dbError);
      // Continue anyway since payment URL was created successfully
    } else {
      console.log("✅ Transaction saved to database");
    }

    console.log("🎉 Payment URL created successfully:", invoiceResult.url);

    return new Response(JSON.stringify({
      success: true,
      payment_url: invoiceResult.url,
      url: invoiceResult.url,
      transaction_no: invoiceResult.transactionNo,
      order_number: orderNumber
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });

  } catch (error) {
    console.error("💥 Unexpected error in Paylink payment:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: `Payment processing failed: ${error.message}` 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});