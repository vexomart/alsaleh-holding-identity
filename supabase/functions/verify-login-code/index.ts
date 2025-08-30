import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    // تأكيد المستخدم في قاعدة البيانات بعد التحقق من الرمز
    const { data: confirmResult, error: confirmError } = await supabase.rpc(
      'confirm_user_after_verification',
      { user_email: email }
    );

    if (confirmError) {
      console.error('Error confirming user:', confirmError);
    } else {
      console.log('User confirmed successfully:', confirmResult);
    }

    // الحصول على بيانات المستخدم من جدول profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('user_id, full_name, email, is_verified')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }

    // تسجيل نشاط الدخول في سجل الأمان
    if (profileData?.user_id) {
      await supabase
        .from('security_audit_logs')
        .insert({
          event_type: 'verification_login',
          user_id: profileData.user_id,
          action: `${type}_login_verified`,
          risk_level: type === 'admin' ? 'high' : 'medium',
          metadata: {
            email: email,
            user_type: type,
            ip_address: req.headers.get('x-forwarded-for') || 'unknown',
            user_agent: req.headers.get('user-agent') || 'unknown',
            timestamp: new Date().toISOString(),
            is_verified: profileData.is_verified
          }
        });
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Verification successful",
        email: email,
        verified: true,
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