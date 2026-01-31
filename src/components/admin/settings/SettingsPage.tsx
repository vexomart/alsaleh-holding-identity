/**
 * System Settings Page - Enterprise Grade
 * Comprehensive settings management for admin dashboard
 */

import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Settings, 
  Building2, 
  Mail, 
  Shield, 
  Globe, 
  Palette,
  Bell,
  Database
} from "lucide-react";
import { GeneralSettings } from "./GeneralSettings";
import { EmailSettings } from "./EmailSettings";
import { SecuritySettings } from "./SecuritySettings";
import { LocalizationSettings } from "./LocalizationSettings";
import { AppearanceSettings } from "./AppearanceSettings";
import { NotificationSettings } from "./NotificationSettings";

const settingsTabs = [
  { id: "general", labelAr: "عام", labelEn: "General", icon: Building2 },
  { id: "appearance", labelAr: "المظهر", labelEn: "Appearance", icon: Palette },
  { id: "email", labelAr: "البريد الإلكتروني", labelEn: "Email", icon: Mail },
  { id: "notifications", labelAr: "الإشعارات", labelEn: "Notifications", icon: Bell },
  { id: "security", labelAr: "الأمان", labelEn: "Security", icon: Shield },
  { id: "localization", labelAr: "اللغة والمنطقة", labelEn: "Localization", icon: Globe },
];

export function SettingsPage() {
  const { isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Settings className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isRTL ? "إعدادات النظام" : "System Settings"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isRTL 
              ? "إدارة إعدادات وتكوينات النظام" 
              : "Manage system settings and configurations"}
          </p>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        <TabsList className="flex flex-wrap w-full h-auto gap-2 bg-transparent p-0">
          {settingsTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 sm:px-4 py-3 sm:py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-border rounded-lg data-[state=active]:border-primary transition-all min-w-[70px] sm:min-w-0"
            >
              <tab.icon className="h-6 w-6 sm:h-4 sm:w-4" />
              <span className="text-[10px] sm:text-sm">
                {isRTL ? tab.labelAr : tab.labelEn}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <AppearanceSettings />
        </TabsContent>

        <TabsContent value="email" className="mt-6">
          <EmailSettings />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="localization" className="mt-6">
          <LocalizationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
