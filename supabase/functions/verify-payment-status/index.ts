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

    // Update transaction status if changed and send email notifications
    const statusChanged = newStatus !== transaction.status;
    if (statusChanged) {
      const { error: updateError } = await supabaseClient
        .from('payment_transactions')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId);

      if (updateError) {
        console.error('Error updating transaction:', updateError);
      } else {
        try {
          // إنشاء وإرسال الفاتورة إذا كان الدفع ناجحاً
          if (newStatus === 'PAID') {
            try {
              // إنشاء الفاتورة مع تمرير بيانات العميل والمعاملة
              const invoiceResponse = await supabaseClient.functions.invoke('invoice-system', {
                body: {
                  action: 'generate',
                  transactionId: transactionId,
                  customer: {
                    name: transaction.customer_name,
                    email: transaction.customer_email,
                    phone: transaction.customer_phone,
                  },
                  invoice: {
                    amount: Number(transaction.amount),
                    currency: transaction.currency || 'SAR',
                    offer_title: transaction.offer_title,
                    notes: `إنشاء تلقائي عبر التحقق من الدفع للمعاملة ${transactionId}`,
                  },
                },
              });

              if (invoiceResponse.data?.success && invoiceResponse.data?.invoice?.id) {
                const createdInvoiceId = invoiceResponse.data.invoice.id as string;
                console.log('تم إنشاء الفاتورة بنجاح:', invoiceResponse.data.invoice);
                // إرسال الفاتورة بالإيميل باستخدام معرف الفاتورة
                const sendResponse = await supabaseClient.functions.invoke('invoice-system', {
                  body: { action: 'send', invoiceId: createdInvoiceId },
                });
                if (sendResponse.data?.success) {
                  console.log('تم إرسال الفاتورة بالإيميل بنجاح');
                } else {
                  console.error('خطأ في إرسال الفاتورة:', sendResponse.error || sendResponse.data);
                }
              } else {
                console.error('خطأ في إنشاء الفاتورة:', invoiceResponse.error || invoiceResponse.data);
              }

              // إصدار العقد تلقائياً بعد نجاح الدفع (إن لم يكن مُصدَراً)
              const { data: freshTx } = await supabaseClient
                .from('payment_transactions')
                .select('*')
                .eq('id', transactionId)
                .maybeSingle();

              const tx = freshTx || transaction;
              // deno-lint-ignore no-explicit-any
              const cd: any = (tx as any).contract_data || {};

              if (!tx?.contract_id) {
                // جلب رقم عقد جديد
                const { data: contract_no, error: genErr } = await supabaseClient.rpc('generate_contract_number');
                if (genErr || !contract_no) {
                  console.error('تعذر توليد رقم العقد:', genErr);
                } else {
                  // بناء بيانات العقد
                  const services = Array.isArray(cd.selectedServices) ? cd.selectedServices : [];
                  const servicesNames = services.map((s: any) => s.name).join('، ');
                  const servicesDesc = services.map((s: any) => `- ${s.name}: ${s.description}`).join('\n');
                  const fullDesc = `${cd.projectDescription || ''}\n${servicesDesc}`.trim();

                  const { data: contract, error: insertErr } = await supabaseClient
                    .from('contracts')
                    .insert({
                      contract_number: contract_no as string,
                      client_name: tx.customer_name,
                      client_email: tx.customer_email,
                      client_phone: tx.customer_phone,
                      client_id_number: cd.clientID || null,
                      client_type: cd.contractFormType || 'individual',
                      service_type: servicesNames || 'خدمات تقنية',
                      service_description: fullDesc || null,
                      service_price: cd.totalPrice || tx.amount,
                      currency: tx.currency || 'SAR',
                      payment_terms: 'دفعة مقدمة 50% ثم 50% قبل التسليم',
                      status: 'active',
                      company_approved: true,
                      client_approved: true,
                    })
                    .select()
                    .single();

                  if (insertErr) {
                    console.error('خطأ في إدراج العقد:', insertErr);
                  } else if (contract) {
                    // ربط العقد بالمعاملة
                    const { error: linkErr } = await supabaseClient
                      .from('payment_transactions')
                      .update({ contract_id: contract.id })
                      .eq('id', transactionId);
                    if (linkErr) console.error('تعذر ربط العقد بالمعاملة:', linkErr);
                    else console.log('تم إصدار العقد وربطه:', contract.contract_number);
                  }
                }
              }
            } catch (invoiceError) {
              console.error('خطأ في معالجة الفاتورة/العقد:', invoiceError);
            }
          }

          // إرسال إيميل تأكيد الدفع
          const to = transaction.customer_email as string | null;
          if (to) {
            const isPaid = newStatus === 'PAID' || newStatus === 'COMPLETED';
            const subject = isPaid
              ? `تم استلام دفعتك بنجاح - مرفق الفاتورة`
              : `تعذر إتمام عملية الدفع`;
            const amountStr = `${transaction.amount} ${transaction.currency || 'SAR'}`;
            const trxNo = transaction.paylink_transaction_no || transaction.tap_charge_id || transaction.tamara_order_id || transaction.stc_pay_reference || transactionId;

            const html = isPaid
              ? `
                <div dir="rtl" style="font-family:Tahoma,Arial,sans-serif">
                  <h2>تم الدفع بنجاح ✅</h2>
                  <p>شكرًا لك ${transaction.customer_name || ''}، تم استلام دفعتك ومعالجة الطلب جاري الآن.</p>
                  <ul>
                    <li>العرض: ${transaction.offer_title || ''}</li>
                    <li>المبلغ: <b>${amountStr}</b></li>
                    <li>رقم المعاملة: <code>${trxNo}</code></li>
                    <li>طريقة الدفع: ${transaction.payment_method || ''}</li>
                  </ul>
                  <p><strong>تم إرسال الفاتورة الرسمية إليك في إيميل منفصل.</strong></p>
                  <p>سيتواصل معك فريق العمل خلال 24 ساعة لإتمام الإجراءات.</p>
                  <p style="color:#666">شركة علي صالح الشهري القابضة</p>
                </div>
              `
              : `
                <div dir="rtl" style="font-family:Tahoma,Arial,sans-serif">
                  <h2>لم تكتمل عملية الدفع ❌</h2>
                  <p>عذرًا ${transaction.customer_name || ''}، لم تكتمل عملية الدفع الخاصة بك.</p>
                  <ul>
                    <li>العرض: ${transaction.offer_title || ''}</li>
                    <li>المبلغ: <b>${amountStr}</b></li>
                    <li>الحالة: ${newStatus}</li>
                    <li>رقم المرجع: <code>${trxNo}</code></li>
                  </ul>
                  <p>يمكنك إعادة المحاولة من صفحة العروض أو التواصل معنا للمساعدة.</p>
                  <p style="color:#666">الدعم: info@alialshehriholding.com — 0555812567</p>
                </div>
              `;

            // Send email in background (non-blocking)
            // @ts-ignore 
            const sendPromise = resend.emails.send({
              from: 'نظام المدفوعات <info@alialshehriholding.com>',
              to: [to],
              bcc: ['info@alialshehriholding.com'],
              reply_to: 'info@alialshehriholding.com',
              subject,
              html,
            }).then((res) => {
              console.log('Payment confirmation email sent successfully:', res);
              return res;
            }).catch((e) => {
              console.error('Failed to send payment confirmation email:', e);
              throw e;
            });

            // Wait for email to be sent
            await sendPromise;
            console.log('Payment confirmation email processing completed');
          }
        } catch (e) {
          console.error('Error preparing/sending email:', e);
        }
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