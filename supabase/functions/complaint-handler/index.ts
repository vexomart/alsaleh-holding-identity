import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { CustomerComplaintConfirmation } from './_templates/simple-customer-confirmation.tsx';
import { AdminComplaintNotification } from './_templates/simple-admin-notification.tsx';

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

// Helper: send email with company domain, fallback to Resend domain if unauthorized
async function sendEmailWithFallback({
  to,
  subject,
  html,
  preferredFrom,
  fallbackFrom,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  html: string;
  preferredFrom: string;
  fallbackFrom: string;
  replyTo?: string;
}) {
  const toArray = Array.isArray(to) ? to : [to];
  try {
    const primary = await resend.emails.send({
      from: preferredFrom,
      to: toArray,
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    });

    if (primary?.error && (primary.error.statusCode === 403 || String(primary.error.message || '').toLowerCase().includes('not authorized'))) {
      console.log('⚠️ Preferred domain not authorized, retrying with Resend domain...');
      const retry = await resend.emails.send({
        from: fallbackFrom,
        to: toArray,
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      });
      return { response: retry, fallbackUsed: true };
    }

    return { response: primary, fallbackUsed: false };
  } catch (err) {
    console.log('❌ Primary send failed, retry with fallback:', (err as any)?.message || err);
    const retry = await resend.emails.send({
      from: fallbackFrom,
      to: toArray,
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    });
    return { response: retry, fallbackUsed: true };
  }
}

const handler = async (req: Request): Promise<Response> => {
  console.log("📝 Complaint handler function called - New Modern Design V2.0");

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

    // Send confirmation email to customer with fallback
    const { response: customerEmailResponse, fallbackUsed: customerFallback } = await sendEmailWithFallback({
      preferredFrom: "ASH HOLDING Support <support@alialshehriholding.com>",
      fallbackFrom: "ASH HOLDING Support <onboarding@resend.dev>",
      to: customerEmail,
      subject: `✅ تأكيد استلام شكواك #${ticketNumber}`,
      html: customerEmailHtml,
    });

    console.log("✅ Customer email result:", customerEmailResponse, "fallback:", customerFallback);

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
    
    // Send notification to admin with fallback and corrected admin address
    const { response: adminEmailResponse, fallbackUsed: adminFallback } = await sendEmailWithFallback({
      preferredFrom: "ASH System <system@alialshehriholding.com>",
      fallbackFrom: "ASH System <onboarding@resend.dev>",
      to: "info@alialshehriholding.com",
      subject: `🚨 شكوى جديدة #${ticketNumber} - ${priorityText} - ${title}`,
      html: adminEmailHtml,
      replyTo: customerEmail,
    });

    console.log("✅ Admin email result:", adminEmailResponse, "fallback:", adminFallback);

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