/**
 * KPI Cards - Modern Glass Morphism Stats
 * Clean minimal design with animated numbers
 */

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  FileSignature,
  Receipt,
  Wallet,
  ArrowUpRight,
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
  iconColor: string;
  iconBg: string;
  accentColor: string;
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
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    accentColor: "group-hover:border-blue-500/30",
    path: "/dashboard/orders",
  },
  {
    key: "activeContracts",
    titleAr: "العقود المعلقة",
    titleEn: "Pending Contracts",
    subtitleAr: "بانتظار الإجراء",
    subtitleEn: "Awaiting Action",
    icon: FileSignature,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    accentColor: "group-hover:border-emerald-500/30",
    path: "/dashboard/contracts",
  },
  {
    key: "pendingInvoices",
    titleAr: "الفواتير",
    titleEn: "Invoices",
    subtitleAr: "غير مدفوعة",
    subtitleEn: "Unpaid",
    icon: Receipt,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    accentColor: "group-hover:border-amber-500/30",
    path: "/dashboard/orders",
    highlightWhen: (v) => v > 0,
  },
  {
    key: "walletBalance",
    titleAr: "رصيد المحفظة",
    titleEn: "Wallet Balance",
    subtitleAr: "متاح للاستخدام",
    subtitleEn: "Available",
    icon: Wallet,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10",
    accentColor: "group-hover:border-violet-500/30",
    path: "/dashboard/wallet",
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

  const item = {
    hidden: reducedMotion ? {} : { opacity: 0, y: 20, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.35, ease: "easeOut" as const }
    },
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border bg-card p-5">
            <Skeleton className="h-10 w-10 rounded-xl mb-4" />
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-20" />
          </div>
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
      {kpiConfigs.map((kpi) => {
        const value = data?.[kpi.key] ?? 0;
        const isHighlighted = kpi.highlightWhen?.(value);

        return (
          <motion.div key={kpi.key} variants={item}>
            <button
              onClick={() => navigate(kpi.path)}
              className={cn(
                "group relative w-full text-start overflow-hidden rounded-2xl cursor-pointer",
                "bg-card border border-border",
                "transition-all duration-300 ease-out",
                "hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5",
                "active:scale-[0.99]",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
                kpi.accentColor,
                isHighlighted && "ring-1 ring-amber-400/40"
              )}
            >
              {/* Hover Gradient */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/[0.02] to-transparent" />

              <div className="relative p-5 md:p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-105",
                    kpi.iconBg
                  )}>
                    <kpi.icon className={cn("h-5 w-5", kpi.iconColor)} />
                  </div>
                  
                  <div className={cn(
                    "p-1.5 rounded-full transition-all duration-300",
                    "opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0",
                    "bg-muted"
                  )}>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground font-medium">
                    {isRTL ? kpi.titleAr : kpi.titleEn}
                  </p>
                  
                  {/* Value */}
                  <div className="flex items-baseline gap-2">
                    <span dir="ltr" className="text-3xl font-bold tabular-nums tracking-tight text-foreground">
                      {kpi.isAmount ? (
                        <AnimatedNumber
                          value={value}
                          duration={200}
                          formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                        />
                      ) : (
                        <AnimatedNumber
                          value={value}
                          duration={200}
                          formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                        />
                      )}
                    </span>
                    {kpi.isAmount && (
                      <span className="text-xs text-muted-foreground font-medium">SAR</span>
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-xs text-muted-foreground/60 flex items-center gap-1.5">
                    {isHighlighted && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    )}
                    {isRTL ? kpi.subtitleAr : kpi.subtitleEn}
                  </p>
                </div>
              </div>
            </button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
