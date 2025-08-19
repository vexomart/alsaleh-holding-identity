import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import React from "npm:react@18.3.1";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { ProfessionalInvoiceEmail } from "./_templates/professional-invoice.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvoiceEmailRequest {
  customer_email: string;
  customer_name: string;
  invoice_number?: string;
  amount: number;
  currency: string;
  payment_url?: string;
  transaction_id: string;
  status: string;
  payment_method: string;
  offer_title: string;
  offer_description: string;
  original_price: string;
  current_price: string;
  discount: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // SECURITY: Authenticate user first (required since JWT verification is enabled)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.log("Authentication failed - no authorization header");
      return new Response(JSON.stringify({ 
        error: "Authentication required",
        message: "يجب تسجيل الدخول أولاً" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    
    // Initialize Supabase client for authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify user token
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData?.user?.email) {
      console.log("Authentication failed - invalid token", userError?.message);
      return new Response(JSON.stringify({ 
        error: "Invalid authentication",
        message: "فشل في التحقق من الهوية" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const user = userData.user;
    console.log("User authenticated for invoice email:", user.id);

    // Parse and validate request body
    const requestData: InvoiceEmailRequest = await req.json();

    // SECURITY: Input validation and sanitization
    if (!requestData.customer_email || typeof requestData.customer_email !== 'string') {
      throw new Error("Valid customer email is required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(requestData.customer_email)) {
      throw new Error("Invalid email format");
    }

    // Sanitize and validate required fields
    if (!requestData.customer_name || typeof requestData.customer_name !== 'string' || requestData.customer_name.length > 200) {
      throw new Error("Valid customer name is required (max 200 characters)");
    }

    if (!requestData.amount || typeof requestData.amount !== 'number' || requestData.amount <= 0) {
      throw new Error("Valid amount is required");
    }

    if (!requestData.offer_title || typeof requestData.offer_title !== 'string' || requestData.offer_title.length > 300) {
      throw new Error("Valid offer title is required (max 300 characters)");
    }

    // Sanitize text fields
    const sanitizedData = {
      ...requestData,
      customer_name: requestData.customer_name.substring(0, 200),
      offer_title: requestData.offer_title.substring(0, 300),
      offer_description: requestData.offer_description?.substring(0, 500) || '',
      transaction_id: requestData.transaction_id?.substring(0, 100) || '',
    };
    console.log("📧 Processing invoice email request:", {
      customer_name: sanitizedData.customer_name,
      customer_email: sanitizedData.customer_email,
      amount: sanitizedData.amount,
      offer_title: sanitizedData.offer_title,
    });

    // Generate invoice number if not provided
    const invoice_number = sanitizedData.invoice_number || 
      `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Render the professional email template
    const emailHtml = await renderAsync(
      React.createElement(ProfessionalInvoiceEmail, {
        customer_name: sanitizedData.customer_name,
        customer_email: sanitizedData.customer_email,
        amount: sanitizedData.amount,
        currency: sanitizedData.currency || 'SAR',
        payment_url: sanitizedData.payment_url,
        transaction_id: sanitizedData.transaction_id || 'N/A',
        invoice_number: invoice_number,
        status: sanitizedData.status || 'pending',
        payment_method: sanitizedData.payment_method || 'Paylink',
        offer_title: sanitizedData.offer_title,
        offer_description: sanitizedData.offer_description,
        original_price: sanitizedData.original_price,
        current_price: sanitizedData.current_price,
        discount: sanitizedData.discount,
      })
    );

    // Send email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "شركة علي صالح الشهري القابضة <noreply@alialshehriholding.com>",
      to: [sanitizedData.customer_email],
      bcc: ["info@alialshehriholding.com"], // Copy to admin
      subject: `فاتورة ضريبية رقم ${invoice_number} - شركة علي صالح الشهري القابضة 🧾`,
      html: emailHtml,
    });

    console.log("✅ Customer email sent successfully:", customerEmailResponse.data?.id);

    // Send admin notification
    const adminNotificationHtml = `
      <div style="font-family: Arial, sans-serif; direction: rtl; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px;">
        <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #1e40af, #3b82f6); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 24px;">📄</span>
            </div>
            <h1 style="color: #1e40af; font-size: 24px; margin: 0; font-weight: bold;">إشعار فاتورة جديدة</h1>
          </div>
          
          <div style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe); padding: 20px; border-radius: 8px; border-right: 4px solid #0ea5e9; margin-bottom: 20px;">
            <h2 style="color: #0c4a6e; margin: 0 0 16px 0; font-size: 18px;">تفاصيل الفاتورة</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px;">
              <div><strong style="color: #0369a1;">رقم الفاتورة:</strong> ${invoice_number}</div>
              <div><strong style="color: #0369a1;">المبلغ:</strong> ${sanitizedData.amount} ${sanitizedData.currency || 'SAR'}</div>
              <div><strong style="color: #0369a1;">العميل:</strong> ${sanitizedData.customer_name}</div>
              <div><strong style="color: #0369a1;">الإيميل:</strong> ${sanitizedData.customer_email}</div>
              <div style="grid-column: 1 / -1;"><strong style="color: #0369a1;">الخدمة:</strong> ${sanitizedData.offer_title}</div>
              <div><strong style="color: #0369a1;">رقم المعاملة:</strong> ${sanitizedData.transaction_id}</div>
              <div><strong style="color: #0369a1;">الحالة:</strong> ${sanitizedData.status}</div>
            </div>
          </div>
          
          <div style="background: linear-gradient(135deg, #fefce8, #fef3c7); padding: 16px; border-radius: 8px; border-right: 4px solid #f59e0b; margin-bottom: 20px;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>💰 تفاصيل السعر:</strong><br>
              السعر الأصلي: ${sanitizedData.original_price} ${sanitizedData.currency || 'SAR'}<br>
              السعر بعد الخصم: ${sanitizedData.current_price} ${sanitizedData.currency || 'SAR'}<br>
              نسبة الخصم: ${sanitizedData.discount}
            </p>
          </div>
          
          <div style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
            📅 ${new Date().toLocaleDateString('ar-SA')} | ⏰ ${new Date().toLocaleTimeString('ar-SA')}
            <br>
            🤖 إشعار تلقائي من نظام إدارة الفواتير
          </div>
        </div>
      </div>
    `;

    const adminEmailResponse = await resend.emails.send({
      from: "نظام الفواتير <system@alialshehriholding.com>",
      to: ["info@alialshehriholding.com"],
      subject: `🔔 فاتورة جديدة رقم ${invoice_number} - ${sanitizedData.customer_name}`,
      html: adminNotificationHtml,
    });

    console.log("✅ Admin notification sent successfully:", adminEmailResponse.data?.id);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "تم إرسال الفاتورة بنجاح",
      invoice_number: invoice_number,
      customer_email_id: customerEmailResponse.data?.id,
      admin_email_id: adminEmailResponse.data?.id,
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
    
  } catch (error: any) {
    console.error("❌ Error sending invoice email:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "حدث خطأ أثناء إرسال الفاتورة",
        details: error.stack,
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