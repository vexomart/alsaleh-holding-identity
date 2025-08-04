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
      from: "نظام التواصل <contact@alialshehriholding.com>",
      to: ["info@alialshehriholding.com"],
      subject: `رسالة جديدة من موقع الشركة - ${contactData.subject || 'بدون موضوع'}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #f8fafc; padding: 30px; border-radius: 15px; direction: rtl;">
          <div style="background: linear-gradient(135deg, #059669 0%, #0d9488 100%); color: white; padding: 25px; border-radius: 12px; margin-bottom: 25px; text-align: center; box-shadow: 0 4px 15px rgba(5, 150, 105, 0.3);">
            <div style="font-size: 40px; margin-bottom: 10px;">📬</div>
            <h1 style="margin: 0; font-size: 24px; font-weight: 600;">رسالة جديدة من العميل</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">شركة علي صالح الشهري القابضة</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 20px;">
            <div style="border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 25px;">
              <h2 style="color: #1e293b; margin: 0; font-size: 20px; font-weight: 600; display: flex; align-items: center;">
                <span style="margin-left: 10px; font-size: 24px;">👤</span>
                معلومات المرسل
              </h2>
            </div>
            
            <div style="display: grid; gap: 18px;">
              <div style="background: #f8fafc; padding: 18px; border-radius: 8px; border-right: 4px solid #059669;">
                <div style="font-weight: 600; color: #059669; margin-bottom: 5px; display: flex; align-items: center;">
                  <span style="margin-left: 8px; font-size: 18px;">🏷️</span>
                  الاسم الكامل
                </div>
                <div style="font-size: 16px; color: #334155;">${contactData.name}</div>
              </div>
              
              <div style="background: #f8fafc; padding: 18px; border-radius: 8px; border-right: 4px solid #0ea5e9;">
                <div style="font-weight: 600; color: #0ea5e9; margin-bottom: 5px; display: flex; align-items: center;">
                  <span style="margin-left: 8px; font-size: 18px;">📧</span>
                  البريد الإلكتروني
                </div>
                <div style="font-size: 16px; color: #334155;">
                  <a href="mailto:${contactData.email}" style="color: #0ea5e9; text-decoration: none;">${contactData.email}</a>
                </div>
              </div>
              
              ${contactData.phone ? `
              <div style="background: #f8fafc; padding: 18px; border-radius: 8px; border-right: 4px solid #10b981;">
                <div style="font-weight: 600; color: #10b981; margin-bottom: 5px; display: flex; align-items: center;">
                  <span style="margin-left: 8px; font-size: 18px;">📱</span>
                  رقم الهاتف
                </div>
                <div style="font-size: 16px; color: #334155;">
                  <a href="tel:${contactData.phone}" style="color: #10b981; text-decoration: none;">${contactData.phone}</a>
                </div>
              </div>
              ` : ''}
              
              ${contactData.category ? `
              <div style="background: #f8fafc; padding: 18px; border-radius: 8px; border-right: 4px solid #8b5cf6;">
                <div style="font-weight: 600; color: #8b5cf6; margin-bottom: 5px; display: flex; align-items: center;">
                  <span style="margin-left: 8px; font-size: 18px;">🏷️</span>
                  نوع الاستفسار
                </div>
                <div style="font-size: 16px; color: #334155;">${contactData.category}</div>
              </div>
              ` : ''}
              
              ${contactData.subject ? `
              <div style="background: #f8fafc; padding: 18px; border-radius: 8px; border-right: 4px solid #f59e0b;">
                <div style="font-weight: 600; color: #f59e0b; margin-bottom: 5px; display: flex; align-items: center;">
                  <span style="margin-left: 8px; font-size: 18px;">📝</span>
                  الموضوع
                </div>
                <div style="font-size: 16px; color: #334155;">${contactData.subject}</div>
              </div>
              ` : ''}
            </div>
            
            <div style="margin-top: 25px; padding-top: 20px; border-top: 2px solid #f1f5f9;">
              <div style="font-weight: 600; color: #1e293b; margin-bottom: 15px; display: flex; align-items: center; font-size: 18px;">
                <span style="margin-left: 10px; font-size: 24px;">💬</span>
                نص الرسالة
              </div>
              <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 20px; border-radius: 10px; border-right: 4px solid #0ea5e9; line-height: 1.6; font-size: 16px; color: #334155;">
                ${contactData.message}
              </div>
            </div>
            
            <div style="margin-top: 25px; padding: 20px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 10px; border-right: 4px solid #f59e0b;">
              <div style="display: flex; align-items: center; color: #92400e;">
                <span style="margin-left: 10px; font-size: 20px;">⏰</span>
                <strong>تاريخ ووقت الإرسال:</strong>
                <span style="margin-right: 10px;">${new Date().toLocaleDateString('ar-SA')} - ${new Date().toLocaleTimeString('ar-SA')}</span>
              </div>
            </div>
          </div>
          
          <div style="background: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            <div style="color: #64748b; font-size: 14px; margin-bottom: 15px;">
              <span style="font-size: 20px; margin-left: 5px;">🤖</span>
              تم إرسال هذا الإيميل تلقائياً من نظام إدارة المراسلات
            </div>
            <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; color: #059669; font-weight: 600;">
              شركة علي صالح الشهري القابضة - نظام التواصل الذكي
            </div>
          </div>
        </div>
      `,
    });

    console.log("Company email sent:", companyEmailResponse);

    // Send confirmation email to sender
    const senderEmailResponse = await resend.emails.send({
      from: "شركة علي صالح الشهري القابضة <no-reply@alialshehriholding.com>",
      to: [contactData.email],
      subject: "تم استلام رسالتك بنجاح",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #f8fafc; padding: 30px; border-radius: 15px; direction: rtl;">
          <div style="background: linear-gradient(135deg, #059669 0%, #0d9488 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 25px; text-align: center; box-shadow: 0 4px 15px rgba(5, 150, 105, 0.3);">
            <div style="font-size: 50px; margin-bottom: 15px;">✨</div>
            <h1 style="margin: 0; font-size: 26px; font-weight: 600;">شكراً لتواصلك معنا</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">تم استلام رسالتك بنجاح</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 25px;">
            <div style="text-align: center; margin-bottom: 25px;">
              <div style="font-size: 60px; margin-bottom: 15px;">👋</div>
              <h2 style="color: #1e293b; margin: 0; font-size: 22px; font-weight: 600;">
                مرحباً <span style="color: #059669;">${contactData.name}</span>
              </h2>
            </div>
            
            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-right: 4px solid #059669;">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <span style="font-size: 24px; margin-left: 10px;">✅</span>
                <h3 style="color: #059669; margin: 0; font-size: 18px; font-weight: 600;">تأكيد الاستلام</h3>
              </div>
              <p style="color: #166534; font-size: 16px; line-height: 1.6; margin: 0;">
                تم استلام رسالتك بنجاح وسيقوم فريقنا المختص بمراجعتها والرد عليك خلال <strong>24 ساعة</strong>.
              </p>
            </div>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #e2e8f0;">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <span style="font-size: 20px; margin-left: 8px;">📋</span>
                <h3 style="color: #1e293b; margin: 0; font-size: 16px; font-weight: 600;">ملخص رسالتك</h3>
              </div>
              <div style="display: grid; gap: 10px;">
                ${contactData.subject ? `
                <div style="display: flex; align-items: center;">
                  <span style="font-size: 16px; margin-left: 8px;">📝</span>
                  <strong style="color: #475569; margin-left: 8px;">الموضوع:</strong>
                  <span style="color: #334155;">${contactData.subject}</span>
                </div>
                ` : ''}
                ${contactData.category ? `
                <div style="display: flex; align-items: center;">
                  <span style="font-size: 16px; margin-left: 8px;">🏷️</span>
                  <strong style="color: #475569; margin-left: 8px;">نوع الاستفسار:</strong>
                  <span style="color: #334155;">${contactData.category}</span>
                </div>
                ` : ''}
                <div style="display: flex; align-items: center;">
                  <span style="font-size: 16px; margin-left: 8px;">⏰</span>
                  <strong style="color: #475569; margin-left: 8px;">تاريخ الإرسال:</strong>
                  <span style="color: #334155;">${new Date().toLocaleDateString('ar-SA')}</span>
                </div>
              </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 10px; margin-bottom: 25px; border-right: 4px solid #f59e0b;">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <span style="font-size: 20px; margin-left: 8px;">🚀</span>
                <h3 style="color: #92400e; margin: 0; font-size: 16px; font-weight: 600;">للاستفسارات العاجلة</h3>
              </div>
              <div style="display: grid; gap: 12px;">
                <div style="display: flex; align-items: center; background: white; padding: 12px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                  <span style="font-size: 18px; margin-left: 10px;">📧</span>
                  <span style="color: #374151; margin-left: 8px; font-weight: 500;">البريد الإلكتروني:</span>
                  <a href="mailto:info@alialshehriholding.com" style="color: #0ea5e9; text-decoration: none; font-weight: 600;">info@alialshehriholding.com</a>
                </div>
                <div style="display: flex; align-items: center; background: white; padding: 12px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                  <span style="font-size: 18px; margin-left: 10px;">📞</span>
                  <span style="color: #374151; margin-left: 8px; font-weight: 500;">الهاتف:</span>
                  <a href="tel:+966555812567" style="color: #10b981; text-decoration: none; font-weight: 600;">+966 555 812 567</a>
                </div>
                <div style="display: flex; align-items: center; background: white; padding: 12px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                  <span style="font-size: 18px; margin-left: 10px;">💬</span>
                  <span style="color: #374151; margin-left: 8px; font-weight: 500;">واتساب:</span>
                  <a href="https://wa.me/966555812567" style="color: #059669; text-decoration: none; font-weight: 600;">+966 555 812 567</a>
                </div>
              </div>
            </div>
            
            <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 10px; border: 1px solid #bae6fd;">
              <p style="color: #1e293b; font-size: 16px; line-height: 1.6; margin: 0;">
                مع أطيب التحيات،<br>
                <strong style="color: #059669;">فريق خدمة العملاء</strong><br>
                <span style="font-size: 18px;">🏢</span> شركة علي صالح الشهري القابضة
              </p>
            </div>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            <div style="color: #64748b; font-size: 14px; margin-bottom: 10px;">
              <span style="font-size: 16px; margin-left: 5px;">🌐</span>
              للمزيد من المعلومات، زوروا موقعنا: 
              <a href="https://alialshehriholding.com" style="color: #059669; text-decoration: none; font-weight: 600;">alialshehriholding.com</a>
            </div>
            <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; color: #059669; font-weight: 600; font-size: 12px;">
              نظام المراسلات التلقائي - شركة علي صالح الشهري القابضة
            </div>
          </div>
        </div>
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