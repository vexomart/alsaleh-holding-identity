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
    console.log("TAB Payment request received");
    
    const {
      amount,
      currency = 'SAR',
      customer_name,
      customer_email,
      customer_phone,
      offer_title,
      description,
      success_url,
      cancel_url,
      metadata = {}
    } = await req.json();

    console.log("Payment request data:", { 
      amount, 
      currency, 
      customer_name, 
      customer_email, 
      offer_title 
    });

    // TAB Payment API configuration
    const TAB_API_KEY = Deno.env.get("TAB_API_KEY"); 
    const TAB_SECRET_KEY = Deno.env.get("TAB_SECRET_KEY");
    const TAB_MERCHANT_ID = Deno.env.get("TAB_MERCHANT_ID");
    const TAB_BASE_URL = "https://api.tap.company/v2";
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("TAB API Keys status:", {
      hasApiKey: !!TAB_API_KEY,
      hasSecretKey: !!TAB_SECRET_KEY,
      hasMerchantId: !!TAB_MERCHANT_ID
    });

    if (!TAB_API_KEY) {
      console.error("Missing TAB_API_KEY");
      throw new Error("TAB_API_KEY is not configured");
    }

    if (!TAB_SECRET_KEY) {
      console.error("Missing TAB_SECRET_KEY");
      throw new Error("TAB_SECRET_KEY is not configured");
    }

    if (!TAB_MERCHANT_ID) {
      console.error("Missing TAB_MERCHANT_ID");
      throw new Error("TAB_MERCHANT_ID is not configured");
    }

    // Validate required fields
    if (!amount || !customer_name || !customer_email || !customer_phone) {
      throw new Error("Missing required payment fields");
    }

    // Create TAB payment request
    const paymentData = {
      amount: amount,
      currency: currency,
      customer: {
        first_name: customer_name.split(' ')[0] || 'عميل',
        last_name: customer_name.split(' ').slice(1).join(' ') || 'مميز',
        email: customer_email,
        phone: {
          country_code: "+966",
          number: customer_phone.replace(/^\+?966/, '')
        }
      },
      merchant_id: TAB_MERCHANT_ID,
      source: {
        id: "src_all"
      },
      redirect: {
        url: success_url
      },
      post: {
        url: `${req.headers.get("origin")}/api/tab-webhook`
      },
      description: description,
      metadata: {
        ...metadata,
        offer_title: offer_title,
        customer_name: customer_name,
        timestamp: new Date().toISOString()
      }
    };

    console.log("Creating TAB payment with data:", JSON.stringify(paymentData, null, 2));

    // Create payment with TAB API
    const tabResponse = await fetch(`${TAB_BASE_URL}/charges`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TAB_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(paymentData)
    });

    const tabResult = await tabResponse.json();
    
    console.log("TAB API Response:", JSON.stringify(tabResult, null, 2));

    if (!tabResponse.ok) {
      console.error("TAB API Error:", tabResult);
      throw new Error(tabResult.message || "Failed to create TAB payment");
    }

    if (tabResult.status !== "INITIATED" || !tabResult.transaction?.url) {
      console.error("Invalid TAB response:", tabResult);
      throw new Error("Invalid payment response from TAB");
    }

    // Generate invoice number
    const invoice_number = `INV-TAB-${Date.now()}`;
    
    // Save transaction to database
    const { data: transactionData, error: dbError } = await supabase
      .from('payment_transactions')
      .insert({
        transaction_id: tabResult.id,
        payment_method: 'TAB',
        amount: amount,
        currency: currency,
        status: 'PENDING',
        customer_name: customer_name,
        customer_email: customer_email,
        customer_phone: customer_phone,
        invoice_number: invoice_number,
        offer_title: offer_title,
        description: description,
        metadata: {
          tab_charge_id: tabResult.id,
          tab_transaction_url: tabResult.transaction.url,
          ...metadata
        }
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      // Continue anyway - payment was created successfully
    } else {
      console.log("Transaction saved to database:", transactionData);
    }

    const responseData = {
      success: true,
      payment_url: tabResult.transaction.url,
      transaction_id: tabResult.id,
      invoice_number: invoice_number,
      amount: amount,
      currency: currency,
      status: "pending",
      payment_method: "TAB",
      charge_id: tabResult.id,
      message: "Payment link created successfully"
    };

    console.log("Sending success response:", responseData);

    return new Response(JSON.stringify(responseData), {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json" 
      },
      status: 200,
    });

  } catch (error) {
    console.error("TAB Payment Error:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Internal server error",
      message: "فشل في إنشاء رابط الدفع عبر TAB"
    }), {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json" 
      },
      status: 500,
    });
  }
});