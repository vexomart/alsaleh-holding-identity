import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🚀 TAB Payment request received");
    
    const requestData = await req.json();
    console.log("📋 Request data:", requestData);
    
    const {
      amount,
      currency = 'SAR',
      customer_name,
      customer_email,
      customer_phone,
      offer_title = "خدمة تقنية",
      description = "دفع خدمة تقنية",
      success_url = "https://alsalehholding.com/payment-success",
      cancel_url = "https://alsalehholding.com/payment-cancel",
      metadata = {}
    } = requestData;

    // التحقق من البيانات الأساسية
    if (!amount || !customer_name || !customer_email) {
      console.error("❌ Missing required fields");
      throw new Error("البيانات المطلوبة مفقودة: المبلغ، الاسم، الإيميل");
    }

    // TAB API settings
    const TAB_API_KEY = Deno.env.get("TAB_API_KEY");
    const TAB_SECRET_KEY = Deno.env.get("TAB_SECRET_KEY"); 
    const TAB_MERCHANT_ID = Deno.env.get("TAB_MERCHANT_ID");

    console.log("🔑 TAB Keys status:", {
      hasApiKey: !!TAB_API_KEY,
      hasSecretKey: !!TAB_SECRET_KEY,
      hasMerchantId: !!TAB_MERCHANT_ID
    });

    // في حالة عدم وجود مفاتيح TAB، إرجاع رد وهمي للاختبار
    if (!TAB_API_KEY || !TAB_SECRET_KEY || !TAB_MERCHANT_ID) {
      console.log("⚠️ TAB keys not configured, returning test response");
      
      const testResponse = {
        success: true,
        payment_url: "https://tap.company/test-payment-" + Date.now(),
        transaction_id: "test_" + Date.now(),
        invoice_number: `INV-TEST-${Date.now()}`,
        amount: amount,
        currency: currency,
        status: "pending",
        payment_method: "TAB",
        message: "Test payment link created (TAB keys not configured)",
        isTest: true
      };

      console.log("✅ Test response:", testResponse);

      return new Response(JSON.stringify(testResponse), {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: 200,
      });
    }

    // إنشاء بيانات الدفع لـ TAB
    const paymentData = {
      amount: parseFloat(amount),
      currency: currency,
      customer: {
        first_name: customer_name.split(' ')[0] || customer_name,
        last_name: customer_name.split(' ').slice(1).join(' ') || 'عميل',
        email: customer_email,
        phone: {
          country_code: "+966",
          number: (customer_phone || "500000000").replace(/^\+?966/, '')
        }
      },
      merchant_id: TAB_MERCHANT_ID,
      source: {
        id: "src_all"
      },
      redirect: {
        url: success_url
      },
      description: description,
      metadata: {
        ...metadata,
        offer_title: offer_title,
        customer_name: customer_name
      }
    };

    console.log("📤 Sending to TAB API:", JSON.stringify(paymentData, null, 2));

    // استدعاء TAB API
    const tabResponse = await fetch("https://api.tap.company/v2/charges", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TAB_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(paymentData)
    });

    const tabResult = await tabResponse.json();
    console.log("📥 TAB API Response:", JSON.stringify(tabResult, null, 2));

    if (!tabResponse.ok) {
      console.error("❌ TAB API Error:", tabResult);
      throw new Error(`TAB API Error: ${tabResult.message || 'Unknown error'}`);
    }

    // Initialize Supabase to save transaction
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        // حفظ المعاملة في قاعدة البيانات
        const { error: dbError } = await supabase
          .from('payment_transactions')
          .insert({
            transaction_id: tabResult.id || `tab_${Date.now()}`,
            payment_method: 'TAB',
            amount: amount,
            currency: currency,
            status: 'PENDING',
            customer_name: customer_name,
            customer_email: customer_email,
            customer_phone: customer_phone || '',
            invoice_number: `INV-TAB-${Date.now()}`,
            offer_title: offer_title,
            description: description,
            metadata: {
              tab_charge_id: tabResult.id,
              tab_transaction_url: tabResult.transaction?.url,
              ...metadata
            }
          });

        if (dbError) {
          console.error("⚠️ Database save error:", dbError);
        } else {
          console.log("✅ Transaction saved to database");
        }
      }
    } catch (dbErr) {
      console.error("⚠️ Database error (non-critical):", dbErr);
    }

    const responseData = {
      success: true,
      payment_url: tabResult.transaction?.url || tabResult.url,
      transaction_id: tabResult.id,
      invoice_number: `INV-TAB-${Date.now()}`,
      amount: amount,
      currency: currency,
      status: "pending",
      payment_method: "TAB",
      charge_id: tabResult.id,
      message: "Payment link created successfully"
    };

    console.log("✅ Sending success response:", responseData);

    return new Response(JSON.stringify(responseData), {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json" 
      },
      status: 200,
    });

  } catch (error) {
    console.error("💥 TAB Payment Error:", error);
    
    const errorResponse = {
      success: false,
      error: error.message || "Internal server error",
      message: "فشل في إنشاء رابط الدفع عبر TAB",
      details: error.toString()
    };

    console.log("❌ Error response:", errorResponse);
    
    return new Response(JSON.stringify(errorResponse), {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json" 
      },
      status: 500,
    });
  }
});