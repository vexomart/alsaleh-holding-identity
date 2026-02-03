/**
 * Invoice Lifecycle Email Notifications
 * Sends real-time emails for invoice events
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BRAND = {
  name: "ASH HOLDING",
  nameAr: "شركة علي صالح الشهري القابضة",
  email: "info@ash-holding.sa",
  phone: "0555812567",
};

type InvoiceEvent = 
  | "created"
  | "issued"
  | "reminder"
  | "paid"
  | "overdue"
  | "cancelled";

const EVENT_CONFIG: Record<InvoiceEvent, { icon: string; bgColor: string; textColor: string; titleAr: string; messageAr: string; urgent: boolean }> = {
  created: {
    icon: "📄",
    bgColor: "#dbeafe",
    textColor: "#1e40af",
    titleAr: "تم إنشاء فاتورة جديدة",
    messageAr: "تم إنشاء فاتورة جديدة لطلبكم. يرجى مراجعة التفاصيل والدفع.",
    urgent: false,
  },
  issued: {
    icon: "📨",
    bgColor: "#dbeafe",
    textColor: "#1e40af",
    titleAr: "فاتورة جديدة بانتظار الدفع",
    messageAr: "تم إصدار فاتورة جديدة لحسابكم. يرجى الدفع في الموعد المحدد.",
    urgent: false,
  },
  reminder: {
    icon: "⏰",
    bgColor: "#fef3c7",
    textColor: "#92400e",
    titleAr: "تذكير بموعد سداد الفاتورة",
    messageAr: "نذكركم بموعد سداد الفاتورة المستحقة. يرجى الدفع لتجنب أي رسوم إضافية.",
    urgent: true,
  },
  paid: {
    icon: "✅",
    bgColor: "#d1fae5",
    textColor: "#065f46",
    titleAr: "تم استلام الدفعة بنجاح!",
    messageAr: "شكراً لكم! تم استلام دفعتكم وتسجيلها بنجاح.",
    urgent: false,
  },
  overdue: {
    icon: "🚨",
    bgColor: "#fee2e2",
    textColor: "#991b1b",
    titleAr: "فاتورة متأخرة السداد",
    messageAr: "فاتورتكم متأخرة السداد. يرجى الدفع فوراً لتجنب إيقاف الخدمات.",
    urgent: true,
  },
  cancelled: {
    icon: "❌",
    bgColor: "#f3f4f6",
    textColor: "#4b5563",
    titleAr: "تم إلغاء الفاتورة",
    messageAr: "تم إلغاء هذه الفاتورة. إذا كان لديكم أي استفسار، يرجى التواصل معنا.",
    urgent: false,
  },
};

interface InvoiceNotificationRequest {
  event: InvoiceEvent;
  customerEmail: string;
  customerName: string;
  invoiceNumber: string;
  invoiceId: string;
  orderId?: string;
  orderNumber?: string;
  subtotal: number;
  vatAmount: number;
  total: number;
  currency?: string;
  dueDate?: string;
  paidAt?: string;
  paymentUrl?: string;
  pdfUrl?: string;
  serviceName?: string;
  serviceNameAr?: string;
  sendToAdmin?: boolean;
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getCustomerEmailTemplate = (data: InvoiceNotificationRequest) => {
  const config = EVENT_CONFIG[data.event];
  
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>فاتورة - ${data.invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background: #f8fafc; direction: rtl; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #0f172a, #1e3a8a); color: white; padding: 32px; text-align: center; }
    .logo { font-size: 24px; font-weight: 800; letter-spacing: 2px; }
    .content { padding: 32px; }
    .event-banner { background: ${config.bgColor}; border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0; ${config.urgent ? 'border: 2px solid ' + config.textColor + ';' : ''} }
    .event-icon { font-size: 48px; margin-bottom: 12px; }
    .event-title { font-size: 22px; font-weight: 700; color: ${config.textColor}; margin-bottom: 8px; }
    .event-message { color: ${config.textColor}; opacity: 0.9; }
    .invoice-card { background: #f8fafc; border-radius: 12px; overflow: hidden; margin: 24px 0; }
    .invoice-header { background: #1e3a8a; color: white; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; }
    .invoice-body { padding: 20px; }
    .line-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
    .line-item:last-child { border-bottom: none; }
    .total-row { background: #0f172a; color: white; padding: 16px 20px; display: flex; justify-content: space-between; font-size: 18px; font-weight: 700; }
    .due-date-box { background: ${data.event === 'overdue' ? '#fee2e2' : '#fef3c7'}; border-radius: 10px; padding: 16px; text-align: center; margin: 20px 0; }
    .payment-box { background: linear-gradient(135deg, #059669, #10b981); border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
    .btn { display: inline-block; background: white; color: #059669 !important; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; }
    .btn-outline { background: transparent; border: 2px solid white; color: white !important; }
    .paid-stamp { background: #d1fae5; border: 3px solid #10b981; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .footer { background: #0f172a; color: #94a3b8; padding: 24px; text-align: center; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">ASH HOLDING</div>
      <p style="opacity: 0.8; margin-top: 8px;">${BRAND.nameAr}</p>
    </div>
    
    <div class="content">
      <p style="font-size: 16px; color: #475569; margin-bottom: 24px;">
        مرحباً <strong>${data.customerName}</strong>،
      </p>
      
      <div class="event-banner">
        <div class="event-icon">${config.icon}</div>
        <div class="event-title">${config.titleAr}</div>
        <div class="event-message">${config.messageAr}</div>
      </div>
      
      <div class="invoice-card">
        <div class="invoice-header">
          <div>
            <div style="font-size: 12px; opacity: 0.8;">رقم الفاتورة</div>
            <div style="font-family: monospace; font-size: 16px;">${data.invoiceNumber}</div>
          </div>
          ${data.orderNumber ? `
          <div style="text-align: left;">
            <div style="font-size: 12px; opacity: 0.8;">رقم الطلب</div>
            <div style="font-family: monospace;">${data.orderNumber}</div>
          </div>
          ` : ''}
        </div>
        
        <div class="invoice-body">
          ${data.serviceNameAr || data.serviceName ? `
          <div class="line-item">
            <span style="color: #64748b;">الخدمة</span>
            <span style="font-weight: 600;">${data.serviceNameAr || data.serviceName}</span>
          </div>
          ` : ''}
          
          <div class="line-item">
            <span style="color: #64748b;">المبلغ الأساسي</span>
            <span style="font-weight: 600;">${data.subtotal.toLocaleString('ar-SA')} ${data.currency || 'SAR'}</span>
          </div>
          
          <div class="line-item">
            <span style="color: #64748b;">ضريبة القيمة المضافة (15%)</span>
            <span style="font-weight: 600;">${data.vatAmount.toLocaleString('ar-SA')} ${data.currency || 'SAR'}</span>
          </div>
        </div>
        
        <div class="total-row">
          <span>الإجمالي المستحق</span>
          <span>${data.total.toLocaleString('ar-SA')} ${data.currency || 'SAR'}</span>
        </div>
      </div>
      
      ${data.event === 'paid' ? `
      <div class="paid-stamp">
        <span style="font-size: 48px;">✅</span>
        <h3 style="color: #065f46; margin: 12px 0;">تم الدفع بنجاح</h3>
        ${data.paidAt ? `<p style="color: #059669;">تاريخ الدفع: ${formatDate(data.paidAt)}</p>` : ''}
      </div>
      ` : ''}
      
      ${data.dueDate && data.event !== 'paid' && data.event !== 'cancelled' ? `
      <div class="due-date-box">
        <span style="font-size: 24px;">${data.event === 'overdue' ? '🚨' : '📅'}</span>
        <p style="font-weight: 600; color: ${data.event === 'overdue' ? '#991b1b' : '#92400e'}; margin-top: 8px;">
          ${data.event === 'overdue' ? 'كان موعد السداد:' : 'موعد السداد:'}
        </p>
        <p style="font-size: 18px; font-weight: 700; color: ${data.event === 'overdue' ? '#dc2626' : '#d97706'};">
          ${formatDate(data.dueDate)}
        </p>
      </div>
      ` : ''}
      
      ${(data.event !== 'paid' && data.event !== 'cancelled') ? `
      <div class="payment-box">
        <p style="color: white; margin-bottom: 16px; font-size: 15px;">💳 ادفع الآن بسهولة من خلال بوابتنا الآمنة</p>
        <a href="${data.paymentUrl || `https://alsaleh-holding-identity.lovable.app/app/invoices/${data.invoiceId}`}" class="btn">ادفع الآن</a>
        ${data.pdfUrl ? `
        <br><br>
        <a href="${data.pdfUrl}" class="btn btn-outline" target="_blank">تحميل الفاتورة PDF</a>
        ` : ''}
      </div>
      ` : data.pdfUrl ? `
      <div style="text-align: center; margin: 24px 0;">
        <a href="${data.pdfUrl}" style="display: inline-block; background: #3b82f6; color: white !important; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600;" target="_blank">تحميل الفاتورة PDF</a>
      </div>
      ` : ''}
      
      <div style="text-align: center; color: #64748b; font-size: 14px; margin-top: 32px;">
        <p>هل لديك استفسار؟ تواصل معنا:</p>
        <p style="margin-top: 8px;">📧 ${BRAND.email} | 📱 ${BRAND.phone}</p>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>${BRAND.nameAr}</strong></p>
      <p style="margin-top: 8px;">© ${new Date().getFullYear()} جميع الحقوق محفوظة</p>
    </div>
  </div>
</body>
</html>
`;
};

const getAdminEmailTemplate = (data: InvoiceNotificationRequest) => {
  const config = EVENT_CONFIG[data.event];
  
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>إشعار فاتورة - ${data.invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background: #f8fafc; direction: rtl; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: ${data.event === 'paid' ? 'linear-gradient(135deg, #059669, #10b981)' : data.event === 'overdue' ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : 'linear-gradient(135deg, #1e3a8a, #3b82f6)'}; color: white; padding: 24px; text-align: center; }
    .badge { background: ${data.event === 'paid' ? '#d1fae5' : '#fbbf24'}; color: ${data.event === 'paid' ? '#065f46' : '#78350f'}; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block; margin-bottom: 12px; }
    .content { padding: 24px; }
    .amount-display { background: #f8fafc; border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0; }
    .amount { font-size: 32px; font-weight: 700; color: ${data.event === 'paid' ? '#059669' : '#0f172a'}; }
    .info-grid { display: grid; gap: 12px; margin: 20px 0; }
    .info-item { background: #f8fafc; padding: 14px; border-radius: 10px; border-right: 3px solid #3b82f6; }
    .info-label { font-size: 11px; color: #64748b; text-transform: uppercase; }
    .info-value { font-size: 15px; font-weight: 600; color: #0f172a; margin-top: 4px; }
    .btn { display: inline-block; background: #3b82f6; color: white !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; }
    .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">${config.icon} ${config.titleAr}</span>
      <h2>الفاتورة ${data.invoiceNumber}</h2>
    </div>
    
    <div class="content">
      <div class="amount-display">
        <div style="color: #64748b; font-size: 14px; margin-bottom: 8px;">المبلغ الإجمالي</div>
        <div class="amount">${data.total.toLocaleString('ar-SA')} ${data.currency || 'SAR'}</div>
        ${data.event === 'paid' ? '<div style="color: #059669; margin-top: 8px;">✅ تم الدفع</div>' : ''}
      </div>
      
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">العميل</div>
          <div class="info-value">${data.customerName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">البريد الإلكتروني</div>
          <div class="info-value">${data.customerEmail}</div>
        </div>
        ${data.dueDate ? `
        <div class="info-item">
          <div class="info-label">تاريخ الاستحقاق</div>
          <div class="info-value" style="${data.event === 'overdue' ? 'color: #dc2626;' : ''}">${formatDate(data.dueDate)}</div>
        </div>
        ` : ''}
        ${data.paidAt ? `
        <div class="info-item">
          <div class="info-label">تاريخ الدفع</div>
          <div class="info-value" style="color: #059669;">${formatDate(data.paidAt)}</div>
        </div>
        ` : ''}
      </div>
      
      <div style="text-align: center; margin: 24px 0;">
        <a href="https://alsaleh-holding-identity.lovable.app/admin/invoices" class="btn">إدارة الفواتير</a>
      </div>
    </div>
    
    <div class="footer">
      <p>نظام إدارة الفواتير - ${BRAND.nameAr}</p>
    </div>
  </div>
</body>
</html>
`;
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: InvoiceNotificationRequest = await req.json();
    const config = EVENT_CONFIG[data.event];
    const results: any[] = [];

    // Send to customer
    const customerEmail = await resend.emails.send({
      from: `${BRAND.nameAr} <${BRAND.email}>`,
      to: [data.customerEmail],
      bcc: [BRAND.email],
      subject: `${config.icon} ${config.titleAr} - الفاتورة ${data.invoiceNumber}`,
      html: getCustomerEmailTemplate(data),
    });
    results.push({ type: 'customer', ...customerEmail });

    // Send to admin
    if (data.sendToAdmin !== false) {
      const adminEmail = await resend.emails.send({
        from: `نظام الفواتير <${BRAND.email}>`,
        to: [BRAND.email],
        subject: `${config.icon} ${config.titleAr} - ${data.invoiceNumber} | ${data.total.toLocaleString('ar-SA')} ${data.currency || 'SAR'}`,
        html: getAdminEmailTemplate(data),
      });
      results.push({ type: 'admin', ...adminEmail });
    }

    console.log("Invoice notification emails sent:", results);

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in invoice-notification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
