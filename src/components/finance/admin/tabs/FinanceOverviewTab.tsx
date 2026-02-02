/**
 * Finance Overview Tab - نظرة عامة على التمويل
 */

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  TrendingUp,
  FileText,
  Users,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Banknote,
} from "lucide-react";
import { formatCurrencySAR } from "@/types/finance";
import { Skeleton } from "@/components/ui/skeleton";

export function FinanceOverviewTab() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-finance-stats"],
    queryFn: async () => {
      const [
        applicationsRes,
        contractsRes,
        paymentsRes,
        entitiesRes,
      ] = await Promise.all([
        supabase.from("finance_applications").select("status, amount_sar"),
        supabase.from("finance_contracts").select("status"),
        supabase.from("finance_payments").select("status, amount_sar"),
        supabase.from("entities").select("entity_type, status"),
      ]);

      const applications = applicationsRes.data || [];
      const contracts = contractsRes.data || [];
      const payments = paymentsRes.data || [];
      const entities = entitiesRes.data || [];

      return {
        totalApplications: applications.length,
        pendingApplications: applications.filter((a) => 
          ["submitted", "under_review"].includes(a.status)
        ).length,
        approvedApplications: applications.filter((a) => a.status === "approved").length,
        totalAmountRequested: applications.reduce((sum, a) => sum + (a.amount_sar || 0), 0),

        totalContracts: contracts.length,
        activeContracts: contracts.filter((c) => c.status === "active").length,
        pendingSignature: contracts.filter((c) => 
          ["generated", "signed_by_customer"].includes(c.status)
        ).length,

        totalPayments: payments.length,
        paidPayments: payments.filter((p) => p.status === "paid").length,
        overduePayments: payments.filter((p) => p.status === "overdue").length,
        totalCollected: payments
          .filter((p) => p.status === "paid")
          .reduce((sum, p) => sum + (p.amount_sar || 0), 0),

        totalEntities: entities.length,
        activeEntities: entities.filter((e) => e.status === "active").length,
        entityTypes: {
          individual: entities.filter((e) => e.entity_type === "individual").length,
          company: entities.filter((e) => e.entity_type === "company").length,
          institution: entities.filter((e) => e.entity_type === "institution").length,
        },
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
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

  const statCards = [
    {
      title: "إجمالي الطلبات",
      value: stats?.totalApplications || 0,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
    },
    {
      title: "طلبات قيد المراجعة",
      value: stats?.pendingApplications || 0,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-500/10",
    },
    {
      title: "طلبات موافق عليها",
      value: stats?.approvedApplications || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-500/10",
    },
    {
      title: "إجمالي المبالغ المطلوبة",
      value: formatCurrencySAR(stats?.totalAmountRequested || 0),
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-primary/10",
      isAmount: true,
    },
    {
      title: "العقود النشطة",
      value: stats?.activeContracts || 0,
      icon: FileText,
      color: "text-green-600",
      bg: "bg-green-500/10",
    },
    {
      title: "بانتظار التوقيع",
      value: stats?.pendingSignature || 0,
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-500/10",
    },
    {
      title: "أقساط متأخرة",
      value: stats?.overduePayments || 0,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-500/10",
    },
    {
      title: "إجمالي المحصّل",
      value: formatCurrencySAR(stats?.totalCollected || 0),
      icon: Banknote,
      color: "text-green-600",
      bg: "bg-green-500/10",
      isAmount: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className={`text-2xl font-bold mt-1 ${stat.isAmount ? "text-lg" : ""}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Entity Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            توزيع الكيانات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-500/10">
              <p className="text-3xl font-bold text-blue-600">
                {stats?.entityTypes.individual || 0}
              </p>
              <p className="text-sm text-muted-foreground mt-1">أفراد</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-500/10">
              <p className="text-3xl font-bold text-purple-600">
                {stats?.entityTypes.company || 0}
              </p>
              <p className="text-sm text-muted-foreground mt-1">شركات</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-500/10">
              <p className="text-3xl font-bold text-green-600">
                {stats?.entityTypes.institution || 0}
              </p>
              <p className="text-sm text-muted-foreground mt-1">مؤسسات</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
