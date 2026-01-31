/**
 * Security Settings Component
 * Security and authentication configurations
 */

import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, Save, Key, Lock, UserCheck, AlertTriangle, Clock, Fingerprint } from "lucide-react";
import { toast } from "sonner";

export function SecuritySettings() {
  const { isRTL } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Password Policy
    minPasswordLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpiry: "90",
    
    // Session
    sessionTimeout: "30",
    maxSessions: "3",
    
    // 2FA
    enable2FA: false,
    enforce2FAForAdmin: true,
    
    // Login
    maxLoginAttempts: "5",
    lockoutDuration: "15",
    enableCaptcha: true,
    
    // Audit
    enableAuditLog: true,
    auditRetentionDays: "365",
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(isRTL ? "تم حفظ إعدادات الأمان" : "Security settings saved");
    } catch (error) {
      toast.error(isRTL ? "حدث خطأ أثناء الحفظ" : "Error saving settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Policy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            {isRTL ? "سياسة كلمة المرور" : "Password Policy"}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? "متطلبات كلمة المرور للمستخدمين" 
              : "Password requirements for users"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{isRTL ? "الحد الأدنى للطول" : "Minimum Length"}</Label>
              <Input
                type="number"
                min={6}
                max={32}
                value={settings.minPasswordLength}
                onChange={(e) => setSettings({ ...settings, minPasswordLength: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? "انتهاء صلاحية كلمة المرور (أيام)" : "Password Expiry (days)"}</Label>
              <Select
                value={settings.passwordExpiry}
                onValueChange={(value) => setSettings({ ...settings, passwordExpiry: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 {isRTL ? "يوم" : "days"}</SelectItem>
                  <SelectItem value="60">60 {isRTL ? "يوم" : "days"}</SelectItem>
                  <SelectItem value="90">90 {isRTL ? "يوم" : "days"}</SelectItem>
                  <SelectItem value="180">180 {isRTL ? "يوم" : "days"}</SelectItem>
                  <SelectItem value="never">{isRTL ? "لا تنتهي" : "Never"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{isRTL ? "تتطلب أحرف كبيرة" : "Require Uppercase"}</Label>
              <Switch
                checked={settings.requireUppercase}
                onCheckedChange={(checked) => setSettings({ ...settings, requireUppercase: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>{isRTL ? "تتطلب أرقام" : "Require Numbers"}</Label>
              <Switch
                checked={settings.requireNumbers}
                onCheckedChange={(checked) => setSettings({ ...settings, requireNumbers: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>{isRTL ? "تتطلب رموز خاصة" : "Require Special Characters"}</Label>
              <Switch
                checked={settings.requireSpecialChars}
                onCheckedChange={(checked) => setSettings({ ...settings, requireSpecialChars: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            {isRTL ? "إدارة الجلسات" : "Session Management"}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? "إعدادات جلسات المستخدمين" 
              : "User session settings"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{isRTL ? "مهلة الجلسة (دقيقة)" : "Session Timeout (minutes)"}</Label>
              <Select
                value={settings.sessionTimeout}
                onValueChange={(value) => setSettings({ ...settings, sessionTimeout: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 {isRTL ? "دقيقة" : "minutes"}</SelectItem>
                  <SelectItem value="30">30 {isRTL ? "دقيقة" : "minutes"}</SelectItem>
                  <SelectItem value="60">60 {isRTL ? "دقيقة" : "minutes"}</SelectItem>
                  <SelectItem value="120">120 {isRTL ? "دقيقة" : "minutes"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? "الحد الأقصى للجلسات المتزامنة" : "Max Concurrent Sessions"}</Label>
              <Select
                value={settings.maxSessions}
                onValueChange={(value) => setSettings({ ...settings, maxSessions: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="unlimited">{isRTL ? "غير محدود" : "Unlimited"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5 text-primary" />
            {isRTL ? "المصادقة الثنائية" : "Two-Factor Authentication"}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? "طبقة أمان إضافية لحماية الحسابات" 
              : "Additional security layer to protect accounts"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{isRTL ? "تفعيل المصادقة الثنائية" : "Enable 2FA"}</Label>
              <p className="text-sm text-muted-foreground">
                {isRTL 
                  ? "السماح للمستخدمين بتفعيل المصادقة الثنائية" 
                  : "Allow users to enable two-factor authentication"}
              </p>
            </div>
            <Switch
              checked={settings.enable2FA}
              onCheckedChange={(checked) => setSettings({ ...settings, enable2FA: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{isRTL ? "إلزامية للمدراء" : "Enforce for Admins"}</Label>
              <p className="text-sm text-muted-foreground">
                {isRTL 
                  ? "إلزام المدراء بتفعيل المصادقة الثنائية" 
                  : "Require admins to enable 2FA"}
              </p>
            </div>
            <Switch
              checked={settings.enforce2FAForAdmin}
              onCheckedChange={(checked) => setSettings({ ...settings, enforce2FAForAdmin: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Login Protection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            {isRTL ? "حماية تسجيل الدخول" : "Login Protection"}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? "إعدادات الحماية من محاولات تسجيل الدخول الخاطئة" 
              : "Protection settings against failed login attempts"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{isRTL ? "الحد الأقصى للمحاولات" : "Max Login Attempts"}</Label>
              <Select
                value={settings.maxLoginAttempts}
                onValueChange={(value) => setSettings({ ...settings, maxLoginAttempts: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? "مدة القفل (دقيقة)" : "Lockout Duration (minutes)"}</Label>
              <Select
                value={settings.lockoutDuration}
                onValueChange={(value) => setSettings({ ...settings, lockoutDuration: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 {isRTL ? "دقائق" : "minutes"}</SelectItem>
                  <SelectItem value="15">15 {isRTL ? "دقيقة" : "minutes"}</SelectItem>
                  <SelectItem value="30">30 {isRTL ? "دقيقة" : "minutes"}</SelectItem>
                  <SelectItem value="60">60 {isRTL ? "دقيقة" : "minutes"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{isRTL ? "تفعيل CAPTCHA" : "Enable CAPTCHA"}</Label>
              <p className="text-sm text-muted-foreground">
                {isRTL 
                  ? "عرض CAPTCHA بعد محاولات فاشلة" 
                  : "Show CAPTCHA after failed attempts"}
              </p>
            </div>
            <Switch
              checked={settings.enableCaptcha}
              onCheckedChange={(checked) => setSettings({ ...settings, enableCaptcha: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {isRTL ? "سجل التدقيق" : "Audit Log"}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? "تتبع جميع الأنشطة في النظام" 
              : "Track all activities in the system"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{isRTL ? "تفعيل سجل التدقيق" : "Enable Audit Log"}</Label>
              <p className="text-sm text-muted-foreground">
                {isRTL 
                  ? "تسجيل جميع الأنشطة والتغييرات" 
                  : "Log all activities and changes"}
              </p>
            </div>
            <Switch
              checked={settings.enableAuditLog}
              onCheckedChange={(checked) => setSettings({ ...settings, enableAuditLog: checked })}
            />
          </div>

          {settings.enableAuditLog && (
            <div className="space-y-2">
              <Label>{isRTL ? "مدة الاحتفاظ (أيام)" : "Retention Period (days)"}</Label>
              <Select
                value={settings.auditRetentionDays}
                onValueChange={(value) => setSettings({ ...settings, auditRetentionDays: value })}
              >
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">90 {isRTL ? "يوم" : "days"}</SelectItem>
                  <SelectItem value="180">180 {isRTL ? "يوم" : "days"}</SelectItem>
                  <SelectItem value="365">365 {isRTL ? "يوم" : "days"}</SelectItem>
                  <SelectItem value="forever">{isRTL ? "للأبد" : "Forever"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading} size="lg">
          <Save className="h-4 w-4 me-2" />
          {isLoading 
            ? (isRTL ? "جاري الحفظ..." : "Saving...") 
            : (isRTL ? "حفظ الإعدادات" : "Save Settings")}
        </Button>
      </div>
    </div>
  );
}
