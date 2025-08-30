import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OTPEmailRequest {
  email: string;
  name: string;
  otpCode: string;
  type: 'registration' | 'login';
}

const handler = async (req: Request): Promise<Response> => {
  console.log('📧 OTP Email Service: Request received');
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, otpCode, type }: OTPEmailRequest = await req.json();
    
    console.log(`📧 Sending OTP email to: ${email}, Type: ${type}`);

    const isRegistration = type === 'registration';
    const subject = isRegistration ? "تأكيد إنشاء الحساب - رمز التحقق" : "رمز تسجيل الدخول";
    const title = isRegistration ? "مرحباً بك!" : "تسجيل الدخول";
    const message = isRegistration 
      ? "شكراً لك على إنشاء حساب جديد. استخدم الرمز التالي لتأكيد حسابك:"
      : "استخدم الرمز التالي لتسجيل الدخول إلى حسابك:";

    const emailResponse = await resend.emails.send({
      from: "شركة الشهري للتطوير <noreply@resend.dev>",
      to: [email],
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
              direction: rtl;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 2px solid #007bff;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #007bff;
              margin-bottom: 10px;
            }
            .title {
              font-size: 24px;
              color: #333;
              margin-bottom: 20px;
            }
            .otp-container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 25px;
              border-radius: 8px;
              text-align: center;
              margin: 20px 0;
            }
            .otp-code {
              font-size: 36px;
              font-weight: bold;
              letter-spacing: 8px;
              margin: 15px 0;
              padding: 15px;
              background: rgba(255,255,255,0.2);
              border-radius: 5px;
              display: inline-block;
            }
            .otp-label {
              font-size: 16px;
              margin-bottom: 10px;
            }
            .message {
              font-size: 16px;
              margin: 20px 0;
              text-align: center;
            }
            .warning {
              background: #fff3cd;
              color: #856404;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
              border-right: 4px solid #ffc107;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              color: #666;
              font-size: 14px;
            }
            .company-name {
              color: #007bff;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">شركة الشهري للتطوير</div>
              <h1 class="title">${title}</h1>
            </div>
            
            <div class="message">
              مرحباً <strong>${name}</strong>,<br><br>
              ${message}
            </div>
            
            <div class="otp-container">
              <div class="otp-label">رمز التحقق الخاص بك:</div>
              <div class="otp-code">${otpCode}</div>
              <div style="font-size: 14px; margin-top: 10px;">
                صالح لمدة 10 دقائق فقط
              </div>
            </div>
            
            <div class="warning">
              <strong>تنبيه أمني:</strong><br>
              • لا تشارك هذا الرمز مع أي شخص آخر<br>
              • إذا لم تطلب هذا الرمز، يرجى تجاهل هذا الإيميل<br>
              • الرمز صالح لمدة 10 دقائق فقط
            </div>
            
            <div class="footer">
              <p>مع أطيب التحيات،<br>
              <span class="company-name">فريق شركة الشهري للتطوير</span></p>
              <p style="font-size: 12px; color: #999;">
                هذا إيميل تلقائي، يرجى عدم الرد عليه
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (emailResponse.error) {
      console.error('❌ Resend error:', emailResponse.error);
      throw emailResponse.error;
    }

    console.log('✅ OTP email sent successfully:', emailResponse.data);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: emailResponse.data?.id,
      message: 'تم إرسال رمز التحقق بنجاح'
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("❌ Error in send-otp-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'فشل في إرسال رمز التحقق'
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);