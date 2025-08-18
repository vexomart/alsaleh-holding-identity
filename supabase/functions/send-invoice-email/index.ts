import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvoiceEmailRequest {
  customerEmail: string;
  customerName: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  serviceName: string;
  transactionId: string;
  invoicePdfBuffer?: ArrayBuffer;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      customerEmail,
      customerName,
      invoiceNumber,
      amount,
      currency,
      serviceName,
      transactionId
    }: InvoiceEmailRequest = await req.json();

    // Create invoice HTML content
    const invoiceHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>فاتورة ضريبية - ${invoiceNumber}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8fafc;
            direction: rtl;
            padding: 20px;
          }
          .invoice {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border-radius: 10px;
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .company-name {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .company-details {
            font-size: 14px;
            opacity: 0.9;
            line-height: 1.6;
          }
          .content {
            padding: 40px 30px;
          }
          .invoice-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
          }
          .info-section {
            padding: 20px;
            background: #f8fafc;
            border-radius: 8px;
            border-right: 4px solid #3b82f6;
          }
          .info-title {
            font-size: 18px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 15px;
          }
          .info-item {
            margin-bottom: 8px;
            color: #475569;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .table th {
            background: #3b82f6;
            color: white;
            padding: 15px;
            text-align: right;
            font-weight: bold;
          }
          .table td {
            padding: 15px;
            border-bottom: 1px solid #e2e8f0;
            text-align: right;
          }
          .total-section {
            background: #1e40af;
            color: white;
            padding: 25px;
            border-radius: 8px;
            margin-top: 30px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 16px;
          }
          .total-final {
            font-size: 20px;
            font-weight: bold;
            border-top: 2px solid rgba(255,255,255,0.3);
            padding-top: 15px;
            margin-top: 15px;
          }
          .footer {
            text-align: center;
            padding: 30px;
            background: #f1f5f9;
            color: #64748b;
            font-size: 14px;
            border-top: 1px solid #e2e8f0;
          }
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 80px;
            color: rgba(59, 130, 246, 0.1);
            font-weight: bold;
            pointer-events: none;
            z-index: 1;
          }
          .paid-stamp {
            background: #10b981;
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: bold;
            display: inline-block;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="watermark">مدفوع</div>
          
          <div class="header">
            <div class="company-name">شركة علي صالح الشهري القابضة</div>
            <div class="company-details">
              الرياض، المملكة العربية السعودية<br>
              هاتف: 0555812567 | إيميل: info@alialshehriholding.com<br>
              موقع: alialshehriholding.com
            </div>
          </div>
          
          <div class="content">
            <div style="text-align: center;">
              <h1 style="color: #1e40af; font-size: 32px; margin-bottom: 10px;">فاتورة ضريبية</h1>
              <div class="paid-stamp">✅ تم الدفع</div>
            </div>
            
            <div class="invoice-info">
              <div class="info-section">
                <div class="info-title">بيانات العميل</div>
                <div class="info-item"><strong>الاسم:</strong> ${customerName}</div>
                <div class="info-item"><strong>الإيميل:</strong> ${customerEmail}</div>
              </div>
              
              <div class="info-section">
                <div class="info-title">تفاصيل الفاتورة</div>
                <div class="info-item"><strong>رقم الفاتورة:</strong> ${invoiceNumber}</div>
                <div class="info-item"><strong>التاريخ:</strong> ${new Date().toLocaleDateString('ar-SA')}</div>
                <div class="info-item"><strong>رقم المعاملة:</strong> ${transactionId}</div>
              </div>
            </div>
            
            <table class="table">
              <thead>
                <tr>
                  <th>الخدمة</th>
                  <th>الكمية</th>
                  <th>السعر</th>
                  <th>المجموع</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${serviceName}</td>
                  <td>1</td>
                  <td>${amount.toFixed(2)} ${currency}</td>
                  <td>${amount.toFixed(2)} ${currency}</td>
                </tr>
              </tbody>
            </table>
            
            <div class="total-section">
              <div class="total-row">
                <span>المجموع الفرعي:</span>
                <span>${amount.toFixed(2)} ${currency}</span>
              </div>
              <div class="total-row">
                <span>ضريبة القيمة المضافة (15%):</span>
                <span>${(amount * 0.15).toFixed(2)} ${currency}</span>
              </div>
              <div class="total-row total-final">
                <span>المجموع الإجمالي:</span>
                <span>${(amount * 1.15).toFixed(2)} ${currency}</span>
              </div>
            </div>
          </div>
          
          <div class="footer">
            شكراً لتعاملكم معنا • هذه فاتورة ضريبية معتمدة • جميع المبالغ بالريال السعودي<br>
            في حالة وجود أي استفسار، يرجى التواصل معنا على الأرقام المذكورة أعلاه
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "شركة علي صالح الشهري القابضة <info@fekrahtech.com>",
      to: [customerEmail],
      subject: `فاتورة ضريبية رقم ${invoiceNumber} - شركة علي صالح الشهري القابضة`,
      html: invoiceHtml,
    });

    console.log("Invoice email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "تم إرسال الفاتورة بنجاح" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending invoice email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);