import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DepositRequest {
  amount: number;
  payment_method: string;
  description?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid user token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (req.method === 'POST') {
      const { amount, payment_method, description }: DepositRequest = await req.json();

      if (!amount || amount <= 0) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid amount' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Generate transaction reference
      const reference = `DEP_${Date.now()}_${user.id.slice(0, 8)}`;

      // Process wallet transaction
      const { data: transactionId, error } = await supabase.rpc(
        'process_wallet_transaction',
        {
          p_user_id: user.id,
          p_transaction_type: 'deposit',
          p_amount: amount,
          p_description: description || `شحن المحفظة - ${payment_method}`,
          p_payment_method: payment_method,
          p_payment_reference: reference
        }
      );

      if (error) {
        console.error('Transaction error:', error);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to process deposit' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get updated wallet balance
      const { data: wallet } = await supabase
        .from('customer_wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      return new Response(
        JSON.stringify({ 
          success: true, 
          transaction_id: transactionId,
          new_balance: wallet?.balance || 0,
          reference: reference
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Wallet deposit error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});