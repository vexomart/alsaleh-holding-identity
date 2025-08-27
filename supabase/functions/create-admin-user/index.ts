import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // إنشاء client مع service role key للتحكم الكامل
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { email, password, fullName } = await req.json();

    // إنشاء المستخدم الإداري
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || 'المدير العام',
        is_admin: true
      }
    });

    if (authError) {
      console.error('خطأ في إنشاء المستخدم:', authError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: authError.message 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!authData.user) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'فشل في إنشاء المستخدم' 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // إضافة دور الإدارة
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .upsert({
        user_id: authData.user.id,
        role: 'admin'
      });

    if (roleError) {
      console.error('خطأ في إضافة دور الإدارة:', roleError);
      // لا نتوقف هنا، ربما الجدول غير موجود
    }

    // محاولة إضافة ملف تعريف
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        user_id: authData.user.id,
        full_name: fullName || 'المدير العام',
        user_role: 'admin',
        client_id: 'ADMIN001'
      });

    if (profileError) {
      console.error('خطأ في إنشاء الملف الشخصي:', profileError);
      // لا نتوقف هنا أيضاً
    }

    console.log('تم إنشاء المستخدم الإداري بنجاح:', authData.user.email);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'تم إنشاء المستخدم الإداري بنجاح',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        created_at: authData.user.created_at
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error('خطأ في edge function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);