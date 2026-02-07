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
  name?: string; // Added: customer name for registration
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

// Generate a synthetic email from phone number
function generateSyntheticEmail(phone: string): string {
  return `phone_${phone}@ash.local`;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { phone, otp, purpose = "login", name }: VerifyOTPRequest = await req.json();

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

    // Now create or get user and generate session
    const syntheticEmail = generateSyntheticEmail(formattedPhone);
    
    // Try multiple phone formats to find existing profile
    const phoneFormats = [
      formattedPhone,                    // 966555812567
      `0${formattedPhone.slice(3)}`,     // 0555812567
      `+${formattedPhone}`,              // +966555812567
      formattedPhone.slice(3),           // 555812567
      `+966${formattedPhone.slice(3)}`,  // +966555812567 (with plus)
    ];
    
    console.log("Searching for profile with phone formats:", phoneFormats);
    
    // Check if user exists by phone in profiles (try multiple formats)
    let existingProfile = null;
    
    // First, try using OR query for all formats at once (more efficient)
    const { data: profileByPhone } = await supabase
      .from("profiles")
      .select("id, email, full_name, phone")
      .or(phoneFormats.map(f => `phone.eq.${f}`).join(','))
      .limit(1)
      .maybeSingle();
    
    if (profileByPhone) {
      existingProfile = profileByPhone;
      console.log("Found existing profile:", profileByPhone.id, "phone:", profileByPhone.phone);
    }
    
    // If not found by phone, also search by normalized phone in case of data inconsistency
    if (!existingProfile) {
      // Try LIKE search for partial match
      const { data: profileByLike } = await supabase
        .from("profiles")
        .select("id, email, full_name, phone")
        .or(`phone.like.%${formattedPhone.slice(-9)}%,phone.like.%${formattedPhone.slice(3)}%`)
        .limit(1)
        .maybeSingle();
      
      if (profileByLike) {
        existingProfile = profileByLike;
        console.log("Found profile by LIKE search:", profileByLike.id);
      }
    }

    let userId: string;
    let userEmail: string;
    let userName: string | null = null;
    let isNewUser = false;

    if (existingProfile) {
      // User exists - use their ID and name
      userId = existingProfile.id;
      userEmail = existingProfile.email || syntheticEmail;
      userName = existingProfile.full_name;
      console.log("Found existing user by phone:", userId, "Name:", userName);
    } else {
      // Check if user exists by synthetic email in auth.users
      const { data: existingUser } = await supabase.auth.admin.listUsers();
      const userByEmail = existingUser?.users?.find(u => u.email === syntheticEmail);
      
      if (userByEmail) {
        userId = userByEmail.id;
        userEmail = syntheticEmail;
        userName = userByEmail.user_metadata?.full_name || null;
        console.log("Found existing user by email:", userId);
        
        // Update profile with phone if it doesn't have one
        await supabase.from("profiles").upsert({
          id: userId,
          phone: formattedPhone,
        }, { onConflict: 'id' });
      } else {
        // This is a new user logging in with phone - they should register first
        // For login purpose, we need existing user
        if (purpose === "login") {
          return new Response(
            JSON.stringify({
              success: false,
              error: "لا يوجد حساب مرتبط بهذا الرقم. يرجى إنشاء حساب جديد أولاً.",
              error_en: "No account found with this phone. Please register first.",
            }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        // For registration purpose, create new user
        const tempPassword = crypto.randomUUID();
        // Use provided name or fallback to default
        const customerName = name?.trim() || `مستخدم ${formattedPhone.slice(-4)}`;
        
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: syntheticEmail,
          password: tempPassword,
          email_confirm: true,
          phone: `+${formattedPhone}`,
          phone_confirm: true,
          user_metadata: {
            phone: formattedPhone,
            full_name: customerName,
            created_via: 'sms_otp',
          },
        });

        if (createError || !newUser.user) {
          console.error("Error creating user:", createError);
          return new Response(
            JSON.stringify({
              success: false,
              error: "فشل في إنشاء الحساب. يرجى المحاولة مرة أخرى.",
              error_en: "Failed to create account. Please try again.",
            }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        userId = newUser.user.id;
        userEmail = syntheticEmail;
        userName = customerName;
        isNewUser = true;
        console.log("Created new user:", userId, "Name:", customerName);

        // Create profile for new user
        await supabase.from("profiles").upsert({
          id: userId,
          email: syntheticEmail,
          phone: formattedPhone,
          full_name: customerName,
          preferred_language: 'ar',
          is_active: true,
        });

        // Assign customer role
        await supabase.from("user_roles").insert({
          user_id: userId,
          role: 'customer',
        });

        // Send welcome email to new user (async, don't block registration)
        try {
          // Get real email from profile if exists
          const { data: profileData } = await supabase
            .from("profiles")
            .select("email")
            .eq("id", userId)
            .maybeSingle();
          
          const realEmail = profileData?.email && !profileData.email.endsWith('@ash.local') 
            ? profileData.email 
            : null;
          
          if (realEmail) {
            console.log("Sending welcome email to:", realEmail);
            await supabase.functions.invoke('wallet-email-notifications', {
              body: {
                type: 'welcome',
                customer_email: realEmail,
                customer_name: customerName,
                data: {
                  user_id: userId,
                  welcome_message: 'مرحباً بك في ASH HOLDING! تم إنشاء حسابك بنجاح ويمكنك الآن الاستفادة من جميع خدماتنا.',
                  initial_balance: 0,
                  wallet_features: [
                    'طلب الخدمات المتنوعة',
                    'متابعة حالة الطلبات',
                    'إدارة العقود والفواتير',
                    'محفظة رقمية آمنة'
                  ]
                }
              }
            });
            console.log("Welcome email sent successfully");
          } else {
            console.log("No real email found for user, skipping welcome email");
          }
        } catch (emailError) {
          // Don't fail registration if email fails
          console.error("Failed to send welcome email:", emailError);
        }

        // Send welcome SMS to new user
        try {
          console.log("Sending welcome SMS to:", formattedPhone);
          await supabase.functions.invoke('sms-send-notification', {
            body: {
              phone: formattedPhone,
              message_type: 'welcome',
              template_data: {
                name: customerName
              }
            }
          });
          console.log("Welcome SMS sent successfully");
        } catch (smsError) {
          // Don't fail registration if SMS fails
          console.error("Failed to send welcome SMS:", smsError);
        }
      }
    }

    // Generate magic link or session
    // Use generateLink to create a magic link that we can use to sign in
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: userEmail,
      options: {
        redirectTo: `${supabaseUrl.replace('.supabase.co', '')}/app`,
      },
    });

    if (linkError) {
      console.error("Error generating link:", linkError);
      // Fallback - just return success and let frontend handle
      return new Response(
        JSON.stringify({
          success: true,
          message: "تم التحقق بنجاح",
          message_en: "Verification successful",
          phone: formattedPhone,
          user_id: userId,
          is_new_user: isNewUser,
          verified_at: new Date().toISOString(),
          // Return token properties from link for client-side session
          access_token: linkData?.properties?.hashed_token,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract the token from the action link
    const actionLink = linkData?.properties?.action_link || '';
    const tokenMatch = actionLink.match(/token=([^&]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    console.log("Generated magic link for user:", userId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "تم التحقق بنجاح",
        message_en: "Verification successful",
        phone: formattedPhone,
        user_id: userId,
        email: userEmail,
        is_new_user: isNewUser,
        verified_at: new Date().toISOString(),
        // Return the magic link token for client to use
        magic_link_token: token,
        action_link: actionLink,
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
