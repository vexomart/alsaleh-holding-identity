import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY") || "");

serve(async (req) => {
  console.log('🔍 Payment verification request started');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transactionId } = await req.json();
    console.log('📋 Transaction ID received:', transactionId);
    
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

    // Always send status update, regardless of change
    const statusChanged = newStatus !== transaction.status;
    console.log('💳 Status comparison:', { 
      oldStatus: transaction.status, 
      newStatus, 
      statusChanged,
      paymentVerified 
    });

    // Update transaction status and send notifications
    const { error: updateError } = await supabaseClient
      .from('payment_transactions')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString(),
        metadata: {
          ...(transaction.metadata || {}),
          last_verification: new Date().toISOString(),
          verification_count: ((transaction.metadata as any)?.verification_count || 0) + 1
        }
      })
      .eq('id', transactionId);

    if (updateError) {
      console.error('❌ Error updating transaction:', updateError);
    } else {
      console.log('✅ Transaction status updated successfully to:', newStatus);
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

          // إرسال إيميل تأكيد الدفع دائماً مع إشعار محدث
          const to = transaction.customer_email as string | null;
          if (to) {
            const isPaid = newStatus === 'PAID' || newStatus === 'COMPLETED';
            const isPending = newStatus === 'PENDING' || newStatus === 'PROCESSING';
            
            let subject, statusMessage;
            if (isPaid) {
              subject = `✅ تأكيد الدفع - تم استلام دفعتك بنجاح`;
              statusMessage = "تم تأكيد دفعتك وسيتم البدء في تنفيذ الطلب خلال 24 ساعة";
            } else if (isPending) {
              subject = `⏳ تحديث حالة الدفع - قيد المعالجة`;
              statusMessage = "دفعتك قيد المراجعة والمعالجة، سنرسل تأكيد نهائي عند الانتهاء";
            } else {
              subject = `❌ تحديث حالة الدفع - يرجى المراجعة`;
              statusMessage = "نعتذر، لم تكتمل عملية الدفع. يرجى المحاولة مرة أخرى أو التواصل معنا";
            }
            
            const amountStr = `${transaction.amount} ${transaction.currency || 'SAR'}`;
            const trxNo = transaction.paylink_transaction_no || transaction.tap_charge_id || transaction.tamara_order_id || transaction.stc_pay_reference || transactionId;

            const html = `
              <div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f8f9fa">
                <div style="background:white;padding:30px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1)">
                  <div style="text-align:center;margin-bottom:30px">
                    <img src="https://alialshehriholding.com/lovable-uploads/58f1dde7-91b4-4747-92a6-188055f11cee.png" alt="شعار الشركة" style="height:60px;margin-bottom:20px">
                    <h1 style="color:${isPaid ? '#10b981' : isPending ? '#f59e0b' : '#ef4444'};margin:0;font-size:28px">
                      ${isPaid ? '✅ تأكيد الدفع' : isPending ? '⏳ قيد المعالجة' : '❌ مشكلة في الدفع'}
                    </h1>
                  </div>
                  
                  <p style="font-size:18px;line-height:1.6;color:#374151;margin-bottom:25px">
                    ${isPaid ? `مرحباً ${transaction.customer_name || 'عميلنا العزيز'}، ` : `عذراً ${transaction.customer_name || 'عميلنا العزيز'}، `}
                    ${statusMessage}
                  </p>
                  
                  <div style="background:${isPaid ? '#f0f9ff' : isPending ? '#fefce8' : '#fef2f2'};padding:20px;border-radius:8px;margin:25px 0">
                    <h3 style="margin:0 0 15px 0;color:#374151;font-size:18px">تفاصيل المعاملة:</h3>
                    <table style="width:100%;border-collapse:collapse">
                      <tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb"><strong>المنتج/الخدمة:</strong></td><td style="padding:8px 0;border-bottom:1px solid #e5e7eb">${transaction.offer_title || 'غير محدد'}</td></tr>
                      <tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb"><strong>المبلغ:</strong></td><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-weight:bold;color:#059669">${amountStr}</td></tr>
                      <tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb"><strong>رقم المرجع:</strong></td><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-family:monospace">${trxNo}</td></tr>
                      <tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb"><strong>طريقة الدفع:</strong></td><td style="padding:8px 0;border-bottom:1px solid #e5e7eb">${transaction.payment_method || 'غير محدد'}</td></tr>
                      <tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb"><strong>الحالة:</strong></td><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-weight:bold;color:${isPaid ? '#059669' : isPending ? '#d97706' : '#dc2626'}">${isPaid ? 'مكتمل ✅' : isPending ? 'قيد المعالجة ⏳' : 'غير مكتمل ❌'}</td></tr>
                      <tr><td style="padding:8px 0"><strong>التاريخ:</strong></td><td style="padding:8px 0">${new Date().toLocaleDateString('ar-SA', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</td></tr>
                    </table>
                  </div>
                  
                  ${isPaid ? `
                    <div style="background:#10b981;color:white;padding:20px;border-radius:8px;text-align:center;margin:25px 0">
                      <h3 style="margin:0 0 10px 0">🎉 مبروك! تم تأكيد دفعتك</h3>
                      <p style="margin:0;font-size:16px">سيتواصل معك فريق العمل خلال 24 ساعة لبدء التنفيذ</p>
                    </div>
                  ` : isPending ? `
                    <div style="background:#f59e0b;color:white;padding:20px;border-radius:8px;text-align:center;margin:25px 0">
                      <h3 style="margin:0 0 10px 0">⏳ دفعتك قيد المراجعة</h3>
                      <p style="margin:0;font-size:16px">سنرسل إليك تأكيد نهائي خلال ساعات قليلة</p>
                    </div>
                  ` : `
                    <div style="background:#ef4444;color:white;padding:20px;border-radius:8px;text-align:center;margin:25px 0">
                      <h3 style="margin:0 0 10px 0">❌ يرجى المحاولة مرة أخرى</h3>
                      <p style="margin:0;font-size:16px">أو تواصل معنا للمساعدة في إتمام عملية الدفع</p>
                    </div>
                  `}
                  
                  <div style="border-top:2px solid #e5e7eb;padding-top:20px;margin-top:30px;text-align:center">
                    <h4 style="color:#374151;margin:0 0 15px 0">للاستفسارات والدعم:</h4>
                    <p style="margin:5px 0;color:#6b7280">📧 البريد الإلكتروني: <a href="mailto:info@alialshehriholding.com" style="color:#3b82f6">info@alialshehriholding.com</a></p>
                    <p style="margin:5px 0;color:#6b7280">📱 الجوال: <a href="tel:0555812567" style="color:#3b82f6">0555812567</a></p>
                    <p style="margin:5px 0;color:#6b7280">🌐 الموقع: <a href="https://alialshehriholding.com" style="color:#3b82f6">alialshehriholding.com</a></p>
                  </div>
                  
                  <div style="text-align:center;margin-top:25px;padding-top:20px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:14px">
                    <p style="margin:0">شركة علي صالح الشهري القابضة</p>
                    <p style="margin:5px 0 0 0">جميع الحقوق محفوظة © ${new Date().getFullYear()}</p>
                  </div>
                </div>
              </div>
            `;

            // Send email notification
            console.log('📧 Sending payment notification email to:', to);
            try {
              const emailResult = await resend.emails.send({
                from: 'نظام المدفوعات - شركة الشهري <info@fekrahtech.com>',
                to: [to],
                bcc: ['info@fekrahtech.com', 'info@alialshehriholding.com'],
                reply_to: 'info@alialshehriholding.com',
                subject,
                html,
              });
              
              console.log('✅ Payment notification email sent successfully:', emailResult.data?.id);
            } catch (emailError) {
              console.error('❌ Failed to send payment notification email:', emailError);
              // Don't throw error, just log it so payment verification can continue
            }
          }
        } catch (e) {
          console.error('Error preparing/sending email:', e);
        }
      }
    }

    console.log('🎯 Payment verification completed successfully');
    
    return new Response(JSON.stringify({
      success: true,
      status: newStatus,
      verified: paymentVerified,
      statusChanged,
      transaction: {
        ...transaction,
        status: newStatus,
        updated_at: new Date().toISOString()
      },
      verification_timestamp: new Date().toISOString()
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