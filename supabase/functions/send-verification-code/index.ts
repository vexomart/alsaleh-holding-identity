import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationRequest {
  email: string;
  type: 'admin' | 'user';
}

const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const { email, type }: VerificationRequest = await req.json();

    if (!email || !type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // التحقق من صحة الإيميل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // للأدمن، التحقق من وجود المستخدم وأنه أدمين
    if (type === 'admin') {
      try {
        const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(email);
        
        if (userError || !userData.user) {
          console.error('Admin user not found:', userError);
          return new Response(
            JSON.stringify({ error: "Admin user not found" }),
            { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        // التحقق من كونه أدمين
        const { data: adminData, error: adminError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userData.user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (adminError) {
          console.error('Error checking admin status:', adminError);
          return new Response(
            JSON.stringify({ error: "Error checking admin status" }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        if (!adminData) {
          console.error('User is not an admin');
          return new Response(
            JSON.stringify({ error: "Access denied" }),
            { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
      } catch (error) {
        console.error('Error in admin verification:', error);
        return new Response(
          JSON.stringify({ error: "Error verifying admin status" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }
    // للمستخدمين العاديين، لا نحتاج للتحقق من وجودهم مسبقاً
    // سنرسل رمز التحقق فقط

    // إنشاء رمز التحقق
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 دقائق

    // حفظ الرمز في قاعدة البيانات
    const { error: insertError } = await supabase
      .from('verification_codes')
      .upsert({
        email,
        code: verificationCode,
        type,
        expires_at: expiresAt.toISOString(),
        used: false
      });

    if (insertError) {
      console.error('Error saving verification code:', insertError);
      return new Response(
        JSON.stringify({ error: "Failed to save verification code" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // إرسال الإيميل إذا تم تكوين Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      try {
        const emailResponse = await resend.emails.send({
          from: "نظام الإدارة <security@alialshehriholding.com>",
          to: [email],
          subject: `رمز التحقق - ${type === 'admin' ? 'لوحة الإدارة' : 'حسابك'}`,
          html: `
            <div style="direction: rtl; text-align: right; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
              <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 30px; border-radius: 12px; margin-bottom: 20px;">
                <h1 style="color: white; font-size: 24px; margin: 0 0 10px 0;">🔐 رمز التحقق</h1>
                <p style="color: #e2e8f0; margin: 0; font-size: 16px;">شركة علي صالح الشهري القابضة</p>
              </div>
              
              <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #1e293b; margin: 0 0 20px 0;">مرحباً،</h2>
                
                <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                  تم طلب رمز التحقق لـ${type === 'admin' ? 'الوصول للوحة الإدارة' : 'حسابك'}. 
                  استخدم الرمز التالي لإكمال عملية تسجيل الدخول:
                </p>
                
                <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
                            padding: 20px; 
                            border-radius: 8px; 
                            text-align: center; 
                            margin: 25px 0;">
                  <div style="color: white; 
                              font-size: 32px; 
                              font-weight: bold; 
                              letter-spacing: 8px; 
                              font-family: 'Courier New', monospace;">
                    ${verificationCode}
                  </div>
                </div>
                
                <p style="color: #dc2626; font-size: 14px; margin: 20px 0 0 0; text-align: center;">
                  ⚠️ هذا الرمز صالح لمدة 10 دقائق فقط
                </p>
                
                <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
                  <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0;">
                    إذا لم تطلب هذا الرمز، يرجى تجاهل هذا الإيميل. 
                    لا تشارك هذا الرمز مع أي شخص آخر.
                  </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                  <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    © 2024 شركة علي صالح الشهري القابضة - جميع الحقوق محفوظة
                  </p>
                </div>
              </div>
            </div>
          `,
        });

        console.log("Email sent successfully:", emailResponse);
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // لا نوقف العملية إذا فشل إرسال الإيميل
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Verification code sent successfully",
        expiresIn: 600 // 10 minutes in seconds
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in send-verification-code function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);