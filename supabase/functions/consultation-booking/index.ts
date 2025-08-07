import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

serve(async (req: Request) => {
  console.log("Consultation booking request received:", req.method);

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
    // Check if RESEND_API_KEY is available
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not found");
      throw new Error("Email service not configured");
    }

    const resend = new Resend(resendApiKey);
    const requestData: ConsultationRequest = await req.json();
    
    console.log("Request data received:", {
      name: requestData.name,
      email: requestData.email,
      service: requestData.service
    });

    // Validate required fields
    if (!requestData.name || !requestData.email || !requestData.service || !requestData.consultationType) {
      throw new Error("الرجاء ملء جميع الحقول المطلوبة");
    }

    const { 
      name, email, phone, company, position, service, 
      consultationType, preferredDate, preferredTime, message 
    } = requestData;

    const serviceName = serviceNames[service] || service;
    const consultationTypeName = consultationTypeNames[consultationType] || consultationType;

    // Send admin notification email
    console.log("Sending admin email...");
    const adminEmailResponse = await resend.emails.send({
      from: "Ali Al Shehri Holding <onboarding@resend.dev>",
      to: ["info@alialshehriholding.com"],
      subject: `طلب استشارة جديد من ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
          <div style="background: linear-gradient(135deg, #1e40af, #0ea5e9); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">طلب استشارة جديد</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1e40af; margin-bottom: 20px;">معلومات العميل</h2>
            <p><strong>الاسم:</strong> ${name}</p>
            <p><strong>البريد الإلكتروني:</strong> ${email}</p>
            <p><strong>رقم الهاتف:</strong> ${phone || 'غير محدد'}</p>
            ${company ? `<p><strong>الشركة:</strong> ${company}</p>` : ''}
            ${position ? `<p><strong>المنصب:</strong> ${position}</p>` : ''}
          </div>

          <div style="background: #f0f9ff; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #0ea5e9; margin-bottom: 20px;">تفاصيل الاستشارة</h2>
            <p><strong>نوع الخدمة:</strong> ${serviceName}</p>
            <p><strong>نوع الاستشارة:</strong> ${consultationTypeName}</p>
            ${preferredDate ? `<p><strong>التاريخ المفضل:</strong> ${preferredDate}</p>` : ''}
            ${preferredTime ? `<p><strong>الوقت المفضل:</strong> ${preferredTime}</p>` : ''}
          </div>

          ${message ? `
            <div style="background: #fefce8; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #ca8a04; margin-bottom: 15px;">الرسالة</h2>
              <p>${message}</p>
            </div>
          ` : ''}

          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; text-align: center;">
            <p style="color: #059669; margin: 0; font-weight: bold;">يرجى التواصل مع العميل خلال 24 ساعة</p>
          </div>
        </div>
      `,
    });

    if (adminEmailResponse.error) {
      console.error("Admin email error:", adminEmailResponse.error);
      throw adminEmailResponse.error;
    }

    console.log("Admin email sent successfully");

    // Send client confirmation email
    console.log("Sending client email...");
    const clientEmailResponse = await resend.emails.send({
      from: "Ali Al Shehri Holding <onboarding@resend.dev>",
      to: [email],
      subject: "تأكيد استلام طلب الاستشارة - مجموعة علي الشهري",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
          <div style="background: linear-gradient(135deg, #1e40af, #0ea5e9); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">شكراً لك ${name}</h1>
            <p style="color: #bfdbfe; margin: 10px 0 0 0;">تم استلام طلب استشارتك بنجاح</p>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #1e40af; margin-bottom: 15px;">ملخص طلبك</h2>
            <div style="background: white; padding: 20px; border-radius: 6px;">
              <p><strong>نوع الخدمة:</strong> ${serviceName}</p>
              <p><strong>نوع الاستشارة:</strong> ${consultationTypeName}</p>
              ${preferredDate && preferredTime ? `<p><strong>الموعد المفضل:</strong> ${preferredDate} في ${preferredTime}</p>` : ''}
            </div>
          </div>

          <div style="background: #ecfdf5; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #059669; margin-bottom: 15px;">الخطوات التالية</h3>
            <ol style="color: #374151; line-height: 1.8;">
              <li>سيتواصل معك أحد خبرائنا خلال 24 ساعة</li>
              <li>سنحدد معك الموعد المناسب للاستشارة</li>
              <li>ستتلقى رابط الاجتماع قبل الموعد بيوم واحد</li>
              <li>سنرسل لك ملخص الاستشارة والتوصيات بعد الجلسة</li>
            </ol>
          </div>

          <div style="text-align: center;">
            <h3 style="color: #1e40af; margin-bottom: 15px;">تواصل معنا</h3>
            <p style="color: #6b7280;">📞 الهاتف: 0555812567</p>
            <p style="color: #6b7280;">📧 البريد: info@alialshehriholding.com</p>
            <p style="color: #6b7280;">📍 الموقع: الرياض، المملكة العربية السعودية</p>
          </div>
        </div>
      `,
    });

    if (clientEmailResponse.error) {
      console.error("Client email error:", clientEmailResponse.error);
      throw clientEmailResponse.error;
    }

    console.log("Client email sent successfully");

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
    console.error("Error in consultation booking:", error);
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
});