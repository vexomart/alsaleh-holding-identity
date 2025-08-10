import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ServiceNotificationRequest {
  serviceRequestId: string;
  customerEmail: string;
  customerName: string;
  serviceType: string;
  title: string;
  description: string;
  amount?: number;
  currency?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: ServiceNotificationRequest = await req.json();

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // إرسال إشعار للعميل بتأكيد استلام الطلب
    const emailResponse = await supabaseClient.functions.invoke('auth-emails', {
      body: {
        to: requestData.customerEmail,
        subject: "تأكيد استلام طلب الخدمة - شركة الصالح القابضة",
        type: "service_request_notification",
        data: {
          customerName: requestData.customerName,
          serviceType: requestData.serviceType,
          title: requestData.title,
          description: requestData.description,
          amount: requestData.amount,
          currency: requestData.currency || 'ريال سعودي',
          requestId: requestData.serviceRequestId
        }
      }
    });

    if (emailResponse.error) {
      console.error('خطأ في إرسال إشعار الخدمة:', emailResponse.error);
      throw new Error('فشل في إرسال إشعار الخدمة');
    }

    // تسجيل الإشعار في سجل النشاط
    const { error: activityError } = await supabaseClient
      .from('user_activity_logs')
      .insert({
        user_id: (await supabaseClient.auth.getUserByEmail(requestData.customerEmail)).data.user?.id,
        activity_type: 'service_request_notification',
        description: `تم إرسال إشعار تأكيد طلب الخدمة: ${requestData.title}`,
        metadata: {
          service_request_id: requestData.serviceRequestId,
          email_sent: true,
          notification_type: 'service_request_confirmation'
        }
      });

    if (activityError) {
      console.error('خطأ في تسجيل النشاط:', activityError);
    }

    return new Response(JSON.stringify({
      success: true,
      message: "تم إرسال إشعار تأكيد الطلب بنجاح"
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