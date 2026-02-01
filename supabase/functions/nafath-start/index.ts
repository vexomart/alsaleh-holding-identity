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

console.log('🔐 Nafath Start function initialized');
console.log(`📡 Using Rabet Base URL: ${RABET_BASE_URL || 'NOT_SET'}`);

// Generate secure random state token
function generateSecureState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
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
        event_source: 'nafath-start'
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

    const { callback_url } = await req.json();
    
    // 1. Generate secure state token
    const stateToken = generateSecureState();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // 2. Store state in database for CSRF protection
    const { error: stateError } = await supabase
      .from('nafath_states')
      .insert({
        state_token: stateToken,
        expires_at: expiresAt.toISOString()
      });

    if (stateError) {
      console.error('State storage error:', stateError);
      await logAudit('login', null, {
        event: 'nafath.start.failure',
        reason: 'state_storage_failed'
      }, req);
      throw new Error('فشل في إنشاء جلسة آمنة');
    }

    // 3. Determine callback URL
    const finalCallbackUrl = callback_url || `${req.headers.get('origin')}/auth/login?provider=nafath`;

    // 4. Call Rabet OIDC session endpoint (SERVER-SIDE ONLY)
    const rabetUrl = `${RABET_BASE_URL}/api/v2/oidc/session`;
    console.log(`📡 Calling Rabet API: ${rabetUrl}`);

    const rabetResponse = await fetch(rabetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'app_id': RABET_APP_ID,
        'app_key': RABET_APP_KEY,
        'Accept': 'application/json'
      }
    });

    const responseText = await rabetResponse.text();
    console.log(`📡 Rabet response status: ${rabetResponse.status}`);

    if (!rabetResponse.ok) {
      console.error('Rabet API error:', rabetResponse.status, responseText);
      await logAudit('login', null, {
        event: 'nafath.start.failure',
        reason: 'rabet_api_error',
        status: rabetResponse.status,
        base_url: RABET_BASE_URL
      }, req);
      
      // Check for DNS/network errors
      if (responseText.includes('Name or service not known') || responseText.includes('ENOTFOUND')) {
        throw new Error('تعذر الاتصال بخدمة نفاذ. تحقق من إعدادات الرابط (Base URL) أو الشبكة.');
      }
      
      throw new Error('فشل في الاتصال بخدمة نفاذ');
    }

    let rabetData;
    try {
      rabetData = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse Rabet response:', responseText);
      throw new Error('استجابة غير صالحة من خدمة نفاذ');
    }

    console.log('Rabet session response received');

    // 5. Construct the final Nafath URL with state
    let nafathUrl = rabetData.url || rabetData.redirect_url || rabetData.login_url || rabetData.authorization_url;
    
    if (!nafathUrl) {
      console.error('No URL in Rabet response:', JSON.stringify(rabetData));
      await logAudit('login', null, {
        event: 'nafath.start.failure',
        reason: 'no_nafath_url',
        response_keys: Object.keys(rabetData)
      }, req);
      throw new Error('لم يتم الحصول على رابط نفاذ');
    }

    // Append state parameter for CSRF protection
    const urlObj = new URL(nafathUrl);
    urlObj.searchParams.set('state', stateToken);
    if (finalCallbackUrl) {
      urlObj.searchParams.set('redirect_uri', finalCallbackUrl);
    }
    nafathUrl = urlObj.toString();

    // 6. Log successful start
    await logAudit('login', null, {
      event: 'nafath.start',
      state_prefix: stateToken.substring(0, 8),
      base_url_used: RABET_BASE_URL
    }, req);

    console.log(`✅ Nafath session created with state: ${stateToken.substring(0, 8)}...`);

    return new Response(JSON.stringify({
      success: true,
      url: nafathUrl,
      state: stateToken,
      expires_at: expiresAt.toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('❌ Nafath Start Error:', error.message);
    
    return new Response(JSON.stringify({
      success: false,
      message: error.message || 'تعذر الاتصال بخدمة نفاذ. تحقق من إعدادات الرابط (Base URL) أو الشبكة.'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
