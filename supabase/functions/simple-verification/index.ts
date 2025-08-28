import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { supabase } from "../_shared/supabase.ts";

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

    console.log(`Simple verification request: email=${email}, type=${type}`);

    if (!email || !email.includes('@')) {
      console.error('Invalid email address:', email);
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // للمديرين، تحقق بسيط
    if (type === 'admin') {
      // قائمة الإيميلات المقبولة للإدارة
      const allowedAdminEmails = [
        'info@alialshehriholding.com',
        'ali6c205@gmail.com',
        'ali6c201@gmail.com',
        'admin@alialshehriholding.com'
      ];

      if (!allowedAdminEmails.includes(email)) {
        console.error('Email not in admin list:', email);
        return new Response(
          JSON.stringify({ error: "Admin email not authorized" }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
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

    console.log(`Verification code generated and saved: ${verificationCode}`);

    // بدلاً من إرسال إيميل، نعرض الرمز مؤقتاً في الاستجابة
    // هذا لأغراض التطوير والاختبار
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Verification code generated successfully",
        // في بيئة التطوير، نعرض الرمز مباشرة
        development_code: verificationCode,
        note: "Email service is being configured. Use the code above for now.",
        expiresIn: 600 // 10 minutes in seconds
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in simple verification:", error);
    console.error("Error details:", error.message, error.stack);
    return new Response(
      JSON.stringify({ error: `Failed to generate verification code: ${error.message}` }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);