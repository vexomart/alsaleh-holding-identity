import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { supabase } from "../_shared/supabase.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationRequest {
  email: string;
  type: 'admin' | 'user';
}

// دالة لتوليد رمز تحقق عشوائي
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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

    console.log(`Verification request: email=${email}, type=${type}`);

    if (!email || !email.includes('@')) {
      console.error('Invalid email address:', email);
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // للمديرين، نتحقق من الصلاحيات بطريقة مختلفة
    if (type === 'admin') {
      // البحث في جدول admin_users أو user_roles مباشرة
      const { data: adminData, error: adminError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .eq('role', 'admin')
        .limit(1);

      console.log('Admin check result:', { adminData, adminError });

      // إذا لم نجد أي admin في النظام، نرفض الطلب
      if (adminError || !adminData || adminData.length === 0) {
        console.error('No admin users found or admin error:', adminError);
        return new Response(
          JSON.stringify({ error: "Admin access not configured" }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // تحقق إضافي: البحث عن الإيميل في قاعدة البيانات
      const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(email);
      
      if (userError || !userData.user) {
        console.error('Admin user not found in auth:', { email, userError });
        return new Response(
          JSON.stringify({ error: "Admin email not found in system" }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // التحقق من أن هذا المستخدم له صلاحيات admin
      const { data: userRoleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userData.user.id)
        .eq('role', 'admin')
        .single();

      if (!userRoleData) {
        console.error('User does not have admin role:', email);
        return new Response(
          JSON.stringify({ error: "User does not have admin privileges" }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    } else {
      // للمستخدمين العاديين، التحقق العادي
      const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(email);
      
      if (userError || !userData.user) {
        console.error('User not found:', { email, userError });
        return new Response(
          JSON.stringify({ error: "User not found" }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // توليد رمز التحقق
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 دقائق

    // حفظ رمز التحقق في قاعدة البيانات
    console.log('Saving verification code to database...');
    const { error: saveError } = await supabase
      .from('verification_codes')
      .upsert({
        email,
        code: verificationCode,
        type,
        expires_at: expiresAt.toISOString(),
        used: false
      }, {
        onConflict: 'email,type'
      });

    if (saveError) {
      console.error('Error saving verification code:', saveError);
      return new Response(
        JSON.stringify({ error: "Failed to save verification code" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log('Verification code saved successfully, sending email...');

    // إرسال الرمز عبر الإيميل
    const subject = type === 'admin' 
      ? '🔐 رمز التحقق للدخول الإداري - شركة الصالح القابضة'
      : '🔐 رمز التحقق لتسجيل الدخول';

    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <div style="background: rgba(255,255,255,0.1); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <div style="font-size: 36px;">🔐</div>
          </div>
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">
            ${type === 'admin' ? 'رمز التحقق الإداري' : 'رمز التحقق'}
          </h1>
          <p style="color: #cbd5e1; margin: 10px 0 0 0; font-size: 16px;">
            شركة علي صالح الشهري القابضة
          </p>
        </div>

        <!-- Content -->
        <div style="background: white; padding: 40px 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 24px;">
              مرحباً بك!
            </h2>
            <p style="color: #64748b; margin: 0; line-height: 1.6; font-size: 16px;">
              ${type === 'admin' 
                ? 'تم طلب رمز تحقق للدخول إلى النظام الإداري'
                : 'تم طلب رمز تحقق لتسجيل الدخول إلى حسابك'
              }
            </p>
          </div>

          <!-- Verification Code -->
          <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border: 3px solid #3b82f6; padding: 30px; border-radius: 16px; text-align: center; margin: 30px 0;">
            <p style="color: #475569; margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
              رمز التحقق الخاص بك
            </p>
            <div style="font-size: 42px; font-weight: 900; color: #1e293b; letter-spacing: 8px; margin: 15px 0; font-family: 'Courier New', monospace;">
              ${verificationCode}
            </div>
            <p style="color: #ef4444; margin: 15px 0 0 0; font-size: 14px; font-weight: 600;">
              ⏰ ينتهي خلال 10 دقائق
            </p>
          </div>

          <!-- Security Notice -->
          <div style="background: #fef3cd; border: 1px solid #fbbf24; border-radius: 12px; padding: 20px; margin: 30px 0;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="font-size: 20px; margin-left: 10px;">⚠️</span>
              <strong style="color: #92400e; font-size: 16px;">تنبيه أمني مهم</strong>
            </div>
            <ul style="color: #92400e; margin: 10px 0; padding-right: 20px; line-height: 1.6;">
              <li>لا تشارك هذا الرمز مع أي شخص آخر</li>
              <li>استخدم الرمز خلال 10 دقائق من الآن</li>
              <li>إذا لم تطلب هذا الرمز، تجاهل هذه الرسالة</li>
              ${type === 'admin' ? '<li>هذا رمز للوصول الإداري الحساس</li>' : ''}
            </ul>
          </div>

          <!-- Instructions -->
          <div style="background: #f0f9ff; border-radius: 12px; padding: 25px; margin: 30px 0;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">كيفية الاستخدام:</h3>
            <ol style="color: #475569; margin: 0; padding-right: 20px; line-height: 1.8;">
              <li>ارجع إلى صفحة تسجيل الدخول</li>
              <li>أدخل الرمز المرسل في الحقل المخصص</li>
              <li>انقر على "تأكيد الرمز"</li>
              <li>ستتم إعادة توجيهك تلقائياً</li>
            </ol>
          </div>

          <!-- Support -->
          <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; margin: 0 0 15px 0; font-size: 14px;">
              تحتاج مساعدة؟ تواصل مع فريق الدعم
            </p>
            <a href="tel:+966123456789" style="color: #3b82f6; text-decoration: none; font-weight: 600; margin: 0 15px;">
              📞 +966 12 345 6789
            </a>
            <a href="mailto:support@alialshehriholding.com" style="color: #3b82f6; text-decoration: none; font-weight: 600; margin: 0 15px;">
              📧 support@alialshehriholding.com
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #1e293b; padding: 30px 20px; text-align: center; border-radius: 0 0 12px 12px;">
          <p style="color: #94a3b8; margin: 0 0 10px 0; font-size: 14px;">
            هذه رسالة آمنة من شركة علي صالح الشهري القابضة
          </p>
          <p style="color: #64748b; margin: 0; font-size: 12px;">
            © 2025 جميع الحقوق محفوظة | ISO 27001 معتمد 🔒
          </p>
        </div>
      </div>
    `;

    console.log('Attempting to send email via Resend...');
    const emailResponse = await resend.emails.send({
      from: "Ali AlShehri Security <security@alialshehriholding.com>",
      to: [email],
      subject,
      html,
    });

    console.log("Verification code sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Verification code sent successfully",
        expiresIn: 600 // 10 minutes in seconds
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error sending verification code:", error);
    console.error("Error details:", error.message, error.stack);
    return new Response(
      JSON.stringify({ error: `Failed to send verification code: ${error.message}` }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);