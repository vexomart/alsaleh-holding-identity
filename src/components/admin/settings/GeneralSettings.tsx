/**
 * General Settings Component
 * Company information and basic configurations
 */

import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Building2, Save, Upload, Globe, Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

export function GeneralSettings() {
  const { isRTL } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    companyName: "ASH Holding",
    companyNameAr: "علي الشهري القابضة",
    tagline: "Your Business Partner",
    taglineAr: "شريكك في النجاح",
    email: "info@ash-holding.sa",
    phone: "+966 50 000 0000",
    address: "Riyadh, Saudi Arabia",
    addressAr: "الرياض، المملكة العربية السعودية",
    website: "https://ash-holding.sa",
    vatNumber: "300000000000003",
    crNumber: "1010000000",
    maintenanceMode: false,
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(isRTL ? "تم حفظ الإعدادات بنجاح" : "Settings saved successfully");
    } catch (error) {
      toast.error(isRTL ? "حدث خطأ أثناء الحفظ" : "Error saving settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {isRTL ? "معلومات الشركة" : "Company Information"}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? "المعلومات الأساسية للشركة التي تظهر في الموقع والمستندات" 
              : "Basic company information displayed on the website and documents"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{isRTL ? "اسم الشركة (إنجليزي)" : "Company Name (English)"}</Label>
              <Input
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                placeholder="Company Name"
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? "اسم الشركة (عربي)" : "Company Name (Arabic)"}</Label>
              <Input
                value={settings.companyNameAr}
                onChange={(e) => setSettings({ ...settings, companyNameAr: e.target.value })}
                placeholder="اسم الشركة"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? "الشعار (إنجليزي)" : "Tagline (English)"}</Label>
              <Input
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                placeholder="Tagline"
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? "الشعار (عربي)" : "Tagline (Arabic)"}</Label>
              <Input
                value={settings.taglineAr}
                onChange={(e) => setSettings({ ...settings, taglineAr: e.target.value })}
                placeholder="الشعار"
                dir="rtl"
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>{isRTL ? "شعار الشركة" : "Company Logo"}</Label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 me-2" />
                  {isRTL ? "رفع شعار جديد" : "Upload New Logo"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  {isRTL ? "PNG, JPG أو SVG. الحجم الأقصى 2MB" : "PNG, JPG or SVG. Max size 2MB"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            {isRTL ? "معلومات التواصل" : "Contact Information"}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? "بيانات التواصل الرسمية للشركة" 
              : "Official company contact details"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {isRTL ? "البريد الإلكتروني" : "Email"}
              </Label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                placeholder="info@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {isRTL ? "رقم الهاتف" : "Phone Number"}
              </Label>
              <Input
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                placeholder="+966 50 000 0000"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {isRTL ? "الموقع الإلكتروني" : "Website"}
              </Label>
              <Input
                type="url"
                value={settings.website}
                onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {isRTL ? "العنوان" : "Address"}
              </Label>
              <Input
                value={isRTL ? settings.addressAr : settings.address}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  [isRTL ? 'addressAr' : 'address']: e.target.value 
                })}
                placeholder={isRTL ? "العنوان" : "Address"}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal Information */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? "المعلومات القانونية" : "Legal Information"}</CardTitle>
          <CardDescription>
            {isRTL 
              ? "أرقام السجل التجاري والضريبي" 
              : "Commercial and tax registration numbers"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{isRTL ? "الرقم الضريبي" : "VAT Number"}</Label>
              <Input
                value={settings.vatNumber}
                onChange={(e) => setSettings({ ...settings, vatNumber: e.target.value })}
                placeholder="300000000000003"
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? "رقم السجل التجاري" : "CR Number"}</Label>
              <Input
                value={settings.crNumber}
                onChange={(e) => setSettings({ ...settings, crNumber: e.target.value })}
                placeholder="1010000000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Mode */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? "وضع الصيانة" : "Maintenance Mode"}</CardTitle>
          <CardDescription>
            {isRTL 
              ? "تفعيل وضع الصيانة يمنع الزوار من الوصول للموقع مؤقتاً" 
              : "Enabling maintenance mode temporarily blocks visitors from accessing the site"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{isRTL ? "تفعيل وضع الصيانة" : "Enable Maintenance Mode"}</Label>
              <p className="text-sm text-muted-foreground">
                {isRTL 
                  ? "سيرى الزوار صفحة صيانة بدلاً من الموقع" 
                  : "Visitors will see a maintenance page instead of the site"}
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
            />
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
