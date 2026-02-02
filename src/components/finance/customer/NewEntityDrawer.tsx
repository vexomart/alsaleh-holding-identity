/**
 * New Entity Drawer - إضافة كيان جديد
 */

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { Loader2, Building2, User, Landmark } from "lucide-react";
import { EntityType, ENTITY_TYPE_CONFIG } from "@/types/finance";

interface NewEntityDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewEntityDrawer({ open, onOpenChange }: NewEntityDrawerProps) {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  
  const [entityType, setEntityType] = useState<EntityType>("individual");
  const [legalNameAr, setLegalNameAr] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [crNumber, setCrNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");

  const createEntityMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");

      const entityData = {
        owner_user_id: user.id,
        tenant_id: profile?.tenant_id,
        entity_type: entityType,
        legal_name_ar: legalNameAr,
        national_id: entityType === "individual" ? nationalId : null,
        cr_number: entityType !== "individual" ? crNumber : null,
        phone,
        email,
        city,
        status: "active" as const,
      };

      const { data, error } = await supabase
        .from("entities")
        .insert(entityData)
        .select()
        .single();

      if (error) throw error;

      // Create finance profile for the entity
      const { error: profileError } = await supabase
        .from("finance_profiles")
        .insert({
          entity_id: data.id,
          tenant_id: profile?.tenant_id,
          kyc_status: "pending",
          credit_limit_sar: 0,
          available_limit_sar: 0,
        });

      if (profileError) throw profileError;

      return data;
    },
    onSuccess: () => {
      toast.success("تم تسجيل الكيان بنجاح");
      queryClient.invalidateQueries({ queryKey: ["my-entities"] });
      queryClient.invalidateQueries({ queryKey: ["my-finance-profiles"] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Error creating entity:", error);
      toast.error("حدث خطأ أثناء تسجيل الكيان");
    },
  });

  const resetForm = () => {
    setEntityType("individual");
    setLegalNameAr("");
    setNationalId("");
    setCrNumber("");
    setPhone("");
    setEmail("");
    setCity("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!legalNameAr.trim()) {
      toast.error("يرجى إدخال الاسم القانوني");
      return;
    }

    if (entityType === "individual" && !nationalId.trim()) {
      toast.error("يرجى إدخال رقم الهوية الوطنية");
      return;
    }

    if (entityType !== "individual" && !crNumber.trim()) {
      toast.error("يرجى إدخال رقم السجل التجاري");
      return;
    }

    createEntityMutation.mutate();
  };

  const getEntityIcon = (type: EntityType) => {
    switch (type) {
      case "individual":
        return <User className="h-4 w-4" />;
      case "company":
        return <Building2 className="h-4 w-4" />;
      case "institution":
        return <Landmark className="h-4 w-4" />;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-lg overflow-y-auto" dir="rtl">
        <SheetHeader>
          <SheetTitle>تسجيل كيان جديد</SheetTitle>
          <SheetDescription>
            أضف معلومات الكيان للتمكن من التقديم على التمويل
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Entity Type */}
          <div className="space-y-2">
            <Label>نوع الكيان</Label>
            <Select value={entityType} onValueChange={(v) => setEntityType(v as EntityType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(ENTITY_TYPE_CONFIG) as EntityType[]).map((type) => (
                  <SelectItem key={type} value={type}>
                    <div className="flex items-center gap-2">
                      {getEntityIcon(type)}
                      {ENTITY_TYPE_CONFIG[type].label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Legal Name */}
          <div className="space-y-2">
            <Label htmlFor="legalName">
              {entityType === "individual" ? "الاسم الرباعي" : "الاسم القانوني"}
            </Label>
            <Input
              id="legalName"
              value={legalNameAr}
              onChange={(e) => setLegalNameAr(e.target.value)}
              placeholder={entityType === "individual" ? "أدخل الاسم الرباعي" : "أدخل اسم المنشأة"}
              required
            />
          </div>

          {/* National ID or CR Number */}
          {entityType === "individual" ? (
            <div className="space-y-2">
              <Label htmlFor="nationalId">رقم الهوية الوطنية</Label>
              <Input
                id="nationalId"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                placeholder="1xxxxxxxxx"
                maxLength={10}
                required
                dir="ltr"
                className="text-left"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="crNumber">رقم السجل التجاري</Label>
              <Input
                id="crNumber"
                value={crNumber}
                onChange={(e) => setCrNumber(e.target.value)}
                placeholder="أدخل رقم السجل التجاري"
                required
                dir="ltr"
                className="text-left"
              />
            </div>
          )}

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">رقم الجوال</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05xxxxxxxx"
              dir="ltr"
              className="text-left"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              dir="ltr"
              className="text-left"
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city">المدينة</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="أدخل المدينة"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={createEntityMutation.isPending}
            >
              {createEntityMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  جارِ التسجيل...
                </>
              ) : (
                "تسجيل الكيان"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
