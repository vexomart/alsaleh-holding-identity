import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-client-ip, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ServicePageRequest {
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceName: string;
  serviceType: string;
  serviceOption?: string;
  description?: string;
  selectedFeatures?: string[];
  clientIp?: string;
  userAgent?: string;
  pageUrl?: string;
  timestamp?: string;
  // Honeypot field - should be empty
  website?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  
  try {
    const requestData: ServicePageRequest = await req.json();
    
    // Log incoming request
    console.log(`[${new Date().toISOString()}] Service page request received:`, {
      name: requestData.name,
      email: requestData.email,
      serviceName: requestData.serviceName,
      serviceType: requestData.serviceType
    });

    // ========== SPAM PREVENTION ==========
    // Check honeypot field - if filled, it's likely a bot
    if (requestData.website && requestData.website.trim() !== '') {
      console.log(`[SPAM BLOCKED] Honeypot triggered for email: ${requestData.email}`);
      // Return success to not alert spammers, but don't process
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "تم إرسال طلبك بنجاح" 
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // ========== INPUT VALIDATION ==========
    const errors: string[] = [];
    
    // Name validation
    if (!requestData.name || requestData.name.trim().length < 2) {
      errors.push("الاسم مطلوب (حرفان على الأقل)");
    }
    if (requestData.name && requestData.name.length > 100) {
      errors.push("الاسم طويل جداً");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!requestData.email || !emailRegex.test(requestData.email)) {
      errors.push("البريد الإلكتروني غير صحيح");
    }
    if (requestData.email && requestData.email.length > 255) {
      errors.push("البريد الإلكتروني طويل جداً");
    }

    // Phone validation (Saudi format)
    const phoneRegex = /^(05|5|9665|00966)\d{8}$/;
    const cleanPhone = requestData.phone?.replace(/[\s\-+]/g, '') || '';
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      errors.push("رقم الجوال غير صحيح");
    }

    // Return validation errors
    if (errors.length > 0) {
      console.log(`[VALIDATION FAILED] Errors:`, errors);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "بيانات غير صحيحة",
          validationErrors: errors 
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // ========== SANITIZE INPUTS ==========
    const sanitize = (str: string | undefined): string => {
      if (!str) return '';
      return str
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim();
    };

    const sanitizedData = {
      name: sanitize(requestData.name),
      email: sanitize(requestData.email).toLowerCase(),
      phone: sanitize(requestData.phone),
      company: sanitize(requestData.company),
      serviceName: sanitize(requestData.serviceName),
      serviceType: sanitize(requestData.serviceType),
      serviceOption: sanitize(requestData.serviceOption),
      description: sanitize(requestData.description),
      selectedFeatures: requestData.selectedFeatures?.map(f => sanitize(f)) || [],
    };

    // ========== GENERATE REFERENCE NUMBER ==========
    const referenceNumber = `SR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const currentTime = new Date().toLocaleString('ar-SA', { 
      timeZone: 'Asia/Riyadh',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // ========== SEND EMAIL TO COMPANY ==========
    const companyEmailResponse = await resend.emails.send({
      from: "ASH HOLDING <info@ash-holding.sa>",
      to: ["info@ash-holding.sa"],
      subject: `طلب خدمة جديد - ${sanitizedData.serviceName} | ${referenceNumber}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; line-height: 1.8; color: #1e293b; background-color: #f1f5f9; margin: 0; padding: 20px;">
          <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 650px; margin: 0 auto;">
            <tr>
              <td>
                <!-- Header -->
                <table cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: 16px 16px 0 0;">
                  <tr>
                    <td style="padding: 35px; text-align: center;">
                      <h1 style="color: white; margin: 0; font-size: 26px; font-weight: bold;">🔔 طلب خدمة جديد</h1>
                      <p style="color: rgba(255,255,255,0.9); margin: 12px 0 0 0; font-size: 18px;">${sanitizedData.serviceName}</p>
                      <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0; font-size: 14px;">الرقم المرجعي: ${referenceNumber}</p>
                    </td>
                  </tr>
                </table>
                
                <!-- Content -->
                <table cellpadding="0" cellspacing="0" width="100%" style="background: white; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 30px;">
                      
                      <!-- Client Info -->
                      <table cellpadding="0" cellspacing="0" width="100%" style="background: #fef3c7; border-radius: 12px; margin-bottom: 25px; border-right: 5px solid #f59e0b;">
                        <tr>
                          <td style="padding: 20px;">
                            <h2 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">👤 معلومات العميل</h2>
                            <table cellpadding="8" cellspacing="0" width="100%">
                              <tr>
                                <td style="color: #78350f; width: 120px;"><strong>الاسم:</strong></td>
                                <td style="color: #451a03;">${sanitizedData.name}</td>
                              </tr>
                              <tr>
                                <td style="color: #78350f;"><strong>البريد:</strong></td>
                                <td style="color: #451a03;"><a href="mailto:${sanitizedData.email}" style="color: #d97706;">${sanitizedData.email}</a></td>
                              </tr>
                              <tr>
                                <td style="color: #78350f;"><strong>الجوال:</strong></td>
                                <td style="color: #451a03;"><a href="tel:${sanitizedData.phone}" style="color: #d97706;">${sanitizedData.phone}</a></td>
                              </tr>
                              ${sanitizedData.company ? `
                              <tr>
                                <td style="color: #78350f;"><strong>الشركة:</strong></td>
                                <td style="color: #451a03;">${sanitizedData.company}</td>
                              </tr>
                              ` : ''}
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- Service Details -->
                      <table cellpadding="0" cellspacing="0" width="100%" style="background: #dbeafe; border-radius: 12px; margin-bottom: 25px; border-right: 5px solid #3b82f6;">
                        <tr>
                          <td style="padding: 20px;">
                            <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">📋 تفاصيل الطلب</h2>
                            <table cellpadding="8" cellspacing="0" width="100%">
                              <tr>
                                <td style="color: #1e3a8a; width: 120px;"><strong>الخدمة:</strong></td>
                                <td style="color: #172554;">${sanitizedData.serviceName}</td>
                              </tr>
                              <tr>
                                <td style="color: #1e3a8a;"><strong>القسم:</strong></td>
                                <td style="color: #172554;">${sanitizedData.serviceType}</td>
                              </tr>
                              ${sanitizedData.serviceOption ? `
                              <tr>
                                <td style="color: #1e3a8a;"><strong>النوع:</strong></td>
                                <td style="color: #172554;">${sanitizedData.serviceOption}</td>
                              </tr>
                              ` : ''}
                            </table>
                          </td>
                        </tr>
                      </table>

                      ${sanitizedData.description ? `
                      <!-- Description -->
                      <table cellpadding="0" cellspacing="0" width="100%" style="background: #f0fdf4; border-radius: 12px; margin-bottom: 25px; border-right: 5px solid #22c55e;">
                        <tr>
                          <td style="padding: 20px;">
                            <h2 style="color: #166534; margin: 0 0 15px 0; font-size: 18px;">📝 وصف المشروع</h2>
                            <p style="color: #14532d; margin: 0; line-height: 1.8; white-space: pre-wrap;">${sanitizedData.description}</p>
                          </td>
                        </tr>
                      </table>
                      ` : ''}

                      ${sanitizedData.selectedFeatures.length > 0 ? `
                      <!-- Features -->
                      <table cellpadding="0" cellspacing="0" width="100%" style="background: #fae8ff; border-radius: 12px; margin-bottom: 25px; border-right: 5px solid #a855f7;">
                        <tr>
                          <td style="padding: 20px;">
                            <h2 style="color: #7e22ce; margin: 0 0 15px 0; font-size: 18px;">✨ الخدمات الإضافية المطلوبة</h2>
                            <ul style="margin: 0; padding-right: 20px; color: #581c87;">
                              ${sanitizedData.selectedFeatures.map(f => `<li style="margin: 8px 0;">${f}</li>`).join('')}
                            </ul>
                          </td>
                        </tr>
                      </table>
                      ` : ''}

                      <!-- Metadata -->
                      <table cellpadding="0" cellspacing="0" width="100%" style="background: #f8fafc; border-radius: 12px;">
                        <tr>
                          <td style="padding: 20px; text-align: center;">
                            <p style="color: #64748b; margin: 0; font-size: 13px;">
                              📅 تاريخ الطلب: ${currentTime}<br>
                              🌐 المصدر: ${requestData.pageUrl || 'غير محدد'}<br>
                              🖥️ IP: ${requestData.clientIp || 'غير محدد'}
                            </p>
                          </td>
                        </tr>
                      </table>

                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (companyEmailResponse.error) {
      console.error(`[EMAIL ERROR] Company email failed:`, companyEmailResponse.error);
      throw new Error(`فشل إرسال البريد: ${companyEmailResponse.error.message}`);
    }

    console.log(`[EMAIL SUCCESS] Company email sent: ${companyEmailResponse.data?.id}`);

    // ========== SEND CONFIRMATION TO CLIENT ==========
    const clientEmailResponse = await resend.emails.send({
      from: "ASH HOLDING <info@ash-holding.sa>",
      to: [sanitizedData.email],
      subject: `✅ تم استلام طلبك بنجاح | ${referenceNumber}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; line-height: 1.8; color: #1e293b; background-color: #f1f5f9; margin: 0; padding: 20px;">
          <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto;">
            <tr>
              <td>
                <!-- Header -->
                <table cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 16px 16px 0 0;">
                  <tr>
                    <td style="padding: 35px; text-align: center;">
                      <h1 style="color: white; margin: 0; font-size: 26px;">✅ تم استلام طلبك بنجاح</h1>
                      <p style="color: rgba(255,255,255,0.9); margin: 12px 0 0 0; font-size: 16px;">شكراً لك ${sanitizedData.name}</p>
                    </td>
                  </tr>
                </table>
                
                <!-- Content -->
                <table cellpadding="0" cellspacing="0" width="100%" style="background: white; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 30px;">
                      
                      <!-- Reference Number -->
                      <table cellpadding="0" cellspacing="0" width="100%" style="background: #f0fdf4; border-radius: 12px; margin-bottom: 25px; border: 2px dashed #22c55e;">
                        <tr>
                          <td style="padding: 20px; text-align: center;">
                            <p style="color: #166534; margin: 0; font-size: 14px;">الرقم المرجعي لطلبك</p>
                            <p style="color: #15803d; margin: 8px 0 0 0; font-size: 24px; font-weight: bold; letter-spacing: 2px;">${referenceNumber}</p>
                          </td>
                        </tr>
                      </table>

                      <!-- Summary -->
                      <table cellpadding="0" cellspacing="0" width="100%" style="background: #f8fafc; border-radius: 12px; margin-bottom: 25px;">
                        <tr>
                          <td style="padding: 20px;">
                            <h2 style="color: #334155; margin: 0 0 15px 0; font-size: 18px;">📋 ملخص طلبك</h2>
                            <table cellpadding="8" cellspacing="0" width="100%">
                              <tr>
                                <td style="color: #475569; width: 100px;"><strong>الخدمة:</strong></td>
                                <td style="color: #1e293b;">${sanitizedData.serviceName}</td>
                              </tr>
                              ${sanitizedData.serviceOption ? `
                              <tr>
                                <td style="color: #475569;"><strong>النوع:</strong></td>
                                <td style="color: #1e293b;">${sanitizedData.serviceOption}</td>
                              </tr>
                              ` : ''}
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- Next Steps -->
                      <table cellpadding="0" cellspacing="0" width="100%" style="background: #fef3c7; border-radius: 12px; margin-bottom: 25px;">
                        <tr>
                          <td style="padding: 20px;">
                            <h2 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">⏭️ الخطوات التالية</h2>
                            <ul style="margin: 0; padding-right: 20px; color: #78350f;">
                              <li style="margin: 10px 0;">سيقوم فريقنا بدراسة طلبك خلال 24 ساعة</li>
                              <li style="margin: 10px 0;">سنتواصل معك لمناقشة التفاصيل</li>
                              <li style="margin: 10px 0;">سنرسل لك عرض سعر مفصل</li>
                            </ul>
                          </td>
                        </tr>
                      </table>

                      <!-- Contact -->
                      <table cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 12px;">
                        <tr>
                          <td style="padding: 25px; text-align: center;">
                            <h3 style="color: white; margin: 0 0 15px 0; font-size: 18px;">📞 هل تحتاج مساعدة؟</h3>
                            <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 15px;">
                              البريد: info@ash-holding.sa<br>
                              الهاتف: 0555812567
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Footer -->
                      <table cellpadding="0" cellspacing="0" width="100%" style="margin-top: 25px;">
                        <tr>
                          <td style="text-align: center;">
                            <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                              ${currentTime}<br>
                              شركة علي صالح الشهري القابضة
                            </p>
                          </td>
                        </tr>
                      </table>

                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (clientEmailResponse.error) {
      console.warn(`[EMAIL WARNING] Client confirmation email failed:`, clientEmailResponse.error);
      // Don't throw - company email was sent successfully
    } else {
      console.log(`[EMAIL SUCCESS] Client email sent: ${clientEmailResponse.data?.id}`);
    }

    const processingTime = Date.now() - startTime;
    console.log(`[SUCCESS] Request processed in ${processingTime}ms | Ref: ${referenceNumber}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال طلبك بنجاح",
        referenceNumber: referenceNumber,
        companyEmailId: companyEmailResponse.data?.id,
        clientEmailId: clientEmailResponse.data?.id,
        processingTime: processingTime
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );

  } catch (error: any) {
    const processingTime = Date.now() - startTime;
    console.error(`[ERROR] Request failed after ${processingTime}ms:`, error.message);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.",
        details: error.message
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
};

serve(handler);
