import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface ServiceNotificationRequest {
  type: string;
  userId?: string;
  email?: string;
  serviceRequestId?: string;
  ticketId?: string;
  data?: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: ServiceNotificationRequest = await req.json();
    console.log('إشعار الخدمة:', requestData);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (requestData.type === 'login_notification') {
      // إشعار تسجيل الدخول
      const { userId, email } = requestData;
      
      await supabaseClient
        .from('user_activity_logs')
        .insert({
          user_id: userId,
          activity_type: 'login',
          description: 'تم تسجيل الدخول إلى الحساب',
          metadata: {
            timestamp: new Date().toISOString(),
            email: email
          }
        });

      return new Response(JSON.stringify({
        success: true,
        message: "تم تسجيل نشاط تسجيل الدخول"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });

    } else if (requestData.type === 'ticket_created') {
      // إشعار إنشاء تذكرة جديدة
      const { ticketId, data } = requestData;
      
      const emailResponse = await resend.emails.send({
        from: "نظام التذاكر <support@alsalehholding.com>",
        to: ["admin@alsalehholding.com"],
        subject: `تذكرة دعم جديدة: ${data.ticketNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
            <h2>تذكرة دعم جديدة</h2>
            <p><strong>رقم التذكرة:</strong> ${data.ticketNumber}</p>
            <p><strong>العنوان:</strong> ${data.title}</p>
            <p><strong>الفئة:</strong> ${data.category}</p>
            <p><strong>الأولوية:</strong> ${data.priority}</p>
            <p><strong>العميل:</strong> ${data.customerName}</p>
            <p><strong>البريد الإلكتروني:</strong> ${data.customerEmail}</p>
            <p><strong>الوصف:</strong></p>
            <p>${data.description}</p>
            <hr>
            <p>يرجى الرد على هذا البريد للتواصل مباشرة مع العميل.</p>
          </div>
        `,
      });

      if (emailResponse.error) {
        console.error('خطأ في إرسال إشعار التذكرة:', emailResponse.error);
      }

      return new Response(JSON.stringify({
        success: true,
        message: "تم إرسال إشعار التذكرة للإدارة"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });

    } else if (requestData.type === 'ticket_reply') {
      // رد على التذكرة
      const { ticketId, data } = requestData;
      
      const emailResponse = await resend.emails.send({
        from: "نظام التذاكر <support@alsalehholding.com>",
        to: [data.customerEmail],
        subject: `رد جديد على تذكرتك: ${data.ticketNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
            <h2>رد جديد على تذكرتك</h2>
            <p><strong>رقم التذكرة:</strong> ${data.ticketNumber}</p>
            <p><strong>الرد:</strong></p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
              ${data.message}
            </div>
            <p>يمكنك متابعة التذكرة من خلال لوحة التحكم الخاصة بك.</p>
          </div>
        `,
      });

      if (emailResponse.error) {
        console.error('خطأ في إرسال رد التذكرة:', emailResponse.error);
      }

      return new Response(JSON.stringify({
        success: true,
        message: "تم إرسال رد التذكرة للعميل"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: "تم معالجة الطلب بنجاح"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });

  } catch (error: any) {
    console.error("خطأ في إرسال إشعار الخدمة:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
};

serve(handler);