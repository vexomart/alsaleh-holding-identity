import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { supabase } from "../_shared/supabase.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface UpdateNotificationRequest {
  updateId: string;
  targetAudience: 'all' | 'specific_client';
  targetClientId?: string;
  title: string;
  content: string;
  priority: string;
  updateType: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { updateId, targetAudience, targetClientId, title, content, priority, updateType }: UpdateNotificationRequest = await req.json();

    let recipients: string[] = [];

    if (targetAudience === 'all') {
      // Get all user emails from profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('email')
        .not('email', 'is', null);
      
      recipients = profiles?.map(p => p.email).filter(Boolean) || [];
    } else if (targetAudience === 'specific_client' && targetClientId) {
      // Get specific user email
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', targetClientId)
        .single();
      
      if (profile?.email) {
        recipients = [profile.email];
      }
    }

    const priorityLabels = {
      low: 'منخفض',
      medium: 'متوسط',
      high: 'عالي',
      urgent: 'عاجل'
    };

    const typeLabels = {
      general: 'عام',
      urgent: 'عاجل',
      maintenance: 'صيانة',
      feature: 'ميزة جديدة'
    };

    // Send emails to recipients
    const emailPromises = recipients.map(email => 
      resend.emails.send({
        from: "تساهيل للحلول التقنية <noreply@tasaheel.sa>",
        to: [email],
        subject: `${priorityLabels[priority as keyof typeof priorityLabels]} - ${title}`,
        html: `
          <div style="direction: rtl; text-align: right; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">تساهيل للحلول التقنية</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">تحديث جديد من فريقنا</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px; padding: 15px; background-color: ${priority === 'urgent' ? '#fee2e2' : priority === 'high' ? '#fef3c7' : '#f0f9ff'}; border-radius: 8px; border-right: 4px solid ${priority === 'urgent' ? '#dc2626' : priority === 'high' ? '#f59e0b' : '#0ea5e9'};">
                <span style="font-weight: bold; color: ${priority === 'urgent' ? '#dc2626' : priority === 'high' ? '#f59e0b' : '#0ea5e9'};">
                  النوع: ${typeLabels[updateType as keyof typeof typeLabels]} | الأولوية: ${priorityLabels[priority as keyof typeof priorityLabels]}
                </span>
              </div>
              
              <h2 style="color: #1f2937; font-size: 24px; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                ${title}
              </h2>
              
              <div style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                ${content.replace(/\n/g, '<br>')}
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://tasaheel.sa/client/updates" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  عرض جميع التحديثات
                </a>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; text-align: center;">
                <p>شكراً لاختيارك تساهيل للحلول التقنية</p>
                <p>فريق تساهيل | <a href="mailto:info@tasaheel.sa" style="color: #667eea;">info@tasaheel.sa</a></p>
              </div>
            </div>
          </div>
        `,
      })
    );

    await Promise.all(emailPromises);

    // Mark update as email sent
    await supabase
      .from('updates')
      .update({ email_sent: true })
      .eq('id', updateId);

    console.log(`Update notification sent to ${recipients.length} recipients`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `تم إرسال التحديث إلى ${recipients.length} مستخدم`,
        recipients: recipients.length 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending update notifications:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);