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
      "detailed": "استشارة تفصيلية (90 دقيقة - 500 ريال)", 
      "strategic": "جلسة استراتيجية (3 ساعات - 1500 ريال)",
      "workshop": "ورشة عمل جماعية (يوم كامل - 3000 ريال)"
    };

    const consultationTypePrices: Record<string, string> = {
      "initial": "مجاناً",
      "detailed": "500 ريال", 
      "strategic": "1500 ريال",
      "workshop": "3000 ريال"
    };

    const serviceName = serviceNames[requestData.service] || requestData.service;
    const consultationTypeName = consultationTypeNames[requestData.consultationType] || requestData.consultationType;

    console.log("Service name:", serviceName);
    console.log("Consultation type:", consultationTypeName);

    // Create current date for Arabic formatting
    const currentDate = new Date();
    const arabicDate = currentDate.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Admin email template
    const adminEmailTemplate = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>طلب استشارة جديد</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f8fafc; direction: rtl; }
            .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: bold; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; }
            .content { padding: 30px; }
            .info-card { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 15px 0; border-right: 4px solid #667eea; }
            .info-row { display: flex; justify-content: space-between; align-items: center; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
            .info-row:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #4a5568; }
            .value { color: #2d3748; background: #edf2f7; padding: 5px 10px; border-radius: 4px; }
            .priority { background: #fed7d7; color: #c53030; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; }
            .footer { background: #2d3748; color: white; padding: 20px; text-align: center; }
            .contact-info { background: #e6fffa; border: 1px solid #81e6d9; border-radius: 8px; padding: 15px; margin: 20px 0; }
            .action-btn { background: #667eea; color: white; padding: 12px 25px; border-radius: 6px; text-decoration: none; display: inline-block; margin: 10px 5px; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔔 طلب استشارة جديد</h1>
                <p>تم استلام طلب استشارة جديد من العميل</p>
                <span class="priority">عاجل - يتطلب المتابعة</span>
            </div>
            
            <div class="content">
                <div class="info-card">
                    <h3 style="color: #667eea; margin-top: 0;">📋 تفاصيل العميل</h3>
                    <div class="info-row">
                        <span class="label">👤 الاسم الكامل:</span>
                        <span class="value">${requestData.name}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">📧 البريد الإلكتروني:</span>
                        <span class="value">${requestData.email}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">📱 رقم الهاتف:</span>
                        <span class="value">${requestData.phone || 'غير محدد'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">🏢 الشركة:</span>
                        <span class="value">${requestData.company || 'غير محدد'}</span>
                    </div>
                </div>

                <div class="info-card">
                    <h3 style="color: #667eea; margin-top: 0;">🎯 تفاصيل الاستشارة</h3>
                    <div class="info-row">
                        <span class="label">🔧 نوع الخدمة:</span>
                        <span class="value">${serviceName}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">⏰ نوع الاستشارة:</span>
                        <span class="value">${consultationTypeName}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">💰 السعر:</span>
                        <span class="value">${consultationTypePrices[requestData.consultationType]}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">📅 تاريخ الطلب:</span>
                        <span class="value">${arabicDate}</span>
                    </div>
                </div>

                ${requestData.message ? `
                <div class="info-card">
                    <h3 style="color: #667eea; margin-top: 0;">📝 تفاصيل إضافية</h3>
                    <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0;">
                        ${requestData.message}
                    </div>
                </div>
                ` : ''}

                <div class="contact-info">
                    <h4 style="margin-top: 0; color: #2d3748;">🚀 خطوات المتابعة المطلوبة:</h4>
                    <ul style="margin: 10px 0; padding-right: 20px;">
                        <li>التواصل مع العميل خلال 24 ساعة</li>
                        <li>تحديد موعد الاستشارة المناسب</li>
                        <li>إرسال رابط الاجتماع (Zoom/Teams)</li>
                        <li>تحضير المواد اللازمة للاستشارة</li>
                    </ul>
                </div>

                <div style="text-align: center; margin: 25px 0;">
                    <a href="mailto:${requestData.email}" class="action-btn">📧 رد على العميل</a>
                    <a href="tel:${requestData.phone || ''}" class="action-btn">📞 اتصال مباشر</a>
                    <a href="https://wa.me/${requestData.phone?.replace(/[^0-9]/g, '') || ''}" class="action-btn">💬 واتساب</a>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>ASH HOLDING</strong> - نظام إدارة الاستشارات</p>
                <p style="font-size: 12px; opacity: 0.8;">هذا إيميل تلقائي من نظام الاستشارات</p>
            </div>
        </div>
    </body>
    </html>
    `;

    // Client confirmation email template
    const clientEmailTemplate = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تأكيد طلب الاستشارة</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f8fafc; direction: rtl; }
            .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: bold; }
            .checkmark { width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 30px; }
            .content { padding: 30px; }
            .welcome-box { background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%); border-radius: 10px; padding: 25px; margin: 20px 0; text-align: center; }
            .info-card { background: #f7fafc; border-radius: 8px; padding: 20px; margin: 15px 0; border-right: 4px solid #48bb78; }
            .info-row { display: flex; justify-content: space-between; align-items: center; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
            .info-row:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #4a5568; }
            .value { color: #2d3748; }
            .next-steps { background: #e6fffa; border: 1px solid #81e6d9; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .step { display: flex; align-items: center; margin: 10px 0; }
            .step-number { background: #48bb78; color: white; width: 25px; height: 25px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-left: 10px; font-weight: bold; font-size: 12px; }
            .footer { background: #2d3748; color: white; padding: 20px; text-align: center; }
            .contact-card { background: #fff5f5; border: 1px solid #fed7d7; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .highlight { background: #fef5e7; color: #744210; padding: 10px 15px; border-radius: 6px; margin: 15px 0; font-weight: bold; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="checkmark">✅</div>
                <h1>تم استلام طلبك بنجاح!</h1>
                <p>شكراً لك على اختيار ASH HOLDING</p>
            </div>
            
            <div class="content">
                <div class="welcome-box">
                    <h2 style="color: #2d3748; margin-top: 0;">مرحباً ${requestData.name} 🎉</h2>
                    <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
                        نحن سعداء جداً باختيارك لخدماتنا الاستشارية. تم استلام طلبك وسيتم التواصل معك قريباً من قبل أحد خبرائنا المتخصصين.
                    </p>
                </div>

                <div class="info-card">
                    <h3 style="color: #48bb78; margin-top: 0;">📋 ملخص طلبك</h3>
                    <div class="info-row">
                        <span class="label">🔧 نوع الخدمة:</span>
                        <span class="value">${serviceName}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">⏰ نوع الاستشارة:</span>
                        <span class="value">${consultationTypeName}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">💰 السعر:</span>
                        <span class="value">${consultationTypePrices[requestData.consultationType]}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">📅 تاريخ الطلب:</span>
                        <span class="value">${arabicDate}</span>
                    </div>
                </div>

                ${requestData.consultationType === 'initial' ? `
                <div class="highlight">
                    🎁 مبروك! استشارتك الأولية مجانية تماماً (30 دقيقة كاملة مع الخبير)
                </div>
                ` : ''}

                <div class="next-steps">
                    <h3 style="color: #2d3748; margin-top: 0;">🚀 الخطوات التالية:</h3>
                    <div class="step">
                        <div class="step-number">1</div>
                        <span>سيتم التواصل معك خلال 24 ساعة من فريقنا المتخصص</span>
                    </div>
                    <div class="step">
                        <div class="step-number">2</div>
                        <span>تحديد الموعد المناسب لك للاستشارة</span>
                    </div>
                    <div class="step">
                        <div class="step-number">3</div>
                        <span>إرسال رابط الاجتماع الإلكتروني (Zoom)</span>
                    </div>
                    <div class="step">
                        <div class="step-number">4</div>
                        <span>بدء جلسة الاستشارة مع الخبير المختص</span>
                    </div>
                </div>

                <div class="contact-card">
                    <h4 style="margin-top: 0; color: #c53030;">📞 تحتاج مساعدة فورية؟</h4>
                    <p style="margin: 5px 0;"><strong>واتساب:</strong> +966 XXX XXX XXX</p>
                    <p style="margin: 5px 0;"><strong>إيميل:</strong> info@alialshehriholding.com</p>
                    <p style="margin: 5px 0;"><strong>أوقات العمل:</strong> السبت - الخميس (9 ص - 6 م)</p>
                </div>

                <div style="background: #f0fff4; border: 1px solid #9ae6b4; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                    <h4 style="color: #2f855a; margin-top: 0;">🌟 لماذا اخترت الأفضل؟</h4>
                    <div style="display: flex; justify-content: space-around; flex-wrap: wrap; margin-top: 15px;">
                        <div style="text-align: center; margin: 10px;">
                            <div style="font-size: 24px;">🏆</div>
                            <strong>+15000 عميل</strong>
                        </div>
                        <div style="text-align: center; margin: 10px;">
                            <div style="font-size: 24px;">⭐</div>
                            <strong>تقييم 4.9/5</strong>
                        </div>
                        <div style="text-align: center; margin: 10px;">
                            <div style="font-size: 24px;">✅</div>
                            <strong>ضمان الجودة</strong>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <h3 style="margin: 0 0 10px 0;">ASH HOLDING</h3>
                <p style="margin: 5px 0; opacity: 0.9;">رؤية مستقبلية في عالم التقنية والإعلام</p>
                <p style="font-size: 12px; opacity: 0.7; margin: 15px 0 0 0;">
                    © 2024 ASH HOLDING. جميع الحقوق محفوظة.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

    console.log("Sending enhanced emails...");

    // Send admin notification email
    const adminEmailResponse = await resend.emails.send({
      from: "ASH HOLDING Consultations <info@alialshehriholding.com>",
      to: ["info@alialshehriholding.com"],
      subject: `🔔 طلب استشارة عاجل - ${serviceName} من ${requestData.name}`,
      html: adminEmailTemplate,
    });

    console.log("Admin email response:", adminEmailResponse);

    if (adminEmailResponse.error) {
      console.error("Admin email error:", adminEmailResponse.error);
      throw new Error(`Failed to send admin email: ${adminEmailResponse.error.message}`);
    }

    // Send client confirmation email
    const clientEmailResponse = await resend.emails.send({
      from: "ASH HOLDING <info@alialshehriholding.com>",
      to: [requestData.email],
      subject: `✅ تأكيد طلب الاستشارة - ASH HOLDING`,
      html: clientEmailTemplate,
      replyTo: "info@alialshehriholding.com"
    });

    console.log("Client email response:", clientEmailResponse);

    if (clientEmailResponse.error) {
      console.error("Client email error:", clientEmailResponse.error);
      // Don't throw error for client email, as admin email was successful
      console.log("Client email failed but continuing...");
    }

    console.log("Enhanced emails sent successfully!");

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