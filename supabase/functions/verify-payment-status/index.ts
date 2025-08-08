import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transactionId } = await req.json();
    
    if (!transactionId) {
      throw new Error('Transaction ID is required');
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get transaction details
    const { data: transaction, error: fetchError } = await supabaseClient
      .from('payment_transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (fetchError || !transaction) {
      throw new Error('Transaction not found');
    }

    let newStatus = transaction.status;
    let paymentVerified = false;

    // Verify payment based on payment method
    if (transaction.tap_charge_id) {
      // Verify with Tap
      const tapResponse = await fetch(`https://api.tap.company/v2/charges/${transaction.tap_charge_id}`, {
        headers: {
          'Authorization': `Bearer ${Deno.env.get("TAP_SECRET_KEY")}`,
        },
      });
      
      if (tapResponse.ok) {
        const tapData = await tapResponse.json();
        if (tapData.status === 'CAPTURED') {
          newStatus = 'PAID';
          paymentVerified = true;
        } else if (tapData.status === 'FAILED') {
          newStatus = 'FAILED';
        }
      }
    } else if (transaction.paylink_transaction_no) {
      // Verify with Paylink
      const paylinkResponse = await fetch(`https://restapi.paylink.sa/api/v1/getInvoice/${transaction.paylink_transaction_no}`, {
        headers: {
          'Authorization': `Bearer ${Deno.env.get("PAYLINK_API_KEY")}`,
        },
      });
      
      if (paylinkResponse.ok) {
        const paylinkData = await paylinkResponse.json();
        if (paylinkData.orderStatus === 'Paid') {
          newStatus = 'PAID';
          paymentVerified = true;
        } else if (paylinkData.orderStatus === 'Expired' || paylinkData.orderStatus === 'Cancelled') {
          newStatus = 'FAILED';
        }
      }
    } else if (transaction.tamara_order_id) {
      // Verify with Tamara
      const tamaraResponse = await fetch(`https://api.tamara.co/orders/${transaction.tamara_order_id}`, {
        headers: {
          'Authorization': `Bearer ${Deno.env.get("TAMARA_API_KEY")}`,
        },
      });
      
      if (tamaraResponse.ok) {
        const tamaraData = await tamaraResponse.json();
        if (tamaraData.status === 'approved') {
          newStatus = 'PAID';
          paymentVerified = true;
        } else if (tamaraData.status === 'declined' || tamaraData.status === 'expired') {
          newStatus = 'FAILED';
        }
      }
    }

    // Update transaction status if changed
    if (newStatus !== transaction.status) {
      const { error: updateError } = await supabaseClient
        .from('payment_transactions')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId);

      if (updateError) {
        console.error('Error updating transaction:', updateError);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      status: newStatus,
      verified: paymentVerified,
      transaction
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});