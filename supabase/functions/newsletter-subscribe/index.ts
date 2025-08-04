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
      from: "شركة علي صالح الشهري القابضة <newsletter@alialshehriholding.com>",
      to: [subscriptionData.email],
      subject: "مرحباً بك في النشرة الإخبارية",
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>مرحباً بك في النشرة الإخبارية</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 20px;
                    direction: rtl;
                    text-align: right;
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
                    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }
                .content {
                    padding: 30px;
                }
                .welcome-box {
                    background-color: #f0f9ff;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    border-right: 4px solid #2563eb;
                }
                .benefits-box {
                    background-color: #f8fafc;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    border-right: 4px solid #1e40af;
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
                    <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🎉 مرحباً بك معنا!</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">شكراً لاشتراكك في النشرة الإخبارية</p>
                </div>
                
                <div class="content">
                    <div class="welcome-box">
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
                            ${subscriptionData.name ? `عزيزي/عزيزتي ${subscriptionData.name}،` : 'عزيزي المشترك،'}
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; margin: 0;">
                            شكراً لك على الاشتراك في النشرة الإخبارية لشركة علي صالح الشهري القابضة.
                            ستصلك أحدث الأخبار والتطورات في عالم التقنية والاستثمار.
                        </p>
                    </div>

                    <div class="benefits-box">
                        <h2 style="color: #1e40af; margin: 0 0 15px 0;">ماذا ستحصل عليه؟</h2>
                        <ul style="color: #6b7280; line-height: 1.8; margin: 0; padding-right: 20px;">
                            <li>أحدث أخبار الشركة ومشاريعها</li>
                            <li>نصائح وأفكار في مجال الاستثمار التقني</li>
                            <li>دعوات حصرية للفعاليات والمؤتمرات</li>
                            <li>تحديثات عن الشركات التابعة والاستثمارات الجديدة</li>
                        </ul>
                    </div>

                    <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 8px;">
                        <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                            يمكنك إلغاء الاشتراك في أي وقت من خلال الرابط في أسفل أي رسالة إخبارية
                        </p>
                        <p style="color: #6b7280; font-size: 14px; margin: 0;">
                            للتواصل: info@alialshehriholding.com
                        </p>
                    </div>
                </div>
                
                <div class="footer">
                    <p style="margin: 0; font-size: 12px;">
                        شركة علي صالح الشهري القابضة - شريكك في التحول الرقمي
                    </p>
                </div>
            </div>
        </body>
        </html>
      `,
    });

    if (welcomeEmailResponse.error) {
      console.error("Welcome email error:", welcomeEmailResponse.error);
    } else {
      console.log("Welcome email sent successfully:", welcomeEmailResponse);
    }

    // Send notification to company
    const notificationEmailResponse = await resend.emails.send({
      from: "النشرة الإخبارية <newsletter@alialshehriholding.com>",
      to: ["info@alialshehriholding.com"],
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