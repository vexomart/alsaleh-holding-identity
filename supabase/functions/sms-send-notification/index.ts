import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MSEGAT_API_URL = "https://www.msegat.com/gw/sendsms.php";

// Message Types
type MessageType = 
  // Welcome & Registration
  | "welcome" | "registration_complete" | "otp_sent"
  // Orders
  | "order_created" | "order_confirmed" | "order_processing" | "order_completed" | "order_cancelled"
  // Contracts
  | "contract_created" | "contract_approved" | "contract_rejected" | "contract_pending_signature" 
  | "contract_signed" | "contract_active" | "contract_expired"
  // Finance - Eligibility
  | "finance_eligibility_checking" | "finance_eligibility_approved" | "finance_eligibility_rejected"
  | "finance_documents_required" | "finance_scoring_started" | "finance_scoring_complete"
  // Finance - Application
  | "finance_submitted" | "finance_under_review" | "finance_approved" | "finance_rejected" 
  | "finance_offer_ready" | "finance_offer_selected" | "finance_offer_expired"
  // Finance - Contract
  | "finance_contract_ready" | "finance_contract_signed" | "finance_disbursed"
  // Finance - Payments
  | "finance_payment_due" | "finance_payment_reminder" | "finance_payment_received" | "finance_payment_overdue"
  // Payments
  | "payment_success" | "payment_failed" | "wallet_topup" | "wallet_withdrawal"
  // General
  | "order_status" | "account_update" | "custom";

interface NotificationRequest {
  phone: string;
  message_type: MessageType;
  template_data?: Record<string, string>;
  custom_message?: string;
}

