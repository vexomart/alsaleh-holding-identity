import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import React from "npm:react@18.3.1";
import { DomainRequestEmail } from "./_templates/domain-request.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  customerName: string;
  customerEmail: string;
  domainName: string;
  price: number;
  registrationPeriod: number;
  requestId: string;
  status: string;
  emailType: 'customer' | 'admin';
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      customerName,
      customerEmail,
      domainName,
      price,
      registrationPeriod,
      requestId,
      status,
      emailType
    }: EmailRequest = await req.json();

    console.log('Sending domain email:', {
      customerEmail,
      domainName,
      status,
      emailType
    });

    if (emailType === 'customer') {
      // Email for customer
      const emailHtml = await renderAsync(
        React.createElement(DomainRequestEmail, {
          customerName,
          domainName,
          price,
          registrationPeriod,
          requestId,
          status
        })
      );

      const emailResponse = await resend.emails.send({
        from: "شركة علي الشهري القابضة <domains@alialshehriholding.com>",
        to: [customerEmail],
        subject: getEmailSubject(status, domainName),
        html: emailHtml,
      });

      console.log("Customer email sent successfully:", emailResponse);

      return new Response(
        JSON.stringify({ success: true, emailResponse }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } else if (emailType === 'admin') {
      // Email notification for admin
      const adminEmailHtml = `
        <div style="font-family: Tahoma, Arial, sans-serif; direction: rtl; max-width: 600px; margin: 0 auto;">
          <div style="background: #1e40af; color: white; padding: 20px; text-align: center;">
            <h1>طلب نطاق جديد</h1>
          </div>
          
          <div style="padding: 20px; background: white;">
            <h2 style="color: #1e40af;">تفاصيل الطلب</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background: #f8fafc;">
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">النطاق:</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${domainName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">اسم العميل:</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${customerName}</td>
              </tr>
              <tr style="background: #f8fafc;">
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">البريد الإلكتروني:</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${customerEmail}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">السعر:</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${price} ريال سعودي</td>
              </tr>
              <tr style="background: #f8fafc;">
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">مدة التسجيل:</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${registrationPeriod} سنة</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">رقم الطلب:</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${requestId}</td>
              </tr>
            </table>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold;">يرجى مراجعة الطلب والموافقة عليه من لوحة التحكم.</p>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://alialshehriholding.com/domain-management" 
                 style="background: #1e40af; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;">
                مراجعة الطلب
              </a>
            </div>
          </div>
          
          <div style="background: #f8fafc; padding: 15px; text-align: center; color: #6b7280; font-size: 12px;">
            شركة علي صالح الشهري القابضة - نظام إدارة النطاقات
          </div>
        </div>
      `;

      const adminEmailResponse = await resend.emails.send({
        from: "نظام النطاقات <system@alialshehriholding.com>",
        to: ["info@alialshehriholding.com"],
        subject: `طلب نطاق جديد: ${domainName}`,
        html: adminEmailHtml,
      });

      console.log("Admin email sent successfully:", adminEmailResponse);

      return new Response(
        JSON.stringify({ success: true, emailResponse: adminEmailResponse }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    throw new Error('Invalid email type');

  } catch (error: any) {
    console.error("Error in domain-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});

function getEmailSubject(status: string, domainName: string): string {
  switch (status) {
    case 'pending':
      return `تم استلام طلب النطاق ${domainName} - شركة علي الشهري القابضة`;
    case 'approved':
      return `تمت الموافقة على النطاق ${domainName} - شركة علي الشهري القابضة`;
    case 'registered':
      return `تم تسجيل النطاق ${domainName} بنجاح - شركة علي الشهري القابضة`;
    case 'rejected':
      return `تحديث بخصوص طلب النطاق ${domainName} - شركة علي الشهري القابضة`;
    default:
      return `تحديث طلب النطاق ${domainName} - شركة علي الشهري القابضة`;
  }
}