import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WalletDepositRequest {
  user_id: string;
  amount: number;
  description: string;
  admin_notes?: string;
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

    const { user_id, amount, description, admin_notes }: WalletDepositRequest = await req.json();

    // Validate input
    if (!user_id || !amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid user_id or amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing wallet deposit for user:', user_id, 'amount:', amount);

    // Get user information from profiles first (don't require auth.users)
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

    // Prepare user profile for email
    const finalUserProfile = {
      full_name: userProfile.full_name || 'مستخدم',
      email: userProfile.email || 'no-email@example.com',
      user_id: user_id,
      account_number: userProfile.account_number || 'غير محدد',
      phone: userProfile.phone || null
    };

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
    const newBalance = currentBalance + amount;

    console.log('Current balance:', currentBalance, 'Adding:', amount, 'New balance:', newBalance);

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

    // Create transaction record with minimal required fields
    const transactionRecord = {
      user_id: user_id,
      wallet_id: walletId,
      transaction_type: 'deposit',
      amount: amount,
      balance_before: currentBalance,
      balance_after: newBalance,
      description: description || 'إيداع من الإدارة',
      status: 'completed',
      payment_method: 'admin_deposit',
      payment_reference: `ADMIN_${Date.now()}`,
      reference_id: `ADMIN_DEP_${Date.now()}`,
      customer_name: finalUserProfile.full_name || 'مستخدم',
      customer_email: finalUserProfile.email || 'no-email@example.com',
      customer_phone: finalUserProfile.phone || null,
      metadata: {
        admin_deposit: true,
        admin_notes: admin_notes || '',
        processed_at: new Date().toISOString(),
        processed_by: 'admin'
      }
    };

    console.log('Creating transaction record:', transactionRecord);

    const { data: transactionData, error: transactionError } = await supabase
      .from('wallet_transactions')
      .insert(transactionRecord)
      .select()
      .single();

    if (transactionError) {
      console.error('Error creating transaction record:', transactionError);
      return new Response(
        JSON.stringify({ error: 'فشل في إنشاء سجل المعاملة' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Wallet deposit completed successfully. New balance:', newBalance);
    const walletResult = [{ transaction_id: transactionData.id, new_balance: newBalance }];

    // Send email notification if user has email and resend is available
    if (finalUserProfile.email && finalUserProfile.email !== 'no-email@example.com' && resend) {
      try {
        const emailResult = await resend.emails.send({
          from: 'شركة علي صالح محمد الشهري القابضة <no-reply@alsaleh-holding.com>',
          to: [finalUserProfile.email],
          subject: 'تم إضافة رصيد إلى محفظتك الرقمية',
          html: `
            <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
              <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
                <h1 style="color: white; margin: 0; font-size: 24px;">تم إضافة رصيد إلى محفظتك</h1>
              </div>
              
              <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #1f2937; margin-top: 0;">مرحباً ${finalUserProfile.full_name || 'عزيزي العميل'}</h2>
                
                <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
                  نود إعلامك بأنه تم إضافة رصيد جديد إلى محفظتك الرقمية.
                </p>
                
                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #15803d; margin: 0 0 15px 0;">تفاصيل العملية:</h3>
                  <ul style="color: #166534; margin: 0; padding-right: 20px;">
                    <li><strong>المبلغ المضاف:</strong> ${amount.toLocaleString()} ريال سعودي</li>
                    <li><strong>الوصف:</strong> ${description}</li>
                    <li><strong>التاريخ:</strong> ${new Date().toLocaleDateString('ar-SA')}</li>
                    <li><strong>الوقت:</strong> ${new Date().toLocaleTimeString('ar-SA')}</li>
                  </ul>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                  يمكنك الآن استخدام هذا الرصيد لشراء خدماتنا أو سحبه وفقاً لشروط وأحكام الشركة.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://alsaleh-holding.com/client/wallet" 
                     style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    عرض محفظتي
                  </a>
                </div>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                
                <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                  شركة علي صالح محمد الشهري القابضة<br>
                  هذا إشعار تلقائي، يرجى عدم الرد على هذا الإيميل
                </p>
              </div>
            </div>
          `,
        });

        console.log('Email notification sent successfully:', emailResult);
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Don't fail the transaction if email fails
      }
    }

    // Return success response with transaction details
    return new Response(
      JSON.stringify({
        success: true,
        message: 'تم إضافة الرصيد بنجاح',
        transaction_id: walletResult?.[0]?.transaction_id,
        new_balance: walletResult?.[0]?.new_balance,
        amount_added: amount,
        user_email: finalUserProfile?.email,
        email_sent: !!finalUserProfile?.email
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Error in admin-wallet-deposit function:', error);
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