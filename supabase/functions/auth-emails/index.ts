import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  type: 'welcome' | 'admin_notification' | 'password_reset' | 'otp_verification' | 'service_request_notification' | 'payment_status_update';
  data?: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, type, data }: EmailRequest = await req.json();

    let html = '';
    
    switch (type) {
      case 'welcome':
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
              <h1 style="color: white; margin: 0;">مرحباً بك في شركة الصالح القابضة</h1>
            </div>
            <div style="padding: 40px; background: #f8f9fa;">
              <h2 style="color: #333;">أهلاً وسهلاً ${data?.name || ''}!</h2>
              <p style="color: #666; line-height: 1.6;">
                نشكرك لانضمامك إلى منصة شركة الصالح القابضة. يمكنك الآن الوصول إلى جميع خدماتنا وحلولنا المتطورة.
              </p>
              <div style="margin: 30px 0; padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #667eea;">
                <h3 style="margin: 0 0 10px 0; color: #333;">ما يمكنك فعله الآن:</h3>
                <ul style="color: #666; margin: 10px 0;">
                  <li>تصفح خدماتنا المتنوعة</li>
                  <li>طلب عروض أسعار مخصصة</li>
                  <li>التواصل مع فريق الدعم</li>
                  <li>متابعة آخر الأخبار والتحديثات</li>
                </ul>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data?.dashboardUrl || '#'}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  دخول إلى لوحة التحكم
                </a>
              </div>
            </div>
            <div style="background: #333; padding: 20px; text-align: center;">
              <p style="color: #999; margin: 0;">شركة الصالح القابضة © 2024</p>
            </div>
          </div>
        `;
        break;
        
      case 'admin_notification':
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #dc3545; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">إشعار إداري جديد</h1>
            </div>
            <div style="padding: 30px; background: #f8f9fa;">
              <h2 style="color: #333;">مستخدم جديد سجل في المنصة</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>الاسم:</strong> ${data?.name || 'غير محدد'}</p>
                <p><strong>البريد الإلكتروني:</strong> ${data?.email || 'غير محدد'}</p>
                <p><strong>تاريخ التسجيل:</strong> ${new Date().toLocaleDateString('ar-SA')}</p>
              </div>
            </div>
          </div>
        `;
        break;

      case 'otp_verification':
        html = `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: right;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
              <h1 style="color: white; margin: 0;">رمز التحقق</h1>
            </div>
            <div style="padding: 40px; background: #f8f9fa;">
              <h2 style="color: #333;">مرحباً ${data?.name || ''}!</h2>
              <p style="color: #666; line-height: 1.6;">
                استخدم رمز التحقق التالي لتسجيل الدخول:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <div style="background: white; border: 2px solid #667eea; border-radius: 10px; padding: 20px; display: inline-block;">
                  <h1 style="color: #667eea; margin: 0; font-size: 32px; letter-spacing: 5px;">${data?.otp || ''}</h1>
                </div>
              </div>
              <p style="color: #666; text-align: center;">
                رمز التحقق صالح لمدة 10 دقائق فقط
              </p>
              <div style="margin: 20px 0; padding: 15px; background: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
                <p style="margin: 0; color: #856404;">
                  <strong>تحذير:</strong> لا تشارك هذا الرمز مع أي شخص آخر
                </p>
              </div>
            </div>
            <div style="background: #333; padding: 20px; text-align: center;">
              <p style="color: #999; margin: 0;">شركة الصالح القابضة © 2024</p>
            </div>
          </div>
        `;
        break;

      case 'service_request_notification':
        html = `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: right;">
            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 40px; text-align: center;">
              <h1 style="color: white; margin: 0;">تم استلام طلبك بنجاح</h1>
            </div>
            <div style="padding: 40px; background: #f8f9fa;">
              <h2 style="color: #333;">عزيزي ${data?.customerName || ''},</h2>
              <p style="color: #666; line-height: 1.6;">
                تم استلام طلب الخدمة الخاص بك وسيتم معالجته في أقرب وقت ممكن.
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #28a745;">
                <h3 style="color: #333; margin-top: 0;">تفاصيل الطلب:</h3>
                <p><strong>نوع الخدمة:</strong> ${data?.serviceType || ''}</p>
                <p><strong>العنوان:</strong> ${data?.title || ''}</p>
                <p><strong>الوصف:</strong> ${data?.description || ''}</p>
                <p><strong>المبلغ:</strong> ${data?.amount || ''} ${data?.currency || 'ريال سعودي'}</p>
                <p><strong>رقم الطلب:</strong> ${data?.requestId || ''}</p>
                <p><strong>تاريخ الطلب:</strong> ${new Date().toLocaleDateString('ar-SA')}</p>
              </div>
              <div style="margin: 30px 0; padding: 20px; background: #e3f2fd; border-radius: 8px;">
                <h3 style="color: #1976d2; margin-top: 0;">الخطوات التالية:</h3>
                <ul style="color: #666; margin: 10px 0;">
                  <li>سيتواصل معك فريق العمل خلال 24 ساعة</li>
                  <li>سيتم تحديد الجدول الزمني للتنفيذ</li>
                  <li>ستحصل على تحديثات منتظمة حول حالة الطلب</li>
                </ul>
              </div>
            </div>
            <div style="background: #333; padding: 20px; text-align: center;">
              <p style="color: #999; margin: 0;">للاستفسارات: info@alialshehriholding.com | 920033442</p>
              <p style="color: #999; margin: 0;">شركة الصالح القابضة © 2024</p>
            </div>
          </div>
        `;
        break;

      case 'payment_status_update':
        const statusColor = data?.status === 'PAID' ? '#28a745' : data?.status === 'FAILED' ? '#dc3545' : '#ffc107';
        const statusText = data?.status === 'PAID' ? 'تم الدفع بنجاح' : data?.status === 'FAILED' ? 'فشل في الدفع' : 'في انتظار الدفع';
        const statusIcon = data?.status === 'PAID' ? '✅' : data?.status === 'FAILED' ? '❌' : '⏳';
        
        html = `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: right;">
            <div style="background: ${statusColor}; padding: 40px; text-align: center;">
              <h1 style="color: white; margin: 0;">${statusIcon} ${statusText}</h1>
            </div>
            <div style="padding: 40px; background: #f8f9fa;">
              <h2 style="color: #333;">عزيزي ${data?.customerName || ''},</h2>
              <p style="color: #666; line-height: 1.6;">
                ${data?.status === 'PAID' ? 'تم استلام دفعتك بنجاح ومعالجة طلبك.' : 
                  data?.status === 'FAILED' ? 'لم تكتمل عملية الدفع، يرجى المحاولة مرة أخرى.' : 
                  'عملية الدفع الخاصة بك قيد المعالجة.'}
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid ${statusColor};">
                <h3 style="color: #333; margin-top: 0;">تفاصيل المعاملة:</h3>
                <p><strong>العرض:</strong> ${data?.offerTitle || ''}</p>
                <p><strong>المبلغ:</strong> ${data?.amount || ''} ${data?.currency || 'ريال سعودي'}</p>
                <p><strong>طريقة الدفع:</strong> ${data?.paymentMethod || ''}</p>
                <p><strong>رقم المعاملة:</strong> ${data?.transactionId || ''}</p>
                <p><strong>التاريخ:</strong> ${new Date().toLocaleDateString('ar-SA')}</p>
                <p><strong>الحالة:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
              </div>
              ${data?.status === 'PAID' ? `
                <div style="margin: 30px 0; padding: 20px; background: #d4edda; border-radius: 8px;">
                  <h3 style="color: #155724; margin-top: 0;">تم إنشاء طلب الخدمة:</h3>
                  <p style="color: #155724;">سيتواصل معك فريق العمل خلال 24 ساعة لبدء تنفيذ الخدمة.</p>
                </div>
              ` : data?.status === 'FAILED' ? `
                <div style="margin: 30px 0; padding: 20px; background: #f8d7da; border-radius: 8px;">
                  <h3 style="color: #721c24; margin-top: 0;">يمكنك:</h3>
                  <ul style="color: #721c24; margin: 10px 0;">
                    <li>إعادة المحاولة من صفحة العروض</li>
                    <li>التواصل مع فريق الدعم للمساعدة</li>
                    <li>استخدام طريقة دفع أخرى</li>
                  </ul>
                </div>
              ` : `
                <div style="margin: 30px 0; padding: 20px; background: #fff3cd; border-radius: 8px;">
                  <h3 style="color: #856404; margin-top: 0;">يرجى الانتظار:</h3>
                  <p style="color: #856404;">سيتم تحديث حالة الدفع تلقائياً وستحصل على إشعار عند اكتمالها.</p>
                </div>
              `}
            </div>
            <div style="background: #333; padding: 20px; text-align: center;">
              <p style="color: #999; margin: 0;">للاستفسارات: info@alialshehriholding.com | 920033442</p>
              <p style="color: #999; margin: 0;">شركة الصالح القابضة © 2024</p>
            </div>
          </div>
        `;
        break;
        
      default:
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px;">
            <h2 style="color: #333;">${subject}</h2>
            <p style="color: #666;">رسالة من شركة الصالح القابضة</p>
          </div>
        `;
    }

    const emailResponse = await resend.emails.send({
      from: "Ali AlShehri Holding <info@alialshehriholding.com>",
      to: [to],
      bcc: ["info@alialshehriholding.com"],
      reply_to: "info@alialshehriholding.com",
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);