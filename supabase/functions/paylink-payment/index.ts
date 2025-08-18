import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🚀 Paylink Payment Started");
    const body = await req.json();
    console.log("📦 Request Body:", JSON.stringify(body, null, 2));

    // Input validation and sanitization
    const sanitizeInput = (input: string): string => {
      if (!input || typeof input !== 'string') return '';
      return input
        .replace(/<[^>]*>/g, '')
        .replace(/[<>\"\']/g, '')
        .trim()
        .substring(0, 500);
    };

    const validateEmail = (email: string): boolean => {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      return emailRegex.test(email) && email.length <= 254;
    };

    const validatePhone = (phone: string): boolean => {
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
      const phoneRegex = /^(\+966|966|0)?[5][0-9]{8}$/;
      return phoneRegex.test(cleanPhone);
    };

    const {
      amount,
      customer_name = 'عميل محتمل', 
      customer_email = 'customer@example.com',
      customer_phone = '966500000000',
      offer_title = 'خدمة تسويقية',
      description = 'دفع خدمة',
      currency = 'SAR',
      success_url = 'https://preview--alsaleh-holding-identity.lovable.app',
      product_details = null // For creating product orders
    } = body;

    // Sanitize all string inputs
    const sanitizedData = {
      customer_name: sanitizeInput(customer_name),
      customer_email: sanitizeInput(customer_email),
      customer_phone: sanitizeInput(customer_phone),
      offer_title: sanitizeInput(offer_title),
      description: sanitizeInput(description),
      currency: sanitizeInput(currency)
    };

    // Validate email and phone
    if (sanitizedData.customer_email !== 'customer@example.com' && !validateEmail(sanitizedData.customer_email)) {
      console.error("❌ Invalid email format");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Invalid email format" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      });
    }

    if (sanitizedData.customer_phone !== '966500000000' && !validatePhone(sanitizedData.customer_phone)) {
      console.error("❌ Invalid phone format");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Invalid phone format" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      });
    }

    // Validate and process amount
    const processedAmount = amount && amount > 0 && amount <= 1000000 ? Number(amount) : 1499; // Max 1M SAR
    console.log("💰 Processing amount:", { received: amount, processed: processedAmount });

    // Additional amount validation
    if (isNaN(processedAmount) || processedAmount < 1 || processedAmount > 1000000) {
      console.error("❌ Invalid amount");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Invalid amount" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      });
    }

    // Get API credentials
    const apiId = Deno.env.get('PAYLINK_API_ID');
    const apiKey = Deno.env.get('PAYLINK_API_KEY');

    console.log("🔐 Checking credentials...");
    if (!apiId || !apiKey) {
      console.error("❌ Missing Paylink credentials");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "API credentials not configured" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    console.log("✅ Credentials OK, authenticating...");

    // Auth with Paylink
    const authResponse = await fetch('https://restapi.paylink.sa/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiId: apiId,
        secretKey: apiKey,
        persistToken: false
      })
    });

    if (!authResponse.ok) {
      console.error("❌ Auth failed:", authResponse.status);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Authentication failed" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    const authData = await authResponse.json();
    console.log("✅ Auth successful");

    if (!authData.id_token) {
      console.error("❌ No token received");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "No authentication token" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    // Create unique order number
    const orderNumber = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const invoiceData = {
      amount: processedAmount,
      orderNumber: orderNumber,
      callBackUrl: 'https://alialshehriholding.com/payment-success',
      cancelUrl: 'https://alialshehriholding.com/payment-cancel',
      clientEmail: sanitizedData.customer_email,
      clientName: sanitizedData.customer_name,
      clientMobile: sanitizedData.customer_phone.toString().replace(/^\+?966/, "0"),
      note: sanitizedData.description,
      products: [{
        title: sanitizedData.offer_title,
        price: processedAmount,
        qty: 1,
        description: sanitizedData.description,
        isDigital: true
      }],
      supportedCardBrands: ["mada", "visaMastercard"],
      currency: "SAR"
    };

    console.log("📄 Creating invoice:", JSON.stringify(invoiceData, null, 2));

    // Create invoice
    const invoiceResponse = await fetch('https://restapi.paylink.sa/api/addInvoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.id_token}`
      },
      body: JSON.stringify(invoiceData)
    });

    if (!invoiceResponse.ok) {
      console.error("❌ Invoice creation failed:", invoiceResponse.status);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Invoice creation failed" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    const result = await invoiceResponse.json();
    console.log("📄 Invoice result:", JSON.stringify(result, null, 2));

    if (!result.success || !result.url) {
      console.error("❌ Invalid invoice response");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Invalid payment response" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let productOrder = null;

    // Create product order if product_details are provided
    if (product_details) {
      console.log("📦 Creating product order...");
      const { data: orderData, error: orderError } = await supabase
        .from('product_orders')
        .insert({
          customer_name: sanitizedData.customer_name,
          customer_email: sanitizedData.customer_email,
          customer_phone: sanitizedData.customer_phone,
          product_id: product_details.product_id,
          product_name: product_details.product_name,
          product_price: processedAmount,
          product_version: product_details.product_version || 'V 1.0',
          currency: sanitizedData.currency,
          status: 'pending',
          payment_method: 'paylink',
          payment_reference: result.transactionNo
        })
        .select('*')
        .single();

      if (orderError) {
        console.error("⚠️ Product order error:", orderError);
      } else {
        console.log("✅ Product order created:", orderData.order_number);
        productOrder = orderData;

        // Send notification emails in background
        try {
          const emailData = {
            orderId: orderData.id,
            orderNumber: orderData.order_number,
            customerName: orderData.customer_name,
            customerEmail: orderData.customer_email,
            customerPhone: orderData.customer_phone,
            productName: orderData.product_name,
            productPrice: orderData.product_price,
            productVersion: orderData.product_version,
            currency: orderData.currency,
            orderDate: orderData.created_at
          };

          supabase.functions.invoke('order-notifications', {
            body: { orderData: emailData }
          });
          console.log("📧 Email notifications triggered");
        } catch (emailError) {
          console.error("⚠️ Email notification error:", emailError);
        }
      }
    }

    // Save payment transaction
    console.log("💾 Saving transaction...");
    const { error: dbError } = await supabase
      .from('payment_transactions')
      .insert({
        offer_title: sanitizedData.offer_title,
        amount: processedAmount,
        currency: sanitizedData.currency,
        customer_name: sanitizedData.customer_name,
        customer_email: sanitizedData.customer_email,
        customer_phone: sanitizedData.customer_phone,
        payment_method: 'paylink',
        status: 'pending',
        paylink_transaction_no: result.transactionNo
      });

    if (dbError) {
      console.error("⚠️ Transaction save error:", dbError);
    } else {
      console.log("✅ Transaction saved");
    }

    console.log("🎉 Payment URL created:", result.url);

    return new Response(JSON.stringify({
      success: true,
      payment_url: result.url,
      url: result.url,
      transaction_no: result.transactionNo,
      order_number: productOrder?.order_number || null
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });

  } catch (error) {
    console.error("💥 Error:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});