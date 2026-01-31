/**
 * Paylink Authentication Edge Function
 * Authenticates with Paylink API and returns id_token
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PAYLINK_API_URL = 'https://restapi.paylink.sa';

interface PaylinkAuthResponse {
  id_token: string;
  token_type: string;
  expires_in: number;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const vendorId = Deno.env.get('PAYLINK_VENDOR_ID');
    const vendorSecret = Deno.env.get('PAYLINK_VENDOR_SECRET');

    if (!vendorId || !vendorSecret) {
      throw new Error('Paylink credentials not configured');
    }

    // Authenticate with Paylink
    const authResponse = await fetch(`${PAYLINK_API_URL}/api/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        apiId: vendorId,
        secretKey: vendorSecret,
        persistToken: false,
      }),
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error('Paylink auth error:', errorText);
      throw new Error(`Paylink authentication failed: ${authResponse.status}`);
    }

    const authData: PaylinkAuthResponse = await authResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        id_token: authData.id_token,
        expires_in: authData.expires_in,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in paylink-auth:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
