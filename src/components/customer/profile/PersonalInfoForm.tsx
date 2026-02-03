/**
 * Personal Info Form - Edit basic profile information
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Save, 
  Loader2,
  CheckCircle2
} from "lucide-react";

interface PersonalInfoFormProps {
  userId: string;
  initialData: {
    fullName: string;
    email: string;
    phone: string;
    address?: string;
    company?: string;
    bio?: string;
  };
  onSave?: () => void;
}

export function PersonalInfoForm({ userId, initialData, onSave }: PersonalInfoFormProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [fullName, setFullName] = useState(initialData.fullName);
  const [phone, setPhone] = useState(initialData.phone);
  const [address, setAddress] = useState(initialData.address || "");
  const [company, setCompany] = useState(initialData.company || "");
  const [isSaving, setIsSaving] = useState(false);
  const [savedRecently, setSavedRecently] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone: phone || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      setSavedRecently(true);
      setTimeout(() => setSavedRecently(false), 3000);

      toast({
        title: isRTL ? "تم الحفظ ✓" : "Saved ✓",
        description: isRTL ? "تم تحديث معلوماتك بنجاح" : "Your information has been updated",
      });

      onSave?.();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل حفظ التغييرات" : "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formFields = [
    {
      id: "fullName",
      labelEn: "Full Name",
      labelAr: "الاسم الكامل",
      icon: User,
      value: fullName,
      onChange: setFullName,
      placeholder: isRTL ? "أدخل اسمك الكامل" : "Enter your full name",
      type: "text",
    },
    {
      id: "email",
      labelEn: "Email Address",
      labelAr: "البريد الإلكتروني",
      icon: Mail,
      value: initialData.email,
      onChange: () => {},
      placeholder: "",
      type: "email",
      disabled: true,
      hint: isRTL ? "لا يمكن تغيير البريد الإلكتروني" : "Email cannot be changed",
    },
    {
      id: "phone",
      labelEn: "Phone Number",
      labelAr: "رقم الهاتف",
      icon: Phone,
      value: phone,
      onChange: setPhone,
      placeholder: "+966 5XX XXX XXXX",
      type: "tel",
      dir: "ltr",
    },
    {
      id: "company",
      labelEn: "Company / Organization",
      labelAr: "الشركة / المنظمة",
      icon: Building2,
      value: company,
      onChange: setCompany,
      placeholder: isRTL ? "اسم الشركة (اختياري)" : "Company name (optional)",
      type: "text",
    },
    {
      id: "address",
      labelEn: "Address",
      labelAr: "العنوان",
      icon: MapPin,
      value: address,
      onChange: setAddress,
      placeholder: isRTL ? "عنوانك (اختياري)" : "Your address (optional)",
      type: "text",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">
                {isRTL ? "المعلومات الشخصية" : "Personal Information"}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? "تحديث بياناتك الأساسية ومعلومات الاتصال"
                  : "Update your basic details and contact information"
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-5">
            {formFields.map((field, index) => {
              const Icon = field.icon;
              return (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="space-y-2"
                >
                  <Label 
                    htmlFor={field.id}
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {isRTL ? field.labelAr : field.labelEn}
                  </Label>
                  <Input
                    id={field.id}
                    type={field.type}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                    dir={field.dir}
                    className={cn(
                      "h-11 rounded-xl border-muted-foreground/20 focus:border-primary",
                      field.disabled && "bg-muted cursor-not-allowed"
                    )}
                  />
                  {field.hint && (
                    <p className="text-xs text-muted-foreground">{field.hint}</p>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="pt-4 border-t">
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
                  : (isRTL ? "حفظ التغييرات" : "Save Changes")
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
