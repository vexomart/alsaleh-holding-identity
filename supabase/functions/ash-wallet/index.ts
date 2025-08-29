import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface WalletRequest {
  action: 'deposit' | 'withdraw' | 'get-balance' | 'get-transactions' | 'approve-transaction';
  user_id: string;
  amount?: number;
  description?: string;
  admin_notes?: string;
  transaction_id?: string;
  admin_user_id?: string;
}

// معالجة معاملة المحفظة
async function processWalletTransaction(
  userId: string,
  type: 'deposit' | 'withdraw',
  amount: number,
  description: string,
  adminUserId?: string,
  adminNotes?: string
) {
  // جلب محفظة المستخدم
  const { data: wallet, error: walletError } = await supabase
    .from('ash_wallets')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (walletError || !wallet) {
    throw new Error('محفظة المستخدم غير موجودة');
  }

  const balanceBefore = parseFloat(wallet.balance);
  let balanceAfter = balanceBefore;

  if (type === 'deposit') {
    balanceAfter = balanceBefore + amount;
  } else if (type === 'withdraw') {
    if (balanceBefore < amount) {
      throw new Error('الرصيد غير كافي لإتمام عملية السحب');
    }
    balanceAfter = balanceBefore - amount;
  }

  // إدراج معاملة المحفظة
  const { data: transaction, error: transError } = await supabase
    .from('ash_wallet_transactions')
    .insert({
      wallet_id: wallet.id,
      user_id: userId,
      type,
      amount,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      status: adminUserId ? 'approved' : 'pending',
      description,
      admin_notes: adminNotes,
      created_by: adminUserId,
      approved_by: adminUserId ? adminUserId : null,
      approved_at: adminUserId ? new Date().toISOString() : null
    })
    .select()
    .single();

  if (transError) throw transError;

  // تحديث رصيد المحفظة إذا كانت المعاملة معتمدة
  if (adminUserId) {
    const { error: updateError } = await supabase
      .from('ash_wallets')
      .update({ balance: balanceAfter })
      .eq('id', wallet.id);

    if (updateError) throw updateError;
  }

  return {
    transaction,
    wallet: { ...wallet, balance: adminUserId ? balanceAfter : balanceBefore }
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, user_id, amount, description, admin_notes, transaction_id, admin_user_id }: WalletRequest = await req.json();

    console.log(`💰 ASH Wallet Action: ${action} for user ${user_id}`);

    switch (action) {
      case 'get-balance': {
        const { data: wallet, error } = await supabase
          .from('ash_wallets')
          .select('*')
          .eq('user_id', user_id)
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({
          success: true,
          balance: parseFloat(wallet.balance),
          currency: wallet.currency,
          is_active: wallet.is_active
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'get-transactions': {
        const { data: transactions, error } = await supabase
          .from('ash_wallet_transactions')
          .select(`
            *,
            created_by_user:created_by(name),
            approved_by_user:approved_by(name)
          `)
          .eq('user_id', user_id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;

        return new Response(JSON.stringify({
          success: true,
          transactions
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'deposit': {
        if (!user_id || !amount || amount <= 0) {
          throw new Error('معرف المستخدم والمبلغ مطلوبان');
        }

        const result = await processWalletTransaction(
          user_id,
          'deposit',
          amount,
          description || 'إيداع في المحفظة',
          admin_user_id,
          admin_notes
        );

        return new Response(JSON.stringify({
          success: true,
          message: admin_user_id ? 'تم إيداع المبلغ بنجاح' : 'تم إرسال طلب الإيداع للمراجعة',
          transaction: result.transaction,
          new_balance: result.wallet.balance
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'withdraw': {
        if (!user_id || !amount || amount <= 0) {
          throw new Error('معرف المستخدم والمبلغ مطلوبان');
        }

        const result = await processWalletTransaction(
          user_id,
          'withdraw',
          amount,
          description || 'سحب من المحفظة',
          admin_user_id,
          admin_notes
        );

        return new Response(JSON.stringify({
          success: true,
          message: admin_user_id ? 'تم سحب المبلغ بنجاح' : 'تم إرسال طلب السحب للمراجعة',
          transaction: result.transaction,
          new_balance: result.wallet.balance
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'approve-transaction': {
        if (!transaction_id || !admin_user_id) {
          throw new Error('معرف المعاملة ومعرف الإداري مطلوبان');
        }

        // جلب المعاملة
        const { data: transaction, error: transError } = await supabase
          .from('ash_wallet_transactions')
          .select('*, ash_wallets(*)')
          .eq('id', transaction_id)
          .single();

        if (transError || !transaction) {
          throw new Error('المعاملة غير موجودة');
        }

        if (transaction.status !== 'pending') {
          throw new Error('المعاملة تم معالجتها مسبقاً');
        }

        // تحديث المعاملة
        const { error: updateTransError } = await supabase
          .from('ash_wallet_transactions')
          .update({
            status: 'approved',
            approved_by: admin_user_id,
            approved_at: new Date().toISOString()
          })
          .eq('id', transaction_id);

        if (updateTransError) throw updateTransError;

        // تحديث رصيد المحفظة
        const { error: updateWalletError } = await supabase
          .from('ash_wallets')
          .update({ balance: transaction.balance_after })
          .eq('id', transaction.wallet_id);

        if (updateWalletError) throw updateWalletError;

        return new Response(JSON.stringify({
          success: true,
          message: 'تم اعتماد المعاملة بنجاح',
          new_balance: transaction.balance_after
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      default:
        throw new Error('عملية غير معروفة');
    }

  } catch (error) {
    console.error('❌ ASH Wallet Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});