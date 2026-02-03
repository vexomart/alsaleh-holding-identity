/**
 * Order Status Change Email Notifications
 * Sends real-time emails for all order status changes
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

const STATUS_CONFIG: Record<string, { icon: string; colorBg: string; colorText: string; titleAr: string; titleEn: string; messageAr: string; messageEn: string }> = {
  pending: {
    icon: "⏳",
    colorBg: "#fef3c7",
    colorText: "#92400e",
    titleAr: "تم استلام طلبك",
    titleEn: "Order Received",
    messageAr: "تم استلام طلبك بنجاح وهو الآن قيد المراجعة. سنتواصل معك قريباً.",
    messageEn: "Your order has been received and is under review. We will contact you soon.",
  },
  confirmed: {
    icon: "✅",
    colorBg: "#dbeafe",
    colorText: "#1e40af",
    titleAr: "تم تأكيد طلبك",
    titleEn: "Order Confirmed",
    messageAr: "تم تأكيد طلبك وسيتم البدء في معالجته قريباً.",
    messageEn: "Your order has been confirmed and will be processed soon.",
  },
  processing: {
    icon: "🔄",
    colorBg: "#e0e7ff",
    colorText: "#3730a3",
    titleAr: "طلبك قيد التنفيذ",
    titleEn: "Order In Progress",
    messageAr: "نحن نعمل على طلبك الآن. سيتم إشعارك عند اكتمال الخدمة.",
    messageEn: "We are working on your order. You will be notified when complete.",
  },
  completed: {
    icon: "🎉",
    colorBg: "#d1fae5",
    colorText: "#065f46",
    titleAr: "تم إكمال طلبك بنجاح!",
    titleEn: "Order Completed!",
    messageAr: "تم إكمال طلبك بنجاح. شكراً لثقتك بنا!",
    messageEn: "Your order has been completed successfully. Thank you for your trust!",
  },
  cancelled: {
    icon: "❌",
    colorBg: "#fee2e2",
    colorText: "#991b1b",
    titleAr: "تم إلغاء الطلب",
    titleEn: "Order Cancelled",
    messageAr: "تم إلغاء طلبك. إذا كان لديك أي استفسار، يرجى التواصل معنا.",
    messageEn: "Your order has been cancelled. Please contact us if you have any questions.",
  },
  refunded: {
    icon: "💸",
    colorBg: "#fce7f3",
    colorText: "#9d174d",
    titleAr: "تم استرداد المبلغ",
    titleEn: "Order Refunded",
    messageAr: "تم استرداد المبلغ المدفوع لحسابك. قد يستغرق ظهوره 3-5 أيام عمل.",
    messageEn: "Your payment has been refunded. It may take 3-5 business days to appear.",
  },
};

interface OrderStatusRequest {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  orderId: string;
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

const getCustomerEmailTemplate = (data: OrderStatusRequest) => {
  const config = STATUS_CONFIG[data.newStatus] || STATUS_CONFIG.pending;
  
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تحديث الطلب - ${data.orderNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background: #f8fafc; direction: rtl; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #0f172a, #1e3a8a); color: white; padding: 32px; text-align: center; }
    .logo { font-size: 24px; font-weight: 800; letter-spacing: 2px; }
    .content { padding: 32px; }
    .status-card { background: ${config.colorBg}; border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0; }
    .status-icon { font-size: 48px; margin-bottom: 12px; }
    .status-title { font-size: 22px; font-weight: 700; color: ${config.colorText}; margin-bottom: 8px; }
    .status-message { color: ${config.colorText}; opacity: 0.9; }
    .order-details { background: #f8fafc; border-radius: 12px; padding: 20px; margin: 24px 0; border-right: 4px solid #3b82f6; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #64748b; }
    .detail-value { font-weight: 600; color: #0f172a; }
    .timeline { margin: 24px 0; }
    .timeline-item { display: flex; gap: 12px; padding: 12px 0; }
    .timeline-dot { width: 12px; height: 12px; border-radius: 50%; background: #e2e8f0; margin-top: 4px; }
    .timeline-dot.active { background: #3b82f6; }
    .timeline-dot.completed { background: #10b981; }
    .cta-box { background: #dbeafe; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .btn { display: inline-block; background: #3b82f6; color: white !important; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; }
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
      
      <div class="status-card">
        <div class="status-icon">${config.icon}</div>
        <div class="status-title">${config.titleAr}</div>
        <div class="status-message">${config.messageAr}</div>
      </div>
      
      <div class="order-details">
        <h3 style="margin-bottom: 16px; color: #1e293b;">📋 تفاصيل الطلب</h3>
        
        <div class="detail-row">
          <span class="detail-label">رقم الطلب</span>
          <span class="detail-value" style="font-family: monospace;">${data.orderNumber}</span>
        </div>
        
        ${data.serviceNameAr || data.serviceName ? `
        <div class="detail-row">
          <span class="detail-label">الخدمة</span>
          <span class="detail-value">${data.serviceNameAr || data.serviceName}</span>
        </div>
        ` : ''}
        
        ${data.amount ? `
        <div class="detail-row">
          <span class="detail-label">المبلغ</span>
          <span class="detail-value" style="color: #059669;">${data.amount.toLocaleString('ar-SA')} ${data.currency || 'SAR'}</span>
        </div>
        ` : ''}
        
        <div class="detail-row">
          <span class="detail-label">الحالة الحالية</span>
          <span class="detail-value" style="background: ${config.colorBg}; color: ${config.colorText}; padding: 4px 12px; border-radius: 20px; font-size: 13px;">
            ${config.titleAr}
          </span>
        </div>
      </div>
      
      ${data.notesAr || data.notes ? `
      <div style="background: #fef3c7; border-radius: 12px; padding: 16px; margin: 24px 0;">
        <h4 style="color: #92400e; margin-bottom: 8px;">💬 ملاحظات:</h4>
        <p style="color: #78350f;">${data.notesAr || data.notes}</p>
      </div>
      ` : ''}
      
      <div class="cta-box">
        <p style="color: #1e40af; margin-bottom: 16px;">تابع حالة طلبك من خلال بوابة العملاء</p>
        <a href="https://alsaleh-holding-identity.lovable.app/app/orders" class="btn">متابعة الطلب</a>
      </div>
      
      <div style="text-align: center; color: #64748b; font-size: 14px;">
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

const getAdminEmailTemplate = (data: OrderStatusRequest) => {
  const config = STATUS_CONFIG[data.newStatus] || STATUS_CONFIG.pending;
  const oldConfig = data.oldStatus ? STATUS_CONFIG[data.oldStatus] : null;
  
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تحديث حالة الطلب - ${data.orderNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background: #f8fafc; direction: rtl; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 24px; text-align: center; }
    .badge { background: #fbbf24; color: #78350f; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .content { padding: 24px; }
    .status-change { display: flex; align-items: center; justify-content: center; gap: 12px; margin: 20px 0; flex-wrap: wrap; }
    .status-box { padding: 12px 20px; border-radius: 10px; font-weight: 600; }
    .arrow { font-size: 24px; color: #64748b; }
    .info-grid { display: grid; gap: 12px; margin: 20px 0; }
    .info-item { background: #f8fafc; padding: 16px; border-radius: 10px; border-right: 3px solid #3b82f6; }
    .info-label { font-size: 12px; color: #64748b; text-transform: uppercase; }
    .info-value { font-size: 16px; font-weight: 600; color: #0f172a; margin-top: 4px; }
    .actions { background: #f0fdf4; border: 1px solid #10b981; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
    .btn { display: inline-block; background: #3b82f6; color: white !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 4px; }
    .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">🔔 تحديث حالة طلب</span>
      <h2 style="margin-top: 12px;">تغيير حالة الطلب #${data.orderNumber}</h2>
    </div>
    
    <div class="content">
      <div class="status-change">
        ${oldConfig ? `
        <div class="status-box" style="background: ${oldConfig.colorBg}; color: ${oldConfig.colorText};">
          ${oldConfig.titleAr}
        </div>
        <span class="arrow">←</span>
        ` : ''}
        <div class="status-box" style="background: ${config.colorBg}; color: ${config.colorText};">
          ${config.icon} ${config.titleAr}
        </div>
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
          <div class="info-label">المبلغ</div>
          <div class="info-value" style="color: #059669;">${data.amount.toLocaleString('ar-SA')} ${data.currency || 'SAR'}</div>
        </div>
        ` : ''}
      </div>
      
      <div class="actions">
        <p style="color: #065f46; margin-bottom: 12px;"><strong>⚡ إجراءات سريعة</strong></p>
        <a href="https://alsaleh-holding-identity.lovable.app/admin/orders" class="btn">إدارة الطلبات</a>
      </div>
    </div>
    
    <div class="footer">
      <p>نظام إدارة الطلبات - ${BRAND.nameAr}</p>
      <p style="margin-top: 8px;">تم إرسال هذا التنبيه تلقائياً</p>
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
    const data: OrderStatusRequest = await req.json();
    const results: any[] = [];

    // Send to customer
    const customerEmail = await resend.emails.send({
      from: `${BRAND.nameAr} <${BRAND.email}>`,
      to: [data.customerEmail],
      bcc: [BRAND.email],
      subject: `${STATUS_CONFIG[data.newStatus]?.icon || '📦'} تحديث الطلب ${data.orderNumber} - ${STATUS_CONFIG[data.newStatus]?.titleAr || 'تحديث'}`,
      html: getCustomerEmailTemplate(data),
    });
    results.push({ type: 'customer', ...customerEmail });

    // Send to admin if requested
    if (data.sendToAdmin !== false) {
      const adminEmail = await resend.emails.send({
        from: `نظام الطلبات <${BRAND.email}>`,
        to: [BRAND.email],
        subject: `🔔 تحديث حالة الطلب ${data.orderNumber}: ${STATUS_CONFIG[data.newStatus]?.titleAr || data.newStatus}`,
        html: getAdminEmailTemplate(data),
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
