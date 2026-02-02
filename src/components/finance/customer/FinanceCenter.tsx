/**
 * Finance Center - مركز التمويل للعميل
 * Main customer dashboard for finance operations
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Wallet,
  FileText,
  CreditCard,
  Plus,
  Building2,
  User,
  Landmark,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Entity,
  EntityType,
  FinanceProfile,
  FinanceApplication,
  FinancePayment,
  ENTITY_TYPE_CONFIG,
  KYC_STATUS_CONFIG,
  formatCurrencySAR,
  KYCStatus,
} from "@/types/finance";
import { Skeleton } from "@/components/ui/skeleton";

export function FinanceCenter() {
  const { user } = useAuth();
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
      <div className="space-y-6 p-6" dir="rtl">
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
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مركز التمويل</h1>
          <p className="text-muted-foreground">إدارة طلبات التمويل والأقساط</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 ml-2" />
          طلب تمويل جديد
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">الحد الائتماني</p>
                  <p className="text-2xl font-bold mt-1">
                    {formatCurrencySAR(totalCreditLimit)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">المتاح للتمويل</p>
                  <p className="text-2xl font-bold mt-1 text-green-600">
                    {formatCurrencySAR(totalAvailableLimit)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10">
                  <Wallet className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={overduePayments.length > 0 ? "border-red-200" : ""}>
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
                  "p-3 rounded-lg",
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              الكيانات المسجلة
            </CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 ml-1" />
              إضافة كيان
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {entities?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>لم تقم بتسجيل أي كيان بعد</p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 ml-2" />
                تسجيل كيان جديد
              </Button>
            </div>
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md",
                        selectedEntityId === entity.id && "ring-2 ring-primary"
                      )}
                      onClick={() => setSelectedEntityId(entity.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-muted">
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
                              <span className="font-semibold">
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

      {/* Upcoming Payments */}
      {upcomingPayments && upcomingPayments.length > 0 && (
        <Card>
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
                    "flex items-center justify-between p-4 rounded-lg border",
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
                    )}>
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
      )}
    </div>
  );
}
