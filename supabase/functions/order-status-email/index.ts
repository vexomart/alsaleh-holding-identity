/**
 * Order Status Email Notifications
 * Professional RTL Arabic email templates for order lifecycle
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
  formatDateTime,
  getStatusInfo
} from "../_shared/email-templates.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const STATUS_MESSAGES: Record<string, { titleAr: string; messageAr: string; variant: 'success' | 'info' | 'warning' | 'error' }> = {
  pending: {
    titleAr: "تم استلام طلبك",
    messageAr: "تم استلام طلبك بنجاح وهو الآن قيد المراجعة. سنتواصل معك قريباً.",
    variant: 'info',
  },
  confirmed: {
    titleAr: "تم تأكيد طلبك",
    messageAr: "تم تأكيد طلبك وسيتم البدء في معالجته قريباً.",
    variant: 'info',
  },
  processing: {
    titleAr: "طلبك قيد التنفيذ",
    messageAr: "نحن نعمل على طلبك الآن. سيتم إشعارك عند اكتمال الخدمة.",
    variant: 'info',
  },
  completed: {
    titleAr: "تم إكمال طلبك بنجاح!",
    messageAr: "🎉 تم إكمال طلبك بنجاح. شكراً لثقتك بنا!",
    variant: 'success',
  },
  cancelled: {
    titleAr: "تم إلغاء الطلب",
    messageAr: "تم إلغاء طلبك. إذا كان لديك أي استفسار، يرجى التواصل معنا.",
    variant: 'error',
  },
  refunded: {
    titleAr: "تم استرداد المبلغ",
    messageAr: "💸 تم استرداد المبلغ المدفوع لحسابك. قد يستغرق ظهوره 3-5 أيام عمل.",
    variant: 'warning',
  },
  rejected: {
    titleAr: "تم رفض الطلب",
    messageAr: "للأسف، تم رفض طلبك. يرجى التواصل معنا لمزيد من التفاصيل.",
    variant: 'error',
  },
};

interface OrderStatusRequest {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  orderId: string;
  orderTitle?: string;
  newStatus: string;
  oldStatus?: string;
  serviceName?: string;
  serviceNameAr?: string;
  amount?: number;
  currency?: string;
  notes?: string;
  notesAr?: string;
  sendToAdmin?: boolean;
}

const getCustomerEmailContent = (data: OrderStatusRequest): string => {
  const statusInfo = STATUS_MESSAGES[data.newStatus] || STATUS_MESSAGES.pending;
  const statusData = getStatusInfo(data.newStatus);
  
  return `
    ${greeting(data.customerName, statusInfo.messageAr)}
    
    ${sectionTitle('تفاصيل الطلب', '📋')}
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding: 0 24px 16px 24px; text-align: center;">
          ${statusBadge(data.newStatus)}
        </td>
      </tr>
    </table>
    
    ${infoCard([
      { label: 'رقم الطلب', value: data.orderNumber },
      ...(data.orderTitle ? [{ label: 'عنوان الطلب', value: data.orderTitle }] : []),
      ...(data.serviceNameAr || data.serviceName ? [{ label: 'الخدمة', value: data.serviceNameAr || data.serviceName || '' }] : []),
      { label: 'الحالة', value: statusData.labelAr },
    ])}
    
    ${data.amount ? amountDisplay(data.amount, 'قيمة الطلب') : ''}
    
    ${data.notesAr || data.notes ? highlightBox(`📝 ${data.notesAr || data.notes}`, 'warning') : ''}
    
    ${highlightBox(statusInfo.messageAr, statusInfo.variant)}
    
    ${ctaButton('متابعة الطلب', `https://ash-holding.sa/app/orders/${data.orderId}`)}
  `;
};

const getAdminEmailContent = (data: OrderStatusRequest): string => {
  const statusInfo = STATUS_MESSAGES[data.newStatus] || STATUS_MESSAGES.pending;
  const oldStatusInfo = data.oldStatus ? getStatusInfo(data.oldStatus) : null;
  const newStatusInfo = getStatusInfo(data.newStatus);
  
  return `
    ${sectionTitle('🔔 تحديث حالة طلب', '')}
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding: 8px 24px 16px 24px; text-align: center;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
            <tr>
              ${oldStatusInfo ? `
              <td style="padding: 8px 12px; background-color: ${oldStatusInfo.bg}; color: ${oldStatusInfo.text}; border-radius: 8px; font-size: 13px;">
                ${oldStatusInfo.labelAr}
              </td>
              <td style="padding: 0 12px; font-size: 20px; color: #64748b;">←</td>
              ` : ''}
              <td style="padding: 8px 12px; background-color: ${newStatusInfo.bg}; color: ${newStatusInfo.text}; border-radius: 8px; font-size: 13px; font-weight: 600;">
                ${newStatusInfo.labelAr}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    ${infoCard([
      { label: 'رقم الطلب', value: data.orderNumber },
      { label: 'العميل', value: data.customerName },
      { label: 'البريد الإلكتروني', value: data.customerEmail },
      ...(data.serviceNameAr || data.serviceName ? [{ label: 'الخدمة', value: data.serviceNameAr || data.serviceName || '' }] : []),
      ...(data.amount ? [{ label: 'المبلغ', value: `${data.amount.toLocaleString('ar-SA')} ${data.currency || 'SAR'}` }] : []),
    ])}
    
    ${ctaButton('إدارة الطلبات', 'https://ash-holding.sa/admin/orders')}
  `;
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: OrderStatusRequest = await req.json();
    const statusInfo = STATUS_MESSAGES[data.newStatus] || STATUS_MESSAGES.pending;
    const results: any[] = [];

    // Send to customer
    const customerEmail = await resend.emails.send({
      from: `ASH Holding <${BRAND.fromEmail}>`,
      to: [data.customerEmail],
      bcc: [BRAND.fromEmail],
      subject: `📦 ${statusInfo.titleAr} - الطلب ${data.orderNumber}`,
      html: emailWrapper(getCustomerEmailContent(data)),
    });
    results.push({ type: 'customer', ...customerEmail });

    // Send to admin
    if (data.sendToAdmin !== false) {
      const adminEmail = await resend.emails.send({
        from: `ASH Holding <${BRAND.fromEmail}>`,
        to: [BRAND.fromEmail],
        subject: `🔔 تحديث الطلب ${data.orderNumber}: ${statusInfo.titleAr}`,
        html: emailWrapper(getAdminEmailContent(data)),
      });
      results.push({ type: 'admin', ...adminEmail });
    }

    console.log("Order status emails sent:", results);

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in order-status-email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
