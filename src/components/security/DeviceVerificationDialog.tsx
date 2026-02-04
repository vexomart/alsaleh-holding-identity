/**
 * Device Verification Dialog
 * Shows when logging in from a new device
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Shield,
  Smartphone,
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeviceVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  deviceFingerprint: string;
  email: string;
  onVerified: () => void;
  onSkip?: () => void;
}

export const DeviceVerificationDialog = ({
  open,
  onOpenChange,
  userId,
  deviceFingerprint,
  email,
  onVerified,
  onSkip
}: DeviceVerificationDialogProps) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendVerificationCode = async () => {
    setIsSending(true);
    try {
      // Generate code using database function
      const { data, error } = await supabase.rpc('generate_device_verification_code', {
        p_user_id: userId,
        p_device_fingerprint: deviceFingerprint
      });

      if (error) throw error;

      // Send email with code
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          to: email,
          subject: 'رمز التحقق من الجهاز الجديد',
          html: `
            <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>رمز التحقق من الجهاز</h2>
              <p>تم اكتشاف محاولة تسجيل دخول من جهاز جديد.</p>
              <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; background: #f5f5f5; padding: 20px; text-align: center; border-radius: 8px;">
                ${data}
              </p>
              <p>هذا الرمز صالح لمدة 10 دقائق.</p>
              <p style="color: #666;">إذا لم تقم بهذه المحاولة، يرجى تجاهل هذه الرسالة.</p>
            </div>
          `
        }
      });

      if (emailError) {
        console.error('Email error:', emailError);
        // Still show success since code was generated
      }

      toast.success('تم إرسال رمز التحقق');
      setCountdown(60);
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast.error('فشل في إرسال رمز التحقق');
    } finally {
      setIsSending(false);
    }
  };

  const verifyCode = async () => {
    if (code.length !== 6) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('verify_device_code', {
        p_user_id: userId,
        p_device_fingerprint: deviceFingerprint,
        p_code: code
      });

      if (error) throw error;

      if (data) {
        toast.success('تم التحقق بنجاح');
        onVerified();
        onOpenChange(false);
      } else {
        setAttempts(prev => prev + 1);
        if (attempts >= 2) {
          toast.error('تم تجاوز عدد المحاولات المسموحة');
          onOpenChange(false);
        } else {
          toast.error('رمز التحقق غير صحيح');
        }
        setCode('');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      toast.error('فشل في التحقق');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      sendVerificationCode();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">جهاز جديد</DialogTitle>
          <DialogDescription>
            تم اكتشاف تسجيل دخول من جهاز جديد. أدخل رمز التحقق المرسل إلى بريدك.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex justify-center">
            <InputOTP
              value={code}
              onChange={setCode}
              maxLength={6}
              disabled={isLoading}
            >
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={verifyCode}
              disabled={code.length !== 6 || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 ml-2" />
                  تحقق
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={sendVerificationCode}
              disabled={isSending || countdown > 0}
              className="w-full"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : countdown > 0 ? (
                <span>إعادة الإرسال ({countdown})</span>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 ml-2" />
                  إعادة إرسال الرمز
                </>
              )}
            </Button>

            {onSkip && (
              <Button
                variant="ghost"
                onClick={onSkip}
                className="w-full text-muted-foreground"
              >
                تخطي الآن
              </Button>
            )}
          </div>

          {attempts > 0 && (
            <div className={cn(
              "p-3 rounded-lg text-sm flex items-center gap-2",
              attempts >= 2 
                ? "bg-destructive/10 text-destructive" 
                : "bg-yellow-500/10 text-yellow-600"
            )}>
              <AlertTriangle className="h-4 w-4" />
              <span>المحاولات المتبقية: {3 - attempts}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
