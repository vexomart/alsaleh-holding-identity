import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // In a real implementation, you would check the database or cache
    // for stored connection status and merchant information
    
    console.log('Checking Google Merchant Center connection status');

    // Simulate checking connection status
    // This would typically involve:
    // 1. Checking stored OAuth tokens
    // 2. Validating token expiry
    // 3. Testing API connectivity
    // 4. Retrieving merchant account info

    const connectionStatus = {
      connected: false,
      merchantId: null,
      lastSyncTime: null,
      apiStatus: 'disconnected',
      accountInfo: null,
      permissions: [],
      errors: []
    };

    // Simulate some scenarios
    const hasValidToken = Math.random() > 0.7; // 30% chance of being connected
    
    if (hasValidToken) {
      connectionStatus.connected = true;
      connectionStatus.merchantId = '1234567890';
      connectionStatus.lastSyncTime = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(); // 2 hours ago
      connectionStatus.apiStatus = 'active';
      connectionStatus.accountInfo = {
        name: 'شركة الصالح القابضة',
        country: 'SA',
        timeZone: 'Asia/Riyadh',
        businessType: 'Services',
        verified: true
      };
      connectionStatus.permissions = [
        'products.list',
        'products.insert',
        'products.update',
        'products.delete',
        'productstatuses.list'
      ];
    } else {
      connectionStatus.errors.push('No valid authentication token found');
    }

    console.log('Connection status:', connectionStatus);

    return new Response(
      JSON.stringify(connectionStatus),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Google Merchant Status Check Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error during status check',
        details: error.message,
        connected: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});