import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PartnershipFormRequest {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  partnershipType: string;
  businessDescription: string;
  expectedBudget: string;
  timeline: string;
  message: string;
}

const partnershipTypeLabels: { [key: string]: string } = {
  "strategic": "شراكة استراتيجية",
  "technology": "شراكة تقنية", 
  "commercial": "شراكة تجارية",
  "investment": "شراكة استثمارية",
  "distribution": "شراكة توزيع",
  "innovation": "شراكة ابتكار"
};

const budgetLabels: { [key: string]: string } = {
  "under-100k": "أقل من 100,000 ريال",
  "100k-500k": "100,000 - 500,000 ريال",
  "500k-1m": "500,000 - 1,000,000 ريال",
  "1m-5m": "1,000,000 - 5,000,000 ريال",
  "over-5m": "أكثر من 5,000,000 ريال"
};

const timelineLabels: { [key: string]: string } = {
  "immediate": "فوري (خلال شهر)",
  "3-months": "خلال 3 أشهر",
  "6-months": "خلال 6 أشهر",
  "1-year": "خلال سنة",
  "flexible": "مرن"
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: PartnershipFormRequest = await req.json();

    // Send email to company
    const companyEmailResponse = await resend.emails.send({
      from: "Ali AlShehri Holding <info@alialshehriholding.com>",
      to: ["info@alialshehriholding.com"],
      bcc: ["info@alialshehriholding.com"],
      html: `
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>طلب شراكة جديد</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0; 
              padding: 20px; 
              direction: rtl;
            }
            .container { 
              max-width: 700px; 
              margin: 0 auto; 
              background: white; 
              border-radius: 20px; 
              overflow: hidden;
              box-shadow: 0 25px 50px rgba(0,0,0,0.15);
            }
            .header { 
              background: linear-gradient(135deg, #2563eb, #1d4ed8); 
              color: white; 
              padding: 40px 30px; 
              text-align: center;
              position: relative;
            }
            .header::before {
              content: '';
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
              opacity: 0.1;
              animation: float 20s ease-in-out infinite;
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }
            .header h1 { 
              margin: 0; 
              font-size: 28px; 
              font-weight: 700;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
            }
            .content { 
              padding: 40px 30px; 
              background: linear-gradient(to bottom, #ffffff, #f8fafc);
            }
            .partnership-info {
              background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
              border: 2px solid #0ea5e9;
              border-radius: 16px;
              padding: 25px;
              margin-bottom: 30px;
              position: relative;
            }
            .partnership-info::before {
              content: '🤝';
              position: absolute;
              top: -15px;
              right: 20px;
              background: white;
              padding: 5px 10px;
              border-radius: 50px;
              font-size: 20px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 20px;
              margin-top: 20px;
            }
            .info-item {
              background: white;
              padding: 20px;
              border-radius: 12px;
              border-right: 4px solid #2563eb;
              box-shadow: 0 4px 15px rgba(0,0,0,0.08);
              transition: transform 0.3s ease;
            }
            .info-item:hover {
              transform: translateY(-2px);
            }
            .info-label {
              font-weight: 600;
              color: #1e40af;
              margin-bottom: 8px;
              font-size: 14px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .info-value {
              color: #374151;
              font-size: 16px;
              line-height: 1.5;
            }
            .contact-section {
              background: linear-gradient(135deg, #fef3c7, #fde68a);
              border-radius: 16px;
              padding: 25px;
              margin-top: 30px;
              border: 2px solid #f59e0b;
            }
            .contact-info {
              display: flex;
              justify-content: space-around;
              flex-wrap: wrap;
              gap: 20px;
              margin-top: 15px;
            }
            .contact-item {
              display: flex;
              align-items: center;
              gap: 8px;
              color: #92400e;
              font-weight: 600;
              background: white;
              padding: 10px 16px;
              border-radius: 25px;
              box-shadow: 0 2px 10px rgba(245, 158, 11, 0.2);
            }
            .footer {
              background: #1f2937;
              color: #d1d5db;
              padding: 30px;
              text-align: center;
            }
            .footer-content {
              max-width: 500px;
              margin: 0 auto;
            }
            @media (max-width: 640px) {
              .header, .content, .contact-section { padding: 20px; }
              .info-grid { grid-template-columns: 1fr; }
              .contact-info { flex-direction: column; align-items: center; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>
                🤝 طلب شراكة جديد
              </h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">
                تم استلام طلب شراكة من ${formData.companyName}
              </p>
            </div>
            
            <div class="content">
              <div class="partnership-info">
                <h3 style="margin: 0 0 15px 0; color: #0ea5e9; font-size: 20px;">
                  تفاصيل طلب الشراكة
                </h3>
                
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">🏢 اسم الشركة</div>
                    <div class="info-value">${formData.companyName}</div>
                  </div>
                  
                  <div class="info-item">
                    <div class="info-label">👤 الشخص المسؤول</div>
                    <div class="info-value">${formData.contactPerson}</div>
                  </div>
                  
                  <div class="info-item">
                    <div class="info-label">🎯 نوع الشراكة</div>
                    <div class="info-value">${partnershipTypeLabels[formData.partnershipType] || formData.partnershipType}</div>
                  </div>
                  
                  ${formData.expectedBudget ? `
                  <div class="info-item">
                    <div class="info-label">💰 الميزانية المتوقعة</div>
                    <div class="info-value">${budgetLabels[formData.expectedBudget] || formData.expectedBudget}</div>
                  </div>
                  ` : ''}
                  
                  ${formData.timeline ? `
                  <div class="info-item">
                    <div class="info-label">📅 الإطار الزمني</div>
                    <div class="info-value">${timelineLabels[formData.timeline] || formData.timeline}</div>
                  </div>
                  ` : ''}
                </div>
                
                <div class="info-item" style="margin-top: 20px;">
                  <div class="info-label">📝 وصف الأعمال</div>
                  <div class="info-value">${formData.businessDescription}</div>
                </div>
                
                ${formData.message ? `
                <div class="info-item" style="margin-top: 20px;">
                  <div class="info-label">💬 ملاحظات إضافية</div>
                  <div class="info-value">${formData.message}</div>
                </div>
                ` : ''}
              </div>
              
              <div class="contact-section">
                <h3 style="margin: 0 0 15px 0; color: #92400e; text-align: center;">
                  معلومات التواصل
                </h3>
                <div class="contact-info">
                  <div class="contact-item">
                    📧 ${formData.email}
                  </div>
                  <div class="contact-item">
                    📱 ${formData.phone}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-content">
                <h4 style="margin: 0 0 10px 0; color: white;">شركة علي صالح الشهري القابضة</h4>
                <p style="margin: 0; font-size: 14px;">
                  تم إرسال هذا الإشعار تلقائياً من نظام إدارة طلبات الشراكة
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "Ali AlShehri Holding <info@alialshehriholding.com>",
      to: [formData.email],
      bcc: ["info@alialshehriholding.com"],
      html: `
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>تأكيد طلب الشراكة</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              background: linear-gradient(135deg, #0f766e 0%, #06b6d4 100%);
              margin: 0; 
              padding: 20px; 
              direction: rtl;
            }
            .container { 
              max-width: 650px; 
              margin: 0 auto; 
              background: white; 
              border-radius: 20px; 
              overflow: hidden;
              box-shadow: 0 25px 50px rgba(0,0,0,0.15);
            }
            .header { 
              background: linear-gradient(135deg, #059669, #0d9488); 
              color: white; 
              padding: 40px 30px; 
              text-align: center;
              position: relative;
            }
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
            }
            .header h1 { 
              margin: 0; 
              font-size: 28px; 
              font-weight: 700;
              position: relative;
              z-index: 1;
            }
            .content { 
              padding: 40px 30px; 
              background: linear-gradient(to bottom, #ffffff, #f0fdfa);
            }
            .welcome-box {
              background: linear-gradient(135deg, #d1fae5, #a7f3d0);
              border: 2px solid #10b981;
              border-radius: 16px;
              padding: 25px;
              margin-bottom: 30px;
              text-align: center;
            }
            .status-badge {
              background: linear-gradient(135deg, #10b981, #059669);
              color: white;
              padding: 8px 20px;
              border-radius: 25px;
              font-weight: 600;
              font-size: 14px;
              display: inline-flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 15px;
            }
            .next-steps {
              background: white;
              border: 2px solid #e5e7eb;
              border-radius: 16px;
              padding: 25px;
              margin: 20px 0;
            }
            .step {
              display: flex;
              align-items: flex-start;
              gap: 15px;
              margin-bottom: 20px;
              padding: 15px;
              background: #f9fafb;
              border-radius: 12px;
              border-right: 4px solid #10b981;
            }
            .step:last-child { margin-bottom: 0; }
            .step-number {
              background: linear-gradient(135deg, #10b981, #059669);
              color: white;
              width: 30px;
              height: 30px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 700;
              font-size: 14px;
              flex-shrink: 0;
            }
            .step-content h4 {
              margin: 0 0 5px 0;
              color: #059669;
              font-size: 16px;
            }
            .step-content p {
              margin: 0;
              color: #6b7280;
              line-height: 1.5;
            }
            .contact-section {
              background: linear-gradient(135deg, #fef3c7, #fde68a);
              border-radius: 16px;
              padding: 25px;
              margin-top: 30px;
              text-align: center;
              border: 2px solid #f59e0b;
            }
            .contact-methods {
              display: flex;
              justify-content: center;
              gap: 20px;
              margin-top: 20px;
              flex-wrap: wrap;
            }
            .contact-method {
              background: white;
              padding: 12px 20px;
              border-radius: 25px;
              color: #92400e;
              font-weight: 600;
              text-decoration: none;
              display: flex;
              align-items: center;
              gap: 8px;
              box-shadow: 0 4px 15px rgba(245, 158, 11, 0.2);
              transition: transform 0.3s ease;
            }
            .contact-method:hover {
              transform: translateY(-2px);
            }
            .footer {
              background: #1f2937;
              color: #d1d5db;
              padding: 30px;
              text-align: center;
            }
            @media (max-width: 640px) {
              .header, .content { padding: 20px; }
              .contact-methods { flex-direction: column; align-items: center; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ تم استلام طلب الشراكة بنجاح</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">
                مرحباً ${formData.contactPerson}
              </p>
            </div>
            
            <div class="content">
              <div class="welcome-box">
                <div class="status-badge">
                  🎉 تم الاستلام بنجاح
                </div>
                <h3 style="margin: 0 0 10px 0; color: #047857;">نشكرك على اهتمامك بالشراكة معنا!</h3>
                <p style="margin: 0; color: #065f46; line-height: 1.6;">
                  تم استلام طلب الشراكة من شركة <strong>${formData.companyName}</strong> بنجاح. 
                  فريقنا المختص سيقوم بمراجعة طلبكم والتواصل معكم قريباً.
                </p>
              </div>
              
              <div class="next-steps">
                <h3 style="margin: 0 0 20px 0; color: #374151; text-align: center;">الخطوات القادمة</h3>
                
                <div class="step">
                  <div class="step-number">1</div>
                  <div class="step-content">
                    <h4>مراجعة الطلب</h4>
                    <p>سيقوم فريقنا بمراجعة تفاصيل طلب الشراكة خلال 24 ساعة</p>
                  </div>
                </div>
                
                <div class="step">
                  <div class="step-number">2</div>
                  <div class="step-content">
                    <h4>التواصل الأولي</h4>
                    <p>سنتواصل معكم لمناقشة تفاصيل الشراكة وفرص التعاون</p>
                  </div>
                </div>
                
                <div class="step">
                  <div class="step-number">3</div>
                  <div class="step-content">
                    <h4>اجتماع تقييمي</h4>
                    <p>ترتيب اجتماع لتقييم إمكانيات الشراكة ووضع خطة العمل</p>
                  </div>
                </div>
                
                <div class="step">
                  <div class="step-number">4</div>
                  <div class="step-content">
                    <h4>بدء الشراكة</h4>
                    <p>وضع اللمسات الأخيرة وبدء رحلة الشراكة الناجحة</p>
                  </div>
                </div>
              </div>
              
              <div class="contact-section">
                <h3 style="margin: 0 0 10px 0; color: #92400e;">نحن هنا لمساعدتك</h3>
                <p style="margin: 0 0 20px 0; color: #78350f;">
                  في حال كان لديك أي استفسارات، لا تتردد في التواصل معنا
                </p>
                <div class="contact-methods">
                  <a href="mailto:info@alialshehriholding.com" class="contact-method">
                    📧 info@alialshehriholding.com
                  </a>
                  <a href="tel:+966555812567" class="contact-method">
                    📱 +966 555 812 567
                  </a>
                </div>
              </div>
            </div>
            
            <div class="footer">
              <h4 style="margin: 0 0 10px 0; color: white;">شركة علي صالح الشهري القابضة</h4>
              <p style="margin: 0; font-size: 14px;">
                شراكات استراتيجية • حلول مبتكرة • نجاح مستدام
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Partnership form emails sent successfully");

    return new Response(JSON.stringify({ 
      success: true,
      message: "تم إرسال طلب الشراكة بنجاح"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in partnership-form function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);