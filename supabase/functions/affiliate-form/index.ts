import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AffiliateFormRequest {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  website?: string;
  socialMedia?: string;
  experienceLevel?: string;
  expectedRevenue?: string;
  marketingChannels?: string;
  targetAudience?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: AffiliateFormRequest = await req.json();
    console.log("Received affiliate form data:", formData);

    // Send notification email to company
    const companyEmailResponse = await resend.emails.send({
      from: "نظام التسويق بالعمولة <noreply@alialshehriholding.com>",
      to: ["affiliate@alialshehriholding.com"],
      subject: `🚀 طلب جديد للانضمام لبرنامج التسويق بالعمولة - ${formData.fullName}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>طلب جديد للتسويق بالعمولة</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f8f9fa;
                    margin: 0;
                    padding: 20px;
                    direction: rtl;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                .header {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: bold;
                }
                .header .icon {
                    font-size: 48px;
                    margin-bottom: 15px;
                    display: block;
                }
                .content {
                    padding: 40px;
                }
                .highlight-box {
                    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
                    border: 2px solid #10b981;
                    border-radius: 12px;
                    padding: 25px;
                    margin: 25px 0;
                    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.1);
                }
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin: 25px 0;
                }
                .info-item {
                    background: #f8fafc;
                    border-radius: 10px;
                    padding: 15px;
                    border-right: 4px solid #10b981;
                }
                .info-item strong {
                    display: block;
                    color: #10b981;
                    margin-bottom: 5px;
                    font-weight: 600;
                }
                .contact-info {
                    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
                    border-radius: 12px;
                    padding: 25px;
                    margin: 25px 0;
                    border: 2px solid #3b82f6;
                }
                .contact-item {
                    display: flex;
                    align-items: center;
                    margin: 10px 0;
                    font-size: 16px;
                }
                .contact-icon {
                    width: 24px;
                    height: 24px;
                    margin-left: 10px;
                    background: #3b82f6;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                }
                .urgent-notice {
                    background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
                    border: 2px solid #f59e0b;
                    border-radius: 12px;
                    padding: 20px;
                    margin: 25px 0;
                    text-align: center;
                }
                .footer {
                    background: #1f2937;
                    color: white;
                    text-align: center;
                    padding: 25px;
                }
                @media (max-width: 600px) {
                    .info-grid {
                        grid-template-columns: 1fr;
                    }
                    .container {
                        margin: 10px;
                        border-radius: 10px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <span class="icon">🚀</span>
                    <h1>طلب انضمام جديد لبرنامج التسويق بالعمولة</h1>
                    <p style="margin: 10px 0 0 0; font-size: 18px;">وصل طلب جديد من مسوق محتمل</p>
                </div>
                
                <div class="content">
                    <div class="highlight-box">
                        <h2 style="color: #10b981; margin-top: 0;">📋 معلومات المتقدم</h2>
                        <div class="info-grid">
                            <div class="info-item">
                                <strong>👤 الاسم الكامل:</strong>
                                ${formData.fullName}
                            </div>
                            <div class="info-item">
                                <strong>📧 البريد الإلكتروني:</strong>
                                ${formData.email}
                            </div>
                            <div class="info-item">
                                <strong>📱 رقم الهاتف:</strong>
                                ${formData.phone}
                            </div>
                            ${formData.company ? `
                            <div class="info-item">
                                <strong>🏢 الشركة:</strong>
                                ${formData.company}
                            </div>
                            ` : ''}
                        </div>
                    </div>

                    ${formData.website || formData.socialMedia ? `
                    <div class="highlight-box">
                        <h3 style="color: #10b981; margin-top: 0;">🌐 الحضور الرقمي</h3>
                        ${formData.website ? `
                        <div class="info-item">
                            <strong>🌍 الموقع الإلكتروني:</strong>
                            <a href="${formData.website}" style="color: #3b82f6;">${formData.website}</a>
                        </div>
                        ` : ''}
                        ${formData.socialMedia ? `
                        <div class="info-item">
                            <strong>📱 وسائل التواصل:</strong>
                            ${formData.socialMedia}
                        </div>
                        ` : ''}
                    </div>
                    ` : ''}

                    <div class="highlight-box">
                        <h3 style="color: #10b981; margin-top: 0;">📈 تفاصيل التسويق</h3>
                        <div class="info-grid">
                            ${formData.experienceLevel ? `
                            <div class="info-item">
                                <strong>⭐ مستوى الخبرة:</strong>
                                ${formData.experienceLevel}
                            </div>
                            ` : ''}
                            ${formData.expectedRevenue ? `
                            <div class="info-item">
                                <strong>💰 الإيرادات المتوقعة:</strong>
                                ${formData.expectedRevenue}
                            </div>
                            ` : ''}
                            ${formData.marketingChannels ? `
                            <div class="info-item">
                                <strong>📢 قنوات التسويق:</strong>
                                ${formData.marketingChannels}
                            </div>
                            ` : ''}
                            ${formData.targetAudience ? `
                            <div class="info-item">
                                <strong>🎯 الجمهور المستهدف:</strong>
                                ${formData.targetAudience}
                            </div>
                            ` : ''}
                        </div>
                    </div>

                    ${formData.message ? `
                    <div class="highlight-box">
                        <h3 style="color: #10b981; margin-top: 0;">💬 رسالة إضافية</h3>
                        <p style="background: white; padding: 15px; border-radius: 8px; margin: 0;">${formData.message}</p>
                    </div>
                    ` : ''}

                    <div class="contact-info">
                        <h3 style="color: #3b82f6; margin-top: 0;">📞 معلومات التواصل السريع</h3>
                        <div class="contact-item">
                            <span class="contact-icon">📧</span>
                            <a href="mailto:${formData.email}" style="color: #3b82f6; text-decoration: none;">${formData.email}</a>
                        </div>
                        <div class="contact-item">
                            <span class="contact-icon">📱</span>
                            <a href="tel:${formData.phone}" style="color: #3b82f6; text-decoration: none;">${formData.phone}</a>
                        </div>
                    </div>

                    <div class="urgent-notice">
                        <h3 style="color: #f59e0b; margin-top: 0;">⚡ إجراء مطلوب</h3>
                        <p style="margin: 0; font-size: 16px; font-weight: 500;">
                            يرجى مراجعة الطلب والتواصل مع المتقدم خلال 24 ساعة لضمان خدمة عملاء متميزة
                        </p>
                    </div>
                </div>

                <div class="footer">
                    <p style="margin: 0; font-size: 14px;">
                        هذه رسالة تلقائية من نظام التسويق بالعمولة<br>
                        شركة علي صالح الشهري القابضة<br>
                        <strong>📧 affiliate@alialshehriholding.com | 📱 +966 555 812 567</strong>
                    </p>
                </div>
            </div>
        </body>
        </html>
      `,
    });

    console.log("Company email sent:", companyEmailResponse);

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "فريق التسويق بالعمولة <affiliate@alialshehriholding.com>",
      to: [formData.email],
      subject: `🎉 مرحباً ${formData.fullName}! تم استلام طلب انضمامك لبرنامج التسويق بالعمولة`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>تأكيد استلام طلب التسويق بالعمولة</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f8f9fa;
                    margin: 0;
                    padding: 20px;
                    direction: rtl;
                }
                .container {
                    max-width: 700px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                .header {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    padding: 40px 30px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0 0 10px 0;
                    font-size: 32px;
                    font-weight: bold;
                }
                .welcome-icon {
                    font-size: 64px;
                    margin-bottom: 20px;
                    display: block;
                }
                .content {
                    padding: 40px 30px;
                }
                .welcome-box {
                    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
                    border: 2px solid #10b981;
                    border-radius: 15px;
                    padding: 30px;
                    text-align: center;
                    margin: 30px 0;
                }
                .next-steps {
                    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
                    border-radius: 12px;
                    padding: 25px;
                    margin: 25px 0;
                    border: 2px solid #3b82f6;
                }
                .step {
                    display: flex;
                    align-items: flex-start;
                    margin: 15px 0;
                    padding: 15px;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .step-number {
                    background: #3b82f6;
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    margin-left: 15px;
                    flex-shrink: 0;
                }
                .benefits {
                    background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
                    border-radius: 12px;
                    padding: 25px;
                    margin: 25px 0;
                    border: 2px solid #f59e0b;
                }
                .benefit-item {
                    display: flex;
                    align-items: center;
                    margin: 12px 0;
                    font-size: 16px;
                }
                .benefit-icon {
                    margin-left: 10px;
                    font-size: 20px;
                }
                .contact-section {
                    background: #1f2937;
                    color: white;
                    border-radius: 12px;
                    padding: 25px;
                    margin: 25px 0;
                    text-align: center;
                }
                .contact-item {
                    display: inline-flex;
                    align-items: center;
                    margin: 10px 15px;
                    color: #10b981;
                    text-decoration: none;
                    font-weight: 500;
                }
                .contact-icon {
                    margin-left: 8px;
                    font-size: 18px;
                }
                .footer {
                    background: #f8f9fa;
                    text-align: center;
                    padding: 25px;
                    color: #6b7280;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <span class="welcome-icon">🎉</span>
                    <h1>مرحباً ${formData.fullName}!</h1>
                    <p style="font-size: 18px; margin: 0;">تم استلام طلب انضمامك لبرنامج التسويق بالعمولة بنجاح</p>
                </div>

                <div class="content">
                    <div class="welcome-box">
                        <h2 style="color: #10b981; margin-top: 0;">🚀 أهلاً بك في مجتمع المسوقين المحترفين!</h2>
                        <p style="font-size: 18px; margin: 0;">
                            نحن متحمسون لإمكانية العمل معك وبناء شراكة مثمرة ومربحة للجميع
                        </p>
                    </div>

                    <div class="next-steps">
                        <h3 style="color: #3b82f6; margin-top: 0; text-align: center;">📋 الخطوات التالية</h3>
                        
                        <div class="step">
                            <div class="step-number">1</div>
                            <div>
                                <strong>مراجعة الطلب (خلال 24 ساعة)</strong><br>
                                سيقوم فريقنا المختص بمراجعة طلبك وتقييم ملفك الشخصي
                            </div>
                        </div>

                        <div class="step">
                            <div class="step-number">2</div>
                            <div>
                                <strong>مكالمة التقييم</strong><br>
                                سنتصل بك لمناقشة تفاصيل البرنامج وإجراء مقابلة سريعة
                            </div>
                        </div>

                        <div class="step">
                            <div class="step-number">3</div>
                            <div>
                                <strong>الموافقة والتدريب</strong><br>
                                عند الموافقة، ستحصل على دليل المسوق وحسابك في نظام التتبع
                            </div>
                        </div>

                        <div class="step">
                            <div class="step-number">4</div>
                            <div>
                                <strong>بداية الربح! 💰</strong><br>
                                ابدأ التسويق واحصل على عمولات مجزية من كل عملية بيع ناجحة
                            </div>
                        </div>
                    </div>

                    <div class="benefits">
                        <h3 style="color: #f59e0b; margin-top: 0; text-align: center;">🎁 ما ستحصل عليه معنا</h3>
                        
                        <div class="benefit-item">
                            <span class="benefit-icon">💰</span>
                            <span>عمولات تصل إلى 15% من قيمة المبيعات</span>
                        </div>
                        
                        <div class="benefit-item">
                            <span class="benefit-icon">📈</span>
                            <span>نظام تتبع متطور ولوحة تحكم احترافية</span>
                        </div>
                        
                        <div class="benefit-item">
                            <span class="benefit-icon">🎨</span>
                            <span>مواد تسويقية جاهزة عالية الجودة</span>
                        </div>
                        
                        <div class="benefit-item">
                            <span class="benefit-icon">⚡</span>
                            <span>دفع العمولات خلال 30 يوم</span>
                        </div>
                        
                        <div class="benefit-item">
                            <span class="benefit-icon">🎓</span>
                            <span>تدريب مجاني على أحدث استراتيجيات التسويق</span>
                        </div>
                        
                        <div class="benefit-item">
                            <span class="benefit-icon">🏆</span>
                            <span>برامج مكافآت وحوافز شهرية</span>
                        </div>
                    </div>

                    <div class="contact-section">
                        <h3 style="margin-top: 0;">📞 تواصل معنا</h3>
                        <p style="margin-bottom: 20px;">هل لديك أسئلة؟ فريقنا جاهز لمساعدتك</p>
                        
                        <div>
                            <a href="mailto:affiliate@alialshehriholding.com" class="contact-item">
                                <span class="contact-icon">📧</span>
                                affiliate@alialshehriholding.com
                            </a>
                            
                            <a href="tel:+966555812567" class="contact-item">
                                <span class="contact-icon">📱</span>
                                +966 555 812 567
                            </a>
                        </div>
                    </div>

                    <div style="text-align: center; margin: 30px 0;">
                        <p style="font-size: 18px; color: #10b981; font-weight: bold;">
                            🌟 نتطلع للعمل معك قريباً! 🌟
                        </p>
                    </div>
                </div>

                <div class="footer">
                    <p style="margin: 0;">
                        هذه رسالة تأكيد تلقائية من فريق التسويق بالعمولة<br>
                        <strong>شركة علي صالح الشهري القابضة</strong><br>
                        المملكة العربية السعودية - جدة
                    </p>
                </div>
            </div>
        </body>
        </html>
      `,
    });

    console.log("Customer email sent:", customerEmailResponse);

    return new Response(
      JSON.stringify({ 
        message: "تم إرسال طلب التسويق بالعمولة بنجاح",
        companyEmailId: companyEmailResponse.data?.id,
        customerEmailId: customerEmailResponse.data?.id 
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
    console.error("Error in affiliate-form function:", error);
    return new Response(
      JSON.stringify({ 
        error: "حدث خطأ في إرسال النموذج",
        message: error.message 
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