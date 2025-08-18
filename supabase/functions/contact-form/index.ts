import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  category?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const contactData: ContactFormData = await req.json();
    
    console.log("Received contact form:", contactData);

    // Send email to company
    const companyEmailResponse = await resend.emails.send({
      from: "Ali AlShehri Holding <info@alialshehriholding.com>",
      to: ["info@alialshehriholding.com"],
      bcc: ["info@alialshehriholding.com"],
      subject: `رسالة جديدة من موقع الشركة - ${contactData.subject || 'بدون موضوع'}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>رسالة جديدة من العميل</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f8f9fa;
                    padding: 20px;
                    direction: rtl;
                    text-align: right;
                }
                .container {
                    max-width: 650px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                .header {
                    background: linear-gradient(135deg, #059669 0%, #0d9488 100%);
                    color: white;
                    padding: 40px 30px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: bold;
                }
                .content {
                    padding: 40px 30px;
                }
                .message-content {
                    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                    padding: 25px;
                    border-radius: 12px;
                    border-right: 4px solid #0ea5e9;
                    line-height: 1.6;
                    font-size: 16px;
                    color: #334155;
                    margin: 25px 0;
                }
                .info-section {
                    background: #f8fafc;
                    padding: 25px;
                    border-radius: 12px;
                    margin: 20px 0;
                    border-right: 4px solid #059669;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 12px 0;
                    padding: 8px 0;
                    border-bottom: 1px solid #e2e8f0;
                }
                .info-row:last-child {
                    border-bottom: none;
                }
                .info-label {
                    font-weight: bold;
                    color: #059669;
                    min-width: 120px;
                }
                .info-value {
                    color: #334155;
                }
                .footer {
                    background: #1f2937;
                    color: white;
                    text-align: center;
                    padding: 30px;
                }
                .timestamp-box {
                    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                    padding: 20px;
                    border-radius: 12px;
                    border-right: 4px solid #f59e0b;
                    text-align: center;
                    margin: 25px 0;
                }
                a {
                    color: #0ea5e9;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div style="font-size: 50px; margin-bottom: 15px;">📬</div>
                    <h1>رسالة جديدة من العميل</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">شركة علي صالح الشهري القابضة</p>
                </div>
                
                <div class="content">
                    <div class="info-section">
                        <h3 style="color: #059669; margin: 0 0 20px 0; font-size: 20px;">📋 معلومات المرسل</h3>
                        <div class="info-row">
                            <span class="info-label">👤 الاسم:</span>
                            <span class="info-value">${contactData.name}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">📧 البريد الإلكتروني:</span>
                            <span class="info-value" style="direction: ltr;"><a href="mailto:${contactData.email}">${contactData.email}</a></span>
                        </div>
                        ${contactData.phone ? `
                         <div class="info-row">
                            <span class="info-label">📱 الهاتف:</span>
                            <span class="info-value" style="direction: ltr;"><a href="tel:${contactData.phone}">${contactData.phone}</a></span>
                        </div>
                        ` : ''}
                        ${contactData.category ? `
                        <div class="info-row">
                            <span class="info-label">🏷️ نوع الاستفسار:</span>
                            <span class="info-value">${contactData.category}</span>
                        </div>
                        ` : ''}
                        ${contactData.subject ? `
                        <div class="info-row">
                            <span class="info-label">📝 الموضوع:</span>
                            <span class="info-value">${contactData.subject}</span>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="message-content">
                        <h3 style="color: #0284c7; margin-top: 0; margin-bottom: 15px;">💬 نص الرسالة</h3>
                        ${contactData.message}
                    </div>
                    
                    <div class="timestamp-box">
                        <p style="color: #92400e; margin: 0; font-weight: bold;">
                            ⏰ تاريخ الإرسال: ${new Date().toLocaleDateString('ar-SA')} - ${new Date().toLocaleTimeString('ar-SA')}
                        </p>
                    </div>
                </div>
                
                <div class="footer">
                    <p style="margin: 0; font-size: 16px; font-weight: bold;">
                        شركة علي صالح الشهري القابضة
                    </p>
                    <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.8;">
                        تم إرسال هذا الإيميل تلقائياً من نظام إدارة المراسلات
                    </p>
                </div>
            </div>
        </body>
        </html>
      `,
    });

    console.log("Company email sent:", companyEmailResponse);

    // Send confirmation email to sender
    const senderEmailResponse = await resend.emails.send({
      from: "Ali AlShehri Holding <info@alialshehriholding.com>",
      to: [contactData.email],
      bcc: ["info@alialshehriholding.com"],
      subject: "تم استلام رسالتك بنجاح",
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>تأكيد استلام رسالتك</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: 'Segoe UI', Tahoma, Arial, sans-serif; 
                    background-color: #f8fafc; 
                    direction: rtl; 
                    text-align: right;
                    line-height: 1.6;
                    padding: 20px;
                }
                .container { 
                    max-width: 650px; 
                    margin: 0 auto; 
                    background: white; 
                    border-radius: 15px; 
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
                    overflow: hidden;
                }
                .header { 
                    background: linear-gradient(135deg, #059669 0%, #0d9488 100%); 
                    color: white; 
                    padding: 40px 30px; 
                    text-align: center; 
                }
                .content { 
                    padding: 40px 30px; 
                }
                .welcome-section {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .confirmation-box {
                    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
                    padding: 25px;
                    border-radius: 12px;
                    border-right: 4px solid #059669;
                    margin: 25px 0;
                }
                .summary-box {
                    background: #f8fafc;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                    border: 1px solid #e2e8f0;
                }
                .contact-grid {
                    display: grid;
                    gap: 12px;
                    margin: 20px 0;
                }
                .contact-item {
                    display: flex;
                    align-items: center;
                    background: white;
                    padding: 12px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                .footer { 
                    background: #1f2937; 
                    color: white; 
                    text-align: center; 
                    padding: 30px; 
                }
                a {
                    color: #0ea5e9;
                    text-decoration: none;
                    font-weight: 600;
                }
                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div style="font-size: 60px; margin-bottom: 15px;">✨</div>
                    <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 10px;">شكراً لتواصلك معنا</h1>
                    <p style="opacity: 0.9; font-size: 16px;">تم استلام رسالتك بنجاح</p>
                </div>
                
                <div class="content">
                    <div class="welcome-section">
                        <div style="font-size: 60px; margin-bottom: 15px;">👋</div>
                        <h2 style="color: #1e293b; font-size: 22px; font-weight: 600;">
                            مرحباً <span style="color: #059669;">${contactData.name}</span>
                        </h2>
                    </div>
                    
                    <div class="confirmation-box">
                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                            <span style="font-size: 24px; margin-left: 10px;">✅</span>
                            <h3 style="color: #059669; margin: 0; font-size: 18px; font-weight: 600;">تأكيد الاستلام</h3>
                        </div>
                        <p style="color: #166534; font-size: 16px; margin: 0;">
                            تم استلام رسالتك بنجاح وسيقوم فريقنا المختص بمراجعتها والرد عليك خلال <strong>24 ساعة</strong>.
                        </p>
                    </div>
                    
                    <div class="summary-box">
                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                            <span style="font-size: 20px; margin-left: 8px;">📋</span>
                            <h3 style="color: #1e293b; margin: 0; font-size: 16px; font-weight: 600;">ملخص رسالتك</h3>
                        </div>
                        <div style="display: grid; gap: 10px;">
                            ${contactData.subject ? `
                            <div style="display: flex; justify-content: space-between;">
                                <strong style="color: #475569;">📝 الموضوع:</strong>
                                <span style="color: #334155;">${contactData.subject}</span>
                            </div>
                            ` : ''}
                            ${contactData.category ? `
                            <div style="display: flex; justify-content: space-between;">
                                <strong style="color: #475569;">🏷️ نوع الاستفسار:</strong>
                                <span style="color: #334155;">${contactData.category}</span>
                            </div>
                            ` : ''}
                            <div style="display: flex; justify-content: space-between;">
                                <strong style="color: #475569;">⏰ تاريخ الإرسال:</strong>
                                <span style="color: #334155;">${new Date().toLocaleDateString('ar-SA')}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border-right: 4px solid #f59e0b;">
                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                            <span style="font-size: 20px; margin-left: 8px;">🚀</span>
                            <h3 style="color: #92400e; margin: 0; font-size: 16px; font-weight: 600;">للاستفسارات العاجلة</h3>
                        </div>
                        <div class="contact-grid">
                            <div class="contact-item">
                                <span style="font-size: 18px; margin-left: 10px;">📧</span>
                                <span style="color: #374151; margin-left: 8px; font-weight: 500;">البريد الإلكتروني:</span>
                                <a href="mailto:info@alialshehriholding.com" style="direction: ltr;">info@alialshehriholding.com</a>
                            </div>
                            <div class="contact-item">
                                <span style="font-size: 18px; margin-left: 10px;">📞</span>
                                <span style="color: #374151; margin-left: 8px; font-weight: 500;">الهاتف:</span>
                                <a href="tel:+966555812567" style="color: #10b981;">0555812567</a>
                            </div>
                            <div class="contact-item">
                                <span style="font-size: 18px; margin-left: 10px;">💬</span>
                                <span style="color: #374151; margin-left: 8px; font-weight: 500;">واتساب:</span>
                                <a href="https://wa.me/966555812567" style="color: #059669;">0555812567</a>
                            </div>
                        </div>
                    </div>
                    
                    <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 10px; border: 1px solid #bae6fd;">
                        <p style="color: #1e293b; font-size: 16px; margin: 0;">
                            مع أطيب التحيات،<br>
                            <strong style="color: #059669;">فريق خدمة العملاء</strong><br>
                            <span style="font-size: 18px;">🏢</span> شركة علي صالح الشهري القابضة
                        </p>
                    </div>
                </div>
                
                <div class="footer">
                    <p style="margin: 0; font-size: 16px; font-weight: bold;">
                        شركة علي صالح الشهري القابضة
                    </p>
                    <div style="color: #64748b; font-size: 14px; margin: 15px 0;">
                        🌐 للمزيد من المعلومات: 
                        <a href="https://alialshehriholding.com" style="color: #059669; direction: ltr;">alialshehriholding.com</a>
                    </div>
                    <div style="border-top: 1px solid #374151; padding-top: 15px; font-size: 12px; opacity: 0.8;">
                        نظام المراسلات التلقائي - تم الإرسال من النظام
                    </div>
                </div>
            </div>
        </body>
        </html>
      `,
    });

    console.log("Sender confirmation email sent:", senderEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال رسالتك بنجاح وسنتواصل معك قريباً" 
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
    console.error("Error in contact-form function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "حدث خطأ أثناء إرسال الرسالة" 
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