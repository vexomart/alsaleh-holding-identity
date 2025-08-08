import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BankReceiptRequest {
  type: 'bank_receipt';
  fullName: string;
  email: string;
  phone: string;
  transferAmount: string;
  transferDate: string;
  accountLastFour: string;
  notes?: string;
  receiptFile?: string;
}

interface RefundRequest {
  type: 'refund';
  fullName: string;
  email: string;
  phone: string;
  originalAmount: string;
  refundReason: string;
  refundAmount: string;
  orderNumber?: string;
  bankAccount?: string;
  notes?: string;
}

type PaymentFormRequest = BankReceiptRequest | RefundRequest;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: PaymentFormRequest = await req.json();
    console.log("Received form data:", formData);

    if (formData.type === 'bank_receipt') {
      // Handle bank receipt submission
      const receiptData = formData as BankReceiptRequest;
      
      // Send email to company
      const companyEmailResponse = await resend.emails.send({
        from: "Ali AlShehri Holding <info@alialshehriholding.com>",
        to: ["finance@emkandigital.com", "admin@emkandigital.com"],
        bcc: ["info@alialshehriholding.com"],
        html: `
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>إيصال تحويل بنكي جديد</title>
              <style>
                  body {
                      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                      line-height: 1.6;
                      color: #333;
                      background-color: #f8f9fa;
                      margin: 0;
                      padding: 20px;
                      direction: rtl;
                      text-align: right;
                  }
                  .container {
                      max-width: 800px;
                      margin: 0 auto;
                      background: white;
                      border-radius: 20px;
                      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                      overflow: hidden;
                  }
                  .header {
                      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                      color: white;
                      padding: 40px;
                      text-align: center;
                  }
                  .content {
                      padding: 40px;
                  }
                  .info-box {
                      background: #f8fafc;
                      padding: 20px;
                      border-radius: 12px;
                      border-right: 4px solid #3b82f6;
                      margin: 20px 0;
                  }
                  .amount-box {
                      background: #ecfdf5;
                      padding: 20px;
                      border-radius: 12px;
                      border-right: 4px solid #22c55e;
                      margin: 20px 0;
                      text-align: center;
                  }
                  .footer {
                      background: #1f2937;
                      color: white;
                      text-align: center;
                      padding: 30px;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1 style="margin: 0; font-size: 28px; font-weight: bold;">📋 إيصال تحويل بنكي جديد</h1>
                      <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">تم استلام إيصال تحويل بنكي يتطلب المراجعة والتأكيد</p>
                  </div>

                  <div class="content">
                      <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 15px; margin-bottom: 30px; text-align: center;">
                          <h2 style="color: white; margin: 0; font-size: 24px;">🔍 تفاصيل العميل</h2>
                      </div>

                      <div class="info-box">
                          <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px;">👤 الاسم الكامل</h3>
                          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1f2937;">${receiptData.fullName}</p>
                      </div>

                      <div class="info-box">
                          <h3 style="color: #059669; margin: 0 0 10px 0; font-size: 16px;">📧 البريد الإلكتروني</h3>
                          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1f2937;">${receiptData.email}</p>
                      </div>

                      <div class="info-box">
                          <h3 style="color: #7c3aed; margin: 0 0 10px 0; font-size: 16px;">📱 رقم الهاتف</h3>
                          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1f2937;">${receiptData.phone}</p>
                      </div>

                      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px; margin: 30px 0; text-align: center;">
                          <h2 style="color: white; margin: 0; font-size: 24px;">💰 تفاصيل التحويل</h2>
                      </div>

                      <div class="amount-box">
                          <h3 style="color: #16a34a; margin: 0 0 10px 0; font-size: 16px;">💵 مبلغ التحويل</h3>
                          <p style="margin: 0; font-size: 24px; font-weight: bold; color: #15803d;">${receiptData.transferAmount} ريال سعودي</p>
                      </div>

                      <div style="background: #fef3c7; padding: 20px; border-radius: 12px; border-right: 4px solid #f59e0b; margin: 20px 0;">
                          <h3 style="color: #d97706; margin: 0 0 10px 0; font-size: 16px;">📅 تاريخ التحويل</h3>
                          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #92400e;">${receiptData.transferDate}</p>
                      </div>

                      <div style="background: #e0f2fe; padding: 20px; border-radius: 12px; border-right: 4px solid #0ea5e9; margin: 20px 0;">
                          <h3 style="color: #0284c7; margin: 0 0 10px 0; font-size: 16px;">🏦 آخر 4 أرقام من الحساب</h3>
                          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #0c4a6e;">***${receiptData.accountLastFour}</p>
                      </div>

                      ${receiptData.notes ? `
                      <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; border-right: 4px solid #64748b; margin: 20px 0;">
                          <h3 style="color: #475569; margin: 0 0 10px 0; font-size: 16px;">📝 ملاحظات إضافية</h3>
                          <p style="margin: 0; font-size: 16px; color: #334155; line-height: 1.6;">${receiptData.notes}</p>
                      </div>
                      ` : ''}

                      <div style="text-align: center; margin-top: 40px;">
                          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 15px; color: white;">
                              <p style="margin: 0; font-size: 18px; font-weight: bold;">⚡ إجراء مطلوب</p>
                              <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">يرجى مراجعة الإيصال والتأكيد خلال 2-4 ساعات عمل</p>
                          </div>
                      </div>
                  </div>

                  <div class="footer">
                      <p style="color: #d1d5db; font-size: 14px; margin: 0;">
                          🏢 شركة علي صالح الشهري القابضة | نظام إدارة المدفوعات الآلي
                      </p>
                      <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">
                          تم إرسال هذا الإيميل تلقائياً من نظام إدارة المدفوعات
                      </p>
                  </div>
              </div>
          </body>
          </html>
        `,
      });

      // Send confirmation email to client
      const clientEmailResponse = await resend.emails.send({
        from: "Ali AlShehri Holding <info@alialshehriholding.com>",
        to: [receiptData.email],
        bcc: ["info@alialshehriholding.com"],
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 0;">
            <div style="background: white; margin: 20px; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px; font-weight: bold;">✅ تم استلام إيصالكم بنجاح</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">شكراً لكم على إرسال إيصال التحويل البنكي</p>
              </div>

              <!-- Content -->
              <div style="padding: 40px; text-align: center;">
                <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px; border-radius: 15px; margin-bottom: 30px;">
                  <h2 style="color: white; margin: 0; font-size: 24px;">👋 مرحباً ${receiptData.fullName}</h2>
                </div>

                <div style="background: #f0fdf4; padding: 25px; border-radius: 15px; margin-bottom: 30px; border: 1px solid #bbf7d0;">
                  <h3 style="color: #16a34a; margin: 0 0 15px 0; font-size: 20px;">🎉 تم استلام إيصالكم بنجاح!</h3>
                  <p style="color: #15803d; margin: 0; font-size: 16px; line-height: 1.6;">
                    لقد تم استلام إيصال التحويل البنكي بمبلغ <strong>${receiptData.transferAmount} ريال سعودي</strong>
                    <br>سيتم مراجعة الإيصال والتأكيد خلال 2-4 ساعات عمل
                  </p>
                </div>

                <div style="background: #fef3c7; padding: 25px; border-radius: 15px; margin-bottom: 30px; border: 1px solid #fde047;">
                  <h3 style="color: #d97706; margin: 0 0 15px 0; font-size: 18px;">⏰ الخطوات التالية</h3>
                  <div style="text-align: right;">
                    <p style="color: #92400e; margin: 0 0 10px 0; font-size: 14px;">✓ تم استلام الإيصال بنجاح</p>
                    <p style="color: #92400e; margin: 0 0 10px 0; font-size: 14px;">🔄 جاري مراجعة تفاصيل التحويل</p>
                    <p style="color: #92400e; margin: 0 0 10px 0; font-size: 14px;">📧 سيتم إرسال تأكيد نهائي عبر الإيميل</p>
                    <p style="color: #92400e; margin: 0; font-size: 14px;">🎯 تفعيل الخدمة فور التأكيد</p>
                  </div>
                </div>

                <div style="background: #e0f2fe; padding: 25px; border-radius: 15px; margin-bottom: 30px; border: 1px solid #7dd3fc;">
                  <h3 style="color: #0284c7; margin: 0 0 15px 0; font-size: 18px;">📞 تحتاج مساعدة؟</h3>
                  <p style="color: #0c4a6e; margin: 0; font-size: 14px; line-height: 1.6;">
                    في حال كان لديكم أي استفسار، يمكنكم التواصل معنا عبر:
                    <br><strong>واتساب:</strong> +966-XX-XXX-XXXX
                    <br><strong>إيميل:</strong> support@emkandigital.com
                  </p>
                </div>

                <!-- Footer -->
                <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 14px; margin: 0;">
                    💙 شكراً لثقتكم في إمكان للحلول الرقمية
                  </p>
                  <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">
                    هذا إيميل آلي، يرجى عدم الرد عليه مباشرة
                  </p>
                </div>
              </div>
            </div>
          </div>
        `,
      });

      console.log("Bank receipt emails sent:", { companyEmailResponse, clientEmailResponse });

    } else if (formData.type === 'refund') {
      // Handle refund request
      const refundData = formData as RefundRequest;
      
      // Send email to company
      const companyEmailResponse = await resend.emails.send({
        from: "Ali AlShehri Holding <info@alialshehriholding.com>",
        to: ["finance@emkandigital.com", "admin@emkandigital.com"],
        bcc: ["info@alialshehriholding.com"],
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 0;">
            <div style="background: white; margin: 20px; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🔄 طلب استرداد جديد</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">تم استلام طلب استرداد يتطلب المراجعة والمعالجة</p>
              </div>

              <!-- Content -->
              <div style="padding: 40px;">
                <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 15px; margin-bottom: 30px; text-align: center;">
                  <h2 style="color: white; margin: 0; font-size: 24px;">🔍 تفاصيل العميل</h2>
                </div>

                <div style="display: grid; gap: 20px; margin-bottom: 30px;">
                  <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #3b82f6;">
                    <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px;">👤 الاسم الكامل</h3>
                    <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1f2937;">${refundData.fullName}</p>
                  </div>

                  <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #10b981;">
                    <h3 style="color: #059669; margin: 0 0 10px 0; font-size: 16px;">📧 البريد الإلكتروني</h3>
                    <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1f2937;">${refundData.email}</p>
                  </div>

                  <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #8b5cf6;">
                    <h3 style="color: #7c3aed; margin: 0 0 10px 0; font-size: 16px;">📱 رقم الهاتف</h3>
                    <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1f2937;">${refundData.phone}</p>
                  </div>
                </div>

                <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 20px; border-radius: 15px; margin-bottom: 30px; text-align: center;">
                  <h2 style="color: white; margin: 0; font-size: 24px;">💰 تفاصيل الاسترداد</h2>
                </div>

                <div style="display: grid; gap: 20px; margin-bottom: 30px;">
                  <div style="background: #fef2f2; padding: 20px; border-radius: 12px; border-left: 4px solid #ef4444;">
                    <h3 style="color: #dc2626; margin: 0 0 10px 0; font-size: 16px;">💵 المبلغ الأصلي</h3>
                    <p style="margin: 0; font-size: 24px; font-weight: bold; color: #b91c1c;">${refundData.originalAmount} ريال سعودي</p>
                  </div>

                  <div style="background: #fef3c7; padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b;">
                    <h3 style="color: #d97706; margin: 0 0 10px 0; font-size: 16px;">💸 مبلغ الاسترداد المطلوب</h3>
                    <p style="margin: 0; font-size: 24px; font-weight: bold; color: #92400e;">${refundData.refundAmount} ريال سعودي</p>
                  </div>

                  <div style="background: #fef2f2; padding: 20px; border-radius: 12px; border-left: 4px solid #ef4444;">
                    <h3 style="color: #dc2626; margin: 0 0 10px 0; font-size: 16px;">📋 سبب الاسترداد</h3>
                    <p style="margin: 0; font-size: 16px; color: #b91c1c; line-height: 1.6;">${refundData.refundReason}</p>
                  </div>

                  ${refundData.orderNumber ? `
                  <div style="background: #e0f2fe; padding: 20px; border-radius: 12px; border-left: 4px solid #0ea5e9;">
                    <h3 style="color: #0284c7; margin: 0 0 10px 0; font-size: 16px;">🔢 رقم الطلب</h3>
                    <p style="margin: 0; font-size: 18px; font-weight: bold; color: #0c4a6e;">${refundData.orderNumber}</p>
                  </div>
                  ` : ''}

                  ${refundData.bankAccount ? `
                  <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; border-left: 4px solid #64748b;">
                    <h3 style="color: #475569; margin: 0 0 10px 0; font-size: 16px;">🏦 الحساب البنكي للاسترداد</h3>
                    <p style="margin: 0; font-size: 16px; color: #334155;">${refundData.bankAccount}</p>
                  </div>
                  ` : ''}
                </div>

                ${refundData.notes ? `
                <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; border-left: 4px solid #64748b; margin-bottom: 30px;">
                  <h3 style="color: #475569; margin: 0 0 10px 0; font-size: 16px;">📝 ملاحظات إضافية</h3>
                  <p style="margin: 0; font-size: 16px; color: #334155; line-height: 1.6;">${refundData.notes}</p>
                </div>
                ` : ''}

                <!-- Action Buttons -->
                <div style="text-align: center; margin-top: 40px;">
                  <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 20px; border-radius: 15px; color: white;">
                    <p style="margin: 0; font-size: 18px; font-weight: bold;">⚡ إجراء مطلوب عاجل</p>
                    <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">يرجى مراجعة طلب الاسترداد ومعالجته خلال 3-5 أيام عمل</p>
                  </div>
                </div>

                <!-- Footer -->
                <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 14px; margin: 0;">
                    🏢 إمكان للحلول الرقمية | نظام إدارة الاستردادات الآلي
                  </p>
                  <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">
                    تم إرسال هذا الإيميل تلقائياً من نظام إدارة الاستردادات
                  </p>
                </div>
              </div>
            </div>
          </div>
        `,
      });

      // Send confirmation email to client
      const clientEmailResponse = await resend.emails.send({
        from: "إمكان للحلول الرقمية <noreply@emkandigital.com>",
        to: [refundData.email],
        subject: "✅ تأكيد استلام طلب الاسترداد",
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 0;">
            <div style="background: white; margin: 20px; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px; font-weight: bold;">✅ تم استلام طلب الاسترداد</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">شكراً لكم على تقديم طلب الاسترداد</p>
              </div>

              <!-- Content -->
              <div style="padding: 40px; text-align: center;">
                <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px; border-radius: 15px; margin-bottom: 30px;">
                  <h2 style="color: white; margin: 0; font-size: 24px;">👋 مرحباً ${refundData.fullName}</h2>
                </div>

                <div style="background: #fef2f2; padding: 25px; border-radius: 15px; margin-bottom: 30px; border: 1px solid #fecaca;">
                  <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 20px;">🔄 تم استلام طلب الاسترداد بنجاح!</h3>
                  <p style="color: #b91c1c; margin: 0; font-size: 16px; line-height: 1.6;">
                    لقد تم استلام طلب استرداد بمبلغ <strong>${refundData.refundAmount} ريال سعودي</strong>
                    <br>سيتم مراجعة الطلب ومعالجته خلال 3-5 أيام عمل
                  </p>
                </div>

                <div style="background: #fef3c7; padding: 25px; border-radius: 15px; margin-bottom: 30px; border: 1px solid #fde047;">
                  <h3 style="color: #d97706; margin: 0 0 15px 0; font-size: 18px;">⏰ الخطوات التالية</h3>
                  <div style="text-align: right;">
                    <p style="color: #92400e; margin: 0 0 10px 0; font-size: 14px;">✓ تم استلام طلب الاسترداد بنجاح</p>
                    <p style="color: #92400e; margin: 0 0 10px 0; font-size: 14px;">🔄 جاري مراجعة تفاصيل الطلب</p>
                    <p style="color: #92400e; margin: 0 0 10px 0; font-size: 14px;">💰 معالجة الاسترداد (3-5 أيام عمل)</p>
                    <p style="color: #92400e; margin: 0; font-size: 14px;">📧 إشعار عند اكتمال العملية</p>
                  </div>
                </div>

                <div style="background: #e0f2fe; padding: 25px; border-radius: 15px; margin-bottom: 30px; border: 1px solid #7dd3fc;">
                  <h3 style="color: #0284c7; margin: 0 0 15px 0; font-size: 18px;">📋 ملخص طلبكم</h3>
                  <div style="text-align: right;">
                    <p style="color: #0c4a6e; margin: 0 0 5px 0; font-size: 14px;"><strong>المبلغ المطلوب:</strong> ${refundData.refundAmount} ريال</p>
                    <p style="color: #0c4a6e; margin: 0 0 5px 0; font-size: 14px;"><strong>السبب:</strong> ${refundData.refundReason}</p>
                    ${refundData.orderNumber ? `<p style="color: #0c4a6e; margin: 0 0 5px 0; font-size: 14px;"><strong>رقم الطلب:</strong> ${refundData.orderNumber}</p>` : ''}
                  </div>
                </div>

                <div style="background: #f0f9ff; padding: 25px; border-radius: 15px; margin-bottom: 30px; border: 1px solid #bae6fd;">
                  <h3 style="color: #0284c7; margin: 0 0 15px 0; font-size: 18px;">📞 تحتاج مساعدة؟</h3>
                  <p style="color: #0c4a6e; margin: 0; font-size: 14px; line-height: 1.6;">
                    في حال كان لديكم أي استفسار حول طلب الاسترداد:
                    <br><strong>واتساب:</strong> +966-XX-XXX-XXXX
                    <br><strong>إيميل:</strong> support@emkandigital.com
                  </p>
                </div>

                <!-- Footer -->
                <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 14px; margin: 0;">
                    💙 شكراً لثقتكم في إمكان للحلول الرقمية
                  </p>
                  <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">
                    هذا إيميل آلي، يرجى عدم الرد عليه مباشرة
                  </p>
                </div>
              </div>
            </div>
          </div>
        `,
      });

      console.log("Refund request emails sent:", { companyEmailResponse, clientEmailResponse });
    }

    return new Response(
      JSON.stringify({ success: true, message: "تم إرسال الإيميلات بنجاح" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in payment-forms function:", error);
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