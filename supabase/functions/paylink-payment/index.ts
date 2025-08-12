import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log("🔥 REQUEST START - Method:", req.method);
  
  // Handle CORS
  if (req.method === 'OPTIONS') {
    console.log("✅ OPTIONS request handled");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get headers
    const headers = Object.fromEntries(req.headers.entries());
    console.log("📋 Request headers:", headers);

    // Get body
    const bodyText = await req.text();
    console.log("📝 Raw body received:", bodyText);
    console.log("📏 Body length:", bodyText.length);

    if (!bodyText || bodyText.trim() === '') {
      console.log("❌ Empty body received");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "لم يتم استلام أي بيانات" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      });
    }

    let requestData;
    try {
      requestData = JSON.parse(bodyText);
      console.log("✅ JSON parsed successfully:", requestData);
    } catch (parseError) {
      console.log("❌ JSON parse failed:", parseError.message);
      console.log("📝 Attempting to parse as:", bodyText.substring(0, 100));
      return new Response(JSON.stringify({ 
        success: false, 
        error: "خطأ في تحليل البيانات" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      });
    }

    // Check environment variables
    const apiId = Deno.env.get('PAYLINK_API_ID');
    const apiKey = Deno.env.get('PAYLINK_API_KEY');
    
    console.log("🔑 Environment check:", {
      hasApiId: !!apiId,
      apiIdLength: apiId?.length,
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length
    });

    if (!apiId || !apiKey) {
      console.log("❌ Missing environment variables");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "إعدادات الدفع غير متوفرة" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    // Return test response for now to see if we get this far
    console.log("🎯 Returning test success response");
    
    return new Response(JSON.stringify({
      success: true,
      url: "https://payment.paylink.sa/pay/info/TEST123",
      payment_url: "https://payment.paylink.sa/pay/info/TEST123",
      transaction_no: "TEST123",
      debug: {
        receivedData: requestData,
        hasCredentials: true
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });

  } catch (error) {
    console.log("💥 Fatal error:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: `خطأ خطير: ${error.message}` 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});