 import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
 import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
 };
 
 // Msegat API endpoint
 const MSEGAT_API_URL = "https://www.msegat.com/gw/sendsms.php";
 
 interface SendOTPRequest {
   phone: string;
   purpose?: string;
 }
 
 // Generate secure 6-digit OTP
 function generateOTP(): string {
   const array = new Uint32Array(1);
   crypto.getRandomValues(array);
   return String(array[0] % 1000000).padStart(6, "0");
 }
 
 // Hash OTP for secure storage
 async function hashOTP(otp: string): Promise<string> {
   const encoder = new TextEncoder();
   const data = encoder.encode(otp);
   const hashBuffer = await crypto.subtle.digest("SHA-256", data);
   const hashArray = Array.from(new Uint8Array(hashBuffer));
   return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
 }
 
 // Validate Saudi phone number
 function validatePhone(phone: string): { valid: boolean; formatted: string } {
   // Remove all non-digits
   let cleaned = phone.replace(/\D/g, "");
   
   // Handle different formats
   if (cleaned.startsWith("00966")) {
     cleaned = cleaned.substring(2);
   } else if (cleaned.startsWith("966")) {
     // Already correct
   } else if (cleaned.startsWith("0")) {
     cleaned = "966" + cleaned.substring(1);
   } else if (cleaned.startsWith("5")) {
     cleaned = "966" + cleaned;
   }
   
   // Validate Saudi number format (966 + 5X + 7 digits)
   const isValid = /^966[5][0-9]{8}$/.test(cleaned);
   
   return { valid: isValid, formatted: cleaned };
 }
 
 // Send SMS via Msegat with retry logic
 async function sendViaMsegat(
   phone: string,
   message: string,
   retries = 3
 ): Promise<{ success: boolean; response?: any; error?: string }> {
   const username = Deno.env.get("MSEGAT_USERNAME");
   const apiKey = Deno.env.get("MSEGAT_API_KEY");
   const senderId = Deno.env.get("MSEGAT_SENDER_ID");
 
  console.log("Msegat config check:", {
    hasUsername: !!username,
    hasApiKey: !!apiKey,
    hasSenderId: !!senderId,
    senderId: senderId,
  });

   if (!username || !apiKey || !senderId) {
    console.error("Missing Msegat credentials");
    return { success: false, error: "بيانات Msegat غير مكتملة" };
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
      console.log(`Msegat attempt ${attempt}: sending to ${phone}`);
      
       const response = await fetch(MSEGAT_API_URL, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(payload),
       });
 
      const responseText = await response.text();
      console.log(`Msegat raw response (attempt ${attempt}):`, responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        console.error("Failed to parse Msegat response:", responseText);
        return { success: false, error: "Invalid response from SMS provider" };
      }
      
      console.log(`Msegat parsed response (attempt ${attempt}):`, result);
 
       // Msegat returns code 1 for success
       if (result.code === "1" || result.code === 1) {
         return { success: true, response: result };
       }
 
       // If not successful and more retries available, wait and retry
       if (attempt < retries) {
         await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
         continue;
       }
 
      return { success: false, response: result, error: result.message || result.Message || "فشل إرسال الرسالة" };
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
 
     const { phone, purpose = "login" }: SendOTPRequest = await req.json();
 
     // Validate phone
     const phoneValidation = validatePhone(phone);
     if (!phoneValidation.valid) {
       return new Response(
         JSON.stringify({
           success: false,
           error: "رقم الهاتف غير صحيح",
           error_en: "Invalid phone number",
         }),
         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
      const formattedPhone = phoneValidation.formatted;

      // For login purpose, check if user exists first
      if (purpose === "login") {
        // Try multiple phone formats to find existing profile
        const phoneFormats = [
          formattedPhone,                    // 966555812567
          `0${formattedPhone.slice(3)}`,     // 0555812567
          `+${formattedPhone}`,              // +966555812567
          formattedPhone.slice(3),           // 555812567
          `+966${formattedPhone.slice(3)}`,  // +966555812567 (with plus)
        ];
        
        console.log("Checking for existing user with formats:", phoneFormats);
        
        // Use OR query for all formats at once (more efficient)
        const { data: profileByPhone } = await supabase
          .from("profiles")
          .select("id")
          .or(phoneFormats.map(f => `phone.eq.${f}`).join(','))
          .limit(1)
          .maybeSingle();
        
        let userExists = !!profileByPhone;
        
        // If not found, try LIKE search
        if (!userExists) {
          const { data: profileByLike } = await supabase
            .from("profiles")
            .select("id")
            .or(`phone.like.%${formattedPhone.slice(-9)}%,phone.like.%${formattedPhone.slice(3)}%`)
            .limit(1)
            .maybeSingle();
          
          userExists = !!profileByLike;
        }
        
        if (!userExists) {
          // Also check synthetic email
          const syntheticEmail = `phone_${formattedPhone}@ash.local`;
          const { data: existingUser } = await supabase.auth.admin.listUsers();
          const userByEmail = existingUser?.users?.find(u => u.email === syntheticEmail);
          
          if (!userByEmail) {
            return new Response(
              JSON.stringify({
                success: false,
                error: "لا يوجد حساب مرتبط بهذا الرقم. يرجى إنشاء حساب جديد.",
                error_en: "No account found with this phone. Please register first.",
              }),
              { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }
        
        console.log("User exists:", userExists);
      }

      // Rate limiting: Check recent OTP requests
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { count: recentCount } = await supabase
        .from("sms_otp_codes")
        .select("*", { count: "exact", head: true })
        .eq("phone", formattedPhone)
        .gte("created_at", fiveMinutesAgo);

      if (recentCount && recentCount >= 3) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "تم تجاوز الحد الأقصى للطلبات. يرجى الانتظار 5 دقائق.",
            error_en: "Rate limit exceeded. Please wait 5 minutes.",
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
 
     // Generate OTP
     const otp = generateOTP();
     const otpHash = await hashOTP(otp);
     const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes
 
     // Invalidate previous OTPs for this phone
     await supabase
       .from("sms_otp_codes")
       .update({ verified: true })
       .eq("phone", formattedPhone)
       .eq("verified", false);
 
     // Store OTP in database
     // Extract first IP from potentially comma-separated list
     const rawIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null;
     const clientIp = rawIp ? rawIp.split(",")[0].trim() : null;

     const { error: insertError } = await supabase.from("sms_otp_codes").insert({
       phone: formattedPhone,
       otp_hash: otpHash,
       expires_at: expiresAt,
       purpose: purpose,
       ip_address: clientIp,
       user_agent: req.headers.get("user-agent"),
     });
 
     if (insertError) {
       console.error("Database error:", insertError);
       throw new Error("Failed to store OTP");
     }
 
     // Create SMS message
     const message = `رمز التحقق الخاص بك هو: ${otp}\n\nصالح لمدة 5 دقائق.\nASH Holding`;
 
     // Send SMS via Msegat
     const smsResult = await sendViaMsegat(formattedPhone, message);
 
     // Log SMS attempt
     await supabase.from("sms_logs").insert({
       phone: formattedPhone,
       message_type: "otp",
       message_content: message,
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
           error: "فشل في إرسال رمز التحقق. يرجى المحاولة مرة أخرى.",
           error_en: "Failed to send OTP. Please try again.",
         }),
         { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     return new Response(
       JSON.stringify({
         success: true,
         message: "تم إرسال رمز التحقق بنجاح",
         message_en: "OTP sent successfully",
         expires_in: 300, // 5 minutes in seconds
       }),
       { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   } catch (error) {
     console.error("Error in sms-send-otp:", error);
     return new Response(
       JSON.stringify({
         success: false,
         error: "حدث خطأ غير متوقع",
         error_en: error.message || "Unexpected error occurred",
       }),
       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   }
 });