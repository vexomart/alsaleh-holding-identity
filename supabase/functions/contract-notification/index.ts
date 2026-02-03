/**
 * Contract Lifecycle Email Notifications
 * Professional RTL Arabic email templates for contracts
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
  securityNotice,
  formatCurrency,
  getStatusInfo
} from "../_shared/email-templates.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type ContractEvent = 
  | "created"
  | "pre_approved"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "pending_signature"
  | "signed"
  | "active"
  | "expired"
  | "cancelled";

const EVENT_CONFIG: Record<ContractEvent, { titleAr: string; messageAr: string; variant: 'success' | 'info' | 'warning' | 'error'; actionRequired: boolean }> = {
  created: {
    titleAr: "تم إنشاء عقد جديد",
    messageAr: "تم إنشاء عقد جديد وهو الآن قيد المراجعة.",
    variant: 'info',
    actionRequired: false,
  },
  pre_approved: {
    titleAr: "موافقة مبدئية على العقد",
    messageAr: "تمت الموافقة المبدئية على العقد من قبلكم. سيتم مراجعته من قبل الإدارة.",
    variant: 'info',
    actionRequired: false,
  },
  pending_approval: {
    titleAr: "العقد بانتظار موافقة الإدارة",
    messageAr: "العقد الآن بانتظار موافقة الإدارة. سيتم إشعاركم عند الموافقة.",
    variant: 'warning',
    actionRequired: false,
  },
  approved: {
    titleAr: "تمت الموافقة على العقد!",
    messageAr: "🎉 تمت الموافقة على عقدكم من قبل الإدارة. يمكنكم الآن التوقيع عليه.",
    variant: 'success',
    actionRequired: true,
  },
  rejected: {
    titleAr: "تم رفض العقد",
    messageAr: "للأسف، تم رفض طلب العقد. يرجى التواصل معنا لمزيد من التفاصيل.",
    variant: 'error',
    actionRequired: false,
  },
  pending_signature: {
    titleAr: "العقد جاهز للتوقيع",
    messageAr: "✍️ عقدكم جاهز للتوقيع الإلكتروني. يرجى تسجيل الدخول لإتمام التوقيع.",
    variant: 'warning',
    actionRequired: true,
  },
  signed: {
    titleAr: "تم توقيع العقد بنجاح",
    messageAr: "🖊️ تم توقيع العقد بنجاح. سيتم تفعيله قريباً.",
    variant: 'success',
    actionRequired: false,
  },
  active: {
    titleAr: "العقد الآن نشط!",
    messageAr: "✅ تم تفعيل عقدكم وهو الآن ساري المفعول.",
    variant: 'success',
    actionRequired: false,
  },
  expired: {
    titleAr: "انتهت صلاحية العقد",
    messageAr: "⚠️ انتهت صلاحية عقدكم. يرجى التواصل معنا للتجديد.",
    variant: 'warning',
    actionRequired: true,
  },
  cancelled: {
    titleAr: "تم إلغاء العقد",
    messageAr: "تم إلغاء العقد. يرجى التواصل معنا إذا كان لديكم أي استفسار.",
    variant: 'error',
    actionRequired: false,
  },
};

interface ContractNotificationRequest {
  event: ContractEvent;
  customerEmail: string;
  customerName: string;
  contractNumber: string;
  contractId: string;
  contractTitle?: string;
  serviceName?: string;
  serviceNameAr?: string;
  amount?: number;
  currency?: string;
  pdfUrl?: string;
  rejectionReason?: string;
  approvalNotes?: string;
  sendToAdmin?: boolean;
}

const getCustomerEmailContent = (data: ContractNotificationRequest): string => {
  const config = EVENT_CONFIG[data.event];
  
  return `
    ${greeting(data.customerName, config.messageAr)}
    
    ${sectionTitle('تفاصيل العقد', '📄')}
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding: 0 24px 16px 24px; text-align: center;">
          ${statusBadge(data.event === 'pending_signature' ? 'pending' : data.event === 'approved' || data.event === 'signed' || data.event === 'active' ? 'completed' : data.event === 'rejected' || data.event === 'cancelled' ? 'rejected' : 'pending')}
        </td>
      </tr>
    </table>
    
    ${infoCard([
      { label: 'رقم العقد', value: data.contractNumber },
      ...(data.contractTitle ? [{ label: 'عنوان العقد', value: data.contractTitle }] : []),
      ...(data.serviceNameAr || data.serviceName ? [{ label: 'الخدمة', value: data.serviceNameAr || data.serviceName || '' }] : []),
    ])}
    
    ${data.amount ? amountDisplay(data.amount, 'قيمة العقد') : ''}
    
    ${data.rejectionReason ? highlightBox(`❌ سبب الرفض: ${data.rejectionReason}`, 'error') : ''}
    
    ${data.approvalNotes ? highlightBox(`📝 ملاحظات الموافقة: ${data.approvalNotes}`, 'info') : ''}
    
    ${highlightBox(config.messageAr, config.variant)}
    
    ${config.actionRequired ? 
      ctaButton(data.event === 'pending_signature' || data.event === 'approved' ? 'توقيع العقد الآن' : 'عرض العقد', 
        `https://ash-holding.sa/app/contracts/${data.contractId}`, 
        data.event === 'pending_signature' ? 'warning' : 'primary') : 
      ctaButton('عرض عقودي', 'https://ash-holding.sa/app/contracts')}
    
    ${data.pdfUrl ? `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td align="center" style="padding: 0 24px 24px 24px;">
          <a href="${data.pdfUrl}" target="_blank" style="color: ${BRAND.colors.accent}; font-size: 14px;">📥 تحميل نسخة العقد PDF</a>
        </td>
      </tr>
    </table>
    ` : ''}
  `;
};

const getAdminEmailContent = (data: ContractNotificationRequest): string => {
  const config = EVENT_CONFIG[data.event];
  const isActionRequired = ['pre_approved', 'pending_approval', 'signed'].includes(data.event);
  
  return `
    ${sectionTitle(isActionRequired ? '⚡ إجراء مطلوب - عقد' : '📄 إشعار عقد', '')}
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding: 8px 24px 16px 24px; text-align: center;">
          ${statusBadge(data.event === 'approved' || data.event === 'signed' || data.event === 'active' ? 'completed' : data.event === 'rejected' ? 'rejected' : 'pending')}
        </td>
      </tr>
    </table>
    
    ${infoCard([
      { label: 'رقم العقد', value: data.contractNumber },
      { label: 'العميل', value: data.customerName },
      { label: 'البريد الإلكتروني', value: data.customerEmail },
      ...(data.serviceNameAr || data.serviceName ? [{ label: 'الخدمة', value: data.serviceNameAr || data.serviceName || '' }] : []),
      ...(data.amount ? [{ label: 'القيمة', value: formatCurrency(data.amount) }] : []),
      { label: 'الحدث', value: config.titleAr },
    ])}
    
    ${isActionRequired ? highlightBox(
      data.event === 'pre_approved' || data.event === 'pending_approval' ? '⚡ يرجى مراجعة العقد والموافقة عليه أو رفضه' : 
      data.event === 'signed' ? '⚡ تم توقيع العقد من قبل العميل ويحتاج لتفعيله' : '',
      'warning'
    ) : ''}
    
    ${ctaButton('إدارة العقود', 'https://ash-holding.sa/admin/contracts')}
  `;
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ContractNotificationRequest = await req.json();
    const config = EVENT_CONFIG[data.event];
    const results: any[] = [];

    // Send to customer
    const customerEmail = await resend.emails.send({
      from: `ASH Holding <${BRAND.fromEmail}>`,
      to: [data.customerEmail],
      bcc: [BRAND.fromEmail],
      subject: `📄 ${config.titleAr} - العقد ${data.contractNumber}`,
      html: emailWrapper(getCustomerEmailContent(data)),
    });
    results.push({ type: 'customer', ...customerEmail });

    // Send to admin
    if (data.sendToAdmin !== false) {
      const adminEmail = await resend.emails.send({
        from: `ASH Holding <${BRAND.fromEmail}>`,
        to: [BRAND.fromEmail],
        subject: `📄 ${config.titleAr} - العقد ${data.contractNumber}`,
        html: emailWrapper(getAdminEmailContent(data)),
      });
      results.push({ type: 'admin', ...adminEmail });
    }

    console.log("Contract notification emails sent:", results);

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in contract-notification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
