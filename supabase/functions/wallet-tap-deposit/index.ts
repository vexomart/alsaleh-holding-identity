import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WalletDepositRequest {
  amount: number;
  tap_charge_id: string;
  tap_reference: string;
  status: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Wallet Tap deposit callback started');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request
    const depositData: WalletDepositRequest = await req.json();
    console.log('Deposit callback data:', depositData);

    // Validate required fields
    if (!depositData.tap_charge_id || !depositData.amount) {
      throw new Error('Missing required deposit data');
    }

    // Find the payment transaction
    const { data: paymentTransaction, error: paymentError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('metadata->tap_charge_id', depositData.tap_charge_id)
      .eq('status', 'PENDING_TAP')
      .single();

    if (paymentError || !paymentTransaction) {
      console.error('Payment transaction not found:', paymentError);
      throw new Error('Payment transaction not found');
    }

    // Check if payment was successful
    if (depositData.status !== 'CAPTURED') {
      console.log('Payment not successful:', depositData.status);
      
      // Update transaction status to failed
      await supabase
        .from('payment_transactions')
        .update({ 
          status: 'FAILED',
          metadata: {
            ...paymentTransaction.metadata,
            failure_reason: depositData.status
          }
        })
        .eq('id', paymentTransaction.id);

      return new Response(
        JSON.stringify({ success: false, error: 'Payment failed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process wallet deposit using the database function
    const { data: transactionResult, error: walletError } = await supabase
      .rpc('process_wallet_transaction', {
        p_user_id: paymentTransaction.user_id,
        p_transaction_type: 'deposit',
        p_amount: depositData.amount,
        p_description: `إيداع من بوابة Tap Company - ${depositData.tap_charge_id}`,
        p_reference_id: depositData.tap_charge_id,
        p_metadata: {
          tap_charge_id: depositData.tap_charge_id,
          tap_reference: depositData.tap_reference,
          payment_method: 'TAP'
        }
      });

    if (walletError) {
      console.error('Wallet transaction error:', walletError);
      throw new Error('Failed to process wallet deposit');
    }

    // Update payment transaction status to completed
    await supabase
      .from('payment_transactions')
      .update({ 
        status: 'COMPLETED',
        payment_date: new Date().toISOString(),
        metadata: {
          ...paymentTransaction.metadata,
          wallet_transaction_id: transactionResult[0]?.transaction_id,
          completed_at: new Date().toISOString()
        }
      })
      .eq('id', paymentTransaction.id);

    console.log('Wallet deposit processed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        transaction_id: transactionResult[0]?.transaction_id,
        new_balance: transactionResult[0]?.new_balance
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Wallet deposit error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});