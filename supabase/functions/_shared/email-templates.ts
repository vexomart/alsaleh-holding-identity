/**
 * ASH HOLDING - Professional Email Templates
 * قوالب البريد الإلكتروني الاحترافية
 * Full RTL Support + Gmail/Outlook Compatible
 */

// ============================================
// 1) BRAND IDENTITY & CONSTANTS
// ============================================
export const BRAND = {
  name: "ASH Holding",
  nameAr: "شركة علي صالح الشهري القابضة",
  fromEmail: "info@ash-holding.sa",
  fromName: "ASH Holding",
  phone: "0555812567",
  website: "https://ash-holding.sa",
  websiteDisplay: "ash-holding.sa",
  address: "الرياض، المملكة العربية السعودية",
  supportEmail: "support@ash-holding.sa",
  colors: {
    primary: "#1e3a8a",
    primaryDark: "#0f172a",
    accent: "#3b82f6",
    success: "#059669",
    warning: "#f59e0b",
    error: "#dc2626",
    textDark: "#0f172a",
    textMuted: "#64748b",
    border: "#e2e8f0",
    bgLight: "#f8fafc",
    bgCard: "#f1f5f9",
  },
};

// Status colors for all modules
export const STATUS_COLORS: Record<string, { bg: string; text: string; border: string; labelAr: string; labelEn: string }> = {
  // Order statuses
  pending: { bg: "#fef3c7", text: "#92400e", border: "#f59e0b", labelAr: "قيد الانتظار", labelEn: "Pending" },
  confirmed: { bg: "#dbeafe", text: "#1e40af", border: "#3b82f6", labelAr: "مؤكد", labelEn: "Confirmed" },
  processing: { bg: "#e0e7ff", text: "#3730a3", border: "#6366f1", labelAr: "قيد التنفيذ", labelEn: "Processing" },
  completed: { bg: "#d1fae5", text: "#065f46", border: "#10b981", labelAr: "مكتمل", labelEn: "Completed" },
  cancelled: { bg: "#fee2e2", text: "#991b1b", border: "#ef4444", labelAr: "ملغي", labelEn: "Cancelled" },
  refunded: { bg: "#fce7f3", text: "#9d174d", border: "#ec4899", labelAr: "مسترد", labelEn: "Refunded" },
  rejected: { bg: "#fee2e2", text: "#991b1b", border: "#ef4444", labelAr: "مرفوض", labelEn: "Rejected" },
  
  // Contract statuses
  draft: { bg: "#f3f4f6", text: "#374151", border: "#9ca3af", labelAr: "مسودة", labelEn: "Draft" },
  pending_signature: { bg: "#dbeafe", text: "#1e40af", border: "#3b82f6", labelAr: "بانتظار التوقيع", labelEn: "Pending Signature" },
  signed: { bg: "#d1fae5", text: "#065f46", border: "#10b981", labelAr: "موقّع", labelEn: "Signed" },
  active: { bg: "#d1fae5", text: "#065f46", border: "#10b981", labelAr: "نشط", labelEn: "Active" },
  
  // Invoice statuses
  issued: { bg: "#dbeafe", text: "#1e40af", border: "#3b82f6", labelAr: "صادرة", labelEn: "Issued" },
  paid: { bg: "#d1fae5", text: "#065f46", border: "#10b981", labelAr: "مدفوعة", labelEn: "Paid" },
  overdue: { bg: "#fee2e2", text: "#991b1b", border: "#ef4444", labelAr: "متأخرة", labelEn: "Overdue" },
  
  // Finance statuses
  submitted: { bg: "#dbeafe", text: "#1e40af", border: "#3b82f6", labelAr: "مُقدّم", labelEn: "Submitted" },
  under_review: { bg: "#fef3c7", text: "#92400e", border: "#f59e0b", labelAr: "قيد المراجعة", labelEn: "Under Review" },
  approved: { bg: "#d1fae5", text: "#065f46", border: "#10b981", labelAr: "تمت الموافقة", labelEn: "Approved" },
  disbursed: { bg: "#d1fae5", text: "#065f46", border: "#10b981", labelAr: "تم الصرف", labelEn: "Disbursed" },
};

