import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ServiceRequest {
  serviceType: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  projectBudget: string;
  projectTimeline: string;
  description: string;
  requiredFeatures: string[];
  currentSystems: string;
  integrationNeeds: string;
  securityRequirements: string;
  scalabilityNeeds: string;
}

const getServiceDescription = (serviceType: string) => {
  const descriptions = {
    "tech-solutions": "الحلول التقنية الشاملة",
    "business-solutions": "حلول الأعمال الرقمية", 
    "cloud-solutions": "الحلول السحابية المتقدمة",
    "security-solutions": "حلول الأمان الشامل"
  };
  return descriptions[serviceType as keyof typeof descriptions] || serviceType;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: ServiceRequest = await req.json();
    
    console.log("Received service request:", requestData);

    // Send email to company
    const companyEmailResponse = await resend.emails.send({
      from: "ASH HOLDING Services <info@alialshehriholding.com>",
      to: ["info@alialshehriholding.com"],
      subject: `طلب خدمة جديد - ${getServiceDescription(requestData.serviceType)}`,
      html: `
        <div style="font-family: 'Cairo', Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 30px; background: #f8fafc; border-radius: 15px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; margin-bottom: 25px;">
            <h1 style="color: white; text-align: center; font-size: 28px; margin: 0;">
              🚀 طلب خدمة متكاملة جديد
            </h1>
            <p style="color: #e2e8f0; text-align: center; margin: 10px 0 0 0; font-size: 18px;">
              ${getServiceDescription(requestData.serviceType)}
            </p>
          </div>

          <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 22px; display: flex; align-items: center; gap: 10px;">
              👤 معلومات العميل
            </h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">
              <div style="background: #f1f5f9; padding: 15px; border-radius: 8px;">
                <strong style="color: #475569;">الاسم:</strong> ${requestData.name}
              </div>
              <div style="background: #f1f5f9; padding: 15px; border-radius: 8px;">
                <strong style="color: #475569;">البريد الإلكتروني:</strong> ${requestData.email}
              </div>
              <div style="background: #f1f5f9; padding: 15px; border-radius: 8px;">
                <strong style="color: #475569;">رقم الهاتف:</strong> ${requestData.phone}
              </div>
              <div style="background: #f1f5f9; padding: 15px; border-radius: 8px;">
                <strong style="color: #475569;">الشركة:</strong> ${requestData.company}
              </div>
            </div>
          </div>

          <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 22px; display: flex; align-items: center; gap: 10px;">
              📊 تفاصيل المشروع
            </h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; margin-bottom: 20px;">
              <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #22c55e;">
                <strong style="color: #166534;">الميزانية:</strong> ${requestData.projectBudget}
              </div>
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <strong style="color: #92400e;">الجدولة الزمنية:</strong> ${requestData.projectTimeline}
              </div>
            </div>
            
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <strong style="color: #475569;">وصف المشروع:</strong>
              <p style="margin: 8px 0; color: #64748b; line-height: 1.6;">${requestData.description}</p>
            </div>

            ${requestData.requiredFeatures && requestData.requiredFeatures.length > 0 ? `
            <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <strong style="color: #0369a1;">الميزات المطلوبة:</strong>
              <ul style="margin: 8px 0; padding-right: 20px; color: #0284c7;">
                ${requestData.requiredFeatures.map(feature => `<li style="margin: 5px 0;">${feature}</li>`).join('')}
              </ul>
            </div>
            ` : ''}
          </div>

          <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 22px; display: flex; align-items: center; gap: 10px;">
              ⚙️ المتطلبات التقنية
            </h2>
            
            ${requestData.currentSystems ? `
            <div style="background: #fef7f0; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <strong style="color: #ea580c;">الأنظمة الحالية:</strong>
              <p style="margin: 8px 0; color: #c2410c; line-height: 1.6;">${requestData.currentSystems}</p>
            </div>
            ` : ''}
            
            ${requestData.integrationNeeds ? `
            <div style="background: #f3e8ff; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <strong style="color: #7c3aed;">احتياجات التكامل:</strong>
              <p style="margin: 8px 0; color: #8b5cf6; line-height: 1.6;">${requestData.integrationNeeds}</p>
            </div>
            ` : ''}
            
            ${requestData.securityRequirements ? `
            <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <strong style="color: #dc2626;">متطلبات الأمان:</strong>
              <p style="margin: 8px 0; color: #ef4444; line-height: 1.6;">${requestData.securityRequirements}</p>
            </div>
            ` : ''}
            
            ${requestData.scalabilityNeeds ? `
            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px;">
              <strong style="color: #16a34a;">احتياجات التوسع:</strong>
              <p style="margin: 8px 0; color: #22c55e; line-height: 1.6;">${requestData.scalabilityNeeds}</p>
            </div>
            ` : ''}
          </div>

          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; text-align: center;">
            <h3 style="color: white; margin: 0 0 10px 0;">📞 للمتابعة والاستفسار</h3>
            <p style="color: #e2e8f0; margin: 0; font-size: 16px;">سيتم التواصل معك خلال 24 ساعة لمناقشة تفاصيل المشروع</p>
          </div>
        </div>
      `,
    });

    // Send confirmation email to client
    const clientEmailResponse = await resend.emails.send({
      from: "ASH HOLDING Services <info@alialshehriholding.com>",
      to: [requestData.email],
      subject: `تأكيد استلام طلبك - ${getServiceDescription(requestData.serviceType)}`,
      html: `
        <div style="font-family: 'Cairo', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 25px;">
            <h1 style="color: white; font-size: 28px; margin: 0 0 10px 0;">شكراً لك ${requestData.name}</h1>
            <p style="color: #e2e8f0; font-size: 18px; margin: 0;">تم استلام طلبك بنجاح</p>
          </div>

          <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 22px;">📋 ملخص طلبك</h2>
            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <strong style="color: #475569;">نوع الخدمة:</strong> ${getServiceDescription(requestData.serviceType)}
            </div>
            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <strong style="color: #475569;">الميزانية المتوقعة:</strong> ${requestData.projectBudget}
            </div>
            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px;">
              <strong style="color: #475569;">الجدولة الزمنية:</strong> ${requestData.projectTimeline}
            </div>
          </div>

          <div style="background: #ecfdf5; padding: 20px; border-radius: 12px; border: 1px solid #22c55e; margin-bottom: 20px;">
            <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 18px;">✅ ماذا بعد الآن؟</h3>
            <ul style="color: #15803d; margin: 0; padding-right: 20px; line-height: 1.8;">
              <li>سيقوم فريقنا بمراجعة طلبك بعناية</li>
              <li>سنتواصل معك خلال 24 ساعة</li>
              <li>سنقدم لك عرض سعر مفصل ومخطط زمني</li>
              <li>سنناقش معك جميع التفاصيل التقنية</li>
            </ul>
          </div>

          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; text-align: center;">
            <h3 style="color: white; margin: 0 0 10px 0;">📞 تحتاج مساعدة عاجلة؟</h3>
            <p style="color: #e2e8f0; margin: 0 0 15px 0;">لا تتردد في التواصل معنا</p>
            <div style="color: white; font-size: 16px;">
              <p style="margin: 5px 0;">📧 info@alialshehriholding.com</p>
              <p style="margin: 5px 0;">📱 +966 55 581 2567</p>
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
        message: "تم إرسال طلبك بنجاح وسيتم التواصل معك قريباً",
        companyEmailId: companyEmailResponse.data?.id,
        clientEmailId: clientEmailResponse.data?.id
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
    console.error("Error in integrated-service-request function:", error);
    return new Response(
      JSON.stringify({ 
        error: "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى",
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