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
    console.log("🚀 Starting Paylink payment request");

    // Get request body safely
    let body;
    try {
      const text = await req.text();
      console.log("📝 Raw request body:", text);
      body = JSON.parse(text);
    } catch (parseError) {
      console.log("❌ Failed to parse request body:", parseError.message);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "خطأ في تحليل البيانات المرسلة" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      });
    }

    console.log("✅ Parsed body:", body);

    // Extract data with defaults
    const amount = body?.amount || 1499;
    const customer_name = body?.customer_name || "عميل محتمل";
    const customer_email = body?.customer_email || "customer@example.com";
    const customer_phone = body?.customer_phone || "966500000000";
    const offer_title = body?.offer_title || "خدمة تسويقية";
    const description = body?.description || "دفع خدمة تسويقية";

    console.log("📊 Processing payment:", {
      amount,
      customer_name,
      customer_email,
      offer_title
    });

    // Get Paylink credentials
    const apiId = Deno.env.get('PAYLINK_API_ID');
    const apiKey = Deno.env.get('PAYLINK_API_KEY');

    console.log("🔑 Checking credentials:", {
      hasApiId: !!apiId,
      hasApiKey: !!apiKey
    });

    if (!apiId || !apiKey) {
      console.log("❌ Missing Paylink credentials");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "إعدادات الدفع غير مكتملة" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    // Authenticate with Paylink
    console.log("🔐 Authenticating with Paylink...");
    
    const authPayload = {
      apiId: apiId,
      secretKey: apiKey,
      persistToken: false
    };

    console.log("📡 Auth payload prepared");

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
      console.log("❌ Paylink auth failed:", {
        status: authResponse.status,
        statusText: authResponse.statusText,
        error: errorText
      });
      return new Response(JSON.stringify({ 
        success: false, 
        error: "فشل في الاتصال مع خدمة الدفع" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    const authData = await authResponse.json();
    console.log("✅ Authentication successful, token length:", authData.id_token?.length);

    if (!authData.id_token) {
      console.log("❌ No token in auth response:", authData);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "لم يتم الحصول على رمز التوثيق" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    // Create invoice
    console.log("📄 Creating invoice...");
    const orderNumber = `ORD-${Date.now()}`;
    
    const invoicePayload = {
      amount: Number(amount),
      orderNumber: orderNumber,
      callBackUrl: "https://preview--alsaleh-holding-identity.lovable.app/payment-success",
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

    console.log("📦 Invoice payload:", invoicePayload);

    const invoiceResponse = await fetch('https://restapi.paylink.sa/api/addInvoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.id_token}`
      },
      body: JSON.stringify(invoicePayload)
    });

    console.log("📄 Invoice response status:", invoiceResponse.status);

    if (!invoiceResponse.ok) {
      const errorText = await invoiceResponse.text();
      console.log("❌ Invoice creation failed:", {
        status: invoiceResponse.status,
        statusText: invoiceResponse.statusText,
        error: errorText
      });
      return new Response(JSON.stringify({ 
        success: false, 
        error: "فشل في إنشاء فاتورة الدفع" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    const invoiceResult = await invoiceResponse.json();
    console.log("✅ Invoice created successfully:", {
      success: invoiceResult.success,
      hasUrl: !!invoiceResult.url,
      transactionNo: invoiceResult.transactionNo
    });

    if (!invoiceResult.success || !invoiceResult.url) {
      console.log("❌ Invalid invoice result:", invoiceResult);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "استجابة غير صحيحة من خدمة الدفع" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    // Return success
    const successResponse = {
      success: true,
      url: invoiceResult.url,
      payment_url: invoiceResult.url,
      transaction_no: invoiceResult.transactionNo
    };

    console.log("🎉 Payment created successfully!", successResponse);

    return new Response(JSON.stringify(successResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });

  } catch (error) {
    console.log("💥 Unexpected error:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: `خطأ غير متوقع: ${error.message}` 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});