import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🚀 Simple Auth function initialized');

// دوال مساعدة
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

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, email, password, name, phone, code, company_name } = await req.json();
    console.log(`🔐 Simple Auth Action: ${action} for ${email}`);

    const normalizedEmail = normalizeEmail(email || '');

    switch (action) {
      case 'register': {
        // التحقق من البيانات المطلوبة
        if (!email || !password || !name) {
          throw new Error('البريد الإلكتروني والاسم وكلمة المرور مطلوبة');
        }

        if (password.length < 8) {
          throw new Error('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
        }

        // التحقق من وجود المستخدم
        const { data: existingUser } = await supabase
          .from('ash_users')
          .select('id')
          .eq('email_lower', normalizedEmail)
          .maybeSingle();

        if (existingUser) {
          throw new Error('البريد الإلكتروني مسجّل مسبقًا');
        }

        // إنشاء salt وhash
        const salt = Array.from(crypto.getRandomValues(new Uint8Array(32)))
          .map(b => b.toString(16).padStart(2, '0')).join('');
        const passwordHash = await hashPassword(password, salt);

        // إنشاء المستخدم
        const { data: newUser, error: userError } = await supabase
          .from('ash_users')
          .insert({
            email: email,
            email_lower: normalizedEmail,
            name: name.trim(),
            phone: phone?.trim() || null,
            company_name: company_name?.trim() || null,
            password_hash: passwordHash,
            password_salt: salt,
            password_hash_version: 'sha256',
            role: 'client',
            status: 'pending'
          })
          .select()
          .single();

        if (userError) {
          console.error('User creation error:', userError);
          throw new Error('فشل في إنشاء الحساب');
        }

        // إنشاء OTP
        const otpCode = generateOTP();
        const { error: otpError } = await supabase
          .from('ash_email_otps')
          .insert({
            user_id: newUser.id,
            email_lower: normalizedEmail,
            code: otpCode,
            normalized_code: normalizeDigits(otpCode),
            type: 'register',
            expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
          });

        if (otpError) {
          console.error('OTP creation error:', otpError);
          // لا نرمي خطأ هنا، المستخدم تم إنشاؤه بنجاح
        }

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

        // البحث عن المستخدم
        const { data: user, error: userError } = await supabase
          .from('ash_users')
          .select('*')
          .eq('email_lower', normalizedEmail)
          .maybeSingle();

        if (userError || !user) {
          throw new Error('البريد الإلكتروني غير مسجل في النظام');
        }

        // التحقق من حالة المستخدم
        if (user.status === 'blocked') {
          throw new Error('تم حظر حسابك. يرجى التواصل مع الإدارة');
        }

        if (user.status === 'inactive') {
          throw new Error('حسابك غير مفعل. يرجى التواصل مع الإدارة');
        }

        // التحقق من كلمة المرور
        const salt = user.password_salt || '';
        const passwordHash = await hashPassword(password, salt);

        if (user.password_hash !== passwordHash) {
          throw new Error('كلمة المرور غير صحيحة');
        }

        // إنشاء OTP لتسجيل الدخول
        const otpCode = generateOTP();
        const { error: otpError } = await supabase
          .from('ash_email_otps')
          .insert({
            user_id: user.id,
            email_lower: normalizedEmail,
            code: otpCode,
            normalized_code: normalizeDigits(otpCode),
            type: 'login',
            expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
          });

        if (otpError) {
          console.error('OTP creation error:', otpError);
          throw new Error('فشل في إنشاء رمز التحقق');
        }

        // تحديث آخر تسجيل دخول
        await supabase
          .from('ash_users')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', user.id);

        console.log(`✅ Login OTP sent: ${normalizedEmail}, OTP: ${otpCode}`);

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

        const normalizedCode = normalizeDigits(code);

        // البحث عن OTP صالح
        const { data: otp, error: otpError } = await supabase
          .from('ash_email_otps')
          .select('*')
          .eq('email_lower', normalizedEmail)
          .eq('consumed', false)
          .gt('expires_at', new Date().toISOString())
          .or(`code.eq.${code},normalized_code.eq.${normalizedCode}`)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (otpError || !otp) {
          throw new Error('رمز التحقق غير صحيح أو منتهي الصلاحية');
        }

        // تحديث OTP كمستهلك
        await supabase
          .from('ash_email_otps')
          .update({ 
            consumed: true, 
            consumed_at: new Date().toISOString() 
          })
          .eq('id', otp.id);

        // تحديث حالة المستخدم
        if (otp.type === 'register') {
          await supabase
            .from('ash_users')
            .update({
              status: 'active',
              verified_at: new Date().toISOString(),
              email_verified_at: new Date().toISOString()
            })
            .eq('id', otp.user_id);
        }

        // جلب بيانات المستخدم
        const { data: userData } = await supabase
          .from('ash_users')
          .select('id, email, name, role, status, verified_at, email_verified_at')
          .eq('id', otp.user_id)
          .single();

        console.log(`✅ OTP verified successfully: ${normalizedEmail}`);

        return new Response(JSON.stringify({
          success: true,
          message: 'تم التحقق بنجاح. حسابك مفعل الآن.',
          user: userData,
          redirect_url: userData.role === 'admin' ? '/admin/dashboard' : '/client/dashboard'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      default:
        throw new Error('عملية غير معروفة');
    }

  } catch (error: any) {
    console.error('❌ Simple Auth Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: error.message || 'حدث خطأ غير متوقع'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});