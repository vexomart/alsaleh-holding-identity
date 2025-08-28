import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReferralData {
  affiliateCode: string;
  newUserId: string;
  orderValue?: number;
  serviceRequestId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { affiliateCode, newUserId, orderValue, serviceRequestId }: ReferralData = await req.json();

    console.log('Processing affiliate referral:', { affiliateCode, newUserId, orderValue });

    // البحث عن برنامج التسويق باستخدام الكود
    const { data: affiliateProgram, error: affiliateProgramError } = await supabase
      .from('affiliate_program')
      .select('*')
      .eq('affiliate_code', affiliateCode)
      .eq('status', 'active')
      .single();

    if (affiliateProgramError || !affiliateProgram) {
      console.error('Affiliate program not found:', affiliateProgramError);
      return new Response(
        JSON.stringify({ error: 'كود التسويق غير صحيح أو غير مفعل' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // التحقق من عدم وجود إحالة سابقة لنفس المستخدم
    const { data: existingReferral } = await supabase
      .from('affiliate_referrals')
      .select('id')
      .eq('referred_user_id', newUserId)
      .single();

    if (existingReferral) {
      console.log('User already referred by someone else');
      return new Response(
        JSON.stringify({ message: 'المستخدم مُحال مسبقاً من قبل مسوق آخر' }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // إنشاء سجل الإحالة
    const { data: referral, error: referralError } = await supabase
      .from('affiliate_referrals')
      .insert({
        affiliate_user_id: affiliateProgram.user_id,
        referred_user_id: newUserId,
        affiliate_code: affiliateCode,
        commission_earned: 0,
        order_value: orderValue || 0,
        status: 'pending'
      })
      .select()
      .single();

    if (referralError) {
      console.error('Error creating referral:', referralError);
      throw referralError;
    }

    // إذا كان هناك طلب خدمة، إنشاء عمولة
    if (serviceRequestId && orderValue) {
      const commissionRate = affiliateProgram.commission_rate || 10;
      const commissionAmount = (orderValue * commissionRate) / 100;

      const { error: commissionError } = await supabase
        .from('affiliate_commissions')
        .insert({
          affiliate_user_id: affiliateProgram.user_id,
          referred_user_id: newUserId,
          service_request_id: serviceRequestId,
          order_amount: orderValue,
          commission_rate: commissionRate,
          commission_amount: commissionAmount,
          status: 'pending'
        });

      if (commissionError) {
        console.error('Error creating commission:', commissionError);
      }

      // تحديث إحصائيات المسوق
      const { error: updateStatsError } = await supabase
        .from('affiliate_program')
        .update({
          total_referrals: affiliateProgram.total_referrals + 1,
          total_orders: affiliateProgram.total_orders + 1,
          total_earnings: affiliateProgram.total_earnings + commissionAmount,
          updated_at: new Date().toISOString()
        })
        .eq('id', affiliateProgram.id);

      if (updateStatsError) {
        console.error('Error updating affiliate stats:', updateStatsError);
      }

      // حساب المستوى الجديد
      try {
        const { data: newLevel, error: levelError } = await supabase
          .rpc('calculate_affiliate_level', { user_id: affiliateProgram.user_id });

        if (levelError) {
          console.error('Error calculating level:', levelError);
        } else {
          console.log('New affiliate level calculated:', newLevel);
        }
      } catch (levelErr) {
        console.error('Level calculation failed:', levelErr);
      }
    } else {
      // تحديث عدد الإحالات فقط
      const { error: updateStatsError } = await supabase
        .from('affiliate_program')
        .update({
          total_referrals: affiliateProgram.total_referrals + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', affiliateProgram.id);

      if (updateStatsError) {
        console.error('Error updating affiliate stats:', updateStatsError);
      }
    }

    console.log('Affiliate referral processed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'تم تسجيل الإحالة بنجاح',
        referralId: referral.id,
        affiliateUserId: affiliateProgram.user_id
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Error processing affiliate referral:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);