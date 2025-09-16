import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TicketNotificationRequest {
  ticketNumber: string;
  customerEmail: string;
  customerName: string;
  title: string;
  description: string;
  priority: string;
  category: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Ticket notification function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: TicketNotificationRequest = await req.json();
    console.log("Request body:", body);

    const { 
      ticketNumber, 
      customerEmail, 
      customerName, 
      title, 
      description, 
      priority, 
      category 
    } = body;

    // Validate required fields
    if (!ticketNumber || !customerEmail || !title || !description) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get priority text in Arabic
    const getPriorityText = (priority: string) => {
      const priorityMap: { [key: string]: string } = {
        'high': 'عالية',
        'medium': 'متوسطة', 
        'low': 'منخفضة'
      };
      return priorityMap[priority] || priority;
    };

    // Get category text in Arabic
    const getCategoryText = (category: string) => {
      const categoryMap: { [key: string]: string } = {
        'technical': 'مشكلة تقنية',
        'billing': 'مسائل مالية',
        'project': 'مشاريع',
        'general': 'عام'
      };
      return categoryMap[category] || category;
    };

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "نظام الدعم <support@alialsheehrholding.com>",
      to: [customerEmail],
      subject: `تأكيد استلام تذكرة الدعم #${ticketNumber}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .ticket-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #3b82f6; }
            .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
            .status { color: #059669; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>تم استلام تذكرة الدعم بنجاح</h1>
            </div>
            <div class="content">
              <p>عزيزي/عزيزتي ${customerName}،</p>
              
              <p>شكراً لك على التواصل معنا. تم استلام تذكرة الدعم الخاصة بك وسيقوم فريق الدعم الفني بمراجعتها والرد عليك في أقرب وقت ممكن.</p>
              
              <div class="ticket-info">
                <h3>تفاصيل التذكرة:</h3>
                <p><strong>رقم التذكرة:</strong> #${ticketNumber}</p>
                <p><strong>الموضوع:</strong> ${title}</p>
                <p><strong>الفئة:</strong> ${getCategoryText(category)}</p>
                <p><strong>الأولوية:</strong> ${getPriorityText(priority)}</p>
                <p><strong>الحالة:</strong> <span class="status">مفتوح - قيد المراجعة</span></p>
                <p><strong>الوصف:</strong></p>
                <p style="background: #f1f5f9; padding: 15px; border-radius: 6px; margin-top: 10px;">${description}</p>
              </div>
              
              <p>يمكنك متابعة حالة تذكرتك من خلال لوحة التحكم الخاصة بك على موقعنا.</p>
              
              <p>إذا كان لديك أي استفسارات إضافية، لا تتردد في التواصل معنا.</p>
              
              <div class="footer">
                <p>مع أطيب التحيات،<br>فريق الدعم الفني<br>شركة علي صالح الشهري القابضة</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Customer email sent:", customerEmailResponse);

    // Send notification to admin/support team
    const adminEmailResponse = await resend.emails.send({
      from: "نظام التذاكر <system@alialsheehrholding.com>",
      to: ["support@alialsheehrholding.com"], // Replace with actual support email
      subject: `تذكرة دعم جديدة #${ticketNumber} - ${title}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .ticket-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #dc2626; }
            .customer-info { background: #eff6ff; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .priority-high { color: #dc2626; font-weight: bold; }
            .priority-medium { color: #d97706; font-weight: bold; }
            .priority-low { color: #059669; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎫 تذكرة دعم جديدة</h1>
            </div>
            <div class="content">
              <p><strong>تم إنشاء تذكرة دعم جديدة وتحتاج إلى مراجعة فورية.</strong></p>
              
              <div class="ticket-info">
                <h3>تفاصيل التذكرة:</h3>
                <p><strong>رقم التذكرة:</strong> #${ticketNumber}</p>
                <p><strong>الموضوع:</strong> ${title}</p>
                <p><strong>الفئة:</strong> ${getCategoryText(category)}</p>
                <p><strong>الأولوية:</strong> <span class="priority-${priority}">${getPriorityText(priority)}</span></p>
                <p><strong>تاريخ الإنشاء:</strong> ${new Date().toLocaleDateString('ar-SA')}</p>
                
                <div class="customer-info">
                  <h4>معلومات العميل:</h4>
                  <p><strong>الاسم:</strong> ${customerName}</p>
                  <p><strong>البريد الإلكتروني:</strong> ${customerEmail}</p>
                </div>
                
                <p><strong>الوصف:</strong></p>
                <p style="background: #f1f5f9; padding: 15px; border-radius: 6px; margin-top: 10px; white-space: pre-wrap;">${description}</p>
              </div>
              
              <p>يرجى تسجيل الدخول إلى لوحة الإدارة لمراجعة التذكرة والرد على العميل.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        customerEmailId: customerEmailResponse.data?.id,
        adminEmailId: adminEmailResponse.data?.id
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in ticket-notification function:", error);
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