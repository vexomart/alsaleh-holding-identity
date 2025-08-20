import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const cleanString = (str: string): string => {
  if (!str) return '';
  return str.replace(/[^\w\s@.-]/g, '').trim();
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const formatPhoneNumber = (phone: string): string => {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '966' + cleaned.substring(1);
  } else if (!cleaned.startsWith('966')) {
    cleaned = '966' + cleaned;
  }
  return cleaned;
};

serve(async (req) => {
  console.log('🚀 TAP Payment Started');
  console.log('📋 Request method:', req.method);
  console.log('📋 Content-Type:', req.headers.get('content-type'));
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log('📨 Request body received:', JSON.stringify(requestBody, null, 2));

    const {
      amount,
      currency = 'SAR',
      customer_name,
      customer_email,
      customer_phone,
      offer_title,
      description,
      product_details
    } = requestBody;

    // التحقق من البيانات المطلوبة
    if (!amount || !customer_name || !customer_email || !customer_phone) {
      console.error('❌ Missing required fields');
      return new Response(JSON.stringify({
        success: false,
        error: 'البيانات المطلوبة مفقودة'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // تنظيف البيانات
    const cleanedData = {
      amount: Number(amount),
      currency: cleanString(currency),
      customer_name: cleanString(customer_name),
      customer_email: cleanString(customer_email),
      customer_phone: formatPhoneNumber(customer_phone),
      offer_title: cleanString(offer_title),
      description: cleanString(description)
    };

    // التحقق من صحة البيانات
    if (!isValidEmail(cleanedData.customer_email)) {
      console.error('❌ Invalid email format');
      return new Response(JSON.stringify({
        success: false,
        error: 'صيغة البريد الإلكتروني غير صحيحة'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('✅ Cleaned data:', JSON.stringify(cleanedData, null, 2));

    // إنشاء طلب دفع TAP
    const tapSecretKey = Deno.env.get('TAP_SECRET_KEY');
    if (!tapSecretKey) {
      console.error('❌ TAP secret key not found');
      return new Response(JSON.stringify({
        success: false,
        error: 'مفتاح TAP غير مكون'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const tapPayload = {
      amount: cleanedData.amount,
      currency: cleanedData.currency,
      threeDSecure: true,
      save_card: false,
      description: cleanedData.description,
      statement_descriptor: "Ali Alshehri Holding",
      metadata: {
        udf1: cleanedData.offer_title,
        udf2: product_details?.product_name || "منتج",
        udf3: product_details?.product_version || "V1.0"
      },
      reference: {
        transaction: `TAP-${Date.now()}`,
        order: `ORD-${Date.now()}`
      },
      receipt: {
        email: true,
        sms: true
      },
      customer: {
        first_name: cleanedData.customer_name.split(' ')[0] || cleanedData.customer_name,
        last_name: cleanedData.customer_name.split(' ').slice(1).join(' ') || '',
        email: cleanedData.customer_email,
        phone: {
          country_code: '966',
          number: cleanedData.customer_phone.replace('966', '')
        }
      },
      source: {
        id: "src_all"
      },
      post: {
        url: `${req.headers.get('origin') || 'https://alialshehriholding.com'}/payment-success`
      },
      redirect: {
        url: `${req.headers.get('origin') || 'https://alialshehriholding.com'}/payment-success`
      }
    };

    console.log('📤 TAP API Request:', JSON.stringify(tapPayload, null, 2));

    // إرسال طلب إلى TAP API
    const tapResponse = await fetch('https://api.tap.company/v2/charges', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tapSecretKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(tapPayload)
    });

    const tapResult = await tapResponse.json();
    console.log('📥 TAP API Response:', JSON.stringify(tapResult, null, 2));

    if (!tapResponse.ok) {
      console.error('❌ TAP API Error:', tapResult);
      return new Response(JSON.stringify({
        success: false,
        error: tapResult.message || 'فشل في إنشاء رابط الدفع من TAP'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // حفظ معاملة الدفع في قاعدة البيانات
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: dbError } = await supabase
      .from('payment_transactions')
      .insert({
        tap_charge_id: tapResult.id,
        amount: cleanedData.amount,
        currency: cleanedData.currency,
        customer_name: cleanedData.customer_name,
        customer_email: cleanedData.customer_email,
        customer_phone: cleanedData.customer_phone,
        status: 'pending',
        payment_method: 'tap',
        description: cleanedData.description,
        metadata: {
          offer_title: cleanedData.offer_title,
          product_details: product_details,
          tap_response: tapResult
        }
      });

    if (dbError) {
      console.error('❌ Database error:', dbError);
    } else {
      console.log('✅ Payment transaction saved to database');
    }

    // إرجاع رابط الدفع
    console.log('✅ TAP payment created successfully');
    return new Response(JSON.stringify({
      success: true,
      payment_url: tapResult.transaction?.url,
      charge_id: tapResult.id,
      status: tapResult.status
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('💥 Error processing TAP payment:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'حدث خطأ أثناء معالجة الطلب'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});