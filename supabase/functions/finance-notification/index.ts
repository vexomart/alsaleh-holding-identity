/**
 * Finance Module Email Notifications
 * Professional RTL Arabic email templates for finance applications
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
  divider,
  formatDate,
  formatCurrency,
  getStatusInfo
} from "../_shared/email-templates.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type FinanceEvent = 
  | "application_submitted"
  | "application_under_review"
  | "application_approved"
  | "application_rejected"
  | "offer_generated"
  | "offer_selected"
  | "contract_ready"
  | "contract_signed"
  | "disbursed"
  | "payment_due"
  | "payment_reminder"
  | "payment_received"
  | "payment_overdue";

const EVENT_CONFIG: Record<FinanceEvent, { titleAr: string; messageAr: string; variant: 'success' | 'info' | 'warning' | 'error'; actionRequired: boolean }> = {
  application_submitted: {
    titleAr: "تم استلام طلب التمويل",
    messageAr: "📝 تم استلام طلب التمويل الخاص بكم بنجاح. سيتم مراجعته من قبل فريقنا المختص.",
    variant: 'info',
    actionRequired: false,
  },
  application_under_review: {
    titleAr: "طلبكم قيد المراجعة",
    messageAr: "🔍 طلب التمويل الخاص بكم الآن قيد المراجعة من قبل لجنة التمويل.",
    variant: 'warning',
    actionRequired: false,
  },
  application_approved: {
    titleAr: "تمت الموافقة على طلب التمويل!",
    messageAr: "🎉 مبروك! تمت الموافقة على طلب التمويل الخاص بكم. يمكنكم الآن اختيار العرض المناسب.",
    variant: 'success',
    actionRequired: true,
  },
  application_rejected: {
    titleAr: "تم رفض طلب التمويل",
    messageAr: "نعتذر، لم تتم الموافقة على طلب التمويل في الوقت الحالي. يمكنكم التواصل معنا لمزيد من التفاصيل.",
    variant: 'error',
    actionRequired: false,
  },
  offer_generated: {
    titleAr: "عروض التمويل جاهزة",
    messageAr: "💰 تم إعداد عروض التمويل المخصصة لكم. يرجى مراجعة العروض واختيار الأنسب.",
    variant: 'info',
    actionRequired: true,
  },
  offer_selected: {
    titleAr: "تم اختيار عرض التمويل",
    messageAr: "✅ تم تسجيل اختياركم لعرض التمويل. سيتم إعداد العقد للتوقيع.",
    variant: 'success',
    actionRequired: false,
  },
  contract_ready: {
    titleAr: "عقد التمويل جاهز للتوقيع",
    messageAr: "📄 عقد التمويل الخاص بكم جاهز. يرجى مراجعته والتوقيع إلكترونياً.",
    variant: 'warning',
    actionRequired: true,
  },
  contract_signed: {
    titleAr: "تم توقيع عقد التمويل",
    messageAr: "🖊️ تم توقيع عقد التمويل بنجاح. جاري معالجة طلب الصرف.",
    variant: 'success',
    actionRequired: false,
  },
  disbursed: {
    titleAr: "تم صرف مبلغ التمويل!",
    messageAr: "💸 تم صرف مبلغ التمويل وإيداعه في محفظتكم. يمكنكم استخدامه الآن.",
    variant: 'success',
    actionRequired: false,
  },
  payment_due: {
    titleAr: "موعد سداد القسط",
    messageAr: "📅 يحين موعد سداد القسط الشهري قريباً. يرجى التأكد من توفر الرصيد.",
    variant: 'warning',
    actionRequired: true,
  },
  payment_reminder: {
    titleAr: "تذكير بموعد السداد",
    messageAr: "⏰ نذكركم بموعد سداد القسط المستحق. يرجى السداد في الموعد لتجنب الغرامات.",
    variant: 'warning',
    actionRequired: true,
  },
  payment_received: {
    titleAr: "تم استلام السداد",
    messageAr: "✅ شكراً لكم! تم استلام سداد القسط بنجاح.",
    variant: 'success',
    actionRequired: false,
  },
  payment_overdue: {
    titleAr: "قسط متأخر السداد",
    messageAr: "🚨 لديكم قسط متأخر السداد. يرجى السداد فوراً لتجنب الإجراءات القانونية.",
    variant: 'error',
    actionRequired: true,
  },
};

interface FinanceNotificationRequest {
  event: FinanceEvent;
  customerEmail: string;
  customerName: string;
  applicationNumber?: string;
  applicationId?: string;
  contractNumber?: string;
  contractId?: string;
  amount?: number;
  monthlyPayment?: number;
  totalPayable?: number;
  tenorMonths?: number;
  aprPercent?: number;
  installmentNo?: number;
  totalInstallments?: number;
  dueDate?: string;
  paidAt?: string;
  currency?: string;
  rejectionReason?: string;
  riskLevel?: string;
  sendToAdmin?: boolean;
}

const getCustomerEmailContent = (data: FinanceNotificationRequest): string => {
  const config = EVENT_CONFIG[data.event];
  
  let financeSummary = '';
  const summaryRows: Array<{ label: string; value: string }> = [];
  
  if (data.applicationNumber) {
    summaryRows.push({ label: 'رقم الطلب', value: data.applicationNumber });
  }
  if (data.contractNumber) {
    summaryRows.push({ label: 'رقم العقد', value: data.contractNumber });
  }
  if (data.tenorMonths) {
    summaryRows.push({ label: 'مدة التمويل', value: `${data.tenorMonths} شهر` });
  }
  if (data.aprPercent) {
    summaryRows.push({ label: 'معدل النسبة السنوي', value: `${data.aprPercent}%` });
  }
  if (data.monthlyPayment) {
    summaryRows.push({ label: 'القسط الشهري', value: formatCurrency(data.monthlyPayment) });
  }
  if (data.totalPayable) {
    summaryRows.push({ label: 'إجمالي السداد', value: formatCurrency(data.totalPayable) });
  }
  
  // Installment progress for payment events
  let installmentProgress = '';
  if ((data.event === 'payment_due' || data.event === 'payment_reminder' || data.event === 'payment_overdue' || data.event === 'payment_received') 
      && data.installmentNo && data.totalInstallments) {
    const progressPercent = ((data.installmentNo - 1) / data.totalInstallments) * 100;
    installmentProgress = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding: 0 24px 16px 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${BRAND.colors.bgCard}; border-radius: 12px; padding: 16px;">
            <tr>
              <td style="padding: 16px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="color: ${BRAND.colors.textMuted}; font-size: 13px;">القسط رقم</td>
                    <td style="text-align: left; font-weight: 700; color: ${BRAND.colors.textDark};">${data.installmentNo} من ${data.totalInstallments}</td>
                  </tr>
                </table>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 12px;">
                  <tr>
                    <td style="background-color: #e2e8f0; height: 12px; border-radius: 10px;">
                      <table role="presentation" width="${progressPercent}%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="background: linear-gradient(90deg, ${BRAND.colors.accent}, ${BRAND.colors.success}); height: 12px; border-radius: 10px;"></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    `;
  }
  
  return `
    ${greeting(data.customerName, config.messageAr)}
    
    ${sectionTitle('💰 تفاصيل التمويل', '')}
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding: 0 24px 16px 24px; text-align: center;">
          ${statusBadge(
            data.event.includes('approved') || data.event.includes('disbursed') || data.event === 'payment_received' || data.event === 'contract_signed' ? 'approved' :
            data.event.includes('rejected') || data.event === 'payment_overdue' ? 'rejected' :
            data.event.includes('review') || data.event.includes('pending') || data.event.includes('due') || data.event.includes('reminder') ? 'under_review' :
            'submitted'
          )}
        </td>
      </tr>
    </table>
    
    ${data.amount ? amountDisplay(data.amount, 'مبلغ التمويل') : ''}
    
    ${summaryRows.length > 0 ? infoCard(summaryRows) : ''}
    
    ${installmentProgress}
    
    ${data.dueDate && (data.event === 'payment_due' || data.event === 'payment_reminder' || data.event === 'payment_overdue') ? 
      highlightBox(`📅 ${data.event === 'payment_overdue' ? 'كان موعد السداد:' : 'موعد السداد:'} ${formatDate(data.dueDate)}`, 
        data.event === 'payment_overdue' ? 'error' : 'warning') : ''}
    
    ${data.event === 'disbursed' ? 
      highlightBox('💰 تم إيداع المبلغ في محفظتكم الرقمية وهو جاهز للاستخدام الآن!', 'success') : ''}
    
    ${data.rejectionReason ? highlightBox(`❌ سبب الرفض: ${data.rejectionReason}`, 'error') : ''}
    
    ${highlightBox(config.messageAr, config.variant)}
    
    ${config.actionRequired ? 
      ctaButton(
        data.event === 'application_approved' || data.event === 'offer_generated' ? 'اختيار العرض' :
        data.event === 'contract_ready' ? 'توقيع العقد' :
        data.event.includes('payment') ? 'سداد القسط' : 'متابعة الطلب',
        'https://ash-holding.sa/app/finance',
        data.event.includes('overdue') ? 'warning' : 'primary'
      ) : 
      ctaButton('متابعة طلب التمويل', 'https://ash-holding.sa/app/finance')}
  `;
};

const getAdminEmailContent = (data: FinanceNotificationRequest): string => {
  const config = EVENT_CONFIG[data.event];
  const isActionRequired = ['application_submitted', 'contract_signed', 'payment_overdue'].includes(data.event);
  
  const summaryRows: Array<{ label: string; value: string }> = [
    { label: 'العميل', value: data.customerName },
    { label: 'البريد الإلكتروني', value: data.customerEmail },
  ];
  
  if (data.applicationNumber) {
    summaryRows.push({ label: 'رقم الطلب', value: data.applicationNumber });
  }
  if (data.contractNumber) {
    summaryRows.push({ label: 'رقم العقد', value: data.contractNumber });
  }
  if (data.amount) {
    summaryRows.push({ label: 'مبلغ التمويل', value: formatCurrency(data.amount) });
  }
  if (data.riskLevel) {
    summaryRows.push({ label: 'مستوى المخاطر', value: data.riskLevel });
  }
  
  return `
    ${sectionTitle(isActionRequired ? '⚡ إجراء مطلوب - تمويل' : '💰 إشعار تمويل', '')}
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding: 8px 24px 16px 24px; text-align: center;">
          ${statusBadge(
            data.event.includes('approved') || data.event.includes('disbursed') || data.event === 'payment_received' ? 'approved' :
            data.event.includes('rejected') || data.event === 'payment_overdue' ? 'rejected' : 'under_review'
          )}
        </td>
      </tr>
    </table>
    
    ${data.amount ? amountDisplay(data.amount, 'مبلغ التمويل') : ''}
    
    ${infoCard(summaryRows)}
    
    ${isActionRequired ? highlightBox(
      data.event === 'application_submitted' ? '⚡ طلب تمويل جديد يحتاج للمراجعة' :
      data.event === 'contract_signed' ? '⚡ تم توقيع العقد ويحتاج للموافقة على الصرف' :
      data.event === 'payment_overdue' ? '🚨 قسط متأخر يحتاج للمتابعة' : '',
      'warning'
    ) : ''}
    
    ${ctaButton('إدارة التمويل', 'https://ash-holding.sa/admin/finance')}
  `;
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: FinanceNotificationRequest = await req.json();
    const config = EVENT_CONFIG[data.event];
    const results: any[] = [];

    // Send to customer
    const customerEmail = await resend.emails.send({
      from: `ASH Holding <${BRAND.fromEmail}>`,
      to: [data.customerEmail],
      bcc: [BRAND.fromEmail],
      subject: `💰 ${config.titleAr}${data.applicationNumber ? ` - الطلب ${data.applicationNumber}` : ''}`,
      html: emailWrapper(getCustomerEmailContent(data)),
    });
    results.push({ type: 'customer', ...customerEmail });

    // Send to admin
    if (data.sendToAdmin !== false) {
      const adminEmail = await resend.emails.send({
        from: `ASH Holding <${BRAND.fromEmail}>`,
        to: [BRAND.fromEmail],
        subject: `💰 ${config.titleAr} - ${data.customerName}${data.amount ? ` | ${formatCurrency(data.amount)}` : ''}`,
        html: emailWrapper(getAdminEmailContent(data)),
      });
      results.push({ type: 'admin', ...adminEmail });
    }

    console.log("Finance notification emails sent:", results);

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in finance-notification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
