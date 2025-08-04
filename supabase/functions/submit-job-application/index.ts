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

    // Generate application number starting from 3885
    const applicationNumber = 3885 + Math.floor(Math.random() * 9000);

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
      from: "وظائف فكرة للتقنية <careers@alialshehriholding.com>",
      to: ["info@alialshehriholding.com"],
      subject: `طلب توظيف جديد - رقم ${applicationNumber}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>طلب توظيف جديد</title>
          <style>
            * { box-sizing: border-box; }
            body { 
              margin: 0; 
              padding: 0; 
              font-family: 'Segoe UI', Tahoma, Arial, sans-serif; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              direction: rtl;
            }
            .container { 
              max-width: 600px; 
              margin: 20px auto; 
              background: white; 
              border-radius: 16px; 
              overflow: hidden;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 40px 30px; 
              text-align: center;
            }
            .header h1 { 
              margin: 0; 
              font-size: 28px; 
              font-weight: bold;
            }
            .app-number {
              background: rgba(255,255,255,0.2);
              padding: 8px 16px;
              border-radius: 20px;
              display: inline-block;
              margin-top: 10px;
              font-size: 14px;
            }
            .content { 
              padding: 30px; 
            }
            .section { 
              margin-bottom: 25px; 
              padding: 20px; 
              border-radius: 12px; 
              border-right: 4px solid #667eea;
            }
            .personal-info { background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); }
            .job-info { background: linear-gradient(135deg, #fef7e7 0%, #fde68a 100%); }
            .cover-letter { background: linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%); }
            .cv-info { background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); }
            .section h2 { 
              color: #1e40af; 
              margin: 0 0 15px 0; 
              font-size: 18px;
              display: flex;
              align-items: center;
            }
            .section h2::before {
              content: "🔹";
              margin-left: 8px;
            }
            .section p { 
              margin: 8px 0; 
              line-height: 1.6; 
              color: #374151;
            }
            .section strong { 
              color: #1f2937; 
            }
            .footer { 
              background: #f9fafb; 
              padding: 20px; 
              text-align: center; 
              border-top: 1px solid #e5e7eb;
            }
            .footer p { 
              margin: 5px 0; 
              color: #6b7280; 
              font-size: 13px;
            }
            .urgent-badge {
              background: #ef4444;
              color: white;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: bold;
              display: inline-block;
              margin-bottom: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 طلب توظيف جديد</h1>
              <div class="app-number">رقم الطلب: ${applicationNumber}</div>
            </div>
            
            <div class="content">
              <div class="urgent-badge">🚨 يتطلب مراجعة فورية</div>
              
              <div class="section personal-info">
                <h2>👤 المعلومات الشخصية</h2>
                <p><strong>الاسم الكامل:</strong> ${jobData.fullName}</p>
                <p><strong>البريد الإلكتروني:</strong> <a href="mailto:${jobData.email}" style="color: #2563eb; text-decoration: none;">${jobData.email}</a></p>
                <p><strong>رقم الجوال:</strong> <a href="tel:${jobData.phone}" style="color: #2563eb; text-decoration: none;">${jobData.phone}</a></p>
                ${jobData.city ? `<p><strong>المدينة:</strong> ${jobData.city}</p>` : ''}
              </div>

              <div class="section job-info">
                <h2>💼 معلومات الوظيفة</h2>
                <p><strong>الوظيفة المرغوبة:</strong> <span style="background: #2563eb; color: white; padding: 2px 8px; border-radius: 4px; font-size: 14px;">${jobData.position}</span></p>
                ${jobData.experience ? `<p><strong>سنوات الخبرة:</strong> ${jobData.experience}</p>` : ''}
                ${jobData.education ? `<p><strong>المؤهل العلمي:</strong> ${jobData.education}</p>` : ''}
              </div>

              ${jobData.coverLetter ? `
              <div class="section cover-letter">
                <h2>📝 الرسالة التعريفية</h2>
                <p style="line-height: 1.8; font-style: italic;">"${jobData.coverLetter}"</p>
              </div>
              ` : ''}

              ${jobData.cvFileName ? `
              <div class="section cv-info">
                <h2>📎 السيرة الذاتية</h2>
                <p><strong>اسم الملف:</strong> ${jobData.cvFileName}</p>
                ${jobData.cvFileSize ? `<p><strong>حجم الملف:</strong> ${(jobData.cvFileSize / 1024 / 1024).toFixed(2)} ميجابايت</p>` : ''}
              </div>
              ` : ''}
            </div>

            <div class="footer">
              <p><strong>🏢 فكرة للتقنية - شريكك في التحول الرقمي</strong></p>
              <p>📅 تاريخ الإرسال: ${new Date().toLocaleString('ar-SA', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
              <p>⚡ تمت المعالجة تلقائياً بواسطة نظام إدارة الطلبات</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (companyEmailResponse.error) {
      console.error("Company email error:", companyEmailResponse.error);
    } else {
      console.log("Company email sent successfully:", companyEmailResponse);
    }

    // Send confirmation email to applicant
    const applicantEmailResponse = await resend.emails.send({
      from: "فكرة للتقنية <no-reply@alialshehriholding.com>",
      to: [jobData.email],
      subject: `🎉 تم استلام طلبك بنجاح - رقم ${applicationNumber}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>تأكيد استلام طلب التوظيف</title>
          <style>
            * { box-sizing: border-box; }
            body { 
              margin: 0; 
              padding: 0; 
              font-family: 'Segoe UI', Tahoma, Arial, sans-serif; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              direction: rtl;
            }
            .container { 
              max-width: 600px; 
              margin: 20px auto; 
              background: white; 
              border-radius: 16px; 
              overflow: hidden;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .header { 
              background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
              color: white; 
              padding: 40px 30px; 
              text-align: center;
            }
            .header h1 { 
              margin: 0; 
              font-size: 28px; 
              font-weight: bold;
            }
            .success-icon {
              font-size: 60px;
              margin-bottom: 15px;
              display: block;
            }
            .app-number {
              background: rgba(255,255,255,0.2);
              padding: 8px 16px;
              border-radius: 20px;
              display: inline-block;
              margin-top: 10px;
              font-size: 14px;
            }
            .content { 
              padding: 30px; 
            }
            .welcome-section {
              text-align: center;
              margin-bottom: 30px;
              padding: 25px;
              background: linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%);
              border-radius: 12px;
              border: 2px solid #3b82f6;
            }
            .welcome-section h2 {
              color: #1e40af;
              font-size: 24px;
              margin-bottom: 15px;
            }
            .welcome-section p {
              font-size: 16px;
              line-height: 1.8;
              color: #374151;
              margin: 10px 0;
            }
            .section { 
              margin-bottom: 25px; 
              padding: 20px; 
              border-radius: 12px; 
              border-right: 4px solid #10b981;
            }
            .summary-section { 
              background: linear-gradient(135deg, #fef7e7 0%, #fde68a 100%); 
            }
            .next-steps { 
              background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); 
            }
            .contact-info { 
              background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); 
            }
            .section h2 { 
              color: #1e40af; 
              margin: 0 0 15px 0; 
              font-size: 18px;
              display: flex;
              align-items: center;
            }
            .section h2::before {
              content: "🔸";
              margin-left: 8px;
            }
            .section p { 
              margin: 8px 0; 
              line-height: 1.6; 
              color: #374151;
            }
            .section strong { 
              color: #1f2937; 
            }
            .timeline {
              list-style: none;
              padding: 0;
              margin: 15px 0;
            }
            .timeline li {
              padding: 8px 0;
              border-right: 2px solid #10b981;
              padding-right: 15px;
              margin-bottom: 10px;
              position: relative;
            }
            .timeline li::before {
              content: "⏰";
              position: absolute;
              right: -12px;
              background: white;
              padding: 2px;
            }
            .footer { 
              background: linear-gradient(135deg, #1f2937 0%, #111827 100%); 
              color: white;
              padding: 30px; 
              text-align: center;
            }
            .footer p { 
              margin: 5px 0; 
              font-size: 14px;
              line-height: 1.6;
            }
            .footer .logo {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .social-links {
              margin-top: 15px;
            }
            .social-links a {
              color: #10b981;
              text-decoration: none;
              margin: 0 10px;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <span class="success-icon">✅</span>
              <h1>تم استلام طلبك بنجاح!</h1>
              <div class="app-number">رقم الطلب: ${applicationNumber}</div>
            </div>
            
            <div class="content">
              <div class="welcome-section">
                <h2>أهلاً وسهلاً ${jobData.fullName} 👋</h2>
                <p><strong>🎯 تم استلام طلب التوظيف بنجاح للوظيفة:</strong></p>
                <p style="background: #2563eb; color: white; padding: 8px 16px; border-radius: 8px; display: inline-block; font-weight: bold;">${jobData.position}</p>
                <p>نشكرك على اهتمامك بالانضمام لفريق فكرة للتقنية! 🚀</p>
              </div>
              
              <div class="section summary-section">
                <h2>📋 ملخص طلبك</h2>
                <p><strong>رقم الطلب:</strong> ${applicationNumber}</p>
                <p><strong>الوظيفة:</strong> ${jobData.position}</p>
                <p><strong>البريد الإلكتروني:</strong> ${jobData.email}</p>
                <p><strong>رقم الجوال:</strong> ${jobData.phone}</p>
                <p><strong>تاريخ التقديم:</strong> ${new Date().toLocaleDateString('ar-SA', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}</p>
              </div>

              <div class="section next-steps">
                <h2>🎯 الخطوات التالية</h2>
                <ul class="timeline">
                  <li><strong>اليوم:</strong> تم استلام طلبك وإدراجه في نظامنا</li>
                  <li><strong>خلال 24-48 ساعة:</strong> مراجعة أولية للطلب والسيرة الذاتية</li>
                  <li><strong>خلال 3-5 أيام عمل:</strong> التواصل معك لتحديد موعد المقابلة</li>
                  <li><strong>بعد المقابلة:</strong> إشعارك بالقرار النهائي خلال أسبوع</li>
                </ul>
                <p style="background: #dcfce7; padding: 12px; border-radius: 8px; margin-top: 15px;">
                  <strong>💡 نصيحة:</strong> تأكد من أن بريدك الإلكتروني ورقم هاتفك فعالان لضمان وصول رسائلنا إليك.
                </p>
              </div>

              <div class="section contact-info">
                <h2>📞 معلومات التواصل</h2>
                <p><strong>📧 للاستفسارات العامة:</strong> <a href="mailto:info@alialshehriholding.com" style="color: #2563eb; text-decoration: none;">info@alialshehriholding.com</a></p>
                <p><strong>💼 للاستفسارات حول التوظيف:</strong> <a href="mailto:careers@alialshehriholding.com" style="color: #2563eb; text-decoration: none;">careers@alialshehriholding.com</a></p>
                <p><strong>🌐 الموقع الإلكتروني:</strong> <a href="https://alialshehriholding.com" style="color: #2563eb; text-decoration: none;">alialshehriholding.com</a></p>
                <p><strong>📱 للدعم الفني:</strong> اتصل بنا عبر الواتساب أو الهاتف</p>
              </div>
            </div>

            <div class="footer">
              <div class="logo">🏢 فكرة للتقنية</div>
              <p><strong>شريكك في التحول الرقمي والابتكار التقني</strong></p>
              <p>نسعى لبناء مستقبل رقمي مشرق من خلال أفضل المواهب والتقنيات الحديثة</p>
              <div class="social-links">
                <a href="#" style="color: #10b981;">LinkedIn</a> |
                <a href="#" style="color: #10b981;">Twitter</a> |
                <a href="#" style="color: #10b981;">Instagram</a>
              </div>
              <p style="margin-top: 15px; font-size: 12px; opacity: 0.8;">
                هذه رسالة تلقائية، يُرجى عدم الرد عليها مباشرة. للاستفسارات استخدم معلومات التواصل أعلاه.
              </p>
            </div>
          </div>
        </body>
        </html>
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