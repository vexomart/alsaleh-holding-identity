import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// إنشاء جدول OTP في الذاكرة المؤقت
const otpCache = new Map<string, { otp: string; expires: number; attempts: number }>();

// تنظيف الرموز المنتهية الصلاحية كل 5 دقائق
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of otpCache.entries()) {
    if (data.expires < now) {
      otpCache.delete(email);
    }
  }
}, 5 * 60 * 1000);

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, email, otp } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (action === "generate") {
      // التحقق من وجود المستخدم
      const { data: user, error: userError } = await supabaseClient
        .from('profiles')
        .select('full_name')
        .eq('user_id', (await supabaseClient.auth.getUserByEmail(email)).data.user?.id)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        throw new Error('خطأ في التحقق من المستخدم');
      }

      // توليد OTP جديد
      const newOTP = generateOTP();
      const expiresAt = Date.now() + (10 * 60 * 1000); // 10 دقائق

      // حفظ OTP في الذاكرة المؤقت
      otpCache.set(email, {
        otp: newOTP,
        expires: expiresAt,
        attempts: 0
      });

      // إرسال OTP بالإيميل
      const emailResponse = await supabaseClient.functions.invoke('auth-emails', {
        body: {
          to: email,
          subject: "رمز التحقق لتسجيل الدخول",
          type: "otp_verification",
          data: {
            name: user?.full_name || '',
            otp: newOTP
          }
        }
      });

      if (emailResponse.error) {
        console.error('خطأ في إرسال الإيميل:', emailResponse.error);
        throw new Error('فشل في إرسال رمز التحقق');
      }

      return new Response(JSON.stringify({
        success: true,
        message: "تم إرسال رمز التحقق إلى إيميلك"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });

    } else if (action === "verify") {
      // التحقق من OTP
      const cachedData = otpCache.get(email);
      
      if (!cachedData) {
        return new Response(JSON.stringify({
          success: false,
          message: "رمز التحقق غير صالح أو منتهي الصلاحية"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }

      // التحقق من انتهاء الصلاحية
      if (cachedData.expires < Date.now()) {
        otpCache.delete(email);
        return new Response(JSON.stringify({
          success: false,
          message: "رمز التحقق منتهي الصلاحية"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }

      // التحقق من عدد المحاولات
      if (cachedData.attempts >= 3) {
        otpCache.delete(email);
        return new Response(JSON.stringify({
          success: false,
          message: "تم تجاوز عدد المحاولات المسموحة"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }

      // التحقق من صحة OTP
      if (cachedData.otp !== otp) {
        cachedData.attempts++;
        return new Response(JSON.stringify({
          success: false,
          message: `رمز التحقق غير صحيح. المحاولات المتبقية: ${3 - cachedData.attempts}`
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }

      // OTP صحيح - إزالته من الذاكرة المؤقت
      otpCache.delete(email);

      // إنشاء رمز مميز للجلسة
      const sessionToken = crypto.randomUUID();
      
      return new Response(JSON.stringify({
        success: true,
        message: "تم التحقق بنجاح",
        sessionToken
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });

    } else {
      throw new Error('إجراء غير صالح');
    }

  } catch (error: any) {
    console.error("خطأ في OTP:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
};

serve(handler);