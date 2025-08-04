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
  type: 'welcome' | 'admin_notification' | 'password_reset' | 'otp_verification' | 'login_notification';
  data?: any;
  otp?: string;
  token?: string;
  redirectUrl?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("Received webhook payload:", body);
    
    // Handle Supabase auth webhook format
    if (body.user && body.user.email) {
      // This is a Supabase auth webhook
      const user = body.user;
      const emailData = body.email_data || {};
      
      // Determine email type based on webhook data
      let type = 'welcome';
      let subject = 'مرحباً بك في النظام';
      
      if (emailData.email_action_type === 'signup') {
        type = 'welcome';
        subject = 'مرحباً بك في شركة آل الشهري القابضة';
      } else if (emailData.email_action_type === 'recovery') {
        type = 'password_reset';
        subject = 'إعادة تعيين كلمة المرور';
      } else if (emailData.email_action_type === 'invite') {
        type = 'welcome';
        subject = 'دعوة للانضمام إلى النظام';
      }
      
      const { to, subject: customSubject, type: customType, data, otp, token, redirectUrl } = {
        to: user.email,
        subject,
        type,
        data: {
          name: user.user_metadata?.full_name || user.email?.split('@')[0],
          email: user.email,
          dashboardUrl: emailData.redirect_to || `${req.url.split('/functions')[0]}/dashboard`
        },
        otp: emailData.token,
        token: emailData.token_hash,
        redirectUrl: emailData.redirect_to
      };
      
      // Continue with normal email processing
      await sendEmail({ to, subject, type, data, otp, token, redirectUrl });
      
    } else {
      // Handle direct API calls
      const { to, subject, type, data, otp, token, redirectUrl }: EmailRequest = body;
      await sendEmail({ to, subject, type, data, otp, token, redirectUrl });
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
    
  } catch (error: any) {
    console.error("Error in auth-emails function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

async function sendEmail({ to, subject, type, data, otp, token, redirectUrl }: EmailRequest) {

    let html = '';
    
    switch (type) {
      case 'welcome':
        html = `
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>مرحباً بك</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%); padding: 40px 30px; text-align: center; position: relative;">
                <div style="background: rgba(255,255,255,0.1); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                  <div style="background: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <span style="color: #1e40af; font-size: 24px; font-weight: bold;">✓</span>
                  </div>
                </div>
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">مرحباً بك في النظام!</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">شركة علي صالح الشهري القابضة</p>
              </div>

              <!-- Content -->
              <div style="padding: 40px 30px;">
                <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">أهلاً وسهلاً ${data?.name || 'عزيزي العميل'}!</h2>
                
                <p style="color: #64748b; line-height: 1.8; font-size: 16px; margin: 0 0 30px 0;">
                  تم إنشاء حسابك بنجاح في نظام خدمة العملاء. يمكنك الآن الاستفادة من جميع خدماتنا المتميزة والوصول إلى لوحة التحكم الخاصة بك.
                </p>

                <!-- Features -->
                <div style="background: #f8fafc; border-radius: 12px; padding: 25px; margin: 30px 0; border-right: 4px solid #3b82f6;">
                  <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; font-weight: 600;">ميزات حسابك الجديد:</h3>
                  <ul style="color: #64748b; margin: 0; padding-right: 20px; line-height: 1.8;">
                    <li>إدارة طلباتك ومتابعة حالتها</li>
                    <li>تواصل مباشر مع فريق الدعم</li>
                    <li>تقارير مفصلة عن خدماتك</li>
                    <li>إشعارات فورية للتحديثات</li>
                  </ul>
                </div>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 35px 0;">
                  <a href="${data?.dashboardUrl || redirectUrl || '#'}" style="
                    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
                    color: white;
                    padding: 16px 32px;
                    text-decoration: none;
                    border-radius: 8px;
                    display: inline-block;
                    font-weight: 600;
                    font-size: 16px;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
                    transition: all 0.3s ease;
                  ">
                    دخول إلى لوحة التحكم ←
                  </a>
                </div>

                <!-- Help Section -->
                <div style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); border-radius: 12px; padding: 20px; margin: 30px 0; text-align: center;">
                  <p style="color: #92400e; margin: 0; font-size: 14px;">
                    هل تحتاج للمساعدة؟ فريق الدعم متاح على مدار الساعة
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div style="background: #1e293b; padding: 25px 30px; text-align: center;">
                <p style="color: #94a3b8; margin: 0; font-size: 14px;">
                  © 2024 شركة علي صالح الشهري القابضة - جميع الحقوق محفوظة
                </p>
              </div>
            </div>
          </body>
          </html>
        `;
        break;

      case 'otp_verification':
        html = `
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>رمز التحقق</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%); padding: 40px 30px; text-align: center;">
                <div style="background: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 36px;">🔐</span>
                </div>
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">رمز التحقق</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">تأكيد إنشاء حسابك</p>
              </div>

              <!-- Content -->
              <div style="padding: 40px 30px; text-align: center;">
                <p style="color: #64748b; font-size: 16px; margin: 0 0 30px 0; line-height: 1.6;">
                  استخدم الرمز التالي لتأكيد إنشاء حسابك في نظام خدمة العملاء
                </p>

                <!-- OTP Code -->
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 16px; padding: 30px; margin: 30px 0; border: 2px dashed #7c3aed;">
                  <p style="color: #475569; margin: 0 0 15px 0; font-size: 14px; font-weight: 500;">رمز التحقق الخاص بك:</p>
                  <div style="font-size: 32px; font-weight: 700; color: #7c3aed; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                    ${otp || '123456'}
                  </div>
                  <p style="color: #64748b; margin: 15px 0 0 0; font-size: 12px;">
                    صالح لمدة 10 دقائق فقط
                  </p>
                </div>

                <!-- Warning -->
                <div style="background: #fef2f2; border-radius: 12px; padding: 20px; margin: 30px 0; border-right: 4px solid #ef4444;">
                  <p style="color: #dc2626; margin: 0; font-size: 14px; font-weight: 500;">
                    ⚠️ لا تشارك هذا الرمز مع أي شخص آخر
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div style="background: #1e293b; padding: 25px 30px; text-align: center;">
                <p style="color: #94a3b8; margin: 0; font-size: 14px;">
                  © 2024 شركة علي صالح الشهري القابضة
                </p>
              </div>
            </div>
          </body>
          </html>
        `;
        break;

      case 'password_reset':
        html = `
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>إعادة تعيين كلمة المرور</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%); padding: 40px 30px; text-align: center;">
                <div style="background: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 36px;">🔑</span>
                </div>
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">إعادة تعيين كلمة المرور</h1>
              </div>

              <!-- Content -->
              <div style="padding: 40px 30px;">
                <p style="color: #64748b; font-size: 16px; margin: 0 0 30px 0; line-height: 1.6;">
                  تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك. اضغط على الزر أدناه لإنشاء كلمة مرور جديدة.
                </p>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 35px 0;">
                  <a href="${redirectUrl || '#'}" style="
                    background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
                    color: white;
                    padding: 16px 32px;
                    text-decoration: none;
                    border-radius: 8px;
                    display: inline-block;
                    font-weight: 600;
                    font-size: 16px;
                    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
                  ">
                    إعادة تعيين كلمة المرور ←
                  </a>
                </div>

                <!-- Security Note -->
                <div style="background: #fef3c7; border-radius: 12px; padding: 20px; margin: 30px 0; border-right: 4px solid #f59e0b;">
                  <p style="color: #92400e; margin: 0; font-size: 14px;">
                    🛡️ إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا الإيميل. حسابك آمن.
                  </p>
                </div>

                <!-- Expiry -->
                <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 20px 0 0 0;">
                  هذا الرابط صالح لمدة ساعة واحدة فقط
                </p>
              </div>

              <!-- Footer -->
              <div style="background: #1e293b; padding: 25px 30px; text-align: center;">
                <p style="color: #94a3b8; margin: 0; font-size: 14px;">
                  © 2024 شركة علي صالح الشهري القابضة
                </p>
              </div>
            </div>
          </body>
          </html>
        `;
        break;
        
      case 'admin_notification':
        html = `
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>إشعار إداري</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">📊 إشعار إداري جديد</h1>
              </div>

              <!-- Content -->
              <div style="padding: 30px;">
                <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 20px;">مستخدم جديد انضم للنظام</h2>
                
                <!-- User Info Card -->
                <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0; border-right: 4px solid #10b981;">
                  <div style="display: grid; gap: 10px;">
                    <p style="margin: 0;"><strong style="color: #374151;">الاسم:</strong> <span style="color: #6b7280;">${data?.name || 'غير محدد'}</span></p>
                    <p style="margin: 0;"><strong style="color: #374151;">البريد الإلكتروني:</strong> <span style="color: #6b7280;">${data?.email || 'غير محدد'}</span></p>
                    <p style="margin: 0;"><strong style="color: #374151;">تاريخ التسجيل:</strong> <span style="color: #6b7280;">${new Date().toLocaleDateString('ar-SA')}</span></p>
                    <p style="margin: 0;"><strong style="color: #374151;">الوقت:</strong> <span style="color: #6b7280;">${new Date().toLocaleTimeString('ar-SA')}</span></p>
                  </div>
                </div>

                <!-- Action Required -->
                <div style="background: #fffbeb; border-radius: 12px; padding: 20px; margin: 20px 0; border-right: 4px solid #f59e0b;">
                  <p style="color: #92400e; margin: 0; font-weight: 500;">
                    💡 يرجى مراجعة الحساب الجديد وتحديد الصلاحيات المناسبة
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div style="background: #1e293b; padding: 20px; text-align: center;">
                <p style="color: #94a3b8; margin: 0; font-size: 14px;">
                  نظام خدمة العملاء - شركة علي صالح الشهري القابضة
                </p>
              </div>
            </div>
          </body>
          </html>
        `;
        break;
        
      default:
        html = `
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
              <h2 style="color: #1e293b; margin: 0 0 20px 0;">${subject}</h2>
              <p style="color: #64748b; line-height: 1.6;">رسالة من شركة علي صالح الشهري القابضة</p>
              
              <div style="background: #1e293b; padding: 20px; text-align: center; margin-top: 30px; border-radius: 8px;">
                <p style="color: #94a3b8; margin: 0; font-size: 14px;">
                  © 2024 شركة علي صالح الشهري القابضة
                </p>
              </div>
            </div>
          </body>
          </html>
        `;
    }

    const emailResponse = await resend.emails.send({
      from: "شركة آل الشهري القابضة <noreply@alialshehriholding.com>",
      to: [to],
      subject,
      html,
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    });

    console.log("Email sent successfully:", emailResponse);
    return emailResponse;
}

serve(handler);