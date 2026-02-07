/**
 * Finance Application Flow - طلب تمويل جديد
 * Multi-step wizard with premium animations
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  User,
  Landmark,
  CheckCircle,
  Loader2,
  Wallet,
  Calendar,
  FileText,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Entity, EntityType, ENTITY_TYPE_CONFIG, formatCurrencySAR } from "@/types/finance";

const STEPS = [
  { id: 1, title: "اختيار الكيان", icon: Building2 },
  { id: 2, title: "تفاصيل التمويل", icon: Wallet },
  { id: 3, title: "المراجعة والتأكيد", icon: CheckCircle },
];

const TENOR_OPTIONS = [
  { months: 3, label: "3 أشهر" },
  { months: 6, label: "6 أشهر" },
  { months: 12, label: "سنة" },
  { months: 18, label: "سنة ونصف" },
  { months: 24, label: "سنتين" },
  { months: 36, label: "3 سنوات" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function NewFinanceApplicationPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEntityId, setSelectedEntityId] = useState<string>("");
  const [amountSar, setAmountSar] = useState(50000);
  const [tenorMonths, setTenorMonths] = useState(12);
  const [purposeAr, setPurposeAr] = useState("");

  // Fetch entities
  const { data: entities, isLoading: entitiesLoading } = useQuery({
    queryKey: ["my-entities", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("entities")
        .select("*")
        .eq("owner_user_id", user.id)
        .eq("status", "active");
      if (error) throw error;
      return data as Entity[];
    },
    enabled: !!user?.id,
  });

  // Fetch finance profile for selected entity
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
      if (!user?.id || !selectedEntityId) throw new Error("Missing data");

      const { data: appNum, error: appNumError } = await supabase.rpc(
        "generate_finance_application_number",
        { p_tenant_id: profile?.tenant_id }
      );
      if (appNumError) throw appNumError;

      const { data, error } = await supabase
        .from("finance_applications")
        .insert({
          entity_id: selectedEntityId,
          tenant_id: profile?.tenant_id,
          application_number: appNum,
          amount_sar: amountSar,
          tenor_months: tenorMonths,
          purpose_ar: purposeAr || null,
          status: "submitted",
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("تم تقديم طلب التمويل بنجاح");
      queryClient.invalidateQueries({ queryKey: ["my-finance-applications"] });
      navigate("/dashboard/finance");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تقديم الطلب");
    },
  });

  const selectedEntity = entities?.find((e) => e.id === selectedEntityId);
  const estimatedMonthly = amountSar / tenorMonths;
  const progress = (currentStep / STEPS.length) * 100;

  const canProceed = () => {
    if (currentStep === 1) return !!selectedEntityId;
    if (currentStep === 2) return amountSar >= 5000;
    return true;
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      createApplicationMutation.mutate();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/dashboard/finance");
    }
  };

  const getEntityIcon = (type: EntityType) => {
    switch (type) {
      case "individual":
        return <User className="h-6 w-6" />;
      case "company":
        return <Building2 className="h-6 w-6" />;
      case "institution":
        return <Landmark className="h-6 w-6" />;
    }
  };

  return (
    <div className="min-h-screen pb-8" dir="rtl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">طلب تمويل جديد</h1>
            <p className="text-muted-foreground">أكمل الخطوات للحصول على التمويل</p>
          </div>
        </div>

        {/* Progress */}
        <div className="relative">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <motion.div
                  key={step.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                      isCompleted && "bg-primary text-primary-foreground",
                      isActive && "bg-primary/20 text-primary ring-2 ring-primary",
                      !isActive && !isCompleted && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm mt-2 font-medium",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Select Entity */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: -50 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  اختر الكيان المتقدم
                </CardTitle>
                <CardDescription>
                  حدد الكيان الذي ترغب بالتقديم عليه للحصول على التمويل
                </CardDescription>
              </CardHeader>
              <CardContent>
                {entitiesLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : entities?.length === 0 ? (
                  <motion.div variants={itemVariants} className="text-center py-12">
                    <Building2 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">لا توجد كيانات مسجلة</h3>
                    <p className="text-muted-foreground mb-6">
                      يجب تسجيل كيان أولاً للتقديم على التمويل
                    </p>
                    <Button onClick={() => navigate("/dashboard/finance/entities/new")}>
                      تسجيل كيان جديد
                    </Button>
                  </motion.div>
                ) : (
                  <div className="grid gap-4">
                    {entities?.map((entity, index) => (
                      <motion.div
                        key={entity.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Card
                          className={cn(
                            "cursor-pointer transition-all duration-200",
                            selectedEntityId === entity.id
                              ? "ring-2 ring-primary bg-primary/5"
                              : "hover:bg-muted/50"
                          )}
                          onClick={() => setSelectedEntityId(entity.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div
                                className={cn(
                                  "p-3 rounded-xl transition-colors",
                                  selectedEntityId === entity.id
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                )}
                              >
                                {getEntityIcon(entity.entity_type)}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold">{entity.legal_name_ar}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {ENTITY_TYPE_CONFIG[entity.entity_type].label}
                                </p>
                              </div>
                              {selectedEntityId === entity.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="p-2 rounded-full bg-primary text-primary-foreground"
                                >
                                  <CheckCircle className="h-5 w-5" />
                                </motion.div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Finance Details */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            {/* Amount Card */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-l from-primary/10 to-transparent p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Wallet className="h-6 w-6 text-primary" />
                    <h3 className="text-lg font-semibold">مبلغ التمويل</h3>
                  </div>
                  <div className="text-center py-6">
                    <motion.p
                      key={amountSar}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-4xl font-bold text-primary"
                      dir="ltr"
                    >
                      {formatCurrencySAR(amountSar)}
                    </motion.p>
                  </div>
                  <Slider
                    value={[amountSar]}
                    onValueChange={(v) => setAmountSar(v[0])}
                    min={5000}
                    max={500000}
                    step={5000}
                    className="mt-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>5,000 ر.س</span>
                    <span>500,000 ر.س</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Tenor Selection */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    مدة السداد
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {TENOR_OPTIONS.map((option) => (
                      <motion.button
                        key={option.months}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setTenorMonths(option.months)}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all text-center",
                          tenorMonths === option.months
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <span className="font-semibold">{option.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Estimated Payment */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-lg bg-gradient-to-l from-green-500/10 to-transparent">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-green-500/20">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">القسط الشهري التقريبي</p>
                        <p className="text-xs text-muted-foreground">
                          * قد يختلف حسب نسبة الربح المعتمدة
                        </p>
                      </div>
                    </div>
                    <motion.p
                      key={estimatedMonthly}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-bold text-green-600"
                      dir="ltr"
                    >
                      {formatCurrencySAR(estimatedMonthly)}
                    </motion.p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Purpose */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    الغرض من التمويل
                    <Badge variant="outline" className="mr-2">اختياري</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={purposeAr}
                    onChange={(e) => setPurposeAr(e.target.value)}
                    placeholder="اشرح الغرض من طلب التمويل..."
                    rows={3}
                    className="resize-none"
                  />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-l from-primary/10 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    مراجعة الطلب
                  </CardTitle>
                  <CardDescription>
                    راجع تفاصيل طلبك قبل التقديم
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Entity Info */}
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-2">الكيان المتقدم</p>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {selectedEntity && getEntityIcon(selectedEntity.entity_type)}
                      </div>
                      <div>
                        <p className="font-semibold">{selectedEntity?.legal_name_ar}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedEntity && ENTITY_TYPE_CONFIG[selectedEntity.entity_type].label}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Finance Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-sm text-muted-foreground">مبلغ التمويل</p>
                      <p className="text-xl font-bold mt-1" dir="ltr">
                        {formatCurrencySAR(amountSar)}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-sm text-muted-foreground">مدة السداد</p>
                      <p className="text-xl font-bold mt-1">{tenorMonths} شهر</p>
                    </div>
                  </div>

                  {/* Estimated Payment Highlight */}
                  <div className="p-6 rounded-xl bg-gradient-to-l from-primary/20 to-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">القسط الشهري التقريبي</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          سيتم إرسال العرض النهائي بعد المراجعة
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="text-3xl font-bold text-primary" dir="ltr">
                          {formatCurrencySAR(estimatedMonthly)}
                        </p>
                        <p className="text-sm text-muted-foreground">/ شهرياً</p>
                      </div>
                    </div>
                  </div>

                  {purposeAr && (
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-2">الغرض من التمويل</p>
                      <p>{purposeAr}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Terms Notice */}
            <motion.div variants={itemVariants}>
              <Card className="border-amber-200 bg-amber-50/50">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Sparkles className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-amber-900">ملاحظة مهمة</p>
                      <p className="text-amber-700 mt-1">
                        بالضغط على "تقديم الطلب" فإنك توافق على الشروط والأحكام وسياسة التمويل الخاصة بنا.
                        سيتم مراجعة طلبك وإرسال العرض خلال 24-48 ساعة.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-0 inset-x-0 p-4 bg-background/95 backdrop-blur border-t safe-area-pb"
      >
        <div className="max-w-3xl mx-auto flex gap-3">
          <Button variant="outline" onClick={handleBack} className="flex-1">
            <ArrowRight className="h-4 w-4 ml-2" />
            {currentStep === 1 ? "إلغاء" : "رجوع"}
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed() || createApplicationMutation.isPending}
            className="flex-1"
          >
            {createApplicationMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                جارِ التقديم...
              </>
            ) : currentStep === STEPS.length ? (
              <>
                <CheckCircle className="h-4 w-4 ml-2" />
                تقديم الطلب
              </>
            ) : (
              <>
                التالي
                <ArrowLeft className="h-4 w-4 mr-2" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
