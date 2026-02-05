 import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
 import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
 };
 
 const MSEGAT_API_URL = "https://www.msegat.com/gw/sendsms.php";
 
 interface NotificationRequest {
   phone: string;
   message_type: "order_status" | "payment_success" | "payment_failed" | "account_update" | "custom";
   template_data?: Record<string, string>;
   custom_message?: string;
 }
 
 // Message templates
 const TEMPLATES: Record<string, string> = {
   order_status: `عميلنا العزيز،\n\nتم تحديث حالة طلبك رقم {{order_number}} إلى: {{status}}\n\nشكراً لثقتكم\nASH Holding`,
   
   payment_success: `عميلنا العزيز،\n\nتم استلام دفعتكم بنجاح بمبلغ {{amount}} ريال.\n\nرقم العملية: {{transaction_id}}\n\nشكراً لثقتكم\nASH Holding`,
   
   payment_failed: `عميلنا العزيز،\n\nلم يتم إتمام عملية الدفع.\n\nيرجى المحاولة مرة أخرى أو التواصل معنا.\n\nASH Holding`,
   
   account_update: `عميلنا العزيز،\n\nتم تحديث معلومات حسابك بنجاح.\n\nإذا لم تقم بهذا التغيير، يرجى التواصل معنا فوراً.\n\nASH Holding`,
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
     // Verify authorization (service role or authenticated user)
     const authHeader = req.headers.get("Authorization");
     if (!authHeader?.startsWith("Bearer ")) {
       return new Response(
         JSON.stringify({ success: false, error: "Unauthorized" }),
         { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
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
         JSON.stringify({ success: false, error: "Invalid message type or missing custom message" }),
         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
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
       return new Response(
         JSON.stringify({
           success: false,
           error: "Failed to send notification",
           error_ar: "فشل في إرسال الإشعار",
         }),
         { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
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