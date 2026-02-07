/**
 * New Entity Registration Page - تسجيل كيان جديد
 * Premium multi-step form with animations
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  User,
  Landmark,
  CheckCircle,
  Loader2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Shield,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EntityType, ENTITY_TYPE_CONFIG } from "@/types/finance";

const STEPS = [
  { id: 1, title: "نوع الكيان", icon: Building2 },
  { id: 2, title: "البيانات الأساسية", icon: CreditCard },
  { id: 3, title: "معلومات التواصل", icon: Phone },
];

const ENTITY_TYPES: { type: EntityType; icon: React.ElementType; description: string }[] = [
  {
    type: "individual",
    icon: User,
    description: "للأفراد السعوديين والمقيمين",
  },
  {
    type: "company",
    icon: Building2,
    description: "للمنشآت والشركات التجارية",
  },
  {
    type: "institution",
    icon: Landmark,
    description: "للمؤسسات والجهات الحكومية",
  },
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

export default function NewEntityPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(1);
  const [entityType, setEntityType] = useState<EntityType | null>(null);
  const [legalNameAr, setLegalNameAr] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [crNumber, setCrNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");

  const createEntityMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !entityType) throw new Error("Missing data");

      const { data, error } = await supabase
        .from("entities")
        .insert({
          owner_user_id: user.id,
          tenant_id: profile?.tenant_id,
          entity_type: entityType,
          legal_name_ar: legalNameAr,
          national_id: entityType === "individual" ? nationalId : null,
          cr_number: entityType !== "individual" ? crNumber : null,
          phone,
          email,
          city,
          status: "active",
        })
        .select()
        .single();

      if (error) throw error;

      // Create finance profile
      await supabase.from("finance_profiles").insert({
        entity_id: data.id,
        tenant_id: profile?.tenant_id,
        kyc_status: "pending",
        credit_limit_sar: 0,
        available_limit_sar: 0,
      });

      return data;
    },
    onSuccess: () => {
      toast.success("تم تسجيل الكيان بنجاح");
      queryClient.invalidateQueries({ queryKey: ["my-entities"] });
      navigate("/dashboard/finance");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء التسجيل");
    },
  });

  const progress = (currentStep / STEPS.length) * 100;

  const canProceed = () => {
    if (currentStep === 1) return !!entityType;
    if (currentStep === 2) {
      if (!legalNameAr.trim()) return false;
      if (entityType === "individual" && !nationalId.trim()) return false;
      if (entityType !== "individual" && !crNumber.trim()) return false;
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      createEntityMutation.mutate();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/dashboard/finance");
    }
  };

  return (
    <div className="min-h-screen pb-24" dir="rtl">
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
            <h1 className="text-2xl font-bold">تسجيل كيان جديد</h1>
            <p className="text-muted-foreground">أضف كيان للتقديم على التمويل</p>
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
                    {isCompleted ? <CheckCircle className="h-6 w-6" /> : <Icon className="h-5 w-5" />}
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
        {/* Step 1: Entity Type */}
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
                <CardTitle>اختر نوع الكيان</CardTitle>
                <CardDescription>
                  حدد نوع الكيان الذي ترغب بتسجيله
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {ENTITY_TYPES.map((item, index) => {
                    const Icon = item.icon;
                    const config = ENTITY_TYPE_CONFIG[item.type];

                    return (
                      <motion.div
                        key={item.type}
                        variants={itemVariants}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Card
                          className={cn(
                            "cursor-pointer transition-all duration-200",
                            entityType === item.type
                              ? "ring-2 ring-primary bg-primary/5"
                              : "hover:bg-muted/50"
                          )}
                          onClick={() => setEntityType(item.type)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <div
                                className={cn(
                                  "p-4 rounded-xl transition-colors",
                                  entityType === item.type
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                )}
                              >
                                <Icon className="h-8 w-8" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold">{config.label}</h4>
                                <p className="text-muted-foreground">{item.description}</p>
                              </div>
                              {entityType === item.type && (
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
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Basic Info */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: -50 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  البيانات الأساسية
                </CardTitle>
                <CardDescription>
                  أدخل بيانات {entityType === "individual" ? "الفرد" : "المنشأة"} الأساسية
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="legalName">
                    {entityType === "individual" ? "الاسم الرباعي" : "الاسم القانوني"}
                  </Label>
                  <Input
                    id="legalName"
                    value={legalNameAr}
                    onChange={(e) => setLegalNameAr(e.target.value)}
                    placeholder={entityType === "individual" ? "أدخل الاسم الرباعي" : "أدخل اسم المنشأة"}
                    className="h-12"
                  />
                </motion.div>

                {entityType === "individual" ? (
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="nationalId">رقم الهوية الوطنية</Label>
                    <Input
                      id="nationalId"
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      placeholder="1xxxxxxxxx"
                      maxLength={10}
                      dir="ltr"
                      className="h-12 text-left"
                    />
                  </motion.div>
                ) : (
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="crNumber">رقم السجل التجاري</Label>
                    <Input
                      id="crNumber"
                      value={crNumber}
                      onChange={(e) => setCrNumber(e.target.value)}
                      placeholder="أدخل رقم السجل التجاري"
                      dir="ltr"
                      className="h-12 text-left"
                    />
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Contact Info */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  معلومات التواصل
                </CardTitle>
                <CardDescription>
                  أدخل بيانات التواصل (اختياري)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    رقم الجوال
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05xxxxxxxx"
                    dir="ltr"
                    className="h-12 text-left"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    البريد الإلكتروني
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@domain.com"
                    dir="ltr"
                    className="h-12 text-left"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="city" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    المدينة
                  </Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="أدخل المدينة"
                    className="h-12"
                  />
                </motion.div>
              </CardContent>
            </Card>

            {/* Summary */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-lg bg-gradient-to-l from-primary/10 to-transparent">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/20">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">ملخص التسجيل</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        سيتم مراجعة بياناتك والتحقق منها خلال 24 ساعة
                      </p>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">النوع:</span> {entityType && ENTITY_TYPE_CONFIG[entityType].label}</p>
                        <p><span className="text-muted-foreground">الاسم:</span> {legalNameAr}</p>
                      </div>
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
            disabled={!canProceed() || createEntityMutation.isPending}
            className="flex-1"
          >
            {createEntityMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                جارِ التسجيل...
              </>
            ) : currentStep === STEPS.length ? (
              <>
                <CheckCircle className="h-4 w-4 ml-2" />
                تسجيل الكيان
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
