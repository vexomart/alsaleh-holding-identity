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

    // Admin email template - 100% RTL Arabic
    const adminEmailTemplate = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>طلب استشارة جديد</title>
        <style>
            * { box-sizing: border-box; }
            body { 
                font-family: 'Cairo', 'Segoe UI', 'Arial', sans-serif; 
                margin: 0; 
                padding: 0; 
                background: #f8fafc; 
                direction: rtl; 
                text-align: right;
                line-height: 1.6;
            }
            .container { 
                max-width: 600px; 
                margin: 20px auto; 
                background: white; 
                border-radius: 12px; 
                overflow: hidden; 
                box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
            }
            .header { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 30px; 
                text-align: center; 
            }
            .header h1 { 
                margin: 0; 
                font-size: 28px; 
                font-weight: bold; 
                margin-bottom: 10px;
            }
            .header p { 
                margin: 10px 0 0 0; 
                opacity: 0.9; 
                font-size: 16px;
            }
            .content { 
                padding: 30px; 
                direction: rtl; 
                text-align: right;
            }
            .info-card { 
                background: #f8fafc; 
                border-radius: 8px; 
                padding: 20px; 
                margin: 15px 0; 
                border-right: 4px solid #667eea; 
                direction: rtl;
            }
            .info-row { 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                margin: 12px 0; 
                padding: 12px 0; 
                border-bottom: 1px solid #e2e8f0; 
                direction: rtl;
            }
            .info-row:last-child { border-bottom: none; }
            .label { 
                font-weight: bold; 
                color: #4a5568; 
                margin-left: 10px;
                text-align: right;
            }
            .value { 
                color: #2d3748; 
                background: #edf2f7; 
                padding: 8px 12px; 
                border-radius: 6px; 
                text-align: right;
                flex: 1;
                margin-right: 10px;
            }
            .priority { 
                background: #fed7d7; 
                color: #c53030; 
                padding: 8px 20px; 
                border-radius: 25px; 
                font-size: 14px; 
                font-weight: bold; 
                margin-top: 15px;
            }
            .footer { 
                background: #2d3748; 
                color: white; 
                padding: 25px; 
                text-align: center; 
            }
            .contact-info { 
                background: #e6fffa; 
                border: 1px solid #81e6d9; 
                border-radius: 8px; 
                padding: 20px; 
                margin: 20px 0; 
                direction: rtl;
                text-align: right;
            }
            .action-btn { 
                background: #667eea; 
                color: white; 
                padding: 12px 25px; 
                border-radius: 6px; 
                text-decoration: none; 
                display: inline-block; 
                margin: 10px 5px; 
                font-weight: bold; 
                direction: rtl;
                text-align: center;
            }
            .action-btn:hover { background: #5a67d8; }
            .message-box {
                background: white; 
                padding: 20px; 
                border-radius: 8px; 
                border: 1px solid #e2e8f0;
                margin: 15px 0;
                direction: rtl;
                text-align: right;
                line-height: 1.8;
            }
            h3 { 
                color: #667eea; 
                margin-top: 0; 
                text-align: right;
                font-size: 18px;
            }
            ul { 
                margin: 15px 0; 
                padding-right: 25px; 
                text-align: right;
            }
            li { 
                margin: 8px 0; 
                text-align: right;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔔 طلب استشارة جديد</h1>
                <p>تم استلام طلب استشارة جديد من العميل</p>
                <span class="priority">عاجل - يتطلب المتابعة خلال 24 ساعة</span>
            </div>
            
            <div class="content">
                <div class="info-card">
                    <h3>📋 تفاصيل العميل</h3>
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
                    <h3>🎯 تفاصيل الاستشارة المطلوبة</h3>
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
                    <h3>📝 رسالة العميل والتفاصيل الإضافية</h3>
                    <div class="message-box">
                        ${requestData.message}
                    </div>
                </div>
                ` : ''}

                <div class="contact-info">
                    <h4 style="margin-top: 0; color: #2d3748; text-align: right;">🚀 الإجراءات المطلوبة للمتابعة:</h4>
                    <ul style="margin: 15px 0; text-align: right;">
                        <li>التواصل مع العميل خلال 24 ساعة كحد أقصى</li>
                        <li>تحديد موعد الاستشارة المناسب للعميل</li>
                        <li>إرسال رابط الاجتماع الإلكتروني (Zoom/Google Meet)</li>
                        <li>تحضير المواد والعروض التقديمية اللازمة</li>
                        <li>إرسال تأكيد نهائي للموعد قبل 24 ساعة</li>
                    </ul>
                </div>

                <div style="text-align: center; margin: 30px 0; direction: rtl;">
                    <a href="mailto:${requestData.email}" class="action-btn">📧 رد على العميل بالإيميل</a>
                    <a href="tel:${requestData.phone || ''}" class="action-btn">📞 اتصال مباشر</a>
                    <a href="https://wa.me/966555812567?text=السلام عليكم ورحمة الله وبركاته%0A%0Aمرحباً ${encodeURIComponent(requestData.name)}%0A%0Aتحية طيبة من فريق ASH HOLDING%0A%0Aتم استلام طلب الاستشارة الخاص بك في ${encodeURIComponent(serviceName)} ونحن سعداء جداً بثقتكم فينا.%0A%0Aسنقوم بالتواصل معكم خلال 24 ساعة لتحديد الموعد المناسب.%0A%0Aشكراً لاختياركم ASH HOLDING" class="action-btn">💬 واتساب العميل</a>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>ASH HOLDING</strong> - نظام إدارة طلبات الاستشارات</p>
                <p style="font-size: 14px; opacity: 0.8; margin-top: 10px;">هذا إيميل تلقائي من نظام إدارة الاستشارات</p>
                <p style="font-size: 12px; opacity: 0.6; margin-top: 5px;">© 2024 ASH HOLDING. جميع الحقوق محفوظة</p>
            </div>
        </div>
    </body>
    </html>
    `;

    // Client confirmation email template - 100% RTL Arabic
    const clientEmailTemplate = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تأكيد طلب الاستشارة - ASH HOLDING</title>
        <style>
            * { box-sizing: border-box; }
            body { 
                font-family: 'Cairo', 'Segoe UI', 'Arial', sans-serif; 
                margin: 0; 
                padding: 0; 
                background: #f8fafc; 
                direction: rtl; 
                text-align: right;
                line-height: 1.7;
            }
            .container { 
                max-width: 600px; 
                margin: 20px auto; 
                background: white; 
                border-radius: 12px; 
                overflow: hidden; 
                box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
            }
            .header { 
                background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); 
                color: white; 
                padding: 35px; 
                text-align: center; 
            }
            .header h1 { 
                margin: 0; 
                font-size: 28px; 
                font-weight: bold; 
                margin-bottom: 10px;
            }
            .checkmark { 
                width: 70px; 
                height: 70px; 
                background: rgba(255,255,255,0.2); 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                margin: 0 auto 20px; 
                font-size: 35px; 
            }
            .content { 
                padding: 35px; 
                direction: rtl; 
                text-align: right;
            }
            .welcome-box { 
                background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%); 
                border-radius: 12px; 
                padding: 30px; 
                margin: 25px 0; 
                text-align: center; 
                direction: rtl;
            }
            .info-card { 
                background: #f7fafc; 
                border-radius: 10px; 
                padding: 25px; 
                margin: 20px 0; 
                border-right: 4px solid #48bb78; 
                direction: rtl;
            }
            .info-row { 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                margin: 12px 0; 
                padding: 10px 0; 
                border-bottom: 1px solid #e2e8f0; 
                direction: rtl;
            }
            .info-row:last-child { border-bottom: none; }
            .label { 
                font-weight: bold; 
                color: #4a5568; 
                margin-left: 15px;
                text-align: right;
            }
            .value { 
                color: #2d3748; 
                text-align: right;
                flex: 1;
            }
            .next-steps { 
                background: #e6fffa; 
                border: 1px solid #81e6d9; 
                border-radius: 10px; 
                padding: 25px; 
                margin: 25px 0; 
                direction: rtl;
            }
            .step { 
                display: flex; 
                align-items: center; 
                margin: 15px 0; 
                direction: rtl;
                text-align: right;
            }
            .step-number { 
                background: #48bb78; 
                color: white; 
                width: 30px; 
                height: 30px; 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                margin-left: 15px; 
                font-weight: bold; 
                font-size: 14px; 
                flex-shrink: 0;
            }
            .footer { 
                background: #2d3748; 
                color: white; 
                padding: 25px; 
                text-align: center; 
            }
            .contact-card { 
                background: #fff5f5; 
                border: 1px solid #fed7d7; 
                border-radius: 10px; 
                padding: 25px; 
                margin: 25px 0; 
                direction: rtl;
                text-align: right;
            }
            .highlight { 
                background: #fef5e7; 
                color: #744210; 
                padding: 15px 20px; 
                border-radius: 8px; 
                margin: 20px 0; 
                font-weight: bold; 
                text-align: center; 
                font-size: 16px;
            }
            .stats-box {
                background: #f0fff4; 
                border: 1px solid #9ae6b4; 
                border-radius: 10px; 
                padding: 25px; 
                margin: 25px 0; 
                text-align: center; 
                direction: rtl;
            }
            .stat-item {
                display: inline-block;
                text-align: center; 
                margin: 15px 20px;
                vertical-align: top;
            }
            .stat-emoji {
                font-size: 28px;
                display: block;
                margin-bottom: 8px;
            }
            h2, h3, h4 { 
                text-align: right; 
                direction: rtl;
            }
            p { 
                text-align: right; 
                direction: rtl;
                line-height: 1.8;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="checkmark">✅</div>
                <h1>تم استلام طلبك بنجاح!</h1>
                <p style="font-size: 18px;">شكراً لك على اختيار ASH HOLDING</p>
            </div>
            
            <div class="content">
                <div class="welcome-box">
                    <h2 style="color: #2d3748; margin-top: 0; font-size: 24px;">مرحباً بك ${requestData.name} 🎉</h2>
                    <p style="color: #4a5568; font-size: 17px; line-height: 1.8; margin: 15px 0;">
                        نحن في ASH HOLDING سعداء جداً باختيارك لخدماتنا الاستشارية المتخصصة. 
                        تم استلام طلبك بنجاح وسيتم التواصل معك قريباً من قبل أحد خبرائنا المعتمدين.
                    </p>
                </div>

                <div class="info-card">
                    <h3 style="color: #48bb78; margin-top: 0; font-size: 20px;">📋 ملخص طلب الاستشارة</h3>
                    <div class="info-row">
                        <span class="label">🔧 نوع الخدمة المطلوبة:</span>
                        <span class="value">${serviceName}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">⏰ نوع الاستشارة:</span>
                        <span class="value">${consultationTypeName}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">💰 قيمة الاستشارة:</span>
                        <span class="value">${consultationTypePrices[requestData.consultationType]}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">📅 تاريخ تقديم الطلب:</span>
                        <span class="value">${arabicDate}</span>
                    </div>
                </div>

                ${requestData.consultationType === 'initial' ? `
                <div class="highlight">
                    🎁 مبروك! استشارتك الأولية مجانية تماماً لمدة 30 دقيقة كاملة مع خبير متخصص
                </div>
                ` : ''}

                <div class="next-steps">
                    <h3 style="color: #2d3748; margin-top: 0; font-size: 20px;">🚀 الخطوات القادمة:</h3>
                    <div class="step">
                        <div class="step-number">1</div>
                        <span>سيتم التواصل معك خلال 24 ساعة من فريقنا المتخصص لتحديد الموعد المناسب</span>
                    </div>
                    <div class="step">
                        <div class="step-number">2</div>
                        <span>اختيار التوقيت الأنسب لك لجلسة الاستشارة (صباحاً أو مساءً)</span>
                    </div>
                    <div class="step">
                        <div class="step-number">3</div>
                        <span>إرسال رابط الاجتماع الإلكتروني عبر الإيميل أو الواتساب</span>
                    </div>
                    <div class="step">
                        <div class="step-number">4</div>
                        <span>بدء جلسة الاستشارة مع الخبير المختص في الموعد المحدد</span>
                    </div>
                </div>

                <div class="contact-card">
                    <h4 style="margin-top: 0; color: #c53030; font-size: 18px;">📞 تحتاج للتواصل الفوري؟</h4>
                    <p style="margin: 8px 0; font-size: 16px;"><strong>📱 واتساب:</strong> 0555812567</p>
                    <p style="margin: 8px 0; font-size: 16px;"><strong>📧 إيميل:</strong> info@alialshehriholding.com</p>
                    <p style="margin: 8px 0; font-size: 16px;"><strong>⏰ أوقات العمل:</strong> السبت - الخميس من 9 صباحاً - 6 مساءً</p>
                    <p style="margin: 15px 0 5px 0; font-size: 15px; color: #4a5568;">
                        💬 <a href="https://wa.me/966555812567?text=السلام عليكم، أريد الاستفسار عن طلب الاستشارة" style="color: #48bb78; text-decoration: none; font-weight: bold;">اضغط هنا للتواصل المباشر عبر الواتساب</a>
                    </p>
                </div>

                <div class="stats-box">
                    <h4 style="color: #2f855a; margin-top: 0; font-size: 20px;">🌟 لماذا اخترت الأفضل في السوق؟</h4>
                    <div style="margin-top: 20px;">
                        <div class="stat-item">
                            <span class="stat-emoji">🏆</span>
                            <strong style="display: block; font-size: 16px;">أكثر من 15000 عميل</strong>
                            <span style="color: #4a5568; font-size: 14px;">راضي عن خدماتنا</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-emoji">⭐</span>
                            <strong style="display: block; font-size: 16px;">تقييم 4.9 من 5</strong>
                            <span style="color: #4a5568; font-size: 14px;">نجوم من العملاء</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-emoji">✅</span>
                            <strong style="display: block; font-size: 16px;">ضمان الجودة 100%</strong>
                            <span style="color: #4a5568; font-size: 14px;">أو استرداد المبلغ</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <h3 style="margin: 0 0 15px 0; font-size: 22px;">ASH HOLDING</h3>
                <p style="margin: 8px 0; opacity: 0.9; font-size: 16px;">رؤية مستقبلية في عالم التقنية والإعلام</p>
                <p style="margin: 8px 0; opacity: 0.8; font-size: 14px;">نبني جسوراً نحو الابتكار والتميز العالمي</p>
                <p style="font-size: 12px; opacity: 0.7; margin: 20px 0 0 0;">
                    © 2024 ASH HOLDING. جميع الحقوق محفوظة.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

    console.log("إرسال الإيميلات المحدثة...");

    // Send admin notification email
    const adminEmailResponse = await resend.emails.send({
      from: "ASH HOLDING - نظام الاستشارات <info@ash-holding.sa>",
      to: ["info@ash-holding.sa"],
      subject: `🔔 طلب استشارة عاجل - ${serviceName} من ${requestData.name}`,
      html: adminEmailTemplate,
    });

    console.log("استجابة إيميل الإدارة:", adminEmailResponse);

    if (adminEmailResponse.error) {
      console.error("خطأ في إيميل الإدارة:", adminEmailResponse.error);
      throw new Error(`فشل في إرسال إيميل الإدارة: ${adminEmailResponse.error.message}`);
    }

    // Send client confirmation email
    const clientEmailResponse = await resend.emails.send({
      from: "ASH HOLDING <info@ash-holding.sa>",
      to: [requestData.email],
      subject: `✅ تأكيد طلب الاستشارة - ASH HOLDING`,
      html: clientEmailTemplate,
      replyTo: "info@ash-holding.sa"
    });

    console.log("استجابة إيميل العميل:", clientEmailResponse);

    if (clientEmailResponse.error) {
      console.error("خطأ في إيميل العميل:", clientEmailResponse.error);
      // لا نرمي خطأ لإيميل العميل، حيث أن إيميل الإدارة نجح
      console.log("فشل إيميل العميل ولكن نكمل...");
    }

    console.log("تم إرسال الإيميلات المحدثة بنجاح!");

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