/**
 * Quick Action Pills V2 - Next-Gen Action Buttons
 * Ultra-modern design with glow effects and micro-animations
 */

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  Plus,
  Package,
  FileSignature,
  Wallet,
  Receipt,
  Briefcase,
  LucideIcon,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface QuickAction {
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: LucideIcon;
  path: string;
  variant: "primary" | "secondary" | "accent";
  gradient?: string;
}

const actions: QuickAction[] = [
  {
    titleAr: "طلب جديد",
    titleEn: "New Order",
    descAr: "ابدأ طلبك الآن",
    descEn: "Start your order",
    icon: Plus,
    path: "/app/services",
    variant: "primary",
    gradient: "from-primary via-emerald-500 to-cyan-500",
  },
  {
    titleAr: "طلباتي",
    titleEn: "My Orders",
    descAr: "تتبع طلباتك",
    descEn: "Track your orders",
    icon: Package,
    path: "/app/orders",
    variant: "secondary",
  },
  {
    titleAr: "العقود",
    titleEn: "Contracts",
    descAr: "إدارة العقود",
    descEn: "Manage contracts",
    icon: FileSignature,
    path: "/app/contracts",
    variant: "secondary",
  },
  {
    titleAr: "الفواتير",
    titleEn: "Invoices",
    descAr: "سجل الفواتير",
    descEn: "Invoice history",
    icon: Receipt,
    path: "/app/invoices",
    variant: "secondary",
  },
  {
    titleAr: "المحفظة",
    titleEn: "Wallet",
    descAr: "رصيدك المتاح",
    descEn: "Your balance",
    icon: Wallet,
    path: "/app/wallet",
    variant: "secondary",
  },
  {
    titleAr: "التمويل",
    titleEn: "Finance",
    descAr: "حلول التمويل",
    descEn: "Finance solutions",
    icon: Briefcase,
    path: "/app/finance",
    variant: "accent",
    gradient: "from-amber-500 via-orange-500 to-rose-500",
  },
];

interface QuickActionPillsV2Props {
  isRTL: boolean;
}

export function QuickActionPillsV2({ isRTL }: QuickActionPillsV2Props) {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.05,
      },
    },
  };

  const item: import("framer-motion").Variants = {
    hidden: reducedMotion ? {} : { opacity: 0, y: 15, scale: 0.9 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-4">
      {/* Section Title */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="w-1.5 h-5 bg-gradient-to-b from-primary to-emerald-500 rounded-full"
            animate={reducedMotion ? {} : { scaleY: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            {isRTL ? "الوصول السريع" : "Quick Access"}
          </h3>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-border via-border to-transparent" />
      </motion.div>

      {/* Pills Grid - Responsive */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-2 sm:gap-3"
      >
        {actions.map((action, index) => (
          <motion.button
            key={action.path}
            variants={item}
            onClick={() => navigate(action.path)}
            whileHover={reducedMotion ? {} : { scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "group relative overflow-hidden",
              "inline-flex items-center justify-center gap-2 sm:gap-3",
              "h-11 sm:h-12 px-3 sm:px-5 rounded-xl font-medium",
              "transition-all duration-300 ease-out",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
              // Make primary and accent full width on mobile
              (action.variant === "primary" || action.variant === "accent") && "col-span-2 sm:col-span-1",
              action.variant === "primary" && [
                "bg-gradient-to-r from-primary to-emerald-500 text-white",
                "shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40",
              ],
              action.variant === "accent" && [
                "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
                "shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40",
              ],
              action.variant === "secondary" && [
                "bg-card border border-border text-foreground",
                "hover:bg-accent hover:border-primary/30",
                "shadow-sm hover:shadow-md",
              ]
            )}
          >
            {/* Animated Shine Effect for primary/accent */}
            {(action.variant === "primary" || action.variant === "accent") && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                animate={reducedMotion ? {} : { translateX: ["−100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
            )}

            {/* Icon */}
            <motion.div
              className={cn(
                "relative shrink-0",
                action.variant === "secondary" && "text-muted-foreground group-hover:text-primary"
              )}
              animate={reducedMotion ? {} : index === 0 ? { rotate: [0, 90, 0] } : {}}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <action.icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            </motion.div>

            {/* Text */}
            <span className="text-xs sm:text-sm font-semibold truncate">
              {isRTL ? action.titleAr : action.titleEn}
            </span>

            {/* Arrow - Hidden on mobile for space */}
            <motion.div
              initial={{ x: 0, opacity: 0.5 }}
              whileHover={{ x: 3, opacity: 1 }}
              className={cn(
                "hidden sm:block shrink-0",
                action.variant === "secondary" ? "text-muted-foreground/50" : "text-white/70"
              )}
            >
              <ArrowIcon className="h-3.5 w-3.5" />
            </motion.div>

            {/* Sparkle for primary */}
            {action.variant === "primary" && (
              <motion.div
                className="absolute -top-1 -end-1 hidden sm:block"
                animate={reducedMotion ? {} : { scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="h-3 w-3 text-white/50" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
