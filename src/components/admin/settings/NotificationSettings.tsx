/**
 * Notification Settings Component
 * System notification preferences
 */

import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Save, Mail, MessageSquare, Smartphone, Volume2 } from "lucide-react";
import { toast } from "sonner";

export function NotificationSettings() {
  const { isRTL } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Email Notifications
    emailNewOrder: true,
    emailOrderStatus: true,
    emailNewUser: true,
    emailSystemAlerts: true,
    
    // Push Notifications
    pushEnabled: true,
    pushNewOrder: true,
    pushUrgentOnly: false,
    
    // In-App Notifications
    inAppEnabled: true,
    inAppSound: true,
    inAppDesktop: false,
    
    // Digest
    digestEnabled: true,
    digestFrequency: "daily",
    
    // Quiet Hours
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(isRTL ? "تم حفظ إعدادات الإشعارات" : "Notification settings saved");
    } catch (error) {
      toast.error(isRTL ? "حدث خطأ أثناء الحفظ" : "Error saving settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            {isRTL ? "إشعارات البريد الإلكتروني" : "Email Notifications"}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? "التحكم في رسائل البريد الإلكتروني التلقائية" 
              : "Control automatic email notifications"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{isRTL ? "طلب جديد" : "New Order"}</Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? "إشعار عند استلام طلب جديد" : "Notify when a new order is received"}
              </p>
            </div>
            <Switch
              checked={settings.emailNewOrder}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNewOrder: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{isRTL ? "تحديث حالة الطلب" : "Order Status Update"}</Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? "إشعار عند تغيير حالة الطلب" : "Notify when order status changes"}
              </p>
            </div>
            <Switch
              checked={settings.emailOrderStatus}
              onCheckedChange={(checked) => setSettings({ ...settings, emailOrderStatus: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{isRTL ? "مستخدم جديد" : "New User"}</Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? "إشعار عند تسجيل مستخدم جديد" : "Notify when a new user registers"}
              </p>
            </div>
            <Switch
              checked={settings.emailNewUser}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNewUser: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{isRTL ? "تنبيهات النظام" : "System Alerts"}</Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? "تنبيهات الأمان والنظام الهامة" : "Important security and system alerts"}
              </p>
            </div>
            <Switch
              checked={settings.emailSystemAlerts}
              onCheckedChange={(checked) => setSettings({ ...settings, emailSystemAlerts: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            {isRTL ? "الإشعارات الفورية" : "Push Notifications"}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? "الإشعارات الفورية على الأجهزة" 
              : "Real-time notifications on devices"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{isRTL ? "تفعيل الإشعارات الفورية" : "Enable Push Notifications"}</Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? "السماح بإرسال إشعارات فورية" : "Allow sending push notifications"}
              </p>
            </div>
            <Switch
              checked={settings.pushEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, pushEnabled: checked })}
            />
          </div>

          {settings.pushEnabled && (
            <>
              <div className="flex items-center justify-between ps-4 border-s-2 border-primary/20">
                <div className="space-y-0.5">
                  <Label>{isRTL ? "الطلبات الجديدة" : "New Orders"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? "إشعار فوري للطلبات الجديدة" : "Instant notification for new orders"}
                  </p>
                </div>
                <Switch
                  checked={settings.pushNewOrder}
                  onCheckedChange={(checked) => setSettings({ ...settings, pushNewOrder: checked })}
                />
              </div>

              <div className="flex items-center justify-between ps-4 border-s-2 border-primary/20">
                <div className="space-y-0.5">
                  <Label>{isRTL ? "العاجل فقط" : "Urgent Only"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? "إرسال الإشعارات العاجلة فقط" : "Only send urgent notifications"}
                  </p>
                </div>
                <Switch
                  checked={settings.pushUrgentOnly}
                  onCheckedChange={(checked) => setSettings({ ...settings, pushUrgentOnly: checked })}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            {isRTL ? "إشعارات التطبيق" : "In-App Notifications"}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? "الإشعارات داخل لوحة التحكم" 
              : "Notifications within the dashboard"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{isRTL ? "تفعيل الإشعارات" : "Enable Notifications"}</Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? "عرض الإشعارات في الواجهة" : "Show notifications in the interface"}
              </p>
            </div>
            <Switch
              checked={settings.inAppEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, inAppEnabled: checked })}
            />
          </div>

          {settings.inAppEnabled && (
            <>
              <div className="flex items-center justify-between ps-4 border-s-2 border-primary/20">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    {isRTL ? "صوت الإشعار" : "Notification Sound"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? "تشغيل صوت عند الإشعار" : "Play sound on notification"}
                  </p>
                </div>
                <Switch
                  checked={settings.inAppSound}
                  onCheckedChange={(checked) => setSettings({ ...settings, inAppSound: checked })}
                />
              </div>

              <div className="flex items-center justify-between ps-4 border-s-2 border-primary/20">
                <div className="space-y-0.5">
                  <Label>{isRTL ? "إشعارات سطح المكتب" : "Desktop Notifications"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? "عرض إشعارات المتصفح" : "Show browser notifications"}
                  </p>
                </div>
                <Switch
                  checked={settings.inAppDesktop}
                  onCheckedChange={(checked) => setSettings({ ...settings, inAppDesktop: checked })}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Email Digest */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            {isRTL ? "ملخص البريد" : "Email Digest"}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? "ملخص دوري بالإشعارات" 
              : "Periodic notification summary"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{isRTL ? "تفعيل الملخص" : "Enable Digest"}</Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? "استلام ملخص دوري" : "Receive periodic summary"}
              </p>
            </div>
            <Switch
              checked={settings.digestEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, digestEnabled: checked })}
            />
          </div>

          {settings.digestEnabled && (
            <div className="space-y-2 ps-4 border-s-2 border-primary/20">
              <Label>{isRTL ? "تكرار الإرسال" : "Frequency"}</Label>
              <Select
                value={settings.digestFrequency}
                onValueChange={(value) => setSettings({ ...settings, digestFrequency: value })}
              >
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">{isRTL ? "يومياً" : "Daily"}</SelectItem>
                  <SelectItem value="weekly">{isRTL ? "أسبوعياً" : "Weekly"}</SelectItem>
                  <SelectItem value="monthly">{isRTL ? "شهرياً" : "Monthly"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? "ساعات الهدوء" : "Quiet Hours"}</CardTitle>
          <CardDescription>
            {isRTL 
              ? "إيقاف الإشعارات خلال فترة محددة" 
              : "Pause notifications during specific hours"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{isRTL ? "تفعيل ساعات الهدوء" : "Enable Quiet Hours"}</Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? "إيقاف الإشعارات في أوقات محددة" : "Pause notifications at specific times"}
              </p>
            </div>
            <Switch
              checked={settings.quietHoursEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, quietHoursEnabled: checked })}
            />
          </div>

          {settings.quietHoursEnabled && (
            <div className="grid gap-4 md:grid-cols-2 ps-4 border-s-2 border-primary/20">
              <div className="space-y-2">
                <Label>{isRTL ? "وقت البدء" : "Start Time"}</Label>
                <Select
                  value={settings.quietHoursStart}
                  onValueChange={(value) => setSettings({ ...settings, quietHoursStart: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const time = `${i.toString().padStart(2, '0')}:00`;
                      return <SelectItem key={time} value={time}>{time}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{isRTL ? "وقت الانتهاء" : "End Time"}</Label>
                <Select
                  value={settings.quietHoursEnd}
                  onValueChange={(value) => setSettings({ ...settings, quietHoursEnd: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const time = `${i.toString().padStart(2, '0')}:00`;
                      return <SelectItem key={time} value={time}>{time}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
              </div>
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
