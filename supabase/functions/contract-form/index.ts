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
    const contractDate = new Date().toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let emailHtml = "";
    let subject = "";

    if (formType === 'individual') {
      subject = "عقد تقديم خدمات تقنية جديد - فرد";
      emailHtml = `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background: #f8fafc;">
          <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">
                عقد تقديم خدمات تقنية
              </h1>
              <p style="color: #bfdbfe; margin: 10px 0 0 0;">شركة علي صالح الشهري القابضة</p>
            </div>
            
            <div style="padding: 30px;">
              <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #1e40af;">
                <h3 style="color: #1e40af; margin-top: 0; font-size: 18px;">الطرف الثاني - بيانات العميل</h3>
                <p style="margin: 8px 0;"><strong>الاسم الكامل:</strong> ${data.clientName}</p>
                <p style="margin: 8px 0;"><strong>البريد الإلكتروني:</strong> ${data.clientEmail}</p>
                <p style="margin: 8px 0;"><strong>رقم الهاتف:</strong> ${data.clientPhone}</p>
                ${data.clientIdNumber ? `<p style="margin: 8px 0;"><strong>رقم الهوية:</strong> ${data.clientIdNumber}</p>` : ''}
                ${data.clientAddress ? `<p style="margin: 8px 0;"><strong>العنوان:</strong> ${data.clientAddress}</p>` : ''}
              </div>

              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #3b82f6;">
                <h3 style="color: #1e40af; margin-top: 0; font-size: 18px;">تفاصيل الخدمة المطلوبة</h3>
                <p style="margin: 8px 0;"><strong>نوع الخدمة:</strong> ${data.selectedOffer}</p>
                <p style="margin: 8px 0;"><strong>قيمة الخدمة:</strong> ${data.servicePrice} ريال سعودي</p>
                <p style="margin: 8px 0;"><strong>مدة التنفيذ:</strong> ${data.contractDuration}</p>
                <p style="margin: 8px 0;"><strong>مدة تنفيذ الطلب:</strong> 15 يوم عمل من تاريخ التوقيع</p>
                ${data.serviceDescription ? `<p style="margin: 8px 0;"><strong>وصف الخدمة:</strong><br>${data.serviceDescription}</p>` : ''}
                ${data.customRequirements ? `<p style="margin: 8px 0;"><strong>متطلبات إضافية:</strong><br>${data.customRequirements}</p>` : ''}
              </div>

              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #f59e0b;">
                <h3 style="color: #92400e; margin-top: 0; font-size: 18px;">ملاحظة مهمة</h3>
                <p style="color: #92400e; margin: 0; font-weight: 500;">
                  ⚠️ إرسال العقد للمراجعة لا يعني الاتفاق النهائي بين الطرفين. 
                  يتم اعتماد العقد نهائياً بعد دفع المبلغ المتفق عليه عن طريق التحويل البنكي لحساب الشركة.
                </p>
              </div>

              <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #10b981;">
                <h3 style="color: #065f46; margin-top: 0; font-size: 18px;">معلومات الحساب البنكي</h3>
                <p style="margin: 8px 0; color: #065f46;"><strong>البنك:</strong> بنك الراجحي</p>
                <p style="margin: 8px 0; color: #065f46;"><strong>رقم الحساب:</strong> SA0380000000608010167519</p>
                <p style="margin: 8px 0; color: #065f46;"><strong>اسم الحساب:</strong> شركة علي صالح الشهري القابضة</p>
              </div>
            </div>

            <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #6b7280; margin: 0;">تاريخ إرسال العقد: ${contractDate}</p>
              <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 14px;">
                شركة علي صالح الشهري القابضة - الرياض، المملكة العربية السعودية
              </p>
            </div>
          </div>
        </div>
      `;
    } else if (formType === 'institution') {
      subject = "عقد تقديم خدمات تقنية جديد - مؤسسة";
      emailHtml = `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background: #f0fdf4;">
          <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #16a34a, #22c55e); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">
                عقد تقديم خدمات تقنية
              </h1>
              <p style="color: #bbf7d0; margin: 10px 0 0 0;">شركة علي صالح الشهري القابضة</p>
            </div>
            
            <div style="padding: 30px;">
              <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #16a34a;">
                <h3 style="color: #15803d; margin-top: 0; font-size: 18px;">الطرف الثاني - بيانات المؤسسة</h3>
                <p style="margin: 8px 0;"><strong>اسم المؤسسة:</strong> ${data.clientName}</p>
                <p style="margin: 8px 0;"><strong>البريد الإلكتروني:</strong> ${data.clientEmail}</p>
                <p style="margin: 8px 0;"><strong>رقم الهاتف:</strong> ${data.clientPhone}</p>
                ${data.commercialRegister ? `<p style="margin: 8px 0;"><strong>السجل التجاري:</strong> ${data.commercialRegister}</p>` : ''}
                ${data.taxNumber ? `<p style="margin: 8px 0;"><strong>الرقم الضريبي:</strong> ${data.taxNumber}</p>` : ''}
                ${data.authorizedPerson ? `<p style="margin: 8px 0;"><strong>المفوض بالتوقيع:</strong> ${data.authorizedPerson}</p>` : ''}
                ${data.clientAddress ? `<p style="margin: 8px 0;"><strong>العنوان:</strong> ${data.clientAddress}</p>` : ''}
              </div>

              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #3b82f6;">
                <h3 style="color: #1e40af; margin-top: 0; font-size: 18px;">تفاصيل الخدمة المطلوبة</h3>
                <p style="margin: 8px 0;"><strong>نوع الخدمة:</strong> ${data.selectedOffer}</p>
                <p style="margin: 8px 0;"><strong>قيمة الخدمة:</strong> ${data.servicePrice} ريال سعودي</p>
                <p style="margin: 8px 0;"><strong>مدة التنفيذ:</strong> ${data.contractDuration}</p>
                <p style="margin: 8px 0;"><strong>مدة تنفيذ الطلب:</strong> 15 يوم عمل من تاريخ التوقيع</p>
                ${data.serviceDescription ? `<p style="margin: 8px 0;"><strong>وصف الخدمة:</strong><br>${data.serviceDescription}</p>` : ''}
                ${data.customRequirements ? `<p style="margin: 8px 0;"><strong>متطلبات إضافية:</strong><br>${data.customRequirements}</p>` : ''}
              </div>

              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #f59e0b;">
                <h3 style="color: #92400e; margin-top: 0; font-size: 18px;">ملاحظة مهمة</h3>
                <p style="color: #92400e; margin: 0; font-weight: 500;">
                  ⚠️ إرسال العقد للمراجعة لا يعني الاتفاق النهائي بين الطرفين. 
                  يتم اعتماد العقد نهائياً بعد دفع المبلغ المتفق عليه عن طريق التحويل البنكي لحساب الشركة.
                </p>
              </div>

              <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #10b981;">
                <h3 style="color: #065f46; margin-top: 0; font-size: 18px;">معلومات الحساب البنكي</h3>
                <p style="margin: 8px 0; color: #065f46;"><strong>البنك:</strong> بنك الراجحي</p>
                <p style="margin: 8px 0; color: #065f46;"><strong>رقم الحساب:</strong> SA0380000000608010167519</p>
                <p style="margin: 8px 0; color: #065f46;"><strong>اسم الحساب:</strong> شركة علي صالح الشهري القابضة</p>
              </div>
            </div>

            <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #6b7280; margin: 0;">تاريخ إرسال العقد: ${contractDate}</p>
              <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 14px;">
                شركة علي صالح الشهري القابضة - الرياض، المملكة العربية السعودية
              </p>
            </div>
          </div>
        </div>
      `;
    } else if (formType === 'company') {
      subject = "عقد تقديم خدمات تقنية جديد - شركة";
      emailHtml = `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background: #faf5ff;">
          <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #9333ea, #a855f7); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">
                عقد تقديم خدمات تقنية
              </h1>
              <p style="color: #ddd6fe; margin: 10px 0 0 0;">شركة علي صالح الشهري القابضة</p>
            </div>
            
            <div style="padding: 30px;">
              <div style="background: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #9333ea;">
                <h3 style="color: #7c3aed; margin-top: 0; font-size: 18px;">الطرف الثاني - بيانات الشركة</h3>
                <p style="margin: 8px 0;"><strong>اسم الشركة:</strong> ${data.clientName}</p>
                <p style="margin: 8px 0;"><strong>البريد الإلكتروني:</strong> ${data.clientEmail}</p>
                <p style="margin: 8px 0;"><strong>رقم الهاتف:</strong> ${data.clientPhone}</p>
                ${data.commercialRegister ? `<p style="margin: 8px 0;"><strong>السجل التجاري:</strong> ${data.commercialRegister}</p>` : ''}
                ${data.taxNumber ? `<p style="margin: 8px 0;"><strong>الرقم الضريبي:</strong> ${data.taxNumber}</p>` : ''}
                ${data.authorizedPerson ? `<p style="margin: 8px 0;"><strong>المفوض بالتوقيع:</strong> ${data.authorizedPerson}</p>` : ''}
                ${data.clientAddress ? `<p style="margin: 8px 0;"><strong>العنوان:</strong> ${data.clientAddress}</p>` : ''}
              </div>

              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #3b82f6;">
                <h3 style="color: #1e40af; margin-top: 0; font-size: 18px;">تفاصيل الخدمة المطلوبة</h3>
                <p style="margin: 8px 0;"><strong>نوع الخدمة:</strong> ${data.selectedOffer}</p>
                <p style="margin: 8px 0;"><strong>قيمة الخدمة:</strong> ${data.servicePrice} ريال سعودي</p>
                <p style="margin: 8px 0;"><strong>مدة التنفيذ:</strong> ${data.contractDuration}</p>
                <p style="margin: 8px 0;"><strong>مدة تنفيذ الطلب:</strong> 15 يوم عمل من تاريخ التوقيع</p>
                ${data.serviceDescription ? `<p style="margin: 8px 0;"><strong>وصف الخدمة:</strong><br>${data.serviceDescription}</p>` : ''}
                ${data.customRequirements ? `<p style="margin: 8px 0;"><strong>متطلبات إضافية:</strong><br>${data.customRequirements}</p>` : ''}
              </div>

              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #f59e0b;">
                <h3 style="color: #92400e; margin-top: 0; font-size: 18px;">ملاحظة مهمة</h3>
                <p style="color: #92400e; margin: 0; font-weight: 500;">
                  ⚠️ إرسال العقد للمراجعة لا يعني الاتفاق النهائي بين الطرفين. 
                  يتم اعتماد العقد نهائياً بعد دفع المبلغ المتفق عليه عن طريق التحويل البنكي لحساب الشركة.
                </p>
              </div>

              <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #10b981;">
                <h3 style="color: #065f46; margin-top: 0; font-size: 18px;">معلومات الحساب البنكي</h3>
                <p style="margin: 8px 0; color: #065f46;"><strong>البنك:</strong> بنك الراجحي</p>
                <p style="margin: 8px 0; color: #065f46;"><strong>رقم الحساب:</strong> SA0380000000608010167519</p>
                <p style="margin: 8px 0; color: #065f46;"><strong>اسم الحساب:</strong> شركة علي صالح الشهري القابضة</p>
              </div>
            </div>

            <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #6b7280; margin: 0;">تاريخ إرسال العقد: ${contractDate}</p>
              <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 14px;">
                شركة علي صالح الشهري القابضة - الرياض، المملكة العربية السعودية
              </p>
            </div>
          </div>
        </div>
      `;
    }

    // Send email to company
    const companyEmailResponse = await resend.emails.send({
      from: "طلبات التعاقد <contracts@alialshehriholding.com>",
      to: ["info@alialshehriholding.com"],
      subject: subject,
      html: emailHtml,
    });

    // Send confirmation email to client
    const clientEmailResponse = await resend.emails.send({
      from: "شركة علي صالح الشهري القابضة <no-reply@alialshehriholding.com>",
      to: data.clientEmail,
      subject: "تأكيد استلام طلب العقد - شركة علي صالح الشهري القابضة",
      html: `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
          <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">
                شركة علي صالح الشهري القابضة
              </h1>
              <p style="color: #bfdbfe; margin: 10px 0 0 0;">شكراً لثقتك في خدماتنا</p>
            </div>
            
            <div style="padding: 30px; text-align: center;">
              <div style="background: #dcfce7; padding: 25px; border-radius: 12px; margin: 20px 0;">
                <div style="background: #22c55e; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 30px;">✓</span>
                </div>
                <h2 style="color: #15803d; margin: 0 0 10px 0; font-size: 20px;">تم استلام طلبك بنجاح!</h2>
                <p style="color: #166534; margin: 0; font-size: 16px;">عزيزنا ${data.clientName}</p>
              </div>

              <div style="text-align: right; margin: 25px 0;">
                <p style="color: #374151; line-height: 1.6; margin: 0 0 15px 0;">
                  نشكرك على تقديم طلب التعاقد معنا. لقد تم استلام طلبك وسيتم مراجعته من قبل فريقنا المختص.
                </p>
                <p style="color: #374151; line-height: 1.6; margin: 0;">
                  <strong style="color: #1e40af;">سيتم التواصل معك خلال 24 ساعة كحد أقصى</strong> لمناقشة تفاصيل العقد وإجراءات التنفيذ.
                </p>
              </div>

              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: right;">
                <h3 style="color: #92400e; margin-top: 0; font-size: 16px;">⚠️ ملاحظة مهمة</h3>
                <p style="color: #92400e; margin: 0; line-height: 1.5;">
                  إرسال العقد للمراجعة لا يعني الاتفاق النهائي بين الطرفين. 
                  سيتم اعتماد العقد نهائياً بعد الدفع عن طريق التحويل البنكي لحساب الشركة.
                </p>
              </div>

              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: right;">
                <h3 style="color: #1e40af; margin-top: 0; font-size: 16px;">الخطوات التالية:</h3>
                <div style="text-align: right;">
                  <p style="margin: 8px 0; color: #374151;">✓ مراجعة طلبك من قبل فريق المبيعات</p>
                  <p style="margin: 8px 0; color: #374151;">✓ التواصل معك لمناقشة التفاصيل والشروط</p>
                  <p style="margin: 8px 0; color: #374151;">✓ إرسال العقد النهائي المعتمد</p>
                  <p style="margin: 8px 0; color: #374151;">✓ البدء في تنفيذ المشروع بعد الدفع</p>
                </div>
              </div>

              <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h3 style="color: #065f46; margin-top: 0; font-size: 16px;">للاستفسارات والتواصل</h3>
                <p style="margin: 8px 0; color: #065f46;"><strong>البريد الإلكتروني:</strong> info@alialshehriholding.com</p>
                <p style="margin: 8px 0; color: #065f46;"><strong>الهاتف:</strong> +966 555 812 567</p>
                <p style="margin: 8px 0; color: #065f46;"><strong>ساعات العمل:</strong> الأحد - الخميس من 9 صباحاً حتى 6 مساءً</p>
              </div>
            </div>

            <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #6b7280; margin: 0; font-size: 14px;">
                شركة علي صالح الشهري القابضة<br>
                الرياض - المملكة العربية السعودية<br>
                تاريخ الإرسال: ${contractDate}
              </p>
            </div>
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