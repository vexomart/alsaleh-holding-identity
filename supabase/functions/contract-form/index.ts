import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContractFormRequest {
  formType: 'individual' | 'institution' | 'company';
  [key: string]: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContractFormRequest = await req.json();
    const { formType, ...data } = formData;

    // Generate email content based on form type
    let emailHtml = "";
    let subject = "";

    if (formType === 'individual') {
      subject = "طلب تعاقد جديد - فرد";
      emailHtml = `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            طلب تعاقد جديد من فرد
          </h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">البيانات الشخصية</h3>
            <p><strong>الاسم الكامل:</strong> ${data.fullName}</p>
            <p><strong>البريد الإلكتروني:</strong> ${data.email}</p>
            <p><strong>رقم الهاتف:</strong> ${data.phone}</p>
            <p><strong>رقم الهوية:</strong> ${data.nationalId}</p>
            <p><strong>المدينة:</strong> ${data.city}</p>
          </div>

          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">تفاصيل المشروع</h3>
            <p><strong>نوع الخدمة:</strong> ${data.serviceType}</p>
            <p><strong>الميزانية المتوقعة:</strong> ${data.budget}</p>
            <p><strong>الجدول الزمني:</strong> ${data.timeline}</p>
            <p><strong>وصف المشروع:</strong><br>${data.projectDescription}</p>
            ${data.experience ? `<p><strong>الخبرة السابقة:</strong><br>${data.experience}</p>` : ''}
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280;">تم إرسال هذا الطلب من موقع شركة علي صالح الشهري القابضة</p>
            <p style="color: #6b7280; font-size: 12px;">التاريخ: ${new Date().toLocaleDateString('ar-SA')}</p>
          </div>
        </div>
      `;
    } else if (formType === 'institution') {
      subject = "طلب تعاقد جديد - مؤسسة";
      emailHtml = `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">
            طلب تعاقد جديد من مؤسسة
          </h2>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #15803d; margin-top: 0;">بيانات المؤسسة</h3>
            <p><strong>اسم المؤسسة:</strong> ${data.institutionName}</p>
            <p><strong>نوع المؤسسة:</strong> ${data.institutionType}</p>
            <p><strong>رقم الترخيص:</strong> ${data.licenseNumber}</p>
            <p><strong>المدينة:</strong> ${data.city}</p>
          </div>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #15803d; margin-top: 0;">بيانات الاتصال</h3>
            <p><strong>الشخص المسؤول:</strong> ${data.contactPerson}</p>
            <p><strong>البريد الإلكتروني:</strong> ${data.email}</p>
            <p><strong>رقم الهاتف:</strong> ${data.phone}</p>
          </div>

          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #15803d; margin-top: 0;">تفاصيل المشروع</h3>
            <p><strong>نوع الخدمة:</strong> ${data.serviceType}</p>
            <p><strong>الميزانية المتوقعة:</strong> ${data.budget}</p>
            <p><strong>الجدول الزمني:</strong> ${data.timeline}</p>
            ${data.teamSize ? `<p><strong>حجم الفريق المتوقع:</strong> ${data.teamSize}</p>` : ''}
            <p><strong>وصف المشروع:</strong><br>${data.projectDescription}</p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280;">تم إرسال هذا الطلب من موقع شركة علي صالح الشهري القابضة</p>
            <p style="color: #6b7280; font-size: 12px;">التاريخ: ${new Date().toLocaleDateString('ar-SA')}</p>
          </div>
        </div>
      `;
    } else if (formType === 'company') {
      subject = "طلب تعاقد جديد - شركة";
      emailHtml = `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #9333ea; border-bottom: 2px solid #9333ea; padding-bottom: 10px;">
            طلب تعاقد جديد من شركة
          </h2>
          
          <div style="background: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #7c3aed; margin-top: 0;">بيانات الشركة</h3>
            <p><strong>اسم الشركة:</strong> ${data.companyName}</p>
            <p><strong>نوع الشركة:</strong> ${data.companyType}</p>
            <p><strong>رقم السجل التجاري:</strong> ${data.crNumber}</p>
            <p><strong>الرقم الضريبي:</strong> ${data.taxNumber}</p>
            <p><strong>المدينة:</strong> ${data.city}</p>
            ${data.website ? `<p><strong>الموقع الإلكتروني:</strong> ${data.website}</p>` : ''}
          </div>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #7c3aed; margin-top: 0;">بيانات الاتصال</h3>
            <p><strong>الشخص المسؤول:</strong> ${data.contactPerson}</p>
            <p><strong>البريد الإلكتروني:</strong> ${data.email}</p>
            <p><strong>رقم الهاتف:</strong> ${data.phone}</p>
          </div>

          <div style="background: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #7c3aed; margin-top: 0;">تفاصيل المشروع</h3>
            <p><strong>نوع الخدمة:</strong> ${data.serviceType}</p>
            <p><strong>الميزانية المتوقعة:</strong> ${data.budget}</p>
            <p><strong>الجدول الزمني:</strong> ${data.timeline}</p>
            ${data.teamSize ? `<p><strong>حجم الفريق المتوقع:</strong> ${data.teamSize}</p>` : ''}
            <p><strong>وصف المشروع:</strong><br>${data.projectDescription}</p>
            ${data.previousExperience ? `<p><strong>الخبرة السابقة:</strong><br>${data.previousExperience}</p>` : ''}
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280;">تم إرسال هذا الطلب من موقع شركة علي صالح الشهري القابضة</p>
            <p style="color: #6b7280; font-size: 12px;">التاريخ: ${new Date().toLocaleDateString('ar-SA')}</p>
          </div>
        </div>
      `;
    }

    // Send email to company
    const companyEmailResponse = await resend.emails.send({
      from: "طلبات التعاقد <onboarding@resend.dev>",
      to: ["info@fekrahtech.com"],
      subject: subject,
      html: emailHtml,
    });

    // Send confirmation email to client
    const clientEmailResponse = await resend.emails.send({
      from: "شركة علي صالح الشهري القابضة <onboarding@resend.dev>",
      to: [data.email],
      subject: "تأكيد استلام طلب التعاقد",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb; text-align: center;">شكراً لتواصلك معنا</h2>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3 style="color: #1e40af;">تم استلام طلبك بنجاح</h3>
            <p>عزيزنا ${formType === 'individual' ? data.fullName : data.contactPerson}،</p>
            <p>نشكرك على اهتمامك بخدماتنا. لقد تم استلام طلب التعاقد الخاص بك وسيتم مراجعته من قبل فريقنا المختص.</p>
            <p><strong>سيتم التواصل معك خلال 24 ساعة كحد أقصى.</strong></p>
          </div>

          <div style="background: #fefce8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #a16207; margin-top: 0;">الخطوات التالية:</h4>
            <ul style="color: #a16207;">
              <li>مراجعة طلبك من قبل فريق المبيعات</li>
              <li>التواصل معك لمناقشة التفاصيل</li>
              <li>تقديم عرض مخصص لاحتياجاتك</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280;">للاستفسارات العاجلة، يمكنك التواصل معنا على:</p>
            <p style="color: #2563eb; font-weight: bold;">info@alsheharitechholding.com</p>
            <p style="color: #2563eb; font-weight: bold;">+966 50 123 4567</p>
          </div>

          <div style="text-align: center; margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <p style="color: #6b7280; font-size: 14px;">
              شركة علي صالح الشهري القابضة<br>
              الرياض - المملكة العربية السعودية
            </p>
          </div>
        </div>
      `,
    });

    console.log("Emails sent successfully:", { companyEmailResponse, clientEmailResponse });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال طلب التعاقد بنجاح" 
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
    console.error("Error in contract-form function:", error);
    return new Response(
      JSON.stringify({ 
        error: "حدث خطأ أثناء إرسال النموذج",
        details: error.message 
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