import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConsultationRequest {
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  service: string;
  consultationType: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
}

const serviceNames: Record<string, string> = {
  "business-consulting": "الاستشارات التجارية",
  "digital-transformation": "التحول الرقمي",
  "financial-planning": "التخطيط المالي",
  "strategic-consulting": "الاستشارات الاستراتيجية",
  "risk-management": "إدارة المخاطر",
  "team-development": "تطوير الفرق"
};

const consultationTypeNames: Record<string, string> = {
  "initial": "استشارة أولية (مجانية - 30 دقيقة)",
  "detailed": "استشارة تفصيلية (90 دقيقة)",
  "strategic": "جلسة استراتيجية (3 ساعات)",
  "workshop": "ورشة عمل جماعية (يوم كامل)"
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { 
      status: 405,
      headers: corsHeaders 
    });
  }

  try {
    console.log("Starting consultation booking process...");
    
    // Check if RESEND_API_KEY is available
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not found in environment variables");
      throw new Error("Email service not configured properly");
    }
    console.log("RESEND_API_KEY found, proceeding...");
    
    const requestData: ConsultationRequest = await req.json();
    console.log("Received consultation booking request:", requestData);

    // Validate required fields
    if (!requestData.name || !requestData.email || !requestData.service || !requestData.consultationType) {
      console.error("Missing required fields:", {
        name: !!requestData.name,
        email: !!requestData.email,
        service: !!requestData.service,
        consultationType: !!requestData.consultationType
      });
      throw new Error("الرجاء ملء جميع الحقول المطلوبة");
    }

    const { 
      name, 
      email, 
      phone, 
      company, 
      position, 
      service, 
      consultationType, 
      preferredDate, 
      preferredTime, 
      message 
    } = requestData;

    console.log("Extracted data:", { name, email, service, consultationType });

    const serviceName = serviceNames[service] || service;
    const consultationTypeName = consultationTypeNames[consultationType] || consultationType;

    console.log("Preparing to send admin email...");
    
    // Send notification email to admin
    console.log("Sending admin email to: consultation@emkan.sa");
    const adminEmailResponse = await resend.emails.send({
      from: "Emkan Consulting <noreply@emkan.sa>",
      to: ["consultation@emkan.sa"], // Replace with actual admin email
      subject: `طلب استشارة جديد من ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
          <div style="background: linear-gradient(135deg, #1e40af, #0ea5e9); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">طلب استشارة جديد</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1e40af; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">معلومات العميل</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 30%;">الاسم:</td>
                <td style="padding: 8px 0; color: #6b7280;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">البريد الإلكتروني:</td>
                <td style="padding: 8px 0; color: #6b7280;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">رقم الهاتف:</td>
                <td style="padding: 8px 0; color: #6b7280;">${phone}</td>
              </tr>
              ${company ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">الشركة:</td>
                  <td style="padding: 8px 0; color: #6b7280;">${company}</td>
                </tr>
              ` : ''}
              ${position ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">المنصب:</td>
                  <td style="padding: 8px 0; color: #6b7280;">${position}</td>
                </tr>
              ` : ''}
            </table>
          </div>

          <div style="background: #f0f9ff; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #0ea5e9; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">تفاصيل الاستشارة</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 30%;">نوع الخدمة:</td>
                <td style="padding: 8px 0; color: #6b7280;">${serviceName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">نوع الاستشارة:</td>
                <td style="padding: 8px 0; color: #6b7280;">${consultationTypeName}</td>
              </tr>
              ${preferredDate ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">التاريخ المفضل:</td>
                  <td style="padding: 8px 0; color: #6b7280;">${preferredDate}</td>
                </tr>
              ` : ''}
              ${preferredTime ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">الوقت المفضل:</td>
                  <td style="padding: 8px 0; color: #6b7280;">${preferredTime}</td>
                </tr>
              ` : ''}
            </table>
          </div>

          ${message ? `
            <div style="background: #fefce8; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #ca8a04; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">الرسالة</h2>
              <p style="color: #6b7280; line-height: 1.6; margin: 0;">${message}</p>
            </div>
          ` : ''}

          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; text-align: center;">
            <p style="color: #059669; margin: 0; font-weight: bold;">يرجى التواصل مع العميل خلال 24 ساعة</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              هذا البريد تم إرساله تلقائياً من نظام حجز الاستشارات
            </p>
          </div>
        </div>
      `,
    });

    console.log("Admin email response:", adminEmailResponse);
    
    if (adminEmailResponse.error) {
      console.error("Error sending admin email:", adminEmailResponse.error);
      throw adminEmailResponse.error;
    }

    console.log("Admin email sent successfully, sending client email...");

    console.log("Sending client confirmation email to:", email);
    const clientEmailResponse = await resend.emails.send({
      from: "Emkan Consulting <noreply@emkan.sa>",
      to: [email],
      subject: "تأكيد استلام طلب الاستشارة - إمكان",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
          <div style="background: linear-gradient(135deg, #1e40af, #0ea5e9); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">شكراً لك ${name}</h1>
            <p style="color: #bfdbfe; margin: 10px 0 0 0;">تم استلام طلب استشارتك بنجاح</p>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #1e40af; margin-bottom: 15px;">ملخص طلبك</h2>
            <div style="background: white; padding: 20px; border-radius: 6px; border-right: 4px solid #0ea5e9;">
              <p style="margin: 5px 0; color: #374151;"><strong>نوع الخدمة:</strong> ${serviceName}</p>
              <p style="margin: 5px 0; color: #374151;"><strong>نوع الاستشارة:</strong> ${consultationTypeName}</p>
              ${preferredDate && preferredTime ? `
                <p style="margin: 5px 0; color: #374151;"><strong>الموعد المفضل:</strong> ${preferredDate} في ${preferredTime}</p>
              ` : ''}
            </div>
          </div>

          <div style="background: #ecfdf5; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #059669; margin-bottom: 15px;">الخطوات التالية</h3>
            <ol style="color: #374151; line-height: 1.8; padding-right: 20px;">
              <li>سيتواصل معك أحد خبرائنا خلال 24 ساعة</li>
              <li>سنحدد معك الموعد المناسب للاستشارة</li>
              <li>ستتلقى رابط الاجتماع قبل الموعد بيوم واحد</li>
              <li>سنرسل لك ملخص الاستشارة والتوصيات بعد الجلسة</li>
            </ol>
          </div>

          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <p style="color: #92400e; margin: 0; text-align: center;">
              <strong>ملاحظة:</strong> الاستشارة الأولية مجانية تماماً ولمدة 30 دقيقة
            </p>
          </div>

          <div style="text-align: center;">
            <h3 style="color: #1e40af; margin-bottom: 15px;">تواصل معنا</h3>
            <p style="color: #6b7280; margin: 5px 0;">📞 الهاتف: 0555812567</p>
            <p style="color: #6b7280; margin: 5px 0;">📧 البريد: consultation@emkan.sa</p>
            <p style="color: #6b7280; margin: 5px 0;">📍 الموقع: الرياض، المملكة العربية السعودية</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              نتطلع لخدمتك وتحقيق أهدافك التجارية
            </p>
          </div>
        </div>
      `,
    });

    console.log("Client email response:", clientEmailResponse);
    
    if (clientEmailResponse.error) {
      console.error("Error sending client email:", clientEmailResponse.error);
      throw clientEmailResponse.error;
    }

    console.log("Consultation booking emails sent successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال طلب الاستشارة بنجاح" 
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
    console.error("Error in consultation booking function:", error);
    return new Response(
      JSON.stringify({ 
        error: "حدث خطأ في إرسال الطلب",
        details: error.message 
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