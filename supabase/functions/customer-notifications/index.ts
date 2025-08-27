import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'welcome' | 'order_confirmed' | 'order_updated' | 'payment_received' | 'contract_signed' | 'project_update' | 'invoice_sent';
  customerEmail: string;
  customerName: string;
  data: any;
}

// القوالب المختلفة للإشعارات
const getWelcomeTemplate = (name: string) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>أهلاً وسهلاً - شركة علي صالح الشهري القابضة</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; direction: rtl; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .welcome-card { background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 12px; padding: 30px; margin: 20px 0; text-align: center; }
        .features { background: #f1f5f9; border-radius: 10px; padding: 25px; margin: 25px 0; }
        .footer { background: #1e293b; color: white; padding: 30px; text-align: center; }
        .btn { display: inline-block; background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 أهلاً وسهلاً بك</h1>
            <h2>شركة علي صالح الشهري القابضة</h2>
            <p>منذ 2016 - تميز وابتكار في الحلول التقنية</p>
        </div>
        
        <div class="content">
            <div class="welcome-card">
                <h2 style="color: #1e40af; margin-bottom: 15px;">مرحباً ${name} 👋</h2>
                <p style="font-size: 16px; line-height: 1.8; color: #475569;">
                    نشكركم لانضمامكم إلى عائلة شركة علي صالح الشهري القابضة. 
                    أنتم الآن جزء من مجتمع يضم آلاف العملاء الراضين في المملكة العربية السعودية.
                </p>
            </div>
            
            <div class="features">
                <h3 style="color: #1e293b; margin-bottom: 20px;">✨ ما يمكنكم الاستفادة منه:</h3>
                <ul style="list-style: none; padding: 0;">
                    <li style="margin: 10px 0; padding: 10px; background: white; border-radius: 6px; border-right: 4px solid #3b82f6;">
                        🚀 <strong>حلول تقنية متطورة:</strong> أحدث التقنيات في التطوير والتصميم
                    </li>
                    <li style="margin: 10px 0; padding: 10px; background: white; border-radius: 6px; border-right: 4px solid #10b981;">
                        💼 <strong>خدمات الأعمال:</strong> استشارات وحلول لتطوير أعمالكم
                    </li>
                    <li style="margin: 10px 0; padding: 10px; background: white; border-radius: 6px; border-right: 4px solid #f59e0b;">
                        🎯 <strong>دعم فني مميز:</strong> فريق متخصص متاح 24/7
                    </li>
                    <li style="margin: 10px 0; padding: 10px; background: white; border-radius: 6px; border-right: 4px solid #8b5cf6;">
                        📊 <strong>تقارير دورية:</strong> متابعة مشاريعكم وطلباتكم بشفافية تامة
                    </li>
                </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://alialshehriholding.com/my-projects" class="btn">
                    🔗 دخول إلى حسابي
                </a>
            </div>
        </div>
        
        <div class="footer">
            <h3>شركة علي صالح الشهري القابضة</h3>
            <p>📧 info@alialshehriholding.com | 📱 0555812567</p>
            <p>🌐 alialshehriholding.com</p>
        </div>
    </div>
</body>
</html>
`;

const getOrderUpdateTemplate = (customerName: string, data: any) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تحديث الطلب - شركة علي صالح الشهري القابضة</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; direction: rtl; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .status-card { background: #ecfdf5; border: 2px solid #10b981; border-radius: 12px; padding: 25px; margin: 20px 0; text-align: center; }
        .order-details { background: #f8fafc; border-radius: 10px; padding: 20px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
        .footer { background: #1e293b; color: white; padding: 20px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 تحديث حالة الطلب</h1>
            <p>شركة علي صالح الشهري القابضة</p>
        </div>
        
        <div class="content">
            <h2 style="color: #1e293b; margin-bottom: 20px;">عزيزي/عزيزتي ${customerName}</h2>
            
            <div class="status-card">
                <h3 style="color: #059669; margin-bottom: 10px;">🎯 تم تحديث حالة طلبكم</h3>
                <p style="font-size: 18px; font-weight: bold; color: #1e293b;">
                    الحالة الجديدة: <span style="color: #059669;">${data.newStatus || 'قيد المعالجة'}</span>
                </p>
            </div>
            
            <div class="order-details">
                <h3 style="color: #1e293b; margin-bottom: 15px;">تفاصيل الطلب:</h3>
                <div class="detail-row">
                    <span>رقم الطلب:</span>
                    <span style="font-weight: bold;">${data.orderNumber || 'غير محدد'}</span>
                </div>
                <div class="detail-row">
                    <span>نوع الخدمة:</span>
                    <span>${data.serviceType || 'غير محدد'}</span>
                </div>
                <div class="detail-row">
                    <span>تاريخ التحديث:</span>
                    <span>${new Date().toLocaleDateString('ar-SA')}</span>
                </div>
                ${data.estimatedCompletion ? `
                <div class="detail-row">
                    <span>التاريخ المتوقع للإنجاز:</span>
                    <span style="color: #3b82f6; font-weight: bold;">${data.estimatedCompletion}</span>
                </div>
                ` : ''}
            </div>
            
            ${data.notes ? `
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h4 style="color: #92400e; margin-bottom: 10px;">📝 ملاحظات إضافية:</h4>
                <p style="color: #92400e;">${data.notes}</p>
            </div>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://alialshehriholding.com/my-projects" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px;">
                    🔗 متابعة الطلب
                </a>
            </div>
        </div>
        
        <div class="footer">
            <p>شركة علي صالح الشهري القابضة</p>
            <p>📧 info@alialshehriholding.com | 📱 0555812567</p>
        </div>
    </div>
</body>
</html>
`;

const getProjectUpdateTemplate = (customerName: string, data: any) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تحديث المشروع - شركة علي صالح الشهري القابضة</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; direction: rtl; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #7c3aed, #8b5cf6); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .progress-bar { background: #e5e7eb; border-radius: 20px; height: 20px; margin: 15px 0; overflow: hidden; }
        .progress-fill { background: linear-gradient(90deg, #3b82f6, #8b5cf6); height: 100%; transition: width 0.3s ease; }
        .milestone { background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 15px; margin: 10px 0; }
        .footer { background: #1e293b; color: white; padding: 20px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 تحديث المشروع</h1>
            <p>شركة علي صالح الشهري القابضة</p>
        </div>
        
        <div class="content">
            <h2 style="color: #1e293b; margin-bottom: 20px;">عزيزي/عزيزتي ${customerName}</h2>
            
            <div style="background: #f3e8ff; border: 2px solid #8b5cf6; border-radius: 12px; padding: 25px; margin: 20px 0; text-align: center;">
                <h3 style="color: #7c3aed; margin-bottom: 15px;">📈 تقدم المشروع</h3>
                <div style="font-size: 24px; font-weight: bold; color: #7c3aed;">
                    ${data.projectName || 'مشروعكم'}
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${data.progressPercentage || 0}%;"></div>
                </div>
                <p style="font-size: 18px; color: #7c3aed;">
                    نسبة الإنجاز: <strong>${data.progressPercentage || 0}%</strong>
                </p>
            </div>
            
            ${data.completedTasks && data.completedTasks.length > 0 ? `
            <div style="background: #ecfdf5; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <h4 style="color: #059669; margin-bottom: 15px;">✅ المهام المكتملة:</h4>
                ${data.completedTasks.map((task: string) => `
                    <div class="milestone">
                        <span style="color: #059669;">✓</span> ${task}
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            ${data.nextSteps && data.nextSteps.length > 0 ? `
            <div style="background: #fef3c7; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <h4 style="color: #92400e; margin-bottom: 15px;">🎯 الخطوات القادمة:</h4>
                ${data.nextSteps.map((step: string) => `
                    <div class="milestone" style="background: #fffbeb; border-color: #f59e0b;">
                        <span style="color: #f59e0b;">⏳</span> ${step}
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://alialshehriholding.com/project-tracking" style="background: #7c3aed; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px;">
                    🔗 عرض تفاصيل المشروع
                </a>
            </div>
        </div>
        
        <div class="footer">
            <p>شركة علي صالح الشهري القابضة</p>
            <p>📧 info@alialshehriholding.com | 📱 0555812567</p>
        </div>
    </div>
</body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, customerEmail, customerName, data }: NotificationRequest = await req.json();

    let html = '';
    let subject = '';
    
    switch (type) {
      case 'welcome':
        html = getWelcomeTemplate(customerName);
        subject = `🎉 مرحباً بك في شركة علي صالح الشهري القابضة - ${customerName}`;
        break;
        
      case 'order_confirmed':
        html = getOrderUpdateTemplate(customerName, { ...data, newStatus: 'تم تأكيد الطلب' });
        subject = `✅ تم تأكيد طلبكم رقم ${data.orderNumber || ''} - شركة علي صالح الشهري القابضة`;
        break;
        
      case 'order_updated':
        html = getOrderUpdateTemplate(customerName, data);
        subject = `📋 تحديث حالة الطلب ${data.orderNumber || ''} - شركة علي صالح الشهري القابضة`;
        break;
        
      case 'payment_received':
        html = getOrderUpdateTemplate(customerName, { ...data, newStatus: 'تم استلام الدفعة بنجاح' });
        subject = `💰 تم استلام دفعتكم بنجاح - شركة علي صالح الشهري القابضة`;
        break;
        
      case 'contract_signed':
        html = getOrderUpdateTemplate(customerName, { ...data, newStatus: 'تم توقيع العقد بنجاح' });
        subject = `📝 تم توقيع العقد بنجاح - شركة علي صالح الشهري القابضة`;
        break;
        
      case 'project_update':
        html = getProjectUpdateTemplate(customerName, data);
        subject = `🚀 تحديث مشروعكم: ${data.projectName || ''} - شركة علي صالح الشهري القابضة`;
        break;
        
      case 'invoice_sent':
        html = getOrderUpdateTemplate(customerName, { ...data, newStatus: 'تم إرسال الفاتورة' });
        subject = `🧾 فاتورة جديدة من شركة علي صالح الشهري القابضة`;
        break;
        
      default:
        throw new Error('نوع الإشعار غير مدعوم');
    }

    // إرسال الإيميل للعميل
    const customerEmailResponse = await resend.emails.send({
      from: "شركة علي صالح الشهري القابضة <info@alialshehriholding.com>",
      to: [customerEmail],
      bcc: ["info@alialshehriholding.com"], // نسخة للإدارة
      subject,
      html,
    });

    // إرسال نسخة للإدارة مع تفاصيل إضافية
    const adminNotification = await resend.emails.send({
      from: "نظام الإشعارات <info@alialshehriholding.com>",
      to: ["info@alialshehriholding.com"],
      subject: `[إشعار إداري] ${subject}`,
      html: `
        <div style="direction: rtl; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1e40af;">تم إرسال إشعار للعميل</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>نوع الإشعار:</strong> ${type}</p>
            <p><strong>اسم العميل:</strong> ${customerName}</p>
            <p><strong>إيميل العميل:</strong> ${customerEmail}</p>
            <p><strong>الوقت:</strong> ${new Date().toLocaleString('ar-SA')}</p>
            <p><strong>البيانات:</strong> ${JSON.stringify(data, null, 2)}</p>
          </div>
        </div>
      `,
    });

    console.log("تم إرسال الإشعار للعميل:", customerEmailResponse);
    console.log("تم إرسال نسخة للإدارة:", adminNotification);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "تم إرسال الإشعار بنجاح",
      customerEmail: customerEmailResponse,
      adminNotification
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("خطأ في إرسال الإشعار:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);