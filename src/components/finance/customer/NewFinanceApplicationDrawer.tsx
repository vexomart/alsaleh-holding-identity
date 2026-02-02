/**
 * New Finance Application Drawer - طلب تمويل جديد
 */

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2, Building2, User, Landmark, AlertCircle } from "lucide-react";
import { Entity, EntityType, ENTITY_TYPE_CONFIG, formatCurrencySAR } from "@/types/finance";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface NewFinanceApplicationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entities: Entity[];
}

const TENOR_OPTIONS = [3, 6, 12, 18, 24, 36];

export function NewFinanceApplicationDrawer({ 
  open, 
  onOpenChange, 
  entities 
}: NewFinanceApplicationDrawerProps) {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  
  const [selectedEntityId, setSelectedEntityId] = useState<string>("");
  const [amountSar, setAmountSar] = useState<number>(10000);
  const [tenorMonths, setTenorMonths] = useState<number>(12);
  const [purposeAr, setPurposeAr] = useState("");

  // Get finance profile for selected entity
  const { data: entityProfile } = useQuery({
    queryKey: ["entity-finance-profile", selectedEntityId],
    queryFn: async () => {
      if (!selectedEntityId) return null;
      const { data, error } = await supabase
        .from("finance_profiles")
        .select("*")
        .eq("entity_id", selectedEntityId)
        .single();
      if (error) return null;
      return data;
    },
    enabled: !!selectedEntityId,
  });

  const createApplicationMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !selectedEntityId) throw new Error("Missing required data");

      // Generate application number
      const { data: appNumData, error: appNumError } = await supabase
        .rpc("generate_finance_application_number", { p_tenant_id: profile?.tenant_id });
      
      if (appNumError) throw appNumError;

      const applicationData = {
        entity_id: selectedEntityId,
        tenant_id: profile?.tenant_id,
        application_number: appNumData,
        amount_sar: amountSar,
        tenor_months: tenorMonths,
        purpose_ar: purposeAr || null,
        status: "draft" as const,
        submitted_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("finance_applications")
        .insert(applicationData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("تم تقديم طلب التمويل بنجاح");
      queryClient.invalidateQueries({ queryKey: ["my-finance-applications"] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Error creating application:", error);
      toast.error("حدث خطأ أثناء تقديم الطلب");
    },
  });

  const resetForm = () => {
    setSelectedEntityId("");
    setAmountSar(10000);
    setTenorMonths(12);
    setPurposeAr("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEntityId) {
      toast.error("يرجى اختيار الكيان");
      return;
    }

    if (amountSar < 5000) {
      toast.error("الحد الأدنى للتمويل 5,000 ريال");
      return;
    }

    if (entityProfile?.kyc_status !== "verified") {
      toast.error("يجب إكمال التحقق من الهوية أولاً");
      return;
    }

    if ((entityProfile?.available_limit_sar || 0) < amountSar) {
      toast.error("المبلغ المطلوب يتجاوز الحد المتاح");
      return;
    }

    createApplicationMutation.mutate();
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

  const selectedEntity = entities.find(e => e.id === selectedEntityId);

  // Estimated monthly payment (simple calculation)
  const estimatedMonthly = amountSar / tenorMonths;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-lg overflow-y-auto" dir="rtl">
        <SheetHeader>
          <SheetTitle>طلب تمويل جديد</SheetTitle>
          <SheetDescription>
            قدّم طلب تمويل جديد واحصل على الموافقة بسرعة
          </SheetDescription>
        </SheetHeader>

        {entities.length === 0 ? (
          <Alert className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              يجب تسجيل كيان أولاً قبل التقديم على التمويل
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {/* Select Entity */}
            <div className="space-y-2">
              <Label>اختر الكيان</Label>
              <Select value={selectedEntityId} onValueChange={setSelectedEntityId}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الكيان المتقدم" />
                </SelectTrigger>
                <SelectContent>
                  {entities.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id}>
                      <div className="flex items-center gap-2">
                        {getEntityIcon(entity.entity_type)}
                        {entity.legal_name_ar}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Entity Profile Info */}
            {selectedEntity && entityProfile && (
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">حالة التحقق</span>
                  <span className={
                    entityProfile.kyc_status === "verified" 
                      ? "text-green-600 font-medium" 
                      : "text-yellow-600 font-medium"
                  }>
                    {entityProfile.kyc_status === "verified" ? "مُتحقق" : "قيد المراجعة"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">الحد المتاح</span>
                  <span className="font-semibold" dir="ltr">
                    {formatCurrencySAR(entityProfile.available_limit_sar || 0)}
                  </span>
                </div>
              </div>
            )}

            {/* Amount */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>مبلغ التمويل</Label>
                <span className="text-lg font-bold text-primary" dir="ltr">
                  {formatCurrencySAR(amountSar)}
                </span>
              </div>
              <Slider
                value={[amountSar]}
                onValueChange={(v) => setAmountSar(v[0])}
                min={5000}
                max={500000}
                step={5000}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5,000 ر.س</span>
                <span>500,000 ر.س</span>
              </div>
            </div>

            {/* Tenor */}
            <div className="space-y-2">
              <Label>مدة السداد (بالأشهر)</Label>
              <Select 
                value={String(tenorMonths)} 
                onValueChange={(v) => setTenorMonths(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TENOR_OPTIONS.map((months) => (
                    <SelectItem key={months} value={String(months)}>
                      {months} شهر
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Estimated Monthly */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">القسط الشهري التقريبي</span>
                <span className="text-xl font-bold text-primary" dir="ltr">
                  {formatCurrencySAR(estimatedMonthly)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                * المبلغ النهائي قد يختلف حسب نسبة الربح المعتمدة
              </p>
            </div>

            {/* Purpose */}
            <div className="space-y-2">
              <Label htmlFor="purpose">الغرض من التمويل (اختياري)</Label>
              <Textarea
                id="purpose"
                value={purposeAr}
                onChange={(e) => setPurposeAr(e.target.value)}
                placeholder="اشرح الغرض من طلب التمويل..."
                rows={3}
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={createApplicationMutation.isPending || !selectedEntityId}
              >
                {createApplicationMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    جارِ التقديم...
                  </>
                ) : (
                  "تقديم الطلب"
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
        )}
      </SheetContent>
    </Sheet>
  );
}
