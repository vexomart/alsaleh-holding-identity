/**
 * Finance Center - مركز التمويل للعميل
 * Main customer dashboard for finance operations
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Wallet,
  CreditCard,
  Plus,
  Building2,
  User,
  Landmark,
  TrendingUp,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Entity,
  EntityType,
  FinanceProfile,
  ENTITY_TYPE_CONFIG,
  KYC_STATUS_CONFIG,
  formatCurrencySAR,
  KYCStatus,
} from "@/types/finance";
import { Skeleton } from "@/components/ui/skeleton";
import { MyApplications } from "./MyApplications";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export function FinanceCenter() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  // Fetch user's entities
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

  // Fetch finance profiles for entities
  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ["my-finance-profiles", entities?.map((e) => e.id)],
    queryFn: async () => {
      if (!entities?.length) return [];
      const { data, error } = await supabase
        .from("finance_profiles")
        .select("*")
        .in(
          "entity_id",
          entities.map((e) => e.id)
        );
      if (error) throw error;
      return data as FinanceProfile[];
    },
    enabled: !!entities?.length,
  });

  // Fetch upcoming payments
  const { data: upcomingPayments, isLoading: paymentsLoading } = useQuery({
    queryKey: ["my-upcoming-payments", entities?.map((e) => e.id)],
    queryFn: async () => {
      if (!entities?.length) return [];
      const { data, error } = await supabase
        .from("finance_payments")
        .select(
          `
          *,
          contract:finance_contracts(
            application:finance_applications(entity_id)
          )
        `
        )
        .in("status", ["scheduled", "overdue"])
        .order("due_date", { ascending: true })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!entities?.length,
  });

  const isLoading = entitiesLoading || profilesLoading || paymentsLoading;

  const getEntityIcon = (type: EntityType) => {
    switch (type) {
      case "individual":
        return <User className="h-5 w-5" />;
      case "company":
        return <Building2 className="h-5 w-5" />;
      case "institution":
        return <Landmark className="h-5 w-5" />;
    }
  };

  const getProfile = (entityId: string) => profiles?.find((p) => p.entity_id === entityId);

  const totalCreditLimit =
    profiles?.reduce((sum, p) => sum + (p.credit_limit_sar || 0), 0) || 0;
  const totalAvailableLimit =
    profiles?.reduce((sum, p) => sum + (p.available_limit_sar || 0), 0) || 0;
  const overduePayments = upcomingPayments?.filter((p) => p.status === "overdue") || [];

  if (isLoading) {
    return (
      <div className="space-y-6" dir="rtl">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6 pb-6" 
      dir="rtl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مركز التمويل</h1>
          <p className="text-muted-foreground">إدارة طلبات التمويل والأقساط</p>
        </div>
        <Button onClick={() => navigate("/app/finance/apply")} size="lg" className="gap-2">
          <Sparkles className="h-4 w-4" />
          طلب تمويل جديد
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">الحد الائتماني</p>
                  <p className="text-2xl font-bold mt-1" dir="ltr">
                    {formatCurrencySAR(totalCreditLimit)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">المتاح للتمويل</p>
                  <p className="text-2xl font-bold mt-1 text-green-600" dir="ltr">
                    {formatCurrencySAR(totalAvailableLimit)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-green-500/10">
                  <Wallet className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={cn(
            "border-0 shadow-md hover:shadow-lg transition-shadow",
            overduePayments.length > 0 && "ring-1 ring-red-200"
          )}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">أقساط قادمة</p>
                  <p className={cn(
                    "text-2xl font-bold mt-1",
                    overduePayments.length > 0 && "text-red-600"
                  )}>
                    {upcomingPayments?.length || 0}
                  </p>
                </div>
                <div className={cn(
                  "p-3 rounded-xl",
                  overduePayments.length > 0 ? "bg-red-500/10" : "bg-blue-500/10"
                )}>
                  <CreditCard className={cn(
                    "h-6 w-6",
                    overduePayments.length > 0 ? "text-red-600" : "text-blue-600"
                  )} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Entities Section */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                الكيانات المسجلة
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/app/finance/entities/new")}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                إضافة كيان
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {entities?.length === 0 ? (
              <motion.div 
                variants={itemVariants}
                className="text-center py-12"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Building2 className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold mb-2">لا توجد كيانات مسجلة</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  سجّل كياناً جديداً للبدء في التقديم على خدمات التمويل
                </p>
                <Button onClick={() => navigate("/app/finance/entities/new")} size="lg">
                  <Plus className="h-4 w-4 ml-2" />
                  تسجيل كيان جديد
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {entities?.map((entity, index) => {
                  const profile = getProfile(entity.id);
                  const typeConfig = ENTITY_TYPE_CONFIG[entity.entity_type];
                  const kycStatus = profile?.kyc_status as KYCStatus | undefined;
                  const kycConfig = kycStatus ? KYC_STATUS_CONFIG[kycStatus] : null;

                  return (
                    <motion.div
                      key={entity.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={cn(
                          "cursor-pointer transition-all border-0 shadow-sm hover:shadow-md",
                          selectedEntityId === entity.id && "ring-2 ring-primary"
                        )}
                        onClick={() => setSelectedEntityId(entity.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-xl bg-muted">
                                {getEntityIcon(entity.entity_type)}
                              </div>
                              <div>
                                <p className="font-semibold">{entity.legal_name_ar}</p>
                                <p className="text-sm text-muted-foreground">
                                  {typeConfig.label}
                                </p>
                              </div>
                            </div>
                            {kycConfig && (
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  kycConfig.variant === "success" &&
                                    "bg-green-500/10 text-green-600 border-green-200",
                                  kycConfig.variant === "warning" &&
                                    "bg-yellow-500/10 text-yellow-600 border-yellow-200",
                                  kycConfig.variant === "destructive" &&
                                    "bg-red-500/10 text-red-600 border-red-200"
                                )}
                              >
                                {kycConfig.label}
                              </Badge>
                            )}
                          </div>

                          {profile && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">الحد المتاح</span>
                                <span className="font-semibold" dir="ltr">
                                  {formatCurrencySAR(profile.available_limit_sar || 0)}
                                </span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Upcoming Payments */}
      {upcomingPayments && upcomingPayments.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                الأقساط القادمة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingPayments.map((payment, index) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border",
                      payment.status === "overdue" && "bg-red-500/5 border-red-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {payment.status === "overdue" ? (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-blue-600" />
                      )}
                      <div>
                        <p className="font-semibold">القسط {payment.installment_no}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(payment.due_date).toLocaleDateString("ar-SA")}
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className={cn(
                        "font-bold",
                        payment.status === "overdue" && "text-red-600"
                      )} dir="ltr">
                        {formatCurrencySAR(payment.amount_sar)}
                      </p>
                      <Button size="sm" variant={payment.status === "overdue" ? "destructive" : "default"}>
                        دفع الآن
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* My Applications */}
      <motion.div variants={itemVariants}>
        <MyApplications />
      </motion.div>
    </motion.div>
  );
}
