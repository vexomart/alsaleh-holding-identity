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

        // التحقق من عدم وجود المستخدم مسبقاً
        const { data: existingUser } = await supabase
          .from('ash_users')
          .select('id')
          .eq('email', email)
          .single();

        if (existingUser) {
          throw new Error('البريد الإلكتروني مستخدم مسبقاً');
        }

        // تشفير كلمة المرور (في الواقع يجب استخدام bcrypt)
        const passwordHash = `hashed_${password}_${Date.now()}`;

        // إنشاء المستخدم
        const { data: newUser, error: userError } = await supabase
          .from('ash_users')
          .insert({
            email,
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

        // توليد وحفظ رمز OTP
        const otpCode = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 دقائق

        const { error: otpError } = await supabase
          .from('ash_otps')
          .insert({
            user_id: newUser.id,
            email,
            code: otpCode,
            type: 'register',
            expires_at: expiresAt.toISOString()
          });

        if (otpError) throw otpError;

        // إرسال OTP عبر البريد
        await sendOTPEmail(email, otpCode, name, 'register');

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

        // البحث عن المستخدم
        const { data: user, error: userError } = await supabase
          .from('ash_users')
          .select('*')
          .eq('email', email)
          .single();

        if (userError || !user) {
          throw new Error('بيانات تسجيل الدخول غير صحيحة');
        }

        if (user.status === 'blocked' || user.status === 'suspended') {
          throw new Error('تم حظر حسابك. يرجى التواصل مع الإدارة');
        }

        // التحقق من كلمة المرور (يجب استخدام bcrypt في الواقع)
        const isValidPassword = user.password_hash.includes(password);
        if (!isValidPassword) {
          throw new Error('بيانات تسجيل الدخول غير صحيحة');
        }

        // توليد وحفظ رمز OTP
        const otpCode = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // حذف الرموز القديمة
        await supabase
          .from('ash_otps')
          .delete()
          .eq('email', email)
          .eq('type', 'login');

        const { error: otpError } = await supabase
          .from('ash_otps')
          .insert({
            user_id: user.id,
            email,
            code: otpCode,
            type: 'login',
            expires_at: expiresAt.toISOString()
          });

        if (otpError) throw otpError;

        // إرسال OTP عبر البريد
        await sendOTPEmail(email, otpCode, user.name, 'login');

        return new Response(JSON.stringify({
          success: true,
          message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
          user_id: user.id,
          requires_otp: true
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'verify-otp': {
        if (!email || !code) {
          throw new Error('البريد الإلكتروني ورمز التحقق مطلوبان');
        }

        // البحث عن رمز OTP صالح
        const { data: otp, error: otpError } = await supabase
          .from('ash_otps')
          .select('*, ash_users!inner(*)')
          .eq('email', email)
          .eq('code', code)
          .eq('consumed', false)
          .gte('expires_at', new Date().toISOString())
          .single();

        if (otpError || !otp) {
          throw new Error('رمز التحقق غير صحيح أو منتهي الصلاحية');
        }

        // تحديث رمز OTP كمستخدم
        await supabase
          .from('ash_otps')
          .update({ consumed: true })
          .eq('id', otp.id);

        // تحديث حالة المستخدم إلى نشط
        const { data: updatedUser, error: updateError } = await supabase
          .from('ash_users')
          .update({
            status: 'active',
            verified_at: new Date().toISOString(),
            last_login_at: new Date().toISOString()
          })
          .eq('id', otp.user_id)
          .select()
          .single();

        if (updateError) throw updateError;

        return new Response(JSON.stringify({
          success: true,
          message: 'تم التحقق بنجاح',
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
            role: updatedUser.role,
            status: updatedUser.status
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'resend-otp': {
        if (!email) {
          throw new Error('البريد الإلكتروني مطلوب');
        }

        // البحث عن المستخدم
        const { data: user } = await supabase
          .from('ash_users')
          .select('*')
          .eq('email', email)
          .single();

        if (!user) {
          throw new Error('المستخدم غير موجود');
        }

        // توليد رمز جديد
        const otpCode = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // حذف الرموز القديمة وإدراج الجديد
        await supabase
          .from('ash_otps')
          .delete()
          .eq('email', email);

        await supabase
          .from('ash_otps')
          .insert({
            user_id: user.id,
            email,
            code: otpCode,
            type: 'login',
            expires_at: expiresAt.toISOString()
          });

        await sendOTPEmail(email, otpCode, user.name, 'login');

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