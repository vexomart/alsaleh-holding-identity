import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ServiceRequestData {
  serviceType: string;
  title: string;
  description: string;
  requirements?: string;
  budget: string;
  priority: string;
  deadline: string;
  additionalServices: string[];
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    company?: string;
  };
  attachments?: string[];
  userId?: string;
}

const getServiceTypeInArabic = (serviceType: string): string => {
  const serviceTypes = {
    'web-development': 'تطوير المواقع الإلكترونية',
    'mobile-app': 'تطبيقات الجوال',
    'design': 'التصميم والهوية البصرية',
    'business': 'الخدمات التجارية',
    'marketing': 'التسويق الرقمي',
    'other': 'خدمات أخرى'
  };
  return serviceTypes[serviceType as keyof typeof serviceTypes] || serviceType;
};

const getPriorityInArabic = (priority: string): string => {
  const priorities = {
    'low': 'منخفضة',
    'medium': 'متوسطة',
    'high': 'عالية',
    'urgent': 'عاجلة'
  };
  return priorities[priority as keyof typeof priorities] || priority;
};

const getBudgetInArabic = (budget: string): string => {
  const budgets = {
    '5k-10k': '5,000 - 10,000 ريال',
    '10k-25k': '10,000 - 25,000 ريال',
    '25k-50k': '25,000 - 50,000 ريال',
    '50k-100k': '50,000 - 100,000 ريال',
    '100k+': 'أكثر من 100,000 ريال',
    'custom': 'ميزانية مخصصة'
  };
  return budgets[budget as keyof typeof budgets] || budget;
};

