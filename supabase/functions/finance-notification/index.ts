/**
 * Finance Module Email Notifications
 * Sends real-time emails for finance applications, contracts, and payments
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

const EVENT_CONFIG: Record<FinanceEvent, { icon: string; bgColor: string; textColor: string; gradientFrom: string; gradientTo: string; titleAr: string; messageAr: string; actionRequired: boolean }> = {
  application_submitted: {
    icon: "📝",
    bgColor: "#dbeafe",
    textColor: "#1e40af",
    gradientFrom: "#1e40af",
    gradientTo: "#3b82f6",
    titleAr: "تم استلام طلب التمويل",
    messageAr: "تم استلام طلب التمويل الخاص بكم بنجاح. سيتم مراجعته من قبل فريقنا المختص.",
    actionRequired: false,
  },
  application_under_review: {
    icon: "🔍",
    bgColor: "#fef3c7",
    textColor: "#92400e",
    gradientFrom: "#d97706",
    gradientTo: "#f59e0b",
    titleAr: "طلبكم قيد المراجعة",
    messageAr: "طلب التمويل الخاص بكم الآن قيد المراجعة من قبل لجنة التمويل.",
    actionRequired: false,
  },
  application_approved: {
    icon: "🎉",
    bgColor: "#d1fae5",
    textColor: "#065f46",
    gradientFrom: "#059669",
    gradientTo: "#10b981",
    titleAr: "تمت الموافقة على طلب التمويل!",
    messageAr: "مبروك! تمت الموافقة على طلب التمويل الخاص بكم. يمكنكم الآن اختيار العرض المناسب.",
    actionRequired: true,
  },
  application_rejected: {
    icon: "❌",
    bgColor: "#fee2e2",
    textColor: "#991b1b",
    gradientFrom: "#dc2626",
    gradientTo: "#ef4444",
    titleAr: "تم رفض طلب التمويل",
    messageAr: "نعتذر، لم تتم الموافقة على طلب التمويل في الوقت الحالي. يمكنكم التواصل معنا لمزيد من التفاصيل.",
    actionRequired: false,
  },
  offer_generated: {
    icon: "💰",
    bgColor: "#dbeafe",
    textColor: "#1e40af",
    gradientFrom: "#1e40af",
    gradientTo: "#3b82f6",
    titleAr: "عروض التمويل جاهزة",
    messageAr: "تم إعداد عروض التمويل المخصصة لكم. يرجى مراجعة العروض واختيار الأنسب.",
    actionRequired: true,
  },
  offer_selected: {
    icon: "✅",
    bgColor: "#d1fae5",
    textColor: "#065f46",
    gradientFrom: "#059669",
    gradientTo: "#10b981",
    titleAr: "تم اختيار عرض التمويل",
    messageAr: "تم تسجيل اختياركم لعرض التمويل. سيتم إعداد العقد للتوقيع.",
    actionRequired: false,
  },
  contract_ready: {
    icon: "📄",
    bgColor: "#e0e7ff",
    textColor: "#3730a3",
    gradientFrom: "#4f46e5",
    gradientTo: "#6366f1",
    titleAr: "عقد التمويل جاهز للتوقيع",
    messageAr: "عقد التمويل الخاص بكم جاهز. يرجى مراجعته والتوقيع إلكترونياً.",
    actionRequired: true,
  },
  contract_signed: {
    icon: "🖊️",
    bgColor: "#d1fae5",
    textColor: "#065f46",
    gradientFrom: "#059669",
    gradientTo: "#10b981",
    titleAr: "تم توقيع عقد التمويل",
    messageAr: "تم توقيع عقد التمويل بنجاح. جاري معالجة طلب الصرف.",
    actionRequired: false,
  },
  disbursed: {
    icon: "💸",
    bgColor: "#d1fae5",
    textColor: "#065f46",
    gradientFrom: "#059669",
    gradientTo: "#10b981",
    titleAr: "تم صرف مبلغ التمويل!",
    messageAr: "تم صرف مبلغ التمويل وإيداعه في محفظتكم. يمكنكم استخدامه الآن.",
    actionRequired: false,
  },
  payment_due: {
    icon: "📅",
    bgColor: "#fef3c7",
    textColor: "#92400e",
    gradientFrom: "#d97706",
    gradientTo: "#f59e0b",
    titleAr: "موعد سداد القسط",
    messageAr: "يحين موعد سداد القسط الشهري قريباً. يرجى التأكد من توفر الرصيد.",
    actionRequired: true,
  },
  payment_reminder: {
    icon: "⏰",
    bgColor: "#fed7aa",
    textColor: "#c2410c",
    gradientFrom: "#ea580c",
    gradientTo: "#f97316",
    titleAr: "تذكير بموعد السداد",
    messageAr: "نذكركم بموعد سداد القسط المستحق. يرجى السداد في الموعد لتجنب الغرامات.",
    actionRequired: true,
  },
  payment_received: {
    icon: "✅",
    bgColor: "#d1fae5",
    textColor: "#065f46",
    gradientFrom: "#059669",
    gradientTo: "#10b981",
    titleAr: "تم استلام السداد",
    messageAr: "شكراً لكم! تم استلام سداد القسط بنجاح.",
    actionRequired: false,
  },
  payment_overdue: {
    icon: "🚨",
    bgColor: "#fee2e2",
    textColor: "#991b1b",
    gradientFrom: "#dc2626",
    gradientTo: "#ef4444",
    titleAr: "قسط متأخر السداد",
    messageAr: "لديكم قسط متأخر السداد. يرجى السداد فوراً لتجنب الإجراءات القانونية.",
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

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatCurrency = (amount: number, currency = 'SAR') => {
  return `${amount.toLocaleString('ar-SA')} ${currency}`;
};

const getCustomerEmailTemplate = (data: FinanceNotificationRequest) => {
  const config = EVENT_CONFIG[data.event];
  
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>إشعار التمويل</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background: #f8fafc; direction: rtl; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo}); color: white; padding: 32px; text-align: center; }
    .logo { font-size: 24px; font-weight: 800; letter-spacing: 2px; }
    .content { padding: 32px; }
    .event-card { background: ${config.bgColor}; border-radius: 20px; padding: 32px; text-align: center; margin: 24px 0; ${config.actionRequired ? 'border: 2px dashed ' + config.textColor + ';' : ''} }
    .event-icon { font-size: 64px; margin-bottom: 16px; }
    .event-title { font-size: 24px; font-weight: 700; color: ${config.textColor}; margin-bottom: 12px; }
    .event-message { color: ${config.textColor}; opacity: 0.9; font-size: 15px; line-height: 1.7; }
    .finance-summary { background: linear-gradient(135deg, #0f172a, #1e293b); border-radius: 16px; padding: 24px; margin: 24px 0; color: white; }
    .summary-row { display: flex; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .summary-row:last-child { border-bottom: none; }
    .summary-label { opacity: 0.7; font-size: 14px; }
    .summary-value { font-weight: 600; font-size: 16px; }
    .amount-highlight { background: linear-gradient(135deg, #059669, #10b981); border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
    .amount-big { font-size: 36px; font-weight: 800; color: white; }
    .amount-label { color: rgba(255,255,255,0.8); font-size: 14px; margin-top: 4px; }
    .installment-info { background: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .progress-bar { background: #e2e8f0; height: 12px; border-radius: 10px; overflow: hidden; margin: 16px 0; }
    .progress-fill { background: linear-gradient(90deg, #3b82f6, #10b981); height: 100%; border-radius: 10px; }
    .action-box { background: linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo}); border-radius: 16px; padding: 28px; text-align: center; margin: 24px 0; }
    .btn { display: inline-block; background: white; color: ${config.gradientFrom} !important; padding: 16px 36px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; }
    .rejection-box { background: #fee2e2; border: 1px solid #fca5a5; border-radius: 12px; padding: 20px; margin: 24px 0; }
    .wallet-badge { background: #d1fae5; border: 2px solid #10b981; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .footer { background: #0f172a; color: #94a3b8; padding: 24px; text-align: center; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">ASH HOLDING</div>
      <p style="opacity: 0.8; margin-top: 8px;">خدمات التمويل</p>
    </div>
    
    <div class="content">
      <p style="font-size: 16px; color: #475569; margin-bottom: 24px;">
        مرحباً <strong>${data.customerName}</strong>،
      </p>
      
      <div class="event-card">
        <div class="event-icon">${config.icon}</div>
        <div class="event-title">${config.titleAr}</div>
        <div class="event-message">${config.messageAr}</div>
      </div>
      
      ${data.applicationNumber || data.contractNumber ? `
      <div class="finance-summary">
        <h3 style="margin-bottom: 16px; font-size: 18px;">📊 تفاصيل التمويل</h3>
        
        ${data.applicationNumber ? `
        <div class="summary-row">
          <span class="summary-label">رقم الطلب</span>
          <span class="summary-value" style="font-family: monospace;">${data.applicationNumber}</span>
        </div>
        ` : ''}
        
        ${data.contractNumber ? `
        <div class="summary-row">
          <span class="summary-label">رقم العقد</span>
          <span class="summary-value" style="font-family: monospace;">${data.contractNumber}</span>
        </div>
        ` : ''}
        
        ${data.amount ? `
        <div class="summary-row">
          <span class="summary-label">مبلغ التمويل</span>
          <span class="summary-value" style="color: #10b981;">${formatCurrency(data.amount, data.currency)}</span>
        </div>
        ` : ''}
        
        ${data.tenorMonths ? `
        <div class="summary-row">
          <span class="summary-label">مدة التمويل</span>
          <span class="summary-value">${data.tenorMonths} شهر</span>
        </div>
        ` : ''}
        
        ${data.aprPercent ? `
        <div class="summary-row">
          <span class="summary-label">معدل النسبة السنوي</span>
          <span class="summary-value">${data.aprPercent}%</span>
        </div>
        ` : ''}
        
        ${data.monthlyPayment ? `
        <div class="summary-row">
          <span class="summary-label">القسط الشهري</span>
          <span class="summary-value" style="color: #fbbf24;">${formatCurrency(data.monthlyPayment, data.currency)}</span>
        </div>
        ` : ''}
        
        ${data.totalPayable ? `
        <div class="summary-row">
          <span class="summary-label">إجمالي السداد</span>
          <span class="summary-value">${formatCurrency(data.totalPayable, data.currency)}</span>
        </div>
        ` : ''}
      </div>
      ` : ''}
      
      ${data.event === 'disbursed' && data.amount ? `
      <div class="wallet-badge">
        <span style="font-size: 48px;">💰</span>
        <h3 style="color: #065f46; margin: 12px 0;">تم إيداع المبلغ في محفظتك</h3>
        <div style="font-size: 32px; font-weight: 800; color: #059669;">${formatCurrency(data.amount, data.currency)}</div>
      </div>
      ` : ''}
      
      ${(data.event === 'payment_due' || data.event === 'payment_reminder' || data.event === 'payment_overdue') && data.installmentNo && data.totalInstallments ? `
      <div class="installment-info">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="color: #64748b;">القسط رقم</span>
          <span style="font-weight: 700; color: #0f172a;">${data.installmentNo} من ${data.totalInstallments}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${((data.installmentNo - 1) / data.totalInstallments) * 100}%;"></div>
        </div>
        ${data.dueDate ? `
        <div style="text-align: center; margin-top: 16px; padding: 12px; background: ${data.event === 'payment_overdue' ? '#fee2e2' : '#fef3c7'}; border-radius: 8px;">
          <span style="color: ${data.event === 'payment_overdue' ? '#991b1b' : '#92400e'}; font-weight: 600;">
            ${data.event === 'payment_overdue' ? '⚠️ كان موعد السداد: ' : '📅 موعد السداد: '}
            ${formatDate(data.dueDate)}
          </span>
        </div>
        ` : ''}
      </div>
      ` : ''}
      
      ${data.event === 'payment_received' && data.monthlyPayment ? `
      <div class="amount-highlight">
        <div class="amount-big">${formatCurrency(data.monthlyPayment, data.currency)}</div>
        <div class="amount-label">تم استلامها بنجاح</div>
        ${data.paidAt ? `<div style="margin-top: 8px; opacity: 0.8;">${formatDate(data.paidAt)}</div>` : ''}
      </div>
      ` : ''}
      
      ${data.rejectionReason ? `
      <div class="rejection-box">
        <h4 style="color: #991b1b; margin-bottom: 8px;">❌ سبب الرفض:</h4>
        <p style="color: #7f1d1d;">${data.rejectionReason}</p>
      </div>
      ` : ''}
      
      ${config.actionRequired ? `
      <div class="action-box">
        <p style="color: white; margin-bottom: 16px; font-size: 15px;">⚡ إجراء مطلوب منكم</p>
        <a href="https://alsaleh-holding-identity.lovable.app/app/finance" class="btn">
          ${data.event === 'application_approved' || data.event === 'offer_generated' ? 'اختيار العرض' : ''}
          ${data.event === 'contract_ready' ? 'توقيع العقد' : ''}
          ${data.event === 'payment_due' || data.event === 'payment_reminder' || data.event === 'payment_overdue' ? 'سداد القسط' : ''}
        </a>
      </div>
      ` : `
      <div style="text-align: center; margin: 24px 0;">
        <a href="https://alsaleh-holding-identity.lovable.app/app/finance" style="display: inline-block; background: linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo}); color: white !important; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600;">متابعة طلبي</a>
      </div>
      `}
      
      <div style="text-align: center; color: #64748b; font-size: 14px; margin-top: 32px;">
        <p>هل لديك استفسار حول التمويل؟</p>
        <p style="margin-top: 8px;">📧 ${BRAND.email} | 📱 ${BRAND.phone}</p>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>${BRAND.nameAr}</strong></p>
      <p style="margin-top: 4px;">خدمات التمويل</p>
      <p style="margin-top: 8px;">© ${new Date().getFullYear()} جميع الحقوق محفوظة</p>
    </div>
  </div>
</body>
</html>
`;
};

const getAdminEmailTemplate = (data: FinanceNotificationRequest) => {
  const config = EVENT_CONFIG[data.event];
  const isActionRequired = ['application_submitted', 'contract_signed', 'payment_overdue'].includes(data.event);
  
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>إشعار التمويل للإدارة</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background: #f8fafc; direction: rtl; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: ${isActionRequired ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`}; color: white; padding: 24px; text-align: center; }
    .badge { background: #fbbf24; color: #78350f; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block; margin-bottom: 12px; }
    .content { padding: 24px; }
    .status-card { background: ${config.bgColor}; border-radius: 12px; padding: 20px; text-align: center; margin: 16px 0; }
    .amount-display { background: #f8fafc; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
    .amount { font-size: 28px; font-weight: 700; color: #0f172a; }
    .info-grid { display: grid; gap: 12px; margin: 20px 0; }
    .info-item { background: #f8fafc; padding: 14px; border-radius: 10px; border-right: 3px solid #3b82f6; }
    .info-label { font-size: 11px; color: #64748b; text-transform: uppercase; }
    .info-value { font-size: 15px; font-weight: 600; color: #0f172a; margin-top: 4px; }
    .risk-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .risk-low { background: #d1fae5; color: #065f46; }
    .risk-medium { background: #fef3c7; color: #92400e; }
    .risk-high { background: #fee2e2; color: #991b1b; }
    .action-box { background: #fef3c7; border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
    .btn { display: inline-block; background: #3b82f6; color: white !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 4px; }
    .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">${config.icon} ${isActionRequired ? 'إجراء مطلوب' : 'إشعار تمويل'}</span>
      <h2>${config.titleAr}</h2>
    </div>
    
    <div class="content">
      <div class="status-card">
        <span style="font-size: 32px;">${config.icon}</span>
        <p style="color: ${config.textColor}; font-weight: 600; margin-top: 8px;">${config.titleAr}</p>
      </div>
      
      ${data.amount ? `
      <div class="amount-display">
        <div style="color: #64748b; font-size: 14px;">مبلغ التمويل</div>
        <div class="amount">${formatCurrency(data.amount, data.currency)}</div>
      </div>
      ` : ''}
      
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">العميل</div>
          <div class="info-value">${data.customerName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">البريد الإلكتروني</div>
          <div class="info-value">${data.customerEmail}</div>
        </div>
        ${data.applicationNumber ? `
        <div class="info-item">
          <div class="info-label">رقم الطلب</div>
          <div class="info-value" style="font-family: monospace;">${data.applicationNumber}</div>
        </div>
        ` : ''}
        ${data.contractNumber ? `
        <div class="info-item">
          <div class="info-label">رقم العقد</div>
          <div class="info-value" style="font-family: monospace;">${data.contractNumber}</div>
        </div>
        ` : ''}
        ${data.riskLevel ? `
        <div class="info-item">
          <div class="info-label">مستوى المخاطر</div>
          <div class="info-value">
            <span class="risk-badge risk-${data.riskLevel.toLowerCase()}">${data.riskLevel === 'low' ? 'منخفض' : data.riskLevel === 'medium' ? 'متوسط' : 'عالي'}</span>
          </div>
        </div>
        ` : ''}
        ${data.tenorMonths ? `
        <div class="info-item">
          <div class="info-label">مدة التمويل</div>
          <div class="info-value">${data.tenorMonths} شهر</div>
        </div>
        ` : ''}
      </div>
      
      ${isActionRequired ? `
      <div class="action-box">
        <h4 style="color: #92400e; margin-bottom: 12px;">⚡ إجراء مطلوب</h4>
        <p style="color: #78350f; margin-bottom: 16px;">
          ${data.event === 'application_submitted' ? 'يرجى مراجعة طلب التمويل وتقييم المخاطر' : ''}
          ${data.event === 'contract_signed' ? 'يرجى الموافقة على العقد وصرف المبلغ' : ''}
          ${data.event === 'payment_overdue' ? 'يرجى متابعة العميل بخصوص القسط المتأخر' : ''}
        </p>
        <a href="https://alsaleh-holding-identity.lovable.app/admin/finance-internal" class="btn">إدارة التمويل</a>
      </div>
      ` : `
      <div style="text-align: center; margin: 24px 0;">
        <a href="https://alsaleh-holding-identity.lovable.app/admin/finance-internal" class="btn">إدارة التمويل</a>
      </div>
      `}
    </div>
    
    <div class="footer">
      <p>نظام إدارة التمويل - ${BRAND.nameAr}</p>
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
    const data: FinanceNotificationRequest = await req.json();
    const config = EVENT_CONFIG[data.event];
    const results: any[] = [];

    // Send to customer
    const customerEmail = await resend.emails.send({
      from: `خدمات التمويل - ${BRAND.name} <${BRAND.email}>`,
      to: [data.customerEmail],
      bcc: [BRAND.email],
      subject: `${config.icon} ${config.titleAr}${data.applicationNumber ? ` - ${data.applicationNumber}` : ''}${data.contractNumber ? ` - ${data.contractNumber}` : ''}`,
      html: getCustomerEmailTemplate(data),
    });
    results.push({ type: 'customer', ...customerEmail });

    // Send to admin
    if (data.sendToAdmin !== false) {
      const adminEmail = await resend.emails.send({
        from: `نظام التمويل <${BRAND.email}>`,
        to: [BRAND.email],
        subject: `${config.icon} ${config.titleAr} | ${data.customerName}${data.amount ? ` | ${formatCurrency(data.amount, data.currency)}` : ''}`,
        html: getAdminEmailTemplate(data),
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
