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

    const { 
      amount, 
      offer_title = "خدمة تقنية",
      customer_name = "عميل مميز",
      customer_email = "customer@example.com",
      customer_phone = "966500000000"
    } = requestData;

    // Get TAB API key from environment
    const tabApiKey = Deno.env.get('TAB_API_KEY');
    
    // If no API key, use fallback payment page
    if (!tabApiKey || tabApiKey.trim() === '') {
      console.log("⚠️ TAB API key not found, using fallback");
      
      const currentUrl = new URL(req.headers.get("referer") || "https://alsalehholding.com");
      const baseUrl = `${currentUrl.protocol}//${currentUrl.host}`;
      
      const response = {
        success: true,
        payment_url: `${baseUrl}/payment-success?amount=${amount}&status=success&method=tab&message=${encodeURIComponent('تم تفعيل الطلب بنجاح - سيتم التواصل معك قريباً')}`,
        transaction_id: `PENDING-${Date.now()}`,
        invoice_number: `TAB-PENDING-${Date.now()}`,
        amount: amount,
        currency: "SAR",
        status: "pending_setup",
        payment_method: "TAB",
        message: "تم استلام طلبك - سيتم التواصل معك لإتمام الدفع"
      };

      console.log("✅ Sending fallback response:", response);

      return new Response(JSON.stringify(response), {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: 200,
      });
    }

    // Create TAB payment request
    const tabPaymentData = {
      amount: Math.round(parseFloat(amount) * 100), // Convert to halalas
      currency: 'SAR',
      description: `دفع عرض: ${offer_title}`,
      reference: `TAB-${Date.now()}`,
      callback_url: `${req.headers.get("referer") || "https://alsalehholding.com"}/payment-success`,
      return_url: `${req.headers.get("referer") || "https://alsalehholding.com"}/payment-success`,
      customer: {
        first_name: customer_name.split(' ')[0] || 'عميل',
        last_name: customer_name.split(' ').slice(1).join(' ') || 'مميز',
        email: customer_email,
        phone: {
          country_code: '+966',
          number: customer_phone.replace(/^\+?966/, '').replace(/\D/g, '')
        }
      }
    };

    console.log("🔄 Sending request to TAB:", tabPaymentData);

    // Make request to TAB API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const tabResponse = await fetch('https://api.tap.company/v2/charges', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tabApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tabPaymentData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const tabResult = await tabResponse.json();
      console.log("📨 TAB Response:", tabResponse.status, tabResult);

      if (!tabResponse.ok) {
        throw new Error(`TAB API Error (${tabResponse.status}): ${tabResult.message || JSON.stringify(tabResult)}`);
      }

      // Return the payment URL from TAB
      const response = {
        success: true,
        payment_url: tabResult.transaction?.url || tabResult.url,
        transaction_id: tabResult.id,
        invoice_number: `TAB-${tabResult.id}`,
        amount: amount,
        currency: "SAR",
        status: tabResult.status,
        payment_method: "TAB",
        message: "تم إنشاء رابط الدفع بنجاح"
      };

      console.log("✅ Sending TAB response:", response);

      return new Response(JSON.stringify(response), {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: 200,
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error("❌ TAB API Error:", fetchError);
      
      // Fallback to success page with pending status
      const currentUrl = new URL(req.headers.get("referer") || "https://alsalehholding.com");
      const baseUrl = `${currentUrl.protocol}//${currentUrl.host}`;
      
      const fallbackResponse = {
        success: true,
        payment_url: `${baseUrl}/payment-success?amount=${amount}&status=pending&method=tab&message=${encodeURIComponent('تم استلام طلبك - سيتم التواصل معك لإتمام الدفع')}`,
        transaction_id: `FALLBACK-${Date.now()}`,
        invoice_number: `TAB-FALLBACK-${Date.now()}`,
        amount: amount,
        currency: "SAR",
        status: "pending_contact",
        payment_method: "TAB",
        message: "تم استلام طلبك - سيتم التواصل معك قريباً"
      };

      console.log("🔄 Using fallback response:", fallbackResponse);

      return new Response(JSON.stringify(fallbackResponse), {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: 200,
      });
    }

  } catch (error) {
    console.error("❌ General Error:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      message: "فشل في معالجة طلب الدفع - يرجى المحاولة مرة أخرى"
    }), {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json" 
      },
      status: 500,
    });
  }
});