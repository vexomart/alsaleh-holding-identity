import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsletterSubscription {
  email: string;
  name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Initialize Resend
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    const subscriptionData: NewsletterSubscription = await req.json();

    console.log("Received newsletter subscription:", subscriptionData);

    // Validate email
    if (!subscriptionData.email || !subscriptionData.email.includes('@')) {
      throw new Error("بريد إلكتروني غير صحيح");
    }

    // Check if email already exists
    const { data: existingSubscription, error: checkError } = await supabaseClient
      .from("newsletter_subscriptions")
      .select("id, is_active")
      .eq("email", subscriptionData.email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw new Error(`Database check error: ${checkError.message}`);
    }

    if (existingSubscription) {
      if (existingSubscription.is_active) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "هذا البريد الإلكتروني مشترك بالفعل في النشرة الإخبارية",
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      } else {
        // Reactivate subscription
        const { error: updateError } = await supabaseClient
          .from("newsletter_subscriptions")
          .update({ 
            is_active: true, 
            subscribed_at: new Date().toISOString(),
            unsubscribed_at: null,
            name: subscriptionData.name || null
          })
          .eq("id", existingSubscription.id);

        if (updateError) {
          throw new Error(`Database update error: ${updateError.message}`);
        }
      }
    } else {
      // Create new subscription
      const { error: insertError } = await supabaseClient
        .from("newsletter_subscriptions")
        .insert({
          email: subscriptionData.email,
          name: subscriptionData.name || null,
        });

      if (insertError) {
        throw new Error(`Database insert error: ${insertError.message}`);
      }
    }

    console.log("Newsletter subscription saved successfully");

    // Send welcome email to subscriber
    const welcomeEmailResponse = await resend.emails.send({
      from: "شركة علي صالح الشهري القابضة <onboarding@resend.dev>",
      to: [subscriptionData.email],
      subject: "مرحباً بك في النشرة الإخبارية",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #2563eb; text-align: center; margin-bottom: 30px;">مرحباً بك معنا!</h1>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
                ${subscriptionData.name ? `عزيزي/عزيزتي ${subscriptionData.name}،` : 'عزيزي المشترك،'}
              </p>
              <p style="font-size: 16px; line-height: 1.6;">
                شكراً لك على الاشتراك في النشرة الإخبارية لشركة علي صالح الشهري القابضة.
              </p>
              <p style="font-size: 16px; line-height: 1.6;">
                ستصلك أحدث الأخبار والتطورات في عالم التقنية والاستثمار.
              </p>
            </div>

            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #1e40af; margin-bottom: 15px;">ماذا ستحصل عليه؟</h2>
              <ul style="color: #6b7280; line-height: 1.8;">
                <li>أحدث أخبار الشركة ومشاريعها</li>
                <li>نصائح وأفكار في مجال الاستثمار التقني</li>
                <li>دعوات حصرية للفعاليات والمؤتمرات</li>
                <li>تحديثات عن الشركات التابعة والاستثمارات الجديدة</li>
              </ul>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #6b7280; font-size: 14px;">
                يمكنك إلغاء الاشتراك في أي وقت من خلال الرابط في أسفل أي رسالة إخبارية
              </p>
              <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">
                للتواصل: info@ash.holdings
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px;">
                شركة علي صالح الشهري القابضة - شريكك في التحول الرقمي
              </p>
            </div>
          </div>
        </div>
      `,
    });

    if (welcomeEmailResponse.error) {
      console.error("Welcome email error:", welcomeEmailResponse.error);
    } else {
      console.log("Welcome email sent successfully:", welcomeEmailResponse);
    }

    // Send notification to company
    const notificationEmailResponse = await resend.emails.send({
      from: "النشرة الإخبارية <onboarding@resend.dev>",
      to: ["info@ash.holdings"],
      subject: "اشتراك جديد في النشرة الإخبارية",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #2563eb;">اشتراك جديد في النشرة الإخبارية</h1>
          <p><strong>البريد الإلكتروني:</strong> ${subscriptionData.email}</p>
          ${subscriptionData.name ? `<p><strong>الاسم:</strong> ${subscriptionData.name}</p>` : ''}
          <p><strong>تاريخ الاشتراك:</strong> ${new Date().toLocaleString('ar-SA')}</p>
        </div>
      `,
    });

    if (notificationEmailResponse.error) {
      console.error("Notification email error:", notificationEmailResponse.error);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "تم الاشتراك بنجاح! ستصلك رسالة تأكيد على بريدك الإلكتروني",
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
    console.error("Error in newsletter-subscribe function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "حدث خطأ أثناء الاشتراك",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);