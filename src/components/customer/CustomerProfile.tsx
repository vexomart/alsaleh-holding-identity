/**
 * Customer Profile Page
 * Edit name, phone, password, language preference + Digital Wallet
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import {
  User,
  Mail,
  Phone,
  Lock,
  Globe,
  Save,
  Loader2,
  Camera,
  Shield,
} from "lucide-react";
import { CustomerWalletCard } from "./wallet/CustomerWalletCard";

export function CustomerProfile() {
  const { language, setLanguage } = useLanguage();
  const isRTL = language === "ar";
  const { user, profile } = useAuth();

  // Profile form state
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [preferredLanguage, setPreferredLanguage] = useState(profile?.preferred_language || "ar");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSavingProfile(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone: phone || null,
          preferred_language: preferredLanguage,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      // Update language if changed
      if (preferredLanguage !== language) {
        setLanguage(preferredLanguage as "ar" | "en");
      }

      toast({
        title: isRTL ? "تم الحفظ" : "Saved",
        description: isRTL ? "تم تحديث الملف الشخصي بنجاح" : "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل تحديث الملف الشخصي" : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

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

    if (newPassword.length < 6) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "كلمة المرور قصيرة جداً (6 أحرف كحد أدنى)" : "Password too short (min 6 characters)",
        variant: "destructive",
      });
      return;
    }

    setIsSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast({
        title: isRTL ? "تم التحديث" : "Updated",
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
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <User className="h-7 w-7 text-primary" />
          {isRTL ? "الملف الشخصي" : "Profile"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isRTL ? "إدارة معلوماتك الشخصية ومحفظتك الرقمية" : "Manage your personal information and digital wallet"}
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Profile & Security */}
        <div className="space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {isRTL ? "المعلومات الأساسية" : "Basic Information"}
                </CardTitle>
                <CardDescription>
                  {isRTL
                    ? "تحديث اسمك ومعلومات الاتصال"
                    : "Update your name and contact information"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 border-4 border-primary/20">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                      {(fullName || profile?.email)?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{fullName || profile?.email}</p>
                    <p className="text-sm text-muted-foreground">{profile?.email}</p>
                  </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {isRTL ? "الاسم الكامل" : "Full Name"}
                    </Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={isRTL ? "أدخل اسمك" : "Enter your name"}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {isRTL ? "البريد الإلكتروني" : "Email"}
                    </Label>
                    <Input
                      id="email"
                      value={profile?.email || ""}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      {isRTL ? "لا يمكن تغيير البريد الإلكتروني" : "Email cannot be changed"}
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {isRTL ? "رقم الهاتف" : "Phone Number"}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={isRTL ? "05xxxxxxxx" : "05xxxxxxxx"}
                      dir="ltr"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="language" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {isRTL ? "اللغة المفضلة" : "Preferred Language"}
                    </Label>
                    <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">
                          <span className="flex items-center gap-2">
                            <span>🇸🇦</span>
                            العربية
                          </span>
                        </SelectItem>
                        <SelectItem value="en">
                          <span className="flex items-center gap-2">
                            <span>🇺🇸</span>
                            English
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleSaveProfile} disabled={isSavingProfile} className="w-full gap-2">
                  {isSavingProfile ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isRTL ? "حفظ التغييرات" : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  {isRTL ? "الأمان" : "Security"}
                </CardTitle>
                <CardDescription>
                  {isRTL ? "تغيير كلمة المرور الخاصة بك" : "Change your password"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="newPassword" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    {isRTL ? "كلمة المرور الجديدة" : "New Password"}
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    {isRTL ? "تأكيد كلمة المرور" : "Confirm Password"}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <Button
                  onClick={handleChangePassword}
                  disabled={isSavingPassword}
                  variant="secondary"
                  className="w-full gap-2"
                >
                  {isSavingPassword ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                  {isRTL ? "تغيير كلمة المرور" : "Change Password"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Digital Wallet */}
        <div className="lg:sticky lg:top-6 h-fit">
          <CustomerWalletCard />
        </div>
      </div>
    </div>
  );
}