const getAdditionalServicesInArabic = (services: string[]): string[] => {
  const serviceMap = {
    'استضافة الموقع': 'استضافة الموقع',
    'نطاق مخصص': 'نطاق مخصص',
    'شهادة SSL': 'شهادة SSL',
    'تحسين محركات البحث': 'تحسين محركات البحث',
    'تدريب الفريق': 'تدريب الفريق',
    'صيانة دورية': 'صيانة دورية',
    'نسخ احتياطية': 'نسخ احتياطية',
    'دعم فني مستمر': 'دعم فني مستمر'
  };
  return services.map(service => serviceMap[service as keyof typeof serviceMap] || service);
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: ServiceRequestData = await req.json();
    
    // حفظ طلب الخدمة في قاعدة البيانات
    const { data: serviceRequest, error: dbError } = await supabase
      .from('service_requests')
      .insert([
        {
          user_id: requestData.userId,
          service_type: requestData.serviceType,
          title: requestData.title,
          description: requestData.description,
          requirements: requestData.requirements,
          budget: requestData.budget,
          priority: requestData.priority,
          deadline: requestData.deadline,
          additional_services: requestData.additionalServices,
          customer_name: requestData.customerInfo.name,
          customer_email: requestData.customerInfo.email,
          customer_phone: requestData.customerInfo.phone,
          customer_company: requestData.customerInfo.company,
          attachments: requestData.attachments || [],
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save service request to database');
    }

    const currentTime = new Date().toLocaleString('ar-SA', { 
      timeZone: 'Asia/Riyadh',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // إرسال إيميل للشركة
    const companyEmailResponse = await resend.emails.send({
      from: "نظام طلبات الخدمة <noreply@alialshehriholding.com>",
      to: ["info@alialshehriholding.com"],
      subject: `طلب خدمة جديد - ${getServiceTypeInArabic(requestData.serviceType)}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>طلب خدمة جديد</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">طلب خدمة جديد</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">تم استلام طلب خدمة جديد</p>
            </div>

            <!-- Content -->
            <div style="padding: 30px;">
              
              <!-- معلومات العميل -->
              <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #667eea;">
                <h2 style="color: #667eea; margin: 0 0 15px 0; font-size: 20px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">معلومات العميل</h2>
                <div style="display: grid; gap: 10px;">
                  <p style="margin: 5px 0;"><strong style="color: #495057;">الاسم:</strong> ${requestData.customerInfo.name}</p>
                  <p style="margin: 5px 0;"><strong style="color: #495057;">البريد الإلكتروني:</strong> ${requestData.customerInfo.email}</p>
                  <p style="margin: 5px 0;"><strong style="color: #495057;">رقم الهاتف:</strong> ${requestData.customerInfo.phone}</p>
                  ${requestData.customerInfo.company ? `<p style="margin: 5px 0;"><strong style="color: #495057;">الشركة:</strong> ${requestData.customerInfo.company}</p>` : ''}
                </div>
              </div>

              <!-- تفاصيل المشروع -->
              <div style="background-color: #fff3cd; border-radius: 8px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
                <h2 style="color: #856404; margin: 0 0 15px 0; font-size: 20px; border-bottom: 2px solid #ffeaa7; padding-bottom: 10px;">تفاصيل المشروع</h2>
                <div style="display: grid; gap: 10px;">
                  <p style="margin: 5px 0;"><strong style="color: #856404;">نوع الخدمة:</strong> ${getServiceTypeInArabic(requestData.serviceType)}</p>
                  <p style="margin: 5px 0;"><strong style="color: #856404;">عنوان المشروع:</strong> ${requestData.title}</p>
                  <p style="margin: 5px 0;"><strong style="color: #856404;">الوصف:</strong></p>
                  <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #ffeaa7; margin-top: 5px;">
                    ${requestData.description.split('\n').map(line => `<p style="margin: 5px 0;">${line}</p>`).join('')}
                  </div>
                </div>
              </div>

              <!-- مواصفات المشروع -->
              <div style="background-color: #d1ecf1; border-radius: 8px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #17a2b8;">
                <h2 style="color: #0c5460; margin: 0 0 15px 0; font-size: 20px; border-bottom: 2px solid #bee5eb; padding-bottom: 10px;">مواصفات المشروع</h2>
                <div style="display: grid; gap: 10px;">
                  <p style="margin: 5px 0;"><strong style="color: #0c5460;">الميزانية المتوقعة:</strong> ${getBudgetInArabic(requestData.budget)}</p>
                  <p style="margin: 5px 0;"><strong style="color: #0c5460;">الأولوية:</strong> 
                    <span style="background-color: ${requestData.priority === 'urgent' ? '#dc3545' : requestData.priority === 'high' ? '#fd7e14' : requestData.priority === 'medium' ? '#ffc107' : '#28a745'}; 
                                 color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                      ${getPriorityInArabic(requestData.priority)}
                    </span>
                  </p>
                  <p style="margin: 5px 0;"><strong style="color: #0c5460;">الموعد المطلوب:</strong> ${new Date(requestData.deadline).toLocaleDateString('ar-SA')}</p>
                </div>
              </div>

              <!-- الخدمات الإضافية -->
              ${requestData.additionalServices.length > 0 ? `
              <div style="background-color: #d4edda; border-radius: 8px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #28a745;">
                <h2 style="color: #155724; margin: 0 0 15px 0; font-size: 20px; border-bottom: 2px solid #c3e6cb; padding-bottom: 10px;">الخدمات الإضافية</h2>
                <ul style="margin: 0; padding-right: 20px;">
                  ${getAdditionalServicesInArabic(requestData.additionalServices).map(service => 
                    `<li style="margin: 8px 0; color: #155724;">${service}</li>`
                  ).join('')}
                </ul>
              </div>
              ` : ''}

              <!-- المرفقات -->
              ${requestData.attachments && requestData.attachments.length > 0 ? `
              <div style="background-color: #f8d7da; border-radius: 8px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #dc3545;">
                <h2 style="color: #721c24; margin: 0 0 15px 0; font-size: 20px; border-bottom: 2px solid #f1b0b7; padding-bottom: 10px;">المرفقات</h2>
                <ul style="margin: 0; padding-right: 20px;">
                  ${requestData.attachments.map(attachment => 
                    `<li style="margin: 8px 0; color: #721c24;">📎 ${attachment}</li>`
                  ).join('')}
                </ul>
              </div>
              ` : ''}

              <!-- Footer -->
              <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin-top: 30px;">
                <p style="margin: 0; color: #6c757d; font-size: 14px;">تاريخ الطلب: ${currentTime}</p>
                <p style="margin: 5px 0 0 0; color: #6c757d; font-size: 12px;">هذا الإيميل تم إرساله تلقائياً من نظام إدارة طلبات الخدمة</p>
              </div>

            </div>
          </div>
        </body>
        </html>
      `,
    });

    // إرسال إيميل تأكيد للعميل
    const customerEmailResponse = await resend.emails.send({
      from: "آل الشهري القابضة <noreply@alialshehriholding.com>",
      to: [requestData.customerInfo.email],
      subject: "تأكيد استلام طلب الخدمة - آل الشهري القابضة",
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>تأكيد طلب الخدمة</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">✅ تم استلام طلبك بنجاح</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">شكراً لك على ثقتك في خدماتنا</p>
            </div>

            <!-- Content -->
            <div style="padding: 30px;">
              
              <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #28a745; margin: 0 0 10px 0;">أهلاً ${requestData.customerInfo.name}</h2>
                <p style="margin: 0; font-size: 16px; color: #6c757d;">تم استلام طلب الخدمة الخاص بك بنجاح</p>
              </div>

              <!-- ملخص الطلب -->
              <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #28a745;">
                <h3 style="color: #155724; margin: 0 0 15px 0; font-size: 18px;">ملخص طلبك:</h3>
                <div style="display: grid; gap: 10px;">
                  <p style="margin: 5px 0;"><strong>نوع الخدمة:</strong> ${getServiceTypeInArabic(requestData.serviceType)}</p>
                  <p style="margin: 5px 0;"><strong>عنوان المشروع:</strong> ${requestData.title}</p>
                  <p style="margin: 5px 0;"><strong>الميزانية المتوقعة:</strong> ${getBudgetInArabic(requestData.budget)}</p>
                  <p style="margin: 5px 0;"><strong>الموعد المطلوب:</strong> ${new Date(requestData.deadline).toLocaleDateString('ar-SA')}</p>
                </div>
              </div>

              <!-- الخطوات التالية -->
              <div style="background-color: #fff3cd; border-radius: 8px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
                <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 18px;">الخطوات التالية:</h3>
                <ul style="margin: 0; padding-right: 20px; color: #856404;">
                  <li style="margin: 10px 0;">سيقوم فريقنا بدراسة طلبك خلال 24 ساعة</li>
                  <li style="margin: 10px 0;">سنتواصل معك لمناقشة التفاصيل والمتطلبات</li>
                  <li style="margin: 10px 0;">سنرسل لك عرض سعر مفصل ومدة التنفيذ المتوقعة</li>
                  <li style="margin: 10px 0;">يمكنك متابعة حالة طلبك من خلال لوحة التحكم الخاصة بك</li>
                </ul>
              </div>

              <!-- معلومات التواصل -->
              <div style="background-color: #d1ecf1; border-radius: 8px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #17a2b8;">
                <h3 style="color: #0c5460; margin: 0 0 15px 0; font-size: 18px;">هل تحتاج مساعدة؟</h3>
                <p style="margin: 0; color: #0c5460;">
                  يمكنك التواصل معنا في أي وقت:<br>
                  📧 البريد الإلكتروني: info@alialshehriholding.com<br>
                  📱 الهاتف: +966123456789<br>
                  💬 الدردشة المباشرة على الموقع
                </p>
              </div>

              <!-- Footer -->
              <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin-top: 30px;">
                <p style="margin: 0; color: #6c757d; font-size: 14px;">
                  <strong>آل الشهري القابضة</strong><br>
                  شريكك في التميز والابتكار
                </p>
                <p style="margin: 10px 0 0 0; color: #6c757d; font-size: 12px;">
                  تاريخ الطلب: ${currentTime}<br>
                  رقم مرجعي: SR${Date.now()}
                </p>
              </div>

            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Service request emails sent successfully");
    console.log("Service request saved to database:", serviceRequest);
    console.log("Company email:", companyEmailResponse);
    console.log("Customer email:", customerEmailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        message: "تم إرسال الطلب وحفظه بنجاح",
        serviceRequestId: serviceRequest.id,
        requestNumber: serviceRequest.request_number,
        companyEmailId: companyEmailResponse.data?.id,
        customerEmailId: customerEmailResponse.data?.id,
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
    console.error("Error sending service request emails:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);