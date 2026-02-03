/**
 * Invoice Lifecycle Email Notifications
 * Professional RTL Arabic email templates for invoices
 * From: ASH Holding
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { 
  BRAND, 
  emailWrapper, 
  greeting, 
  sectionTitle, 
  infoCard, 
  statusBadge, 
  ctaButton, 
  highlightBox,
  amountDisplay,
  formatDate,
  formatCurrency,
  getStatusInfo
} from "../_shared/email-templates.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type InvoiceEvent = "created" | "issued" | "reminder" | "paid" | "overdue" | "cancelled";

const EVENT_CONFIG: Record<InvoiceEvent, { titleAr: string; messageAr: string; variant: 'success' | 'info' | 'warning' | 'error'; urgent: boolean }> = {
  created: {
    titleAr: "تم إنشاء فاتورة جديدة",
    messageAr: "تم إنشاء فاتورة جديدة لطلبكم. يرجى مراجعة التفاصيل والدفع.",
    variant: 'info',
    urgent: false,
  },
  issued: {
    titleAr: "فاتورة جديدة بانتظار الدفع",
    messageAr: "📄 تم إصدار فاتورة جديدة لحسابكم. يرجى الدفع في الموعد المحدد.",
    variant: 'info',
    urgent: false,
  },
  reminder: {
    titleAr: "تذكير بموعد سداد الفاتورة",
    messageAr: "⏰ نذكركم بموعد سداد الفاتورة المستحقة. يرجى الدفع لتجنب أي رسوم إضافية.",
    variant: 'warning',
    urgent: true,
  },
  paid: {
    titleAr: "تم استلام الدفعة بنجاح!",
    messageAr: "✅ شكراً لكم! تم استلام دفعتكم وتسجيلها بنجاح.",
    variant: 'success',
    urgent: false,
  },
  overdue: {
    titleAr: "فاتورة متأخرة السداد",
    messageAr: "🚨 فاتورتكم متأخرة السداد. يرجى الدفع فوراً لتجنب إيقاف الخدمات.",
    variant: 'error',
    urgent: true,
  },
  cancelled: {
    titleAr: "تم إلغاء الفاتورة",
    messageAr: "تم إلغاء هذه الفاتورة. إذا كان لديكم أي استفسار، يرجى التواصل معنا.",
    variant: 'info',
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

const getCustomerEmailContent = (data: InvoiceNotificationRequest): string => {
  const config = EVENT_CONFIG[data.event];
  const currency = data.currency || 'ريال';
  
  return `
    ${greeting(data.customerName, config.messageAr)}
    
    ${sectionTitle('تفاصيل الفاتورة', '🧾')}
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding: 0 24px 16px 24px; text-align: center;">
          ${statusBadge(data.event === 'paid' ? 'paid' : data.event === 'overdue' ? 'overdue' : 'issued')}
        </td>
      </tr>
    </table>
    
    ${infoCard([
      { label: 'رقم الفاتورة', value: data.invoiceNumber },
      ...(data.orderNumber ? [{ label: 'رقم الطلب', value: data.orderNumber }] : []),
      ...(data.serviceNameAr || data.serviceName ? [{ label: 'الخدمة', value: data.serviceNameAr || data.serviceName || '' }] : []),
      { label: 'المبلغ الأساسي', value: formatCurrency(data.subtotal) },
      { label: 'ضريبة القيمة المضافة (15%)', value: formatCurrency(data.vatAmount) },
    ])}
    
    ${amountDisplay(data.total, 'الإجمالي المستحق')}
    
    ${data.dueDate && data.event !== 'paid' && data.event !== 'cancelled' ? 
      highlightBox(`📅 ${data.event === 'overdue' ? 'كان موعد السداد:' : 'موعد السداد:'} ${formatDate(data.dueDate)}`, 
        data.event === 'overdue' ? 'error' : 'warning') : ''}
    
    ${data.event === 'paid' && data.paidAt ? 
      highlightBox(`✅ تم الدفع بنجاح بتاريخ ${formatDate(data.paidAt)}`, 'success') : ''}
    
    ${config.urgent ? highlightBox(config.messageAr, config.variant) : ''}
    
    ${data.event !== 'paid' && data.event !== 'cancelled' ? 
      ctaButton('💳 ادفع الآن', data.paymentUrl || `https://ash-holding.sa/app/invoices/${data.invoiceId}`, 'success') : 
      ctaButton('عرض الفاتورة', `https://ash-holding.sa/app/invoices/${data.invoiceId}`)}
    
    ${data.pdfUrl ? `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td align="center" style="padding: 0 24px 24px 24px;">
          <a href="${data.pdfUrl}" target="_blank" style="color: ${BRAND.colors.accent}; font-size: 14px;">📥 تحميل الفاتورة PDF</a>
        </td>
      </tr>
    </table>
    ` : ''}
  `;
};

const getAdminEmailContent = (data: InvoiceNotificationRequest): string => {
  const config = EVENT_CONFIG[data.event];
  
  return `
    ${sectionTitle(data.event === 'paid' ? '✅ دفعة مستلمة' : data.event === 'overdue' ? '🚨 فاتورة متأخرة' : '🧾 إشعار فاتورة', '')}
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding: 8px 24px 16px 24px; text-align: center;">
          ${statusBadge(data.event === 'paid' ? 'paid' : data.event === 'overdue' ? 'overdue' : 'issued')}
        </td>
      </tr>
    </table>
    
    ${amountDisplay(data.total, 'المبلغ الإجمالي')}
    
    ${infoCard([
      { label: 'رقم الفاتورة', value: data.invoiceNumber },
      { label: 'العميل', value: data.customerName },
      { label: 'البريد الإلكتروني', value: data.customerEmail },
      ...(data.dueDate ? [{ label: 'تاريخ الاستحقاق', value: formatDate(data.dueDate) }] : []),
      ...(data.paidAt ? [{ label: 'تاريخ الدفع', value: formatDate(data.paidAt) }] : []),
    ])}
    
    ${ctaButton('إدارة الفواتير', 'https://ash-holding.sa/admin/invoices')}
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
      from: `ASH Holding <${BRAND.fromEmail}>`,
      to: [data.customerEmail],
      bcc: [BRAND.fromEmail],
      subject: `🧾 ${config.titleAr} - الفاتورة ${data.invoiceNumber}`,
      html: emailWrapper(getCustomerEmailContent(data)),
    });
    results.push({ type: 'customer', ...customerEmail });

    // Send to admin
    if (data.sendToAdmin !== false) {
      const adminEmail = await resend.emails.send({
        from: `ASH Holding <${BRAND.fromEmail}>`,
        to: [BRAND.fromEmail],
        subject: `🧾 ${config.titleAr} - ${data.invoiceNumber} | ${formatCurrency(data.total)}`,
        html: emailWrapper(getAdminEmailContent(data)),
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
