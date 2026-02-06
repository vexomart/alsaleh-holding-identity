import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MSEGAT_API_URL = "https://www.msegat.com/gw/sendsms.php";

// Message Types
type MessageType = 
  // Orders
  | "order_created" | "order_confirmed" | "order_processing" | "order_completed" | "order_cancelled"
  // Contracts
  | "contract_created" | "contract_approved" | "contract_rejected" | "contract_pending_signature" 
  | "contract_signed" | "contract_active" | "contract_expired"
  // Finance
  | "finance_submitted" | "finance_approved" | "finance_rejected" | "finance_offer_ready"
  | "finance_contract_ready" | "finance_disbursed" | "finance_payment_due" 
  | "finance_payment_reminder" | "finance_payment_received" | "finance_payment_overdue"
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
  // ===== Orders =====
  order_created: `✨ عميلنا العزيز،
تم استلام طلبكم رقم {{order_number}} بنجاح.
سيتم مراجعته قريباً.
ASH Holding`,

  order_confirmed: `✅ تم تأكيد طلبكم رقم {{order_number}}.
قيمة الطلب: {{amount}} ريال
سيتم التواصل معكم قريباً.
ASH Holding`,

  order_processing: `⚙️ طلبكم رقم {{order_number}} قيد التنفيذ الآن.
تابعوا حالة الطلب عبر حسابكم.
ASH Holding`,

  order_completed: `🎉 تم إنجاز طلبكم رقم {{order_number}} بنجاح!
شكراً لثقتكم بنا.
ASH Holding`,

  order_cancelled: `❌ تم إلغاء طلبكم رقم {{order_number}}.
للاستفسار: info@ash-holding.sa
ASH Holding`,

  order_status: `عميلنا العزيز،
تم تحديث حالة طلبك رقم {{order_number}} إلى: {{status}}
شكراً لثقتكم
ASH Holding`,

  // ===== Contracts =====
  contract_created: `📄 تم إنشاء عقد جديد رقم {{contract_number}}.
يرجى مراجعته في حسابكم.
ASH Holding`,

  contract_approved: `✅ تمت الموافقة على عقدكم رقم {{contract_number}}.
يمكنكم الآن التوقيع عليه.
ASH Holding`,

  contract_rejected: `❌ تم رفض العقد رقم {{contract_number}}.
السبب: {{reason}}
للتواصل: info@ash-holding.sa
ASH Holding`,

  contract_pending_signature: `✍️ عقدكم رقم {{contract_number}} جاهز للتوقيع.
يرجى تسجيل الدخول لإتمام التوقيع.
ASH Holding`,

  contract_signed: `🖊️ تم توقيع العقد رقم {{contract_number}} بنجاح!
سيتم تفعيله قريباً.
ASH Holding`,

  contract_active: `🟢 عقدكم رقم {{contract_number}} أصبح نشطاً الآن!
ASH Holding`,

  contract_expired: `⚠️ انتهت صلاحية عقدكم رقم {{contract_number}}.
للتجديد تواصلوا معنا.
ASH Holding`,

  // ===== Finance =====
  finance_submitted: `📝 تم استلام طلب التمويل رقم {{application_number}}.
سيتم مراجعته خلال 48 ساعة.
ASH Holding`,

  finance_approved: `🎉 مبروك! تمت الموافقة على طلب التمويل {{application_number}}.
المبلغ: {{amount}} ريال
القسط الشهري: {{monthly}} ريال
ASH Holding`,

  finance_rejected: `❌ لم تتم الموافقة على طلب التمويل {{application_number}}.
للمزيد: info@ash-holding.sa
ASH Holding`,

  finance_offer_ready: `💰 عروض التمويل جاهزة لطلبكم {{application_number}}.
سجّل دخولك الآن لاختيار العرض المناسب.
ASH Holding`,

  finance_contract_ready: `📄 عقد التمويل {{contract_number}} جاهز للتوقيع.
سجّل دخولك لإتمام العملية.
ASH Holding`,

  finance_disbursed: `💸 تم صرف مبلغ التمويل {{amount}} ريال في محفظتكم!
ASH Holding`,

  finance_payment_due: `📅 تذكير: قسط التمويل رقم {{installment}} مستحق في {{due_date}}.
المبلغ: {{amount}} ريال
ASH Holding`,

  finance_payment_reminder: `⏰ يحين موعد سداد قسط التمويل غداً.
القسط رقم {{installment}}: {{amount}} ريال
ASH Holding`,

  finance_payment_received: `✅ تم استلام سداد القسط رقم {{installment}} بنجاح.
المتبقي: {{remaining}} قسط
ASH Holding`,

  finance_payment_overdue: `🚨 تنبيه: قسط التمويل رقم {{installment}} متأخر!
المبلغ المستحق: {{amount}} ريال
يرجى السداد فوراً.
ASH Holding`,

  // ===== Payments =====
  payment_success: `✅ تم استلام دفعتكم بنجاح!
المبلغ: {{amount}} ريال
رقم العملية: {{transaction_id}}
ASH Holding`,

  payment_failed: `❌ لم تتم عملية الدفع.
يرجى المحاولة مرة أخرى.
ASH Holding`,

  wallet_topup: `💳 تم شحن محفظتكم بنجاح!
المبلغ: {{amount}} ريال
الرصيد الجديد: {{balance}} ريال
ASH Holding`,

  wallet_withdrawal: `💸 تم تحويل {{amount}} ريال من محفظتكم.
الرصيد المتبقي: {{balance}} ريال
ASH Holding`,

  // ===== General =====
  account_update: `🔐 تم تحديث معلومات حسابك.
إذا لم تقم بهذا التغيير، تواصل معنا فوراً.
ASH Holding`,
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