/**
 * Risk Tab - إدارة المخاطر
 */

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  Users,
  FileText,
  Clock,
} from "lucide-react";
import { formatCurrencySAR } from "@/types/finance";
import { Skeleton } from "@/components/ui/skeleton";

export function RiskTab() {
  const { data: riskStats, isLoading } = useQuery({
    queryKey: ["admin-risk-stats"],
    queryFn: async () => {
      const [profilesRes, applicationsRes, paymentsRes] = await Promise.all([
        supabase.from("finance_profiles").select("risk_level, credit_limit_sar, available_limit_sar"),
        supabase.from("finance_applications").select("status, amount_sar, score_snapshot"),
        supabase.from("finance_payments").select("status, amount_sar"),
      ]);

      const profiles = profilesRes.data || [];
      const applications = applicationsRes.data || [];
      const payments = paymentsRes.data || [];

      const riskDistribution = {
        low: profiles.filter((p) => p.risk_level === "low").length,
        medium: profiles.filter((p) => p.risk_level === "medium").length,
        high: profiles.filter((p) => p.risk_level === "high").length,
      };

      const totalExposure = profiles.reduce(
        (sum, p) => sum + ((p.credit_limit_sar || 0) - (p.available_limit_sar || 0)),
        0
      );

      const overdueAmount = payments
        .filter((p) => p.status === "overdue")
        .reduce((sum, p) => sum + (p.amount_sar || 0), 0);

      const approvalRate =
        applications.length > 0
          ? (applications.filter((a) => a.status === "approved").length /
              applications.filter((a) => ["approved", "rejected"].includes(a.status)).length) *
            100
          : 0;

      return {
        riskDistribution,
        totalExposure,
        overdueAmount,
        approvalRate: approvalRate.toFixed(1),
        totalProfiles: profiles.length,
        highRiskCount: riskDistribution.high,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي التعرض</p>
                  <p className="text-xl font-bold mt-1">
                    {formatCurrencySAR(riskStats?.totalExposure || 0)}
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
          <Card className="border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">مبالغ متأخرة</p>
                  <p className="text-xl font-bold mt-1 text-red-600">
                    {formatCurrencySAR(riskStats?.overdueAmount || 0)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-red-500/10">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
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
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">نسبة الموافقة</p>
                  <p className="text-xl font-bold mt-1">
                    {riskStats?.approvalRate}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Risk Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            توزيع المخاطر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-6 rounded-lg bg-green-500/10 border border-green-200"
            >
              <p className="text-4xl font-bold text-green-600">
                {riskStats?.riskDistribution.low || 0}
              </p>
              <p className="text-sm text-green-700 mt-2">مخاطر منخفضة</p>
              <div className="mt-3 h-2 bg-green-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${
                      riskStats?.totalProfiles
                        ? ((riskStats.riskDistribution.low || 0) / riskStats.totalProfiles) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center p-6 rounded-lg bg-yellow-500/10 border border-yellow-200"
            >
              <p className="text-4xl font-bold text-yellow-600">
                {riskStats?.riskDistribution.medium || 0}
              </p>
              <p className="text-sm text-yellow-700 mt-2">مخاطر متوسطة</p>
              <div className="mt-3 h-2 bg-yellow-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{
                    width: `${
                      riskStats?.totalProfiles
                        ? ((riskStats.riskDistribution.medium || 0) / riskStats.totalProfiles) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center p-6 rounded-lg bg-red-500/10 border border-red-200"
            >
              <p className="text-4xl font-bold text-red-600">
                {riskStats?.riskDistribution.high || 0}
              </p>
              <p className="text-sm text-red-700 mt-2">مخاطر مرتفعة</p>
              <div className="mt-3 h-2 bg-red-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{
                    width: `${
                      riskStats?.totalProfiles
                        ? ((riskStats.riskDistribution.high || 0) / riskStats.totalProfiles) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Alerts */}
      {(riskStats?.highRiskCount || 0) > 0 && (
        <Card className="border-red-200 bg-red-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              تنبيهات المخاطر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">
              يوجد <span className="font-bold">{riskStats?.highRiskCount}</span> كيان
              مصنف بمخاطر مرتفعة يحتاج مراجعة
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
