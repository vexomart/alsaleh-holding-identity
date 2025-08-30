import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WalletRequest {
  action: 'get-balance' | 'get-transactions' | 'deposit' | 'withdraw';
  user_id: string;
  amount?: number;
  description?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, user_id, amount, description }: WalletRequest = await req.json();

    console.log('🏦 Ash Wallet request:', { action, user_id, amount: amount ? '***' : null });

    switch (action) {
      case 'get-balance': {
        // جلب رصيد المحفظة
        const { data: wallet, error: walletError } = await supabase
          .from('ash_wallets')
          .select('*')
          .eq('user_id', user_id)
          .single();

        if (walletError && walletError.code === 'PGRST116') {
          // إنشاء محفظة جديدة إذا لم توجد - استخدام صلاحيات النظام
          const { data: newWallet, error: createError } = await supabase
            .from('ash_wallets')
            .insert([{
              user_id: user_id,
              balance: 0.00,
              currency: 'SAR',
              is_active: true
            }])
            .select()
            .single();

          if (createError) {
            console.error('خطأ في إنشاء المحفظة:', createError);
            throw new Error(`خطأ في إنشاء المحفظة: ${createError.message}`);
          }

          console.log('✅ تم إنشاء محفظة جديدة:', newWallet);
          return new Response(JSON.stringify(newWallet), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        if (walletError) {
          throw new Error(`خطأ في جلب المحفظة: ${walletError.message}`);
        }

        return new Response(JSON.stringify(wallet), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get-transactions': {
        // جلب المعاملات
        const { data: transactions, error: transError } = await supabase
          .from('ash_wallet_transactions')
          .select('*')
          .eq('user_id', user_id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (transError) {
          throw new Error(`خطأ في جلب المعاملات: ${transError.message}`);
        }

        return new Response(JSON.stringify({ transactions }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'deposit': {
        if (!amount || amount <= 0) {
          throw new Error('مبلغ الإيداع غير صحيح');
        }

        // إنشاء طلب إيداع
        const { data: transaction, error: transError } = await supabase
          .from('ash_wallet_transactions')
          .insert([{
            user_id: user_id,
            type: 'deposit',
            amount: amount,
            status: 'pending',
            description: description || 'طلب إيداع من العميل'
          }])
          .select()
          .single();

        if (transError) {
          throw new Error(`خطأ في إنشاء طلب الإيداع: ${transError.message}`);
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'تم إرسال طلب الإيداع بنجاح. سيتم مراجعته من قبل الإدارة.',
          transaction
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'withdraw': {
        if (!amount || amount <= 0) {
          throw new Error('مبلغ السحب غير صحيح');
        }

        // التحقق من رصيد المحفظة
        const { data: wallet, error: walletError } = await supabase
          .from('ash_wallets')
          .select('balance')
          .eq('user_id', user_id)
          .single();

        if (walletError) {
          throw new Error(`خطأ في التحقق من الرصيد: ${walletError.message}`);
        }

        if (wallet.balance < amount) {
          throw new Error('الرصيد غير كافي لإجراء عملية السحب');
        }

        // إنشاء طلب سحب
        const { data: transaction, error: transError } = await supabase
          .from('ash_wallet_transactions')
          .insert([{
            user_id: user_id,
            type: 'withdraw',
            amount: amount,
            status: 'pending',
            description: description || 'طلب سحب من العميل'
          }])
          .select()
          .single();

        if (transError) {
          throw new Error(`خطأ في إنشاء طلب السحب: ${transError.message}`);
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'تم إرسال طلب السحب بنجاح. سيتم مراجعته من قبل الإدارة.',
          transaction
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error('عملية غير مدعومة');
    }

  } catch (error: any) {
    console.error('❌ Ash Wallet error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'حدث خطأ في معالجة طلب المحفظة' 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);