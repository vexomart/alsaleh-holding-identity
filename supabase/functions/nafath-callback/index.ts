import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RABET_APP_ID = Deno.env.get('RABET_APP_ID')!;
const RABET_APP_KEY = Deno.env.get('RABET_APP_KEY')!;
const RABET_BASE_URL = 'https://api.rfrsh.com';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🔐 Nafath Callback function initialized');

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { state, code, session_id, ...otherParams } = await req.json();
    console.log('📥 Nafath callback received:', { state: state?.substring(0, 8), code: !!code, session_id: !!session_id });

    // 1. Verify state token (CSRF protection)
    if (!state) {
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
      throw new Error('رمز الحالة غير صالح أو منتهي الصلاحية');
    }

    // 2. Mark state as used
    await supabase
      .from('nafath_states')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('id', stateRecord.id);

    // 3. Exchange code/session for JWT token
    const jwtResponse = await fetch(`${RABET_BASE_URL}/api/v2/oidc/jwt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-ID': RABET_APP_ID,
        'X-App-Key': RABET_APP_KEY,
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
      throw new Error('فشل في التحقق من الهوية');
    }

    const jwtData = await jwtResponse.json();
    console.log('JWT exchange response:', JSON.stringify(jwtData));

    // 4. Validate the JWT token
    const validationResponse = await fetch(`${RABET_BASE_URL}/api/v2/oidc/jwt/valid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-ID': RABET_APP_ID,
        'X-App-Key': RABET_APP_KEY,
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
        const payloadB64 = token.split('.')[1];
        const payloadJson = atob(payloadB64);
        claims = JSON.parse(payloadJson);
      } else {
        claims = jwtData.user || jwtData.claims || jwtData;
      }
    }

    console.log('Nafath claims:', JSON.stringify(claims));

    // 5. Extract identity fields
    const nafathSub = claims.sub || claims.national_id || claims.iqama_id;
    const nationalId = claims.national_id || claims.iqama_id || claims.sub;
    const fullNameAr = claims.full_name_ar || claims.name || 'مستخدم نفاذ';
    const mobile = claims.mobile || claims.phone;

    if (!nafathSub || !nationalId) {
      console.error('Missing identity fields:', claims);
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

    if (existingIdentity) {
      // User exists - link and login
      userId = existingIdentity.user_id;
      console.log(`✅ Existing user found: ${userId}`);

      // Update the raw claims
      await supabase
        .from('nafath_identities')
        .update({
          raw_claims_json: claims,
          verified_at: new Date().toISOString()
        })
        .eq('id', existingIdentity.id);

    } else {
      // New user - create Supabase Auth user
      isNewUser = true;
      
      // Create synthetic email for users without email
      const syntheticEmail = `nafath_${nationalId}@ash.local`;
      const randomPassword = crypto.randomUUID() + crypto.randomUUID();

      // Create user in Supabase Auth
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
        throw new Error('فشل في إنشاء الحساب');
      }

      userId = authData.user.id;
      console.log(`✅ New user created: ${userId}`);

      // Create nafath_identities record
      const { error: identityError } = await supabase
        .from('nafath_identities')
        .insert({
          user_id: userId,
          nafath_sub: nafathSub,
          national_id: nationalId,
          raw_claims_json: claims,
          verified_at: new Date().toISOString()
        });

      if (identityError) {
        console.error('Identity creation error:', identityError);
      }
    }

    // 7. Update profile with KYC info
    const { error: profileError } = await supabase
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

    if (profileError) {
      console.error('Profile update error:', profileError);
    }

    // 8. Assign customer role if new user
    if (isNewUser) {
      await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'customer'
        });
    }

    // 9. Create audit log
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action: isNewUser ? 'create' : 'login',
        table_name: 'nafath_auth',
        metadata: {
          provider: 'nafath',
          national_id: nationalId,
          is_new_user: isNewUser
        }
      });

    // 10. Generate session token for the user
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: (await supabase.from('profiles').select('email').eq('id', userId).single()).data?.email || `nafath_${nationalId}@ash.local`
    });

    console.log(`✅ Nafath authentication successful for user: ${userId}`);

    return new Response(JSON.stringify({
      success: true,
      message: isNewUser ? 'تم إنشاء حسابك وتفعيله بنجاح' : 'تم تسجيل الدخول بنجاح',
      user_id: userId,
      is_new_user: isNewUser,
      redirect_url: '/client/dashboard',
      // Include magic link for auto-login
      magic_link: sessionData?.properties?.action_link
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('❌ Nafath Callback Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: error.message || 'حدث خطأ غير متوقع'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
