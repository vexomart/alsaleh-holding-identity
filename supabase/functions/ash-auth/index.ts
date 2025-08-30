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

// Helper functions with enhanced validation
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

function validateName(name: string): { valid: boolean; message: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, message: 'الاسم مطلوب' };
  }
  if (name.trim().length < 3) {
    return { valid: false, message: 'يجب أن يتكون الاسم من 3 أحرف على الأقل' };
  }
  if (name.trim().length > 120) {
    return { valid: false, message: 'طول الاسم يتجاوز الحد المسموح (120 حرف)' };
  }
  return { valid: true, message: '' };
}

function validateEmail(email: string): { valid: boolean; message: string; normalized: string } {
  if (!email || email.trim().length === 0) {
    return { valid: false, message: 'البريد الإلكتروني مطلوب', normalized: '' };
  }
  
  const normalized = normalizeEmail(email);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(normalized)) {
    return { valid: false, message: 'تنسيق البريد الإلكتروني غير صحيح', normalized: '' };
  }
  
  if (normalized.length > 190) {
    return { valid: false, message: 'طول البريد الإلكتروني يتجاوز الحد المسموح', normalized: '' };
  }
  
  return { valid: true, message: '', normalized };
}

function validatePassword(password: string): { valid: boolean; message: string } {
  if (!password || password.length === 0) {
    return { valid: false, message: 'كلمة المرور مطلوبة' };
  }
  if (password.length < 8) {
    return { valid: false, message: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'يجب أن تحتوي كلمة المرور على رقم واحد على الأقل' };
  }
  if (!/[a-zA-Z]/.test(password)) {
    return { valid: false, message: 'يجب أن تحتوي كلمة المرور على حرف واحد على الأقل' };
  }
  return { valid: true, message: '' };
}

async function logAuthAttempt(
  emailLower: string, 
  result: string, 
  errorCode?: string, 
  errorConstraint?: string,
  request?: Request
) {
  try {
    const ipAddress = request?.headers.get('x-forwarded-for') || 
                     request?.headers.get('x-real-ip') || 
                     null;
    const userAgent = request?.headers.get('user-agent') || null;
    
    await supabase.rpc('log_auth_attempt', {
      p_email_lower: emailLower,
      p_result: result,
      p_error_code: errorCode || null,
      p_error_constraint: errorConstraint || null,
      p_ip_address: ipAddress,
      p_user_agent: userAgent
    });
  } catch (error) {
    console.error('Failed to log auth attempt:', error);
  }
}

