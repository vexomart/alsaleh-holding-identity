/**
 * System Settings Page - Modern Unified Design
 * Comprehensive settings management with premium SaaS aesthetics
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Building2, 
  Mail, 
  Shield, 
  Globe, 
  Palette,
  Bell,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { GeneralSettings } from "./GeneralSettings";
import { EmailSettings } from "./EmailSettings";
import { SecuritySettings } from "./SecuritySettings";
import { LocalizationSettings } from "./LocalizationSettings";
import { AppearanceSettings } from "./AppearanceSettings";
import { NotificationSettings } from "./NotificationSettings";
import { cn } from "@/lib/utils";

const settingsTabs = [
  { 
    id: "general", 
    labelAr: "عام", 
    labelEn: "General", 
    icon: Building2,
    descriptionAr: "إعدادات الشركة الأساسية",
    descriptionEn: "Basic company settings"
  },
  { 
    id: "appearance", 
    labelAr: "المظهر", 
    labelEn: "Appearance", 
    icon: Palette,
    descriptionAr: "تخصيص الألوان والثيم",
    descriptionEn: "Customize colors and theme"
  },
  { 
    id: "email", 
    labelAr: "البريد الإلكتروني", 
    labelEn: "Email", 
    icon: Mail,
    descriptionAr: "إعدادات الإرسال والقوالب",
    descriptionEn: "Sending and templates"
  },
  { 
    id: "notifications", 
    labelAr: "الإشعارات", 
    labelEn: "Notifications", 
    icon: Bell,
    descriptionAr: "تفضيلات التنبيهات",
    descriptionEn: "Alert preferences"
  },
  { 
    id: "security", 
    labelAr: "الأمان", 
    labelEn: "Security", 
    icon: Shield,
    descriptionAr: "حماية الحساب والخصوصية",
    descriptionEn: "Account protection"
  },
  { 
    id: "localization", 
    labelAr: "اللغة والمنطقة", 
    labelEn: "Localization", 
    icon: Globe,
    descriptionAr: "اللغة والتوقيت والعملة",
    descriptionEn: "Language, timezone, currency"
  },
];

export function SettingsPage() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [activeTab, setActiveTab] = useState("general");

  const activeTabData = settingsTabs.find(t => t.id === activeTab);

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl" />
          <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
            <Settings className="h-7 w-7 text-primary" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">
              {isRTL ? "إعدادات النظام" : "System Settings"}
            </h1>
            <Badge variant="secondary" className="gap-1 text-xs">
              <Sparkles className="h-3 w-3" />
              {isRTL ? "متقدم" : "Advanced"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isRTL 
              ? "إدارة إعدادات وتكوينات النظام بالكامل" 
              : "Manage all system settings and configurations"}
          </p>
        </div>
      </motion.div>

      {/* Settings Layout - Sidebar + Content */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Settings Navigation Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="sticky top-6 border-border/50 shadow-sm overflow-hidden">
            <CardContent className="p-2">
              <nav className="space-y-1">
                {settingsTabs.map((tab, index) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <motion.button
                      key={tab.id}
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-start transition-all duration-200",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-md" 
                          : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-lg transition-colors",
                        isActive 
                          ? "bg-primary-foreground/20" 
                          : "bg-muted"
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-medium truncate",
                          isActive && "text-primary-foreground"
                        )}>
                          {isRTL ? tab.labelAr : tab.labelEn}
                        </p>
                        <p className={cn(
                          "text-xs truncate",
                          isActive 
                            ? "text-primary-foreground/70" 
                            : "text-muted-foreground"
                        )}>
                          {isRTL ? tab.descriptionAr : tab.descriptionEn}
                        </p>
                      </div>
                      <div className={cn(
                        "opacity-0 transition-opacity",
                        isActive && "opacity-100"
                      )}>
                        {isRTL ? (
                          <ChevronLeft className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="min-w-0"
        >
          <Card className="border-border/50 shadow-sm overflow-hidden">
            {/* Content Header */}
            <div className="px-6 py-4 border-b bg-muted/30">
              <div className="flex items-center gap-3">
                {activeTabData && (
                  <>
                    <div className="p-2 rounded-lg bg-primary/10">
                      <activeTabData.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground">
                        {isRTL ? activeTabData.labelAr : activeTabData.labelEn}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {isRTL ? activeTabData.descriptionAr : activeTabData.descriptionEn}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Content Body */}
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden">
                <TabsList>
                  {settingsTabs.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id}>
                      {isRTL ? tab.labelAr : tab.labelEn}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              {/* Tab Contents with Animation */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "general" && <GeneralSettings />}
                {activeTab === "appearance" && <AppearanceSettings />}
                {activeTab === "email" && <EmailSettings />}
                {activeTab === "notifications" && <NotificationSettings />}
                {activeTab === "security" && <SecuritySettings />}
                {activeTab === "localization" && <LocalizationSettings />}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
