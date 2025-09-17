import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { CustomerComplaintConfirmation } from './_templates/customer-complaint-confirmation.tsx';
import { AdminComplaintNotification } from './_templates/admin-complaint-notification.tsx';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ComplaintRequest {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  category: string;
  priority: string;
  title: string;
  description: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("📝 Complaint handler function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: ComplaintRequest = await req.json();
    console.log("📥 Request body:", body);

    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      category, 
      priority, 
      title, 
      description 
    } = body;

    // Validate required fields
    if (!customerName || !customerEmail || !category || !title || !description) {
      console.error("❌ Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Generate ticket number
    const ticketNumber = `CMP${Date.now().toString().slice(-8)}`;

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
    
    // Render customer confirmation email
    const customerEmailHtml = await renderAsync(
      React.createElement(CustomerComplaintConfirmation, {
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

    console.log("📧 Sending customer confirmation email...");
    
    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "نظام الشكاوي <support@alialsheehrholding.com>",
      to: [customerEmail],
      subject: `✅ تأكيد استلام شكواك #${ticketNumber}`,
      html: customerEmailHtml,
    });

    console.log("✅ Customer email sent:", customerEmailResponse);

    console.log("🎨 Rendering admin email template...");
    
    // Render admin notification email
    const adminEmailHtml = await renderAsync(
      React.createElement(AdminComplaintNotification, {
        ticketNumber,
        customerName,
        customerEmail,
        customerPhone: customerPhone || 'غير محدد',
        title,
        description,
        priority,
        category,
        categoryText,
        priorityText,
      })
    );

    console.log("📧 Sending admin notification email...");
    
    // Send notification to admin
    const adminEmailResponse = await resend.emails.send({
      from: "نظام الشكاوي <system@alialsheehrholding.com>",
      to: ["support@alialsheehrholding.com"],
      subject: `🚨 شكوى جديدة #${ticketNumber} - ${priorityText} - ${title}`,
      html: adminEmailHtml,
      reply_to: customerEmail,
    });

    console.log("✅ Admin email sent:", adminEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        ticketNumber,
        customerEmailId: customerEmailResponse.data?.id,
        adminEmailId: adminEmailResponse.data?.id,
        message: "تم إرسال الشكوى بنجاح وسنتواصل معك قريباً"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("❌ Error in complaint-handler function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "فشل في إرسال الشكوى"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);