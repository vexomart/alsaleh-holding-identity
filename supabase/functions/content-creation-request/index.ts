import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContentCreationRequest {
  name: string;
  email: string;
  phone: string;
  company?: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  description: string;
  serviceName: string;
  serviceDescription: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: ContentCreationRequest = await req.json();
    
    console.log("Received content creation request:", requestData);

    // Email to company
    const companyEmailResponse = await resend.emails.send({
      from: "نظام طلبات المحتوى <noreply@alialshehriholding.com>",
      to: ["info@alialshehriholding.com"],
      subject: `طلب جديد لخدمة ${requestData.serviceName}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>طلب خدمة محتوى جديد</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f8f9fa;
                    margin: 0;
                    padding: 20px;
                    direction: rtl;
                    text-align: right;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }
                .content {
                    padding: 30px;
                }
                .info-box {
                    background: #f8f9ff;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                    border-right: 4px solid #667eea;
                }
                .footer {
                    background: #1f2937;
                    color: white;
                    text-align: center;
                    padding: 25px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin: 0; font-size: 28px; font-weight: bold;">طلب خدمة محتوى جديد</h1>
                    <h2 style="margin: 10px 0; font-size: 20px;">شركة علي صالح الشهري القابضة</h2>
                </div>
                
                <div class="content">
                    <div class="info-box">
                        <h2 style="color: #4a5568; margin: 0 0 15px 0; font-size: 20px;">تفاصيل الخدمة المطلوبة</h2>
                        <p><strong style="color: #667eea;">اسم الخدمة:</strong> ${requestData.serviceName}</p>
                        <p><strong style="color: #667eea;">وصف الخدمة:</strong> ${requestData.serviceDescription}</p>
                    </div>

                    <div class="info-box">
                        <h2 style="color: #4a5568; margin: 0 0 15px 0; font-size: 20px;">معلومات العميل</h2>
                        <p><strong style="color: #667eea;">الاسم:</strong> ${requestData.name}</p>
                        <p><strong style="color: #667eea;">البريد الإلكتروني:</strong> ${requestData.email}</p>
                        <p><strong style="color: #667eea;">رقم الهاتف:</strong> ${requestData.phone}</p>
                        ${requestData.company ? `<p><strong style="color: #667eea;">الشركة:</strong> ${requestData.company}</p>` : ''}
                    </div>

                    <div class="info-box">
                        <h2 style="color: #4a5568; margin: 0 0 15px 0; font-size: 20px;">تفاصيل المشروع</h2>
                        ${requestData.budget ? `<p><strong style="color: #667eea;">الميزانية:</strong> ${requestData.budget}</p>` : ''}
                        ${requestData.timeline ? `<p><strong style="color: #667eea;">الجدول الزمني:</strong> ${requestData.timeline}</p>` : ''}
                        <p><strong style="color: #667eea;">وصف المشروع:</strong></p>
                        <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 5px; border-right: 4px solid #667eea;">
                            ${requestData.description}
                        </div>
                    </div>
                </div>
                
                <div class="footer">
                    <p style="margin: 0; font-size: 14px;">
                        تم إرسال هذا الطلب من موقع شركة علي صالح الشهري القابضة<br>
                        ${new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' })}
                    </p>
                </div>
            </div>
        </body>
        </html>
      `,
    });

    // Confirmation email to client
    const clientEmailResponse = await resend.emails.send({
      from: "شركة علي صالح الشهري القابضة <noreply@alialshehriholding.com>",
      to: [requestData.email],
      subject: `شكراً لك - تم استلام طلبك لخدمة ${requestData.serviceName}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>تأكيد استلام طلب الخدمة</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f8f9fa;
                    margin: 0;
                    padding: 20px;
                    direction: rtl;
                    text-align: right;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }
                .content {
                    padding: 30px;
                }
                .success-box {
                    background: #f8f9ff;
                    border-radius: 8px;
                    padding: 25px;
                    margin: 20px 0;
                    text-align: center;
                    border-right: 4px solid #667eea;
                }
                .summary-box {
                    background: #f8f9ff;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                    border-right: 4px solid #667eea;
                }
                .steps-box {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border-radius: 8px;
                    padding: 20px;
                    color: white;
                    text-align: center;
                    margin: 20px 0;
                }
                .footer {
                    background: #1f2937;
                    color: white;
                    text-align: center;
                    padding: 25px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin: 0; font-size: 28px; font-weight: bold;">شكراً لثقتك في شركة علي صالح الشهري القابضة</h1>
                </div>
                
                <div class="content">
                    <div class="success-box">
                        <h2 style="color: #4a5568; margin: 0 0 15px 0; font-size: 22px;">مرحباً ${requestData.name}</h2>
                        <p style="color: #718096; line-height: 1.8; font-size: 16px; margin: 0;">
                            تم استلام طلبك لخدمة <strong style="color: #667eea;">${requestData.serviceName}</strong> بنجاح!<br>
                            فريقنا المتخصص سيراجع طلبك ويتواصل معك خلال 24 ساعة.
                        </p>
                    </div>

                    <div class="summary-box">
                        <h3 style="color: #4a5568; margin: 0 0 15px 0; font-size: 18px;">ملخص طلبك:</h3>
                        <p><strong style="color: #667eea;">الخدمة:</strong> ${requestData.serviceName}</p>
                        ${requestData.budget ? `<p><strong style="color: #667eea;">الميزانية:</strong> ${requestData.budget}</p>` : ''}
                        ${requestData.timeline ? `<p><strong style="color: #667eea;">الجدول الزمني:</strong> ${requestData.timeline}</p>` : ''}
                    </div>

                    <div class="steps-box">
                        <h3 style="margin: 0 0 10px 0; font-size: 18px;">الخطوات القادمة</h3>
                        <p style="margin: 0; line-height: 1.6;">
                            ✅ مراجعة طلبك والتواصل معك<br>
                            ✅ تحضير عرض سعر مخصص<br>
                            ✅ بدء العمل على مشروعك
                        </p>
                    </div>
                </div>

                <div class="footer">
                    <p style="margin: 0; font-size: 14px;">
                        شركة علي صالح الشهري القابضة - شريكك في التحول الرقمي<br>
                        للتواصل: 0555812567<br>
                        البريد الإلكتروني: info@alialshehriholding.com
                    </p>
                </div>
            </div>
        </body>
        </html>
      `,
    });

    console.log("Company email sent:", companyEmailResponse);
    console.log("Client email sent:", clientEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال طلبك بنجاح",
        companyEmailId: companyEmailResponse.data?.id,
        clientEmailId: clientEmailResponse.data?.id
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in content-creation-request function:", error);
    return new Response(
      JSON.stringify({ 
        error: "فشل في إرسال الطلب", 
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);