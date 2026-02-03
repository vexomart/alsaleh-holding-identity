import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ResetPasswordRequest {
  email: string;
  action: 'send-reset' | 'confirm-reset';
  token?: string;
  newPassword?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('🔐 Reset Password Service: Request received');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const resendApiKey = Deno.env.get('RESEND_API_KEY')!;

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const resend = new Resend(resendApiKey);

  try {
    const { email, action, token, newPassword }: ResetPasswordRequest = await req.json();
    console.log('📧 Reset Password Action:', action, 'for email:', email);

    if (action === 'send-reset') {
      // التحقق من وجود المستخدم في جدول ash_users
      const { data: user, error: userError } = await supabase
        .from('ash_users')
        .select('id, email, status')
        .eq('email_lower', email.toLowerCase().trim())
        .single();
      
      if (userError || !user) {
        console.log('❌ User not found:', email);
        // إرجاع نجح حتى لو لم يوجد المستخدم لأسباب أمنية
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'إذا كان البريد الإلكتروني مسجل لدينا، ستصلك رسالة لإعادة تعيين كلمة المرور'
          }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      // التحقق من أن المستخدم نشط
      if (user.status === 'blocked') {
        console.log('❌ User is blocked:', email);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'تم حظر حسابك. يرجى التواصل مع الإدارة'
          }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      // إنشاء رمز إعادة تعيين كلمة المرور
      const resetToken = crypto.randomUUID().replace(/-/g, '').substring(0, 32);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // صالح لمدة ساعة واحدة

      // حفظ الرمز في قاعدة البيانات
      const { error: insertError } = await supabase
        .from('password_reset_tokens')
        .insert([
          {
            user_id: user.id,
            email: email,
            token: resetToken,
            expires_at: expiresAt.toISOString(),
            used: false
          }
        ]);

      if (insertError) {
        console.error('❌ Error saving reset token:', insertError);
        throw new Error('خطأ في النظام، يرجى المحاولة لاحقاً');
      }

      // إرسال الإيميل
      const resetUrl = `${req.headers.get('origin') || 'https://alialshehriholding.com'}/reset-password?token=${resetToken}`;
      
      const emailResponse = await resend.emails.send({
        from: "ASH HOLDING <info@ash-holding.sa>",
        to: [email],
        subject: "إعادة تعيين كلمة المرور - ASH Holding",
        html: `
          <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
              <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">إعادة تعيين كلمة المرور</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">شركة الشهري للتطوير</p>
              </div>
              
              <div style="padding: 40px 30px;">
                <p style="font-size: 18px; color: #374151; margin-bottom: 20px; line-height: 1.6;">
                  مرحباً،
                </p>
                
                <p style="font-size: 16px; color: #6b7280; margin-bottom: 30px; line-height: 1.6;">
                  تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك. انقر على الزر أدناه لإعادة تعيين كلمة المرور:
                </p>
                
                <div style="text-align: center; margin: 40px 0;">
                  <a href="${resetUrl}" 
                     style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); 
                            color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; 
                            font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
                            transition: all 0.3s ease;">
                    إعادة تعيين كلمة المرور
                  </a>
                </div>
                
                <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin: 30px 0;">
                  <p style="font-size: 14px; color: #6b7280; margin: 0; line-height: 1.5;">
                    <strong>ملاحظة مهمة:</strong> هذا الرابط صالح لمدة ساعة واحدة فقط. إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذه الرسالة.
                  </p>
                </div>
                
                <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                  <p style="font-size: 14px; color: #9ca3af; margin: 0; text-align: center;">
                    إذا لم يعمل الزر أعلاه، يمكنك نسخ الرابط التالي ولصقه في المتصفح:<br>
                    <span style="word-break: break-all; color: #6b7280;">${resetUrl}</span>
                  </p>
                </div>
              </div>
              
              <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">
                  شركة الشهري للتطوير - خدمات تقنية متطورة
                </p>
              </div>
            </div>
          </div>
        `,
      });

      console.log('✅ Password reset email sent:', emailResponse);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );

    } else if (action === 'confirm-reset') {
      if (!token || !newPassword) {
        throw new Error('الرمز وكلمة المرور الجديدة مطلوبان');
      }

      // التحقق من صحة الرمز
      const { data: resetData, error: tokenError } = await supabase
        .from('password_reset_tokens')
        .select('*')
        .eq('token', token)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (tokenError || !resetData) {
        console.log('❌ Invalid or expired token:', token);
        throw new Error('رمز إعادة التعيين غير صالح أو منتهي الصلاحية');
      }

      // تحديث كلمة المرور باستخدام النظام الجديد
      const passwordResult = await supabase.rpc('create_secure_password_hash', {
        plain_password: newPassword
      });

      if (passwordResult.error) {
        console.error('❌ Error creating password hash:', passwordResult.error);
        throw new Error('خطأ في تحديث كلمة المرور');
      }

      const { data: hashData } = passwordResult;
      
      const { error: updateError } = await supabase
        .from('ash_users')
        .update({
          password_algo: hashData.password_algo,
          password_salt_b64: hashData.password_salt_b64,
          password_hash_b64: hashData.password_hash_b64,
          updated_at: new Date().toISOString()
        })
        .eq('id', resetData.user_id);

      if (updateError) {
        console.error('❌ Error updating password:', updateError);
        throw new Error('خطأ في تحديث كلمة المرور');
      }

      // تعليم الرمز كمستخدم
      await supabase
        .from('password_reset_tokens')
        .update({ used: true })
        .eq('token', token);

      console.log('✅ Password reset successfully for user:', resetData.user_id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'تم تغيير كلمة المرور بنجاح، يمكنك الآن تسجيل الدخول'
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    throw new Error('إجراء غير معروف');

  } catch (error: any) {
    console.error('❌ Reset Password Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'حدث خطأ في النظام'
      }),
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
};

serve(handler);