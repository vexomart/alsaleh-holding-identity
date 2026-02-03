import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BankTransferRequest {
  bank: string;
  name: string;
  email: string;
  phone: string;
  amount: string;
  receiptAttached?: boolean;
  transactionId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: BankTransferRequest = await req.json();
    console.log("Bank transfer request received:", requestData);

    // Send email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "نظام المحفظة - ASH HOLDING <info@ash-holding.sa>",
      to: ["info@ash-holding.sa"],
      subject: `طلب تحويل بنكي جديد - ${requestData.bank === 'alrajhi' ? 'البنك الراجحي' : requestData.bank}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #1e40af; text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 15px;">
              طلب تحويل بنكي جديد
            </h1>
            
            <div style="margin: 20px 0;">
              <h2 style="color: #374151; font-size: 18px;">تفاصيل الطلب:</h2>
              
              <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                <tr style="background-color: #f3f4f6;">
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">البنك:</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">${requestData.bank === 'alrajhi' ? 'البنك الراجحي' : requestData.bank}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">الاسم:</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">${requestData.name}</td>
                </tr>
                <tr style="background-color: #f3f4f6;">
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">البريد الإلكتروني:</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">${requestData.email}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">رقم الجوال:</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">${requestData.phone}</td>
                </tr>
                <tr style="background-color: #f3f4f6;">
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">المبلغ:</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; color: #059669; font-weight: bold;">${requestData.amount} ريال سعودي</td>
                </tr>
                ${requestData.receiptAttached ? `
                <tr>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">الإيصال:</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; color: #059669;">✓ تم إرفاق الإيصال</td>
                </tr>
                ` : ''}
                ${requestData.transactionId ? `
                <tr style="background-color: #f3f4f6;">
                  <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">رقم المعاملة:</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">${requestData.transactionId}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background-color: #fef3c7; border-radius: 8px; border-right: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e; font-weight: bold;">يرجى مراجعة الطلب والتواصل مع العميل في أقرب وقت ممكن.</p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
              شركة علي صالح محمد الشهري - نظام المحفظة الرقمية
            </div>
          </div>
        </div>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "ASH HOLDING <info@ash-holding.sa>",
      to: [requestData.email],
      subject: "تأكيد استلام طلب التحويل البنكي",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #1e40af; text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 15px;">
              تأكيد استلام طلبك
            </h1>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              عزيزي/عزيزتي <strong>${requestData.name}</strong>،
            </p>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              تم استلام طلب التحويل البنكي الخاص بك بنجاح.
            </p>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #3b82f6;">
              <h3 style="color: #1e40af; margin-top: 0;">تفاصيل طلبك:</h3>
              <ul style="color: #374151; line-height: 1.8;">
                <li><strong>المبلغ:</strong> ${requestData.amount} ريال سعودي</li>
                <li><strong>البنك:</strong> ${requestData.bank === 'alrajhi' ? 'البنك الراجحي' : requestData.bank}</li>
                <li><strong>حالة الطلب:</strong> قيد المراجعة</li>
              </ul>
            </div>
            
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #22c55e;">
              <p style="margin: 0; color: #166534; font-weight: bold;">
                ✓ جاري التحقق من طلبك وسوف يتم التواصل معك قريباً
              </p>
            </div>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              سيقوم فريقنا بمراجعة طلبك والتواصل معك خلال 24 ساعة. في حالة وجود أي استفسارات، يرجى التواصل معنا.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <div style="background-color: #1e40af; color: white; padding: 15px; border-radius: 8px; display: inline-block;">
                <p style="margin: 0; font-weight: bold;">شركة علي صالح محمد الشهري</p>
                <p style="margin: 5px 0 0 0; font-size: 14px;">المملكة العربية السعودية</p>
              </div>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Customer email sent:", customerEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال الطلب بنجاح",
        adminEmailSent: !adminEmailResponse.error,
        customerEmailSent: !customerEmailResponse.error
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in bank-transfer-request function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "حدث خطأ أثناء معالجة الطلب" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);