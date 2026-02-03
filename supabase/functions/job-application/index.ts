import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";
import { Resend } from "npm:resend@2.0.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

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
  message?: string;
  cvUrl?: string;
  cvFileName?: string;
  portfolio?: string;
  linkedIn?: string;
  jobNumber?: string;
  hrEmail?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Job application request received");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: JobApplicationData = await req.json();
    console.log("Parsed data:", data);

    // Save to database with retry logic for duplicate key conflicts
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    let insertData;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        const { data: result, error: dbError } = await supabase
          .from('job_applications')
          .insert([
            {
              full_name: data.fullName,
              email: data.email,
              phone: data.phone,
              position: data.position,
              experience: data.experience || null,
              cv_url: data.cvUrl || null,
              cover_letter: data.message || data.coverLetter || null,
              status: 'pending',
              portfolio_url: data.portfolio || null,
              linkedin_url: data.linkedIn || null,
              city: data.city || null,
              education: data.education || null,
              cv_file_name: data.cvFileName || null
            }
          ])
          .select()
          .single();

        if (dbError) {
          if (dbError.code === '23505' && retryCount < maxRetries - 1) {
            // Duplicate key error, wait a bit and retry
            console.log(`Duplicate key error, retrying... (attempt ${retryCount + 1})`);
            await new Promise(resolve => setTimeout(resolve, 100 + (retryCount * 50)));
            retryCount++;
            continue;
          }
          throw new Error(`خطأ في حفظ البيانات: ${dbError.message}`);
        }

        insertData = result;
        break; // Success, exit the retry loop
        
      } catch (error) {
        if (retryCount === maxRetries - 1) {
          console.error("Database error after retries:", error);
          throw error;
        }
        retryCount++;
      }
    }

    console.log("Application saved successfully:", insertData);
    const applicationNumber = insertData.application_number;

    // Generate signed URL for CV if provided
    let cvDownloadUrl = null;
    if (data.cvUrl) {
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('cvs')
        .createSignedUrl(data.cvUrl, 60 * 60 * 24 * 7); // 7 days

      if (signedUrlError) {
        console.error("Signed URL error:", signedUrlError);
      } else {
        cvDownloadUrl = signedUrlData.signedUrl;
      }
    }

    // Professional HR email template
    const hrEmailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background: #ffffff; direction: rtl;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 32px; font-weight: 700;">🎯 طلب توظيف جديد</h1>
          <p style="margin: 15px 0 0; font-size: 18px; opacity: 0.9;">رقم الطلب: ${applicationNumber}</p>
          <div style="background: rgba(255,255,255,0.1); margin: 20px auto 0; padding: 10px 20px; border-radius: 25px; display: inline-block;">
            <p style="margin: 0; font-size: 16px;">📅 تاريخ التقديم: ${new Date().toLocaleDateString('ar-SA')}</p>
          </div>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 40px 30px;">
          <!-- Applicant Info Card -->
          <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
            <h2 style="color: #1e293b; margin: 0 0 25px; font-size: 24px; display: flex; align-items: center;">
              👤 معلومات المتقدم
            </h2>
            
            <div style="display: grid; gap: 15px;">
              <div style="display: flex; justify-content: space-between; padding: 15px; background: white; border-radius: 8px; border-right: 4px solid #2563eb;">
                <span style="font-weight: 600; color: #475569;">الاسم الكامل:</span>
                <span style="color: #1e293b;">${data.fullName}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 15px; background: white; border-radius: 8px; border-right: 4px solid #059669;">
                <span style="font-weight: 600; color: #475569;">البريد الإلكتروني:</span>
                <span style="color: #1e293b;">${data.email}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 15px; background: white; border-radius: 8px; border-right: 4px solid #dc2626;">
                <span style="font-weight: 600; color: #475569;">رقم الهاتف:</span>
                <span style="color: #1e293b;">${data.phone}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 15px; background: white; border-radius: 8px; border-right: 4px solid #7c3aed;">
                <span style="font-weight: 600; color: #475569;">الوظيفة المطلوبة:</span>
                <span style="color: #1e293b; font-weight: 600;">${data.position}</span>
              </div>
              ${data.experience ? `
                <div style="display: flex; justify-content: space-between; padding: 15px; background: white; border-radius: 8px; border-right: 4px solid #ea580c;">
                  <span style="font-weight: 600; color: #475569;">سنوات الخبرة:</span>
                  <span style="color: #1e293b;">${data.experience}</span>
                </div>
              ` : ''}
              ${data.city ? `
                <div style="display: flex; justify-content: space-between; padding: 15px; background: white; border-radius: 8px; border-right: 4px solid #0891b2;">
                  <span style="font-weight: 600; color: #475569;">المدينة:</span>
                  <span style="color: #1e293b;">${data.city}</span>
                </div>
              ` : ''}
              ${data.education ? `
                <div style="display: flex; justify-content: space-between; padding: 15px; background: white; border-radius: 8px; border-right: 4px solid #be123c;">
                  <span style="font-weight: 600; color: #475569;">المؤهل العلمي:</span>
                  <span style="color: #1e293b;">${data.education}</span>
                </div>
              ` : ''}
              ${data.linkedIn ? `
                <div style="display: flex; justify-content: space-between; padding: 15px; background: white; border-radius: 8px; border-right: 4px solid #0a66c2;">
                  <span style="font-weight: 600; color: #475569;">LinkedIn:</span>
                  <a href="${data.linkedIn}" style="color: #0a66c2; text-decoration: none;">${data.linkedIn}</a>
                </div>
              ` : ''}
              ${data.portfolio ? `
                <div style="display: flex; justify-content: space-between; padding: 15px; background: white; border-radius: 8px; border-right: 4px solid #9333ea;">
                  <span style="font-weight: 600; color: #475569;">Portfolio:</span>
                  <a href="${data.portfolio}" style="color: #9333ea; text-decoration: none;">${data.portfolio}</a>
                </div>
              ` : ''}
            </div>
          </div>

          ${data.message || data.coverLetter ? `
            <!-- Cover Letter Card -->
            <div style="background: #fefce8; border: 2px solid #fbbf24; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
              <h3 style="color: #92400e; margin: 0 0 20px; font-size: 20px; display: flex; align-items: center;">
                📝 خطاب التغطية
              </h3>
              <div style="background: white; padding: 20px; border-radius: 8px; border-right: 4px solid #fbbf24;">
                <p style="margin: 0; color: #1f2937; line-height: 1.8; font-size: 16px;">${data.message || data.coverLetter}</p>
              </div>
            </div>
          ` : ''}

          ${cvDownloadUrl ? `
            <!-- CV Download Card -->
            <div style="background: #f0fdf4; border: 2px solid #22c55e; border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 30px;">
              <h3 style="color: #166534; margin: 0 0 20px; font-size: 20px;">📄 السيرة الذاتية</h3>
              <a href="${cvDownloadUrl}" 
                 style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; transition: all 0.3s;">
                📥 تحميل السيرة الذاتية
              </a>
              <p style="margin: 15px 0 0; font-size: 14px; color: #16a34a;">ملف ${data.cvFileName || 'السيرة الذاتية'} - الرابط صالح لمدة 7 أيام</p>
            </div>
          ` : ''}

          <!-- Next Steps Card -->
          <div style="background: #eff6ff; border: 2px solid #3b82f6; border-radius: 12px; padding: 30px;">
            <h3 style="color: #1e40af; margin: 0 0 20px; font-size: 20px; display: flex; align-items: center;">
              ⏰ الخطوات التالية
            </h3>
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <ul style="margin: 0; padding-right: 20px; color: #1f2937; line-height: 1.8;">
                <li style="margin-bottom: 10px;"><strong>المراجعة الأولية:</strong> سيتم مراجعة الطلب خلال 3 أيام عمل</li>
                <li style="margin-bottom: 10px;"><strong>المقابلة التقنية:</strong> في حالة اجتياز المراجعة الأولية</li>
                <li style="margin-bottom: 10px;"><strong>المقابلة الشخصية:</strong> مع فريق الإدارة</li>
                <li><strong>القرار النهائي:</strong> سيتم إبلاغ المتقدم خلال 10 أيام عمل كحد أقصى</li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f1f5f9; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">
            📧 تم إرسال هذا البريد تلقائياً من نظام إدارة الموارد البشرية
          </p>
          <p style="margin: 0; color: #64748b; font-size: 14px;">
            © 2025 شركة علي صالح الشهري القابضة - قسم الموارد البشرية
          </p>
        </div>
      </div>
    `;

    const hrEmail = data.hrEmail || "jobs@ash-holding.sa";
    
    const { error: emailError } = await resend.emails.send({
      from: "نظام التوظيف - ASH HOLDING <info@ash-holding.sa>",
      replyTo: "jobs@ash-holding.sa",
      to: [hrEmail, "jobs@ash-holding.sa"],
      subject: `طلب توظيف جديد - ${data.position} - ${applicationNumber}`,
      html: hrEmailHtml,
    });

    if (emailError) {
      console.error("HR Email error:", emailError);
    } else {
      console.log("HR Email sent successfully");
    }

    // Professional confirmation email to applicant
    const applicantEmailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; direction: rtl;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 700;">🎉 مرحباً ${data.fullName}</h1>
          <p style="margin: 15px 0 0; font-size: 18px; opacity: 0.9;">تم استلام طلب التوظيف بنجاح!</p>
          <div style="background: rgba(255,255,255,0.1); margin: 20px auto 0; padding: 10px 20px; border-radius: 25px; display: inline-block;">
            <p style="margin: 0; font-size: 16px;">📋 رقم الطلب: ${applicationNumber}</p>
          </div>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 40px 30px;">
          <!-- Application Summary -->
          <div style="background: #f0fdf4; border: 2px solid #22c55e; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
            <h2 style="color: #166534; margin: 0 0 20px; font-size: 22px; display: flex; align-items: center;">
              📊 ملخص طلبك
            </h2>
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb;">
                <span style="font-weight: 600; color: #374151;">الوظيفة المطلوبة:</span>
                <span style="color: #166534; font-weight: 600;">${data.position}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb;">
                <span style="font-weight: 600; color: #374151;">رقم الطلب:</span>
                <span style="color: #059669;">${applicationNumber}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: 600; color: #374151;">تاريخ التقديم:</span>
                <span style="color: #374151;">${new Date().toLocaleDateString('ar-SA')}</span>
              </div>
            </div>
          </div>

          <!-- Next Steps -->
          <div style="background: #eff6ff; border: 2px solid #3b82f6; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
            <h3 style="color: #1e40af; margin: 0 0 20px; font-size: 20px; display: flex; align-items: center;">
              🚀 الخطوات التالية
            </h3>
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 15px; background: #f8fafc; border-radius: 8px; border-right: 4px solid #3b82f6;">
                <span style="background: #3b82f6; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-left: 15px; font-size: 12px;">1</span>
                <span style="color: #1f2937;">مراجعة أولية (خلال 3 أيام عمل)</span>
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 15px; background: #f8fafc; border-radius: 8px; border-right: 4px solid #7c3aed;">
                <span style="background: #7c3aed; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-left: 15px; font-size: 12px;">2</span>
                <span style="color: #1f2937;">مقابلة تقنية (هاتفية أو عبر الفيديو)</span>
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 15px; background: #f8fafc; border-radius: 8px; border-right: 4px solid #dc2626;">
                <span style="background: #dc2626; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-left: 15px; font-size: 12px;">3</span>
                <span style="color: #1f2937;">مقابلة شخصية مع فريق الإدارة</span>
              </div>
              <div style="display: flex; align-items: center; padding: 15px; background: #f0fdf4; border-radius: 8px; border-right: 4px solid #22c55e;">
                <span style="background: #22c55e; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-left: 15px; font-size: 12px;">4</span>
                <span style="color: #1f2937;">القرار النهائي (خلال 10 أيام عمل)</span>
              </div>
            </div>
          </div>

          <!-- Important Notice -->
          <div style="background: #fefce8; border: 2px solid #eab308; border-radius: 12px; padding: 25px;">
            <h3 style="color: #a16207; margin: 0 0 15px; font-size: 18px; display: flex; align-items: center;">
              ⚠️ معلومات مهمة
            </h3>
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <ul style="margin: 0; padding-right: 20px; color: #374151; line-height: 1.8;">
                <li style="margin-bottom: 8px;">سيتم التواصل معك عبر البريد الإلكتروني أو الهاتف</li>
                <li style="margin-bottom: 8px;">تأكد من مراجعة صندوق الرسائل غير المرغوب فيها</li>
                <li style="margin-bottom: 8px;">احتفظ برقم الطلب للمراجع المستقبلية</li>
                <li>فريق الموارد البشرية سيتولى جميع مراحل التوظيف</li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f1f5f9; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0 0 10px; color: #64748b; font-size: 16px; font-weight: 600;">
            شكراً لاهتمامك بالعمل معنا! 🤝
          </p>
          <p style="margin: 0; color: #64748b; font-size: 14px;">
            © 2025 شركة علي صالح الشهري القابضة - قسم الموارد البشرية
          </p>
        </div>
      </div>
    `;

    const { error: confirmationEmailError } = await resend.emails.send({
      from: "قسم التوظيف - ASH HOLDING <info@ash-holding.sa>",
      replyTo: "jobs@ash-holding.sa",
      to: [data.email],
      subject: `تأكيد استلام طلب التوظيف - ${applicationNumber}`,
      html: applicantEmailHtml,
    });

    if (confirmationEmailError) {
      console.error("Confirmation email error:", confirmationEmailError);
    } else {
      console.log("Confirmation email sent successfully");
    }

    console.log("Job application processed successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال طلب التوظيف بنجاح",
        jobNumber: applicationNumber
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
    console.error("Error in job application function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "حدث خطأ في معالجة الطلب" 
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