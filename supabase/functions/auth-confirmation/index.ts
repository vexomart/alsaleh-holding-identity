import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuthEvent {
  user: {
    id: string;
    email: string;
    email_confirmed_at?: string;
  };
  email_data?: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  console.log('🔄 Auth confirmation function called');
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authEvent: AuthEvent = await req.json();
    console.log('📧 Processing auth event:', authEvent);

    const { user, email_data } = authEvent;

    if (!user.email) {
      console.warn('⚠️ No email provided in auth event');
      return new Response(JSON.stringify({ error: "No email provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Create confirmation link
    const confirmationUrl = email_data 
      ? `${email_data.site_url}/auth/callback?token_hash=${email_data.token_hash}&type=${email_data.email_action_type}&redirect_to=${encodeURIComponent(email_data.redirect_to)}`
      : `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token_hash=${email_data?.token_hash}&type=signup&redirect_to=${encodeURIComponent('https://ibfcgweykqkzdodrfmci.supabase.co')}`;

    const emailHTML = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تأكيد الحساب - شركة الصالح القابضة</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; direction: rtl;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">
              مرحباً بك في شركة الصالح القابضة
            </h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">
              نحتاج إلى تأكيد عنوان بريدك الإلكتروني
            </p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1a202c; margin: 0 0 20px 0; font-size: 24px;">
              أهلاً وسهلاً!
            </h2>
            
            <p style="color: #4a5568; line-height: 1.6; font-size: 16px; margin-bottom: 25px;">
              شكراً لك على انضمامك إلى منصة شركة الصالح القابضة. لإكمال إنشاء حسابك، يرجى تأكيد عنوان بريدك الإلكتروني بالنقر على الزر أدناه.
            </p>

            <!-- Confirmation Button -->
            <div style="text-align: center; margin: 35px 0;">
              <a href="${confirmationUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 40px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        display: inline-block; 
                        font-weight: 600; 
                        font-size: 16px;
                        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                        transition: all 0.3s ease;">
                تأكيد البريد الإلكتروني
              </a>
            </div>

            <!-- Alternative Link -->
            <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="color: #4a5568; font-size: 14px; margin: 0 0 10px 0;">
                أو يمكنك نسخ الرابط التالي ولصقه في متصفحك:
              </p>
              <p style="word-break: break-all; color: #667eea; font-size: 13px; margin: 0; direction: ltr; text-align: left;">
                ${confirmationUrl}
              </p>
            </div>

            <!-- Features Box -->
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 25px; border-radius: 12px; margin: 30px 0;">
              <h3 style="color: white; margin: 0 0 15px 0; font-size: 18px;">
                ما يمكنك فعله بعد التأكيد:
              </h3>
              <ul style="color: white; margin: 0; padding: 0; list-style: none;">
                <li style="margin: 8px 0; padding-right: 20px; position: relative;">
                  <span style="position: absolute; right: 0; top: 2px;">✓</span>
                  الوصول إلى جميع خدماتنا المتطورة
                </li>
                <li style="margin: 8px 0; padding-right: 20px; position: relative;">
                  <span style="position: absolute; right: 0; top: 2px;">✓</span>
                  طلب عروض أسعار مخصصة
                </li>
                <li style="margin: 8px 0; padding-right: 20px; position: relative;">
                  <span style="position: absolute; right: 0; top: 2px;">✓</span>
                  متابعة حالة مشاريعك
                </li>
                <li style="margin: 8px 0; padding-right: 20px; position: relative;">
                  <span style="position: absolute; right: 0; top: 2px;">✓</span>
                  التواصل المباشر مع فريق الدعم
                </li>
              </ul>
            </div>

            <!-- Security Note -->
            <div style="border-right: 4px solid #fed7d7; background-color: #fef5e7; padding: 15px; border-radius: 4px; margin: 25px 0;">
              <p style="color: #744210; font-size: 14px; margin: 0;">
                <strong>ملاحظة أمنية:</strong> إذا لم تقم بإنشاء هذا الحساب، يرجى تجاهل هذا البريد الإلكتروني.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #2d3748; padding: 25px 30px; text-align: center;">
            <p style="color: #a0aec0; margin: 0; font-size: 14px;">
              شركة الصالح القابضة © 2024
            </p>
            <p style="color: #718096; margin: 10px 0 0 0; font-size: 12px;">
              هذا البريد الإلكتروني أُرسل إلى ${user.email}
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send confirmation email
    const emailResponse = await resend.emails.send({
      from: "Ali AlShehri Holding <info@alialshehriholding.com>",
      to: [user.email],
      subject: "تأكيد حسابك - شركة الصالح القابضة",
      html: emailHTML,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'X-Email-Type': 'auth_confirmation',
      },
    });

    console.log("✅ Confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Confirmation email sent",
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("❌ Error sending confirmation email:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Failed to send confirmation email" 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
};

serve(handler);