/**
 * Localization Settings Component
 * Language, timezone, and regional settings
 */

import { useState } from "react";
import { useLanguage, Language } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Globe, Save, Clock, Calendar, Languages, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const languages = [
  { code: "ar", name: "العربية", nameEn: "Arabic", flag: "🇸🇦" },
  { code: "en", name: "English", nameEn: "English", flag: "🇺🇸" },
];

const timezones = [
  { value: "Asia/Riyadh", label: "الرياض (GMT+3)", labelEn: "Riyadh (GMT+3)" },
  { value: "Asia/Dubai", label: "دبي (GMT+4)", labelEn: "Dubai (GMT+4)" },
  { value: "Asia/Kuwait", label: "الكويت (GMT+3)", labelEn: "Kuwait (GMT+3)" },
  { value: "Africa/Cairo", label: "القاهرة (GMT+2)", labelEn: "Cairo (GMT+2)" },
  { value: "Europe/London", label: "لندن (GMT+0)", labelEn: "London (GMT+0)" },
];

const currencies = [
  { code: "SAR", symbol: "ر.س", name: "ريال سعودي", nameEn: "Saudi Riyal" },
  { code: "AED", symbol: "د.إ", name: "درهم إماراتي", nameEn: "UAE Dirham" },
  { code: "USD", symbol: "$", name: "دولار أمريكي", nameEn: "US Dollar" },
  { code: "EUR", symbol: "€", name: "يورو", nameEn: "Euro" },
];

const dateFormats = [
  { value: "DD/MM/YYYY", example: "31/01/2025" },
  { value: "MM/DD/YYYY", example: "01/31/2025" },
  { value: "YYYY-MM-DD", example: "2025-01-31" },
];

const calendarTypes = [
  { value: "gregorian", labelAr: "ميلادي", labelEn: "Gregorian" },
  { value: "hijri", labelAr: "هجري", labelEn: "Hijri" },
  { value: "both", labelAr: "كلاهما", labelEn: "Both" },
];

export function LocalizationSettings() {
  const { isRTL, language, setLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    defaultLanguage: language,
    allowLanguageSwitching: true,
    timezone: "Asia/Riyadh",
    currency: "SAR",
    dateFormat: "DD/MM/YYYY",
    calendarType: "both",
    use24HourFormat: false,
    showHijriDate: true,
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLanguage(settings.defaultLanguage as Language);
      toast.success(isRTL ? "تم حفظ إعدادات اللغة والمنطقة" : "Localization settings saved");
    } catch (error) {
      toast.error(isRTL ? "حدث خطأ أثناء الحفظ" : "Error saving settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-primary" />
            {isRTL ? "إعدادات اللغة" : "Language Settings"}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? "اللغة الافتراضية وخيارات التبديل" 
              : "Default language and switching options"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>{isRTL ? "اللغة الافتراضية" : "Default Language"}</Label>
            <RadioGroup
              value={settings.defaultLanguage}
              onValueChange={(value) => setSettings({ ...settings, defaultLanguage: value as Language })}
              className="flex gap-4"
            >
              {languages.map((lang) => (
                <Label
                  key={lang.code}
                  htmlFor={lang.code}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all flex-1",
                    settings.defaultLanguage === lang.code 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value={lang.code} id={lang.code} className="sr-only" />
                  <span className="text-2xl">{lang.flag}</span>
                  <div>
                    <p className="font-medium">{lang.name}</p>
                    <p className="text-sm text-muted-foreground">{lang.nameEn}</p>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{isRTL ? "السماح بتبديل اللغة" : "Allow Language Switching"}</Label>
              <p className="text-sm text-muted-foreground">
                {isRTL 
                  ? "السماح للمستخدمين بتغيير اللغة" 
                  : "Allow users to change language"}
              </p>
            </div>
            <Switch
              checked={settings.allowLanguageSwitching}
              onCheckedChange={(checked) => setSettings({ ...settings, allowLanguageSwitching: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Timezone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            {isRTL ? "المنطقة الزمنية" : "Timezone"}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? "المنطقة الزمنية الافتراضية للنظام" 
              : "Default system timezone"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{isRTL ? "المنطقة الزمنية" : "Timezone"}</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => setSettings({ ...settings, timezone: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {isRTL ? tz.label : tz.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{isRTL ? "صيغة 24 ساعة" : "24-Hour Format"}</Label>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? "مثال: 14:30" : "Example: 14:30"}
                </p>
              </div>
              <Switch
                checked={settings.use24HourFormat}
                onCheckedChange={(checked) => setSettings({ ...settings, use24HourFormat: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date & Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {isRTL ? "التاريخ والتقويم" : "Date & Calendar"}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? "تنسيق التاريخ ونوع التقويم" 
              : "Date format and calendar type"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{isRTL ? "تنسيق التاريخ" : "Date Format"}</Label>
              <Select
                value={settings.dateFormat}
                onValueChange={(value) => setSettings({ ...settings, dateFormat: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.value} ({format.example})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? "نوع التقويم" : "Calendar Type"}</Label>
              <Select
                value={settings.calendarType}
                onValueChange={(value) => setSettings({ ...settings, calendarType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {calendarTypes.map((cal) => (
                    <SelectItem key={cal.value} value={cal.value}>
                      {isRTL ? cal.labelAr : cal.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{isRTL ? "عرض التاريخ الهجري" : "Show Hijri Date"}</Label>
              <p className="text-sm text-muted-foreground">
                {isRTL 
                  ? "عرض التاريخ الهجري بجانب الميلادي" 
                  : "Display Hijri date alongside Gregorian"}
              </p>
            </div>
            <Switch
              checked={settings.showHijriDate}
              onCheckedChange={(checked) => setSettings({ ...settings, showHijriDate: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Currency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            {isRTL ? "العملة" : "Currency"}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? "العملة الافتراضية للنظام" 
              : "Default system currency"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label>{isRTL ? "العملة الافتراضية" : "Default Currency"}</Label>
            <RadioGroup
              value={settings.currency}
              onValueChange={(value) => setSettings({ ...settings, currency: value })}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {currencies.map((currency) => (
                <Label
                  key={currency.code}
                  htmlFor={currency.code}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all",
                    settings.currency === currency.code 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value={currency.code} id={currency.code} className="sr-only" />
                  <span className="text-2xl font-bold text-primary">{currency.symbol}</span>
                  <div className="text-center">
                    <p className="font-medium">{currency.code}</p>
                    <p className="text-xs text-muted-foreground">
                      {isRTL ? currency.name : currency.nameEn}
                    </p>
                  </div>
                </Label>
              ))}
            </RadioGroup>
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
