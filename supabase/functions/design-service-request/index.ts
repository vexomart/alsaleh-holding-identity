import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface DesignServiceRequestData {
  service: {
    id: string;
    title: string;
    description: string;
    price: string;
    deliveryTime: string;
    features: string[];
  };
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    company?: string;
    serviceType: string;
    projectDetails: string;
    budget?: string;
    timeline?: string;
    additionalRequirements?: string;
  };
}

const getBudgetText = (budget: string) => {
  const budgetMap: { [key: string]: string } = {
    "budget-1": "أقل من 5,000 ريال",
    "budget-2": "5,000 - 10,000 ريال", 
    "budget-3": "10,000 - 20,000 ريال",
    "budget-4": "20,000 - 50,000 ريال",
    "budget-5": "أكثر من 50,000 ريال",
    "budget-discuss": "أفضل مناقشة الميزانية"
  };
  return budgetMap[budget] || budget;
};

const getTimelineText = (timeline: string) => {
  const timelineMap: { [key: string]: string } = {
    "urgent": "عاجل (أقل من أسبوع)",
    "week": "خلال أسبوع",
    "two-weeks": "خلال أسبوعين", 
    "month": "خلال شهر",
    "flexible": "مرن في الوقت"
  };
  return timelineMap[timeline] || timeline;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { service, customerInfo }: DesignServiceRequestData = await req.json();

    // البيانات المطلوبة
    if (!service || !customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.projectDetails) {
      return new Response(
        JSON.stringify({ error: "جميع البيانات الأساسية مطلوبة" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const currentDate = new Date().toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // إرسال بريد إلكتروني للشركة
    const companyEmailResponse = await resend.emails.send({
      from: "Ali AlShehri Holding <info@alialshehriholding.com>",
      to: ["info@alialshehriholding.com"],
      bcc: ["info@alialshehriholding.com"],
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>طلب خدمة تصميم جديد</title>
          <style>
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: 'Segoe UI', 'Tahoma', 'Arial', sans-serif;
              line-height: 1.8;
              color: #2d3748;
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              padding: 20px;
              direction: rtl;
              text-align: right;
            }
            .email-container {
              max-width: 700px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 25px 50px rgba(0,0,0,0.15);
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
              position: relative;
            }
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              right: 0;
              width: 100%;
              height: 100%;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="design" width="50" height="50" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="2" fill="rgba(255,255,255,0.1)"/><path d="M10,10 Q25,5 40,10 Q35,25 40,40 Q25,35 10,40 Q15,25 10,10" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23design)"/></svg>');
            }
            .header-content {
              position: relative;
              z-index: 2;
            }
            .header h1 {
              font-size: 34px;
              font-weight: 900;
              margin-bottom: 12px;
              text-shadow: 0 3px 6px rgba(0,0,0,0.3);
            }
            .header p {
              font-size: 18px;
              opacity: 0.95;
              margin-bottom: 8px;
            }
            .design-badge {
              display: inline-block;
              background: rgba(255,255,255,0.25);
              backdrop-filter: blur(15px);
              padding: 18px 30px;
              border-radius: 18px;
              margin: 25px 0;
              border: 2px solid rgba(255,255,255,0.3);
              font-weight: 800;
              font-size: 18px;
            }
            .content-section {
              padding: 40px 30px;
            }
            .service-details {
              background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
              border: 3px solid #10b981;
              border-radius: 18px;
              padding: 30px;
              margin: 25px 0;
              position: relative;
            }
            .service-details::before {
              content: '🎨';
              position: absolute;
              top: -15px;
              right: 20px;
              background: white;
              padding: 8px 12px;
              border-radius: 12px;
              font-size: 24px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .service-title {
              font-size: 26px;
              font-weight: 900;
              color: #064e3b;
              margin-bottom: 15px;
              text-align: center;
            }
            .service-description {
              color: #065f46;
              font-size: 16px;
              margin-bottom: 20px;
              text-align: center;
              font-weight: 600;
            }
            .service-meta {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin: 20px 0;
            }
            .meta-item {
              background: rgba(16, 185, 129, 0.1);
              padding: 15px;
              border-radius: 12px;
              text-align: center;
              border: 2px solid rgba(16, 185, 129, 0.2);
            }
            .meta-value {
              font-size: 20px;
              font-weight: 900;
              color: #065f46;
              margin-bottom: 5px;
            }
            .meta-label {
              font-size: 14px;
              color: #047857;
              font-weight: 600;
            }
            .features-section {
              margin: 25px 0;
            }
            .features-title {
              font-size: 20px;
              font-weight: 800;
              color: #065f46;
              margin-bottom: 15px;
              text-align: center;
            }
            .features-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 12px;
            }
            .feature-item {
              background: white;
              padding: 12px 15px;
              border-radius: 10px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.05);
              border-right: 4px solid #10b981;
              font-weight: 600;
              color: #374151;
            }
            .feature-item::before {
              content: '✨ ';
              margin-left: 8px;
            }
            .customer-section {
              background: linear-gradient(135deg, #f8fafc, #f1f5f9);
              margin: 30px 0;
              padding: 35px;
              border-radius: 18px;
              border: 3px solid #e2e8f0;
            }
            .customer-title {
              font-size: 26px;
              font-weight: 900;
              color: #1e293b;
              margin-bottom: 25px;
              text-align: center;
              background: linear-gradient(135deg, #3b82f6, #1d4ed8);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            .info-grid {
              display: grid;
              gap: 18px;
            }
            .info-item {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              padding: 18px 25px;
              background: white;
              border-radius: 15px;
              box-shadow: 0 3px 12px rgba(0,0,0,0.08);
              border-right: 5px solid #3b82f6;
            }
            .info-label {
              font-weight: 800;
              color: #475569;
              font-size: 16px;
              min-width: 120px;
            }
            .info-value {
              color: #1e293b;
              font-weight: 600;
              font-size: 16px;
              flex: 1;
              text-align: left;
              line-height: 1.6;
            }
            .project-details {
              background: linear-gradient(135deg, #fefce8, #fef3c7);
              border: 3px solid #f59e0b;
              border-radius: 15px;
              padding: 25px;
              margin: 25px 0;
            }
            .project-details h4 {
              font-size: 20px;
              font-weight: 800;
              color: #92400e;
              margin-bottom: 15px;
              text-align: center;
            }
            .project-text {
              background: white;
              padding: 20px;
              border-radius: 12px;
              color: #78350f;
              font-weight: 600;
              line-height: 1.8;
              box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            .footer-section {
              background: linear-gradient(135deg, #1f2937, #374151);
              color: white;
              padding: 35px;
              text-align: center;
            }
            .footer-section h3 {
              font-size: 24px;
              font-weight: 900;
              margin-bottom: 15px;
            }
            .footer-section p {
              font-size: 16px;
              margin: 10px 0;
              opacity: 0.95;
            }
            .footer-section a {
              color: #10b981;
              text-decoration: none;
              font-weight: 800;
              background: rgba(16, 185, 129, 0.1);
              padding: 8px 15px;
              border-radius: 8px;
              display: inline-block;
              margin: 0 5px;
            }
            .footer-section a:hover {
              background: rgba(16, 185, 129, 0.2);
            }
            .urgent-notice {
              background: linear-gradient(135deg, #fef2f2, #fee2e2);
              border: 3px solid #ef4444;
              border-radius: 15px;
              padding: 20px;
              margin: 25px 0;
              text-align: center;
            }
            .urgent-notice h4 {
              color: #dc2626;
              font-weight: 900;
              font-size: 18px;
              margin-bottom: 10px;
            }
            .urgent-notice p {
              color: #991b1b;
              font-weight: 700;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="header-content">
                <h1>🎨 طلب خدمة تصميم جديد</h1>
                <p><strong>شركة علي صالح الشهري القابضة</strong></p>
                <p>📅 التاريخ: ${currentDate}</p>
                <div class="design-badge">
                  ⚡ طلب خدمة تصميم إبداعية
                </div>
              </div>
            </div>

            <div class="content-section">
              <div class="service-details">
                <h3 class="service-title">${service.title}</h3>
                <p class="service-description">${service.description}</p>
                
                <div class="service-meta">
                  <div class="meta-item">
                    <div class="meta-value">من ${service.price} ر.س</div>
                    <div class="meta-label">السعر التقديري</div>
                  </div>
                  <div class="meta-item">
                    <div class="meta-value">${service.deliveryTime}</div>
                    <div class="meta-label">مدة التنفيذ</div>
                  </div>
                </div>

                <div class="features-section">
                  <h4 class="features-title">✨ المشمول في الخدمة</h4>
                  <div class="features-grid">
                    ${service.features.map(feature => `<div class="feature-item">${feature}</div>`).join('')}
                  </div>
                </div>
              </div>

              <div class="customer-section">
                <h3 class="customer-title">👤 بيانات العميل</h3>
                
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">👤 الاسم:</span>
                    <span class="info-value">${customerInfo.name}</span>
                  </div>
                  
                  <div class="info-item">
                    <span class="info-label">📧 البريد الإلكتروني:</span>
                    <span class="info-value">${customerInfo.email}</span>
                  </div>
                  
                  <div class="info-item">
                    <span class="info-label">📱 رقم الجوال:</span>
                    <span class="info-value">${customerInfo.phone}</span>
                  </div>
                  
                  ${customerInfo.company ? `
                  <div class="info-item">
                    <span class="info-label">🏢 الشركة:</span>
                    <span class="info-value">${customerInfo.company}</span>
                  </div>
                  ` : ''}

                  ${customerInfo.budget ? `
                  <div class="info-item">
                    <span class="info-label">💰 الميزانية:</span>
                    <span class="info-value">${getBudgetText(customerInfo.budget)}</span>
                  </div>
                  ` : ''}

                  ${customerInfo.timeline ? `
                  <div class="info-item">
                    <span class="info-label">⏰ المدة المطلوبة:</span>
                    <span class="info-value">${getTimelineText(customerInfo.timeline)}</span>
                  </div>
                  ` : ''}
                </div>
              </div>

              <div class="project-details">
                <h4>📋 تفاصيل المشروع</h4>
                <div class="project-text">${customerInfo.projectDetails}</div>
              </div>

              ${customerInfo.additionalRequirements ? `
              <div class="project-details">
                <h4>📝 متطلبات إضافية</h4>
                <div class="project-text">${customerInfo.additionalRequirements}</div>
              </div>
              ` : ''}

              ${customerInfo.timeline === 'urgent' ? `
              <div class="urgent-notice">
                <h4>🚨 طلب عاجل</h4>
                <p>العميل يحتاج المشروع بشكل عاجل - يرجى إعطاء الأولوية لهذا الطلب</p>
              </div>
              ` : ''}
            </div>

            <div class="footer-section">
              <h3>🎯 يرجى التواصل مع العميل خلال 24 ساعة</h3>
              <p>📞 للتواصل: <a href="tel:${customerInfo.phone}">${customerInfo.phone}</a></p>
              <p>📧 البريد: <a href="mailto:${customerInfo.email}">${customerInfo.email}</a></p>
              <p style="margin-top: 25px; font-size: 14px; opacity: 0.8;">
                قسم التصميم الإبداعي - شركة علي صالح الشهري القابضة
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Company email sent:", companyEmailResponse);

    // إرسال بريد تأكيد للعميل
    const customerEmailResponse = await resend.emails.send({
      from: "Ali AlShehri Holding <info@alialshehriholding.com>",
      to: [customerInfo.email],
      bcc: ["info@alialshehriholding.com"],
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>تأكيد استلام طلب خدمة التصميم</title>
          <style>
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: 'Segoe UI', 'Tahoma', 'Arial', sans-serif;
              line-height: 1.8;
              color: #2d3748;
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              padding: 20px;
              direction: rtl;
              text-align: right;
            }
            .email-container {
              max-width: 650px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
              position: relative;
            }
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              right: 0;
              width: 100%;
              height: 100%;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="success" width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="30" cy="30" r="2" fill="rgba(255,255,255,0.15)"/><path d="M15,15 Q30,10 45,15 Q40,30 45,45 Q30,40 15,45 Q20,30 15,15" fill="rgba(255,255,255,0.08)"/></pattern></defs><rect width="100" height="100" fill="url(%23success)"/></svg>');
            }
            .header-content {
              position: relative;
              z-index: 2;
            }
            .header h1 {
              font-size: 32px;
              font-weight: 900;
              margin-bottom: 10px;
              text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            .header p {
              font-size: 18px;
              opacity: 0.95;
              margin-bottom: 5px;
            }
            .success-badge {
              display: inline-block;
              background: rgba(255,255,255,0.2);
              backdrop-filter: blur(10px);
              padding: 15px 25px;
              border-radius: 15px;
              margin: 25px 0;
              border: 1px solid rgba(255,255,255,0.3);
              font-size: 18px;
              font-weight: 700;
            }
            .content-section {
              padding: 40px 30px;
            }
            .welcome-text {
              font-size: 20px;
              color: #2d3748;
              margin-bottom: 25px;
              text-align: center;
              font-weight: 600;
            }
            .service-summary {
              background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
              border-radius: 15px;
              padding: 30px;
              margin: 30px 0;
              border-right: 6px solid #10b981;
              box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            }
            .service-summary h3 {
              font-size: 22px;
              font-weight: 800;
              color: #065f46;
              margin-bottom: 20px;
              text-align: center;
              background: linear-gradient(135deg, #10b981, #059669);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            .service-title {
              font-size: 24px;
              font-weight: 800;
              color: #2d3748;
              margin-bottom: 15px;
              text-align: center;
            }
            .service-meta-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin: 20px 0;
            }
            .meta-card {
              background: white;
              padding: 15px;
              border-radius: 12px;
              text-align: center;
              box-shadow: 0 2px 8px rgba(0,0,0,0.05);
              border: 2px solid #d1fae5;
            }
            .meta-card .value {
              font-size: 18px;
              font-weight: 800;
              color: #065f46;
              margin-bottom: 5px;
            }
            .meta-card .label {
              font-size: 14px;
              color: #047857;
            }
            .next-steps {
              background: linear-gradient(135deg, #fffbeb, #fef3c7);
              border: 3px solid #f59e0b;
              border-radius: 15px;
              padding: 30px;
              margin: 30px 0;
            }
            .next-steps h3 {
              font-size: 22px;
              font-weight: 800;
              color: #92400e;
              margin-bottom: 20px;
              text-align: center;
            }
            .next-steps ul {
              list-style: none;
              padding: 0;
              margin: 0;
            }
            .next-steps li {
              padding: 15px 0;
              position: relative;
              padding-right: 45px;
              font-size: 16px;
              color: #78350f;
              font-weight: 600;
              border-bottom: 1px solid rgba(245, 158, 11, 0.3);
            }
            .next-steps li:last-child {
              border-bottom: none;
            }
            .next-steps li::before {
              position: absolute;
              right: 0;
              top: 15px;
              font-size: 20px;
              width: 35px;
            }
            .next-steps li:nth-child(1)::before { content: '📧'; }
            .next-steps li:nth-child(2)::before { content: '📞'; }
            .next-steps li:nth-child(3)::before { content: '🎨'; }
            .next-steps li:nth-child(4)::before { content: '💼'; }
            .next-steps li:nth-child(5)::before { content: '🚀'; }
            .contact-info {
              background: linear-gradient(135deg, #eff6ff, #dbeafe);
              border-radius: 15px;
              padding: 30px;
              margin: 30px 0;
              text-align: center;
              border: 2px solid #93c5fd;
            }
            .contact-info h3 {
              font-size: 22px;
              font-weight: 800;
              color: #1e40af;
              margin-bottom: 20px;
            }
            .contact-info p {
              font-size: 18px;
              color: #1e3a8a;
              margin: 10px 0;
              font-weight: 600;
            }
            .contact-info a {
              color: #1d4ed8;
              text-decoration: none;
              font-weight: 800;
              background: rgba(255,255,255,0.8);
              padding: 8px 15px;
              border-radius: 8px;
              display: inline-block;
              margin: 0 5px;
            }
            .contact-info a:hover {
              background: rgba(255,255,255,1);
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .footer-section {
              background: linear-gradient(135deg, #1f2937, #374151);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .footer-section h3 {
              font-size: 24px;
              font-weight: 800;
              margin-bottom: 10px;
            }
            .footer-section p {
              font-size: 16px;
              opacity: 0.95;
              line-height: 1.6;
            }
            .design-tip {
              background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
              border: 2px solid #0284c7;
              border-radius: 15px;
              padding: 20px;
              margin: 25px 0;
              text-align: center;
            }
            .design-tip h4 {
              color: #0369a1;
              font-weight: 800;
              margin-bottom: 10px;
            }
            .design-tip p {
              color: #075985;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="header-content">
                <h1>🎉 شكراً لك عزيزي ${customerInfo.name}</h1>
                <p><strong>تم استلام طلب خدمة التصميم بنجاح!</strong></p>
                <p>📅 ${currentDate}</p>
                <div class="success-badge">
                  ✅ طلبك وصل لفريق التصميم الإبداعي
                </div>
              </div>
            </div>

            <div class="content-section">
              <p class="welcome-text">
                <strong>مرحباً ${customerInfo.name}،</strong><br>
                نشكرك على اختيارك فريق التصميم الإبداعي في <strong>شركة علي صالح الشهري القابضة</strong> لتنفيذ مشروعك التصميمي.
              </p>
              
              <div class="service-summary">
                <h3>🎨 ملخص خدمة التصميم المطلوبة</h3>
                <h4 class="service-title">${service.title}</h4>
                <p style="color: #065f46; text-align: center; margin: 15px 0; font-weight: 600;">${service.description}</p>
                
                <div class="service-meta-grid">
                  <div class="meta-card">
                    <div class="value">من ${service.price} ر.س</div>
                    <div class="label">السعر التقديري</div>
                  </div>
                  <div class="meta-card">
                    <div class="value">${service.deliveryTime}</div>
                    <div class="label">مدة التنفيذ</div>
                  </div>
                </div>
              </div>

              <div class="next-steps">
                <h3>🚀 الخطوات التالية لمشروعك</h3>
                <ul>
                  <li>تم استلام طلبك وتوزيعه على فريق التصميم المختص</li>
                  <li>سيتم التواصل معك خلال 24 ساعة لمناقشة التفاصيل</li>
                  <li>وضع خطة تصميمية مخصصة بناءً على متطلباتك</li>
                  <li>تقديم عرض سعر نهائي مع الجدول الزمني</li>
                  <li>البدء في تنفيذ التصميم فور الموافقة</li>
                </ul>
              </div>

              <div class="design-tip">
                <h4>💡 نصيحة من فريق التصميم</h4>
                <p>كلما كانت تفاصيل مشروعك أوضح، كان التصميم النهائي أقرب لتوقعاتك. لا تتردد في مشاركة أي أفكار أو مراجع تساعدنا في فهم رؤيتك بشكل أفضل.</p>
              </div>

              <div class="contact-info">
                <h3>📞 للتواصل المباشر مع فريق التصميم</h3>
                <p><strong>واتساب:</strong> <a href="https://wa.me/966555812567">0555812567</a></p>
                <p><strong>البريد الإلكتروني:</strong> <a href="mailto:info@alialshehriholding.com">info@alialshehriholding.com</a></p>
                <p style="margin-top: 20px; color: #1e3a8a; font-size: 16px;">
                  🎨 <strong>ملاحظة:</strong> احتفظ بهذا الإيميل كمرجع لطلبك التصميمي
                </p>
              </div>
            </div>

            <div class="footer-section">
              <h3>🎨 فريق التصميم الإبداعي</h3>
              <p><strong>شركة علي صالح الشهري القابضة</strong></p>
              <p>نحول أفكارك إلى تصاميم مذهلة تحقق أهدافك التجارية 🚀</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Customer email sent:", customerEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال طلب خدمة التصميم بنجاح",
        companyEmailId: companyEmailResponse.data?.id,
        customerEmailId: customerEmailResponse.data?.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in design-service-request function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "حدث خطأ في إرسال طلب خدمة التصميم" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);