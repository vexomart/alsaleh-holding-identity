import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Testing email system...");
    
    // التحقق من وجود مفتاح Resend
    const apiKey = Deno.env.get("RESEND_API_KEY");
    console.log("RESEND_API_KEY exists:", !!apiKey);
    console.log("RESEND_API_KEY length:", apiKey?.length || 0);
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: "RESEND_API_KEY is not configured",
          status: "failed"
        }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const resend = new Resend(apiKey);
    
    // اختبار إرسال إيميل بسيط
    const emailResponse = await resend.emails.send({
      from: "Test <onboarding@resend.dev>",
      to: ["info@alialshehriholding.com"],
      subject: "Test Email from Verification System",
      html: `
        <h1>نظام التحقق يعمل بشكل صحيح</h1>
        <p>هذه رسالة اختبار للتأكد من أن نظام الإيميل يعمل.</p>
        <p>الوقت: ${new Date().toLocaleString('ar-SA')}</p>
      `,
    });

    console.log("Test email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Email system is working",
        emailResponse
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Email system test failed:", error);
    console.error("Error details:", error.message);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: "failed",
        details: error.toString()
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);