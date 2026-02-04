/**
 * Two-Factor Authentication Settings Component
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTwoFactorAuth } from '@/hooks/useTwoFactorAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
    enable2FA, 
    disable2FA, 
    updateMethod 
  } = useTwoFactorAuth();

  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    if (is2FAEnabled) {
      setShowDisableDialog(true);
    } else {
      setIsUpdating(true);
      await enable2FA('email');
      setIsUpdating(false);
    }
  };

  const handleDisable = async () => {
    setIsUpdating(true);
    await disable2FA();
    setShowDisableDialog(false);
    setIsUpdating(false);
  };

  const handleMethodChange = async (newMethod: string) => {
    if (newMethod === method) return;
    setIsUpdating(true);
    await updateMethod(newMethod as 'email' | 'sms' | 'authenticator');
    setIsUpdating(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {is2FAEnabled ? (
                <div className="p-2 rounded-xl bg-green-500/10">
                  <ShieldCheck className="h-6 w-6 text-green-500" />
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-yellow-500/10">
                  <Shield className="h-6 w-6 text-yellow-500" />
                </div>
              )}
              <div>
                <CardTitle>التحقق بخطوتين (2FA)</CardTitle>
                <CardDescription>
                  أضف طبقة حماية إضافية لحسابك
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {(isLoading || isUpdating) && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
              <Switch
                checked={is2FAEnabled}
                onCheckedChange={handleToggle}
                disabled={isLoading || isUpdating}
              />
            </div>
          </div>
        </CardHeader>

        {is2FAEnabled && (
          <CardContent>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
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
                            ? "border-primary bg-primary/5" 
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
                          "p-2 rounded-lg",
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
                          <span className="text-xs text-muted-foreground">
                            قريباً
                          </span>
                        )}
                      </Label>
                    );
                  })}
                </RadioGroup>

                <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">التحقق بخطوتين مفعّل</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        سيُطلب منك إدخال رمز التحقق عند تسجيل الدخول من جهاز جديد
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </CardContent>
        )}
      </Card>

      <AlertDialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              إيقاف التحقق بخطوتين
            </AlertDialogTitle>
            <AlertDialogDescription>
              سيؤدي إيقاف التحقق بخطوتين إلى تقليل مستوى الأمان لحسابك.
              هل أنت متأكد من المتابعة؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisable}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ShieldOff className="h-4 w-4 ml-2" />
                  إيقاف
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
