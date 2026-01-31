import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'welcome' | 'order_confirmed' | 'order_updated' | 'payment_received' | 'contract_signed' | 'project_update' | 'invoice_sent' | 'payment_status_update' | 'wallet_deposit';
  customerEmail?: string;
  customerName?: string;
  email?: string;
  customer_name?: string;
  payment_id?: string;
  amount?: number;
  currency?: string;
  old_status?: string;
  new_status?: string;
  payment_method?: string;
  data?: any;
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

const getStatusText = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed': 
    case 'success': 
    case 'paid': 
      return 'مكتملة';
    case 'pending': 
      return 'في الانتظار';
    case 'processing': 
      return 'قيد المعالجة';
    case 'failed': 
      return 'فاشلة';
    case 'rejected': 
      return 'مرفوضة';
    case 'cancelled': 
      return 'ملغية';
    case 'refunded': 
      return 'مسترد';
    default: 
      return status || 'غير محدد';
  }
};

// قوالب الإيميل المالية المتقدمة
const getWalletDepositTemplate = (customerName: string, data: any) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تأكيد شحن المحفظة - شركة علي صالح الشهري القابضة</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5; direction: rtl; }
        .container { max-width: 650px; margin: 0 auto; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #16a34a, #22c55e); color: white; padding: 40px 30px; text-align: center; position: relative; overflow: hidden; }
        .header::before { content: ''; position: absolute; top: -50%; right: -50%; width: 200%; height: 200%; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat; animation: float 20s infinite linear; }
        .content { padding: 40px 30px; }
        .deposit-card { background: linear-gradient(135deg, #ecfdf5, #f0fdf4); border: 2px solid #22c55e; border-radius: 16px; padding: 30px; margin: 25px 0; text-align: center; position: relative; }
        .amount-display { font-size: 32px; font-weight: bold; color: #16a34a; margin: 15px 0; text-shadow: 0 2px 4px rgba(22,163,74,0.2); }
        .transaction-details { background: #f8fafc; border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid #e2e8f0; }
        .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-row:last-child { border-bottom: none; }
        .status-success { background: #dcfce7; color: #166534; padding: 8px 16px; border-radius: 20px; font-weight: bold; display: inline-block; }
        .footer { background: linear-gradient(135deg, #1e293b, #334155); color: white; padding: 30px; text-align: center; }
        .btn { display: inline-block; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; margin: 20px 0; box-shadow: 0 4px 15px rgba(59,130,246,0.3); transition: transform 0.2s ease; }
        .btn:hover { transform: translateY(-2px); }
        @keyframes float { 0% { transform: translateX(-100px); } 100% { transform: translateX(100px); } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💰 تم شحن محفظتكم بنجاح!</h1>
            <p>شركة علي صالح الشهري القابضة</p>
            <p style="opacity: 0.9; margin-top: 10px;">منذ 2016 - تميز وثقة في الخدمات المالية</p>
        </div>
        
        <div class="content">
            <h2 style="color: #1e293b; margin-bottom: 20px;">عزيزي/عزيزتي ${customerName} 👋</h2>
            
            <div class="deposit-card">
                <h3 style="color: #16a34a; margin-bottom: 15px;">✅ تم شحن محفظتكم بنجاح</h3>
                <div class="amount-display">
                    +${data.amount || '0'} ريال سعودي
                </div>
                <div class="status-success">تم بنجاح ✓</div>
            </div>
            
            <div class="transaction-details">
                <h3 style="color: #1e293b; margin-bottom: 20px; text-align: center;">📋 تفاصيل المعاملة</h3>
                <div class="detail-row">
                    <span style="font-weight: 600;">رقم المرجع:</span>
                    <span style="color: #3b82f6; font-family: monospace;">${data.referenceId || 'غير محدد'}</span>
                </div>
                <div class="detail-row">
                    <span style="font-weight: 600;">طريقة الدفع:</span>
                    <span>${data.paymentMethod || 'حوالة بنكية'}</span>
                </div>
                <div class="detail-row">
                    <span style="font-weight: 600;">تاريخ العملية:</span>
                    <span>${new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' })}</span>
                </div>
                <div class="detail-row">
                    <span style="font-weight: 600;">حالة المعاملة:</span>
                    <span style="color: #16a34a; font-weight: bold;">مكتملة ✓</span>
                </div>
            </div>
            
            <div style="background: #eff6ff; border: 1px solid #3b82f6; border-radius: 12px; padding: 25px; margin: 25px 0;">
                <h4 style="color: #1e40af; margin-bottom: 15px;">💡 معلومات مهمة:</h4>
                <ul style="list-style: none; padding: 0;">
                    <li style="margin: 8px 0; color: #1e40af;">• يمكنكم الآن استخدام الرصيد في جميع خدماتنا</li>
                    <li style="margin: 8px 0; color: #1e40af;">• ستصلكم تنبيهات فورية عند كل معاملة</li>
                    <li style="margin: 8px 0; color: #1e40af;">• يمكنكم مراجعة كافة المعاملات من حسابكم</li>
                </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://alialshehriholding.com/wallet" class="btn">
                    💼 عرض محفظتي
                </a>
            </div>
        </div>
        
        <div class="footer">
            <h3 style="margin-bottom: 15px;">شركة علي صالح الشهري القابضة</h3>
            <p>📧 info@alialshehriholding.com | 📱 0555812567</p>
            <p>🌐 alialshehriholding.com</p>
            <p style="margin-top: 15px; opacity: 0.8; font-size: 14px;">
                هذا إشعار تلقائي، يرجى عدم الرد على هذا الإيميل
            </p>
        </div>
    </div>
</body>
</html>
`;

const getWalletDeductionTemplate = (customerName: string, data: any) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إشعار خصم من المحفظة - شركة علي صالح الشهري القابضة</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5; direction: rtl; }
        .container { max-width: 650px; margin: 0 auto; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .deduction-card { background: linear-gradient(135deg, #fef2f2, #fef3f3); border: 2px solid #ef4444; border-radius: 16px; padding: 30px; margin: 25px 0; text-align: center; }
        .amount-display { font-size: 32px; font-weight: bold; color: #dc2626; margin: 15px 0; }
        .transaction-details { background: #f8fafc; border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid #e2e8f0; }
        .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-row:last-child { border-bottom: none; }
        .status-deduction { background: #fee2e2; color: #991b1b; padding: 8px 16px; border-radius: 20px; font-weight: bold; display: inline-block; }
        .footer { background: linear-gradient(135deg, #1e293b, #334155); color: white; padding: 30px; text-align: center; }
        .btn { display: inline-block; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📉 إشعار خصم من المحفظة</h1>
            <p>شركة علي صالح الشهري القابضة</p>
        </div>
        
        <div class="content">
            <h2 style="color: #1e293b; margin-bottom: 20px;">عزيزي/عزيزتي ${customerName} 👋</h2>
            
            <div class="deduction-card">
                <h3 style="color: #dc2626; margin-bottom: 15px;">💳 تم خصم من محفظتكم</h3>
                <div class="amount-display">
                    -${data.amount || '0'} ريال سعودي
                </div>
                <div class="status-deduction">تم الخصم ✓</div>
            </div>
            
            <div class="transaction-details">
                <h3 style="color: #1e293b; margin-bottom: 20px; text-align: center;">📋 تفاصيل المعاملة</h3>
                <div class="detail-row">
                    <span style="font-weight: 600;">رقم المرجع:</span>
                    <span style="color: #3b82f6; font-family: monospace;">${data.referenceId || 'غير محدد'}</span>
                </div>
                <div class="detail-row">
                    <span style="font-weight: 600;">السبب:</span>
                    <span>${data.reason || 'دفع مقابل خدمة'}</span>
                </div>
                <div class="detail-row">
                    <span style="font-weight: 600;">تاريخ العملية:</span>
                    <span>${new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' })}</span>
                </div>
                <div class="detail-row">
                    <span style="font-weight: 600;">الرصيد المتبقي:</span>
                    <span style="color: #16a34a; font-weight: bold;">${data.remainingBalance || '0'} ريال سعودي</span>
                </div>
            </div>
            
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 25px; margin: 25px 0;">
                <h4 style="color: #92400e; margin-bottom: 15px;">ℹ️ تنبيه:</h4>
                <p style="color: #92400e; line-height: 1.6;">
                    ${data.remainingBalance < 100 ? 
                        'رصيدكم أقل من 100 ريال. ننصحكم بإعادة شحن المحفظة لضمان استمرارية الخدمات.' : 
                        'شكراً لاستخدامكم خدماتنا. يمكنكم شحن المحفظة في أي وقت.'
                    }
                </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://alialshehriholding.com/wallet" class="btn">
                    💼 عرض محفظتي
                </a>
            </div>
        </div>
        
        <div class="footer">
            <h3 style="margin-bottom: 15px;">شركة علي صالح الشهري القابضة</h3>
            <p>📧 info@alialshehriholding.com | 📱 0555812567</p>
            <p>🌐 alialshehriholding.com</p>
        </div>
    </div>
</body>
</html>
`;

const getServicePaymentTemplate = (customerName: string, data: any) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إيصال دفع الخدمة - شركة علي صالح الشهري القابضة</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5; direction: rtl; }
        .container { max-width: 650px; margin: 0 auto; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #7c3aed, #8b5cf6); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .payment-card { background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border: 2px solid #0ea5e9; border-radius: 16px; padding: 30px; margin: 25px 0; text-align: center; }
        .amount-display { font-size: 32px; font-weight: bold; color: #0369a1; margin: 15px 0; }
        .service-details { background: #f8fafc; border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid #e2e8f0; }
        .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-row:last-child { border-bottom: none; }
        .status-paid { background: #dcfce7; color: #166534; padding: 8px 16px; border-radius: 20px; font-weight: bold; display: inline-block; }
        .footer { background: linear-gradient(135deg, #1e293b, #334155); color: white; padding: 30px; text-align: center; }
        .btn { display: inline-block; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; margin: 20px 0; }
        .receipt-number { background: #1e293b; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; font-family: monospace; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧾 إيصال دفع الخدمة</h1>
            <p>شركة علي صالح الشهري القابضة</p>
        </div>
        
        <div class="content">
            <h2 style="color: #1e293b; margin-bottom: 20px;">عزيزي/عزيزتي ${customerName} 👋</h2>
            
            <div class="receipt-number">
                <strong>رقم الإيصال: ${data.receiptNumber || data.referenceId || new Date().getTime()}</strong>
            </div>
            
            <div class="payment-card">
                <h3 style="color: #0369a1; margin-bottom: 15px;">✅ تم دفع قيمة الخدمة بنجاح</h3>
                <div class="amount-display">
                    ${data.amount || '0'} ريال سعودي
                </div>
                <div class="status-paid">مدفوع ✓</div>
            </div>
            
            <div class="service-details">
                <h3 style="color: #1e293b; margin-bottom: 20px; text-align: center;">📝 تفاصيل الخدمة</h3>
                <div class="detail-row">
                    <span style="font-weight: 600;">اسم الخدمة:</span>
                    <span>${data.serviceName || 'خدمة تقنية'}</span>
                </div>
                <div class="detail-row">
                    <span style="font-weight: 600;">رقم المرجع:</span>
                    <span style="color: #3b82f6; font-family: monospace;">${data.referenceId || 'غير محدد'}</span>
                </div>
                <div class="detail-row">
                    <span style="font-weight: 600;">طريقة الدفع:</span>
                    <span>${data.paymentMethod || 'المحفظة الإلكترونية'}</span>
                </div>
                <div class="detail-row">
                    <span style="font-weight: 600;">تاريخ الدفع:</span>
                    <span>${new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' })}</span>
                </div>
                <div class="detail-row">
                    <span style="font-weight: 600;">حالة الطلب:</span>
                    <span style="color: #16a34a; font-weight: bold;">قيد التنفيذ 🚀</span>
                </div>
            </div>
            
            <div style="background: #ecfdf5; border: 1px solid #16a34a; border-radius: 12px; padding: 25px; margin: 25px 0;">
                <h4 style="color: #166534; margin-bottom: 15px;">🎯 الخطوات التالية:</h4>
                <ul style="list-style: none; padding: 0;">
                    <li style="margin: 8px 0; color: #166534;">• سيتم البدء في تنفيذ خدمتكم خلال 24 ساعة</li>
                    <li style="margin: 8px 0; color: #166534;">• ستصلكم تحديثات دورية حول حالة المشروع</li>
                    <li style="margin: 8px 0; color: #166534;">• يمكنكم متابعة التقدم من خلال حسابكم</li>
                </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://alialshehriholding.com/my-projects" class="btn">
                    📊 متابعة المشروع
                </a>
            </div>
        </div>
        
        <div class="footer">
            <h3 style="margin-bottom: 15px;">شركة علي صالح الشهري القابضة</h3>
            <p>📧 info@alialshehriholding.com | 📱 0555812567</p>
            <p>🌐 alialshehriholding.com</p>
            <p style="margin-top: 15px; opacity: 0.8; font-size: 14px;">
                احتفظوا بهذا الإيصال لسجلاتكم المالية
            </p>
        </div>
    </div>
</body>
</html>
`;

const getPaymentStatusTemplate = (customerName: string, paymentData: any) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تحديث حالة الدفع - شركة علي صالح الشهري القابضة</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5; direction: rtl; }
        .container { max-width: 650px; margin: 0 auto; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .status-card { border-radius: 16px; padding: 30px; margin: 25px 0; text-align: center; }
        .status-completed { background: linear-gradient(135deg, #ecfdf5, #f0fdf4); border: 2px solid #22c55e; }
        .status-pending { background: linear-gradient(135deg, #fffbeb, #fef3c7); border: 2px solid #f59e0b; }
        .status-failed { background: linear-gradient(135deg, #fef2f2, #fee2e2); border: 2px solid #ef4444; }
        .amount-display { font-size: 28px; font-weight: bold; margin: 15px 0; }
        .status-badge { padding: 10px 20px; border-radius: 25px; font-weight: bold; display: inline-block; margin: 10px 0; }
        .footer { background: linear-gradient(135deg, #1e293b, #334155); color: white; padding: 30px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔄 تحديث حالة الدفع</h1>
            <p>شركة علي صالح الشهري القابضة</p>
        </div>
        
        <div class="content">
            <h2 style="color: #1e293b; margin-bottom: 20px;">عزيزي/عزيزتي ${customerName} 👋</h2>
            
            <div class="status-card status-${paymentData.new_status}">
                <h3 style="margin-bottom: 15px;">📋 تحديث حالة المعاملة</h3>
                <div class="amount-display" style="color: ${paymentData.new_status === 'completed' ? '#16a34a' : paymentData.new_status === 'failed' ? '#dc2626' : '#f59e0b'};">
                    ${paymentData.amount} ${paymentData.currency || 'ريال سعودي'}
                </div>
                <div class="status-badge" style="background: ${paymentData.new_status === 'completed' ? '#dcfce7; color: #166534' : paymentData.new_status === 'failed' ? '#fee2e2; color: #991b1b' : '#fef3c7; color: #92400e'};">
                    ${getStatusText(paymentData.new_status || '')} ${paymentData.new_status === 'completed' ? '✅' : paymentData.new_status === 'failed' ? '❌' : '⏳'}
                </div>
            </div>
            
            <div style="background: #f8fafc; border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid #e2e8f0;">
                <h3 style="color: #1e293b; margin-bottom: 20px; text-align: center;">📊 تفاصيل المعاملة</h3>
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-weight: 600;">رقم المعاملة:</span>
                    <span style="color: #3b82f6; font-family: monospace;">${paymentData.payment_id}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-weight: 600;">طريقة الدفع:</span>
                    <span>${paymentData.payment_method}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px 0;">
                    <span style="font-weight: 600;">تاريخ المعاملة:</span>
                    <span>${new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' })}</span>
                </div>
            </div>

            ${paymentData.new_status === 'completed' ? `
            <div style="background: #ecfdf5; border: 1px solid #16a34a; border-radius: 12px; padding: 25px; margin: 25px 0;">
                <h4 style="color: #166534; margin-bottom: 15px;">✅ تم الدفع بنجاح!</h4>
                <p style="color: #166534; line-height: 1.6;">شكراً لكم على ثقتكم. تم تأكيد المعاملة وسيتم البدء في تنفيذ الخدمة المطلوبة.</p>
            </div>
            ` : ''}
            
            ${paymentData.new_status === 'failed' ? `
            <div style="background: #fef2f2; border: 1px solid #dc2626; border-radius: 12px; padding: 25px; margin: 25px 0;">
                <h4 style="color: #991b1b; margin-bottom: 15px;">❌ فشل في الدفع</h4>
                <p style="color: #991b1b; line-height: 1.6;">نعتذر، لم تتم المعاملة بنجاح. يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني.</p>
            </div>
            ` : ''}
        </div>
        
        <div class="footer">
            <h3 style="margin-bottom: 15px;">شركة علي صالح الشهري القابضة</h3>
            <p>📧 info@alialshehriholding.com | 📱 0555812567</p>
            <p>🌐 alialshehriholding.com</p>
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
    const requestData: NotificationRequest = await req.json();
    console.log("Notification request received:", requestData);

    // Handle different input formats
    const type = requestData.type;
    const customerEmail = requestData.customerEmail || requestData.email;
    const customerName = requestData.customerName || requestData.customer_name;
    const data = requestData.data || requestData;

    if (!customerEmail || !customerName) {
      console.error("Missing required fields:", { customerEmail, customerName });
      return new Response(JSON.stringify({ error: "Missing required email or name" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let html = '';
    let subject = '';
    
    if (type === 'wallet_deposit') {
      html = getWalletDepositTemplate(customerName, data);
      subject = `تأكيد شحن المحفظة - ${data.amount} ريال سعودي`;
    } else if (type === 'wallet_deduction') {
      html = getWalletDeductionTemplate(customerName, data);
      subject = `إشعار خصم من المحفظة - ${data.amount} ريال سعودي`;
    } else if (type === 'service_payment') {
      html = getServicePaymentTemplate(customerName, data);
      subject = `إيصال دفع الخدمة - ${data.serviceName}`;
    } else if (type === 'payment_status_update') {
      html = getPaymentStatusTemplate(customerName, data);
      subject = `تحديث حالة الدفع - ${data.payment_id}`;
    } else if (type === 'custom') {
      // Handle custom notifications
      html = data.content || data.html || '';
      subject = data.subject || 'إشعار من شركة علي صالح الشهري القابضة';
    } else {
      // Handle existing notification types
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
    }

    console.log("Sending email to:", customerEmail);
    
    // إرسال الإيميل للعميل
    const customerEmailResponse = await resend.emails.send({
      from: "شركة علي صالح الشهري القابضة <info@ash-holding.sa>",
      to: [customerEmail],
      bcc: ["info@ash-holding.sa"], // نسخة للإدارة
      subject,
      html,
    });

    console.log("تم إرسال الإشعار للعميل:", customerEmailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "تم إرسال الإشعار بنجاح",
      customerEmail: customerEmailResponse
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