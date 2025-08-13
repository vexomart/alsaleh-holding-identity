import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🚀 Paylink Payment Started");
    const body = await req.json();
    console.log("📦 Request Body:", JSON.stringify(body, null, 2));

    const {
      amount,
      customer_name = 'عميل محتمل', 
      customer_email = 'customer@example.com',
      customer_phone = '966500000000',
      offer_title = 'خدمة تسويقية',
      description = 'دفع خدمة',
      currency = 'SAR'
    } = body;

    // Validate and process amount
    const processedAmount = amount && amount > 0 ? Number(amount) : 1499;
    console.log("💰 Processing amount:", { received: amount, processed: processedAmount });

    // Get API credentials
    const apiId = Deno.env.get('PAYLINK_API_ID');
    const apiKey = Deno.env.get('PAYLINK_API_KEY');

    console.log("🔐 Checking credentials...");
    if (!apiId || !apiKey) {
      console.error("❌ Missing Paylink credentials");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "API credentials not configured" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    console.log("✅ Credentials OK, authenticating...");

    // Auth with Paylink
    const authResponse = await fetch('https://restapi.paylink.sa/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiId: apiId,
        secretKey: apiKey,
        persistToken: false
      })
    });

    if (!authResponse.ok) {
      console.error("❌ Auth failed:", authResponse.status);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Authentication failed" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    const authData = await authResponse.json();
    console.log("✅ Auth successful");

    if (!authData.id_token) {
      console.error("❌ No token received");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "No authentication token" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    // Create unique order number
    const orderNumber = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const invoiceData = {
      amount: processedAmount,
      orderNumber: orderNumber,
      callBackUrl: 'https://preview--alsaleh-holding-identity.lovable.app/payment-success',
      cancelUrl: 'https://preview--alsaleh-holding-identity.lovable.app/payment-cancel',
      clientEmail: customer_email,
      clientName: customer_name,
      clientMobile: customer_phone.toString().replace(/^\+?966/, "0"),
      note: description,
      products: [{
        title: offer_title,
        price: processedAmount,
        qty: 1,
        description: description,
        isDigital: true
      }],
      supportedCardBrands: ["mada", "visaMastercard"],
      currency: "SAR"
    };

    console.log("📄 Creating invoice:", JSON.stringify(invoiceData, null, 2));

    // Create invoice
    const invoiceResponse = await fetch('https://restapi.paylink.sa/api/addInvoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.id_token}`
      },
      body: JSON.stringify(invoiceData)
    });

    if (!invoiceResponse.ok) {
      console.error("❌ Invoice creation failed:", invoiceResponse.status);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Invoice creation failed" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    const result = await invoiceResponse.json();
    console.log("📄 Invoice result:", JSON.stringify(result, null, 2));

    if (!result.success || !result.url) {
      console.error("❌ Invalid invoice response");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Invalid payment response" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Save transaction
    console.log("💾 Saving transaction...");
    const { error: dbError } = await supabase
      .from('payment_transactions')
      .insert({
        offer_title,
        amount: processedAmount,
        currency,
        customer_name,
        customer_email,
        customer_phone,
        payment_method: 'paylink',
        status: 'pending',
        paylink_transaction_no: result.transactionNo
      });

    if (dbError) {
      console.error("⚠️ Database error:", dbError);
    } else {
      console.log("✅ Transaction saved");
    }

    console.log("🎉 Payment URL created:", result.url);

    return new Response(JSON.stringify({
      success: true,
      payment_url: result.url,
      url: result.url,
      transaction_no: result.transactionNo
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });

  } catch (error) {
    console.error("💥 Error:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});