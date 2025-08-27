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
  console.log('Request received:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Creating Supabase client...');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log('No authorization header');
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify the user
    console.log('Verifying user...');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.log('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('User verified:', user.id);

    if (req.method === 'POST') {
      console.log('Processing POST request...');
      const requestBody = await req.json();
      console.log('Request body:', requestBody);
      
      const { amount, payment_method, description, receipt_file }: DepositRequest = requestBody;

      // Validate amount
      if (!amount || amount <= 0) {
        console.log('Invalid amount:', amount);
        return new Response(
          JSON.stringify({ error: 'Invalid amount' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log('Getting payment method configuration...');
      // Get payment method configuration from database
      const { data: paymentMethodConfig, error: methodError } = await supabaseClient
        .from('payment_methods')
        .select('*')
        .eq('provider', payment_method)
        .eq('is_active', true)
        .single();

      if (methodError || !paymentMethodConfig) {
        console.log('Payment method error:', methodError);
        return new Response(
          JSON.stringify({ error: 'Payment method not found or inactive' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log('Payment method found:', paymentMethodConfig.name_ar);

      // Generate unique reference
      const reference_id = `DEP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log('Generated reference:', reference_id);

      // For bank transfer, process immediately as pending
      if (payment_method === 'bank_transfer') {
        console.log('Processing bank transfer...');
        
        try {
          // First, ensure user has a wallet
          console.log('Checking/creating user wallet...');
          let { data: wallet, error: walletError } = await supabaseClient
            .from('customer_wallets')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (walletError && walletError.code === 'PGRST116') {
            // Wallet doesn't exist, create it
            console.log('Creating new wallet for user...');
            const { data: newWallet, error: createError } = await supabaseClient
              .from('customer_wallets')
              .insert({
                user_id: user.id,
                balance: 0,
                currency: 'SAR'
              })
              .select()
              .single();

            if (createError) {
              console.error('Wallet creation error:', createError);
              throw createError;
            }
            wallet = newWallet;
          } else if (walletError) {
            console.error('Wallet fetch error:', walletError);
            throw walletError;
          }

          console.log('Wallet found/created:', wallet.id);

          // Get current balance
          const currentBalance = wallet.balance || 0;
          console.log('Current wallet balance:', currentBalance);

          // Create transaction record with all required fields
          console.log('Inserting transaction record...');
          const { data: transaction, error: insertError } = await supabaseClient
            .from('wallet_transactions')
            .insert({
              user_id: user.id,
              wallet_id: wallet.id,
              transaction_type: 'deposit',
              amount: amount,
              balance_before: currentBalance,
              balance_after: currentBalance, // Will be updated later when approved
              description: description || `Deposit via ${paymentMethodConfig.name_ar}`,
              reference_id: reference_id,
              status: 'pending',
              payment_method: payment_method,
              payment_reference: reference_id,
              metadata: { 
                payment_method: payment_method,
                payment_provider: paymentMethodConfig.provider,
                receipt_uploaded: !!receipt_file,
                receipt_file: receipt_file || null,
                bank_info: paymentMethodConfig.configuration
              }
            })
            .select()
            .single();

          if (insertError) {
            console.error('Insert Error:', insertError);
            return new Response(
              JSON.stringify({ error: 'Failed to create transaction' }),
              { 
                status: 500, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }

          console.log('Transaction created:', transaction.id);

          // Send notification emails
          try {
            console.log('Sending notification emails...');
            await supabaseClient.functions.invoke('wallet-deposit-notification', {
              body: {
                transactionId: transaction.id,
                userEmail: user.email || '',
                userName: user.user_metadata?.full_name || 'عميل',
                amount: amount,
                referenceId: reference_id
              }
            });
            console.log('Notification emails sent');
          } catch (emailError) {
            console.error('Error sending notification emails:', emailError);
            // Don't fail the transaction if email fails
          }

          return new Response(
            JSON.stringify({ 
              success: true, 
              transaction_id: transaction.id,
              reference_id,
              status: 'pending',
              message: 'تم إرسال طلب الشحن وإرسال الإشعارات. سيتم مراجعة الإيصال وإضافة المبلغ خلال 24 ساعة'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );

        } catch (error) {
          console.error('Processing error:', error);
          return new Response(
            JSON.stringify({ error: 'Transaction processing failed' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
      }

      // For other payment methods, return demo URLs for now
      console.log('Processing other payment method:', payment_method);
      
      let payment_url = '';
      switch (payment_method) {
        case 'stripe':
          payment_url = `https://checkout.stripe.com/demo/${reference_id}`;
          break;
        case 'stc_pay':
          payment_url = `https://stcpay.com.sa/demo/${reference_id}`;
          break;
        case 'tamara':
          payment_url = `https://tamara.co/demo/${reference_id}`;
          break;
        default:
          return new Response(
            JSON.stringify({ error: 'Payment method not supported' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          payment_url: payment_url,
          reference_id,
          status: 'pending'
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
      JSON.stringify({ error: 'Internal server error: ' + error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});