import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  console.log("=== Consultation booking request START ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    console.log("Method not allowed:", req.method);
    return new Response(
      JSON.stringify({ error: "Method not allowed" }), 
      { 
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }

  try {
    console.log("Starting POST request processing...");
    
    // Read request body
    const bodyText = await req.text();
    console.log("Raw body:", bodyText);
    
    let requestData;
    try {
      requestData = JSON.parse(bodyText);
      console.log("Parsed data:", {
        name: requestData.name,
        email: requestData.email,
        service: requestData.service,
        consultationType: requestData.consultationType
      });
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      throw new Error("Invalid JSON format");
    }

    // Validate required fields
    if (!requestData.name || !requestData.email || !requestData.service || !requestData.consultationType) {
      const missingFields = [];
      if (!requestData.name) missingFields.push("name");
      if (!requestData.email) missingFields.push("email");
      if (!requestData.service) missingFields.push("service");
      if (!requestData.consultationType) missingFields.push("consultationType");
      
      console.error("Missing required fields:", missingFields);
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Check RESEND_API_KEY
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not found");
      throw new Error("Email service not configured properly");
    }

    // Import and setup Resend
    console.log("Importing Resend...");
    const { Resend } = await import("npm:resend@2.0.0");
    const resend = new Resend(resendApiKey);
    console.log("Resend initialized successfully");

    // Get service names
    const serviceNames: Record<string, string> = {
      "business-consulting": "الاستشارات التجارية",
      "digital-transformation": "التحول الرقمي", 
      "financial-planning": "التخطيط المالي",
      "strategic-consulting": "الاستشارات الاستراتيجية",
      "risk-management": "إدارة المخاطر",
      "team-development": "تطوير الفرق"
    };

    const consultationTypeNames: Record<string, string> = {
      "initial": "استشارة أولية (مجانية - 30 دقيقة)",
      "detailed": "استشارة تفصيلية (90 دقيقة)", 
      "strategic": "جلسة استراتيجية (3 ساعات)",
      "workshop": "ورشة عمل جماعية (يوم كامل)"
    };

    const serviceName = serviceNames[requestData.service] || requestData.service;
    const consultationTypeName = consultationTypeNames[requestData.consultationType] || requestData.consultationType;

    console.log("Service name:", serviceName);
    console.log("Consultation type:", consultationTypeName);

    // Try to send a simple test email first
    console.log("Attempting to send test email...");
    try {
      const testEmailResponse = await resend.emails.send({
        from: "Ali AlShehri Holding <info@alialshehriholding.com>",
        to: ["info@alialshehriholding.com"],
        bcc: ["info@alialshehriholding.com"],
        subject: "Test - طلب استشارة جديد",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; direction: rtl;">
            <h1>طلب استشارة جديد</h1>
            <p><strong>الاسم:</strong> ${requestData.name}</p>
            <p><strong>البريد الإلكتروني:</strong> ${requestData.email}</p>
            <p><strong>الخدمة:</strong> ${serviceName}</p>
            <p><strong>نوع الاستشارة:</strong> ${consultationTypeName}</p>
          </div>
        `,
      });

      console.log("Test email response:", testEmailResponse);
      
      if (testEmailResponse.error) {
        console.error("Test email error:", testEmailResponse.error);
        throw new Error(`Email sending failed: ${testEmailResponse.error.message}`);
      }

      console.log("Test email sent successfully!");

    } catch (emailError) {
      console.error("Email sending error:", emailError);
      throw new Error(`Failed to send email: ${emailError.message}`);
    }

    console.log("=== Request completed successfully ===");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال طلب الاستشارة بنجاح" 
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
    console.error("=== ERROR in consultation booking ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("=== END ERROR ===");
    
    return new Response(
      JSON.stringify({ 
        error: "حدث خطأ في إرسال الطلب",
        details: error.message,
        success: false
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
});