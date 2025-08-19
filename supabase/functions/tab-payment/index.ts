import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("🚀 TAB Payment function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    console.log("📋 Request received:", requestData);

    const { amount, offer_title = "خدمة تقنية" } = requestData;

    const transactionId = `test-${Date.now()}`;
    
    // إنشاء رد ناجح مع توجيه داخلي
    const currentUrl = new URL(req.headers.get("referer") || "https://alsalehholding.com");
    const baseUrl = `${currentUrl.protocol}//${currentUrl.host}`;
    
    const response = {
      success: true,
      payment_url: `${baseUrl}/payment-success?test=true&amount=${amount}&offer=${encodeURIComponent(offer_title)}`,
      transaction_id: transactionId,
      invoice_number: `INV-${Date.now()}`,
      amount: amount || 50,
      currency: "SAR",
      status: "pending",
      payment_method: "TAB",
      message: "تم إنشاء رابط الدفع بنجاح - وضع الاختبار",
      isTest: true
    };

    console.log("✅ Sending response:", response);

    return new Response(JSON.stringify(response), {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json" 
      },
      status: 200,
    });

  } catch (error) {
    console.error("❌ Error:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      message: "فشل في معالجة الطلب"
    }), {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json" 
      },
      status: 500,
    });
  }
});