/**
 * KPI Cards - Premium Animated Stats
 * TRUE RTL: Cards flow RIGHT → LEFT, icons on logical end
 */

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AnimatedNumber } from "@/components/ui/animated-number";
import {
  Package,
  FileSignature,
  Receipt,
  Wallet,
  LucideIcon,
} from "lucide-react";

interface KPIData {
  pendingOrders: number;
  activeContracts: number;
  pendingInvoices: number;
  walletBalance: number;
}

interface KPICardsProps {
  data: KPIData | null;
  isLoading: boolean;
  isRTL: boolean;
  formatCurrency: (amount: number) => string;
}

interface KPIConfig {
  key: keyof KPIData;
  titleAr: string;
  titleEn: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  path: string;
  isAmount?: boolean;
  highlightWhen?: (value: number) => boolean;
}

const kpiConfigs: KPIConfig[] = [
  {
    key: "pendingOrders",
    titleAr: "طلبات نشطة",
    titleEn: "Active Orders",
    icon: Package,
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    path: "/app/orders",
  },
  {
    key: "activeContracts",
    titleAr: "عقود معلقة",
    titleEn: "Pending Contracts",
    icon: FileSignature,
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    path: "/app/contracts",
  },
  {
    key: "pendingInvoices",
    titleAr: "فواتير غير مدفوعة",
    titleEn: "Unpaid Invoices",
    icon: Receipt,
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    path: "/app/orders",
    highlightWhen: (v) => v > 0,
  },
  {
    key: "walletBalance",
    titleAr: "رصيد المحفظة",
    titleEn: "Wallet Balance",
    icon: Wallet,
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
    path: "/app/wallet",
    isAmount: true,
  },
];

export function KPICards({ data, isLoading, isRTL, formatCurrency }: KPICardsProps) {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.08,
      },
    },
  };

  // RTL-safe animation: only animate y, not x
  const item = {
    hidden: reducedMotion ? {} : { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.3, ease: "easeOut" as const }
    },
  };

  if (isLoading) {
    return (
      <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="rounded-2xl">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-start justify-between">
                <Skeleton className="h-11 w-11 rounded-xl" />
                <Skeleton className="h-5 w-5 rounded" />
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4"
    >
      {kpiConfigs.map((kpi) => {
        const value = data?.[kpi.key] ?? 0;
        const isHighlighted = kpi.highlightWhen?.(value);

        return (
          <motion.div key={kpi.key} variants={item}>
            <Card
              onClick={() => navigate(kpi.path)}
              className={cn(
                "rounded-2xl cursor-pointer transition-all duration-200",
                "hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5",
                "active:scale-[0.98]",
                "border min-h-[120px]",
                isHighlighted && "border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10"
              )}
            >
              <CardContent className="p-4 md:p-5">
                {/* Icon Row - flex respects RTL dir automatically */}
                <div className="flex items-start justify-between">
                  <div className={cn("p-2.5 md:p-3 rounded-xl", kpi.iconBg)}>
                    <kpi.icon className={cn("h-5 w-5 md:h-6 md:w-6", kpi.iconColor)} />
                  </div>
                  {isHighlighted && (
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </div>

                {/* Content */}
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground font-medium">
                    {isRTL ? kpi.titleAr : kpi.titleEn}
                  </p>
                  <div className="mt-1">
                    {/* Numbers ALWAYS LTR for readability */}
                    <span dir="ltr" className="inline-block text-2xl md:text-3xl font-bold tabular-nums font-mono">
                      {kpi.isAmount ? (
                        <AnimatedNumber
                          value={value}
                          duration={150}
                          formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                          suffix=" SAR"
                        />
                      ) : (
                        reducedMotion ? value : (
                          <AnimatedNumber
                            value={value}
                            duration={150}
                            formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                          />
                        )
                      )}
                    </span>
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
