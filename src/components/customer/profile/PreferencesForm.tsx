/**
 * Preferences Form - Language and notification preferences
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Settings, 
  Globe, 
  Bell, 
  Mail, 
  Smartphone,
  Moon,
  Sun,
  Save,
  Loader2,
  CheckCircle2
} from "lucide-react";

interface PreferencesFormProps {
  userId: string;
  initialLanguage: string;
  onLanguageChange: (lang: "ar" | "en") => void;
}

export function PreferencesForm({ userId, initialLanguage, onLanguageChange }: PreferencesFormProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [preferredLanguage, setPreferredLanguage] = useState(initialLanguage);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedRecently, setSavedRecently] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          preferred_language: preferredLanguage,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      if (preferredLanguage !== language) {
        onLanguageChange(preferredLanguage as "ar" | "en");
      }

      setSavedRecently(true);
      setTimeout(() => setSavedRecently(false), 3000);

      toast({
        title: isRTL ? "تم الحفظ ✓" : "Saved ✓",
        description: isRTL ? "تم تحديث التفضيلات" : "Preferences updated",
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل حفظ التفضيلات" : "Failed to save preferences",
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
      {/* Language Preferences */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10">
              <Globe className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">
                {isRTL ? "اللغة والمظهر" : "Language & Appearance"}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? "اختر لغتك المفضلة ومظهر التطبيق"
                  : "Choose your preferred language and app appearance"
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Language Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              {isRTL ? "لغة العرض" : "Display Language"}
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPreferredLanguage("ar")}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border-2 transition-all",
                  preferredLanguage === "ar"
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-muted-foreground/30"
                )}
              >
                <span className="text-2xl">🇸🇦</span>
                <div className="text-start">
                  <p className="font-semibold">العربية</p>
                  <p className="text-xs text-muted-foreground">Arabic</p>
                </div>
                {preferredLanguage === "ar" && (
                  <CheckCircle2 className="h-5 w-5 text-primary ms-auto" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPreferredLanguage("en")}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border-2 transition-all",
                  preferredLanguage === "en"
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-muted-foreground/30"
                )}
              >
                <span className="text-2xl">🇺🇸</span>
                <div className="text-start">
                  <p className="font-semibold">English</p>
                  <p className="text-xs text-muted-foreground">الإنجليزية</p>
                </div>
                {preferredLanguage === "en" && (
                  <CheckCircle2 className="h-5 w-5 text-primary ms-auto" />
                )}
              </motion.button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10">
              <Bell className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl">
                {isRTL ? "الإشعارات" : "Notifications"}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? "تحكم في كيفية تلقيك للإشعارات"
                  : "Control how you receive notifications"
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">
                  {isRTL ? "إشعارات البريد الإلكتروني" : "Email Notifications"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isRTL ? "تحديثات الطلبات والفواتير" : "Order and invoice updates"}
                </p>
              </div>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">
                  {isRTL ? "إشعارات الهاتف" : "Push Notifications"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isRTL ? "تنبيهات فورية على جهازك" : "Instant alerts on your device"}
                </p>
              </div>
            </div>
            <Switch
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>

          {/* Marketing Emails */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">
                  {isRTL ? "رسائل تسويقية" : "Marketing Emails"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isRTL ? "عروض وأخبار جديدة" : "Offers and news"}
                </p>
              </div>
            </div>
            <Switch
              checked={marketingEmails}
              onCheckedChange={setMarketingEmails}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={isSaving}
        className={cn(
          "w-full h-12 rounded-xl gap-2 text-base font-semibold transition-all",
          savedRecently && "bg-emerald-600 hover:bg-emerald-700"
        )}
      >
        {isSaving ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : savedRecently ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <Save className="h-5 w-5" />
        )}
        {isSaving 
          ? (isRTL ? "جاري الحفظ..." : "Saving...") 
          : savedRecently 
            ? (isRTL ? "تم الحفظ!" : "Saved!")
            : (isRTL ? "حفظ التفضيلات" : "Save Preferences")
        }
      </Button>
    </motion.div>
  );
}
