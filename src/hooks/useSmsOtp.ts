 import { useState, useCallback } from "react";
 import { supabase } from "@/integrations/supabase/client";
 
 interface SendOtpResult {
   success: boolean;
   message?: string;
   error?: string;
   expires_in?: number;
 }
 
interface VerifyOtpResult {
  success: boolean;
  message?: string;
  error?: string;
  session_token?: string;
  remaining_attempts?: number;
  user_id?: string;
  email?: string;
  is_new_user?: boolean;
  magic_link_token?: string;
  action_link?: string;
}
 
 interface SendNotificationResult {
   success: boolean;
   message?: string;
   error?: string;
 }
 
 export function useSmsOtp() {
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
 
   /**
    * Send OTP to a phone number
    */
   const sendOtp = useCallback(async (
     phone: string,
     purpose: string = "login"
   ): Promise<SendOtpResult> => {
     setIsLoading(true);
     setError(null);
 
     try {
       const { data, error: fnError } = await supabase.functions.invoke("sms-send-otp", {
         body: { phone, purpose },
       });
 
       if (fnError) {
         throw new Error(fnError.message);
       }
 
       if (!data.success) {
         setError(data.error);
         return data;
       }
 
       return data;
     } catch (err: any) {
       const errorMsg = err.message || "فشل في إرسال رمز التحقق";
       setError(errorMsg);
       return { success: false, error: errorMsg };
     } finally {
       setIsLoading(false);
     }
   }, []);
 
  /**
   * Verify OTP code
   */
  const verifyOtp = useCallback(async (
    phone: string,
    otp: string,
    purpose: string = "login",
    name?: string // Added: customer name for registration
  ): Promise<VerifyOtpResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("sms-verify-otp", {
        body: { phone, otp, purpose, name },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (!data.success) {
        setError(data.error);
        return data;
      }

      return data;
    } catch (err: any) {
      const errorMsg = err.message || "فشل في التحقق من الرمز";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);
 
   /**
    * Send status notification SMS
    */
   const sendNotification = useCallback(async (
     phone: string,
     messageType: "order_status" | "payment_success" | "payment_failed" | "account_update" | "custom",
     templateData?: Record<string, string>,
     customMessage?: string
   ): Promise<SendNotificationResult> => {
     setIsLoading(true);
     setError(null);
 
     try {
       const { data, error: fnError } = await supabase.functions.invoke("sms-send-notification", {
         body: {
           phone,
           message_type: messageType,
           template_data: templateData,
           custom_message: customMessage,
         },
       });
 
       if (fnError) {
         throw new Error(fnError.message);
       }
 
       if (!data.success) {
         setError(data.error);
         return data;
       }
 
       return data;
     } catch (err: any) {
       const errorMsg = err.message || "فشل في إرسال الإشعار";
       setError(errorMsg);
       return { success: false, error: errorMsg };
     } finally {
       setIsLoading(false);
     }
   }, []);
 
   return {
     sendOtp,
     verifyOtp,
     sendNotification,
     isLoading,
     error,
     clearError: () => setError(null),
   };
 }