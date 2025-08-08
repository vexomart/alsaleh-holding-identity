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
      </head>
      <body style="font-family: Arial, sans-serif; background:#f8f9fa; padding:24px;">
        <div style="max-width:640px; margin:0 auto; background:#fff; border-radius:12px; overflow:hidden;">
          <div style="background:linear-gradient(135deg,#667eea,#764ba2); color:#fff; padding:24px; text-align:center;">
            <h1 style="margin:0; font-size:22px;">اختبار توثيق البريد (Resend)</h1>
          </div>
          <div style="padding:24px; color:#334155;">
            <p>هذا بريد تجريبي للتأكد من نجاح التوثيق لنطاق: <strong>alialshehriholding.com</strong></p>
            <p><strong>التاريخ/الوقت (الرياض):</strong> ${nowRiyadh}</p>
            ${message ? `<div style="margin-top:12px; padding:12px; background:#f8f9ff; border-right:4px solid #667eea;">${message}</div>` : ''}
          </div>
          <div style="background:#111827; color:#fff; text-align:center; padding:16px;">
            <small>شركة علي صالح الشهري القابضة</small>
          </div>
        </div>
      </body>
      </html>
    `;

    const sendResult = await resend.emails.send({
      from: "Ali AlShehri Holding <info@alialshehriholding.com>",
      to: [recipient],
      bcc: ["info@alialshehriholding.com"],
      subject: subject || "اختبار التوثيق - Resend",
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
