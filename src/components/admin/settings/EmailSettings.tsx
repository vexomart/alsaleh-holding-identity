/**
 * Email Settings Component
 * Email configuration and templates
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
import { Mail, Save, Send, Server, Shield, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const emailTemplates = [
  { id: "welcome", nameAr: "رسالة الترحيب", nameEn: "Welcome Email", status: "active" },
  { id: "order-confirmation", nameAr: "تأكيد الطلب", nameEn: "Order Confirmation", status: "active" },
  { id: "invoice", nameAr: "الفاتورة", nameEn: "Invoice", status: "active" },
  { id: "password-reset", nameAr: "استعادة كلمة المرور", nameEn: "Password Reset", status: "active" },
  { id: "notification", nameAr: "الإشعارات", nameEn: "Notification", status: "draft" },
];

export function EmailSettings() {
  const { isRTL } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [settings, setSettings] = useState({
    senderName: "ASH Holding",
    senderEmail: "info@ash-holding.sa",
    replyToEmail: "support@ash-holding.sa",
    smtpProvider: "resend",
    enableEmailNotifications: true,
    enableOrderEmails: true,
    enableMarketingEmails: false,
    bccAdmin: true,
    bccEmail: "admin@ash-holding.sa",
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(isRTL ? "تم حفظ إعدادات البريد" : "Email settings saved");
    } catch (error) {
      toast.error(isRTL ? "حدث خطأ أثناء الحفظ" : "Error saving settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestEmail = async () => {
    setTestEmailLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(isRTL ? "تم إرسال بريد الاختبار بنجاح" : "Test email sent successfully");
    } catch (error) {
      toast.error(isRTL ? "فشل إرسال بريد الاختبار" : "Failed to send test email");
    } finally {
      setTestEmailLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sender Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            {isRTL ? "إعدادات المرسل" : "Sender Configuration"}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? "معلومات المرسل التي تظهر في رسائل البريد الإلكتروني" 
              : "Sender information displayed in email messages"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{isRTL ? "اسم المرسل" : "Sender Name"}</Label>
              <Input
                value={settings.senderName}
                onChange={(e) => setSettings({ ...settings, senderName: e.target.value })}
                placeholder="Company Name"
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? "بريد المرسل" : "Sender Email"}</Label>
              <Input
                type="email"
                value={settings.senderEmail}
                onChange={(e) => setSettings({ ...settings, senderEmail: e.target.value })}
                placeholder="info@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? "بريد الرد" : "Reply-To Email"}</Label>
              <Input
                type="email"
                value={settings.replyToEmail}
                onChange={(e) => setSettings({ ...settings, replyToEmail: e.target.value })}
                placeholder="support@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? "مزود الخدمة" : "Email Provider"}</Label>
              <Select
                value={settings.smtpProvider}
                onValueChange={(value) => setSettings({ ...settings, smtpProvider: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resend">Resend</SelectItem>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                  <SelectItem value="mailgun">Mailgun</SelectItem>
                  <SelectItem value="smtp">Custom SMTP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Test Email */}
          <div className="flex items-center gap-4 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleTestEmail} 
              disabled={testEmailLoading}
            >
              <Send className="h-4 w-4 me-2" />
              {testEmailLoading 
                ? (isRTL ? "جاري الإرسال..." : "Sending...") 
                : (isRTL ? "إرسال بريد اختبار" : "Send Test Email")}
            </Button>
            <p className="text-sm text-muted-foreground">
              {isRTL 
                ? "سيتم الإرسال إلى بريد المرسل" 
                : "Will be sent to sender email"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Email Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            {isRTL ? "تفضيلات البريد" : "Email Preferences"}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? "التحكم في أنواع الرسائل المرسلة" 
              : "Control which types of emails are sent"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{isRTL ? "إشعارات البريد" : "Email Notifications"}</Label>
              <p className="text-sm text-muted-foreground">
                {isRTL 
                  ? "إرسال إشعارات النظام عبر البريد" 
                  : "Send system notifications via email"}
              </p>
            </div>
            <Switch
              checked={settings.enableEmailNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, enableEmailNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{isRTL ? "رسائل الطلبات" : "Order Emails"}</Label>
              <p className="text-sm text-muted-foreground">
                {isRTL 
                  ? "إرسال تأكيدات وتحديثات الطلبات" 
                  : "Send order confirmations and updates"}
              </p>
            </div>
            <Switch
              checked={settings.enableOrderEmails}
              onCheckedChange={(checked) => setSettings({ ...settings, enableOrderEmails: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{isRTL ? "الرسائل التسويقية" : "Marketing Emails"}</Label>
              <p className="text-sm text-muted-foreground">
                {isRTL 
                  ? "إرسال رسائل ترويجية وعروض" 
                  : "Send promotional messages and offers"}
              </p>
            </div>
            <Switch
              checked={settings.enableMarketingEmails}
              onCheckedChange={(checked) => setSettings({ ...settings, enableMarketingEmails: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{isRTL ? "نسخة للمدير" : "BCC Admin"}</Label>
              <p className="text-sm text-muted-foreground">
                {isRTL 
                  ? "إرسال نسخة من جميع الرسائل للمدير" 
                  : "Send a copy of all emails to admin"}
              </p>
            </div>
            <Switch
              checked={settings.bccAdmin}
              onCheckedChange={(checked) => setSettings({ ...settings, bccAdmin: checked })}
            />
          </div>

          {settings.bccAdmin && (
            <div className="space-y-2 ps-4 border-s-2 border-primary/20">
              <Label>{isRTL ? "بريد النسخة" : "BCC Email"}</Label>
              <Input
                type="email"
                value={settings.bccEmail}
                onChange={(e) => setSettings({ ...settings, bccEmail: e.target.value })}
                placeholder="admin@example.com"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {isRTL ? "قوالب البريد" : "Email Templates"}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? "إدارة قوالب رسائل البريد الإلكتروني" 
              : "Manage email message templates"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {emailTemplates.map((template) => (
              <div 
                key={template.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {isRTL ? template.nameAr : template.nameEn}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {template.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={template.status === "active" ? "default" : "secondary"}>
                    {template.status === "active" 
                      ? (isRTL ? "نشط" : "Active") 
                      : (isRTL ? "مسودة" : "Draft")}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    {isRTL ? "تعديل" : "Edit"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
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
