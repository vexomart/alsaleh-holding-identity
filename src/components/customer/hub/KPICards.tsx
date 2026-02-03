/**
 * KPI Cards - Premium Glass Morphism Stats
 * Enterprise-grade animated statistics
 */

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AnimatedNumber } from "@/components/ui/animated-number";
import {
  Package,
  FileSignature,
  Receipt,
  Wallet,
  ArrowUpRight,
  TrendingUp,
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
  subtitleAr: string;
  subtitleEn: string;
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
  path: string;
  isAmount?: boolean;
  highlightWhen?: (value: number) => boolean;
}

const kpiConfigs: KPIConfig[] = [
  {
    key: "pendingOrders",
    titleAr: "الطلبات النشطة",
    titleEn: "Active Orders",
    subtitleAr: "قيد التنفيذ",
    subtitleEn: "In Progress",
    icon: Package,
    gradient: "from-blue-500 to-blue-600",
    iconBg: "bg-blue-500/20",
    path: "/app/orders",
  },
  {
    key: "activeContracts",
    titleAr: "العقود المعلقة",
    titleEn: "Pending Contracts",
    subtitleAr: "بانتظار الإجراء",
    subtitleEn: "Awaiting Action",
    icon: FileSignature,
    gradient: "from-emerald-500 to-emerald-600",
    iconBg: "bg-emerald-500/20",
    path: "/app/contracts",
  },
  {
    key: "pendingInvoices",
    titleAr: "الفواتير",
    titleEn: "Invoices",
    subtitleAr: "غير مدفوعة",
    subtitleEn: "Unpaid",
    icon: Receipt,
    gradient: "from-amber-500 to-orange-500",
    iconBg: "bg-amber-500/20",
    path: "/app/orders",
    highlightWhen: (v) => v > 0,
  },
  {
    key: "walletBalance",
    titleAr: "رصيد المحفظة",
    titleEn: "Wallet Balance",
    subtitleAr: "متاح للاستخدام",
    subtitleEn: "Available",
    icon: Wallet,
    gradient: "from-purple-500 to-violet-600",
    iconBg: "bg-purple-500/20",
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
        staggerChildren: reducedMotion ? 0 : 0.1,
      },
    },
  };

  const item = {
    hidden: reducedMotion ? {} : { opacity: 0, y: 25, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" as const }
    },
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="rounded-2xl overflow-hidden">
            <div className="p-5">
              <Skeleton className="h-12 w-12 rounded-xl mb-4" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-20" />
            </div>
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
      className="grid gap-4 grid-cols-2 lg:grid-cols-4"
    >
      {kpiConfigs.map((kpi, index) => {
        const value = data?.[kpi.key] ?? 0;
        const isHighlighted = kpi.highlightWhen?.(value);

        return (
          <motion.div key={kpi.key} variants={item}>
            <Card
              onClick={() => navigate(kpi.path)}
              className={cn(
                "relative overflow-hidden rounded-2xl cursor-pointer group",
                "transition-all duration-300 ease-out",
                "hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1",
                "active:scale-[0.98]",
                "border-0 bg-card",
                isHighlighted && "ring-2 ring-amber-400/50"
              )}
            >
              {/* Top gradient bar */}
              <div className={cn(
                "absolute top-0 inset-x-0 h-1",
                `bg-gradient-to-r ${kpi.gradient}`
              )} />

              {/* Hover gradient overlay */}
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                `bg-gradient-to-br ${kpi.gradient}`,
                "opacity-[0.03]"
              )} />

              <div className="relative p-5 md:p-6">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "p-3 rounded-xl transition-transform duration-300 group-hover:scale-110",
                    kpi.iconBg
                  )}>
                    <kpi.icon className={cn(
                      "h-6 w-6",
                      kpi.gradient.includes('blue') && "text-blue-500",
                      kpi.gradient.includes('emerald') && "text-emerald-500",
                      kpi.gradient.includes('amber') && "text-amber-500",
                      kpi.gradient.includes('purple') && "text-purple-500",
                    )} />
                  </div>
                  <div className={cn(
                    "p-2 rounded-full transition-all duration-300",
                    "opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0",
                    "bg-muted"
                  )}>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground font-medium">
                    {isRTL ? kpi.titleAr : kpi.titleEn}
                  </p>
                  
                  {/* Value */}
                  <div className="flex items-baseline gap-2">
                    <span dir="ltr" className="text-3xl md:text-4xl font-bold tabular-nums tracking-tight">
                      {kpi.isAmount ? (
                        <AnimatedNumber
                          value={value}
                          duration={200}
                          formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                        />
                      ) : (
                        reducedMotion ? value : (
                          <AnimatedNumber
                            value={value}
                            duration={200}
                            formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                          />
                        )
                      )}
                    </span>
                    {kpi.isAmount && (
                      <span className="text-sm text-muted-foreground font-medium">SAR</span>
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-xs text-muted-foreground/70 flex items-center gap-1">
                    {isHighlighted && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    )}
                    {isRTL ? kpi.subtitleAr : kpi.subtitleEn}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
