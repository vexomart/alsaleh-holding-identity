import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
  cvUrl?: string;
  cvFileName?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const applicationData: JobApplicationData = await req.json();
    
    console.log("Received job application:", { ...applicationData, cvUrl: applicationData.cvUrl ? 'FILE_UPLOADED' : 'NO_FILE' });

    // Save to database first
    const { data: insertData, error: dbError } = await supabase
      .from('job_applications')
      .insert({
        full_name: applicationData.fullName,
        email: applicationData.email,
        phone: applicationData.phone,
        city: applicationData.city,
        position: applicationData.position,
        experience: applicationData.experience,
        education: applicationData.education,
        cover_letter: applicationData.coverLetter || applicationData.message,
        cv_file_name: applicationData.cvFileName
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error(`خطأ في حفظ البيانات: ${dbError.message}`);
    }

    console.log("Application saved to database:", insertData);

    // Generate CV download URL if file exists
    let cvDownloadLink = '';
    if (applicationData.cvUrl) {
      const { data: signedUrlData } = await supabase.storage
        .from('cvs')
        .createSignedUrl(applicationData.cvUrl, 7 * 24 * 60 * 60); // Valid for 7 days
      
      cvDownloadLink = signedUrlData?.signedUrl || '';
      console.log("CV download URL created:", cvDownloadLink ? 'SUCCESS' : 'FAILED');
    }

    // Send email to company
    const companyEmailResponse = await resend.emails.send({
      from: "Ali AlShehri Holding <info@alialshehriholding.com>",
      to: ["info@alialshehriholding.com"],
      bcc: ["info@alialshehriholding.com"],
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="margin: 0; text-align: center;">طلب توظيف جديد</h1>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">تفاصيل المتقدم:</h2>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #667eea;">الاسم الكامل:</strong>
              <span style="margin-right: 10px;">${applicationData.fullName}</span>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #667eea;">البريد الإلكتروني:</strong>
              <span style="margin-right: 10px;">${applicationData.email}</span>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #667eea;">رقم الهاتف:</strong>
              <span style="margin-right: 10px;">${applicationData.phone}</span>
            </div>
            
            ${applicationData.city ? `
            <div style="margin-bottom: 15px;">
              <strong style="color: #667eea;">المدينة:</strong>
              <span style="margin-right: 10px;">${applicationData.city}</span>
            </div>
            ` : ''}
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #667eea;">المنصب المطلوب:</strong>
              <span style="margin-right: 10px;">${applicationData.position}</span>
            </div>
            
            ${applicationData.experience ? `
            <div style="margin-bottom: 15px;">
              <strong style="color: #667eea;">سنوات الخبرة:</strong>
              <span style="margin-right: 10px;">${applicationData.experience}</span>
            </div>
            ` : ''}
            
            ${applicationData.education ? `
            <div style="margin-bottom: 15px;">
              <strong style="color: #667eea;">المؤهل التعليمي:</strong>
              <span style="margin-right: 10px;">${applicationData.education}</span>
            </div>
            ` : ''}
            
            ${cvDownloadLink ? `
            <div style="margin-bottom: 15px;">
              <strong style="color: #667eea;">السيرة الذاتية:</strong>
              <div style="margin-top: 10px;">
                <a href="${cvDownloadLink}" 
                   style="display: inline-block; background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  📎 تحميل السيرة الذاتية (${applicationData.cvFileName})
                </a>
              </div>
            </div>
            ` : '<div style="margin-bottom: 15px; color: #999;">لم يتم رفع سيرة ذاتية</div>'}
            
            ${(applicationData.coverLetter || applicationData.message) ? `
            <div style="margin-bottom: 15px;">
              <strong style="color: #667eea;">الرسالة التعريفية:</strong>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px; border-right: 4px solid #667eea;">
                ${applicationData.coverLetter || applicationData.message}
              </div>
            </div>
            ` : ''}
            
            <div style="margin-top: 20px; padding: 15px; background: #e8f4fd; border-radius: 5px; border-right: 4px solid #667eea;">
              <strong>تاريخ التقديم:</strong> ${new Date().toLocaleDateString('ar-SA')} ${new Date().toLocaleTimeString('ar-SA')}
            </div>
          </div>
          
          <div style="margin-top: 20px; text-align: center; color: #666; font-size: 14px;">
            تم إرسال هذا الإيميل تلقائياً من نظام طلبات التوظيف
          </div>
        </div>
      `,
    });

    console.log("Company email sent:", companyEmailResponse);

    // Send confirmation email to applicant
    const applicantEmailResponse = await resend.emails.send({
      from: "Ali AlShehri Holding <info@alialshehriholding.com>",
      to: [applicationData.email],
      bcc: ["info@alialshehriholding.com"],
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="margin: 0; text-align: center;">شكراً لتقديمك</h1>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              عزيزي/ة <strong>${applicationData.fullName}</strong>,
            </p>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              شكراً لك على تقديم طلب التوظيف لمنصب <strong>${applicationData.position}</strong> في شركة علي صالح الشهري القابضة.
            </p>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              تم استلام طلبك بنجاح ${applicationData.cvUrl ? 'مع السيرة الذاتية المرفقة' : ''} وسيقوم فريق الموارد البشرية بمراجعته خلال 3-5 أيام عمل. سنتواصل معك في حال وجود فرصة مناسبة.
            </p>
            
            <div style="background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0; border-right: 4px solid #667eea;">
              <h3 style="color: #667eea; margin-top: 0;">ملخص طلبك:</h3>
              <p style="margin: 5px 0;"><strong>المنصب:</strong> ${applicationData.position}</p>
              <p style="margin: 5px 0;"><strong>الخبرة:</strong> ${applicationData.experience || 'غير محدد'}</p>
              ${applicationData.education ? `<p style="margin: 5px 0;"><strong>التعليم:</strong> ${applicationData.education}</p>` : ''}
              <p style="margin: 5px 0;"><strong>السيرة الذاتية:</strong> ${applicationData.cvUrl ? '✅ تم الرفع' : '❌ لم يتم الرفع'}</p>
              <p style="margin: 5px 0;"><strong>تاريخ التقديم:</strong> ${new Date().toLocaleDateString('ar-SA')}</p>
            </div>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              مع أطيب التحيات،<br>
              <strong>فريق الموارد البشرية</strong><br>
              شركة علي صالح الشهري القابضة
            </p>
          </div>
          
            <div style="margin-top: 20px; text-align: center;">
              <p style="color: #666; font-size: 14px;">
                للتواصل معنا: info@alialshehriholding.com | 0555812567
              </p>
            </div>
        </div>
      `,
    });

    console.log("Applicant email sent:", applicantEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال طلب التوظيف بنجاح" 
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
    console.error("Error in job-application function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "حدث خطأ أثناء معالجة طلب التوظيف" 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);