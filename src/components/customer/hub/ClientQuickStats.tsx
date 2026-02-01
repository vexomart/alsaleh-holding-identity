/**
 * Client Quick Stats - Premium KPI Cards
 * Animated stats with RTL support
 */

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Package,
  FileSignature,
  Receipt,
  Wallet,
  TrendingUp,
  Bell,
  CheckCircle2,
} from "lucide-react";

interface ClientQuickStatsProps {
  data: {
    pendingOrders: number;
    activeContracts: number;
    pendingInvoices: number;
    walletBalance: number;
    unreadNotifications: number;
    completedOrders: number;
    totalSpent: number;
  } | null;
  isRTL: boolean;
  formatCurrency: (amount: number) => string;
}

export function ClientQuickStats({ data, isRTL, formatCurrency }: ClientQuickStatsProps) {
  const navigate = useNavigate();
  const rtlRow = isRTL ? "flex-row-reverse" : "flex-row";

  const stats = [
    {
      titleAr: "طلبات نشطة",
      titleEn: "Active Orders",
      value: data?.pendingOrders || 0,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      onClick: () => navigate("/app/orders"),
    },
    {
      titleAr: "عقود معلقة",
      titleEn: "Pending Contracts",
      value: data?.activeContracts || 0,
      icon: FileSignature,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      onClick: () => navigate("/app/contracts"),
    },
    {
      titleAr: "فواتير غير مدفوعة",
      titleEn: "Unpaid Invoices",
      value: data?.pendingInvoices || 0,
      icon: Receipt,
      color: "text-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      highlight: (data?.pendingInvoices || 0) > 0,
      onClick: () => navigate("/app/orders"),
    },
    {
      titleAr: "رصيد المحفظة",
      titleEn: "Wallet Balance",
      value: formatCurrency(data?.walletBalance || 0),
      icon: Wallet,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      isAmount: true,
      onClick: () => navigate("/app/wallet"),
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card
            className={cn(
              "cursor-pointer transition-all hover:shadow-lg hover:border-primary/30",
              stat.highlight && "border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10"
            )}
            onClick={stat.onClick}
          >
            <CardContent className="p-4">
              <div className={cn("flex items-start justify-between", rtlRow)}>
                <div className={cn("p-2.5 rounded-xl", stat.bgColor)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                {stat.highlight && (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                )}
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  {isRTL ? stat.titleAr : stat.titleEn}
                </p>
                <p className={cn(
                  "text-2xl font-bold mt-1",
                  stat.isAmount && "font-mono"
                )} dir={stat.isAmount ? "ltr" : undefined}>
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
