import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const resendApiKey = Deno.env.get('RESEND_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// دوال مساعدة للتطبيع
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeDigits(text: string): string {
  return text.replace(/[٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹]/g, (match) => {
    const arabicToEnglish: Record<string, string> = {
      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
      '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
      '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
      '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9'
    };
    return arabicToEnglish[match] || match;
  });
}

interface AuthRequest {
  action: 'register' | 'login' | 'verify-otp' | 'resend-otp';
  email: string;
  password?: string;
  name?: string;
  phone?: string;
  code?: string;
  company_name?: string;
}

// توليد رمز OTP عشوائي
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// إرسال OTP عبر البريد الإلكتروني
async function sendOTPEmail(email: string, code: string, name: string, type: string) {
  if (!resend) {
    console.log('📧 Resend not configured, OTP would be:', code);
    return { success: true, simulation: true };
  }

  const subject = type === 'register' ? 'مرحباً بك في ASH HOLDING' : 'رمز تسجيل الدخول - ASH HOLDING';
  const html = `
    <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
      <div style="padding: 40px 30px; text-align: center;">
        <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: bold;">ASH HOLDING</h1>
        <div style="background: rgba(255,255,255,0.95); color: #333; padding: 30px; border-radius: 15px; margin: 20px 0;">
          <h2 style="color: #667eea; margin: 0 0 20px 0;">مرحباً ${name}</h2>
          <p style="font-size: 16px; line-height: 1.6; margin: 20px 0;">
            ${type === 'register' ? 'شكراً لانضمامك إلى ASH HOLDING. ' : ''}
            رمز التحقق الخاص بك هو:
          </p>
          <div style="background: #f8f9fa; border: 2px solid #667eea; border-radius: 10px; padding: 20px; margin: 25px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">${code}</span>
          </div>
          <p style="color: #666; font-size: 14px; margin: 20px 0;">
            هذا الرمز صالح لمدة 10 دقائق فقط<br>
            إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة
          </p>
        </div>
      </div>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: 'ASH HOLDING <noreply@ashholding.com>',
      to: [email],
      subject,
      html,
    });
    console.log('✅ Email sent successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ Email send failed:', error);
    return { success: false, error: error.message };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, email, password, name, phone, code, company_name }: AuthRequest = await req.json();

    console.log(`🔐 ASH Auth Action: ${action} for ${email}`);

    switch (action) {
      case 'register': {
        if (!email || !password || !name) {
          throw new Error('البريد الإلكتروني وكلمة المرور والاسم مطلوبة');
        }

        const normalizedEmail = normalizeEmail(email);
        
        // التحقق من عدم وجود المستخدم مسبقاً
        const { data: existingUser } = await supabase
          .from('ash_users')
          .select('id')
          .eq('email_lower', normalizedEmail)
          .maybeSingle();

        if (existingUser) {
          throw new Error('البريد الإلكتروني مستخدم مسبقاً. لديك حساب؟ جرّب تسجيل الدخول أو استعادة كلمة المرور.');
        }

        // تشفير كلمة المرور (في الواقع يجب استخدام bcrypt)
        const passwordHash = `hashed_${password}_${Date.now()}`;

        // إنشاء المستخدم مع email_lower
        const { data: newUser, error: userError } = await supabase
          .from('ash_users')
          .insert({
            email: email,
            email_lower: normalizedEmail,
            name,
            phone,
            company_name,
            password_hash: passwordHash,
            role: 'client',
            status: 'pending'
          })
          .select()
          .single();

        if (userError) throw userError;

        // استخدام دالة إنشاء OTP الجديدة
        const { data: otpCode, error: otpError } = await supabase.rpc(
          'create_otp_code',
          {
            p_user_id: newUser.id,
            p_email: email,
            p_type: 'register'
          }
        );

        if (otpError) {
          console.error('OTP creation error:', otpError);
          throw new Error('فشل في إنشاء رمز التحقق');
        }

        // إرسال OTP عبر البريد
        await sendOTPEmail(email, otpCode, name, 'register');

        console.log(`✅ User registered: ${normalizedEmail}, OTP: ${otpCode}`);

        return new Response(JSON.stringify({
          success: true,
          message: 'تم إنشاء الحساب بنجاح. تحقق من بريدك الإلكتروني لرمز التأكيد',
          user_id: newUser.id
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'login': {
        if (!email || !password) {
          throw new Error('البريد الإلكتروني وكلمة المرور مطلوبان');
        }

        // استخدام دالة المصادقة المحسّنة
        const { data: authResult, error: authError } = await supabase.rpc(
          'authenticate_user',
          {
            p_email: email,
            p_password: password
          }
        );

        if (authError || !authResult || authResult.length === 0) {
          console.error('Authentication error:', authError);
          throw new Error('خطأ في تسجيل الدخول');
        }

        const result = authResult[0];
        
        if (!result.success) {
          // رسائل خطأ محددة حسب حالة الحساب
          if (result.status === 'not_verified') {
            throw new Error('الرجاء تفعيل بريدك الإلكتروني قبل تسجيل الدخول');
          } else if (result.status === 'blocked' || result.status === 'suspended') {
            throw new Error('تم حظر حسابك. يرجى التواصل مع الإدارة');
          } else {
            throw new Error(result.message || 'بيانات تسجيل الدخول غير صحيحة');
          }
        }

        // إنشاء OTP للمستخدم المعتمد وتحديث وقت آخر دخول
        const [otpResult, updateResult] = await Promise.all([
          supabase.rpc('create_otp_code', {
            p_user_id: result.user_id,
            p_email: email,
            p_type: 'login'
          }),
          supabase
            .from('ash_users')
            .update({ last_login_at: new Date().toISOString() })
            .eq('id', result.user_id)
        ]);

        if (otpResult.error) {
          console.error('OTP creation error:', otpResult.error);
          throw new Error('فشل في إنشاء رمز التحقق');
        }

        const otpCode = otpResult.data;

        // البحث عن اسم المستخدم للإيميل
        const { data: userData } = await supabase
          .from('ash_users')
          .select('name')
          .eq('id', result.user_id)
          .single();

        // إرسال OTP عبر البريد
        await sendOTPEmail(email, otpCode, userData?.name || 'مستخدم', 'login');

        console.log(`✅ Login OTP sent: ${normalizeEmail(email)}, OTP: ${otpCode}`);

        return new Response(JSON.stringify({
          success: true,
          message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
          user_id: result.user_id,
          requires_otp: true
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'verify-otp': {
        if (!email || !code) {
          throw new Error('البريد الإلكتروني ورمز التحقق مطلوبان');
        }

        // تطبيع الرمز لدعم الأرقام العربية
        const normalizedCode = normalizeDigits(code);
        
        // استخدام دالة التحقق المحسّنة
        const { data: verifyResult, error: verifyError } = await supabase.rpc(
          'verify_otp_code',
          {
            p_email: email,
            p_code: normalizedCode,
            p_type: 'login' // يمكن أن يكون register أو login
          }
        );

        if (verifyError || !verifyResult || verifyResult.length === 0) {
          console.error('OTP verification error:', verifyError);
          throw new Error('خطأ في التحقق من الرمز');
        }

        const result = verifyResult[0];
        
        if (!result.success) {
          throw new Error(result.message || 'رمز التحقق غير صحيح أو منتهي الصلاحية');
        }

        // الحصول على بيانات المستخدم المحدّثة
        const { data: userData, error: userError } = await supabase
          .from('ash_users')
          .select('id, email, name, role, status, verified_at')
          .eq('id', result.user_id)
          .single();

        if (userError) {
          console.error('User fetch error:', userError);
          throw new Error('خطأ في الحصول على بيانات المستخدم');
        }

        console.log(`✅ OTP verified successfully: ${normalizeEmail(email)}, Status: ${userData.status}`);

        return new Response(JSON.stringify({
          success: true,
          message: 'تم التحقق بنجاح. يمكنك الآن تسجيل الدخول بنفس البريد وكلمة المرور.',
          user: {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            status: userData.status,
            verified: userData.verified_at !== null
          },
          redirect_url: userData.role === 'admin' ? '/admin/dashboard' : '/my-projects'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'resend-otp': {
        if (!email) {
          throw new Error('البريد الإلكتروني مطلوب');
        }

        const normalizedEmail = normalizeEmail(email);

        // البحث عن المستخدم
        const { data: user } = await supabase
          .from('ash_users')
          .select('*')
          .eq('email_lower', normalizedEmail)
          .maybeSingle();

        if (!user) {
          throw new Error('المستخدم غير موجود');
        }

        // استخدام دالة إنشاء OTP الجديدة
        const { data: otpCode, error: otpError } = await supabase.rpc(
          'create_otp_code',
          {
            p_user_id: user.id,
            p_email: email,
            p_type: 'login'
          }
        );

        if (otpError) {
          console.error('OTP creation error:', otpError);
          throw new Error('فشل في إنشاء رمز التحقق');
        }

        await sendOTPEmail(email, otpCode, user.name, 'login');

        console.log(`✅ OTP resent: ${normalizedEmail}, OTP: ${otpCode}`);

        return new Response(JSON.stringify({
          success: true,
          message: 'تم إرسال رمز جديد إلى بريدك الإلكتروني'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      default:
        throw new Error('عملية غير معروفة');
    }

  } catch (error) {
    console.error('❌ ASH Auth Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});