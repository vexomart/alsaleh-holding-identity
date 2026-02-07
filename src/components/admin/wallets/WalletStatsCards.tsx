/**
 * Wallet Stats Cards - Premium Banking Design
 * Modern KPI cards with gradients and animations
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Wallet,
  TrendingUp,
  Banknote,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface WalletStats {
  totalWallets: number;
  activeWallets: number;
  totalBalance: number;
  pendingTransactions: number;
  monthlyGrowth?: number;
}

interface WalletStatsCardsProps {
  stats: WalletStats;
  language: string;
  isLoading?: boolean;
}

export const WalletStatsCards = memo(function WalletStatsCards({
  stats,
  language,
  isLoading,
}: WalletStatsCardsProps) {
  const isRTL = language === "ar";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const avgBalance = stats.totalWallets > 0 
    ? stats.totalBalance / stats.totalWallets 
    : 0;

  const statCards = [
    {
      id: "total-balance",
      title: isRTL ? "إجمالي الأرصدة" : "Total Balance",
      value: formatCurrency(stats.totalBalance),
      subValue: `${stats.totalWallets} ${isRTL ? "محفظة" : "wallets"}`,
      icon: Banknote,
      gradient: "from-accent to-accent/80",
      iconBg: "bg-white/20",
      trend: stats.monthlyGrowth,
    },
    {
      id: "active-wallets",
      title: isRTL ? "المحافظ النشطة" : "Active Wallets",
      value: stats.activeWallets.toString(),
      subValue: `${Math.round((stats.activeWallets / stats.totalWallets) * 100 || 0)}% ${isRTL ? "من الإجمالي" : "of total"}`,
      icon: Wallet,
      gradient: "from-primary to-primary/80",
      iconBg: "bg-white/20",
    },
    {
      id: "avg-balance",
      title: isRTL ? "متوسط الرصيد" : "Average Balance",
      value: formatCurrency(avgBalance),
      subValue: isRTL ? "لكل محفظة" : "per wallet",
      icon: TrendingUp,
      gradient: "from-primary to-accent",
      iconBg: "bg-white/20",
    },
    {
      id: "pending",
      title: isRTL ? "معاملات معلقة" : "Pending Transactions",
      value: stats.pendingTransactions.toString(),
      subValue: isRTL ? "بحاجة لمراجعة" : "need review",
      icon: Activity,
      gradient: "from-secondary to-secondary/80",
      iconBg: "bg-white/20",
      highlight: stats.pendingTransactions > 0,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      }}
    >
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.95 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  delay: index * 0.05,
                },
              },
            }}
          >
            <Card
              className={cn(
                "relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300",
                card.highlight && "ring-2 ring-secondary/50 ring-offset-2 ring-offset-background animate-pulse"
              )}
            >
              {/* Gradient Background */}
              <div className={cn("absolute inset-0 bg-gradient-to-br", card.gradient)} />
              
              {/* Pattern Overlay */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              
              <CardContent className="relative p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/80">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-white mt-1 truncate" dir="ltr">
                      {card.value}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-xs text-white/70">
                        {card.subValue}
                      </span>
                      {card.trend !== undefined && (
                        <span className={cn(
                          "text-xs font-medium flex items-center gap-0.5 px-1.5 py-0.5 rounded-full",
                          card.trend >= 0 ? "bg-white/20 text-white" : "bg-destructive/30 text-destructive-foreground"
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
                  <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0", card.iconBg)}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                {/* Sparkle effect for highlight */}
                {card.highlight && (
                  <motion.div
                    className="absolute top-2 end-2"
                    animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Sparkles className="h-4 w-4 text-white/50" />
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
});
