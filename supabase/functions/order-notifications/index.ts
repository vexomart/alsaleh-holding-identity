import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderData {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  productName: string;
  productPrice: number;
  productVersion: string;
  currency: string;
  orderDate: string;
}

// Professional order confirmation template for customer
const getCustomerEmailTemplate = (order: OrderData) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تأكيد الطلب - شركة علي صالح الشهري القابضة</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; direction: rtl; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 40px 30px; text-align: center; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .header-subtitle { font-size: 16px; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .order-details { background: #f1f5f9; border-radius: 12px; padding: 30px; margin: 30px 0; border-right: 4px solid #3b82f6; }
        .order-title { font-size: 24px; color: #1e293b; margin-bottom: 20px; font-weight: bold; }
        .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-weight: 600; color: #475569; }
        .detail-value { color: #1e293b; font-weight: 500; }
        .product-highlight { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center; }
        .next-steps { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 10px; padding: 25px; margin: 30px 0; }
        .next-steps h3 { color: #92400e; margin-bottom: 15px; }
        .steps-list { list-style: none; }
        .steps-list li { margin: 10px 0; padding-right: 20px; position: relative; }
        .steps-list li:before { content: "✓"; position: absolute; right: 0; color: #059669; font-weight: bold; }
        .footer { background: #1e293b; color: white; padding: 30px; text-align: center; }
        .contact-info { margin: 20px 0; }
        .contact-info div { margin: 8px 0; }
        .price-highlight { font-size: 24px; font-weight: bold; color: #059669; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🏢 شركة علي صالح الشهري القابضة</div>
            <div class="header-subtitle">شركة رائدة منذ 2016 - مستوى عالمي ⭐⭐⭐⭐⭐</div>
        </div>

        <div class="content">
            <h1 style="color: #1e293b; margin-bottom: 20px; font-size: 28px;">🎉 تم تأكيد طلبكم بنجاح!</h1>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.8; margin-bottom: 30px;">
                عزيزي/عزيزتي <strong>${order.customerName}</strong>,<br>
                نشكركم لاختياركم شركة علي صالح الشهري القابضة. تم استلام طلبكم بنجاح وسيتم معالجته في أقرب وقت ممكن.
            </p>

            <div class="order-details">
                <h2 class="order-title">📋 تفاصيل الطلب</h2>
                
                <div class="detail-row">
                    <span class="detail-label">🔢 رقم الطلب:</span>
                    <span class="detail-value" style="font-family: monospace; background: #e2e8f0; padding: 4px 8px; border-radius: 4px;">${order.orderNumber}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">📅 تاريخ الطلب:</span>
                    <span class="detail-value">${order.orderDate}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">👤 اسم العميل:</span>
                    <span class="detail-value">${order.customerName}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">📧 البريد الإلكتروني:</span>
                    <span class="detail-value">${order.customerEmail}</span>
                </div>
                
                ${order.customerPhone ? `
                <div class="detail-row">
                    <span class="detail-label">📱 رقم الهاتف:</span>
                    <span class="detail-value">${order.customerPhone}</span>
                </div>
                ` : ''}
            </div>

            <div class="product-highlight">
                <h3 style="margin-bottom: 15px; font-size: 20px;">🚀 المنتج المطلوب</h3>
                <div style="font-size: 18px; margin-bottom: 10px;">${order.productName}</div>
                <div style="font-size: 14px; opacity: 0.9; margin-bottom: 15px;">الإصدار: ${order.productVersion}</div>
                <div class="price-highlight">${order.productPrice.toLocaleString('ar-SA')} ${order.currency}</div>
            </div>

            <div class="next-steps">
                <h3>📝 الخطوات التالية:</h3>
                <ul class="steps-list">
                    <li>سيتم مراجعة طلبكم من قبل فريقنا المختص</li>
                    <li>ستتلقون رسالة تأكيد بتفاصيل الدفع خلال 24 ساعة</li>
                    <li>بعد تأكيد الدفع، سيتم تسليم المنتج فورياً</li>
                    <li>ستحصلون على دعم فني مجاني لمدة 3 أشهر</li>
                </ul>
            </div>

            <div style="background: #dbeafe; border: 1px solid #3b82f6; border-radius: 10px; padding: 20px; margin: 30px 0; text-align: center;">
                <h3 style="color: #1e40af; margin-bottom: 10px;">💡 هل تحتاج مساعدة؟</h3>
                <p style="color: #1e40af;">فريق الدعم الفني متاح 24/7 لمساعدتكم</p>
            </div>
        </div>

        <div class="footer">
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">
                شركة علي صالح الشهري القابضة
            </div>
            
            <div class="contact-info">
                <div>📧 البريد الإلكتروني: info@alshehriholding.com</div>
                <div>📱 الهاتف: +966 11 234 5678</div>
                <div>🌐 الموقع الإلكتروني: www.alshehriholding.com</div>
                <div>📍 العنوان: الرياض، المملكة العربية السعودية</div>
            </div>

            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #475569; opacity: 0.8;">
                <p>© 2025 شركة علي صالح الشهري القابضة. جميع الحقوق محفوظة.</p>
                <p>شركة مسجلة في المملكة العربية السعودية</p>
            </div>
        </div>
    </div>
</body>
</html>
`;

// Admin notification template
const getAdminEmailTemplate = (order: OrderData) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>طلب جديد - نظام إدارة الطلبات</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; direction: rtl; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; }
        .alert-badge { background: #fbbf24; color: #92400e; padding: 8px 16px; border-radius: 20px; font-weight: bold; display: inline-block; margin-bottom: 15px; }
        .content { padding: 30px; }
        .order-summary { background: #fee2e2; border-radius: 10px; padding: 25px; margin: 20px 0; border-right: 4px solid #dc2626; }
        .detail-grid { display: grid; gap: 15px; margin: 20px 0; }
        .detail-item { background: #f8fafc; padding: 15px; border-radius: 8px; border-right: 3px solid #3b82f6; }
        .detail-label { font-size: 12px; text-transform: uppercase; color: #6b7280; margin-bottom: 5px; }
        .detail-value { font-size: 16px; font-weight: 600; color: #1f2937; }
        .actions { background: #ecfdf5; border: 1px solid #10b981; border-radius: 10px; padding: 20px; margin: 25px 0; text-align: center; }
        .btn { display: inline-block; padding: 12px 24px; margin: 5px; text-decoration: none; border-radius: 6px; font-weight: 600; }
        .btn-primary { background: #3b82f6; color: white; }
        .btn-success { background: #10b981; color: white; }
        .priority-high { color: #dc2626; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="alert-badge">🚨 طلب جديد</div>
            <h1>نظام إدارة الطلبات</h1>
            <p>تم استلام طلب جديد من العميل</p>
        </div>

        <div class="content">
            <div class="order-summary">
                <h2 style="color: #dc2626; margin-bottom: 15px;">📋 ملخص الطلب</h2>
                <div style="font-size: 18px; margin-bottom: 10px;">
                    <strong>رقم الطلب:</strong> <span style="font-family: monospace; background: white; padding: 4px 8px; border-radius: 4px;">${order.orderNumber}</span>
                </div>
                <div><strong>وقت الاستلام:</strong> ${order.orderDate}</div>
            </div>

            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">اسم العميل</div>
                    <div class="detail-value">${order.customerName}</div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-label">البريد الإلكتروني</div>
                    <div class="detail-value">${order.customerEmail}</div>
                </div>
                
                ${order.customerPhone ? `
                <div class="detail-item">
                    <div class="detail-label">رقم الهاتف</div>
                    <div class="detail-value">${order.customerPhone}</div>
                </div>
                ` : ''}
                
                <div class="detail-item">
                    <div class="detail-label">المنتج المطلوب</div>
                    <div class="detail-value">${order.productName} (${order.productVersion})</div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-label">قيمة الطلب</div>
                    <div class="detail-value priority-high">${order.productPrice.toLocaleString('ar-SA')} ${order.currency}</div>
                </div>
            </div>

            <div class="actions">
                <h3 style="margin-bottom: 15px; color: #059669;">⚡ إجراءات مطلوبة</h3>
                <p style="margin-bottom: 15px;">يرجى اتخاذ الإجراءات التالية:</p>
                <ul style="text-align: right; margin: 15px 0;">
                    <li>مراجعة تفاصيل الطلب</li>
                    <li>التواصل مع العميل خلال 24 ساعة</li>
                    <li>إرسال تفاصيل الدفع والفاتورة</li>
                    <li>تحديث حالة الطلب في النظام</li>
                </ul>
            </div>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <p><strong>🔗 روابط سريعة للإدارة:</strong></p>
                <div style="margin-top: 10px;">
                    <a href="#" class="btn btn-primary">عرض تفاصيل الطلب</a>
                    <a href="#" class="btn btn-success">إدارة الطلبات</a>
                </div>
            </div>
        </div>

        <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
            <p>نظام إدارة الطلبات - شركة علي صالح الشهري القابضة</p>
            <p style="font-size: 14px; opacity: 0.8;">تم إرسال هذا التنبيه تلقائياً من النظام</p>
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
    const { orderData }: { orderData: OrderData } = await req.json();

    // Format order date in Arabic
    const orderDate = new Date(orderData.orderDate).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const formattedOrder = {
      ...orderData,
      orderDate
    };

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "شركة علي صالح الشهري القابضة <info@alialshehriholding.com>",
      to: [orderData.customerEmail],
      bcc: ["info@alialshehriholding.com"],
      subject: `🎉 تأكيد الطلب ${orderData.orderNumber} - شركة علي صالح الشهري القابضة`,
      html: getCustomerEmailTemplate(formattedOrder),
    });

    // Send notification to admin
    const adminEmailResponse = await resend.emails.send({
      from: "نظام الطلبات <info@alialshehriholding.com>",
      to: ["info@alialshehriholding.com"],
      subject: `🚨 طلب جديد رقم ${orderData.orderNumber} - ${orderData.productName}`,
      html: getAdminEmailTemplate(formattedOrder),
    });

    console.log("Customer email sent:", customerEmailResponse);
    console.log("Admin email sent:", adminEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        customerEmail: customerEmailResponse,
        adminEmail: adminEmailResponse 
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
    console.error("Error in order-notifications function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);