import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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
    console.log("🚀 Starting Paylink payment");
    
    const body = await req.json();
    console.log("📦 Body:", body);

    const amount = body.amount || 1499;
    const customer_name = body.customer_name || 'عميل محتمل';
    const customer_email = body.customer_email || 'customer@example.com';
    const customer_phone = body.customer_phone || '966500000000';
    const offer_title = body.offer_title || 'خدمة تسويقية';
    const description = body.description || 'دفع خدمة';

    console.log("💰 Payment for:", offer_title, "Amount:", amount);

    // Get API credentials
    const apiId = Deno.env.get('PAYLINK_API_ID');
    const apiKey = Deno.env.get('PAYLINK_API_KEY');

    if (!apiId || !apiKey) {
      console.log("❌ Missing API credentials");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "API credentials missing" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    console.log("🔐 API credentials found");

    // Auth with Paylink
    const authRes = await fetch('https://restapi.paylink.sa/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiId: apiId,
        secretKey: apiKey,
        persistToken: false
      })
    });

    if (!authRes.ok) {
      console.log("❌ Auth failed");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Authentication failed" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    const authData = await authRes.json();
    console.log("✅ Auth success");

    if (!authData.id_token) {
      console.log("❌ No token");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "No token received" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    // Create invoice
    const orderNumber = `ORD-${Date.now()}`;
    const invoiceData = {
      amount: Number(amount),
      orderNumber: orderNumber,
      callBackUrl: 'https://preview--alsaleh-holding-identity.lovable.app/payment-success',
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
        isDigital: true
      }],
      supportedCardBrands: ["mada", "visaMastercard"],
      currency: "SAR"
    };

    console.log("📄 Creating invoice...");

    const invoiceRes = await fetch('https://restapi.paylink.sa/api/addInvoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.id_token}`
      },
      body: JSON.stringify(invoiceData)
    });

    if (!invoiceRes.ok) {
      console.log("❌ Invoice failed");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Invoice creation failed" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    const result = await invoiceRes.json();
    console.log("📄 Invoice result:", result);

    if (!result.success || !result.url) {
      console.log("❌ No payment URL");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "No payment URL received" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    console.log("🎉 Success! URL:", result.url);

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
    console.log("💥 Error:", error.message);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});