// ============================================
// 2) UTILITY FUNCTIONS
// ============================================

export const formatCurrency = (amount: number | string, currency = "ريال"): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `${num.toLocaleString("ar-SA")} ${currency}`;
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getStatusInfo = (status: string) => {
  return STATUS_COLORS[status] || STATUS_COLORS.pending;
};

// ============================================
// 3) BASE EMAIL WRAPPER (RTL + Table-based)
// ============================================

export const emailWrapper = (content: string): string => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="rtl" lang="ar">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>ASH Holding</title>
  <!--[if mso]>
  <style type="text/css">
    table { border-collapse: collapse; }
    .button { padding: 14px 28px !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Tahoma, Arial, sans-serif; direction: rtl; text-align: right;">
  
  <!-- Outer Container -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9;">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        
        <!-- Email Container (max 600px) -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${BRAND.colors.primaryDark} 0%, ${BRAND.colors.primary} 100%); padding: 32px 24px; text-align: center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: 1px; font-family: 'Segoe UI', Tahoma, Arial, sans-serif;">
                      ASH HOLDING
                    </h1>
                    <p style="margin: 8px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.85); font-family: 'Segoe UI', Tahoma, Arial, sans-serif;">
                      ${BRAND.nameAr}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content Area -->
          <tr>
            <td style="padding: 0;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: ${BRAND.colors.primaryDark}; padding: 28px 24px; text-align: center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 12px 0; font-size: 15px; font-weight: 600; color: #ffffff;">
                      ${BRAND.nameAr}
                    </p>
                    <p style="margin: 0 0 8px 0; font-size: 13px; color: #94a3b8;">
                      📧 ${BRAND.fromEmail} &nbsp;|&nbsp; 📱 ${BRAND.phone}
                    </p>
                    <p style="margin: 0 0 16px 0; font-size: 13px; color: #94a3b8;">
                      🌐 <a href="${BRAND.website}" style="color: #60a5fa; text-decoration: none;">${BRAND.websiteDisplay}</a>
                    </p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                      <tr>
                        <td style="padding: 0 8px;">
                          <p style="margin: 0; font-size: 11px; color: #64748b;">
                            هذه الرسالة تم إرسالها تلقائياً، يُرجى عدم الرد عليها
                          </p>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 16px 0 0 0; font-size: 11px; color: #475569;">
                      © ${new Date().getFullYear()} ${BRAND.name}. جميع الحقوق محفوظة.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
`;

// ============================================
// 4) REUSABLE COMPONENTS
// ============================================

// Section Title
export const sectionTitle = (title: string, icon?: string): string => `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
  <tr>
    <td style="padding: 24px 24px 16px 24px;">
      <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: ${BRAND.colors.textDark}; font-family: 'Segoe UI', Tahoma, Arial, sans-serif;">
        ${icon ? icon + ' ' : ''}${title}
      </h2>
    </td>
  </tr>
</table>
`;

// Greeting
export const greeting = (name: string, message: string): string => `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
  <tr>
    <td style="padding: 28px 24px 8px 24px;">
      <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: ${BRAND.colors.textDark};">
        مرحباً ${name}،
      </p>
      <p style="margin: 0; font-size: 15px; color: ${BRAND.colors.textMuted}; line-height: 1.7;">
        ${message}
      </p>
    </td>
  </tr>
