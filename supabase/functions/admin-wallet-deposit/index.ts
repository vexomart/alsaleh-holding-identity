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

    // Get user information from profiles first
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('full_name, email, user_id')
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
      return new Response(
        JSON.stringify({ 
          error: 'المستخدم غير موجود في النظام',
          details: 'User profile not found'
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Try to get user from auth.users, if not found, we'll continue with profile data
    let authUser = null;
    try {
      const { data, error: authError } = await supabase.auth.admin.getUserById(user_id);
      if (!authError && data.user) {
        authUser = data.user;
      }
    } catch (authError) {
      console.log('User not found in auth.users, continuing with profile data:', authError);
    }

    // Use profile email or a default email if none exists
    const finalUserProfile = {
      full_name: userProfile.full_name || 'مستخدم',
      email: userProfile.email || authUser?.email || 'no-email@example.com',
      user_id: user_id
    };

    // Process wallet transaction using the database function
    const { data: walletResult, error: walletError } = await supabase.rpc('process_wallet_transaction', {
      p_user_id: user_id,
      p_transaction_type: 'deposit',
      p_amount: amount,
      p_description: description,
      p_reference_id: `ADMIN_${Date.now()}`,
      p_metadata: {
        admin_deposit: true,
        admin_notes: admin_notes || '',
        processed_at: new Date().toISOString()
      }
    });

    if (walletError) {
      console.error('Wallet transaction error:', walletError);
      return new Response(
        JSON.stringify({ error: 'Failed to process wallet transaction', details: walletError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Wallet transaction processed successfully:', walletResult);

    // Send email notification if user profile exists and email is available
    if (finalUserProfile && finalUserProfile.email && resend) {
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

serve(handler);