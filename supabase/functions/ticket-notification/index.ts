import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { CustomerTicketConfirmation } from './_templates/customer-ticket-confirmation.tsx';
import { AdminTicketNotification } from './_templates/admin-ticket-notification.tsx';

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
  console.log("🎫 Ticket notification function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: TicketNotificationRequest = await req.json();
    console.log("📥 Request body:", body);

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
      console.error("❌ Missing required fields");
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

    const priorityText = getPriorityText(priority);
    const categoryText = getCategoryText(category);

    console.log("🎨 Rendering customer email template...");
    
    // Render customer email template
    const customerEmailHtml = await renderAsync(
      React.createElement(CustomerTicketConfirmation, {
        ticketNumber,
        customerName,
        title,
        description,
        priority,
        category,
        categoryText,
        priorityText,
      })
    );

    console.log("📧 Sending customer email...");
    
    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "نظام الدعم <support@alialsheehrholding.com>",
      to: [customerEmail],
      subject: `✅ تأكيد استلام تذكرة الدعم #${ticketNumber}`,
      html: customerEmailHtml,
    });

    console.log("✅ Customer email sent:", customerEmailResponse);

    console.log("🎨 Rendering admin email template...");
    
    // Render admin email template
    const adminEmailHtml = await renderAsync(
      React.createElement(AdminTicketNotification, {
        ticketNumber,
        customerName,
        customerEmail,
        title,
        description,
        priority,
        category,
        categoryText,
        priorityText,
      })
    );

    console.log("📧 Sending admin email...");
    
    // Send notification to admin/support team
    const adminEmailResponse = await resend.emails.send({
      from: "نظام التذاكر <system@alialsheehrholding.com>",
      to: ["support@alialsheehrholding.com"],
      subject: `🚨 تذكرة دعم جديدة #${ticketNumber} - ${priorityText} - ${title}`,
      html: adminEmailHtml,
      reply_to: customerEmail,
    });

    console.log("✅ Admin email sent:", adminEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        customerEmailId: customerEmailResponse.data?.id,
        adminEmailId: adminEmailResponse.data?.id,
        message: "تم إرسال الإشعارات بنجاح"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("❌ Error in ticket-notification function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "فشل في إرسال إشعارات التذكرة"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);