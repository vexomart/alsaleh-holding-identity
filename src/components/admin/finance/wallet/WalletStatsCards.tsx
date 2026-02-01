/**
 * Wallet Stats Cards - Premium Banking Design
 * Modern KPI cards with gradients and animations
 */

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Wallet,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  CreditCard,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletStats {
  totalWallets: number;
  activeWallets: number;
  totalBalance: number;
  avgBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  pendingTransfers: number;
  monthlyGrowth: number;
}

interface WalletStatsCardsProps {
  stats: WalletStats;
  isLoading?: boolean;
}

export function WalletStatsCards({ stats, isLoading }: WalletStatsCardsProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statCards = [
    {
      id: "total-balance",
      title: isRTL ? "إجمالي الأرصدة" : "Total Balance",
      value: formatCurrency(stats.totalBalance),
      subValue: `${stats.totalWallets} ${isRTL ? "محفظة" : "wallets"}`,
      icon: Banknote,
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-500/20",
      textColor: "text-emerald-50",
      trend: stats.monthlyGrowth,
    },
    {
      id: "active-wallets",
      title: isRTL ? "المحافظ النشطة" : "Active Wallets",
      value: stats.activeWallets.toString(),
      subValue: `${Math.round((stats.activeWallets / stats.totalWallets) * 100 || 0)}% ${isRTL ? "من الإجمالي" : "of total"}`,
      icon: Wallet,
      gradient: "from-blue-500 to-indigo-600",
      iconBg: "bg-blue-500/20",
      textColor: "text-blue-50",
    },
    {
      id: "avg-balance",
      title: isRTL ? "متوسط الرصيد" : "Average Balance",
      value: formatCurrency(stats.avgBalance),
      subValue: isRTL ? "لكل محفظة" : "per wallet",
      icon: TrendingUp,
      gradient: "from-violet-500 to-purple-600",
      iconBg: "bg-violet-500/20",
      textColor: "text-violet-50",
    },
    {
      id: "pending",
      title: isRTL ? "طلبات معلقة" : "Pending Transfers",
      value: stats.pendingTransfers.toString(),
      subValue: isRTL ? "بحاجة لمراجعة" : "need review",
      icon: Activity,
      gradient: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-500/20",
      textColor: "text-amber-50",
      highlight: stats.pendingTransfers > 0,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <motion.div key={card.id} variants={cardVariants}>
            <Card
              className={cn(
                "relative overflow-hidden border-0 shadow-lg",
                card.highlight && "ring-2 ring-amber-500/50 ring-offset-2 ring-offset-background"
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br", card.gradient)} />
              <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
              <CardContent className="relative p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={cn("text-sm font-medium opacity-80", card.textColor)}>
                      {card.title}
                    </p>
                    <p className={cn("text-2xl font-bold mt-1", card.textColor)} dir="ltr">
                      {card.value}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={cn("text-xs opacity-70", card.textColor)}>
                        {card.subValue}
                      </span>
                      {card.trend !== undefined && (
                        <span className={cn(
                          "text-xs font-medium flex items-center gap-0.5 px-1.5 py-0.5 rounded-full",
                          card.trend >= 0 ? "bg-white/20 text-white" : "bg-red-500/30 text-red-200"
                        )}>
                          {card.trend >= 0 ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3" />
                          )}
                          {Math.abs(card.trend)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", card.iconBg)}>
                    <Icon className={cn("h-6 w-6", card.textColor)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
