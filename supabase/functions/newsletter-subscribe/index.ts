import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

interface NewsletterSubscription {
  email: string;
  name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name }: NewsletterSubscription = await req.json();
    
    console.log("Newsletter subscription request:", { email, name });

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 400,
        }
      );
    }

    // Check if email already exists
    const { data: existingSubscription } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (existingSubscription) {
      return new Response(
        JSON.stringify({ message: "Email already subscribed", success: true }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 200,
        }
      );
    }

    // Insert new subscription
    const { error: insertError } = await supabase
      .from('newsletter_subscriptions')
      .insert({
        email,
        name: name || null,
        is_active: true
      });

    if (insertError) {
      console.error("Error inserting subscription:", insertError);
      throw insertError;
    }

    // Send welcome email
    const emailResponse = await resend.emails.send({
      from: "Ali AlShehri Holding <info@alialshehriholding.com>",
      to: [email],
      bcc: ["info@alialshehriholding.com"],
      reply_to: "info@alialshehriholding.com",
      subject: "مرحباً بك في النشرة الإخبارية - شركة علي صالح الشهري القابضة",
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>مرحباً بك في النشرة الإخبارية</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; direction: rtl;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">مرحباً بك في النشرة الإخبارية</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">شركة علي صالح الشهري القابضة</p>
            </div>

            <!-- Content -->
            <div style="padding: 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; background-color: #10b981; color: white; padding: 15px; border-radius: 50%; margin-bottom: 20px;">
                  <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                ${name ? `<h2 style="color: #1e3a8a; margin: 0; font-size: 24px;">شكراً لك ${name}</h2>` : '<h2 style="color: #1e3a8a; margin: 0; font-size: 24px;">شكراً لك</h2>'}
              </div>

              <div style="background-color: #f0f9ff; border-radius: 8px; padding: 25px; margin-bottom: 25px; border-right: 4px solid #3b82f6;">
                <p style="margin: 0 0 15px 0; color: #1e3a8a; font-size: 18px; font-weight: bold;">تم تسجيلك بنجاح في النشرة الإخبارية</p>
                <p style="margin: 0; color: #475569; line-height: 1.6;">
                  سوف تصلك آخر الأخبار والتحديثات حول خدماتنا ومشاريعنا الجديدة. 
                  نعدك بإرسال محتوى مفيد وذو قيمة فقط.
                </p>
              </div>

              <div style="background-color: #ecfdf5; border-radius: 8px; padding: 20px; margin-bottom: 25px; border-right: 4px solid #10b981;">
                <h3 style="color: #059669; margin: 0 0 15px 0; font-size: 18px;">ماذا ستحصل عليه:</h3>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #475569; line-height: 1.8;">
                  <li>آخر أخبار الشركة والمشاريع الجديدة</li>
                  <li>عروض وخصومات حصرية للمشتركين</li>
                  <li>نصائح ومقالات تقنية مفيدة</li>
                  <li>دعوات لفعاليات ومؤتمرات الشركة</li>
                </ul>
              </div>

              <div style="background-color: #1e3a8a; color: white; padding: 20px; border-radius: 8px; text-align: center;">
                <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">هل لديك أي استفسار؟</p>
                <p style="margin: 0; font-size: 14px;">
                  يمكنك التواصل معنا في أي وقت<br>
                  <strong>البريد الإلكتروني:</strong> info@alialshehriholding.com<br>
                  <strong>الهاتف:</strong> 0555812567
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">
                شركة علي صالح الشهري القابضة<br>
                المملكة العربية السعودية
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Welcome email sent:", emailResponse);

    // Send notification to admin
    await resend.emails.send({
      from: "Ali AlShehri Holding <info@alialshehriholding.com>",
      to: ["info@alialshehriholding.com"],
      subject: `اشتراك جديد في النشرة الإخبارية - ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; padding: 20px;">
          <h2 style="color: #1e3a8a;">اشتراك جديد في النشرة الإخبارية</h2>
          <p><strong>البريد الإلكتروني:</strong> ${email}</p>
          ${name ? `<p><strong>الاسم:</strong> ${name}</p>` : ''}
          <p><strong>تاريخ الاشتراك:</strong> ${new Date().toLocaleString('ar-SA')}</p>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم الاشتراك في النشرة الإخبارية بنجاح",
        emailId: emailResponse.data?.id
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error("Error in newsletter-subscribe function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 500,
      }
    );
  }
};

serve(handler);