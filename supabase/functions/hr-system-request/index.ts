import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface HRSystemRequest {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  employeeCount: string;
  message: string;
  selectedModules: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: HRSystemRequest = await req.json();
    console.log("HR System request received:", requestData);

    // Send confirmation email to client
    const clientEmailResponse = await resend.emails.send({
      from: "نظام إدارة الموارد البشرية <noreply@tasaheel.com>",
      to: [requestData.email],
      subject: "تأكيد طلب نظام إدارة الموارد البشرية",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 0; border-radius: 20px; overflow: hidden;">
          <div style="background: white; margin: 20px; border-radius: 15px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">✅ تم استلام طلبك</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">نظام إدارة الموارد البشرية</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">مرحباً ${requestData.contactName}</h2>
              
              <p style="color: #666; line-height: 1.6; margin: 0 0 25px 0; font-size: 16px;">
                شكراً لك على اهتمامك بنظام إدارة الموارد البشرية. تم استلام طلبك بنجاح وسيتواصل معك فريقنا المختص خلال 24 ساعة.
              </p>
              
              <!-- Request Details -->
              <div style="background: #f8f9ff; padding: 25px; border-radius: 12px; margin: 25px 0; border-right: 4px solid #667eea;">
                <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">تفاصيل طلبك:</h3>
                <div style="space-y: 10px;">
                  <p style="margin: 8px 0; color: #555;"><strong>اسم الشركة:</strong> ${requestData.companyName}</p>
                  <p style="margin: 8px 0; color: #555;"><strong>الإيميل:</strong> ${requestData.email}</p>
                  <p style="margin: 8px 0; color: #555;"><strong>الهاتف:</strong> ${requestData.phone}</p>
                  <p style="margin: 8px 0; color: #555;"><strong>عدد الموظفين:</strong> ${requestData.employeeCount}</p>
                  ${requestData.selectedModules.length > 0 ? `
                    <p style="margin: 8px 0; color: #555;"><strong>الوحدات المطلوبة:</strong></p>
                    <ul style="margin: 5px 0; padding-right: 20px; color: #555;">
                      ${requestData.selectedModules.map(module => `<li style="margin: 5px 0;">${module}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              </div>
              
              <!-- Next Steps -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 12px; margin: 25px 0;">
                <h3 style="color: white; margin: 0 0 15px 0; font-size: 18px;">الخطوات التالية:</h3>
                <ul style="color: rgba(255,255,255,0.9); margin: 0; padding-right: 20px; line-height: 1.8;">
                  <li>سيتواصل معك مستشار تقني خلال 24 ساعة</li>
                  <li>تحليل احتياجات شركتك</li>
                  <li>عرض توضيحي مخصص للنظام</li>
                  <li>اقتراح الحل الأمثل لشركتك</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <p style="color: #666; margin: 0 0 20px 0;">هل لديك أسئلة؟ تواصل معنا</p>
                <div style="display: inline-block; background: #f0f0f0; padding: 15px 25px; border-radius: 8px;">
                  <p style="margin: 5px 0; color: #333;"><strong>📧 البريد الإلكتروني:</strong> info@tasaheel.com</p>
                  <p style="margin: 5px 0; color: #333;"><strong>📱 الهاتف:</strong> +966 11 234 5678</p>
                </div>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8f9ff; padding: 25px 30px; text-align: center; border-top: 1px solid #eee;">
              <p style="color: #999; margin: 0; font-size: 14px;">
                © 2024 تسهيل للحلول التقنية - جميع الحقوق محفوظة
              </p>
            </div>
          </div>
        </div>
      `,
    });

    // Send notification email to company
    const companyEmailResponse = await resend.emails.send({
      from: "نظام إدارة الموارد البشرية <noreply@tasaheel.com>",
      to: ["info@tasaheel.com"],
      subject: `طلب جديد لنظام إدارة الموارد البشرية - ${requestData.companyName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background: #f5f7fa; padding: 20px;">
          <div style="background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 26px;">🔔 طلب جديد - نظام HR</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">يتطلب متابعة فورية</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
                <p style="margin: 0; color: #856404; font-weight: bold;">⚡ أولوية عالية - يجب التواصل خلال 24 ساعة</p>
              </div>
              
              <h2 style="color: #333; margin: 0 0 20px 0;">معلومات العميل:</h2>
              
              <div style="background: #f8f9ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-right: 4px solid #667eea;">
                <div style="display: grid; gap: 12px;">
                  <p style="margin: 0; color: #333;"><strong>🏢 الشركة:</strong> ${requestData.companyName}</p>
                  <p style="margin: 0; color: #333;"><strong>👤 اسم المسؤول:</strong> ${requestData.contactName}</p>
                  <p style="margin: 0; color: #333;"><strong>📧 الإيميل:</strong> <a href="mailto:${requestData.email}" style="color: #667eea;">${requestData.email}</a></p>
                  <p style="margin: 0; color: #333;"><strong>📱 الهاتف:</strong> <a href="tel:${requestData.phone}" style="color: #667eea;">${requestData.phone}</a></p>
                  <p style="margin: 0; color: #333;"><strong>👥 عدد الموظفين:</strong> ${requestData.employeeCount}</p>
                </div>
              </div>
              
              ${requestData.selectedModules.length > 0 ? `
                <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; margin: 20px 0;">
                  <h3 style="color: #2d5a2d; margin: 0 0 15px 0;">الوحدات المطلوبة:</h3>
                  <ul style="margin: 0; padding-right: 20px; color: #2d5a2d;">
                    ${requestData.selectedModules.map(module => `<li style="margin: 8px 0;">${module}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              
              ${requestData.message ? `
                <div style="background: #f0f8ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
                  <h3 style="color: #1e40af; margin: 0 0 15px 0;">رسالة إضافية:</h3>
                  <p style="color: #1e40af; margin: 0; line-height: 1.6; white-space: pre-wrap;">${requestData.message}</p>
                </div>
              ` : ''}
              
              <!-- Action Buttons -->
              <div style="text-align: center; margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px;">
                <h3 style="color: white; margin: 0 0 15px 0;">إجراءات مطلوبة:</h3>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                  <a href="mailto:${requestData.email}" style="background: white; color: #333; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">📧 رد بالإيميل</a>
                  <a href="tel:${requestData.phone}" style="background: white; color: #333; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">📞 اتصال مباشر</a>
                </div>
              </div>
              
              <div style="background: #fee; border: 1px solid #fcc; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #c33; font-weight: bold;">⏰ تذكير: يجب التواصل مع العميل خلال 24 ساعة لضمان جودة الخدمة</p>
              </div>
            </div>
            
            <div style="background: #f8f9ff; padding: 20px; text-align: center; border-top: 1px solid #eee;">
              <p style="color: #666; margin: 0; font-size: 14px;">
                تم إرسال هذا الإشعار تلقائياً من نظام إدارة الطلبات
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Emails sent successfully:", { clientEmailResponse, companyEmailResponse });

    return new Response(
      JSON.stringify({ 
        message: "تم إرسال طلبك بنجاح! سيتواصل معك فريقنا خلال 24 ساعة",
        success: true 
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
    console.error("Error in HR system request function:", error);
    return new Response(
      JSON.stringify({ 
        error: "حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.",
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);