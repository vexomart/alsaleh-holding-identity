import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { supabase } from "../_shared/supabase.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PDFRequest {
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
    const { invoice_id }: PDFRequest = await req.json();

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

    // إنشاء HTML للفاتورة
    const invoiceHTML = generateInvoiceHTML(invoice);

    // في بيئة الإنتاج، يمكن استخدام مكتبة لتحويل HTML إلى PDF
    // هنا سنرجع رابط مؤقت للتحميل
    const pdfUrl = await generatePDFFromHTML(invoiceHTML, invoice.invoice_number);

    return new Response(
      JSON.stringify({ 
        success: true,
        pdf_url: pdfUrl,
        invoice_number: invoice.invoice_number
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error generating PDF:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate PDF", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

function generateInvoiceHTML(invoice: any): string {
  const statusText = {
    'pending': 'في الانتظار',
    'paid': 'مدفوعة', 
    'overdue': 'متأخرة',
    'cancelled': 'ملغية'
  }[invoice.status] || invoice.status;

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>فاتورة ${invoice.invoice_number}</title>
      <style>
        @page {
          size: A4;
          margin: 2cm;
        }
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 0;
          direction: rtl;
          text-align: right;
          color: #333;
          line-height: 1.6;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .company-info {
          text-align: center;
          margin-bottom: 20px;
        }
        .company-name {
          font-size: 24px;
          font-weight: bold;
          color: #1e293b;
          margin: 0;
        }
        .company-details {
          font-size: 14px;
          color: #6b7280;
          margin: 5px 0;
        }
        .invoice-title {
          font-size: 32px;
          font-weight: bold;
          color: #3b82f6;
          text-align: center;
          margin: 20px 0;
        }
        .invoice-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .invoice-details, .customer-details {
          width: 48%;
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 10px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 5px;
        }
        .detail-row {
          margin: 8px 0;
          display: flex;
          justify-content: space-between;
        }
        .detail-label {
          font-weight: 600;
          color: #6b7280;
          width: 40%;
        }
        .detail-value {
          color: #1e293b;
          width: 60%;
        }
        .services-table {
          width: 100%;
          border-collapse: collapse;
          margin: 30px 0;
          background: white;
        }
        .services-table th,
        .services-table td {
          border: 1px solid #d1d5db;
          padding: 12px;
          text-align: right;
        }
        .services-table th {
          background: #f9fafb;
          font-weight: bold;
          color: #374151;
        }
        .services-table tbody tr:nth-child(even) {
          background: #f9fafb;
        }
        .total-section {
          margin-top: 30px;
          text-align: left;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          padding: 8px 0;
        }
        .total-label {
          font-weight: 600;
          color: #6b7280;
        }
        .total-value {
          font-weight: bold;
          color: #1e293b;
        }
        .grand-total {
          border-top: 2px solid #3b82f6;
          padding-top: 10px;
          font-size: 18px;
          color: #3b82f6;
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
        .notes-section {
          margin-top: 30px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div class="company-info">
            <h1 class="company-name">شركة علي صالح الشهري القابضة</h1>
            <p class="company-details">المملكة العربية السعودية - الرياض</p>
            <p class="company-details">هاتف: +966 11 123 4567 | بريد إلكتروني: info@alialshehriholding.com</p>
            <p class="company-details">الموقع الإلكتروني: www.alialshehriholding.com</p>
          </div>
          <h2 class="invoice-title">فاتورة ضريبية</h2>
        </div>

        <div class="invoice-info">
          <div class="invoice-details">
            <h3 class="section-title">تفاصيل الفاتورة</h3>
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
              <span class="detail-label">حالة الفاتورة:</span>
              <span class="detail-value"><span class="status-badge">${statusText}</span></span>
            </div>
          </div>

          <div class="customer-details">
            <h3 class="section-title">بيانات العميل</h3>
            <div class="detail-row">
              <span class="detail-label">اسم العميل:</span>
              <span class="detail-value"><strong>${invoice.customer_name}</strong></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">البريد الإلكتروني:</span>
              <span class="detail-value">${invoice.customer_email}</span>
            </div>
            ${invoice.customer_phone ? `
            <div class="detail-row">
              <span class="detail-label">رقم الهاتف:</span>
              <span class="detail-value">${invoice.customer_phone}</span>
            </div>
            ` : ''}
          </div>
        </div>

        <table class="services-table">
          <thead>
            <tr>
              <th>الوصف</th>
              <th>الكمية</th>
              <th>سعر الوحدة</th>
              <th>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${invoice.offer_title}</td>
              <td>1</td>
              <td>${invoice.amount} ${invoice.currency}</td>
              <td><strong>${invoice.amount} ${invoice.currency}</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-row">
            <span class="total-label">المجموع الفرعي:</span>
            <span class="total-value">${invoice.amount} ${invoice.currency}</span>
          </div>
          <div class="total-row">
            <span class="total-label">ضريبة القيمة المضافة (15%):</span>
            <span class="total-value">${(Number(invoice.amount) * 0.15).toFixed(2)} ${invoice.currency}</span>
          </div>
          <div class="total-row grand-total">
            <span class="total-label">الإجمالي الكلي:</span>
            <span class="total-value">${(Number(invoice.amount) * 1.15).toFixed(2)} ${invoice.currency}</span>
          </div>
        </div>

        ${invoice.notes ? `
        <div class="notes-section">
          <h3 class="section-title">ملاحظات</h3>
          <p>${invoice.notes}</p>
        </div>
        ` : ''}

        <div class="footer">
          <p>شكراً لكم لاختيار خدماتنا</p>
          <p>هذه فاتورة ضريبية صادرة إلكترونياً ولا تحتاج إلى توقيع</p>
          <p>في حالة وجود أي استفسارات، يرجى التواصل معنا على البريد الإلكتروني أو الهاتف المذكور أعلاه</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

async function generatePDFFromHTML(html: string, invoiceNumber: string): Promise<string> {
  // في بيئة الإنتاج الحقيقية، يمكن استخدام خدمات مثل:
  // - Puppeteer for PDF generation
  // - HTMLToPDF API services
  // - Browser-based PDF generation
  
  // هنا سنحاكي عملية توليد PDF ونرجع رابط مؤقت
  const timestamp = Date.now();
  const fileName = `invoice-${invoiceNumber}-${timestamp}.pdf`;
  
  // في التطبيق الحقيقي، يجب حفظ الملف في storage
  // وإرجاع الرابط الحقيقي للملف
  
  // لأغراض العرض التوضيحي، سنرجع رابط data URL
  const base64Content = btoa(unescape(encodeURIComponent(html)));
  return `data:text/html;base64,${base64Content}`;
}

serve(handler);