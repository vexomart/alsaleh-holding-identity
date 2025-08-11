import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvoiceRequest {
  transactionId?: string;
  action: 'generate' | 'send' | 'update';
  customer?: {
    name: string;
    email: string;
    phone?: string;
  };
  invoice?: {
    amount: number;
    currency: string;
    offer_title: string;
    notes?: string;
  };
  invoiceId?: string;
  paymentStatus?: string;
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

    const { transactionId, action, customer, invoice, invoiceId, paymentStatus }: InvoiceRequest = await req.json();

    if (action === 'generate') {
      // إنشاء فاتورة جديدة
      if (!customer || !invoice) {
        throw new Error('بيانات العميل والفاتورة مطلوبة');
      }

      // حساب الضريبة (15%)
      const taxRate = 0.15;
      const baseAmount = Number(invoice.amount);
      const taxAmount = baseAmount * taxRate;
      const totalAmount = baseAmount + taxAmount;

      const { data: newInvoice, error: invoiceError } = await supabaseClient
        .from('invoices')
        .insert({
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone || null,
          offer_title: invoice.offer_title,
          amount: baseAmount,
          currency: invoice.currency || 'SAR',
          payment_status: 'pending',
          status: 'pending',
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 يوم
          notes: invoice.notes || null
        })
        .select()
        .single();

      if (invoiceError) {
        throw new Error(`خطأ في إنشاء الفاتورة: ${invoiceError.message}`);
      }

      return new Response(JSON.stringify({
        success: true,
        invoice: newInvoice,
        message: 'تم إنشاء الفاتورة بنجاح'
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    if (action === 'send') {
      // إرسال الفاتورة بالإيميل
      if (!invoiceId) {
        throw new Error('معرف الفاتورة مطلوب');
      }

      const { data: invoice, error: invoiceError } = await supabaseClient
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single();

      if (invoiceError || !invoice) {
        throw new Error('لم يتم العثور على الفاتورة');
      }

      // تحديد نوع الإيميل حسب حالة الدفع
      let emailSubject = '';
      let emailContent = '';
      
      if (invoice.payment_status === 'paid') {
        emailSubject = `فاتورة مدفوعة - رقم ${invoice.invoice_number}`;
        emailContent = generatePaidInvoiceEmail(invoice);
      } else if (invoice.payment_status === 'failed') {
        emailSubject = `فاتورة غير مدفوعة - رقم ${invoice.invoice_number}`;
        emailContent = generateUnpaidInvoiceEmail(invoice);
      } else {
        emailSubject = `فاتورة في انتظار الدفع - رقم ${invoice.invoice_number}`;
        emailContent = generatePendingInvoiceEmail(invoice);
      }

      console.log('Sending email to:', invoice.customer_email);
      console.log('Email subject:', emailSubject);
      
      const emailResult = await resend.emails.send({
        from: "نظام الفواتير <invoices@resend.dev>",
        to: [invoice.customer_email],
        bcc: ["info@alialshehriholding.com"],
        reply_to: "info@alialshehriholding.com",
        subject: emailSubject,
        html: emailContent,
      });

      console.log('Email result:', emailResult);

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
      if (!transactionId || !paymentStatus) {
        throw new Error('معرف المعاملة وحالة الدفع مطلوبة');
      }

      const { error: updateError } = await supabaseClient
        .from('invoices')
        .update({
          payment_status: paymentStatus,
          status: paymentStatus === 'paid' ? 'paid' : 'pending'
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
                            <td>${invoice.offer_title}</td>
                        </tr>
                        <tr>
                            <td><strong>تاريخ الفاتورة:</strong></td>
                            <td>${new Date(invoice.created_at).toLocaleDateString('ar-SA')}</td>
                        </tr>
                        <tr>
                            <td><strong>المبلغ:</strong></td>
                            <td>${invoice.amount} ${invoice.currency}</td>
                        </tr>
                    </table>
                </div>
                
                <div class="amount">
                    المبلغ الإجمالي: ${invoice.amount} ${invoice.currency}
                </div>
                
                <p style="text-align: center; color: #28a745; font-weight: bold;">
                    ✅ تم الدفع بنجاح
                </p>
                
                <p>سيتم البدء في تنفيذ خدمتك قريباً. سنرسل لك تحديثات منتظمة حول تقدم العمل.</p>
            </div>
            
            <div class="footer">
                <p>شركة علي صالح الشهري القابضة</p>
                <p>للاستفسارات: info@alialshehriholding.com | 920033442</p>
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
                    <a href="https://alialshehriholding.com/payment-methods" class="retry-btn">
                        إعادة المحاولة
                    </a>
                </div>
            </div>
            
            <div class="footer">
                <p>شركة علي صالح الشهري القابضة</p>
                <p>للاستفسارات: info@alialshehriholding.com | 920033442</p>
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
                    <a href="https://alialshehriholding.com/payment-methods" class="pay-btn">
                        ادفع الآن
                    </a>
                </div>
            </div>
            
            <div class="footer">
                <p>شركة علي صالح الشهري القابضة</p>
                <p>للاستفسارات: info@alialshehriholding.com | 920033442</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

serve(handler);