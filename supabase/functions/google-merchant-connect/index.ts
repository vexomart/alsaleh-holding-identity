import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MerchantConnectRequest {
  merchantId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { merchantId }: MerchantConnectRequest = await req.json();

    if (!merchantId) {
      return new Response(
        JSON.stringify({ error: 'Merchant ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Simulate API connection to Google Merchant Center
    // In a real implementation, you would:
    // 1. Validate the merchant ID
    // 2. Set up OAuth2 authentication
    // 3. Test the connection to Google Merchant API
    
    console.log(`Connecting to Google Merchant Center with ID: ${merchantId}`);

    // Simulate some validation and connection logic
    const isValidMerchantId = /^\d{10,}$/.test(merchantId);
    
    if (!isValidMerchantId) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid Merchant ID format. Must be numeric and at least 10 digits.' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Simulate successful connection
    const connectionResult = {
      success: true,
      merchantId: merchantId,
      connected: true,
      message: 'Successfully connected to Google Merchant Center',
      connectionTime: new Date().toISOString(),
      features: {
        productUpload: true,
        inventorySync: true,
        priceUpdates: true,
        statusTracking: true
      }
    };

    console.log('Connection successful:', connectionResult);

    return new Response(
      JSON.stringify(connectionResult),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Google Merchant Connect Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error during merchant connection',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});