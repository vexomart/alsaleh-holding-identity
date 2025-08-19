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
    if (!tabApiKey) {
      throw new Error('TAB API key not configured');
    }

    // Create TAB payment request
    const tabPaymentData = {
      amount: amount * 100, // TAB expects amount in halalas (smallest currency unit)
      currency: 'SAR',
      description: `دفع عرض: ${offer_title}`,
      reference_id: `TAB-${Date.now()}`,
      callback_url: `${req.headers.get("referer") || "https://alsalehholding.com"}/payment-success`,
      return_url: `${req.headers.get("referer") || "https://alsalehholding.com"}/payment-success`,
      customer: {
        first_name: customer_name.split(' ')[0] || 'عميل',
        last_name: customer_name.split(' ').slice(1).join(' ') || 'مميز',
        email: customer_email,
        phone: {
          country_code: '+966',
          number: customer_phone.replace(/^\+?966/, '')
        }
      }
    };

    console.log("🔄 Sending request to TAB:", tabPaymentData);

    // Make request to TAB API
    const tabResponse = await fetch('https://api.tap.company/v2/charges', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tabApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tabPaymentData)
    });

    const tabResult = await tabResponse.json();
    console.log("📨 TAB Response:", tabResult);

    if (!tabResponse.ok) {
      throw new Error(`TAB API Error: ${tabResult.message || 'Unknown error'}`);
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
      message: "فشل في معالجة طلب الدفع"
    }), {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json" 
      },
      status: 500,
    });
  }
});