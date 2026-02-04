/**
 * Enhanced Two-Factor Authentication Settings Component
 * With email OTP verification
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTwoFactorAuth } from '@/hooks/useTwoFactorAuth';
import { getDeviceFingerprint } from '@/hooks/useDeviceFingerprint';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Shield,
  ShieldCheck,
  ShieldOff,
  Mail,
  Smartphone,
  Key,
  Loader2,
  AlertTriangle,
  Send,
  Clock,
  CheckCircle2,
  RefreshCw,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const methods = [
  {
    id: 'email',
    label: 'البريد الإلكتروني',
    description: 'استلم رمز التحقق على بريدك الإلكتروني',
    icon: Mail,
    available: true
  },
  {
    id: 'sms',
    label: 'رسالة نصية',
    description: 'استلم رمز التحقق على هاتفك',
    icon: Smartphone,
    available: false
  },
  {
    id: 'authenticator',
    label: 'تطبيق المصادقة',
    description: 'استخدم تطبيق مثل Google Authenticator',
    icon: Key,
    available: false
  }
];

export const TwoFactorSettings = () => {
  const { 
    is2FAEnabled, 
    method, 
    isLoading, 
    verificationState,
    enable2FA, 
    disable2FA, 
    updateMethod,
    sendVerificationCode,
    verifyCode,
    resetVerificationState
  } = useTwoFactorAuth();

  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [pendingAction, setPendingAction] = useState<'enable' | 'disable' | null>(null);

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (!verificationState.expiresAt) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((verificationState.expiresAt!.getTime() - Date.now()) / 1000));
      setTimeLeft(remaining);
      
      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [verificationState.expiresAt]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggle = async () => {
    if (is2FAEnabled) {
      setShowDisableDialog(true);
    } else {
      // Send verification code first
      setPendingAction('enable');
      const deviceInfo = getDeviceFingerprint();
      const sent = await sendVerificationCode(deviceInfo.fingerprint, 'security_action');
      if (sent) {
        setShowVerifyDialog(true);
      }
    }
  };

  const handleDisable = async () => {
    setPendingAction('disable');
    const deviceInfo = getDeviceFingerprint();
    const sent = await sendVerificationCode(deviceInfo.fingerprint, 'security_action');
    if (sent) {
      setShowDisableDialog(false);
      setShowVerifyDialog(true);
    }
  };

  const handleVerifyOTP = async () => {
    if (otpValue.length !== 6) {
      toast.error('يرجى إدخال الرمز كاملاً');
      return;
    }

    const deviceInfo = getDeviceFingerprint();
    const result = await verifyCode(otpValue, deviceInfo.fingerprint);

    if (result.success) {
      setShowVerifyDialog(false);
      setOtpValue('');
      
      if (pendingAction === 'enable') {
        setIsUpdating(true);
        await enable2FA('email');
        setIsUpdating(false);
      } else if (pendingAction === 'disable') {
        setIsUpdating(true);
        await disable2FA();
        setIsUpdating(false);
      }
      
      setPendingAction(null);
    } else {
      toast.error(result.error || 'فشل التحقق');
    }
  };

  const handleResendCode = async () => {
    setOtpValue('');
    const deviceInfo = getDeviceFingerprint();
    await sendVerificationCode(deviceInfo.fingerprint, 'security_action');
  };

  const handleCloseVerifyDialog = () => {
    setShowVerifyDialog(false);
    setOtpValue('');
    setPendingAction(null);
    resetVerificationState();
  };

  const handleMethodChange = async (newMethod: string) => {
    if (newMethod === method) return;
    setIsUpdating(true);
    await updateMethod(newMethod as 'email' | 'sms' | 'authenticator');
    setIsUpdating(false);
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {is2FAEnabled ? (
                <motion.div 
                  className="p-3 rounded-xl bg-green-500/10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                >
                  <ShieldCheck className="h-6 w-6 text-green-500" />
                </motion.div>
              ) : (
                <div className="p-3 rounded-xl bg-yellow-500/10">
                  <Shield className="h-6 w-6 text-yellow-500" />
                </div>
              )}
              <div>
                <CardTitle className="flex items-center gap-2">
                  التحقق بخطوتين (2FA)
                  {is2FAEnabled && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </CardTitle>
                <CardDescription>
                  أضف طبقة حماية إضافية لحسابك
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {(isLoading || isUpdating || verificationState.isSending) && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
              <Switch
                checked={is2FAEnabled}
                onCheckedChange={handleToggle}
                disabled={isLoading || isUpdating || verificationState.isSending}
              />
            </div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {is2FAEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Label className="text-base font-semibold">طريقة التحقق</Label>
                  <RadioGroup
                    value={method}
                    onValueChange={handleMethodChange}
                    className="space-y-3"
                  >
                    {methods.map((m) => {
                      const Icon = m.icon;
                      return (
                        <Label
                          key={m.id}
                          htmlFor={m.id}
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all",
                            method === m.id 
                              ? "border-primary bg-primary/5 shadow-sm" 
                              : "border-border hover:border-primary/30",
                            !m.available && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <RadioGroupItem
                            value={m.id}
                            id={m.id}
                            disabled={!m.available || isUpdating}
                          />
                          <div className={cn(
                            "p-2 rounded-lg transition-colors",
                            method === m.id ? "bg-primary/10" : "bg-muted"
                          )}>
                            <Icon className={cn(
                              "h-5 w-5",
                              method === m.id ? "text-primary" : "text-muted-foreground"
                            )} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{m.label}</p>
                            <p className="text-sm text-muted-foreground">
                              {m.description}
                            </p>
                          </div>
                          {!m.available && (
                            <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                              قريباً
                            </span>
                          )}
                          {m.available && method === m.id && (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          )}
                        </Label>
                      );
                    })}
                  </RadioGroup>

                  <motion.div 
                    className="mt-6 p-4 rounded-xl bg-green-500/5 border border-green-500/20"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <Lock className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-green-700 dark:text-green-400">
                          حسابك محمي بالتحقق بخطوتين
                        </p>
                        <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">
                          سيُطلب منك إدخال رمز التحقق عند تسجيل الدخول من جهاز جديد
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Verification Dialog */}
      <Dialog open={showVerifyDialog} onOpenChange={handleCloseVerifyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              التحقق من البريد الإلكتروني
            </DialogTitle>
            <DialogDescription>
              {pendingAction === 'enable' 
                ? 'أدخل الرمز المرسل لتفعيل التحقق بخطوتين'
                : 'أدخل الرمز المرسل لإيقاف التحقق بخطوتين'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* OTP Input */}
            <div className="flex flex-col items-center gap-4">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={setOtpValue}
                disabled={verificationState.isVerifying}
              >
                <InputOTPGroup className="gap-2" dir="ltr">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="h-12 w-12 text-xl font-bold border-2"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              {/* Timer */}
              {verificationState.codeSent && timeLeft > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>ينتهي خلال: {formatTime(timeLeft)}</span>
                </div>
              )}

              {/* Progress bar */}
              {verificationState.codeSent && timeLeft > 0 && (
                <Progress 
                  value={(timeLeft / 600) * 100} 
                  className="h-1 w-full"
                />
              )}

              {/* Attempts left */}
              {verificationState.attemptsLeft < 3 && (
                <p className="text-sm text-yellow-600">
                  المحاولات المتبقية: {verificationState.attemptsLeft}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleVerifyOTP}
                disabled={otpValue.length !== 6 || verificationState.isVerifying}
                className="w-full"
              >
                {verificationState.isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    جاري التحقق...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 ml-2" />
                    تحقق
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleResendCode}
                disabled={verificationState.isSending || timeLeft > 540}
                className="w-full"
              >
                {verificationState.isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 ml-2" />
                    إعادة إرسال الرمز
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Disable Confirmation Dialog */}
      <AlertDialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              إيقاف التحقق بخطوتين
            </AlertDialogTitle>
            <AlertDialogDescription>
              سيؤدي إيقاف التحقق بخطوتين إلى تقليل مستوى الأمان لحسابك.
              سيُطلب منك تأكيد هويتك عبر رمز التحقق.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisable}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {verificationState.isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4 ml-2" />
                  إرسال رمز التحقق
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
