import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvoiceRequest {
  transactionId: string;
  action: 'generate' | 'send' | 'update';
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  serviceTitle?: string;
  amount?: number;
  currency?: string;
  paymentStatus?: string;
  notes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { transactionId, action, ...invoiceData }: InvoiceRequest = await req.json();

    if (action === 'generate') {
      // إنشاء فاتورة جديدة
      const { data: transaction, error: transactionError } = await supabaseClient
        .from('payment_transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (transactionError || !transaction) {
        throw new Error('لم يتم العثور على المعاملة');
      }

      // حساب الضريبة (15%)
      const taxRate = 0.15;
      const baseAmount = Number(transaction.amount);
      const taxAmount = baseAmount * taxRate;
      const totalAmount = baseAmount + taxAmount;

      const { data: invoice, error: invoiceError } = await supabaseClient
        .from('invoices')
        .insert({
          transaction_id: transactionId,
          customer_name: transaction.customer_name,
          customer_email: transaction.customer_email,
          customer_phone: transaction.customer_phone,
          service_title: transaction.offer_title,
          amount: baseAmount,
          currency: transaction.currency || 'SAR',
          payment_status: transaction.status,
          status: 'generated',
          tax_amount: taxAmount,
          total_amount: totalAmount,
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 يوم
          notes: invoiceData.notes || null
        })
        .select()
        .single();

      if (invoiceError) {
        throw new Error(`خطأ في إنشاء الفاتورة: ${invoiceError.message}`);
      }

      return new Response(JSON.stringify({
        success: true,
        invoice,
        message: 'تم إنشاء الفاتورة بنجاح'
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    if (action === 'send') {
      // إرسال الفاتورة بالإيميل
      const { data: invoice, error: invoiceError } = await supabaseClient
        .from('invoices')
        .select('*')
        .eq('transaction_id', transactionId)
        .single();

      if (invoiceError || !invoice) {
        throw new Error('لم يتم العثور على الفاتورة');
      }

      // تحديد نوع الإيميل حسب حالة الدفع
      let emailSubject = '';
      let emailContent = '';
      
      if (invoice.payment_status === 'PAID') {
        emailSubject = `فاتورة مدفوعة - رقم ${invoice.invoice_number}`;
        emailContent = generatePaidInvoiceEmail(invoice);
      } else if (invoice.payment_status === 'FAILED') {
        emailSubject = `فاتورة غير مدفوعة - رقم ${invoice.invoice_number}`;
        emailContent = generateUnpaidInvoiceEmail(invoice);
      } else {
        emailSubject = `فاتورة في انتظار الدفع - رقم ${invoice.invoice_number}`;
        emailContent = generatePendingInvoiceEmail(invoice);
      }

      const emailResult = await resend.emails.send({
        from: "نظام الفواتير <invoices@emkan.solutions>",
        to: [invoice.customer_email],
        subject: emailSubject,
        html: emailContent,
      });

      // تحديث حالة الفاتورة
      await supabaseClient
        .from('invoices')
        .update({ status: 'sent' })
        .eq('id', invoice.id);

      return new Response(JSON.stringify({
        success: true,
        emailResult,
        message: 'تم إرسال الفاتورة بنجاح'
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    if (action === 'update') {
      // تحديث حالة الفاتورة
      const { error: updateError } = await supabaseClient
        .from('invoices')
        .update({
          payment_status: invoiceData.paymentStatus,
          status: invoiceData.paymentStatus === 'PAID' ? 'paid' : 'pending'
        })
        .eq('transaction_id', transactionId);

      if (updateError) {
        throw new Error(`خطأ في تحديث الفاتورة: ${updateError.message}`);
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'تم تحديث الفاتورة بنجاح'
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    throw new Error('إجراء غير صالح');

  } catch (error: any) {
    console.error("خطأ في نظام الفواتير:", error);
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
};

function generatePaidInvoiceEmail(invoice: any): string {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>فاتورة مدفوعة</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 0;
                padding: 20px;
                direction: rtl;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 15px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .content {
                padding: 30px;
            }
            .invoice-details {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
            }
            .amount {
                font-size: 2em;
                font-weight: bold;
                color: #28a745;
                text-align: center;
                margin: 20px 0;
            }
            .footer {
                background: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #6c757d;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ فاتورة مدفوعة</h1>
                <p>شكراً لك! تم استلام دفعتك بنجاح</p>
            </div>
            
            <div class="content">
                <h2>مرحباً ${invoice.customer_name}</h2>
                <p>نود إعلامك بأنه تم استلام دفعتك بنجاح للخدمة التالية:</p>
                
                <div class="invoice-details">
                    <h3>تفاصيل الفاتورة</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td><strong>رقم الفاتورة:</strong></td>
                            <td>${invoice.invoice_number}</td>
                        </tr>
                        <tr>
                            <td><strong>الخدمة:</strong></td>
                            <td>${invoice.service_title}</td>
                        </tr>
                        <tr>
                            <td><strong>تاريخ الفاتورة:</strong></td>
                            <td>${new Date(invoice.invoice_date).toLocaleDateString('ar-SA')}</td>
                        </tr>
                        <tr>
                            <td><strong>المبلغ الأساسي:</strong></td>
                            <td>${invoice.amount} ${invoice.currency}</td>
                        </tr>
                        <tr>
                            <td><strong>الضريبة (15%):</strong></td>
                            <td>${invoice.tax_amount} ${invoice.currency}</td>
                        </tr>
                    </table>
                </div>
                
                <div class="amount">
                    المبلغ الإجمالي: ${invoice.total_amount} ${invoice.currency}
                </div>
                
                <p style="text-align: center; color: #28a745; font-weight: bold;">
                    ✅ تم الدفع بنجاح
                </p>
                
                <p>سيتم البدء في تنفيذ خدمتك قريباً. سنرسل لك تحديثات منتظمة حول تقدم العمل.</p>
            </div>
            
            <div class="footer">
                <p>شركة إمكان للحلول الرقمية</p>
                <p>للاستفسارات: info@emkan.solutions | 920033442</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generateUnpaidInvoiceEmail(invoice: any): string {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>فاتورة غير مدفوعة</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
                margin: 0;
                padding: 20px;
                direction: rtl;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 15px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #dc3545, #fd7e14);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .content {
                padding: 30px;
            }
            .invoice-details {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
            }
            .amount {
                font-size: 2em;
                font-weight: bold;
                color: #dc3545;
                text-align: center;
                margin: 20px 0;
            }
            .retry-btn {
                background: #dc3545;
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 5px;
                display: inline-block;
                margin: 20px 0;
            }
            .footer {
                background: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #6c757d;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>❌ فشل في الدفع</h1>
                <p>لم تتم عملية الدفع بنجاح</p>
            </div>
            
            <div class="content">
                <h2>مرحباً ${invoice.customer_name}</h2>
                <p>نأسف لإعلامك بأن عملية الدفع لم تتم بنجاح للخدمة التالية:</p>
                
                <div class="invoice-details">
                    <h3>تفاصيل الفاتورة</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td><strong>رقم الفاتورة:</strong></td>
                            <td>${invoice.invoice_number}</td>
                        </tr>
                        <tr>
                            <td><strong>الخدمة:</strong></td>
                            <td>${invoice.service_title}</td>
                        </tr>
                        <tr>
                            <td><strong>تاريخ الفاتورة:</strong></td>
                            <td>${new Date(invoice.invoice_date).toLocaleDateString('ar-SA')}</td>
                        </tr>
                        <tr>
                            <td><strong>المبلغ الأساسي:</strong></td>
                            <td>${invoice.amount} ${invoice.currency}</td>
                        </tr>
                        <tr>
                            <td><strong>الضريبة (15%):</strong></td>
                            <td>${invoice.tax_amount} ${invoice.currency}</td>
                        </tr>
                    </table>
                </div>
                
                <div class="amount">
                    المبلغ المطلوب: ${invoice.total_amount} ${invoice.currency}
                </div>
                
                <p style="text-align: center; color: #dc3545; font-weight: bold;">
                    ❌ فشل في الدفع
                </p>
                
                <p>يمكنك إعادة المحاولة أو التواصل معنا لمساعدتك في إتمام عملية الدفع.</p>
                
                <div style="text-align: center;">
                    <a href="https://emkan.solutions/payment-methods" class="retry-btn">
                        إعادة المحاولة
                    </a>
                </div>
            </div>
            
            <div class="footer">
                <p>شركة إمكان للحلول الرقمية</p>
                <p>للاستفسارات: info@emkan.solutions | 920033442</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generatePendingInvoiceEmail(invoice: any): string {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>فاتورة في انتظار الدفع</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
                margin: 0;
                padding: 20px;
                direction: rtl;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 15px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #ffc107, #fd7e14);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .content {
                padding: 30px;
            }
            .invoice-details {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
            }
            .amount {
                font-size: 2em;
                font-weight: bold;
                color: #ffc107;
                text-align: center;
                margin: 20px 0;
            }
            .pay-btn {
                background: #ffc107;
                color: #212529;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 5px;
                display: inline-block;
                margin: 20px 0;
                font-weight: bold;
            }
            .footer {
                background: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #6c757d;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>⏳ فاتورة في انتظار الدفع</h1>
                <p>يرجى إتمام عملية الدفع</p>
            </div>
            
            <div class="content">
                <h2>مرحباً ${invoice.customer_name}</h2>
                <p>لديك فاتورة في انتظار الدفع للخدمة التالية:</p>
                
                <div class="invoice-details">
                    <h3>تفاصيل الفاتورة</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td><strong>رقم الفاتورة:</strong></td>
                            <td>${invoice.invoice_number}</td>
                        </tr>
                        <tr>
                            <td><strong>الخدمة:</strong></td>
                            <td>${invoice.service_title}</td>
                        </tr>
                        <tr>
                            <td><strong>تاريخ الفاتورة:</strong></td>
                            <td>${new Date(invoice.invoice_date).toLocaleDateString('ar-SA')}</td>
                        </tr>
                        <tr>
                            <td><strong>تاريخ الاستحقاق:</strong></td>
                            <td>${new Date(invoice.due_date).toLocaleDateString('ar-SA')}</td>
                        </tr>
                        <tr>
                            <td><strong>المبلغ الأساسي:</strong></td>
                            <td>${invoice.amount} ${invoice.currency}</td>
                        </tr>
                        <tr>
                            <td><strong>الضريبة (15%):</strong></td>
                            <td>${invoice.tax_amount} ${invoice.currency}</td>
                        </tr>
                    </table>
                </div>
                
                <div class="amount">
                    المبلغ الإجمالي: ${invoice.total_amount} ${invoice.currency}
                </div>
                
                <p style="text-align: center; color: #ffc107; font-weight: bold;">
                    ⏳ في انتظار الدفع
                </p>
                
                <p>يرجى إتمام عملية الدفع في أقرب وقت لضمان بدء تنفيذ خدمتك.</p>
                
                <div style="text-align: center;">
                    <a href="https://emkan.solutions/payment-methods" class="pay-btn">
                        ادفع الآن
                    </a>
                </div>
            </div>
            
            <div class="footer">
                <p>شركة إمكان للحلول الرقمية</p>
                <p>للاستفسارات: info@emkan.solutions | 920033442</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

serve(handler);