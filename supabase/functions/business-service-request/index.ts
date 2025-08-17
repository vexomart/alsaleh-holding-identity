import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BusinessServiceRequest {
  name: string;
  email: string;
  phone: string;
  position: string;
  company: string;
  serviceType: string;
  projectDescription: string;
  objectives: string;
  currentChallenges: string;
  budget: string;
  timeline: string;
  additionalNotes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: BusinessServiceRequest = await req.json();
    
    console.log("Received business service request:", requestData);

    // Send email to company
    const companyEmailResponse = await resend.emails.send({
      from: "Ali AlShehri Holding <info@alialshehriholding.com>",
      to: ["info@alialshehriholding.com"],
      bcc: ["info@alialshehriholding.com"],
      subject: `طلب خدمة أعمال جديد من ${requestData.name}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>طلب خدمة أعمال جديد</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; direction: rtl;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">طلب خدمة أعمال جديد</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">شركة علي صالح الشهري القابضة</p>
            </div>

            <!-- Content -->
            <div style="padding: 30px;">
              <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin-bottom: 25px; border-right: 4px solid #3b82f6;">
                <h2 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 20px;">معلومات العميل</h2>
                <div style="display: grid; gap: 10px;">
                  <p style="margin: 0; color: #475569;"><strong style="color: #1e3a8a;">الاسم:</strong> ${requestData.name}</p>
                  <p style="margin: 0; color: #475569;"><strong style="color: #1e3a8a;">البريد الإلكتروني:</strong> ${requestData.email}</p>
                  <p style="margin: 0; color: #475569;"><strong style="color: #1e3a8a;">رقم الهاتف:</strong> ${requestData.phone}</p>
                  <p style="margin: 0; color: #475569;"><strong style="color: #1e3a8a;">المنصب:</strong> ${requestData.position}</p>
                  <p style="margin: 0; color: #475569;"><strong style="color: #1e3a8a;">الشركة:</strong> ${requestData.company}</p>
                </div>
              </div>

              <div style="background-color: #ecfdf5; border-radius: 8px; padding: 20px; margin-bottom: 25px; border-right: 4px solid #10b981;">
                <h2 style="color: #059669; margin: 0 0 15px 0; font-size: 20px;">تفاصيل الخدمة المطلوبة</h2>
                <div style="display: grid; gap: 15px;">
                  <p style="margin: 0; color: #475569;"><strong style="color: #059669;">نوع الخدمة:</strong> ${requestData.serviceType}</p>
                  <div>
                    <p style="margin: 0 0 5px 0; color: #059669; font-weight: bold;">وصف المشروع:</p>
                    <p style="margin: 0; color: #475569; background-color: white; padding: 10px; border-radius: 4px; border: 1px solid #d1d5db;">${requestData.projectDescription}</p>
                  </div>
                  <div>
                    <p style="margin: 0 0 5px 0; color: #059669; font-weight: bold;">الأهداف:</p>
                    <p style="margin: 0; color: #475569; background-color: white; padding: 10px; border-radius: 4px; border: 1px solid #d1d5db;">${requestData.objectives}</p>
                  </div>
                  <div>
                    <p style="margin: 0 0 5px 0; color: #059669; font-weight: bold;">التحديات الحالية:</p>
                    <p style="margin: 0; color: #475569; background-color: white; padding: 10px; border-radius: 4px; border: 1px solid #d1d5db;">${requestData.currentChallenges}</p>
                  </div>
                </div>
              </div>

              <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 25px; border-right: 4px solid #f59e0b;">
                <h2 style="color: #d97706; margin: 0 0 15px 0; font-size: 20px;">تفاصيل المشروع</h2>
                <div style="display: grid; gap: 10px;">
                  <p style="margin: 0; color: #475569;"><strong style="color: #d97706;">الميزانية:</strong> ${requestData.budget}</p>
                  <p style="margin: 0; color: #475569;"><strong style="color: #d97706;">الجدول الزمني:</strong> ${requestData.timeline}</p>
                  ${requestData.additionalNotes ? `
                    <div>
                      <p style="margin: 0 0 5px 0; color: #d97706; font-weight: bold;">ملاحظات إضافية:</p>
                      <p style="margin: 0; color: #475569; background-color: white; padding: 10px; border-radius: 4px; border: 1px solid #d1d5db;">${requestData.additionalNotes}</p>
                    </div>
                  ` : ''}
                </div>
              </div>

              <div style="background-color: #1e3a8a; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-top: 30px;">
                <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">للرد على هذا الطلب:</p>
                <p style="margin: 0; font-size: 14px;">يرجى التواصل مع العميل على البريد الإلكتروني أو رقم الهاتف المذكور أعلاه</p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">
                شركة علي صالح الشهري القابضة<br>
                <strong>البريد الإلكتروني:</strong> info@alialshehriholding.com
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
      from: "Ali AlShehri Holding <info@alialshehriholding.com>",
      to: [requestData.email],
      bcc: ["info@alialshehriholding.com"],
      reply_to: "info@alialshehriholding.com",
      subject: "تم استلام طلبكم بنجاح - شركة علي صالح الشهري القابضة",
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>تأكيد استلام الطلب</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; direction: rtl;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">تم استلام طلبكم بنجاح</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">شركة علي صالح الشهري القابضة</p>
            </div>

            <!-- Content -->
            <div style="padding: 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; background-color: #10b981; color: white; padding: 15px; border-radius: 50%; margin-bottom: 20px;">
                  <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h2 style="color: #1e3a8a; margin: 0; font-size: 24px;">شكراً لك ${requestData.name}</h2>
              </div>

              <div style="background-color: #f0f9ff; border-radius: 8px; padding: 25px; margin-bottom: 25px; border-right: 4px solid #3b82f6;">
                <p style="margin: 0 0 15px 0; color: #1e3a8a; font-size: 18px; font-weight: bold;">تم استلام طلب خدمة الأعمال الخاص بك</p>
                <p style="margin: 0 0 10px 0; color: #475569; line-height: 1.6;">
                  لقد تم استلام طلبكم لخدمة <strong style="color: #1e3a8a;">${requestData.serviceType}</strong> بنجاح. 
                  سيقوم فريقنا المتخصص بمراجعة طلبكم والتواصل معكم في أقرب وقت ممكن.
                </p>
              </div>

              <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <h3 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 18px;">ملخص طلبكم:</h3>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #475569; line-height: 1.8;">
                  <li><strong>نوع الخدمة:</strong> ${requestData.serviceType}</li>
                  <li><strong>الميزانية:</strong> ${requestData.budget}</li>
                  <li><strong>الجدول الزمني:</strong> ${requestData.timeline}</li>
                </ul>
              </div>

              <div style="background-color: #ecfdf5; border-radius: 8px; padding: 20px; margin-bottom: 25px; border-right: 4px solid #10b981;">
                <h3 style="color: #059669; margin: 0 0 15px 0; font-size: 18px;">الخطوات التالية:</h3>
                <ol style="margin: 0; padding: 0 0 0 20px; color: #475569; line-height: 1.8;">
                  <li>مراجعة طلبكم من قبل فريق المتخصصين</li>
                  <li>التواصل معكم خلال 24-48 ساعة</li>
                  <li>تحديد موعد للاستشارة المجانية</li>
                  <li>إعداد خطة مفصلة وعرض أسعار</li>
                </ol>
              </div>

              <div style="background-color: #1e3a8a; color: white; padding: 20px; border-radius: 8px; text-align: center;">
                <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">هل لديكم أي استفسار؟</p>
                <p style="margin: 0; font-size: 14px;">
                  يمكنكم التواصل معنا في أي وقت<br>
                  <strong>البريد الإلكتروني:</strong> info@alialshehriholding.com<br>
                  <strong>الهاتف:</strong> 0555812567
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">
                شركة علي صالح الشهري القابضة<br>
                نقدم حلول الأعمال المتكاملة والخدمات التقنية المتطورة
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
        success: true, 
        message: "تم إرسال طلب خدمة الأعمال بنجاح",
        companyEmailId: companyEmailResponse.data?.id,
        customerEmailId: customerEmailResponse.data?.id
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error("Error in business-service-request function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 500,
      }
    );
  }
};

serve(handler);