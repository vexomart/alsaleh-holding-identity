import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Load environment variables
const RABET_APP_ID = Deno.env.get('RABET_APP_ID');
const RABET_APP_KEY = Deno.env.get('RABET_APP_KEY');
const RABET_BASE_URL = Deno.env.get('RABET_BASE_URL');

console.log('🔐 Nafath Health Check function initialized');

interface HealthStatus {
  status: 'OK' | 'DNS_FAIL' | 'AUTH_FAIL' | 'CONFIG_ERROR' | 'UNKNOWN_ERROR';
  message: string;
  base_url?: string;
  timestamp: string;
  response_time_ms?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    // 1. Check configuration
    if (!RABET_BASE_URL) {
      const result: HealthStatus = {
        status: 'CONFIG_ERROR',
        message: 'RABET_BASE_URL is not configured',
        timestamp: new Date().toISOString()
      };
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!RABET_APP_ID || !RABET_APP_KEY) {
      const result: HealthStatus = {
        status: 'CONFIG_ERROR',
        message: 'RABET_APP_ID or RABET_APP_KEY is not configured',
        timestamp: new Date().toISOString()
      };
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 2. Test DNS resolution and connectivity
    console.log(`📡 Testing connectivity to: ${RABET_BASE_URL}`);
    
    const testUrl = `${RABET_BASE_URL}/api/v2/oidc/session`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'app_id': RABET_APP_ID,
          'app_key': RABET_APP_KEY,
          'Accept': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      const responseTime = Date.now() - startTime;
      const responseText = await response.text();

      // Check for DNS errors in response
      if (responseText.includes('Name or service not known') || 
          responseText.includes('ENOTFOUND') ||
          responseText.includes('getaddrinfo')) {
        const result: HealthStatus = {
          status: 'DNS_FAIL',
          message: 'DNS resolution failed - check RABET_BASE_URL',
          base_url: RABET_BASE_URL,
          timestamp: new Date().toISOString(),
          response_time_ms: responseTime
        };
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Check for auth errors (401, 403)
      if (response.status === 401 || response.status === 403) {
        const result: HealthStatus = {
          status: 'AUTH_FAIL',
          message: 'Authentication failed - check RABET_APP_ID and RABET_APP_KEY',
          base_url: RABET_BASE_URL,
          timestamp: new Date().toISOString(),
          response_time_ms: responseTime
        };
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Any 2xx or valid response means connectivity works
      const result: HealthStatus = {
        status: 'OK',
        message: 'Nafath service is reachable',
        base_url: RABET_BASE_URL,
        timestamp: new Date().toISOString(),
        response_time_ms: responseTime
      };

      console.log(`✅ Health check passed in ${responseTime}ms`);

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      
      // Check for network/DNS errors
      if (fetchError.message?.includes('Name or service not known') ||
          fetchError.message?.includes('ENOTFOUND') ||
          fetchError.message?.includes('getaddrinfo') ||
          fetchError.name === 'AbortError') {
        
        const result: HealthStatus = {
          status: 'DNS_FAIL',
          message: fetchError.name === 'AbortError' 
            ? 'Connection timeout - DNS or network unreachable' 
            : `DNS resolution failed: ${fetchError.message}`,
          base_url: RABET_BASE_URL,
          timestamp: new Date().toISOString(),
          response_time_ms: responseTime
        };
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      throw fetchError;
    }

  } catch (error: any) {
    console.error('❌ Health check error:', error.message);
    
    const result: HealthStatus = {
      status: 'UNKNOWN_ERROR',
      message: error.message || 'Unknown error occurred',
      base_url: RABET_BASE_URL,
      timestamp: new Date().toISOString(),
      response_time_ms: Date.now() - startTime
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