</table>
`;

// Info Card
export const infoCard = (rows: Array<{ label: string; value: string }>): string => `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
  <tr>
    <td style="padding: 0 24px 16px 24px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${BRAND.colors.bgCard}; border-radius: 12px; border-right: 4px solid ${BRAND.colors.accent};">
        ${rows.map((row, index) => `
        <tr>
          <td style="padding: 14px 16px; border-bottom: ${index < rows.length - 1 ? '1px solid ' + BRAND.colors.border : 'none'};">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="font-size: 13px; color: ${BRAND.colors.textMuted}; width: 40%;">
                  ${row.label}
                </td>
                <td style="font-size: 14px; font-weight: 600; color: ${BRAND.colors.textDark}; text-align: left; direction: ltr;">
                  ${row.value}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        `).join('')}
      </table>
    </td>
  </tr>
</table>
`;

// Status Badge
export const statusBadge = (status: string): string => {
  const info = getStatusInfo(status);
  return `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
  <tr>
    <td style="background-color: ${info.bg}; color: ${info.text}; padding: 8px 20px; border-radius: 50px; font-size: 14px; font-weight: 600; border: 2px solid ${info.border};">
      ${info.labelAr}
    </td>
  </tr>
</table>
`;
};

// Primary CTA Button
export const ctaButton = (text: string, url: string, variant: 'primary' | 'success' | 'warning' = 'primary'): string => {
  const colors = {
    primary: { from: BRAND.colors.accent, to: BRAND.colors.primary },
    success: { from: '#10b981', to: BRAND.colors.success },
    warning: { from: '#fbbf24', to: BRAND.colors.warning },
  };
  const c = colors[variant];
  return `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
  <tr>
    <td align="center" style="padding: 24px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="background: linear-gradient(135deg, ${c.from} 0%, ${c.to} 100%); border-radius: 10px;">
            <a href="${url}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; font-family: 'Segoe UI', Tahoma, Arial, sans-serif;">
              ${text} ←
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;
};

// Highlight Box (Amount, Important Info)
export const highlightBox = (content: string, variant: 'success' | 'info' | 'warning' | 'error' = 'info'): string => {
  const styles = {
    success: { bg: '#d1fae5', border: '#10b981', text: '#065f46' },
    info: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
    warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
    error: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' },
  };
  const s = styles[variant];
  return `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
  <tr>
    <td style="padding: 0 24px 16px 24px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${s.bg}; border-radius: 12px; border: 1px solid ${s.border};">
        <tr>
          <td style="padding: 16px 20px; text-align: center;">
            <p style="margin: 0; font-size: 15px; color: ${s.text}; line-height: 1.6;">
              ${content}
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;
};

// Amount Display
export const amountDisplay = (amount: number | string, label: string = 'المبلغ الإجمالي'): string => {
  const formattedAmount = formatCurrency(amount);
  return `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
  <tr>
    <td style="padding: 0 24px 20px 24px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, ${BRAND.colors.success} 0%, #10b981 100%); border-radius: 12px;">
        <tr>
          <td style="padding: 24px; text-align: center;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: rgba(255,255,255,0.9);">
              ${label}
            </p>
            <p style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff; direction: ltr;">
              ${formattedAmount}
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;
};

// OTP Code Display
export const otpDisplay = (code: string): string => `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
  <tr>
    <td style="padding: 16px 24px 24px 24px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${BRAND.colors.bgCard}; border-radius: 12px; border: 2px dashed ${BRAND.colors.accent};">
        <tr>
          <td style="padding: 24px; text-align: center;">
            <p style="margin: 0 0 12px 0; font-size: 13px; color: ${BRAND.colors.textMuted};">
              رمز التحقق الخاص بك
            </p>
            <p style="margin: 0; font-size: 36px; font-weight: 800; color: ${BRAND.colors.primary}; letter-spacing: 8px; font-family: 'Courier New', monospace; direction: ltr;">
              ${code}
            </p>
            <p style="margin: 12px 0 0 0; font-size: 12px; color: ${BRAND.colors.textMuted};">
              صالح لمدة 10 دقائق فقط
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;

// Divider
export const divider = (): string => `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
  <tr>
    <td style="padding: 8px 24px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="border-top: 1px solid ${BRAND.colors.border};"></td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;

