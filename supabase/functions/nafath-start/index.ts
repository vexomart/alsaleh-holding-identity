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

console.log('🔐 Nafath Start function initialized');

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

    // 4. Call Rabet OIDC session endpoint to get Nafath login URL
    const rabetResponse = await fetch(`${RABET_BASE_URL}/api/v2/oidc/session`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-App-ID': RABET_APP_ID,
        'X-App-Key': RABET_APP_KEY,
        'Accept': 'application/json'
      }
    });

    if (!rabetResponse.ok) {
      const errorText = await rabetResponse.text();
      console.error('Rabet API error:', rabetResponse.status, errorText);
      await logAudit('login', null, {
        event: 'nafath.start.failure',
        reason: 'rabet_api_error',
        status: rabetResponse.status
      }, req);
      throw new Error('فشل في الاتصال بخدمة نفاذ');
    }

    const rabetData = await rabetResponse.json();
    console.log('Rabet session response received');

    // 5. Construct the final Nafath URL with state
    let nafathUrl = rabetData.url || rabetData.redirect_url || rabetData.login_url;
    
    if (!nafathUrl) {
      console.error('No URL in Rabet response:', rabetData);
      await logAudit('login', null, {
        event: 'nafath.start.failure',
        reason: 'no_nafath_url'
      }, req);
      throw new Error('لم يتم الحصول على رابط نفاذ');
    }

    // Append state parameter for CSRF protection
    const urlObj = new URL(nafathUrl);
    urlObj.searchParams.set('state', stateToken);
    // Set the callback URL if supported
    if (finalCallbackUrl) {
      urlObj.searchParams.set('redirect_uri', finalCallbackUrl);
    }
    nafathUrl = urlObj.toString();

    // 6. Log successful start
    await logAudit('login', null, {
      event: 'nafath.start',
      state_prefix: stateToken.substring(0, 8)
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
    console.error('❌ Nafath Start Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: error.message || 'حدث خطأ غير متوقع'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
