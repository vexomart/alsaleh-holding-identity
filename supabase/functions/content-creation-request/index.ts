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
      from: "نظام طلبات المحتوى <noreply@emkandigital.com>",
      to: ["content@emkandigital.com", "admin@emkandigital.com"],
      subject: `طلب جديد لخدمة ${requestData.serviceName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2px; border-radius: 10px;">
          <div style="background: white; border-radius: 8px; padding: 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #667eea; margin: 0; font-size: 28px; font-weight: bold;">طلب خدمة محتوى جديد</h1>
              <div style="background: linear-gradient(135deg, #667eea, #764ba2); height: 3px; width: 100px; margin: 15px auto; border-radius: 2px;"></div>
            </div>
            
            <div style="background: #f8f9ff; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h2 style="color: #4a5568; margin: 0 0 15px 0; font-size: 20px;">تفاصيل الخدمة المطلوبة</h2>
              <div style="display: grid; gap: 10px;">
                <div><strong style="color: #667eea;">اسم الخدمة:</strong> ${requestData.serviceName}</div>
                <div><strong style="color: #667eea;">وصف الخدمة:</strong> ${requestData.serviceDescription}</div>
              </div>
            </div>

            <div style="background: #f8f9ff; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h2 style="color: #4a5568; margin: 0 0 15px 0; font-size: 20px;">معلومات العميل</h2>
              <div style="display: grid; gap: 10px;">
                <div><strong style="color: #667eea;">الاسم:</strong> ${requestData.name}</div>
                <div><strong style="color: #667eea;">البريد الإلكتروني:</strong> ${requestData.email}</div>
                <div><strong style="color: #667eea;">رقم الهاتف:</strong> ${requestData.phone}</div>
                ${requestData.company ? `<div><strong style="color: #667eea;">الشركة:</strong> ${requestData.company}</div>` : ''}
              </div>
            </div>

            <div style="background: #f8f9ff; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h2 style="color: #4a5568; margin: 0 0 15px 0; font-size: 20px;">تفاصيل المشروع</h2>
              <div style="display: grid; gap: 10px;">
                ${requestData.budget ? `<div><strong style="color: #667eea;">الميزانية:</strong> ${requestData.budget}</div>` : ''}
                ${requestData.timeline ? `<div><strong style="color: #667eea;">الجدول الزمني:</strong> ${requestData.timeline}</div>` : ''}
                <div><strong style="color: #667eea;">وصف المشروع:</strong></div>
                <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 5px; border-right: 4px solid #667eea;">
                  ${requestData.description}
                </div>
              </div>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #718096; font-size: 14px; margin: 0;">
                تم إرسال هذا الطلب من موقع إمكان الرقمية<br>
                ${new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' })}
              </p>
            </div>
          </div>
        </div>
      `,
    });

    // Confirmation email to client
    const clientEmailResponse = await resend.emails.send({
      from: "إمكان الرقمية <noreply@emkandigital.com>",
      to: [requestData.email],
      subject: `شكراً لك - تم استلام طلبك لخدمة ${requestData.serviceName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2px; border-radius: 10px;">
          <div style="background: white; border-radius: 8px; padding: 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #667eea; margin: 0; font-size: 28px; font-weight: bold;">شكراً لثقتك في إمكان الرقمية</h1>
              <div style="background: linear-gradient(135deg, #667eea, #764ba2); height: 3px; width: 100px; margin: 15px auto; border-radius: 2px;"></div>
            </div>
            
            <div style="background: #f8f9ff; border-radius: 8px; padding: 25px; margin-bottom: 25px; text-align: center;">
              <h2 style="color: #4a5568; margin: 0 0 15px 0; font-size: 22px;">مرحباً ${requestData.name}</h2>
              <p style="color: #718096; line-height: 1.8; font-size: 16px; margin: 0;">
                تم استلام طلبك لخدمة <strong style="color: #667eea;">${requestData.serviceName}</strong> بنجاح!<br>
                فريقنا المتخصص سيراجع طلبك ويتواصل معك خلال 24 ساعة.
              </p>
            </div>

            <div style="background: #f8f9ff; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h3 style="color: #4a5568; margin: 0 0 15px 0; font-size: 18px;">ملخص طلبك:</h3>
              <div style="display: grid; gap: 8px;">
                <div><strong style="color: #667eea;">الخدمة:</strong> ${requestData.serviceName}</div>
                ${requestData.budget ? `<div><strong style="color: #667eea;">الميزانية:</strong> ${requestData.budget}</div>` : ''}
                ${requestData.timeline ? `<div><strong style="color: #667eea;">الجدول الزمني:</strong> ${requestData.timeline}</div>` : ''}
              </div>
            </div>

            <div style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 8px; padding: 20px; color: white; text-align: center; margin-bottom: 25px;">
              <h3 style="margin: 0 0 10px 0; font-size: 18px;">الخطوات القادمة</h3>
              <p style="margin: 0; line-height: 1.6;">
                ✅ مراجعة طلبك والتواصل معك<br>
                ✅ تحضير عرض سعر مخصص<br>
                ✅ بدء العمل على مشروعك
              </p>
            </div>

            <div style="text-align: center;">
              <p style="color: #718096; font-size: 14px; margin: 0;">
                إمكان الرقمية - شريكك في التحول الرقمي<br>
                للتواصل: +966 55 581 2567<br>
                البريد الإلكتروني: info@emkandigital.com
              </p>
            </div>
          </div>
        </div>
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