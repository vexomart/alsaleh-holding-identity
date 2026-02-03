/**
 * Shared Email Templates for ASH HOLDING
 * Professional bilingual email templates with RTL support
 */

// Company branding constants
export const BRAND = {
  name: "ASH HOLDING",
  nameAr: "شركة علي صالح الشهري القابضة",
  email: "info@ash-holding.sa",
  phone: "0555812567",
  website: "www.ash-holding.sa",
  address: "الرياض، المملكة العربية السعودية",
};

// Status colors mapping
export const STATUS_COLORS: Record<string, { bg: string; text: string; label: string; labelAr: string }> = {
  // Order statuses
  pending: { bg: "#fef3c7", text: "#92400e", label: "Pending", labelAr: "قيد الانتظار" },
  confirmed: { bg: "#dbeafe", text: "#1e40af", label: "Confirmed", labelAr: "مؤكد" },
  processing: { bg: "#e0e7ff", text: "#3730a3", label: "Processing", labelAr: "قيد المعالجة" },
  completed: { bg: "#d1fae5", text: "#065f46", label: "Completed", labelAr: "مكتمل" },
  cancelled: { bg: "#fee2e2", text: "#991b1b", label: "Cancelled", labelAr: "ملغي" },
  refunded: { bg: "#fce7f3", text: "#9d174d", label: "Refunded", labelAr: "مسترد" },
  
  // Contract statuses
  draft: { bg: "#f3f4f6", text: "#374151", label: "Draft", labelAr: "مسودة" },
  pre_approved_by_customer: { bg: "#fef3c7", text: "#92400e", label: "Pre-approved", labelAr: "موافقة مبدئية" },
  pending_admin_approval: { bg: "#fed7aa", text: "#c2410c", label: "Pending Approval", labelAr: "بانتظار الموافقة" },
  pending_signature: { bg: "#dbeafe", text: "#1e40af", label: "Awaiting Signature", labelAr: "بانتظار التوقيع" },
  signed: { bg: "#d1fae5", text: "#065f46", label: "Signed", labelAr: "موقّع" },
  active: { bg: "#d1fae5", text: "#065f46", label: "Active", labelAr: "نشط" },
  expired: { bg: "#e5e7eb", text: "#4b5563", label: "Expired", labelAr: "منتهي" },
  
  // Invoice statuses
  issued: { bg: "#dbeafe", text: "#1e40af", label: "Issued", labelAr: "صادرة" },
  paid: { bg: "#d1fae5", text: "#065f46", label: "Paid", labelAr: "مدفوعة" },
  overdue: { bg: "#fee2e2", text: "#991b1b", label: "Overdue", labelAr: "متأخرة" },
  
  // Finance statuses
  submitted: { bg: "#dbeafe", text: "#1e40af", label: "Submitted", labelAr: "مُقدّم" },
  under_review: { bg: "#fef3c7", text: "#92400e", label: "Under Review", labelAr: "قيد المراجعة" },
  approved: { bg: "#d1fae5", text: "#065f46", label: "Approved", labelAr: "تمت الموافقة" },
  rejected: { bg: "#fee2e2", text: "#991b1b", label: "Rejected", labelAr: "مرفوض" },
  disbursed: { bg: "#d1fae5", text: "#065f46", label: "Disbursed", labelAr: "تم الصرف" },
};

// Base email wrapper
export const wrapEmail = (content: string, isRTL = true) => `
<!DOCTYPE html>
<html dir="${isRTL ? 'rtl' : 'ltr'}" lang="${isRTL ? 'ar' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ASH HOLDING</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Arial, sans-serif; 
      background-color: #f8fafc; 
      direction: ${isRTL ? 'rtl' : 'ltr'}; 
      line-height: 1.6;
    }
    .container { max-width: 640px; margin: 0 auto; background: #ffffff; }
    .header { 
      background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); 
      color: white; 
      padding: 32px 24px; 
      text-align: center; 
    }
    .logo { font-size: 24px; font-weight: 800; letter-spacing: 2px; margin-bottom: 8px; }
    .logo-sub { font-size: 13px; opacity: 0.85; }
    .content { padding: 32px 24px; }
    .section { margin-bottom: 24px; }
    .card { 
      background: #f8fafc; 
      border-radius: 12px; 
      padding: 20px; 
      margin: 16px 0;
      border-${isRTL ? 'right' : 'left'}: 4px solid #3b82f6;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 50px;
      font-size: 13px;
      font-weight: 600;
    }
    .detail-row { 
      display: flex; 
      justify-content: space-between; 
      padding: 12px 0; 
      border-bottom: 1px solid #e2e8f0; 
    }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #64748b; font-size: 14px; }
    .detail-value { color: #0f172a; font-weight: 600; font-size: 14px; }
    .highlight-box {
      background: linear-gradient(135deg, #059669 0%, #10b981 100%);
      color: white;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      margin: 20px 0;
    }
    .warning-box {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 12px;
      padding: 16px;
      margin: 20px 0;
    }
    .info-box {
      background: #dbeafe;
      border: 1px solid #3b82f6;
      border-radius: 12px;
      padding: 16px;
      margin: 20px 0;
    }
    .error-box {
      background: #fee2e2;
      border: 1px solid #ef4444;
      border-radius: 12px;
      padding: 16px;
      margin: 20px 0;
    }
    .btn {
      display: inline-block;
      padding: 14px 28px;
      background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
      color: white !important;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      margin: 8px 4px;
    }
    .btn-success {
      background: linear-gradient(135deg, #059669 0%, #10b981 100%);
    }
    .btn-warning {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }
    .footer { 
      background: #0f172a; 
      color: #94a3b8; 
      padding: 24px; 
      text-align: center; 
      font-size: 13px;
    }
    .footer a { color: #60a5fa; text-decoration: none; }
    .divider { height: 1px; background: #e2e8f0; margin: 24px 0; }
    .amount { font-size: 28px; font-weight: 700; }
    .currency { font-size: 14px; opacity: 0.9; }
    .mono { font-family: 'Courier New', monospace; background: #e2e8f0; padding: 4px 8px; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">ASH HOLDING</div>
      <div class="logo-sub">${BRAND.nameAr}</div>
    </div>
    ${content}
    <div class="footer">
      <p style="margin-bottom: 12px;"><strong>${BRAND.nameAr}</strong></p>
      <p>📧 ${BRAND.email} | 📱 ${BRAND.phone}</p>
      <p>🌐 ${BRAND.website}</p>
      <p style="margin-top: 16px; opacity: 0.7;">© ${new Date().getFullYear()} جميع الحقوق محفوظة</p>
    </div>
  </div>
</body>
</html>
`;

// Format currency
export const formatCurrency = (amount: number, currency = "SAR") => {
  return `${amount.toLocaleString("ar-SA")} ${currency}`;
};

// Format date
export const formatDate = (date: string | Date, isRTL = true) => {
  const d = new Date(date);
  return d.toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get status styling
export const getStatusStyle = (status: string) => {
  const s = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return `background: ${s.bg}; color: ${s.text};`;
};

export const getStatusLabel = (status: string, isRTL = true) => {
  const s = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return isRTL ? s.labelAr : s.label;
};
