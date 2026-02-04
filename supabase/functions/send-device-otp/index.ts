import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerificationRequest {
  email: string;
  userId: string;
  deviceFingerprint: string;
  purpose: 'device_verification' | '2fa_login' | 'security_action';
  userName?: string;
}

// Generate a 6-digit code
const generateCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, userId, deviceFingerprint, purpose, userName }: VerificationRequest = await req.json();

    // Validate required fields
    if (!email || !userId || !deviceFingerprint) {
      throw new Error("Missing required fields: email, userId, deviceFingerprint");
    }

    // Generate verification code
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete old unused codes for this user/device
    await supabase
      .from('device_verification_codes')
      .delete()
      .eq('user_id', userId)
      .eq('device_fingerprint', deviceFingerprint)
      .eq('used', false);

    // Store the code in database
    const { error: insertError } = await supabase
      .from('device_verification_codes')
      .insert({
        user_id: userId,
        device_fingerprint: deviceFingerprint,
        code: code,
        expires_at: expiresAt.toISOString(),
        used: false
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error("Failed to store verification code");
    }

    // Determine email content based on purpose
    let subject = 'رمز التحقق الخاص بك - ASH ID';
    let purposeText = 'التحقق من حسابك';
    let purposeIcon = '🔐';
    
    if (purpose === 'device_verification') {
      subject = 'تم اكتشاف جهاز جديد - ASH ID';
      purposeText = 'تسجيل الدخول من جهاز جديد';
      purposeIcon = '📱';
    } else if (purpose === '2fa_login') {
      subject = 'رمز التحقق بخطوتين - ASH ID';
      purposeText = 'التحقق بخطوتين لتسجيل الدخول';
      purposeIcon = '🛡️';
    } else if (purpose === 'security_action') {
      subject = 'تأكيد الإجراء الأمني - ASH ID';
      purposeText = 'تأكيد إجراء أمني مهم';
      purposeIcon = '⚠️';
    }

    // Send email with verification code
    const emailResponse = await resend.emails.send({
      from: "ASH Security <security@alsaleh-holding.com>",
      to: [email],
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
          <div style="max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
            
            <!-- Header -->
            <div style="padding: 30px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <div style="display: inline-block; padding: 12px; background: rgba(14, 165, 233, 0.2); border-radius: 12px; margin-bottom: 16px;">
                <span style="font-size: 32px;">${purposeIcon}</span>
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">ASH ID</h1>
              <p style="color: rgba(255,255,255,0.6); margin: 8px 0 0; font-size: 14px;">نظام الهوية الرقمية الآمن</p>
            </div>
            
            <!-- Body -->
            <div style="padding: 30px;">
              <p style="color: rgba(255,255,255,0.8); font-size: 16px; margin: 0 0 20px;">
                مرحباً ${userName || 'عزيزي العميل'}،
              </p>
              <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 0 0 30px;">
                تم طلب ${purposeText}. استخدم الرمز التالي للمتابعة:
              </p>
              
              <!-- Code Box -->
              <div style="background: rgba(14, 165, 233, 0.1); border: 2px dashed rgba(14, 165, 233, 0.3); border-radius: 12px; padding: 25px; text-align: center; margin-bottom: 30px;">
                <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 2px;">رمز التحقق</p>
                <div style="font-family: 'Courier New', monospace; font-size: 40px; font-weight: bold; color: #0ea5e9; letter-spacing: 8px; direction: ltr;">
                  ${code}
                </div>
              </div>
              
              <!-- Warning -->
              <div style="background: rgba(251, 146, 60, 0.1); border-right: 4px solid #fb923c; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                <p style="color: #fb923c; font-size: 13px; margin: 0;">
                  ⚠️ هذا الرمز صالح لمدة <strong>10 دقائق فقط</strong>
                </p>
              </div>
              
              <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin: 0;">
                إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة أو التواصل مع فريق الدعم.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="padding: 20px 30px; background: rgba(0,0,0,0.2); text-align: center;">
              <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} الصالح القابضة - جميع الحقوق محفوظة
              </p>
              <p style="color: rgba(255,255,255,0.3); font-size: 11px; margin: 8px 0 0;">
                هذه رسالة آلية، يرجى عدم الرد عليها
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Verification email sent successfully:", emailResponse);

    // Log the activity
    await supabase
      .from('account_activity_log')
      .insert({
        user_id: userId,
        activity_type: 'verification_code_sent',
        device_fingerprint: deviceFingerprint,
        metadata: { purpose, email_masked: email.replace(/(.{2})(.*)(@.*)/, '$1***$3') },
        risk_level: 'medium'
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Verification code sent successfully',
        expiresAt: expiresAt.toISOString()
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-device-otp function:", error);
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
