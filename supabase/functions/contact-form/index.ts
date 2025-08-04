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
      to: ["info@fekrahtech.com"],
      subject: `رسالة جديدة من موقع الشركة - ${contactData.subject || 'بدون موضوع'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #059669 0%, #0d9488 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="margin: 0; text-align: center;">رسالة جديدة من الموقع</h1>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">تفاصيل الرسالة:</h2>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #059669;">الاسم:</strong>
              <span style="margin-right: 10px;">${contactData.name}</span>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #059669;">البريد الإلكتروني:</strong>
              <span style="margin-right: 10px;">${contactData.email}</span>
            </div>
            
            ${contactData.phone ? `
            <div style="margin-bottom: 15px;">
              <strong style="color: #059669;">رقم الهاتف:</strong>
              <span style="margin-right: 10px;">${contactData.phone}</span>
            </div>
            ` : ''}
            
            ${contactData.category ? `
            <div style="margin-bottom: 15px;">
              <strong style="color: #059669;">نوع الاستفسار:</strong>
              <span style="margin-right: 10px;">${contactData.category}</span>
            </div>
            ` : ''}
            
            ${contactData.subject ? `
            <div style="margin-bottom: 15px;">
              <strong style="color: #059669;">الموضوع:</strong>
              <span style="margin-right: 10px;">${contactData.subject}</span>
            </div>
            ` : ''}
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #059669;">الرسالة:</strong>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px; border-right: 4px solid #059669;">
                ${contactData.message}
              </div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e8f4fd; border-radius: 5px; border-right: 4px solid #059669;">
              <strong>تاريخ الإرسال:</strong> ${new Date().toLocaleDateString('ar-SA')} ${new Date().toLocaleTimeString('ar-SA')}
            </div>
          </div>
          
          <div style="margin-top: 20px; text-align: center; color: #666; font-size: 14px;">
            تم إرسال هذا الإيميل تلقائياً من نظام التواصل بالموقع
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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #059669 0%, #0d9488 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="margin: 0; text-align: center;">شكراً لتواصلك معنا</h1>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              عزيزي/ة <strong>${contactData.name}</strong>,
            </p>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              شكراً لك على تواصلك معنا عبر موقع شركة علي صالح الشهري القابضة.
            </p>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              تم استلام رسالتك بنجاح وسيقوم فريقنا المختص بمراجعتها والرد عليك خلال 24 ساعة.
            </p>
            
            <div style="background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0; border-right: 4px solid #059669;">
              <h3 style="color: #059669; margin-top: 0;">ملخص رسالتك:</h3>
              ${contactData.subject ? `<p style="margin: 5px 0;"><strong>الموضوع:</strong> ${contactData.subject}</p>` : ''}
              ${contactData.category ? `<p style="margin: 5px 0;"><strong>نوع الاستفسار:</strong> ${contactData.category}</p>` : ''}
              <p style="margin: 5px 0;"><strong>تاريخ الإرسال:</strong> ${new Date().toLocaleDateString('ar-SA')}</p>
            </div>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              إذا كان لديك أي استفسار عاجل، يمكنك التواصل معنا مباشرة على:
            </p>
            
            <div style="background: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>📧 البريد الإلكتروني:</strong> info@fekrahtech.com</p>
              <p style="margin: 5px 0;"><strong>📞 الهاتف:</strong> 0555812567</p>
              <p style="margin: 5px 0;"><strong>💬 واتساب:</strong> +966555812567</p>
            </div>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              مع أطيب التحيات،<br>
              <strong>فريق خدمة العملاء</strong><br>
              شركة علي صالح الشهري القابضة
            </p>
          </div>
          
          <div style="margin-top: 20px; text-align: center;">
            <p style="color: #666; font-size: 14px;">
              للمزيد من المعلومات، زورو موقعنا: ash.holdings
            </p>
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