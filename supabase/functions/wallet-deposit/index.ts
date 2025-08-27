import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DepositRequest {
  amount: number;
  payment_method: string;
  description?: string;
  receipt_file?: string;
}

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
      const { amount, payment_method, description, receipt_file }: DepositRequest = await req.json();

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

      // Get payment method configuration from database
      const { data: paymentMethodConfig, error: methodError } = await supabaseClient
        .from('payment_methods')
        .select('*')
        .eq('provider', payment_method)
        .eq('is_active', true)
        .single();

      if (methodError || !paymentMethodConfig) {
        return new Response(
          JSON.stringify({ error: 'Payment method not found or inactive' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Check amount limits from configuration
      const config = paymentMethodConfig.configuration;
      if (config.min_amount && amount < config.min_amount) {
        return new Response(
          JSON.stringify({ 
            error: `Minimum amount is ${config.min_amount} SAR` 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      if (config.max_amount && amount > config.max_amount) {
        return new Response(
          JSON.stringify({ 
            error: `Maximum amount is ${config.max_amount} SAR` 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Generate unique reference
      const reference_id = `DEP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Process payment based on provider
      let paymentResult;
      
      try {
        switch (paymentMethodConfig.provider) {
          case 'stripe':
            paymentResult = await processStripePayment(amount, paymentMethodConfig, reference_id);
            break;
          case 'stc_pay':
            paymentResult = await processSTCPayment(amount, paymentMethodConfig, reference_id);
            break;
          case 'tamara':
            paymentResult = await processTamaraPayment(amount, paymentMethodConfig, reference_id);
            break;
          case 'bank_transfer':
            paymentResult = await processBankTransfer(amount, paymentMethodConfig, reference_id);
            break;
          default:
            // For demo purposes, simulate successful payment
            paymentResult = {
              success: true,
              payment_url: null,
              transaction_id: reference_id,
              status: 'completed'
            };
        }
      } catch (error) {
        console.error('Payment processing error:', error);
        return new Response(
          JSON.stringify({ error: 'Payment processing failed' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      if (paymentResult.success) {
        // For direct payments (like demo/bank transfer), process immediately
        if (paymentResult.status === 'completed') {
          try {
            const { data: result, error: rpcError } = await supabaseClient.rpc('process_wallet_transaction', {
              p_user_id: user.id,
              p_transaction_type: 'deposit',
              p_amount: amount,
              p_description: description || `Deposit via ${paymentMethodConfig.name_ar}`,
              p_reference_id: reference_id,
              p_metadata: { 
                payment_method: payment_method,
                reference_id: reference_id,
                payment_provider: paymentMethodConfig.provider,
                receipt_uploaded: !!receipt_file
              }
            });

            if (rpcError) {
              console.error('RPC Error:', rpcError);
              // Create transaction manually if RPC fails
              const { data: transaction, error: insertError } = await supabaseClient
                .from('wallet_transactions')
                .insert({
                  user_id: user.id,
                  transaction_type: 'deposit',
                  amount: amount,
                  description: description || `Deposit via ${paymentMethodConfig.name_ar}`,
                  reference_id: reference_id,
                  status: 'completed',
                  metadata: { 
                    payment_method: payment_method,
                    reference_id: reference_id,
                    payment_provider: paymentMethodConfig.provider,
                    receipt_uploaded: !!receipt_file
                  }
                })
                .select()
                .single();

              if (insertError) {
                console.error('Insert Error:', insertError);
                return new Response(
                  JSON.stringify({ error: 'Failed to process deposit' }),
                  { 
                    status: 500, 
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
                  }
                );
              }

              // Update wallet balance manually - add to existing balance
              const { data: currentWallet } = await supabaseClient
                .from('customer_wallets')
                .select('balance')
                .eq('user_id', user.id)
                .single();

              const currentBalance = currentWallet?.balance || 0;
              const newBalance = currentBalance + amount;

              const { error: updateError } = await supabaseClient
                .from('customer_wallets')
                .upsert({
                  user_id: user.id,
                  balance: newBalance,
                  currency: 'SAR'
                }, {
                  onConflict: 'user_id'
                });

              if (updateError) {
                console.error('Update Error:', updateError);
              }
            }
          } catch (error) {
            console.error('Transaction processing error:', error);
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
              transaction_id: reference_id,
              new_balance: wallet?.balance || 0,
              reference_id,
              status: 'completed'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        } else if (paymentResult.payment_url) {
          // For redirect payments (like Stripe), return the payment URL
          return new Response(
            JSON.stringify({ 
              success: true, 
              payment_url: paymentResult.payment_url,
              reference_id,
              status: 'pending'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
      }

      return new Response(
        JSON.stringify({ error: 'Payment processing failed' }),
        { 
          status: 500, 
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

// Payment processor functions
async function processStripePayment(amount: number, config: any, reference_id: string) {
  // For now, return demo response
  // In production, integrate with Stripe API using config.api_key and config.secret_key
  return {
    success: true,
    payment_url: `https://checkout.stripe.com/demo/${reference_id}`,
    transaction_id: reference_id,
    status: 'pending'
  };
}

async function processSTCPayment(amount: number, config: any, reference_id: string) {
  // For now, return demo response
  // In production, integrate with STC Pay API
  return {
    success: true,
    payment_url: `https://stcpay.com.sa/demo/${reference_id}`,
    transaction_id: reference_id,
    status: 'pending'
  };
}

async function processTamaraPayment(amount: number, config: any, reference_id: string) {
  // For now, return demo response
  // In production, integrate with Tamara API
  return {
    success: true,
    payment_url: `https://tamara.co/demo/${reference_id}`,
    transaction_id: reference_id,
    status: 'pending'
  };
}

async function processBankTransfer(amount: number, config: any, reference_id: string) {
  // Bank transfer is typically completed immediately in demo
  return {
    success: true,
    payment_url: null,
    transaction_id: reference_id,
    status: 'completed'
  };
}