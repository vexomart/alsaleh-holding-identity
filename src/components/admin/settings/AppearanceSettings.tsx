/**
 * Appearance Settings Component
 * Theme and visual customization
 */

import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "next-themes";
import { useSystemSettings, AppearanceSettings as AppearanceSettingsType } from "@/hooks/useSystemSettings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Palette, Sun, Moon, Monitor, Save, Type, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const colorSchemes = [
  { id: "amber", name: "Amber Gold", nameAr: "ذهبي كهرماني", color: "bg-amber-500" },
  { id: "blue", name: "Ocean Blue", nameAr: "أزرق محيطي", color: "bg-blue-500" },
  { id: "emerald", name: "Emerald Green", nameAr: "أخضر زمردي", color: "bg-emerald-500" },
  { id: "purple", name: "Royal Purple", nameAr: "بنفسجي ملكي", color: "bg-purple-500" },
  { id: "rose", name: "Rose Pink", nameAr: "وردي", color: "bg-rose-500" },
];

const fontOptions = [
  { id: "inter", name: "Inter", nameAr: "Inter" },
  { id: "cairo", name: "Cairo", nameAr: "القاهرة" },
  { id: "tajawal", name: "Tajawal", nameAr: "تجوال" },
  { id: "ibm-plex", name: "IBM Plex", nameAr: "IBM Plex" },
];

const defaultSettings: AppearanceSettingsType = {
  colorScheme: "amber",
  fontSize: 16,
  fontFamily: "cairo",
  enableAnimations: true,
  compactMode: false,
  highContrast: false,
};

export function AppearanceSettings() {
  const { isRTL } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { settings: dbSettings, isLoading, isSaving, saveSettings } = useSystemSettings("appearance");
  const [settings, setSettings] = useState<AppearanceSettingsType>(defaultSettings);

  useEffect(() => {
    if (dbSettings) {
      setSettings({ ...defaultSettings, ...dbSettings });
    }
  }, [dbSettings]);

  const handleSave = async () => {
    await saveSettings(settings, {
      successMessage: isRTL ? "تم حفظ إعدادات المظهر" : "Appearance settings saved",
      errorMessage: isRTL ? "حدث خطأ أثناء الحفظ" : "Error saving settings",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            {isRTL ? "المظهر العام" : "Theme"}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? "اختر مظهر الواجهة المفضل لديك" 
              : "Choose your preferred interface theme"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={theme}
            onValueChange={setTheme}
            className="grid grid-cols-3 gap-4"
          >
            <Label
              htmlFor="light"
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                theme === "light" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              )}
            >
              <RadioGroupItem value="light" id="light" className="sr-only" />
              <div className="p-3 rounded-full bg-amber-100">
                <Sun className="h-6 w-6 text-amber-600" />
              </div>
              <span className="font-medium">{isRTL ? "فاتح" : "Light"}</span>
            </Label>
            <Label
              htmlFor="dark"
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              )}
            >
              <RadioGroupItem value="dark" id="dark" className="sr-only" />
              <div className="p-3 rounded-full bg-slate-800">
                <Moon className="h-6 w-6 text-slate-200" />
              </div>
              <span className="font-medium">{isRTL ? "داكن" : "Dark"}</span>
            </Label>
            <Label
              htmlFor="system"
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                theme === "system" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              )}
            >
              <RadioGroupItem value="system" id="system" className="sr-only" />
              <div className="p-3 rounded-full bg-gradient-to-br from-amber-100 to-slate-800">
                <Monitor className="h-6 w-6 text-slate-600" />
              </div>
              <span className="font-medium">{isRTL ? "تلقائي" : "System"}</span>
            </Label>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Color Scheme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {isRTL ? "نظام الألوان" : "Color Scheme"}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? "اختر لون العلامة التجارية الرئيسي" 
              : "Choose the primary brand color"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={settings.colorScheme}
            onValueChange={(value) => setSettings({ ...settings, colorScheme: value })}
            className="flex flex-wrap gap-4"
          >
            {colorSchemes.map((scheme) => (
              <Label
                key={scheme.id}
                htmlFor={scheme.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                  settings.colorScheme === scheme.id 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                )}
              >
                <RadioGroupItem value={scheme.id} id={scheme.id} className="sr-only" />
                <div className={cn("w-8 h-8 rounded-full", scheme.color)} />
                <span className="font-medium">
                  {isRTL ? scheme.nameAr : scheme.name}
                </span>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5 text-primary" />
            {isRTL ? "الخط والكتابة" : "Typography"}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? "إعدادات الخط وحجم النص" 
              : "Font and text size settings"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>{isRTL ? "نوع الخط" : "Font Family"}</Label>
            <Select
              value={settings.fontFamily}
              onValueChange={(value) => setSettings({ ...settings, fontFamily: value })}
            >
              <SelectTrigger className="w-full md:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font.id} value={font.id}>
                    {isRTL ? font.nameAr : font.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{isRTL ? "حجم الخط الأساسي" : "Base Font Size"}</Label>
              <span className="text-sm text-muted-foreground">{settings.fontSize}px</span>
            </div>
            <Slider
              value={[settings.fontSize]}
              onValueChange={(value) => setSettings({ ...settings, fontSize: value[0] })}
              min={12}
              max={20}
              step={1}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              {isRTL 
                ? "يؤثر على حجم النص في جميع أنحاء الواجهة" 
                : "Affects text size throughout the interface"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility & Animation */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? "إمكانية الوصول" : "Accessibility"}</CardTitle>
          <CardDescription>
            {isRTL 
              ? "إعدادات إمكانية الوصول والحركات" 
              : "Accessibility and motion settings"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{isRTL ? "تفعيل الحركات" : "Enable Animations"}</Label>
              <p className="text-sm text-muted-foreground">
                {isRTL 
                  ? "عرض الحركات والانتقالات في الواجهة" 
                  : "Show animations and transitions in the interface"}
              </p>
            </div>
            <Switch
              checked={settings.enableAnimations}
              onCheckedChange={(checked) => setSettings({ ...settings, enableAnimations: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{isRTL ? "الوضع المضغوط" : "Compact Mode"}</Label>
              <p className="text-sm text-muted-foreground">
                {isRTL 
                  ? "تقليل المسافات لعرض محتوى أكثر" 
                  : "Reduce spacing to show more content"}
              </p>
            </div>
            <Switch
              checked={settings.compactMode}
              onCheckedChange={(checked) => setSettings({ ...settings, compactMode: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{isRTL ? "تباين عالي" : "High Contrast"}</Label>
              <p className="text-sm text-muted-foreground">
                {isRTL 
                  ? "زيادة التباين لتسهيل القراءة" 
                  : "Increase contrast for better readability"}
              </p>
            </div>
            <Switch
              checked={settings.highContrast}
              onCheckedChange={(checked) => setSettings({ ...settings, highContrast: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          {isSaving ? (
            <Loader2 className="h-4 w-4 me-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 me-2" />
          )}
          {isSaving 
            ? (isRTL ? "جاري الحفظ..." : "Saving...") 
            : (isRTL ? "حفظ الإعدادات" : "Save Settings")}
        </Button>
      </div>
    </div>
  );
}
