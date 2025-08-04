import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  type: 'welcome' | 'admin_notification' | 'password_reset';
  data?: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, type, data }: EmailRequest = await req.json();

    let html = '';
    
    switch (type) {
      case 'welcome':
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
              <h1 style="color: white; margin: 0;">مرحباً بك في شركة الصالح القابضة</h1>
            </div>
            <div style="padding: 40px; background: #f8f9fa;">
              <h2 style="color: #333;">أهلاً وسهلاً ${data?.name || ''}!</h2>
              <p style="color: #666; line-height: 1.6;">
                نشكرك لانضمامك إلى منصة شركة الصالح القابضة. يمكنك الآن الوصول إلى جميع خدماتنا وحلولنا المتطورة.
              </p>
              <div style="margin: 30px 0; padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #667eea;">
                <h3 style="margin: 0 0 10px 0; color: #333;">ما يمكنك فعله الآن:</h3>
                <ul style="color: #666; margin: 10px 0;">
                  <li>تصفح خدماتنا المتنوعة</li>
                  <li>طلب عروض أسعار مخصصة</li>
                  <li>التواصل مع فريق الدعم</li>
                  <li>متابعة آخر الأخبار والتحديثات</li>
                </ul>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data?.dashboardUrl || '#'}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  دخول إلى لوحة التحكم
                </a>
              </div>
            </div>
            <div style="background: #333; padding: 20px; text-align: center;">
              <p style="color: #999; margin: 0;">شركة الصالح القابضة © 2024</p>
            </div>
          </div>
        `;
        break;
        
      case 'admin_notification':
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #dc3545; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">إشعار إداري جديد</h1>
            </div>
            <div style="padding: 30px; background: #f8f9fa;">
              <h2 style="color: #333;">مستخدم جديد سجل في المنصة</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>الاسم:</strong> ${data?.name || 'غير محدد'}</p>
                <p><strong>البريد الإلكتروني:</strong> ${data?.email || 'غير محدد'}</p>
                <p><strong>تاريخ التسجيل:</strong> ${new Date().toLocaleDateString('ar-SA')}</p>
              </div>
            </div>
          </div>
        `;
        break;
        
      default:
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px;">
            <h2 style="color: #333;">${subject}</h2>
            <p style="color: #666;">رسالة من شركة الصالح القابضة</p>
          </div>
        `;
    }

    const emailResponse = await resend.emails.send({
      from: "شركة آل الشهري القابضة <noreply@alialshehriholding.com>",
      to: [to],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);