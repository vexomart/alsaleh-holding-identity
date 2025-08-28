import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WalletNotificationRequest {
  type: 'deposit' | 'withdrawal' | 'verification' | 'low_balance' | 'security_alert';
  customer_email: string;
  customer_name: string;
  data: {
    amount?: number;
    new_balance?: number;
    old_balance?: number;
    transaction_id?: string;
    reference_id?: string;
    description?: string;
    reason?: string;
    verification_code?: string;
    requires_approval?: boolean;
    security_action?: string;
    ip_address?: string;
    device_info?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const notification: WalletNotificationRequest = await req.json();
    console.log("Processing wallet notification:", notification);

    const { type, customer_email, customer_name, data } = notification;

    if (!customer_email || !customer_name || !type) {
      throw new Error("Missing required fields: customer_email, customer_name, or type");
    }

    let subject = '';
    let htmlContent = '';

    switch (type) {
      case 'deposit':
        subject = `إيداع رصيد - ${data.amount} ريال`;
        htmlContent = getDepositTemplate(customer_name, data);
        break;
      
      case 'withdrawal':
        subject = `خصم رصيد - ${data.amount} ريال`;
        htmlContent = getWithdrawalTemplate(customer_name, data);
        break;
      
      case 'verification':
        subject = `رمز التحقق من العملية المالية`;
        htmlContent = getVerificationTemplate(customer_name, data);
        break;
      
      case 'low_balance':
        subject = `تنبيه: انخفاض رصيد المحفظة`;
        htmlContent = getLowBalanceTemplate(customer_name, data);
        break;
      
      case 'security_alert':
        subject = `تنبيه أمني: نشاط مشبوه على المحفظة`;
        htmlContent = getSecurityAlertTemplate(customer_name, data);
        break;
      
      default:
        throw new Error(`Unsupported notification type: ${type}`);
    }

    const emailResponse = await resend.emails.send({
      from: "محفظة الشهري الرقمية <noreply@alsaleh-holding.com>",
      to: [customer_email],
      bcc: ["admin@alsaleh-holding.com"],
      subject: subject,
      html: htmlContent,
    });

    console.log("Wallet email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in wallet-email-notifications function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function getDepositTemplate(customerName: string, data: any): string {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>إيداع رصيد</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #16a085, #2ecc71); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { padding: 30px; }
            .amount-box { background: linear-gradient(135deg, #e8f5e8, #d4edda); border: 2px solid #28a745; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center; }
            .amount { font-size: 36px; font-weight: bold; color: #28a745; margin-bottom: 10px; }
            .balance-info { background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin: 15px 0; }
            .transaction-details { margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
            .footer { background-color: #2c3e50; color: white; padding: 20px; text-align: center; font-size: 14px; }
            .security-note { background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 15px 0; }
            .icon { width: 24px; height: 24px; margin-left: 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>💰 تم إيداع رصيد بنجاح</h1>
                <p>مرحباً ${customerName}</p>
            </div>
            
            <div class="content">
                <div class="amount-box">
                    <div class="amount">+ ${data.amount?.toLocaleString('ar-SA')} ريال</div>
                    <p>تم إضافة هذا المبلغ إلى محفظتك الرقمية</p>
                </div>

                <div class="balance-info">
                    <h3>💼 معلومات الرصيد</h3>
                    <div class="detail-row">
                        <span>الرصيد السابق:</span>
                        <span>${((data.new_balance || 0) - (data.amount || 0)).toLocaleString('ar-SA')} ريال</span>
                    </div>
                    <div class="detail-row">
                        <span>المبلغ المضاف:</span>
                        <span style="color: #28a745; font-weight: bold;">+ ${data.amount?.toLocaleString('ar-SA')} ريال</span>
                    </div>
                    <div class="detail-row" style="border-bottom: 2px solid #28a745; font-weight: bold;">
                        <span>الرصيد الحالي:</span>
                        <span style="color: #28a745;">${data.new_balance?.toLocaleString('ar-SA')} ريال</span>
                    </div>
                </div>

                <div class="transaction-details">
                    <h3>📋 تفاصيل المعاملة</h3>
                    <div class="detail-row">
                        <span>رقم المعاملة:</span>
                        <span style="font-family: monospace;">${data.transaction_id || 'غير متوفر'}</span>
                    </div>
                    <div class="detail-row">
                        <span>المرجع:</span>
                        <span style="font-family: monospace;">${data.reference_id || 'غير متوفر'}</span>
                    </div>
                    <div class="detail-row">
                        <span>السبب:</span>
                        <span>${data.description || 'إيداع رصيد'}</span>
                    </div>
                    <div class="detail-row">
                        <span>التاريخ والوقت:</span>
                        <span>${new Date().toLocaleString('ar-SA')}</span>
                    </div>
                </div>

                ${data.requires_approval ? `
                <div class="security-note">
                    <h4>⏳ يتطلب موافقة</h4>
                    <p>هذا الإيداع يتطلب موافقتك. يرجى تسجيل الدخول إلى حسابك لتأكيد العملية.</p>
                </div>
                ` : ''}

                <div class="security-note">
                    <h4>🔒 ملاحظة أمنية</h4>
                    <p>إذا لم تقم بطلب هذا الإيداع، يرجى الاتصال بفريق الدعم فوراً على الرقم: 966123456789</p>
                </div>
            </div>

            <div class="footer">
                <p><strong>شركة علي صالح محمد الشهري</strong></p>
                <p>المحفظة الرقمية الآمنة | دعم العملاء: support@alsaleh-holding.com</p>
                <p>هذا الإيميل تلقائي، يرجى عدم الرد عليه</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function getWithdrawalTemplate(customerName: string, data: any): string {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>خصم رصيد</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { padding: 30px; }
            .amount-box { background: linear-gradient(135deg, #fdf2f2, #f8d7da); border: 2px solid #dc3545; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center; }
            .amount { font-size: 36px; font-weight: bold; color: #dc3545; margin-bottom: 10px; }
            .balance-info { background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin: 15px 0; }
            .transaction-details { margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
            .footer { background-color: #2c3e50; color: white; padding: 20px; text-align: center; font-size: 14px; }
            .security-note { background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 15px 0; }
            .alert-note { background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; padding: 15px; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>💸 تم خصم رصيد</h1>
                <p>مرحباً ${customerName}</p>
            </div>
            
            <div class="content">
                <div class="amount-box">
                    <div class="amount">- ${data.amount?.toLocaleString('ar-SA')} ريال</div>
                    <p>تم خصم هذا المبلغ من محفظتك الرقمية</p>
                </div>

                <div class="balance-info">
                    <h3>💼 معلومات الرصيد</h3>
                    <div class="detail-row">
                        <span>الرصيد السابق:</span>
                        <span>${((data.new_balance || 0) + (data.amount || 0)).toLocaleString('ar-SA')} ريال</span>
                    </div>
                    <div class="detail-row">
                        <span>المبلغ المخصوم:</span>
                        <span style="color: #dc3545; font-weight: bold;">- ${data.amount?.toLocaleString('ar-SA')} ريال</span>
                    </div>
                    <div class="detail-row" style="border-bottom: 2px solid #dc3545; font-weight: bold;">
                        <span>الرصيد الحالي:</span>
                        <span style="color: ${(data.new_balance || 0) > 0 ? '#28a745' : '#dc3545'};">${data.new_balance?.toLocaleString('ar-SA')} ريال</span>
                    </div>
                </div>

                <div class="transaction-details">
                    <h3>📋 تفاصيل المعاملة</h3>
                    <div class="detail-row">
                        <span>رقم المعاملة:</span>
                        <span style="font-family: monospace;">${data.transaction_id || 'غير متوفر'}</span>
                    </div>
                    <div class="detail-row">
                        <span>المرجع:</span>
                        <span style="font-family: monospace;">${data.reference_id || 'غير متوفر'}</span>
                    </div>
                    <div class="detail-row">
                        <span>السبب:</span>
                        <span>${data.reason || data.description || 'خصم رصيد'}</span>
                    </div>
                    <div class="detail-row">
                        <span>التاريخ والوقت:</span>
                        <span>${new Date().toLocaleString('ar-SA')}</span>
                    </div>
                </div>

                ${data.requires_approval ? `
                <div class="security-note">
                    <h4>⏳ يتطلب موافقة</h4>
                    <p>هذا الخصم يتطلب موافقتك. يرجى تسجيل الدخول إلى حسابك لتأكيد العملية.</p>
                </div>
                ` : ''}

                <div class="alert-note">
                    <h4>⚠️ تنبيه مهم</h4>
                    <p>إذا لم تقم بطلب هذا الخصم أو لم تكن على علم به، يرجى الاتصال بفريق الدعم فوراً على الرقم: 966123456789</p>
                </div>
            </div>

            <div class="footer">
                <p><strong>شركة علي صالح محمد الشهري</strong></p>
                <p>المحفظة الرقمية الآمنة | دعم العملاء: support@alsaleh-holding.com</p>
                <p>هذا الإيميل تلقائي، يرجى عدم الرد عليه</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function getVerificationTemplate(customerName: string, data: any): string {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>رمز التحقق</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { padding: 30px; text-align: center; }
            .verification-code { background: linear-gradient(135deg, #e3f2fd, #bbdefb); border: 3px solid #2196f3; border-radius: 15px; padding: 30px; margin: 20px 0; }
            .code { font-size: 48px; font-weight: bold; color: #1976d2; font-family: monospace; letter-spacing: 8px; margin: 15px 0; }
            .footer { background-color: #2c3e50; color: white; padding: 20px; text-align: center; font-size: 14px; }
            .security-note { background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 15px 0; text-align: right; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 رمز التحقق من العملية</h1>
                <p>مرحباً ${customerName}</p>
            </div>
            
            <div class="content">
                <p style="font-size: 18px; margin-bottom: 20px;">لتأكيد العملية المالية، يرجى استخدام رمز التحقق التالي:</p>
                
                <div class="verification-code">
                    <p style="margin: 0; font-size: 16px; color: #666;">رمز التحقق</p>
                    <div class="code">${data.verification_code}</div>
                    <p style="margin: 0; font-size: 14px; color: #666;">صالح لمدة 10 دقائق</p>
                </div>

                <div style="margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px; text-align: right;">
                    <h4>💰 تفاصيل العملية:</h4>
                    <p><strong>النوع:</strong> ${data.description || 'عملية مالية'}</p>
                    <p><strong>المبلغ:</strong> ${data.amount?.toLocaleString('ar-SA')} ريال</p>
                    <p><strong>التوقيت:</strong> ${new Date().toLocaleString('ar-SA')}</p>
                </div>

                <div class="security-note">
                    <h4>🔒 ملاحظات أمنية مهمة:</h4>
                    <ul style="text-align: right; padding-right: 20px;">
                        <li>لا تشارك هذا الرمز مع أي شخص</li>
                        <li>الرمز صالح لمدة 10 دقائق فقط</li>
                        <li>إذا لم تطلب هذا الرمز، تجاهل هذه الرسالة</li>
                        <li>اتصل بالدعم فوراً إذا كنت تشك في نشاط مشبوه</li>
                    </ul>
                </div>
            </div>

            <div class="footer">
                <p><strong>شركة علي صالح محمد الشهري</strong></p>
                <p>المحفظة الرقمية الآمنة | دعم العملاء: support@alsaleh-holding.com</p>
                <p>خط الطوارئ الأمني: 966123456789</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function getLowBalanceTemplate(customerName: string, data: any): string {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تنبيه انخفاض الرصيد</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #f39c12, #e67e22); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { padding: 30px; }
            .balance-alert { background: linear-gradient(135deg, #fff3cd, #ffeaa7); border: 2px solid #f39c12; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center; }
            .current-balance { font-size: 36px; font-weight: bold; color: #e67e22; margin-bottom: 10px; }
            .footer { background-color: #2c3e50; color: white; padding: 20px; text-align: center; font-size: 14px; }
            .action-button { background-color: #3498db; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; display: inline-block; margin: 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>⚠️ تنبيه انخفاض الرصيد</h1>
                <p>مرحباً ${customerName}</p>
            </div>
            
            <div class="content">
                <div class="balance-alert">
                    <h3>💰 رصيدك الحالي</h3>
                    <div class="current-balance">${data.new_balance?.toLocaleString('ar-SA')} ريال</div>
                    <p>رصيدك منخفض، ننصح بإعادة شحن المحفظة</p>
                </div>

                <p style="text-align: center; font-size: 18px;">
                    لتجنب انقطاع الخدمات، يرجى إضافة رصيد إلى محفظتك
                </p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="#" class="action-button">إضافة رصيد الآن</a>
                </div>
            </div>

            <div class="footer">
                <p><strong>شركة علي صالح محمد الشهري</strong></p>
                <p>المحفظة الرقمية الآمنة | دعم العملاء: support@alsaleh-holding.com</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function getSecurityAlertTemplate(customerName: string, data: any): string {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تنبيه أمني</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { padding: 30px; }
            .alert-box { background: linear-gradient(135deg, #fdf2f2, #f8d7da); border: 2px solid #dc3545; border-radius: 10px; padding: 20px; margin: 20px 0; }
            .footer { background-color: #2c3e50; color: white; padding: 20px; text-align: center; font-size: 14px; }
            .urgent-action { background-color: #dc3545; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; display: inline-block; margin: 10px; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚨 تنبيه أمني عاجل</h1>
                <p>مرحباً ${customerName}</p>
            </div>
            
            <div class="content">
                <div class="alert-box">
                    <h3>⚠️ تم رصد نشاط مشبوه</h3>
                    <p><strong>نوع النشاط:</strong> ${data.security_action || 'نشاط غير معتاد'}</p>
                    
                    <div class="detail-row">
                        <span>عنوان IP:</span>
                        <span style="font-family: monospace;">${data.ip_address || 'غير متوفر'}</span>
                    </div>
                    <div class="detail-row">
                        <span>معلومات الجهاز:</span>
                        <span>${data.device_info || 'غير متوفر'}</span>
                    </div>
                    <div class="detail-row">
                        <span>التوقيت:</span>
                        <span>${new Date().toLocaleString('ar-SA')}</span>
                    </div>
                </div>

                <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 15px 0;">
                    <h4>🔒 إجراءات أمنية فورية:</h4>
                    <ul style="text-align: right; padding-right: 20px;">
                        <li>تم تعليق جميع العمليات المالية مؤقتاً</li>
                        <li>يرجى تغيير كلمة المرور فوراً</li>
                        <li>تحقق من جهازك من الفيروسات</li>
                        <li>لا تشارك بيانات حسابك مع أي شخص</li>
                    </ul>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="#" class="urgent-action">تأمين الحساب الآن</a>
                </div>

                <p style="color: #dc3545; font-weight: bold; text-align: center;">
                    إذا لم تكن أنت من قام بهذا النشاط، اتصل بالدعم فوراً!
                </p>
            </div>

            <div class="footer">
                <p><strong>شركة علي صالح محمد الشهري - فريق الأمان</strong></p>
                <p>خط الطوارئ الأمني: 966123456789</p>
                <p>البريد الإلكتروني: security@alsaleh-holding.com</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

serve(handler);