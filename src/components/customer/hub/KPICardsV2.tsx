/**
 * KPI Cards V2 - Next-Gen Glass Morphism Stats
 * Ultra-modern design with 3D effects and micro-animations
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
  TrendingUp,
  TrendingDown,
  Minus,
  LucideIcon,
  Sparkles,
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
  glowColor: string;
  iconGlow: string;
  path: string;
  isAmount?: boolean;
  highlightWhen?: (value: number) => boolean;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

const kpiConfigs: KPIConfig[] = [
  {
    key: "pendingOrders",
    titleAr: "الطلبات النشطة",
    titleEn: "Active Orders",
    subtitleAr: "قيد التنفيذ",
    subtitleEn: "In Progress",
    icon: Package,
    gradient: "from-blue-500 to-cyan-500",
    glowColor: "shadow-blue-500/20 hover:shadow-blue-500/40",
    iconGlow: "bg-blue-500/10 group-hover:bg-blue-500/20",
    path: "/app/orders",
    trend: "up",
    trendValue: "+2",
  },
  {
    key: "activeContracts",
    titleAr: "العقود المعلقة",
    titleEn: "Pending Contracts",
    subtitleAr: "بانتظار الإجراء",
    subtitleEn: "Awaiting Action",
    icon: FileSignature,
    gradient: "from-emerald-500 to-teal-500",
    glowColor: "shadow-emerald-500/20 hover:shadow-emerald-500/40",
    iconGlow: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
    path: "/app/contracts",
    trend: "neutral",
  },
  {
    key: "pendingInvoices",
    titleAr: "الفواتير",
    titleEn: "Invoices",
    subtitleAr: "غير مدفوعة",
    subtitleEn: "Unpaid",
    icon: Receipt,
    gradient: "from-amber-500 to-orange-500",
    glowColor: "shadow-amber-500/20 hover:shadow-amber-500/40",
    iconGlow: "bg-amber-500/10 group-hover:bg-amber-500/20",
    path: "/app/invoices",
    highlightWhen: (v) => v > 0,
    trend: "down",
    trendValue: "-1",
  },
  {
    key: "walletBalance",
    titleAr: "رصيد المحفظة",
    titleEn: "Wallet Balance",
    subtitleAr: "متاح للاستخدام",
    subtitleEn: "Available",
    icon: Wallet,
    gradient: "from-violet-500 to-purple-500",
    glowColor: "shadow-violet-500/20 hover:shadow-violet-500/40",
    iconGlow: "bg-violet-500/10 group-hover:bg-violet-500/20",
    path: "/app/wallet",
    isAmount: true,
    trend: "up",
    trendValue: "+500",
  },
];

const TrendIcon = ({ trend }: { trend?: "up" | "down" | "neutral" }) => {
  if (trend === "up") return <TrendingUp className="h-3 w-3 text-emerald-500" />;
  if (trend === "down") return <TrendingDown className="h-3 w-3 text-rose-500" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
};

export function KPICardsV2({ data, isLoading, isRTL, formatCurrency }: KPICardsProps) {
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

  const item: import("framer-motion").Variants = {
    hidden: reducedMotion ? {} : { opacity: 0, y: 30, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border bg-card p-5">
            <Skeleton className="h-12 w-12 rounded-xl mb-4" />
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-20" />
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
      {kpiConfigs.map((kpi, index) => {
        const value = data?.[kpi.key] ?? 0;
        const isHighlighted = kpi.highlightWhen?.(value);

        return (
          <motion.div key={kpi.key} variants={item}>
            <button
              onClick={() => navigate(kpi.path)}
              className={cn(
                "group relative w-full text-start overflow-hidden rounded-2xl cursor-pointer",
                "bg-card border border-border",
                "transition-all duration-500 ease-out",
                "hover:shadow-2xl hover:-translate-y-1",
                "active:scale-[0.98]",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
                kpi.glowColor,
                isHighlighted && "ring-2 ring-amber-400/50"
              )}
            >
              {/* Animated Background Gradient */}
              <motion.div
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  `bg-gradient-to-br ${kpi.gradient}`
                )}
                style={{ opacity: 0.03 }}
                animate={reducedMotion ? {} : { 
                  background: [
                    `linear-gradient(135deg, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 100%)`,
                    `linear-gradient(225deg, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 100%)`,
                    `linear-gradient(135deg, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 100%)`,
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />

              {/* Sparkle Effect on Hover */}
              <motion.div
                className="absolute top-3 end-3 opacity-0 group-hover:opacity-100 transition-opacity"
                animate={reducedMotion ? {} : { rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-4 w-4 text-primary/30" />
              </motion.div>

              <div className="relative p-5 md:p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <motion.div
                    className={cn(
                      "p-3 rounded-xl transition-all duration-300",
                      kpi.iconGlow
                    )}
                    whileHover={reducedMotion ? {} : { scale: 1.1, rotate: 5 }}
                  >
                    <kpi.icon className={cn("h-6 w-6 bg-gradient-to-br bg-clip-text", kpi.gradient)} style={{
                      color: `var(--${kpi.gradient.split('-')[1]}-500, currentColor)`
                    }} />
                  </motion.div>

                  {/* Navigation Arrow */}
                  <motion.div
                    className={cn(
                      "p-2 rounded-full transition-all duration-300",
                      "opacity-0 group-hover:opacity-100",
                      "bg-muted"
                    )}
                    initial={{ x: 5 }}
                    whileHover={{ x: 0, scale: 1.1 }}
                  >
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">
                    {isRTL ? kpi.titleAr : kpi.titleEn}
                  </p>

                  {/* Value with Animation */}
                  <div className="flex items-baseline gap-2">
                    <motion.span
                      dir="ltr"
                      className="text-4xl font-bold tabular-nums tracking-tight text-foreground"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 200 }}
                    >
                      <AnimatedNumber
                        value={value}
                        duration={600}
                        formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                      />
                    </motion.span>
                    {kpi.isAmount && (
                      <span className="text-sm text-muted-foreground font-medium">SAR</span>
                    )}
                  </div>

                  {/* Subtitle with Trend */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground/60 flex items-center gap-1.5">
                      {isHighlighted && (
                        <motion.span
                          className="w-2 h-2 rounded-full bg-amber-500"
                          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                      {isRTL ? kpi.subtitleAr : kpi.subtitleEn}
                    </p>

                    {/* Trend Indicator */}
                    {kpi.trend && kpi.trendValue && (
                      <motion.div
                        className={cn(
                          "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                          kpi.trend === "up" && "bg-emerald-500/10 text-emerald-600",
                          kpi.trend === "down" && "bg-rose-500/10 text-rose-600",
                          kpi.trend === "neutral" && "bg-muted text-muted-foreground"
                        )}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <TrendIcon trend={kpi.trend} />
                        <span>{kpi.trendValue}</span>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Bottom Progress Bar */}
                <div className="mt-4 h-1 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={cn("h-full rounded-full bg-gradient-to-r", kpi.gradient)}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((value / 10) * 100, 100)}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
