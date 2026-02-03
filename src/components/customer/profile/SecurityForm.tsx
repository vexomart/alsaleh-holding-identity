/**
 * Security Form - Password change and security settings
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Key,
  History
} from "lucide-react";

interface SecurityFormProps {
  lastPasswordChange?: string;
  twoFactorEnabled?: boolean;
}

export function SecurityForm({ lastPasswordChange, twoFactorEnabled = false }: SecurityFormProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const passwordStrength = getPasswordStrength(newPassword);

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "يرجى ملء جميع الحقول" : "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "كلمات المرور غير متطابقة" : "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "كلمة المرور قصيرة جداً (8 أحرف كحد أدنى)" : "Password too short (min 8 characters)",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setNewPassword("");
      setConfirmPassword("");

      toast({
        title: isRTL ? "تم التحديث ✓" : "Updated ✓",
        description: isRTL ? "تم تغيير كلمة المرور بنجاح" : "Password changed successfully",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل تغيير كلمة المرور" : "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Password Change Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10">
              <Lock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-xl">
                {isRTL ? "تغيير كلمة المرور" : "Change Password"}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? "تأكد من استخدام كلمة مرور قوية وفريدة"
                  : "Make sure to use a strong and unique password"
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium">
              {isRTL ? "كلمة المرور الجديدة" : "New Password"}
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="h-11 rounded-xl pe-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute end-1 top-1/2 -translate-y-1/2 h-9 w-9"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            
            {/* Password Strength Indicator */}
            {newPassword && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-2"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        "h-1.5 flex-1 rounded-full transition-colors",
                        level <= passwordStrength.level
                          ? passwordStrength.color
                          : "bg-muted"
                      )}
                    />
                  ))}
                </div>
                <p className={cn("text-xs", passwordStrength.textColor)}>
                  {isRTL ? passwordStrength.labelAr : passwordStrength.labelEn}
                </p>
              </motion.div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              {isRTL ? "تأكيد كلمة المرور" : "Confirm Password"}
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className={cn(
                  "h-11 rounded-xl pe-12",
                  confirmPassword && newPassword !== confirmPassword && "border-destructive"
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute end-1 top-1/2 -translate-y-1/2 h-9 w-9"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {isRTL ? "كلمات المرور غير متطابقة" : "Passwords do not match"}
              </p>
            )}
          </div>

          <Button
            onClick={handleChangePassword}
            disabled={isSaving || !newPassword || !confirmPassword}
            className="w-full h-12 rounded-xl gap-2 text-base font-semibold"
          >
            {isSaving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Key className="h-5 w-5" />
            )}
            {isSaving 
              ? (isRTL ? "جاري التحديث..." : "Updating...")
              : (isRTL ? "تحديث كلمة المرور" : "Update Password")
            }
          </Button>
        </CardContent>
      </Card>

      {/* Security Status Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10">
              <Shield className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-xl">
                {isRTL ? "حالة الأمان" : "Security Status"}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? "نظرة عامة على إعدادات الأمان الخاصة بك"
                  : "Overview of your security settings"
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Two-Factor Auth */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">
                  {isRTL ? "التحقق بخطوتين" : "Two-Factor Authentication"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isRTL ? "طبقة حماية إضافية" : "Extra layer of security"}
                </p>
              </div>
            </div>
            <Badge variant={twoFactorEnabled ? "default" : "secondary"}>
              {twoFactorEnabled 
                ? (isRTL ? "مفعّل" : "Enabled")
                : (isRTL ? "غير مفعّل" : "Disabled")
              }
            </Badge>
          </div>

          {/* Last Password Change */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background">
                <History className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">
                  {isRTL ? "آخر تغيير لكلمة المرور" : "Last Password Change"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {lastPasswordChange || (isRTL ? "غير معروف" : "Unknown")}
                </p>
              </div>
            </div>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Helper function to calculate password strength
function getPasswordStrength(password: string): {
  level: number;
  labelEn: string;
  labelAr: string;
  color: string;
  textColor: string;
} {
  if (!password) {
    return { level: 0, labelEn: "", labelAr: "", color: "", textColor: "" };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) {
    return { level: 1, labelEn: "Weak", labelAr: "ضعيفة", color: "bg-red-500", textColor: "text-red-500" };
  } else if (score <= 2) {
    return { level: 2, labelEn: "Fair", labelAr: "مقبولة", color: "bg-orange-500", textColor: "text-orange-500" };
  } else if (score <= 3) {
    return { level: 3, labelEn: "Good", labelAr: "جيدة", color: "bg-yellow-500", textColor: "text-yellow-500" };
  } else {
    return { level: 4, labelEn: "Strong", labelAr: "قوية", color: "bg-emerald-500", textColor: "text-emerald-500" };
  }
}
