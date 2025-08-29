import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WalletWithdrawRequest {
  user_id: string;
  amount: number;
  description: string;
  admin_notes?: string;
  withdrawal_method?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Initialize Resend for email notifications
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    const { user_id, amount, description, admin_notes, withdrawal_method }: WalletWithdrawRequest = await req.json();

    // Validate input
    if (!user_id || !amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'معرف المستخدم أو المبلغ غير صحيح' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing wallet withdrawal for user:', user_id, 'amount:', amount);

    // Get user information from profiles
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('full_name, email, user_id, account_number, phone')
      .eq('user_id', user_id)
      .maybeSingle();

    if (userError) {
      console.error('Error fetching user profile:', userError);
      return new Response(
        JSON.stringify({ 
          error: 'خطأ في جلب بيانات المستخدم',
          details: userError.message
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!userProfile) {
      console.error('User profile not found for user_id:', user_id);
      return new Response(
        JSON.stringify({ 
          error: 'المستخدم غير موجود في النظام',
          details: 'User profile not found'
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User profile found:', userProfile);

    // Get or create wallet for user
    const walletId = await getOrCreateWallet(supabase, user_id);
    
    // Get current wallet balance
    const { data: currentWallet, error: walletFetchError } = await supabase
      .from('customer_wallets')
      .select('balance')
      .eq('user_id', user_id)
      .single();

    if (walletFetchError) {
      console.error('Error fetching current wallet:', walletFetchError);
      return new Response(
        JSON.stringify({ error: 'فشل في جلب بيانات المحفظة الحالية' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const currentBalance = parseFloat(currentWallet.balance || '0');
    
    // Check if sufficient balance
    if (currentBalance < amount) {
      return new Response(
        JSON.stringify({ 
          error: 'الرصيد غير كافي',
          details: `الرصيد الحالي: ${currentBalance} ريال، المبلغ المطلوب: ${amount} ريال`
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const newBalance = currentBalance - amount;

    console.log('Current balance:', currentBalance, 'Withdrawing:', amount, 'New balance:', newBalance);

    // Update wallet balance
    const { error: updateError } = await supabase
      .from('customer_wallets')
      .update({ 
        balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user_id);

    if (updateError) {
      console.error('Error updating wallet balance:', updateError);
      return new Response(
        JSON.stringify({ error: 'فشل في تحديث رصيد المحفظة' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create transaction record
    const { data: transactionData, error: transactionError } = await supabase
      .from('wallet_transactions')
      .insert({
        user_id: user_id,
        wallet_id: walletId,
        transaction_type: 'withdrawal',
        amount: amount,
        balance_before: currentBalance,
        balance_after: newBalance,
        description: description || 'سحب من الإدارة',
        status: 'completed',
        payment_method: withdrawal_method || 'admin_withdrawal',
        reference_id: `ADMIN_WD_${Date.now()}`,
        customer_name: userProfile.full_name || 'مستخدم',
        customer_email: userProfile.email || 'no-email@example.com',
        customer_phone: userProfile.phone || null,
        metadata: {
          admin_withdrawal: true,
          admin_notes: admin_notes || '',
          account_number: userProfile.account_number,
          processed_at: new Date().toISOString(),
          processed_by: 'admin'
        }
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Error creating transaction record:', transactionError);
      return new Response(
        JSON.stringify({ error: 'فشل في إنشاء سجل المعاملة' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Wallet withdrawal completed successfully. New balance:', newBalance);

    // Send email notification using wallet-email-notifications function
    if (userProfile.email && userProfile.email !== 'no-email@example.com') {
      try {
        const emailResult = await supabase.functions.invoke('wallet-email-notifications', {
          body: {
            type: 'withdrawal',
            customer_email: userProfile.email,
            customer_name: userProfile.full_name || 'عميلنا الكريم',
            data: {
              amount: amount,
              new_balance: newBalance,
              old_balance: currentBalance,
              transaction_id: transactionData.id,
              reference_id: transactionData.reference_id,
              description: description,
              reason: description
            }
          }
        });

        console.log('Wallet email notification invoked:', emailResult);
      } catch (emailError) {
        console.error('Error sending wallet email notification:', emailError);
        // Don't fail the transaction if email fails
      }
    }

    // Return success response with transaction details
    return new Response(
      JSON.stringify({
        success: true,
        message: 'تم سحب الرصيد بنجاح',
        transaction_id: transactionData.id,
        new_balance: newBalance,
        amount_withdrawn: amount,
        user_email: userProfile.email,
        account_number: userProfile.account_number,
        email_sent: !!userProfile.email
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Error in admin-wallet-withdraw function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

// Helper function to get or create wallet
async function getOrCreateWallet(supabase: any, userId: string): Promise<string> {
  // Try to get existing wallet
  const { data: existingWallet } = await supabase
    .from('customer_wallets')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (existingWallet) {
    return existingWallet.id;
  }

  // Create new wallet
  const { data: newWallet, error } = await supabase
    .from('customer_wallets')
    .insert({
      user_id: userId,
      balance: 0,
      currency: 'SAR'
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to create wallet: ${error.message}`);
  }

  return newWallet.id;
}

serve(handler);