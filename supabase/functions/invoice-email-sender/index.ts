import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { supabase } from "../_shared/supabase.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvoiceEmailRequest {
  invoice_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const { invoice_id }: InvoiceEmailRequest = await req.json();

    if (!invoice_id) {
      return new Response(
        JSON.stringify({ error: "Missing invoice_id" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // جلب بيانات الفاتورة
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoice_id)
      .single();

    if (invoiceError || !invoice) {
      console.error('Invoice not found:', invoiceError);
      return new Response(
        JSON.stringify({ error: "Invoice not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // التحقق من وجود RESEND_API_KEY
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // إنشاء قالب الإيميل للفاتورة
    const emailTemplate = createInvoiceEmailTemplate(invoice);

    // إرسال الإيميل
    const emailResponse = await resend.emails.send({
      from: "شركة علي صالح الشهري القابضة <invoices@alialshehriholding.com>",
      to: [invoice.customer_email],
      subject: `فاتورة رقم ${invoice.invoice_number} - شركة علي صالح الشهري القابضة`,
      html: emailTemplate,
    });

    console.log("Invoice email sent successfully:", emailResponse);

    // تحديث حالة الفاتورة لتسجيل أن الإيميل تم إرساله
    await supabase
      .from('invoices')
      .update({ 
        updated_at: new Date().toISOString(),
        notes: invoice.notes ? `${invoice.notes}\n\nتم إرسال الفاتورة بالإيميل في ${new Date().toLocaleString('ar-SA')}` : `تم إرسال الفاتورة بالإيميل في ${new Date().toLocaleString('ar-SA')}`
      })
      .eq('id', invoice_id);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Invoice email sent successfully",
        email_id: emailResponse.data?.id
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error sending invoice email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send invoice email", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

function createInvoiceEmailTemplate(invoice: any): string {
  const statusText = {
    'pending': 'في الانتظار',
    'paid': 'مدفوعة', 
    'overdue': 'متأخرة',
    'cancelled': 'ملغية'
  }[invoice.status] || invoice.status;

  const paymentMethods = {
    'bank_transfer': 'حوالة بنكية',
    'credit_card': 'بطاقة ائتمانية',
    'stc_pay': 'STC Pay',
    'tamara': 'تمارا',
    'tabby': 'تابي'
  };

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>فاتورة ${invoice.invoice_number}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f8fafc;
          direction: rtl;
          text-align: right;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          padding: 30px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        .header p {
          margin: 10px 0 0 0;
          opacity: 0.9;
          font-size: 16px;
        }
        .content {
          padding: 30px;
        }
        .invoice-details {
          background: #f1f5f9;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          padding: 8px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-weight: 600;
          color: #475569;
        }
        .detail-value {
          color: #1e293b;
        }
        .amount-highlight {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin: 20px 0;
        }
        .amount-highlight h2 {
          margin: 0;
          font-size: 32px;
          font-weight: bold;
        }
        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          ${invoice.status === 'paid' ? 'background: #10b981; color: white;' : 
            invoice.status === 'pending' ? 'background: #f59e0b; color: white;' :
            'background: #ef4444; color: white;'}
        }
        .payment-info {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .payment-info h3 {
          color: #047857;
          margin: 0 0 10px 0;
        }
        .footer {
          background: #1e293b;
          padding: 20px;
          text-align: center;
          color: white;
        }
        .footer p {
          margin: 5px 0;
          font-size: 14px;
        }
        .cta-button {
          display: inline-block;
          background: #3b82f6;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🧾 فاتورة جديدة</h1>
          <p>شركة علي صالح محمد الشهري</p>
        </div>
        
        <div class="content">
          <h2>عزيزي/عزيزتي ${invoice.customer_name}</h2>
          
          <p>نتشرف بإرسال فاتورتكم الجديدة. يرجى مراجعة التفاصيل أدناه:</p>
          
          <div class="invoice-details">
            <div class="detail-row">
              <span class="detail-label">رقم الفاتورة:</span>
              <span class="detail-value"><strong>${invoice.invoice_number}</strong></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">تاريخ الإصدار:</span>
              <span class="detail-value">${new Date(invoice.issue_date).toLocaleDateString('ar-SA')}</span>
            </div>
            ${invoice.due_date ? `
            <div class="detail-row">
              <span class="detail-label">تاريخ الاستحقاق:</span>
              <span class="detail-value">${new Date(invoice.due_date).toLocaleDateString('ar-SA')}</span>
            </div>
            ` : ''}
            <div class="detail-row">
              <span class="detail-label">وصف الخدمة:</span>
              <span class="detail-value">${invoice.offer_title}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">حالة الفاتورة:</span>
              <span class="detail-value"><span class="status-badge">${statusText}</span></span>
            </div>
          </div>
          
          <div class="amount-highlight">
            <h2>${invoice.amount} ${invoice.currency}</h2>
            <p>إجمالي المبلغ المستحق</p>
          </div>
          
          ${invoice.payment_method ? `
          <div class="payment-info">
            <h3>💳 طريقة الدفع المفضلة</h3>
            <p>${paymentMethods[invoice.payment_method] || invoice.payment_method}</p>
          </div>
          ` : ''}
          
          ${invoice.notes ? `
          <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h4 style="color: #92400e; margin: 0 0 8px 0;">📝 ملاحظات إضافية:</h4>
            <p style="color: #92400e; margin: 0;">${invoice.notes}</p>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://alialshehriholding.com/payment/${invoice.id}" class="cta-button">
              💰 دفع الفاتورة الآن
            </a>
          </div>
          
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0;">📞 معلومات التواصل</h3>
            <p style="margin: 5px 0;"><strong>الهاتف:</strong> +966 11 123 4567</p>
            <p style="margin: 5px 0;"><strong>البريد الإلكتروني:</strong> support@alialshehriholding.com</p>
            <p style="margin: 5px 0;"><strong>الموقع الإلكتروني:</strong> www.alialshehriholding.com</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            في حالة وجود أي استفسارات حول هذه الفاتورة، يرجى عدم التردد في التواصل معنا. 
            نقدر ثقتكم بخدماتنا ونتطلع لخدمتكم دائماً.
          </p>
        </div>
        
        <div class="footer">
          <p><strong>شركة علي صالح محمد الشهري</strong></p>
          <p>المملكة العربية السعودية | الرياض</p>
          <p>© 2024 جميع الحقوق محفوظة</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

serve(handler);