// Security Notice
export const securityNotice = (message: string = 'إذا لم تقم بطلب هذا الإجراء، يُرجى تجاهل هذه الرسالة أو التواصل مع فريق الدعم فوراً.'): string => `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
  <tr>
    <td style="padding: 0 24px 24px 24px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fef3c7; border-radius: 8px; border-right: 3px solid #f59e0b;">
        <tr>
          <td style="padding: 12px 16px;">
            <p style="margin: 0; font-size: 12px; color: #92400e; line-height: 1.6;">
              🔒 <strong>ملاحظة أمان:</strong> ${message}
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;

// ============================================
// 5) EMAIL TEMPLATES
// ============================================

// A) Welcome / Account Activation Email
export const welcomeEmail = (data: {
  customerName: string;
  email: string;
  activationLink?: string;
}): string => {
  const content = `
    ${greeting(data.customerName, 'يسعدنا انضمامك إلى عائلة ASH Holding! حسابك جاهز الآن للاستخدام.')}
    
    ${sectionTitle('تفاصيل حسابك', '👤')}
    
    ${infoCard([
      { label: 'الاسم', value: data.customerName },
      { label: 'البريد الإلكتروني', value: data.email },
      { label: 'تاريخ التسجيل', value: formatDate(new Date()) },
    ])}
    
    ${highlightBox('✨ مرحباً بك في منصتنا! يمكنك الآن الوصول إلى جميع خدماتنا المميزة وإدارة طلباتك بكل سهولة.', 'success')}
    
    ${data.activationLink ? ctaButton('تفعيل الحساب', data.activationLink, 'success') : ctaButton('الدخول إلى حسابي', BRAND.website + '/login', 'primary')}
    
    ${divider()}
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding: 0 24px 24px 24px;">
          <p style="margin: 0; font-size: 14px; color: ${BRAND.colors.textMuted}; line-height: 1.7;">
            نحن هنا لمساعدتك! إذا كان لديك أي استفسار، لا تتردد في التواصل معنا عبر 
            <a href="mailto:${BRAND.supportEmail}" style="color: ${BRAND.colors.accent};">${BRAND.supportEmail}</a>
          </p>
        </td>
      </tr>
    </table>
  `;
  return emailWrapper(content);
};

// B) Email Verification / OTP Email
export const verificationEmail = (data: {
  customerName: string;
  otpCode: string;
  purpose?: string;
}): string => {
  const content = `
    ${greeting(data.customerName, data.purpose || 'لقد طلبت رمز تحقق للمتابعة. يُرجى استخدام الرمز أدناه:')}
    
    ${otpDisplay(data.otpCode)}
    
    ${highlightBox('⏰ هذا الرمز صالح لمدة 10 دقائق فقط. لا تشاركه مع أي شخص.', 'warning')}
    
    ${securityNotice()}
  `;
  return emailWrapper(content);
};

// C) New Order Created Email
export const newOrderEmail = (data: {
  customerName: string;
  orderNumber: string;
  orderTitle: string;
  amount: number | string;
  serviceName?: string;
  orderDate: string | Date;
  viewOrderLink: string;
}): string => {
  const content = `
    ${greeting(data.customerName, 'تم استلام طلبك بنجاح! نحن نعمل على معالجته في أسرع وقت ممكن.')}
    
    ${sectionTitle('تفاصيل الطلب', '📋')}
    
    ${infoCard([
      { label: 'رقم الطلب', value: data.orderNumber },
      { label: 'عنوان الطلب', value: data.orderTitle },
      ...(data.serviceName ? [{ label: 'الخدمة', value: data.serviceName }] : []),
      { label: 'تاريخ الطلب', value: formatDateTime(data.orderDate) },
    ])}
    
    ${amountDisplay(data.amount, 'قيمة الطلب')}
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding: 0 24px 8px 24px; text-align: center;">
          ${statusBadge('pending')}
        </td>
      </tr>
    </table>
    
    ${ctaButton('عرض تفاصيل الطلب', data.viewOrderLink)}
    
    ${highlightBox('📞 سيتواصل معك أحد ممثلينا قريباً لتأكيد التفاصيل.', 'info')}
  `;
  return emailWrapper(content);
};

// D) Order Status Update Email
export const orderStatusEmail = (data: {
  customerName: string;
  orderNumber: string;
  orderTitle: string;
  oldStatus?: string;
  newStatus: string;
  statusMessage?: string;
  viewOrderLink: string;
}): string => {
  const statusInfo = getStatusInfo(data.newStatus);
  const statusMessages: Record<string, string> = {
    processing: 'طلبك قيد التنفيذ حالياً. فريقنا يعمل على إنجازه.',
    completed: 'تم إنجاز طلبك بنجاح! شكراً لثقتك بنا.',
    cancelled: 'تم إلغاء طلبك. إذا كان لديك أي استفسار، يُرجى التواصل معنا.',
    refunded: 'تم استرداد المبلغ إلى حسابك. قد يستغرق ظهوره 3-5 أيام عمل.',
    confirmed: 'تم تأكيد طلبك وسيتم البدء في معالجته قريباً.',
    rejected: 'للأسف، لم يتم قبول طلبك. يُرجى التواصل معنا لمزيد من التفاصيل.',
  };
  
  const message = data.statusMessage || statusMessages[data.newStatus] || 'تم تحديث حالة طلبك.';
  const variant = ['completed', 'confirmed'].includes(data.newStatus) ? 'success' : 
                  ['cancelled', 'rejected'].includes(data.newStatus) ? 'error' : 'info';
  
  const content = `
    ${greeting(data.customerName, 'نود إعلامك بتحديث على طلبك:')}
    
    ${sectionTitle('تحديث حالة الطلب', '🔔')}
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding: 0 24px 16px 24px; text-align: center;">
          ${statusBadge(data.newStatus)}
        </td>
      </tr>
    </table>
    
    ${infoCard([
      { label: 'رقم الطلب', value: data.orderNumber },
      { label: 'عنوان الطلب', value: data.orderTitle },
      { label: 'الحالة الجديدة', value: statusInfo.labelAr },
    ])}
    
    ${highlightBox(message, variant as any)}
    
    ${ctaButton('عرض الطلب', data.viewOrderLink)}
  `;
  return emailWrapper(content);
};

// E) New Invoice Email
export const newInvoiceEmail = (data: {
  customerName: string;
  invoiceNumber: string;
  amount: number | string;
  dueDate?: string | Date;
  items?: Array<{ name: string; amount: number }>;
  viewInvoiceLink: string;
  paymentLink?: string;
}): string => {
  const content = `
    ${greeting(data.customerName, 'تم إصدار فاتورة جديدة لحسابك. يُرجى مراجعة التفاصيل أدناه:')}
    
    ${sectionTitle('تفاصيل الفاتورة', '🧾')}
    
    ${infoCard([
      { label: 'رقم الفاتورة', value: data.invoiceNumber },
      { label: 'تاريخ الإصدار', value: formatDate(new Date()) },
      ...(data.dueDate ? [{ label: 'تاريخ الاستحقاق', value: formatDate(data.dueDate) }] : []),
    ])}
    
    ${amountDisplay(data.amount, 'المبلغ المستحق')}
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding: 0 24px 8px 24px; text-align: center;">
          ${statusBadge('issued')}
        </td>
      </tr>
    </table>
    
    ${data.paymentLink ? 
      ctaButton('الدفع الآن', data.paymentLink, 'success') : 
      ctaButton('عرض الفاتورة', data.viewInvoiceLink)}
    
    ${highlightBox('💳 يمكنك الدفع عبر التحويل البنكي أو البطاقة الائتمانية.', 'info')}
  `;
  return emailWrapper(content);
};

// F) Payment Confirmation Email
export const paymentConfirmationEmail = (data: {
  customerName: string;
  invoiceNumber?: string;
  transactionId: string;
  amount: number | string;
  paymentMethod?: string;
  paymentDate: string | Date;
  viewReceiptLink?: string;
}): string => {
  const content = `
    ${greeting(data.customerName, 'تم استلام دفعتك بنجاح! شكراً لك.')}
    
    ${sectionTitle('تأكيد الدفع', '✅')}
    
    ${amountDisplay(data.amount, 'المبلغ المدفوع')}
    
    ${infoCard([
      { label: 'رقم العملية', value: data.transactionId },
      ...(data.invoiceNumber ? [{ label: 'رقم الفاتورة', value: data.invoiceNumber }] : []),
      { label: 'تاريخ الدفع', value: formatDateTime(data.paymentDate) },
      ...(data.paymentMethod ? [{ label: 'طريقة الدفع', value: data.paymentMethod }] : []),
    ])}
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding: 0 24px 8px 24px; text-align: center;">
          ${statusBadge('paid')}
        </td>
      </tr>
    </table>
    
    ${highlightBox('🎉 شكراً لثقتك بنا! تم تسجيل دفعتك بنجاح في سجلاتنا.', 'success')}
    
    ${data.viewReceiptLink ? ctaButton('تحميل الإيصال', data.viewReceiptLink, 'primary') : ''}
  `;
  return emailWrapper(content);
};

// G) Password Reset Email
export const passwordResetEmail = (data: {
  customerName: string;
  resetLink: string;
  expiresIn?: string;
}): string => {
  const content = `
    ${greeting(data.customerName, 'تلقينا طلباً لإعادة تعيين كلمة مرور حسابك.')}
    
    ${sectionTitle('إعادة تعيين كلمة المرور', '🔑')}
    
    ${highlightBox('انقر على الزر أدناه لإنشاء كلمة مرور جديدة. الرابط صالح لمدة ${data.expiresIn || "ساعة واحدة"} فقط.', 'warning')}
    
    ${ctaButton('إعادة تعيين كلمة المرور', data.resetLink, 'primary')}
    
    ${divider()}
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding: 0 24px 8px 24px;">
          <p style="margin: 0; font-size: 13px; color: ${BRAND.colors.textMuted}; line-height: 1.6;">
            إذا لم يعمل الزر، انسخ الرابط التالي والصقه في متصفحك:
          </p>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: ${BRAND.colors.accent}; word-break: break-all; direction: ltr; text-align: left;">
            ${data.resetLink}
          </p>
        </td>
      </tr>
    </table>
    
    ${securityNotice('إذا لم تطلب إعادة تعيين كلمة المرور، يُرجى تجاهل هذه الرسالة. حسابك آمن.')}
  `;
  return emailWrapper(content);
};

// H) Support Ticket Email
export const supportTicketEmail = (data: {
  customerName: string;
  ticketNumber: string;
  subject: string;
  message?: string;
  status?: string;
  isReply?: boolean;
  replyMessage?: string;
  viewTicketLink: string;
}): string => {
  const isReply = data.isReply || false;
  const title = isReply ? 'رد على تذكرة الدعم' : 'تذكرة دعم جديدة';
  const icon = isReply ? '💬' : '🎫';
  
  const content = `
    ${greeting(data.customerName, isReply ? 
      'تم إضافة رد جديد على تذكرتك من فريق الدعم.' : 
      'تم استلام طلب الدعم الخاص بك. سنتواصل معك قريباً.')}
    
    ${sectionTitle(title, icon)}
    
    ${infoCard([
      { label: 'رقم التذكرة', value: data.ticketNumber },
      { label: 'الموضوع', value: data.subject },
      { label: 'الحالة', value: getStatusInfo(data.status || 'pending').labelAr },
    ])}
    
    ${data.replyMessage ? `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding: 0 24px 16px 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #dbeafe; border-radius: 12px; border-right: 4px solid ${BRAND.colors.accent};">
            <tr>
              <td style="padding: 16px 20px;">
                <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: ${BRAND.colors.primary};">
                  رد فريق الدعم:
                </p>
                <p style="margin: 0; font-size: 14px; color: ${BRAND.colors.textDark}; line-height: 1.7;">
                  ${data.replyMessage}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    ` : ''}
    
    ${highlightBox(isReply ? 
      '⚡ يُمكنك الرد على التذكرة من خلال لوحة التحكم.' : 
      '⏱️ سيقوم فريق الدعم بالرد خلال 24 ساعة عمل.', 'info')}
    
    ${ctaButton('عرض التذكرة', data.viewTicketLink)}
  `;
  return emailWrapper(content);
};

// ============================================
// 6) ADDITIONAL TEMPLATES
// ============================================

// Contract Notification Email
export const contractNotificationEmail = (data: {
  customerName: string;
  contractNumber: string;
  contractTitle: string;
  status: string;
  statusMessage?: string;
  viewContractLink: string;
}): string => {
  const statusInfo = getStatusInfo(data.status);
  const messages: Record<string, string> = {
    draft: 'تم إنشاء مسودة عقد جديد.',
    pending_signature: 'عقدك جاهز للتوقيع الإلكتروني.',
    signed: 'تم توقيع العقد بنجاح.',
    active: 'عقدك أصبح نشطاً الآن.',
    expired: 'انتهت صلاحية عقدك.',
  };
  
  const variant = ['signed', 'active'].includes(data.status) ? 'success' : 
                  data.status === 'expired' ? 'warning' : 'info';
  
  const content = `
    ${greeting(data.customerName, data.statusMessage || messages[data.status] || 'تم تحديث حالة عقدك.')}
    
    ${sectionTitle('تفاصيل العقد', '📄')}
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding: 0 24px 16px 24px; text-align: center;">
          ${statusBadge(data.status)}
        </td>
      </tr>
    </table>
    
    ${infoCard([
      { label: 'رقم العقد', value: data.contractNumber },
      { label: 'عنوان العقد', value: data.contractTitle },
      { label: 'الحالة', value: statusInfo.labelAr },
    ])}
    
    ${data.status === 'pending_signature' ? 
      highlightBox('✍️ يُرجى مراجعة العقد وتوقيعه إلكترونياً لاستكمال الإجراءات.', 'warning') : ''}
    
    ${ctaButton(data.status === 'pending_signature' ? 'توقيع العقد' : 'عرض العقد', data.viewContractLink, 
      data.status === 'pending_signature' ? 'warning' : 'primary')}
  `;
  return emailWrapper(content);
};

// Finance Application Email
export const financeNotificationEmail = (data: {
  customerName: string;
  applicationNumber: string;
  amount: number | string;
  status: string;
  statusMessage?: string;
  viewApplicationLink: string;
}): string => {
  const statusInfo = getStatusInfo(data.status);
  const messages: Record<string, string> = {
    submitted: 'تم استلام طلب التمويل الخاص بك وهو قيد المراجعة.',
    under_review: 'طلبك قيد المراجعة من قبل فريقنا المختص.',
    approved: 'تهانينا! تمت الموافقة على طلب التمويل الخاص بك.',
    rejected: 'نأسف، لم تتم الموافقة على طلبك. يُمكنك التواصل معنا لمزيد من التفاصيل.',
    disbursed: 'تم صرف مبلغ التمويل إلى حسابك بنجاح.',
  };
  
  const variant = ['approved', 'disbursed'].includes(data.status) ? 'success' : 
                  data.status === 'rejected' ? 'error' : 'info';
  
  const content = `
    ${greeting(data.customerName, data.statusMessage || messages[data.status] || 'تم تحديث حالة طلب التمويل.')}
    
    ${sectionTitle('طلب التمويل', '💰')}
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding: 0 24px 16px 24px; text-align: center;">
          ${statusBadge(data.status)}
        </td>
      </tr>
    </table>
    
    ${infoCard([
      { label: 'رقم الطلب', value: data.applicationNumber },
      { label: 'الحالة', value: statusInfo.labelAr },
    ])}
    
    ${amountDisplay(data.amount, 'مبلغ التمويل المطلوب')}
    
    ${highlightBox(messages[data.status] || 'تم تحديث حالة طلبك.', variant as any)}
    
    ${ctaButton('عرض تفاصيل الطلب', data.viewApplicationLink)}
  `;
  return emailWrapper(content);
};

// Wallet Notification Email
export const walletNotificationEmail = (data: {
  customerName: string;
  transactionType: 'deposit' | 'withdrawal' | 'transfer';
  amount: number | string;
  status: string;
  referenceId: string;
  newBalance?: number | string;
  viewWalletLink: string;
}): string => {
  const typeLabels = {
    deposit: 'إيداع',
    withdrawal: 'سحب',
    transfer: 'تحويل',
  };
  
  const typeIcons = {
    deposit: '💵',
    withdrawal: '💸',
    transfer: '🔄',
  };
  
  const content = `
    ${greeting(data.customerName, `تمت عملية ${typeLabels[data.transactionType]} على محفظتك.`)}
    
    ${sectionTitle(`عملية ${typeLabels[data.transactionType]}`, typeIcons[data.transactionType])}
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding: 0 24px 16px 24px; text-align: center;">
          ${statusBadge(data.status)}
        </td>
      </tr>
    </table>
    
    ${amountDisplay(data.amount, `مبلغ ${typeLabels[data.transactionType]}`)}
    
    ${infoCard([
      { label: 'نوع العملية', value: typeLabels[data.transactionType] },
      { label: 'رقم المرجع', value: data.referenceId },
      { label: 'الحالة', value: getStatusInfo(data.status).labelAr },
      ...(data.newBalance ? [{ label: 'الرصيد الجديد', value: formatCurrency(data.newBalance) }] : []),
    ])}
    
    ${ctaButton('عرض المحفظة', data.viewWalletLink)}
  `;
  return emailWrapper(content);
};

// Generic Notification Email
export const genericNotificationEmail = (data: {
  customerName: string;
  title: string;
  message: string;
  ctaText?: string;
  ctaLink?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
}): string => {
  const content = `
    ${greeting(data.customerName, data.message)}
    
    ${sectionTitle(data.title, '📢')}
    
    ${highlightBox(data.message, data.variant || 'info')}
    
    ${data.ctaText && data.ctaLink ? ctaButton(data.ctaText, data.ctaLink) : ''}
  `;
  return emailWrapper(content);
};

// Plain text version generator
export const generatePlainText = (data: {
  greeting: string;
  sections: Array<{ title: string; content: string }>;
}): string => {
  let text = `ASH HOLDING - ${BRAND.nameAr}\n`;
  text += '═'.repeat(50) + '\n\n';
  text += `${data.greeting}\n\n`;
  
  data.sections.forEach(section => {
    text += `── ${section.title} ──\n`;
    text += `${section.content}\n\n`;
  });
  
  text += '─'.repeat(50) + '\n';
  text += `📧 ${BRAND.fromEmail}\n`;
  text += `📱 ${BRAND.phone}\n`;
  text += `🌐 ${BRAND.website}\n\n`;
  text += 'هذه الرسالة تم إرسالها تلقائياً، يُرجى عدم الرد عليها.\n';
  text += `© ${new Date().getFullYear()} ${BRAND.name}. جميع الحقوق محفوظة.`;
  
  return text;
};
