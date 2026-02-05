 import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
 import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
 };
 
 interface VerifyOTPRequest {
   phone: string;
   otp: string;
   purpose?: string;
 }
 
 // Hash OTP for comparison
 async function hashOTP(otp: string): Promise<string> {
   const encoder = new TextEncoder();
   const data = encoder.encode(otp);
   const hashBuffer = await crypto.subtle.digest("SHA-256", data);
   const hashArray = Array.from(new Uint8Array(hashBuffer));
   return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
 }
 
 // Validate and format phone number
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
 
     const { phone, otp, purpose = "login" }: VerifyOTPRequest = await req.json();
 
     // Validate inputs
     if (!phone || !otp) {
       return new Response(
         JSON.stringify({
           success: false,
           error: "رقم الهاتف ورمز التحقق مطلوبان",
           error_en: "Phone and OTP are required",
         }),
         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     // Validate OTP format (6 digits)
     if (!/^\d{6}$/.test(otp)) {
       return new Response(
         JSON.stringify({
           success: false,
           error: "رمز التحقق يجب أن يتكون من 6 أرقام",
           error_en: "OTP must be 6 digits",
         }),
         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     const formattedPhone = formatPhone(phone);
     const otpHash = await hashOTP(otp);
 
     // Get the latest unverified OTP for this phone
     const { data: otpRecord, error: fetchError } = await supabase
       .from("sms_otp_codes")
       .select("*")
       .eq("phone", formattedPhone)
       .eq("purpose", purpose)
       .eq("verified", false)
       .order("created_at", { ascending: false })
       .limit(1)
       .maybeSingle();
 
     if (fetchError) {
       console.error("Database error:", fetchError);
       throw new Error("Database error");
     }
 
     if (!otpRecord) {
       return new Response(
         JSON.stringify({
           success: false,
           error: "لم يتم العثور على رمز تحقق صالح. يرجى طلب رمز جديد.",
           error_en: "No valid OTP found. Please request a new code.",
         }),
         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     // Check if expired
     if (new Date(otpRecord.expires_at) < new Date()) {
       // Mark as expired
       await supabase
         .from("sms_otp_codes")
         .update({ verified: true })
         .eq("id", otpRecord.id);
 
       return new Response(
         JSON.stringify({
           success: false,
           error: "انتهت صلاحية رمز التحقق. يرجى طلب رمز جديد.",
           error_en: "OTP has expired. Please request a new code.",
         }),
         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     // Check max attempts
     if (otpRecord.attempts >= otpRecord.max_attempts) {
       await supabase
         .from("sms_otp_codes")
         .update({ verified: true })
         .eq("id", otpRecord.id);
 
       return new Response(
         JSON.stringify({
           success: false,
           error: "تم تجاوز الحد الأقصى للمحاولات. يرجى طلب رمز جديد.",
           error_en: "Maximum attempts exceeded. Please request a new code.",
         }),
         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     // Verify OTP hash
     if (otpRecord.otp_hash !== otpHash) {
       // Increment attempts
       await supabase
         .from("sms_otp_codes")
         .update({ attempts: otpRecord.attempts + 1 })
         .eq("id", otpRecord.id);
 
       const remainingAttempts = otpRecord.max_attempts - otpRecord.attempts - 1;
 
       return new Response(
         JSON.stringify({
           success: false,
           error: `رمز التحقق غير صحيح. المحاولات المتبقية: ${remainingAttempts}`,
           error_en: `Invalid OTP. Remaining attempts: ${remainingAttempts}`,
           remaining_attempts: remainingAttempts,
         }),
         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     // OTP is valid - mark as verified
     await supabase
       .from("sms_otp_codes")
       .update({
         verified: true,
         verified_at: new Date().toISOString(),
       })
       .eq("id", otpRecord.id);
 
     // Generate session token (simple implementation - can be enhanced)
     const sessionToken = crypto.randomUUID();
 
     return new Response(
       JSON.stringify({
         success: true,
         message: "تم التحقق بنجاح",
         message_en: "Verification successful",
         phone: formattedPhone,
         session_token: sessionToken,
         verified_at: new Date().toISOString(),
       }),
       { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   } catch (error) {
     console.error("Error in sms-verify-otp:", error);
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