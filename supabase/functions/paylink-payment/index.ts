import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function for better logging
const logStep = (step: string, data?: any) => {
  const message = data ? `${step}: ${JSON.stringify(data)}` : step;
  console.log(`[PAYLINK] ${message}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Starting Paylink payment process");

    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
      logStep("Request body parsed", requestBody);
    } catch (parseError) {
      logStep("Error parsing request body", parseError.message);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Invalid request body" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      });
    }

    const {
      amount,
      currency = 'SAR',
      customer_name,
      customer_email,
      customer_phone,
      offer_title,
      description,
      success_url
    } = requestBody;

    // Validate required fields
    if (!amount || !customer_name || !customer_email || !customer_phone || !offer_title) {
      logStep("Missing required fields", { amount, customer_name, customer_email, customer_phone, offer_title });
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Missing required fields" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      });
    }

    logStep("Creating Paylink payment for", {
      amount,
      currency,
      customer_name,
      customer_email,
      customer_phone,
      offer_title,
      description,
      success_url
    });

    // Get Paylink API credentials
    const paylinkApiId = Deno.env.get('PAYLINK_API_ID');
    const paylinkApiKey = Deno.env.get('PAYLINK_API_KEY');

    if (!paylinkApiId || !paylinkApiKey) {
      logStep("Missing Paylink credentials");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Paylink credentials not configured" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      logStep("Missing Supabase credentials");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Database connection not configured" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Authenticate with Paylink
    logStep("Authenticating with Paylink...");
    const authResponse = await fetch('https://restapi.paylink.sa/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiId: paylinkApiId,
        secretKey: paylinkApiKey,
        persistToken: false
      })
    });

    if (!authResponse.ok) {
      logStep("Paylink auth failed", { status: authResponse.status, statusText: authResponse.statusText });
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Failed to authenticate with Paylink" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    const authData = await authResponse.json();
    logStep("Paylink auth status", authResponse.status);

    if (!authData.id_token) {
      logStep("No auth token received", authData);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Failed to get Paylink auth token" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    // Create invoice on Paylink
    logStep("Creating invoice on Paylink...");
    const orderNumber = `ORD-${Date.now()}`;
    
    const invoiceData = {
      amount: amount,
      orderNumber: orderNumber,
      callBackUrl: success_url || "https://preview--alsaleh-holding-identity.lovable.app/payment-success",
      clientEmail: customer_email,
      clientName: customer_name,
      clientMobile: customer_phone.replace(/^\+?966/, "0"),
      note: description,
      cancelUrl: "https://preview--alsaleh-holding-identity.lovable.app/payment-cancel",
      products: [{
        title: offer_title,
        price: amount,
        qty: 1,
        description: description,
        isDigital: true,
        imageSrc: null,
        specificVat: null,
        productCost: null
      }],
      supportedCardBrands: ["mada", "visaMastercard"],
      currency: currency,
      smsMessage: null,
      displayPending: null,
      receivers: null,
      partnerPortion: null,
      metadata: null
    };

    const invoiceResponse = await fetch('https://restapi.paylink.sa/api/addInvoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.id_token}`
      },
      body: JSON.stringify(invoiceData)
    });

    if (!invoiceResponse.ok) {
      logStep("Invoice creation failed", { status: invoiceResponse.status, statusText: invoiceResponse.statusText });
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Failed to create payment invoice" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    const paylinkResult = await invoiceResponse.json();
    logStep("Paylink API response", paylinkResult);

    if (!paylinkResult.success || !paylinkResult.url) {
      logStep("Invalid Paylink response", paylinkResult);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Invalid payment response from Paylink" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    // Record transaction in database
    logStep("Recording transaction in database...");
    const { data: transaction, error: dbError } = await supabase
      .from('payment_transactions')
      .insert({
        offer_title: offer_title,
        amount: amount,
        currency: currency,
        customer_name: customer_name,
        customer_email: customer_email,
        customer_phone: customer_phone,
        status: 'INITIATED',
        payment_method: 'paylink',
        paylink_transaction_no: paylinkResult.transactionNo,
        contract_data: {}
      })
      .select()
      .single();

    if (dbError) {
      logStep("Database error", dbError);
      // Don't fail the entire request if database recording fails
      console.error("Database error:", dbError);
    } else {
      logStep("Transaction recorded", transaction);
    }

    // Return successful response
    const response = {
      success: true,
      transaction_no: paylinkResult.transactionNo,
      payment_url: paylinkResult.url,
      url: paylinkResult.url, // Also include 'url' for compatibility
      transaction_id: transaction?.id || null,
    };

    logStep("Returning successful response", response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    logStep("Unexpected error", { message: error.message, stack: error.stack });
    console.error("Error in paylink-payment function:", error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || "Internal server error" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});