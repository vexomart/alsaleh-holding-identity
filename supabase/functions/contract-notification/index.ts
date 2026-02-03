/**
 * Contract Lifecycle Email Notifications
 * Sends real-time emails for all contract events
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

const EVENT_CONFIG: Record<ContractEvent, { icon: string; bgColor: string; textColor: string; titleAr: string; messageAr: string; actionRequired: boolean }> = {
  created: {
    icon: "📝",
    bgColor: "#dbeafe",
    textColor: "#1e40af",
    titleAr: "تم إنشاء عقد جديد",
    messageAr: "تم إنشاء عقد جديد وهو الآن قيد المراجعة.",
    actionRequired: false,
  },
  pre_approved: {
    icon: "✅",
    bgColor: "#fef3c7",
    textColor: "#92400e",
    titleAr: "موافقة مبدئية على العقد",
    messageAr: "تمت الموافقة المبدئية على العقد من قبلكم. سيتم مراجعته من قبل الإدارة.",
    actionRequired: false,
  },
  pending_approval: {
    icon: "⏳",
    bgColor: "#fed7aa",
    textColor: "#c2410c",
    titleAr: "العقد بانتظار موافقة الإدارة",
    messageAr: "العقد الآن بانتظار موافقة الإدارة. سيتم إشعاركم عند الموافقة.",
    actionRequired: false,
  },
  approved: {
    icon: "🎉",
    bgColor: "#d1fae5",
    textColor: "#065f46",
    titleAr: "تمت الموافقة على العقد!",
    messageAr: "تمت الموافقة على عقدكم من قبل الإدارة. يمكنكم الآن التوقيع عليه.",
    actionRequired: true,
  },
  rejected: {
    icon: "❌",
    bgColor: "#fee2e2",
    textColor: "#991b1b",
    titleAr: "تم رفض العقد",
    messageAr: "للأسف، تم رفض طلب العقد. يرجى التواصل معنا لمزيد من التفاصيل.",
    actionRequired: false,
  },
  pending_signature: {
    icon: "✍️",
    bgColor: "#e0e7ff",
    textColor: "#3730a3",
    titleAr: "العقد جاهز للتوقيع",
    messageAr: "عقدكم جاهز للتوقيع الإلكتروني. يرجى تسجيل الدخول لإتمام التوقيع.",
    actionRequired: true,
  },
  signed: {
    icon: "🖊️",
    bgColor: "#d1fae5",
    textColor: "#065f46",
    titleAr: "تم توقيع العقد بنجاح",
    messageAr: "تم توقيع العقد بنجاح. سيتم تفعيله قريباً.",
    actionRequired: false,
  },
  active: {
    icon: "🟢",
    bgColor: "#d1fae5",
    textColor: "#065f46",
    titleAr: "العقد الآن نشط!",
    messageAr: "تم تفعيل عقدكم وهو الآن ساري المفعول.",
    actionRequired: false,
  },
  expired: {
    icon: "⚠️",
    bgColor: "#e5e7eb",
    textColor: "#4b5563",
    titleAr: "انتهت صلاحية العقد",
    messageAr: "انتهت صلاحية عقدكم. يرجى التواصل معنا للتجديد.",
    actionRequired: true,
  },
  cancelled: {
    icon: "🚫",
    bgColor: "#fee2e2",
    textColor: "#991b1b",
    titleAr: "تم إلغاء العقد",
    messageAr: "تم إلغاء العقد. يرجى التواصل معنا إذا كان لديكم أي استفسار.",
    actionRequired: false,
  },
};

interface ContractNotificationRequest {
  event: ContractEvent;
  customerEmail: string;
  customerName: string;
  contractNumber: string;
  contractId: string;
  serviceName?: string;
  serviceNameAr?: string;
  amount?: number;
  currency?: string;
  pdfUrl?: string;
  rejectionReason?: string;
  approvalNotes?: string;
  sendToAdmin?: boolean;
}

const getCustomerEmailTemplate = (data: ContractNotificationRequest) => {
  const config = EVENT_CONFIG[data.event];
  
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>إشعار العقد - ${data.contractNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background: #f8fafc; direction: rtl; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #0f172a, #1e3a8a); color: white; padding: 32px; text-align: center; }
    .logo { font-size: 24px; font-weight: 800; letter-spacing: 2px; }
    .content { padding: 32px; }
    .event-card { background: ${config.bgColor}; border-radius: 16px; padding: 28px; text-align: center; margin: 24px 0; }
    .event-icon { font-size: 56px; margin-bottom: 16px; }
    .event-title { font-size: 24px; font-weight: 700; color: ${config.textColor}; margin-bottom: 12px; }
    .event-message { color: ${config.textColor}; opacity: 0.9; font-size: 15px; line-height: 1.7; }
    .contract-details { background: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0; border-right: 4px solid #1e3a8a; }
    .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #64748b; }
    .detail-value { font-weight: 600; color: #0f172a; }
    .action-box { background: linear-gradient(135deg, #3b82f6, #1e40af); border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
    .btn { display: inline-block; background: white; color: #1e40af !important; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; }
    .btn-secondary { background: rgba(255,255,255,0.2); color: white !important; margin-top: 12px; }
    .rejection-box { background: #fee2e2; border: 1px solid #fca5a5; border-radius: 12px; padding: 20px; margin: 24px 0; }
    .notes-box { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 12px; padding: 20px; margin: 24px 0; }
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
      
      <div class="event-card">
        <div class="event-icon">${config.icon}</div>
        <div class="event-title">${config.titleAr}</div>
        <div class="event-message">${config.messageAr}</div>
      </div>
      
      <div class="contract-details">
        <h3 style="margin-bottom: 16px; color: #1e293b;">📄 تفاصيل العقد</h3>
        
        <div class="detail-row">
          <span class="detail-label">رقم العقد</span>
          <span class="detail-value" style="font-family: monospace;">${data.contractNumber}</span>
        </div>
        
        ${data.serviceNameAr || data.serviceName ? `
        <div class="detail-row">
          <span class="detail-label">الخدمة</span>
          <span class="detail-value">${data.serviceNameAr || data.serviceName}</span>
        </div>
        ` : ''}
        
        ${data.amount ? `
        <div class="detail-row">
          <span class="detail-label">القيمة</span>
          <span class="detail-value" style="color: #059669; font-size: 18px;">${data.amount.toLocaleString('ar-SA')} ${data.currency || 'SAR'}</span>
        </div>
        ` : ''}
        
        <div class="detail-row">
          <span class="detail-label">الحالة</span>
          <span class="detail-value" style="background: ${config.bgColor}; color: ${config.textColor}; padding: 4px 12px; border-radius: 20px; font-size: 13px;">
            ${config.titleAr}
          </span>
        </div>
      </div>
      
      ${data.rejectionReason ? `
      <div class="rejection-box">
        <h4 style="color: #991b1b; margin-bottom: 8px;">❌ سبب الرفض:</h4>
        <p style="color: #7f1d1d;">${data.rejectionReason}</p>
      </div>
      ` : ''}
      
      ${data.approvalNotes ? `
      <div class="notes-box">
        <h4 style="color: #92400e; margin-bottom: 8px;">📝 ملاحظات الموافقة:</h4>
        <p style="color: #78350f;">${data.approvalNotes}</p>
      </div>
      ` : ''}
      
      ${config.actionRequired || data.pdfUrl ? `
      <div class="action-box">
        <p style="color: white; margin-bottom: 16px; font-size: 15px;">
          ${config.actionRequired ? '⚡ إجراء مطلوب منكم' : '📥 تحميل نسخة العقد'}
        </p>
        ${data.event === 'pending_signature' || data.event === 'approved' ? `
        <a href="https://alsaleh-holding-identity.lovable.app/app/contracts/${data.contractId}" class="btn">توقيع العقد الآن</a>
        ` : data.pdfUrl ? `
        <a href="${data.pdfUrl}" class="btn" target="_blank">تحميل العقد PDF</a>
        ` : ''}
        <br>
        <a href="https://alsaleh-holding-identity.lovable.app/app/contracts" class="btn btn-secondary">إدارة عقودي</a>
      </div>
      ` : `
      <div style="text-align: center; margin: 24px 0;">
        <a href="https://alsaleh-holding-identity.lovable.app/app/contracts" style="display: inline-block; background: #3b82f6; color: white !important; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600;">عرض عقودي</a>
      </div>
      `}
      
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

const getAdminEmailTemplate = (data: ContractNotificationRequest) => {
  const config = EVENT_CONFIG[data.event];
  const isActionRequired = ['pre_approved', 'pending_approval', 'signed'].includes(data.event);
  
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تنبيه عقد - ${data.contractNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background: #f8fafc; direction: rtl; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: ${isActionRequired ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : 'linear-gradient(135deg, #1e3a8a, #3b82f6)'}; color: white; padding: 24px; text-align: center; }
    .badge { background: #fbbf24; color: #78350f; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block; margin-bottom: 12px; }
    .content { padding: 24px; }
    .status-banner { background: ${config.bgColor}; color: ${config.textColor}; padding: 20px; border-radius: 12px; text-align: center; margin: 16px 0; }
    .info-grid { display: grid; gap: 12px; margin: 20px 0; }
    .info-item { background: #f8fafc; padding: 14px; border-radius: 10px; border-right: 3px solid #3b82f6; }
    .info-label { font-size: 11px; color: #64748b; text-transform: uppercase; }
    .info-value { font-size: 15px; font-weight: 600; color: #0f172a; margin-top: 4px; }
    .action-required { background: #fef3c7; border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
    .btn { display: inline-block; background: #3b82f6; color: white !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 4px; }
    .btn-danger { background: #dc2626; }
    .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">${config.icon} ${isActionRequired ? 'إجراء مطلوب' : 'إشعار عقد'}</span>
      <h2>العقد رقم ${data.contractNumber}</h2>
    </div>
    
    <div class="content">
      <div class="status-banner">
        <span style="font-size: 32px;">${config.icon}</span>
        <h3 style="margin-top: 8px;">${config.titleAr}</h3>
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
        ${data.serviceNameAr || data.serviceName ? `
        <div class="info-item">
          <div class="info-label">الخدمة</div>
          <div class="info-value">${data.serviceNameAr || data.serviceName}</div>
        </div>
        ` : ''}
        ${data.amount ? `
        <div class="info-item">
          <div class="info-label">القيمة</div>
          <div class="info-value" style="color: #059669; font-size: 18px;">${data.amount.toLocaleString('ar-SA')} ${data.currency || 'SAR'}</div>
        </div>
        ` : ''}
      </div>
      
      ${isActionRequired ? `
      <div class="action-required">
        <h4 style="color: #92400e; margin-bottom: 12px;">⚡ إجراء مطلوب</h4>
        <p style="color: #78350f; margin-bottom: 16px;">
          ${data.event === 'pre_approved' || data.event === 'pending_approval' ? 'يرجى مراجعة العقد والموافقة عليه أو رفضه' : ''}
          ${data.event === 'signed' ? 'تم توقيع العقد من قبل العميل ويحتاج لتفعيله' : ''}
        </p>
        <a href="https://alsaleh-holding-identity.lovable.app/admin/contracts/${data.contractId}" class="btn">عرض العقد</a>
      </div>
      ` : `
      <div style="text-align: center; margin: 20px 0;">
        <a href="https://alsaleh-holding-identity.lovable.app/admin/contracts" class="btn">إدارة العقود</a>
      </div>
      `}
    </div>
    
    <div class="footer">
      <p>نظام إدارة العقود - ${BRAND.nameAr}</p>
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
    const data: ContractNotificationRequest = await req.json();
    const config = EVENT_CONFIG[data.event];
    const results: any[] = [];

    // Send to customer
    const customerEmail = await resend.emails.send({
      from: `${BRAND.nameAr} <${BRAND.email}>`,
      to: [data.customerEmail],
      bcc: [BRAND.email],
      subject: `${config.icon} ${config.titleAr} - العقد ${data.contractNumber}`,
      html: getCustomerEmailTemplate(data),
    });
    results.push({ type: 'customer', ...customerEmail });

    // Send to admin
    if (data.sendToAdmin !== false) {
      const adminEmail = await resend.emails.send({
        from: `نظام العقود <${BRAND.email}>`,
        to: [BRAND.email],
        subject: `${config.icon} تحديث عقد ${data.contractNumber}: ${config.titleAr}`,
        html: getAdminEmailTemplate(data),
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
