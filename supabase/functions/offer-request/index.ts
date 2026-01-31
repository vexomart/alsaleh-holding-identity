import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OfferRequestData {
  offer: {
    id: number;
    title: string;
    currentPrice: string;
    originalPrice: string;
    discount: string;
    timeLeft: string;
    features: string[];
  };
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    company?: string;
    message?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { offer, customerInfo }: OfferRequestData = await req.json();

    // البيانات المطلوبة
    if (!offer || !customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.phone) {
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
      from: "ASH Holding <info@ash-holding.sa>",
      to: ["info@ash-holding.sa"],
      bcc: ["info@ash-holding.sa"],
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>طلب عرض جديد</title>
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
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
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
            .offer-badge {
              display: inline-block;
              background: rgba(255,255,255,0.2);
              backdrop-filter: blur(10px);
              padding: 15px 25px;
              border-radius: 15px;
              margin: 25px 0;
              border: 1px solid rgba(255,255,255,0.3);
            }
            .offer-title {
              font-size: 24px;
              font-weight: 800;
              margin-bottom: 20px;
              color: #1a202c;
              text-align: center;
              background: linear-gradient(135deg, #667eea, #764ba2);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            .price-section {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 15px;
              margin: 20px 0;
              flex-wrap: wrap;
            }
            .current-price {
              font-size: 36px;
              font-weight: 900;
              color: #48bb78;
              text-shadow: 0 2px 4px rgba(72, 187, 120, 0.3);
            }
            .original-price {
              font-size: 24px;
              color: #a0aec0;
              text-decoration: line-through;
              font-weight: 600;
            }
            .discount-badge {
              background: linear-gradient(135deg, #e53e3e, #c53030);
              color: white;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 16px;
              font-weight: 800;
              box-shadow: 0 4px 12px rgba(229, 62, 62, 0.4);
              animation: pulse 2s infinite;
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
            .time-left {
              background: linear-gradient(135deg, #e53e3e, #c53030);
              color: white;
              padding: 12px 20px;
              border-radius: 12px;
              margin: 20px 0;
              text-align: center;
              font-weight: 800;
              font-size: 18px;
              box-shadow: 0 4px 12px rgba(229, 62, 62, 0.3);
            }
            .content-section {
              padding: 40px 30px;
            }
            .features-title {
              font-size: 22px;
              font-weight: 800;
              color: #2d3748;
              margin: 30px 0 20px 0;
              text-align: center;
              position: relative;
            }
            .features-title::before,
            .features-title::after {
              content: '✨';
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              font-size: 20px;
            }
            .features-title::before {
              right: -40px;
            }
            .features-title::after {
              left: -40px;
            }
            .features-list {
              list-style: none;
              padding: 0;
              margin: 0;
            }
            .features-list li {
              padding: 12px 0;
              border-bottom: 1px solid rgba(226, 232, 240, 0.8);
              position: relative;
              padding-right: 40px;
              font-size: 16px;
              line-height: 1.6;
            }
            .features-list li::before {
              content: '✅';
              position: absolute;
              right: 0;
              top: 12px;
              font-size: 18px;
            }
            .features-list li:last-child {
              border-bottom: none;
            }
            .customer-section {
              background: linear-gradient(135deg, #f7fafc, #edf2f7);
              margin: 30px 0;
              padding: 30px;
              border-radius: 15px;
              border: 2px solid #e2e8f0;
            }
            .customer-title {
              font-size: 24px;
              font-weight: 800;
              color: #2d3748;
              margin-bottom: 25px;
              text-align: center;
              background: linear-gradient(135deg, #4299e1, #3182ce);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            .info-grid {
              display: grid;
              gap: 15px;
            }
            .info-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 15px 20px;
              background: white;
              border-radius: 12px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.05);
              border-right: 4px solid #4299e1;
            }
            .info-label {
              font-weight: 700;
              color: #4a5568;
              font-size: 16px;
            }
            .info-value {
              color: #2d3748;
              font-weight: 600;
              font-size: 16px;
            }
            .footer-section {
              background: linear-gradient(135deg, #2d3748, #4a5568);
              color: white;
              padding: 30px;
              text-align: center;
              margin-top: 30px;
            }
            .footer-section h3 {
              font-size: 22px;
              font-weight: 800;
              margin-bottom: 15px;
            }
            .footer-section p {
              font-size: 16px;
              margin: 8px 0;
              opacity: 0.95;
            }
            .footer-section a {
              color: #81e6d9;
              text-decoration: none;
              font-weight: 700;
            }
            .footer-section a:hover {
              text-decoration: underline;
            }
            .savings-highlight {
              background: linear-gradient(135deg, #48bb78, #38a169);
              color: white;
              padding: 15px 25px;
              border-radius: 15px;
              text-align: center;
              margin: 20px 0;
              font-size: 20px;
              font-weight: 800;
              box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="header-content">
                <h1>🎯 طلب عرض جديد</h1>
                <p><strong>شركة علي صالح الشهري القابضة</strong></p>
                <p>📅 التاريخ: ${currentDate}</p>
                <div class="offer-badge">
                  <strong>⚡ عرض محدود الوقت</strong>
                </div>
              </div>
            </div>

            <div class="content-section">
              <h2 class="offer-title">📋 تفاصيل العرض المطلوب</h2>
              
              <h3 style="font-size: 28px; font-weight: 800; color: #2d3748; text-align: center; margin: 20px 0;">
                ${offer.title}
              </h3>
              
              <div class="price-section">
                <span class="current-price">${offer.currentPrice} ر.س</span>
                <span class="original-price">${offer.originalPrice} ر.س</span>
                <span class="discount-badge">خصم ${offer.discount}</span>
              </div>

              <div class="savings-highlight">
                💰 توفير ${parseInt(offer.originalPrice) - parseInt(offer.currentPrice)} ريال سعودي
              </div>

              <div class="time-left">
                ⏰ الوقت المتبقي للعرض: ${offer.timeLeft}
              </div>

              <h4 class="features-title">مميزات العرض</h4>
              <ul class="features-list">
                ${offer.features.map(feature => `<li>${feature}</li>`).join('')}
              </ul>

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
                  
                  ${customerInfo.message ? `
                  <div class="info-item">
                    <span class="info-label">💬 رسالة إضافية:</span>
                    <span class="info-value">${customerInfo.message}</span>
                  </div>
                  ` : ''}
                </div>
              </div>
            </div>

            <div class="footer-section">
              <h3>🚀 يرجى التواصل مع العميل في أقرب وقت ممكن</h3>
              <p>📞 للتواصل: <a href="tel:${customerInfo.phone}">${customerInfo.phone}</a></p>
              <p>📧 البريد: <a href="mailto:${customerInfo.email}">${customerInfo.email}</a></p>
              <p style="margin-top: 20px; font-size: 14px; opacity: 0.8;">
                شركة علي صالح الشهري القابضة - شريكك الأمثل في النجاح التقني
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
      from: "ASH Holding <info@ash-holding.sa>",
      to: [customerInfo.email],
      bcc: ["info@ash-holding.sa"],
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>تأكيد استلام الطلب</title>
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
              background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
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
              background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
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
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
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
            .offer-summary {
              background: linear-gradient(135deg, #f7fafc, #edf2f7);
              border-radius: 15px;
              padding: 30px;
              margin: 30px 0;
              border-right: 6px solid #48bb78;
              box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            }
            .offer-summary h3 {
              font-size: 22px;
              font-weight: 800;
              color: #2d3748;
              margin-bottom: 20px;
              text-align: center;
              background: linear-gradient(135deg, #48bb78, #38a169);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            .offer-title {
              font-size: 24px;
              font-weight: 800;
              color: #2d3748;
              margin-bottom: 20px;
              text-align: center;
            }
            .price-highlight {
              color: #48bb78;
              font-size: 28px;
              font-weight: 900;
              text-align: center;
              margin: 15px 0;
              text-shadow: 0 2px 4px rgba(72, 187, 120, 0.3);
            }
            .price-highlight small {
              text-decoration: line-through;
              color: #a0aec0;
              font-size: 18px;
              font-weight: 600;
              margin-right: 15px;
            }
            .time-warning {
              color: #e53e3e;
              font-weight: 800;
              text-align: center;
              background: linear-gradient(135deg, #fed7d7, #feb2b2);
              padding: 15px;
              border-radius: 12px;
              margin: 20px 0;
              border: 2px solid #fc8181;
            }
            .next-steps {
              background: linear-gradient(135deg, #fffaf0, #fef5e7);
              border: 3px solid #f6ad55;
              border-radius: 15px;
              padding: 30px;
              margin: 30px 0;
            }
            .next-steps h3 {
              font-size: 22px;
              font-weight: 800;
              color: #c05621;
              margin-bottom: 20px;
              text-align: center;
            }
            .next-steps ul {
              list-style: none;
              padding: 0;
              margin: 0;
            }
            .next-steps li {
              padding: 12px 0;
              position: relative;
              padding-right: 40px;
              font-size: 16px;
              color: #744210;
              font-weight: 600;
              border-bottom: 1px solid rgba(246, 173, 85, 0.3);
            }
            .next-steps li:last-child {
              border-bottom: none;
            }
            .next-steps li::before {
              position: absolute;
              right: 0;
              top: 12px;
              font-size: 18px;
            }
            .next-steps li:nth-child(1)::before { content: '✅'; }
            .next-steps li:nth-child(2)::before { content: '📞'; }
            .next-steps li:nth-child(3)::before { content: '📋'; }
            .next-steps li:nth-child(4)::before { content: '📝'; }
            .next-steps li:nth-child(5)::before { content: '🎯'; }
            .contact-info {
              background: linear-gradient(135deg, #ebf8ff, #bee3f8);
              border-radius: 15px;
              padding: 30px;
              margin: 30px 0;
              text-align: center;
              border: 2px solid #90cdf4;
            }
            .contact-info h3 {
              font-size: 22px;
              font-weight: 800;
              color: #2b6cb0;
              margin-bottom: 20px;
            }
            .contact-info p {
              font-size: 18px;
              color: #2c5282;
              margin: 10px 0;
              font-weight: 600;
            }
            .contact-info a {
              color: #2b6cb0;
              text-decoration: none;
              font-weight: 800;
              background: rgba(255,255,255,0.7);
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
              background: linear-gradient(135deg, #2d3748, #4a5568);
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
            .savings-badge {
              background: linear-gradient(135deg, #48bb78, #38a169);
              color: white;
              padding: 12px 20px;
              border-radius: 20px;
              display: inline-block;
              font-weight: 800;
              margin: 15px 0;
              box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="header-content">
                <h1>🎉 شكراً لك عزيزي ${customerInfo.name}</h1>
                <p><strong>تم استلام طلبك بنجاح!</strong></p>
                <p>📅 ${currentDate}</p>
                <div class="success-badge">
                  ✅ طلبك قيد المراجعة الآن
                </div>
              </div>
            </div>

            <div class="content-section">
              <p class="welcome-text">
                <strong>مرحباً ${customerInfo.name}،</strong><br>
                نشكرك على اختيارك شركة <strong>علي صالح الشهري القابضة</strong> لتقديم خدماتنا التقنية المتميزة.
              </p>
              
              <div class="offer-summary">
                <h3>📋 ملخص طلبك</h3>
                <h4 class="offer-title">${offer.title}</h4>
                <p class="price-highlight">
                  ${offer.currentPrice} ر.س 
                  <small>${offer.originalPrice} ر.س</small>
                </p>
                <div class="savings-badge">
                  💰 توفير ${parseInt(offer.originalPrice) - parseInt(offer.currentPrice)} ريال سعودي
                </div>
                <p class="time-warning">⏰ العرض ساري حتى: ${offer.timeLeft}</p>
              </div>

              <div class="next-steps">
                <h3>🚀 الخطوات التالية</h3>
                <ul>
                  <li>تم استلام طلبك وتسجيله في نظامنا</li>
                  <li>سيتم التواصل معك خلال 24 ساعة</li>
                  <li>مراجعة متطلبات المشروع معك بالتفصيل</li>
                  <li>تقديم عرض سعر تفصيلي ونهائي</li>
                  <li>البدء في تنفيذ مشروعك فور الموافقة</li>
                </ul>
              </div>

              <div class="contact-info">
                <h3>📞 للتواصل السريع معنا</h3>
                <p><strong>واتساب:</strong> <a href="https://wa.me/966555812567">0555812567</a></p>
                <p><strong>البريد الإلكتروني:</strong> <a href="mailto:info@ash-holding.sa">info@ash-holding.sa</a></p>
                <p style="margin-top: 20px; color: #2c5282; font-size: 16px;">
                  💡 <strong>نصيحة:</strong> احتفظ بهذا الإيميل كمرجع لطلبك
                </p>
              </div>
            </div>

            <div class="footer-section">
              <h3>🏢 شركة علي صالح الشهري القابضة</h3>
              <p><strong>شريكك الأمثل في النجاح التقني 🚀</strong></p>
              <p>نقدم أفضل الحلول التقنية والتسويقية لنجاح عملك</p>
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
        message: "تم إرسال الطلب بنجاح",
        companyEmailId: companyEmailResponse.data?.id,
        customerEmailId: customerEmailResponse.data?.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in offer-request function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "حدث خطأ في إرسال الطلب" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);