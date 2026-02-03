import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TestEmailRequest {
  to?: string;
  subject?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, message }: TestEmailRequest = await req.json().catch(() => ({}));

    const recipient = to || "info@alialshehriholding.com";
    const nowRiyadh = new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' });

    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>اختبار توثيق البريد</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Arial, sans-serif; 
            background-color: #f8fafc; 
            direction: rtl; 
            text-align: right;
            line-height: 1.6;
            padding: 20px;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 15px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
            overflow: hidden;
          }
          .header { 
            background: linear-gradient(135deg, #1e40af, #3b82f6); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
          }
          .content { 
            padding: 40px 30px; 
          }
          .message-box { 
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe); 
            padding: 25px; 
            border-radius: 12px; 
            border-right: 4px solid #0ea5e9; 
            margin: 20px 0; 
          }
          .footer { 
            background: #1f2937; 
            color: white; 
            text-align: center; 
            padding: 25px; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="font-size: 50px; margin-bottom: 15px;">📧</div>
            <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 10px;">اختبار توثيق البريد الإلكتروني</h1>
            <p style="opacity: 0.9;">شركة علي صالح الشهري القابضة</p>
          </div>
          
          <div class="content">
            <div style="text-align: center; margin-bottom: 30px;">
              <span style="background: #059669; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: bold;">✅ نجح الاختبار</span>
            </div>
            
            <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border-right: 4px solid #059669; margin: 20px 0; direction: rtl; text-align: right;">
              <h3 style="color: #059669; margin-bottom: 15px; text-align: right;">📋 تفاصيل الاختبار</h3>
              <div style="display: flex; justify-content: space-between; margin: 10px 0; direction: rtl;">
                <span style="font-weight: bold;">النطاق:</span>
                <span style="direction: ltr;">alialshehriholding.com</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 10px 0; direction: rtl;">
                <span style="font-weight: bold;">المستلم:</span>
                <span style="direction: ltr;">${recipient}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 10px 0; direction: rtl;">
                <span style="font-weight: bold;">التوقيت:</span>
                <span>${nowRiyadh}</span>
              </div>
            </div>
            
            ${message ? `
            <div class="message-box">
              <h3 style="color: #0284c7; margin-bottom: 15px;">📝 الرسالة المخصصة:</h3>
              <p style="color: #334155; font-size: 16px;">${message}</p>
            </div>
            ` : ''}
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 10px; border-right: 4px solid #f59e0b; text-align: center;">
              <p style="color: #92400e; margin: 0;">
                🎉 <strong>تم التوثيق بنجاح!</strong> النظام جاهز لإرسال الإيميلات
              </p>
            </div>
          </div>
          
          <div class="footer">
            <p style="margin: 0;">نظام إدارة المراسلات - شركة علي صالح الشهري القابضة</p>
            <p style="font-size: 14px; opacity: 0.8; margin-top: 10px;">تم إرسال هذا الإيميل تلقائياً من النظام</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const sendResult = await resend.emails.send({
      from: "ASH Holding <info@ash-holding.sa>",
      to: [recipient],
      bcc: ["info@ash-holding.sa"],
      subject: subject || "✅ اختبار التوثيق - ASH Holding",
      html,
    });

    console.log("email-test: sent", sendResult);

    return new Response(JSON.stringify({ success: true, to: recipient, id: sendResult.data?.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("email-test: error", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