// Comprehensive Arabic SMS Templates
const TEMPLATES: Record<string, string> = {
  // ===== Welcome & Registration =====
  welcome: `🎉 أهلاً بك {{name}} في ASH HOLDING!
تم إنشاء حسابك بنجاح.
استمتع بخدماتنا المميزة.
للدعم: info@ash-holding.sa
ASH HOLDING`,

  registration_complete: `✅ مبروك {{name}}!
اكتمل تسجيلك في ASH HOLDING.
يمكنك الآن تصفح خدماتنا وطلبها.
ASH HOLDING`,

  otp_sent: `🔐 رمز التحقق الخاص بك: {{otp}}
صالح لمدة 5 دقائق.
لا تشاركه مع أحد.
ASH HOLDING`,

  // ===== Orders =====
  order_created: `✨ عميلنا العزيز،
تم استلام طلبكم رقم {{order_number}} بنجاح.
سيتم مراجعته قريباً.
ASH HOLDING`,

  order_confirmed: `✅ تم تأكيد طلبكم رقم {{order_number}}.
قيمة الطلب: {{amount}} ريال
سيتم التواصل معكم قريباً.
ASH HOLDING`,

  order_processing: `⚙️ طلبكم رقم {{order_number}} قيد التنفيذ الآن.
تابعوا حالة الطلب عبر حسابكم.
ASH HOLDING`,

  order_completed: `🎉 تم إنجاز طلبكم رقم {{order_number}} بنجاح!
شكراً لثقتكم بنا.
ASH HOLDING`,

  order_cancelled: `❌ تم إلغاء طلبكم رقم {{order_number}}.
للاستفسار: info@ash-holding.sa
ASH HOLDING`,

  order_status: `عميلنا العزيز،
تم تحديث حالة طلبك رقم {{order_number}} إلى: {{status}}
شكراً لثقتكم
ASH HOLDING`,

  // ===== Contracts =====
  contract_created: `📄 تم إنشاء عقد جديد رقم {{contract_number}}.
يرجى مراجعته في حسابكم.
ASH HOLDING`,

  contract_approved: `✅ تمت الموافقة على عقدكم رقم {{contract_number}}.
يمكنكم الآن التوقيع عليه.
ASH HOLDING`,

  contract_rejected: `❌ تم رفض العقد رقم {{contract_number}}.
السبب: {{reason}}
للتواصل: info@ash-holding.sa
ASH HOLDING`,

  contract_pending_signature: `✍️ عقدكم رقم {{contract_number}} جاهز للتوقيع.
يرجى تسجيل الدخول لإتمام التوقيع.
ASH HOLDING`,

  contract_signed: `🖊️ تم توقيع العقد رقم {{contract_number}} بنجاح!
سيتم تفعيله قريباً.
ASH HOLDING`,

  contract_active: `🟢 عقدكم رقم {{contract_number}} أصبح نشطاً الآن!
ASH HOLDING`,

  contract_expired: `⚠️ انتهت صلاحية عقدكم رقم {{contract_number}}.
للتجديد تواصلوا معنا.
ASH HOLDING`,

  // ===== Finance - Eligibility =====
  finance_eligibility_checking: `🔍 عميلنا العزيز {{name}}،
جاري التحقق من أهليتك للتمويل.
سيتم إعلامك بالنتيجة خلال دقائق.
ASH HOLDING`,

  finance_eligibility_approved: `✅ مبروك {{name}}!
تم التحقق من أهليتك للتمويل بنجاح.
الحد الائتماني المتاح: {{credit_limit}} ريال
يمكنك الآن تقديم طلب التمويل.
ASH HOLDING`,

  finance_eligibility_rejected: `❌ عميلنا العزيز {{name}}،
للأسف لم تتم الموافقة على أهليتك للتمويل حالياً.
السبب: {{reason}}
للاستفسار: info@ash-holding.sa
ASH HOLDING`,

  finance_documents_required: `📎 عميلنا العزيز،
نحتاج مستندات إضافية لإتمام طلب التمويل {{application_number}}.
المستندات المطلوبة: {{documents}}
يرجى رفعها عبر حسابك.
ASH HOLDING`,

  finance_scoring_started: `📊 عميلنا العزيز،
بدأنا تقييم ملفك الائتماني لطلب التمويل {{application_number}}.
سيتم إعلامك بالنتيجة قريباً.
ASH HOLDING`,

  finance_scoring_complete: `✅ اكتمل التقييم الائتماني لطلبك {{application_number}}.
مستوى المخاطر: {{risk_level}}
سجّل دخولك لمراجعة التفاصيل.
ASH HOLDING`,

  // ===== Finance - Application =====
  finance_submitted: `📝 تم استلام طلب التمويل رقم {{application_number}}.
المبلغ المطلوب: {{amount}} ريال
سيتم مراجعته خلال 48 ساعة.
ASH HOLDING`,

  finance_under_review: `🔎 طلب التمويل {{application_number}} قيد المراجعة الآن.
تابع حالة طلبك عبر حسابك.
ASH HOLDING`,

  finance_approved: `🎉 مبروك! تمت الموافقة على طلب التمويل {{application_number}}.
المبلغ: {{amount}} ريال
القسط الشهري: {{monthly}} ريال
ASH HOLDING`,

  finance_rejected: `❌ لم تتم الموافقة على طلب التمويل {{application_number}}.
السبب: {{reason}}
للمزيد: info@ash-holding.sa
ASH HOLDING`,

  finance_offer_ready: `💰 عروض التمويل جاهزة لطلبكم {{application_number}}!
عدد العروض المتاحة: {{offers_count}}
سجّل دخولك الآن لاختيار العرض المناسب.
ASH HOLDING`,

  finance_offer_selected: `✅ تم اختيار عرض التمويل بنجاح!
الطلب: {{application_number}}
المبلغ: {{amount}} ريال
القسط الشهري: {{monthly}} ريال
المدة: {{tenor}} شهر
ASH HOLDING`,

  finance_offer_expired: `⚠️ انتهت صلاحية عروض التمويل لطلبك {{application_number}}.
يرجى تقديم طلب جديد.
ASH HOLDING`,

  // ===== Finance - Contract =====
  finance_contract_ready: `📄 عقد التمويل {{contract_number}} جاهز للتوقيع.
المبلغ: {{amount}} ريال
سجّل دخولك لإتمام التوقيع الإلكتروني.
ASH HOLDING`,

  finance_contract_signed: `🖊️ تم توقيع عقد التمويل {{contract_number}} بنجاح!
سيتم تفعيل العقد وصرف المبلغ قريباً.
ASH HOLDING`,

  finance_disbursed: `💸 تم صرف مبلغ التمويل!
المبلغ: {{amount}} ريال
تمت إضافته لمحفظتك بنجاح.
العقد: {{contract_number}}
ASH HOLDING`,

  // ===== Finance - Payments =====
  finance_payment_due: `📅 تذكير: قسط التمويل رقم {{installment}} مستحق في {{due_date}}.
المبلغ: {{amount}} ريال
العقد: {{contract_number}}
ASH HOLDING`,

  finance_payment_reminder: `⏰ تنبيه! يحين موعد سداد قسط التمويل غداً.
القسط رقم {{installment}}: {{amount}} ريال
يرجى التأكد من توفر الرصيد.
ASH HOLDING`,

  finance_payment_received: `✅ تم استلام سداد القسط رقم {{installment}} بنجاح.
المبلغ: {{amount}} ريال
الأقساط المتبقية: {{remaining}}
ASH HOLDING`,

  finance_payment_overdue: `🚨 تنبيه عاجل: قسط التمويل رقم {{installment}} متأخر!
المبلغ المستحق: {{amount}} ريال
يرجى السداد فوراً لتجنب الغرامات.
ASH HOLDING`,

  // ===== Payments =====
  payment_success: `✅ تم استلام دفعتكم بنجاح!
المبلغ: {{amount}} ريال
رقم العملية: {{transaction_id}}
ASH HOLDING`,

  payment_failed: `❌ لم تتم عملية الدفع.
يرجى المحاولة مرة أخرى.
ASH HOLDING`,

  wallet_topup: `🏦 إشعار إيداع - ASH HOLDING

تم إيداع مبلغ {{amount}} ر.س في محفظتكم بنجاح.

📅 التاريخ: {{date}}
⏰ الوقت: {{time}}
📝 نوع العملية: {{operation_type}}
💰 الرصيد الحالي: {{balance}} ر.س

━━━━━━━━━━━━━━
الإدارة المالية
ASH HOLDING`,

  wallet_withdrawal: `🏦 إشعار خصم - ASH HOLDING

تم خصم مبلغ {{amount}} ر.س من محفظتكم.

📅 التاريخ: {{date}}
⏰ الوقت: {{time}}
📝 نوع العملية: {{operation_type}}
💰 الرصيد المتبقي: {{balance}} ر.س

━━━━━━━━━━━━━━
الإدارة المالية
ASH HOLDING`,

  // ===== General =====
  account_update: `🔐 تم تحديث معلومات حسابك.
إذا لم تقم بهذا التغيير، تواصل معنا فوراً.
ASH HOLDING`,
};

