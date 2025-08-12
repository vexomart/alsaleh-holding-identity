import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const log = (message: string, data?: any) => {
  console.log(`[PAYLINK] ${message}`, data ? JSON.stringify(data, null, 2) : '');
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    log("Starting payment request");

    // Parse request
    const body = await req.json();
    log("Request body received", body);

    const {
      amount = 1499,
      currency = 'SAR',
      customer_name = 'عميل محتمل',
      customer_email = 'customer@example.com',
      customer_phone = '966500000000',
      offer_title = 'خدمة تسويقية',
      description = 'دفع خدمة تسويقية',
      success_url = 'https://preview--alsaleh-holding-identity.lovable.app'
    } = body;

    log("Processed data", {
      amount,
      currency,
      customer_name,
      customer_email,
      customer_phone,
      offer_title
    });

    // Get credentials
    const apiId = Deno.env.get('PAYLINK_API_ID');
    const apiKey = Deno.env.get('PAYLINK_API_KEY');

    if (!apiId || !apiKey) {
      log("Missing credentials");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Missing Paylink credentials" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    log("Credentials found, authenticating...");

    // Authenticate
    const authResponse = await fetch('https://restapi.paylink.sa/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiId,
        secretKey: apiKey,
        persistToken: false
      })
    });

    if (!authResponse.ok) {
      log("Auth failed", { status: authResponse.status });
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Authentication failed" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    const authData = await authResponse.json();
    log("Authentication successful");

    if (!authData.id_token) {
      log("No token received", authData);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "No auth token" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    // Create invoice
    log("Creating invoice...");
    const orderNumber = `ORD-${Date.now()}`;
    
    const invoiceData = {
      amount: Number(amount),
      orderNumber,
      callBackUrl: success_url,
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
      currency
    };

    log("Invoice data prepared", invoiceData);

    const invoiceResponse = await fetch('https://restapi.paylink.sa/api/addInvoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.id_token}`
      },
      body: JSON.stringify(invoiceData)
    });

    log("Invoice response status", invoiceResponse.status);

    if (!invoiceResponse.ok) {
      const errorText = await invoiceResponse.text();
      log("Invoice creation failed", { status: invoiceResponse.status, error: errorText });
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Failed to create invoice" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    const result = await invoiceResponse.json();
    log("Invoice creation result", result);

    if (!result.success || !result.url) {
      log("Invalid result", result);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Invalid payment response" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    // Save to database (optional, don't fail if it doesn't work)
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? "",
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ""
      );

      await supabase.from('payment_transactions').insert({
        offer_title,
        amount: Number(amount),
        currency,
        customer_name,
        customer_email,
        customer_phone,
        status: 'INITIATED',
        payment_method: 'paylink',
        paylink_transaction_no: result.transactionNo
      });
      
      log("Database record saved");
    } catch (dbError) {
      log("Database save failed (continuing anyway)", dbError);
    }

    // Return success
    const response = {
      success: true,
      url: result.url,
      payment_url: result.url,
      transaction_no: result.transactionNo
    };

    log("Returning success", response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });

  } catch (error) {
    log("Unexpected error", { message: error.message, stack: error.stack });
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || "Unknown error" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});