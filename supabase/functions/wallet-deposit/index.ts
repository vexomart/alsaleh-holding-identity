import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify the user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (req.method === 'POST') {
      interface DepositRequest {
        amount: number;
        payment_method: string;
        description?: string;
      }

      const { amount, payment_method, description }: DepositRequest = await req.json();

      // Validate amount
      if (!amount || amount <= 0) {
        return new Response(
          JSON.stringify({ error: 'Invalid amount' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Generate unique reference
      const reference_id = `DEP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Process the deposit by calling the RPC function
      const { data: result, error: rpcError } = await supabaseClient.rpc('process_wallet_transaction', {
        p_user_id: user.id,
        p_transaction_type: 'deposit',
        p_amount: amount,
        p_description: description || `Deposit via ${payment_method}`,
        p_reference_id: reference_id,
        p_metadata: { payment_method, reference_id }
      });

      if (rpcError) {
        console.error('RPC Error:', rpcError);
        return new Response(
          JSON.stringify({ error: 'Failed to process deposit' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Get updated wallet balance
      const { data: wallet, error: walletError } = await supabaseClient
        .from('customer_wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      return new Response(
        JSON.stringify({ 
          success: true, 
          transaction_id: result?.[0]?.transaction_id,
          new_balance: wallet?.balance || 0,
          reference_id 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});