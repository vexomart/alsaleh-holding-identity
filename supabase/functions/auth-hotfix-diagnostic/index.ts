import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DiagnosticRequest {
  email: string;
  password?: string;
  action: 'diagnose' | 'repair' | 'test-user-create';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    const { email, password, action }: DiagnosticRequest = await req.json();
    
    console.log(`🔍 Auth Hotfix - Action: ${action}, Email: ${email}`);

    // التحقق من صلاحيات الإدارة
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required', success: false }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // استخراج معرف المستخدم من الرأس
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication', success: false }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let result;

    switch (action) {
      case 'diagnose':
        if (!password) {
          return new Response(
            JSON.stringify({ error: 'Password required for diagnosis', success: false }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        console.log('🔍 Running diagnosis...');
        const { data: diagnosisData, error: diagnosisError } = await supabase
          .rpc('auth_hotfix_diagnose', {
            email_input: email,
            plain_password: password,
            admin_user_id: user.id
          });

        if (diagnosisError) {
          console.error('❌ Diagnosis error:', diagnosisError);
          return new Response(
            JSON.stringify({ error: diagnosisError.message, success: false }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        result = diagnosisData;
        console.log('✅ Diagnosis completed:', result);
        break;

      case 'repair':
        if (!password) {
          return new Response(
            JSON.stringify({ error: 'Password required for repair', success: false }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('🔧 Running auto-repair...');
        const { data: repairData, error: repairError } = await supabase
          .rpc('auth_hotfix_auto_repair', {
            email_input: email,
            plain_password: password,
            admin_user_id: user.id
          });

        if (repairError) {
          console.error('❌ Repair error:', repairError);
          return new Response(
            JSON.stringify({ error: repairError.message, success: false }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        result = repairData;
        console.log('✅ Auto-repair completed:', result);
        break;

      case 'test-user-create':
        console.log('🧪 Creating test user...');
        const { data: testData, error: testError } = await supabase
          .rpc('auth_create_test_user');

        if (testError) {
          console.error('❌ Test user creation error:', testError);
          return new Response(
            JSON.stringify({ error: testError.message, success: false }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        result = testData;
        console.log('✅ Test user created:', result);
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action', success: false }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('❌ Auth Hotfix error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error', 
        success: false 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);