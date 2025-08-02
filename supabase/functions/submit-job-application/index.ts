import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface JobApplicationData {
  fullName: string;
  email: string;
  phone: string;
  city?: string;
  position: string;
  experience?: string;
  education?: string;
  coverLetter?: string;
  cvFileName?: string;
  cvFileSize?: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key for database operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Initialize Resend
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    const jobData: JobApplicationData = await req.json();

    console.log("Received job application:", jobData);

    // Save to database
    const { data: savedApplication, error: dbError } = await supabaseClient
      .from("job_applications")
      .insert({
        full_name: jobData.fullName,
        email: jobData.email,
        phone: jobData.phone,
        city: jobData.city,
        position: jobData.position,
        experience: jobData.experience,
        education: jobData.education,
        cover_letter: jobData.coverLetter,
        cv_file_name: jobData.cvFileName,
        cv_file_size: jobData.cvFileSize,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    console.log("Application saved to database:", savedApplication);

    // Send email notification to company
    const companyEmailResponse = await resend.emails.send({
      from: "وظائف فكرة للتقنية <onboarding@resend.dev>",
      to: ["info@fekrahtech.com"],
      subject: `طلب توظيف جديد - ${jobData.position}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #2563eb; text-align: center; margin-bottom: 30px;">طلب توظيف جديد</h1>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #1e40af; margin-bottom: 15px;">المعلومات الشخصية</h2>
              <p><strong>الاسم الكامل:</strong> ${jobData.fullName}</p>
              <p><strong>البريد الإلكتروني:</strong> ${jobData.email}</p>
              <p><strong>رقم الجوال:</strong> ${jobData.phone}</p>
              ${jobData.city ? `<p><strong>المدينة:</strong> ${jobData.city}</p>` : ''}
            </div>

            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #1e40af; margin-bottom: 15px;">معلومات الوظيفة</h2>
              <p><strong>الوظيفة المرغوبة:</strong> ${jobData.position}</p>
              ${jobData.experience ? `<p><strong>سنوات الخبرة:</strong> ${jobData.experience}</p>` : ''}
              ${jobData.education ? `<p><strong>المؤهل العلمي:</strong> ${jobData.education}</p>` : ''}
            </div>

            ${jobData.coverLetter ? `
            <div style="background-color: #fefce8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #1e40af; margin-bottom: 15px;">الرسالة التعريفية</h2>
              <p style="line-height: 1.6;">${jobData.coverLetter}</p>
            </div>
            ` : ''}

            ${jobData.cvFileName ? `
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px;">
              <h2 style="color: #1e40af; margin-bottom: 15px;">السيرة الذاتية</h2>
              <p><strong>اسم الملف:</strong> ${jobData.cvFileName}</p>
              ${jobData.cvFileSize ? `<p><strong>حجم الملف:</strong> ${(jobData.cvFileSize / 1024 / 1024).toFixed(2)} MB</p>` : ''}
            </div>
            ` : ''}

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">تم إرسال هذا الطلب من موقع فكرة للتقنية</p>
              <p style="color: #6b7280; font-size: 12px;">تاريخ الإرسال: ${new Date().toLocaleString('ar-SA')}</p>
            </div>
          </div>
        </div>
      `,
    });

    if (companyEmailResponse.error) {
      console.error("Company email error:", companyEmailResponse.error);
    } else {
      console.log("Company email sent successfully:", companyEmailResponse);
    }

    // Send confirmation email to applicant
    const applicantEmailResponse = await resend.emails.send({
      from: "فكرة للتقنية <onboarding@resend.dev>",
      to: [jobData.email],
      subject: "تم استلام طلب التوظيف بنجاح",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #2563eb; text-align: center; margin-bottom: 30px;">شكراً لك ${jobData.fullName}</h1>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
                تم استلام طلب التوظيف الخاص بك بنجاح للوظيفة: <strong>${jobData.position}</strong>
              </p>
              <p style="font-size: 16px; line-height: 1.6;">
                سيقوم فريقنا بمراجعة طلبك والتواصل معك خلال 3-5 أيام عمل.
              </p>
            </div>

            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #1e40af; margin-bottom: 15px;">ملخص طلبك</h2>
              <p><strong>الوظيفة:</strong> ${jobData.position}</p>
              <p><strong>البريد الإلكتروني:</strong> ${jobData.email}</p>
              <p><strong>رقم الجوال:</strong> ${jobData.phone}</p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #6b7280; font-size: 14px;">
                إذا كان لديك أي استفسار، يمكنك التواصل معنا على: info@fekrahtech.com
              </p>
              <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">
                أو زيارة موقعنا الإلكتروني: fekrahtech.com
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px;">
                فكرة للتقنية - شريكك في التحول الرقمي
              </p>
            </div>
          </div>
        </div>
      `,
    });

    if (applicantEmailResponse.error) {
      console.error("Applicant email error:", applicantEmailResponse.error);
    } else {
      console.log("Applicant email sent successfully:", applicantEmailResponse);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "تم إرسال طلب التوظيف بنجاح",
        applicationId: savedApplication.id,
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
    console.error("Error in submit-job-application function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "حدث خطأ أثناء إرسال الطلب",
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