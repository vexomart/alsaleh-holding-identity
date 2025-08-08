import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY") || "");

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
      // Verify with Paylink (authenticate to get id_token)
      const paylinkApiId = Deno.env.get("PAYLINK_API_ID");
      const paylinkApiKey = Deno.env.get("PAYLINK_API_KEY");
      let paylinkToken = Deno.env.get("PAYLINK_ACCESS_TOKEN") || "";
      if (!paylinkToken) {
        if (!paylinkApiId || !paylinkApiKey) {
          console.error('Missing PAYLINK credentials');
        } else {
          const authResp = await fetch("https://restapi.paylink.sa/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({ apiId: paylinkApiId, secretKey: paylinkApiKey, persistToken: "true" })
          });
          const authJson = await authResp.json();
          if (authResp.ok && authJson.id_token) {
            paylinkToken = authJson.id_token;
          } else {
            console.error('Paylink auth failed:', authJson);
          }
        }
      }

      const headers: Record<string, string> = { "Accept": "application/json" };
      if (paylinkToken) headers["Authorization"] = `Bearer ${paylinkToken}`;

      const paylinkResponse = await fetch(`https://restapi.paylink.sa/api/getInvoice/${transaction.paylink_transaction_no}`, { headers });
      
      if (paylinkResponse.ok) {
        const paylinkData = await paylinkResponse.json();
        const status = String(paylinkData.orderStatus || '').toUpperCase();
        if (status.includes('PAID') || status === 'COMPLETED') {
          newStatus = 'PAID';
          paymentVerified = true;
        } else if (['FAILED', 'CANCELLED', 'EXPIRED'].includes(status)) {
          newStatus = 'FAILED';
        } else if (['CREATED', 'PENDING', 'PROCESSING'].includes(status)) {
          newStatus = 'PENDING';
        }
      } else {
        console.error('Paylink verify error status:', paylinkResponse.status);
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