function getDbErrorMessage(error: any): { message: string; code?: string; constraint?: string } {
  const code = error?.code || error?.error_code;
  const constraint = error?.constraint;
  
  // Handle duplicate email
  if (code === '23505' && constraint === 'idx_ash_users_email_lower') {
    return { 
      message: 'البريد الإلكتروني مسجّل مسبقًا. جرّب تسجيل الدخول أو استعادة كلمة المرور.',
      code,
      constraint
    };
  }
  
  // Handle not null violations
  if (code === '23502') {
    const field = constraint?.includes('name') ? 'الاسم' :
                  constraint?.includes('email') ? 'البريد الإلكتروني' :
                  constraint?.includes('password') ? 'كلمة المرور' : 'حقل مطلوب';
    return { 
      message: `حقل مفقود: ${field}`,
      code,
      constraint
    };
  }
  
  // Handle string too long
  if (code === '22001') {
    return { 
      message: 'طول أحد الحقول يتجاوز الحد المسموح',
      code,
      constraint
    };
  }
  
  console.error('Database error:', {
    code,
    constraint,
    message: error?.message,
    details: error?.details
  });
  
  return { 
    message: 'تعذر إنشاء الحساب. الرجاء المحاولة لاحقًا.',
    code,
    constraint
  };
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
        // Validate inputs first
        const nameValidation = validateName(name || '');
        if (!nameValidation.valid) {
          await logAuthAttempt(normalizeEmail(email || ''), 'invalid', 'validation_error', 'name_invalid', req);
          throw new Error(nameValidation.message);
        }

        const emailValidation = validateEmail(email || '');
        if (!emailValidation.valid) {
          await logAuthAttempt(normalizeEmail(email || ''), 'invalid', 'validation_error', 'email_invalid', req);
          throw new Error(emailValidation.message);
        }

        const passwordValidation = validatePassword(password || '');
        if (!passwordValidation.valid) {
          await logAuthAttempt(emailValidation.normalized, 'invalid', 'validation_error', 'password_invalid', req);
          throw new Error(passwordValidation.message);
        }

        const normalizedEmail = emailValidation.normalized;
        
        // Check if user already exists using database-level transaction
        const { data: existingUser } = await supabase
          .from('ash_users')
          .select('id')
          .eq('email_lower', normalizedEmail)
          .maybeSingle();

        if (existingUser) {
          await logAuthAttempt(normalizedEmail, 'duplicate', '23505', 'idx_ash_users_email_lower', req);
          throw new Error('البريد الإلكتروني مسجّل مسبقًا. جرّب تسجيل الدخول أو استعادة كلمة المرور.');
        }

        // Hash password securely using database function
        const { data: passwordHash, error: hashError } = await supabase.rpc(
          'create_secure_password_hash',
          { password_text: password }
        );

        if (hashError) {
          console.error('Password hashing error:', hashError);
          await logAuthAttempt(normalizedEmail, 'db_error', 'password_hashing_failed', null, req);
          throw new Error('فشل في تشفير كلمة المرور');
        }

        try {
          // Create user with transactional approach
          const { data: newUser, error: userError } = await supabase
            .from('ash_users')
            .insert({
              email: email,
              email_lower: normalizedEmail,
              name: name.trim(),
              phone: phone?.trim() || null,
              company_name: company_name?.trim() || null,
              password_hash: passwordHash,
              role: 'client',
              status: 'pending'
            })
            .select()
            .single();

          if (userError) {
            const dbError = getDbErrorMessage(userError);
            await logAuthAttempt(normalizedEmail, 'db_error', dbError.code, dbError.constraint, req);
            throw new Error(dbError.message);
          }

          // Create OTP using database function
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
            await logAuthAttempt(normalizedEmail, 'db_error', 'otp_creation_failed', null, req);
            throw new Error('فشل في إنشاء رمز التحقق');
          }

          // Send OTP email outside transaction
          await sendOTPEmail(email, otpCode, name, 'register');

          // Log successful registration
          await logAuthAttempt(normalizedEmail, 'success', null, null, req);

          console.log(`✅ User registered: ${normalizedEmail}, OTP: ${otpCode}`);

          return new Response(JSON.stringify({
            success: true,
            message: 'تم إنشاء الحساب بنجاح. تحقق من بريدك الإلكتروني لرمز التأكيد',
            user_id: newUser.id
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });

        } catch (dbError: any) {
          const errorDetails = getDbErrorMessage(dbError);
          await logAuthAttempt(normalizedEmail, 'db_error', errorDetails.code, errorDetails.constraint, req);
          throw new Error(errorDetails.message);
        }
      }

      case 'login': {
        const emailValidation = validateEmail(email || '');
        if (!emailValidation.valid) {
          await logAuthAttempt(normalizeEmail(email || ''), 'invalid', 'validation_error', 'email_invalid', req);
          throw new Error(emailValidation.message);
        }

        const passwordValidation = validatePassword(password || '');
        if (!passwordValidation.valid) {
          await logAuthAttempt(emailValidation.normalized, 'invalid', 'validation_error', 'password_invalid', req);
          throw new Error(passwordValidation.message);
        }

        // Use simplified authentication function
        const { data: authResult, error: authError } = await supabase.rpc(
          'simple_authenticate_user',
          {
            p_email: email,
            p_password: password
          }
        );

        console.log('🔍 Authentication result:', { authResult, authError });

        if (authError) {
          console.error('Authentication error:', authError);
          await logAuthAttempt(emailValidation.normalized, 'db_error', 'auth_function_error', null, req);
          throw new Error('خطأ في النظام أثناء المصادقة');
        }

        if (!authResult || authResult.length === 0) {
          await logAuthAttempt(emailValidation.normalized, 'invalid', 'auth_failed', 'no_result', req);
          throw new Error('فشل في التحقق من البيانات');
        }

        const result = authResult[0];
        console.log('🔑 Auth result details:', result);
        
        if (!result.success) {
          // Log specific failure reason
          await logAuthAttempt(emailValidation.normalized, 'invalid', 'auth_failed', result.status, req);
          
          // Specific error messages based on account status
          if (result.status === 'not_found') {
            throw new Error('البريد الإلكتروني غير مسجل في النظام');
          } else if (result.status === 'blocked') {
            throw new Error('تم حظر حسابك. يرجى التواصل مع الإدارة');
          } else if (result.status === 'inactive') {
            throw new Error('حسابك غير مفعل. يرجى التواصل مع الإدارة');
          } else if (result.status === 'wrong_password') {
            throw new Error('كلمة المرور غير صحيحة. حاول مرة أخرى');
          } else {
            throw new Error(result.message || 'بيانات تسجيل الدخول غير صحيحة');
          }
        }

        // Create OTP for authenticated user and update last login
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
          await logAuthAttempt(emailValidation.normalized, 'db_error', 'otp_creation_failed', null, req);
          throw new Error('فشل في إنشاء رمز التحقق');
        }

        const otpCode = otpResult.data;

        // Get user name for email
        const { data: userData } = await supabase
          .from('ash_users')
          .select('name')
          .eq('id', result.user_id)
          .single();

        // Send OTP email
        await sendOTPEmail(email, otpCode, userData?.name || 'مستخدم', 'login');

        // Log successful login attempt
        await logAuthAttempt(emailValidation.normalized, 'success', null, null, req);

        console.log(`✅ Login OTP sent: ${emailValidation.normalized}, OTP: ${otpCode}`);

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
        const emailValidation = validateEmail(email || '');
        if (!emailValidation.valid) {
          await logAuthAttempt(normalizeEmail(email || ''), 'invalid', 'validation_error', 'email_invalid', req);
          throw new Error(emailValidation.message);
        }

        if (!code) {
          await logAuthAttempt(emailValidation.normalized, 'invalid', 'validation_error', 'code_missing', req);
          throw new Error('رمز التحقق مطلوب');
        }

        // Normalize code to support Arabic numerals
        const normalizedCode = normalizeDigits(code);
        
        // Use enhanced verification function
        const { data: isValidOTP, error: verifyError } = await supabase.rpc(
          'verify_otp_code',
          {
            p_email: email,
            p_code: normalizedCode,
            p_type: 'login' 
          }
        );

        if (verifyError || !isValidOTP) {
          console.error('OTP verification error:', verifyError);
          await logAuthAttempt(emailValidation.normalized, 'invalid', 'otp_verification_failed', null, req);
          throw new Error('رمز التحقق غير صحيح أو منتهي الصلاحية');
        }

        // Get updated user data
        const { data: userData, error: userError } = await supabase
          .from('ash_users')
          .select('id, email, name, role, status, verified_at')
          .eq('email_lower', emailValidation.normalized)
          .single();

        if (userError) {
          console.error('User fetch error:', userError);
          await logAuthAttempt(emailValidation.normalized, 'db_error', 'user_fetch_failed', null, req);
          throw new Error('خطأ في الحصول على بيانات المستخدم');
        }

        // Log successful OTP verification
        await logAuthAttempt(emailValidation.normalized, 'success', null, null, req);

        console.log(`✅ OTP verified successfully: ${emailValidation.normalized}, Status: ${userData.status}`);

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
        const emailValidation = validateEmail(email || '');
        if (!emailValidation.valid) {
          await logAuthAttempt(normalizeEmail(email || ''), 'invalid', 'validation_error', 'email_invalid', req);
          throw new Error(emailValidation.message);
        }

        const normalizedEmail = emailValidation.normalized;

        // Find user
        const { data: user } = await supabase
          .from('ash_users')
          .select('*')
          .eq('email_lower', normalizedEmail)
          .maybeSingle();

        if (!user) {
          await logAuthAttempt(normalizedEmail, 'invalid', 'user_not_found', null, req);
          throw new Error('المستخدم غير موجود');
        }

        // Create new OTP
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
          await logAuthAttempt(normalizedEmail, 'db_error', 'otp_creation_failed', null, req);
          throw new Error('فشل في إنشاء رمز التحقق');
        }

        await sendOTPEmail(email, otpCode, user.name, 'login');

        // Log successful resend
        await logAuthAttempt(normalizedEmail, 'success', null, null, req);

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