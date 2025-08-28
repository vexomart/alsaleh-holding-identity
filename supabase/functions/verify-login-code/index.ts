import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { supabase } from "../_shared/supabase.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyRequest {
  email: string;
  code: string;
  type: 'admin' | 'user';
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
    const { email, code, type }: VerifyRequest = await req.json();

    if (!email || !code || !type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // البحث عن رمز التحقق
    const { data: verificationData, error: fetchError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('type', type)
      .eq('used', false)
      .single();

    if (fetchError || !verificationData) {
      console.error('Verification code not found:', fetchError);
      return new Response(
        JSON.stringify({ error: "Invalid verification code" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // التحقق من انتهاء صلاحية الرمز
    const now = new Date();
    const expiresAt = new Date(verificationData.expires_at);
    
    if (now > expiresAt) {
      // حذف الرمز المنتهي الصلاحية
      await supabase
        .from('verification_codes')
        .delete()
        .eq('id', verificationData.id);

      return new Response(
        JSON.stringify({ error: "Verification code has expired" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // تسجيل استخدام الرمز
    const { error: updateError } = await supabase
      .from('verification_codes')
      .update({ 
        used: true, 
        used_at: new Date().toISOString() 
      })
      .eq('id', verificationData.id);

    if (updateError) {
      console.error('Error updating verification code:', updateError);
      return new Response(
        JSON.stringify({ error: "Failed to verify code" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // الحصول على بيانات المستخدم
    const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(email);
    
    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // إنشاء جلسة آمنة للمستخدم
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: type === 'admin' ? 'https://alialshehriholding.com/admin/dashboard' : 'https://alialshehriholding.com/my-projects'
      }
    });

    if (sessionError) {
      console.error('Error generating session:', sessionError);
      return new Response(
        JSON.stringify({ error: "Failed to create session" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // تسجيل نشاط الدخول في سجل الأمان
    await supabase
      .from('security_audit_logs')
      .insert({
        event_type: 'verification_login',
        user_id: userData.user.id,
        action: `${type}_login_verified`,
        risk_level: type === 'admin' ? 'high' : 'medium',
        metadata: {
          email: email,
          user_type: type,
          ip_address: req.headers.get('x-forwarded-for') || 'unknown',
          user_agent: req.headers.get('user-agent') || 'unknown',
          timestamp: new Date().toISOString()
        }
      });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Verification successful",
        auth_url: sessionData.properties.action_link,
        user_id: userData.user.id,
        redirect_url: type === 'admin' ? '/admin/dashboard' : '/my-projects'
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error verifying code:", error);
    return new Response(
      JSON.stringify({ error: "Failed to verify code" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);