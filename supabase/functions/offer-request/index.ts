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
      from: "noreply@alialshehriholding.com",
      to: ["info@alialshehriholding.com"],
      subject: `🎯 طلب عرض جديد - ${offer.title}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>طلب عرض جديد</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              direction: rtl;
              text-align: right;
            }
            .container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 15px;
              padding: 30px;
              color: white;
              margin-bottom: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .offer-card {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 10px;
              padding: 20px;
              margin: 20px 0;
              backdrop-filter: blur(10px);
            }
            .customer-info {
              background: white;
              color: #333;
              border-radius: 10px;
              padding: 25px;
              margin: 20px 0;
              box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 10px 0;
              border-bottom: 1px solid #eee;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .label {
              font-weight: bold;
              color: #4a5568;
            }
            .value {
              color: #2d3748;
            }
            .features-list {
              list-style: none;
              padding: 0;
            }
            .features-list li {
              padding: 8px 0;
              border-bottom: 1px solid rgba(255,255,255,0.2);
            }
            .features-list li:before {
              content: "✅ ";
              margin-left: 10px;
            }
            .price-info {
              display: flex;
              align-items: center;
              gap: 15px;
              margin: 15px 0;
            }
            .current-price {
              font-size: 24px;
              font-weight: bold;
              color: #48bb78;
            }
            .original-price {
              text-decoration: line-through;
              color: #a0aec0;
              font-size: 18px;
            }
            .discount {
              background: #e53e3e;
              color: white;
              padding: 5px 10px;
              border-radius: 15px;
              font-size: 14px;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding: 20px;
              background: #f7fafc;
              border-radius: 10px;
              color: #4a5568;
            }
            .urgent {
              background: #e53e3e;
              color: white;
              padding: 10px;
              border-radius: 5px;
              margin: 10px 0;
              text-align: center;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 طلب عرض جديد</h1>
              <p>شركة علي صالح الشهري القابضة</p>
              <p>📅 التاريخ: ${currentDate}</p>
            </div>

            <div class="offer-card">
              <h2>📋 تفاصيل العرض المطلوب</h2>
              <h3>${offer.title}</h3>
              
              <div class="price-info">
                <span class="current-price">${offer.currentPrice} ر.س</span>
                <span class="original-price">${offer.originalPrice} ر.س</span>
                <span class="discount">خصم ${offer.discount}</span>
              </div>

              <div class="urgent">
                ⏰ الوقت المتبقي للعرض: ${offer.timeLeft}
              </div>

              <h4>✨ مميزات العرض:</h4>
              <ul class="features-list">
                ${offer.features.map(feature => `<li>${feature}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="customer-info">
            <h2>👤 بيانات العميل</h2>
            
            <div class="info-row">
              <span class="label">👤 الاسم:</span>
              <span class="value">${customerInfo.name}</span>
            </div>
            
            <div class="info-row">
              <span class="label">📧 البريد الإلكتروني:</span>
              <span class="value">${customerInfo.email}</span>
            </div>
            
            <div class="info-row">
              <span class="label">📱 رقم الجوال:</span>
              <span class="value">${customerInfo.phone}</span>
            </div>
            
            ${customerInfo.company ? `
            <div class="info-row">
              <span class="label">🏢 الشركة:</span>
              <span class="value">${customerInfo.company}</span>
            </div>
            ` : ''}
            
            ${customerInfo.message ? `
            <div class="info-row">
              <span class="label">💬 رسالة إضافية:</span>
              <span class="value">${customerInfo.message}</span>
            </div>
            ` : ''}
          </div>

          <div class="footer">
            <p><strong>يرجى التواصل مع العميل في أقرب وقت ممكن</strong></p>
            <p>📞 للتواصل: <a href="tel:${customerInfo.phone}">${customerInfo.phone}</a></p>
            <p>📧 البريد: <a href="mailto:${customerInfo.email}">${customerInfo.email}</a></p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Company email sent:", companyEmailResponse);

    // إرسال بريد تأكيد للعميل
    const customerEmailResponse = await resend.emails.send({
      from: "noreply@alialshehriholding.com",
      to: [customerInfo.email],
      subject: `✅ تأكيد استلام طلبك - ${offer.title}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>تأكيد استلام الطلب</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              direction: rtl;
              text-align: right;
            }
            .container {
              background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
              border-radius: 15px;
              padding: 30px;
              color: white;
              margin-bottom: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .content {
              background: white;
              color: #333;
              border-radius: 10px;
              padding: 25px;
              margin: 20px 0;
            }
            .offer-summary {
              background: #f7fafc;
              border-radius: 10px;
              padding: 20px;
              margin: 20px 0;
              border-right: 4px solid #48bb78;
            }
            .contact-info {
              background: #ebf8ff;
              border-radius: 10px;
              padding: 20px;
              margin: 20px 0;
              text-align: center;
            }
            .price-highlight {
              color: #48bb78;
              font-size: 24px;
              font-weight: bold;
            }
            .next-steps {
              background: #fffaf0;
              border: 2px solid #fbd38d;
              border-radius: 10px;
              padding: 20px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding: 20px;
              background: #f7fafc;
              border-radius: 10px;
              color: #4a5568;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 شكراً لك عزيزي ${customerInfo.name}</h1>
              <p>تم استلام طلبك بنجاح!</p>
              <p>📅 ${currentDate}</p>
            </div>
          </div>

          <div class="content">
            <p>مرحباً ${customerInfo.name}،</p>
            
            <p>نشكرك على اختيارك شركة <strong>علي صالح الشهري القابضة</strong> لتقديم خدماتنا التقنية المتميزة.</p>
            
            <div class="offer-summary">
              <h3>📋 ملخص طلبك:</h3>
              <h4>${offer.title}</h4>
              <p class="price-highlight">${offer.currentPrice} ر.س <small style="text-decoration: line-through; color: #666;">${offer.originalPrice} ر.س</small></p>
              <p style="color: #e53e3e; font-weight: bold;">⏰ العرض ساري حتى: ${offer.timeLeft}</p>
            </div>

            <div class="next-steps">
              <h3>🚀 الخطوات التالية:</h3>
              <ul>
                <li>✅ تم استلام طلبك وتسجيله في نظامنا</li>
                <li>📞 سيتم التواصل معك خلال 24 ساعة</li>
                <li>📋 مراجعة متطلبات المشروع معك</li>
                <li>📝 تقديم عرض سعر تفصيلي</li>
                <li>🎯 البدء في تنفيذ مشروعك</li>
              </ul>
            </div>

            <div class="contact-info">
              <h3>📞 للتواصل السريع:</h3>
              <p><strong>واتساب:</strong> <a href="https://wa.me/966555812567">0555812567</a></p>
              <p><strong>البريد الإلكتروني:</strong> <a href="mailto:info@alialshehriholding.com">info@alialshehriholding.com</a></p>
            </div>
          </div>

          <div class="footer">
            <p><strong>شركة علي صالح الشهري القابضة</strong></p>
            <p>شريكك الأمثل في النجاح التقني 🚀</p>
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