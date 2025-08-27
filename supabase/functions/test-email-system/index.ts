import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log("🔍 بدء اختبار نظام الإيميل...");

    // اختبار 1: إرسال إيميل ترحيب
    console.log("📧 اختبار إرسال إيميل ترحيب...");
    const welcomeTest = await supabase.functions.invoke('customer-notifications', {
      body: {
        type: 'welcome',
        customerEmail: 'info@alialshehriholding.com',
        customerName: 'فريق الاختبار',
        data: {
          name: 'فريق الاختبار',
          dashboardUrl: 'https://alialshehriholding.com'
        }
      }
    });

    console.log("نتيجة اختبار الترحيب:", welcomeTest);

    // اختبار 2: إرسال إيميل إداري
    console.log("📧 اختبار إرسال إيميل إداري...");
    const adminTest = await supabase.functions.invoke('auth-emails', {
      body: {
        to: 'info@alialshehriholding.com',
        subject: 'اختبار النظام - شركة علي الشهري القابضة',
        type: 'admin_notification',
        data: {
          name: 'مدير النظام',
          email: 'admin@test.com'
        }
      }
    });

    console.log("نتيجة اختبار الإيميل الإداري:", adminTest);

    // اختبار 3: فحص إعدادات RESEND
    const resendKey = Deno.env.get('RESEND_API_KEY');
    console.log("🔑 مفتاح Resend متوفر:", resendKey ? 'نعم' : 'لا');

    // اختبار 4: اختبار إنشاء مستخدم
    console.log("👤 اختبار إنشاء مستخدم تجريبي...");
    const testEmail = `test_${Date.now()}@alialshehriholding.com`;
    
    const userTest = await supabase.functions.invoke('create-admin-user', {
      body: {
        email: testEmail,
        password: 'TestPassword123!',
        fullName: 'مستخدم تجريبي'
      }
    });

    console.log("نتيجة اختبار إنشاء المستخدم:", userTest);

    // تجميع النتائج
    const results = {
      timestamp: new Date().toISOString(),
      tests: {
        welcome_email: {
          status: welcomeTest.error ? 'فشل' : 'نجح',
          error: welcomeTest.error?.message || null,
          data: welcomeTest.data
        },
        admin_email: {
          status: adminTest.error ? 'فشل' : 'نجح',
          error: adminTest.error?.message || null,
          data: adminTest.data
        },
        resend_key: {
          status: resendKey ? 'متوفر' : 'غير متوفر',
          length: resendKey ? resendKey.length : 0
        },
        user_creation: {
          status: userTest.error ? 'فشل' : 'نجح',
          error: userTest.error?.message || null,
          test_email: testEmail
        }
      },
      summary: {
        total_tests: 4,
        passed: [
          !welcomeTest.error,
          !adminTest.error,
          !!resendKey,
          !userTest.error
        ].filter(Boolean).length,
        environment_check: {
          supabase_url: !!Deno.env.get('SUPABASE_URL'),
          supabase_key: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
          resend_key: !!resendKey
        }
      }
    };

    console.log("📊 ملخص نتائج الاختبار:", results.summary);

    return new Response(JSON.stringify({
      success: true,
      message: "تم اختبار النظام بنجاح",
      results
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("❌ خطأ في اختبار النظام:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);