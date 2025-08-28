import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentCallbackData {
  transaction_id: string;
  payment_status: 'success' | 'failed' | 'cancelled';
  reference_id?: string;
  payment_gateway?: string;
  gateway_transaction_id?: string;
  amount?: number;
  metadata?: any;
}

serve(async (req) => {
  console.log('Payment callback received:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method === 'POST') {
      const callbackData: PaymentCallbackData = await req.json();
      console.log('Payment callback data:', callbackData);

      const { transaction_id, payment_status, reference_id, gateway_transaction_id, amount, metadata } = callbackData;

      // Get the transaction
      const { data: transaction, error: transactionError } = await supabaseClient
        .from('wallet_transactions')
        .select('*')
        .eq('id', transaction_id)
        .single();

      if (transactionError || !transaction) {
        console.error('Transaction not found:', transactionError);
        return new Response(
          JSON.stringify({ error: 'Transaction not found' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log('Found transaction:', transaction.id, 'Current status:', transaction.status);

      if (payment_status === 'success') {
        console.log('Processing successful payment...');
        
        try {
          // Get or create user wallet
          let { data: wallet, error: walletError } = await supabaseClient
            .from('customer_wallets')
            .select('*')
            .eq('user_id', transaction.user_id)
            .single();

          if (walletError && walletError.code === 'PGRST116') {
            // Create wallet if doesn't exist
            const { data: newWallet, error: createError } = await supabaseClient
              .from('customer_wallets')
              .insert({
                user_id: transaction.user_id,
                balance: 0,
                currency: 'SAR'
              })
              .select()
              .single();

            if (createError) {
              throw createError;
            }
            wallet = newWallet;
          } else if (walletError) {
            throw walletError;
          }

          const currentBalance = wallet.balance || 0;
          const newBalance = currentBalance + transaction.amount;

          // Update wallet balance
          const { error: updateWalletError } = await supabaseClient
            .from('customer_wallets')
            .update({ 
              balance: newBalance,
              updated_at: new Date().toISOString()
            })
            .eq('id', wallet.id);

          if (updateWalletError) {
            throw updateWalletError;
          }

          // Update transaction status
          const { error: updateTransactionError } = await supabaseClient
            .from('wallet_transactions')
            .update({
              status: 'completed',
              balance_before: currentBalance,
              balance_after: newBalance,
              wallet_id: wallet.id,
              metadata: {
                ...transaction.metadata,
                gateway_transaction_id,
                payment_completed_at: new Date().toISOString(),
                payment_gateway_response: metadata
              },
              updated_at: new Date().toISOString()
            })
            .eq('id', transaction_id);

          if (updateTransactionError) {
            throw updateTransactionError;
          }

          console.log(`Transaction ${transaction_id} completed successfully. New balance: ${newBalance}`);

          return new Response(
            JSON.stringify({ 
              success: true, 
              message: 'Payment processed successfully',
              transaction_id,
              new_balance: newBalance,
              status: 'completed'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );

        } catch (error) {
          console.error('Error processing successful payment:', error);
          
          // Update transaction as failed
          await supabaseClient
            .from('wallet_transactions')
            .update({
              status: 'failed',
              metadata: {
                ...transaction.metadata,
                error_message: error.message,
                failed_at: new Date().toISOString()
              }
            })
            .eq('id', transaction_id);

          return new Response(
            JSON.stringify({ 
              error: 'Failed to process payment',
              transaction_id 
            }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

      } else {
        // Payment failed or cancelled
        console.log(`Payment ${payment_status} for transaction ${transaction_id}`);
        
        const { error: updateError } = await supabaseClient
          .from('wallet_transactions')
          .update({
            status: payment_status === 'cancelled' ? 'cancelled' : 'failed',
            metadata: {
              ...transaction.metadata,
              gateway_transaction_id,
              failure_reason: payment_status,
              failed_at: new Date().toISOString(),
              gateway_response: metadata
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', transaction_id);

        if (updateError) {
          console.error('Error updating failed transaction:', updateError);
        }

        return new Response(
          JSON.stringify({ 
            success: false, 
            message: payment_status === 'cancelled' ? 'Payment cancelled' : 'Payment failed',
            transaction_id,
            status: payment_status 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    // Handle GET requests (for redirect callbacks)
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const transaction_id = url.searchParams.get('transaction_id');
      const status = url.searchParams.get('status') || 'failed';
      
      if (transaction_id) {
        // Process the callback
        const callbackData: PaymentCallbackData = {
          transaction_id,
          payment_status: status as 'success' | 'failed' | 'cancelled'
        };
        
        // Re-route to POST handler
        return await fetch(req.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(callbackData)
        });
      }
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Payment callback error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error: ' + error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});