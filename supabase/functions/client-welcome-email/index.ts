import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { supabase } from "../_shared/supabase.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  clientName: string;
  clientEmail: string;
  clientId?: string;
  sector?: string;
}

const createWelcomeEmailTemplate = (clientName: string, clientId?: string, sector?: string) => {
  const sectorText = sector === 'private' ? 'القطاع الخاص' : 
                   sector === 'government' ? 'القطاع الحكومي' :
                   sector === 'nonprofit' ? 'القطاع غير الربحي' :
                   sector === 'semi_government' ? 'القطاع شبه الحكومي' : 'عميلنا';

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>مرحباً بك في عائلة شركة علي الشهري</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          direction: rtl;
          text-align: right;
          min-height: 100vh;
          padding: 20px;
        }
        
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          animation: slideIn 0.6s ease-out;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 30px;
          text-align: center;
          color: white;
          position: relative;
          overflow: hidden;
        }
        
        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: pulse 3s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        
        .logo {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: bold;
          position: relative;
          z-index: 1;
        }
        
        .welcome-title {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
          position: relative;
          z-index: 1;
        }
        
        .welcome-subtitle {
          font-size: 16px;
          opacity: 0.9;
          position: relative;
          z-index: 1;
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .greeting {
          font-size: 24px;
          color: #2d3748;
          margin-bottom: 20px;
          font-weight: 600;
        }
        
        .message {
          font-size: 16px;
          color: #4a5568;
          line-height: 1.8;
          margin-bottom: 30px;
        }
        
        .client-info {
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          border-radius: 15px;
          padding: 25px;
          margin: 30px 0;
          border-right: 5px solid #667eea;
        }
        
        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .info-item:last-child {
          border-bottom: none;
        }
        
        .info-label {
          font-weight: 600;
          color: #2d3748;
        }
        
        .info-value {
          color: #667eea;
          font-weight: 500;
        }
        
        .cta-section {
          text-align: center;
          margin: 40px 0;
        }
        
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px 35px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
        }
        
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin: 30px 0;
        }
        
        .service-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease;
          border: 2px solid #f7fafc;
        }
        
        .service-card:hover {
          transform: translateY(-5px);
          border-color: #667eea;
        }
        
        .service-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
        }
        
        .service-title {
          font-size: 16px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 8px;
        }
        
        .service-desc {
          font-size: 14px;
          color: #718096;
          line-height: 1.6;
        }
        
        .footer {
          background: #2d3748;
          color: white;
          padding: 30px;
          text-align: center;
        }
        
        .contact-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        
        .social-links {
          margin-top: 20px;
        }
        
        .social-link {
          display: inline-block;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          margin: 0 5px;
          line-height: 40px;
          text-decoration: none;
          color: white;
          transition: background 0.3s ease;
        }
        
        .social-link:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        @media (max-width: 600px) {
          .email-container {
            margin: 10px;
            border-radius: 15px;
          }
          
          .header {
            padding: 30px 20px;
          }
          
          .content {
            padding: 30px 20px;
          }
          
          .welcome-title {
            font-size: 24px;
          }
          
          .greeting {
            font-size: 20px;
          }
          
          .services-grid {
            grid-template-columns: 1fr;
          }
          
          .contact-info {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="logo">ع ش</div>
          <div class="welcome-title">أهلاً وسهلاً بك</div>
          <div class="welcome-subtitle">شركة علي صالح الشهري القابضة</div>
        </div>
        
        <div class="content">
          <div class="greeting">مرحباً ${clientName}،</div>
          
          <div class="message">
            يسعدنا انضمامك إلى عائلة عملائنا الكرام في شركة علي صالح الشهري القابضة. نحن متحمسون لبناء شراكة استراتيجية معك وتقديم أفضل الخدمات التقنية والاستشارية التي تساعدك على تحقيق أهدافك.
          </div>
          
          ${clientId ? `
          <div class="client-info">
            <div class="info-item">
              <span class="info-label">رقم العميل:</span>
              <span class="info-value">${clientId}</span>
            </div>
            <div class="info-item">
              <span class="info-label">القطاع:</span>
              <span class="info-value">${sectorText}</span>
            </div>
            <div class="info-item">
              <span class="info-label">تاريخ التسجيل:</span>
              <span class="info-value">${new Date().toLocaleDateString('ar-SA')}</span>
            </div>
          </div>
          ` : ''}
          
          <div class="cta-section">
            <a href="https://alialshehriholding.com/contact" class="cta-button">
              تواصل معنا الآن
            </a>
          </div>
          
          <div class="services-grid">
            <div class="service-card">
              <div class="service-icon">💼</div>
              <div class="service-title">الخدمات التقنية</div>
              <div class="service-desc">تطوير المواقع والتطبيقات الذكية</div>
            </div>
            <div class="service-card">
              <div class="service-icon">🚀</div>
              <div class="service-title">التحول الرقمي</div>
              <div class="service-desc">حلول متطورة للتحول الرقمي</div>
            </div>
            <div class="service-card">
              <div class="service-icon">📊</div>
              <div class="service-title">الاستشارات</div>
              <div class="service-desc">استشارات تقنية واستراتيجية متخصصة</div>
            </div>
            <div class="service-card">
              <div class="service-icon">🔒</div>
              <div class="service-title">الأمن السيبراني</div>
              <div class="service-desc">حماية شاملة للبيانات والأنظمة</div>
            </div>
          </div>
          
          <div class="message">
            <strong>خطواتك التالية:</strong>
            <ul style="margin: 15px 0; padding-right: 20px;">
              <li style="margin-bottom: 8px;">مراجعة خدماتنا المتاحة</li>
              <li style="margin-bottom: 8px;">حجز استشارة مجانية مع فريقنا</li>
              <li style="margin-bottom: 8px;">اكتشاف الحلول المناسبة لاحتياجاتك</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <div class="contact-info">
            <div class="contact-item">
              📧 info@alialshehriholding.com
            </div>
            <div class="contact-item">
              📱 +966 50 123 4567
            </div>
            <div class="contact-item">
              🌐 alialshehriholding.com
            </div>
          </div>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="margin-bottom: 10px;">تابعنا على وسائل التواصل الاجتماعي</p>
            <div class="social-links">
              <a href="#" class="social-link">تويتر</a>
              <a href="#" class="social-link">لينكد إن</a>
              <a href="#" class="social-link">يوتيوب</a>
            </div>
          </div>
          
          <div style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
            © 2024 شركة علي صالح الشهري القابضة. جميع الحقوق محفوظة.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clientName, clientEmail, clientId, sector }: WelcomeEmailRequest = await req.json();

    console.log(`📧 إرسال إيميل ترحيبي للعميل: ${clientName} (${clientEmail})`);

    const emailHTML = createWelcomeEmailTemplate(clientName, clientId, sector);

    const emailResponse = await resend.emails.send({
      from: "شركة علي الشهري <info@alialshehriholding.com>",
      to: [clientEmail],
      subject: `🎉 مرحباً بك ${clientName} في عائلة شركة علي الشهري القابضة`,
      html: emailHTML,
    });

    // إرسال إشعار للإدارة
    const adminEmailResponse = await resend.emails.send({
      from: "نظام العملاء <info@alialshehriholding.com>",
      to: ["info@alialshehriholding.com"],
      subject: `🆕 عميل جديد: ${clientName}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2d3748; border-bottom: 3px solid #667eea; padding-bottom: 10px;">عميل جديد تم تسجيله</h2>
          
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>اسم العميل:</strong> ${clientName}</p>
            <p><strong>البريد الإلكتروني:</strong> ${clientEmail}</p>
            ${clientId ? `<p><strong>رقم العميل:</strong> ${clientId}</p>` : ''}
            ${sector ? `<p><strong>القطاع:</strong> ${sector}</p>` : ''}
            <p><strong>تاريخ التسجيل:</strong> ${new Date().toLocaleString('ar-SA')}</p>
          </div>
          
          <p style="color: #4a5568;">تم إرسال إيميل ترحيبي للعميل بنجاح.</p>
          
          <div style="margin-top: 30px; padding: 15px; background: #e6fffa; border-right: 4px solid #38b2ac; border-radius: 4px;">
            <p style="margin: 0; color: #2d3748;">يرجى متابعة العميل والتواصل معه في أقرب وقت ممكن.</p>
          </div>
        </div>
      `,
    });

    console.log("✅ تم إرسال الإيميلات بنجاح:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال إيميل الترحيب بنجاح",
        clientEmail: emailResponse,
        adminNotification: adminEmailResponse
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("❌ خطأ في إرسال إيميل الترحيب:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);