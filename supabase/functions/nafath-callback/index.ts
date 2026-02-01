import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Load environment variables - NEVER expose to client
const RABET_APP_ID = Deno.env.get('RABET_APP_ID');
const RABET_APP_KEY = Deno.env.get('RABET_APP_KEY');
const RABET_BASE_URL = Deno.env.get('RABET_BASE_URL');

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🔐 Nafath Callback function initialized');
console.log(`📡 Using Rabet Base URL: ${RABET_BASE_URL || 'NOT_SET'}`);

interface NafathClaims {
  sub?: string;
  national_id?: string;
  iqama_id?: string;
  full_name_ar?: string;
  name?: string;
  mobile?: string;
  phone?: string;
  [key: string]: unknown;
}

// Helper function to log audit events
async function logAudit(
  action: 'create' | 'login' | 'read' | 'update' | 'delete' | 'logout' | 'export',
  userId: string | null,
  metadata: Record<string, unknown>,
  req: Request
) {
  try {
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIp || '0.0.0.0';

    await supabase.from('audit_logs').insert({
      user_id: userId,
      action,
      table_name: 'nafath_auth',
      metadata: {
        ...metadata,
        event_source: 'nafath-callback'
      },
      user_agent: userAgent,
      ip_address: ipAddress
    });
  } catch (error) {
    console.error('Audit log error:', error);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let parsedState: string | null = null;

  try {
    // Validate required environment variables
    if (!RABET_BASE_URL) {
      console.error('❌ RABET_BASE_URL is not configured');
      throw new Error('خدمة نفاذ غير مهيأة بشكل صحيح');
    }

    if (!RABET_APP_ID || !RABET_APP_KEY) {
      console.error('❌ RABET_APP_ID or RABET_APP_KEY is not configured');
      throw new Error('بيانات اعتماد خدمة نفاذ غير مكتملة');
    }

    const { state, code, session_id, ...otherParams } = await req.json();
    parsedState = state;
    console.log('📥 Nafath callback received:', { state: state?.substring(0, 8), code: !!code, session_id: !!session_id });

    // 1. Verify state token (CSRF protection)
    if (!state) {
      await logAudit('login', null, {
        event: 'nafath.callback.failure',
        reason: 'missing_state'
      }, req);
      throw new Error('رمز الحالة مفقود');
    }

    const { data: stateRecord, error: stateError } = await supabase
      .from('nafath_states')
      .select('*')
      .eq('state_token', state)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (stateError || !stateRecord) {
      console.error('State verification failed:', stateError);
      
      // Check if state was already used (replay attack)
      const { data: usedState } = await supabase
        .from('nafath_states')
        .select('used, used_at')
        .eq('state_token', state)
        .maybeSingle();

      if (usedState?.used) {
        await logAudit('login', null, {
          event: 'nafath.callback.failure',
          reason: 'replay_attack_detected',
          state_used_at: usedState.used_at
        }, req);
        throw new Error('تم استخدام رمز الحالة مسبقاً - محاولة إعادة استخدام مرفوضة');
      }

      await logAudit('login', null, {
        event: 'nafath.callback.failure',
        reason: 'invalid_or_expired_state'
      }, req);
      throw new Error('رمز الحالة غير صالح أو منتهي الصلاحية');
    }

    // 2. Mark state as used IMMEDIATELY (prevents race conditions)
    const { error: updateError } = await supabase
      .from('nafath_states')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('id', stateRecord.id)
      .eq('used', false);

    if (updateError) {
      await logAudit('login', null, {
        event: 'nafath.callback.failure',
        reason: 'state_race_condition'
      }, req);
      throw new Error('خطأ في معالجة الطلب، حاول مرة أخرى');
    }

    // 3. Exchange code/session for JWT token (SERVER-SIDE ONLY)
    const jwtUrl = `${RABET_BASE_URL}/api/v2/oidc/jwt`;
    console.log(`📡 Calling Rabet JWT API: ${jwtUrl}`);

    const jwtResponse = await fetch(jwtUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'app_id': RABET_APP_ID,
        'app_key': RABET_APP_KEY,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        code,
        session_id,
        ...otherParams
      })
    });

    if (!jwtResponse.ok) {
      const errorText = await jwtResponse.text();
      console.error('JWT exchange error:', jwtResponse.status, errorText);
      await logAudit('login', null, {
        event: 'nafath.token.invalid',
        reason: 'jwt_exchange_failed',
        status: jwtResponse.status
      }, req);
      throw new Error('فشل في التحقق من الهوية');
    }

    const jwtData = await jwtResponse.json();
    console.log('JWT exchange response received');

    // 4. Validate the JWT token (SERVER-SIDE ONLY)
    const validationUrl = `${RABET_BASE_URL}/api/v2/oidc/jwt/valid`;
    const validationResponse = await fetch(validationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'app_id': RABET_APP_ID,
        'app_key': RABET_APP_KEY,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        token: jwtData.token || jwtData.access_token || jwtData.id_token
      })
    });

    let claims: NafathClaims;
    
    if (validationResponse.ok) {
      const validationData = await validationResponse.json();
      claims = validationData.claims || validationData.payload || validationData;
    } else {
      // If validation endpoint fails, try to decode the JWT payload
      const token = jwtData.token || jwtData.access_token || jwtData.id_token;
      if (token) {
        try {
          const payloadB64 = token.split('.')[1];
          const payloadJson = atob(payloadB64);
          claims = JSON.parse(payloadJson);
        } catch {
          await logAudit('login', null, {
            event: 'nafath.token.invalid',
            reason: 'jwt_decode_failed'
          }, req);
          throw new Error('فشل في قراءة بيانات التوكن');
        }
      } else {
        claims = jwtData.user || jwtData.claims || jwtData;
      }
    }

    // 5. Extract identity fields
    const nafathSub = claims.sub || claims.national_id || claims.iqama_id;
    const nationalId = claims.national_id || claims.iqama_id || claims.sub;
    const fullNameAr = claims.full_name_ar || claims.name || 'مستخدم نفاذ';
    const mobile = claims.mobile || claims.phone;

    if (!nafathSub || !nationalId) {
      console.error('Missing identity fields:', claims);
      await logAudit('login', null, {
        event: 'nafath.token.invalid',
        reason: 'missing_identity_fields'
      }, req);
      throw new Error('لم يتم الحصول على بيانات الهوية المطلوبة');
    }

    // 6. Check if user already exists with this national_id
    const { data: existingIdentity } = await supabase
      .from('nafath_identities')
      .select('*, user_id')
      .eq('national_id', nationalId)
      .maybeSingle();

    let userId: string;
    let isNewUser = false;
    let userRole = 'customer';

    if (existingIdentity) {
      userId = existingIdentity.user_id;
      console.log(`✅ Existing user found: ${userId}`);

      await supabase
        .from('nafath_identities')
        .update({
          raw_claims_json: claims,
          verified_at: new Date().toISOString()
        })
        .eq('id', existingIdentity.id);

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (roleData) {
        userRole = roleData.role;
      }

    } else {
      isNewUser = true;
      
      const syntheticEmail = `nafath_${nationalId}@ash.local`;
      const randomPassword = crypto.randomUUID() + crypto.randomUUID();

      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: syntheticEmail,
        password: randomPassword,
        email_confirm: true,
        user_metadata: {
          full_name: fullNameAr,
          nafath_verified: true,
          national_id: nationalId
        }
      });

      if (authError) {
        console.error('Auth user creation error:', authError);
        await logAudit('create', null, {
          event: 'nafath.callback.failure',
          reason: 'user_creation_failed',
          error: authError.message
        }, req);
        throw new Error('فشل في إنشاء الحساب');
      }

      userId = authData.user.id;
      console.log(`✅ New user created: ${userId}`);

      await supabase
        .from('nafath_identities')
        .insert({
          user_id: userId,
          nafath_sub: nafathSub,
          national_id: nationalId,
          raw_claims_json: claims,
          verified_at: new Date().toISOString()
        });

      await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'customer'
        });

      userRole = 'customer';
    }

    // 7. Update profile with KYC info
    await supabase
      .from('profiles')
      .update({
        full_name: fullNameAr,
        full_name_ar: fullNameAr,
        phone: mobile,
        national_id: nationalId,
        is_kyc_verified: true,
        kyc_provider: 'nafath',
        kyc_verified_at: new Date().toISOString(),
        last_login_at: new Date().toISOString(),
        is_active: true
      })
      .eq('id', userId);

    // 8. Log successful authentication
    await logAudit(isNewUser ? 'create' : 'login', userId, {
      event: 'nafath.callback.success',
      is_new_user: isNewUser,
      national_id_masked: `${nationalId.substring(0, 2)}****${nationalId.slice(-2)}`,
      role: userRole
    }, req);

    // 9. Determine redirect based on role
    let redirectUrl = '/app';
    
    if (!isNewUser && (userRole === 'admin' || userRole === 'super_admin')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();

      if (profile?.email?.includes('@ash.local')) {
        redirectUrl = '/app';
        console.log('⚠️ Nafath user attempted admin access - blocked');
        await logAudit('login', userId, {
          event: 'nafath.admin_access_blocked',
          reason: 'nafath_users_cannot_access_admin'
        }, req);
      } else {
        redirectUrl = '/admin';
      }
    }

    console.log(`✅ Nafath authentication successful for user: ${userId}, redirect: ${redirectUrl}`);

    return new Response(JSON.stringify({
      success: true,
      message: isNewUser ? 'تم إنشاء حسابك وتفعيله بنجاح' : 'تم تسجيل الدخول بنجاح',
      user_id: userId,
      is_new_user: isNewUser,
      role: userRole,
      redirect_url: redirectUrl
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('❌ Nafath Callback Error:', error.message);

    if (parsedState) {
      await logAudit('login', null, {
        event: 'nafath.callback.failure',
        reason: 'unhandled_error',
        error_message: error.message
      }, req);
    }
    
    return new Response(JSON.stringify({
      success: false,
      message: error.message || 'حدث خطأ غير متوقع'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
