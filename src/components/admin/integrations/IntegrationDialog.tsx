/**
 * Integration Configuration Dialog
 */

import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Eye, EyeOff, Copy, Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Integration } from "@/hooks/useIntegrations";
import type { LucideIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FieldConfig {
  key: string;
  labelAr: string;
  labelEn: string;
  type: "text" | "password" | "select";
  placeholder?: string;
  readonly?: boolean;
  options?: { value: string; labelAr: string; labelEn: string }[];
}

interface ProviderConfig {
  provider: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  fields: FieldConfig[];
}

interface IntegrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: ProviderConfig;
  integration: Integration | undefined;
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
}

export function IntegrationDialog({
  open,
  onOpenChange,
  provider,
  integration,
  onSave,
  isSaving,
}: IntegrationDialogProps) {
  const { language, isRTL } = useLanguage();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const Icon = provider.icon;

  // Initialize form data from existing integration
  useEffect(() => {
    if (open) {
      const data: Record<string, any> = {};
      provider.fields.forEach((field) => {
        if (field.key.startsWith("settings.")) {
          const settingKey = field.key.replace("settings.", "");
          data[field.key] = integration?.settings?.[settingKey] || "";
        } else {
          data[field.key] = integration?.[field.key as keyof Integration] || "";
        }
      });
      setFormData(data);
    }
  }, [open, integration, provider.fields]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
    toast({
      title: language === "ar" ? "تم النسخ" : "Copied",
    });
  };

  const handleSubmit = async () => {
    // Build the data object
    const data: any = {
      settings: {},
    };

    provider.fields.forEach((field) => {
      if (field.key.startsWith("settings.")) {
        const settingKey = field.key.replace("settings.", "");
        data.settings[settingKey] = formData[field.key];
      } else {
        data[field.key] = formData[field.key];
      }
    });

    await onSave(data);
  };

  const renderField = (field: FieldConfig) => {
    const value = formData[field.key] || "";
    const isSecret = field.type === "password";
    const showSecret = showSecrets[field.key];

    if (field.type === "select" && field.options) {
      return (
        <Select value={value} onValueChange={(v) => handleChange(field.key, v)}>
          <SelectTrigger>
            <SelectValue placeholder={language === "ar" ? "اختر..." : "Select..."} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {language === "ar" ? opt.labelAr : opt.labelEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <div className="relative">
        <Input
          type={isSecret && !showSecret ? "password" : "text"}
          value={value}
          onChange={(e) => handleChange(field.key, e.target.value)}
          placeholder={field.placeholder}
          readOnly={field.readonly}
          className={cn(
            field.readonly && "bg-muted cursor-not-allowed",
            isSecret && "pr-20"
          )}
          dir="ltr"
        />
        {isSecret && value && (
          <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() =>
                setShowSecrets((prev) => ({ ...prev, [field.key]: !prev[field.key] }))
              }
            >
              {showSecret ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </Button>
          </div>
        )}
        {field.readonly && value && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleCopy(field.key, value)}
            >
              {copied === field.key ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", provider.bgColor)}>
              <Icon className={cn("h-5 w-5", provider.color)} />
            </div>
            <div>
              <DialogTitle>
                {language === "ar" ? provider.nameAr : provider.nameEn}
              </DialogTitle>
              <DialogDescription>
                {language === "ar" ? provider.descriptionAr : provider.descriptionEn}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Warning for sensitive data */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm">
            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-amber-700 dark:text-amber-400">
              {language === "ar"
                ? "تأكد من حفظ بيانات الاعتماد بشكل آمن. لن يتم عرض المفاتيح السرية بعد الحفظ."
                : "Make sure to store credentials securely. Secret keys won't be shown after saving."}
            </p>
          </div>

          {/* Form Fields */}
          {provider.fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>
                {language === "ar" ? field.labelAr : field.labelEn}
              </Label>
              {renderField(field)}
            </div>
          ))}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {language === "ar" ? "إلغاء" : "Cancel"}
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === "ar" ? "جارٍ الحفظ..." : "Saving..."}
              </>
            ) : (
              <>{language === "ar" ? "حفظ" : "Save"}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