// Format phone number
function formatPhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  
  if (cleaned.startsWith("00966")) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith("0")) {
    cleaned = "966" + cleaned.substring(1);
  } else if (cleaned.startsWith("5")) {
    cleaned = "966" + cleaned;
  }
  
  return cleaned;
}

// Replace template variables
function processTemplate(template: string, data: Record<string, string>): string {
  let message = template;
  for (const [key, value] of Object.entries(data)) {
    message = message.replace(new RegExp(`{{${key}}}`, "g"), value);
  }
  return message;
}

// Send SMS via Msegat
async function sendViaMsegat(
  phone: string,
  message: string,
  retries = 3
): Promise<{ success: boolean; response?: any; error?: string }> {
  const username = Deno.env.get("MSEGAT_USERNAME");
  const apiKey = Deno.env.get("MSEGAT_API_KEY");
  const senderId = Deno.env.get("MSEGAT_SENDER_ID");

  if (!username || !apiKey || !senderId) {
    console.error("Missing Msegat credentials");
    return { success: false, error: "Msegat credentials not configured" };
  }

  const payload = {
    apiKey: apiKey,
    userName: username,
    numbers: phone,
    userSender: senderId,
    msg: message,
    msgEncoding: "UTF8",
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Msegat SMS attempt ${attempt}: sending to ${phone}`);
      
      const response = await fetch(MSEGAT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log(`Msegat response (attempt ${attempt}):`, result);

      if (result.code === "1" || result.code === 1) {
        return { success: true, response: result };
      }

      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        continue;
      }

      return { success: false, response: result, error: result.message || "SMS send failed" };
    } catch (error) {
      console.error(`Msegat error (attempt ${attempt}):`, error);
      if (attempt === retries) {
        return { success: false, error: error.message };
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }

  return { success: false, error: "Max retries exceeded" };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { phone, message_type, template_data, custom_message }: NotificationRequest = await req.json();

    // Validate phone
    if (!phone) {
      return new Response(
        JSON.stringify({ success: false, error: "Phone number is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const formattedPhone = formatPhone(phone);

    // Get message content
    let messageContent: string;
    
    if (message_type === "custom" && custom_message) {
      messageContent = custom_message;
    } else if (TEMPLATES[message_type]) {
      messageContent = processTemplate(TEMPLATES[message_type], template_data || {});
    } else {
      return new Response(
        JSON.stringify({ success: false, error: `Invalid message type: ${message_type}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Sending ${message_type} SMS to ${formattedPhone}`);

    // Send SMS
    const smsResult = await sendViaMsegat(formattedPhone, messageContent);

    // Log the SMS
    await supabase.from("sms_logs").insert({
      phone: formattedPhone,
      message_type: message_type,
      message_content: messageContent,
      provider: "msegat",
      provider_response: smsResult.response,
      status: smsResult.success ? "sent" : "failed",
      error_message: smsResult.error,
      sent_at: smsResult.success ? new Date().toISOString() : null,
    });

    if (!smsResult.success) {
      console.error("SMS send failed:", smsResult.error);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to send notification",
          error_ar: "فشل في إرسال الإشعار",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("SMS sent successfully");
    return new Response(
      JSON.stringify({
        success: true,
        message: "Notification sent successfully",
        message_ar: "تم إرسال الإشعار بنجاح",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in sms-send-notification:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unexpected error occurred",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});