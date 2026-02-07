/**
 * Quick Action Pills - Modern Action Buttons
 * Clean minimal design with subtle hover effects
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
} from "lucide-react";

interface QuickAction {
  titleAr: string;
  titleEn: string;
  icon: LucideIcon;
  path: string;
  variant: "primary" | "secondary" | "accent";
}

const actions: QuickAction[] = [
  {
    titleAr: "طلب جديد",
    titleEn: "New Order",
    icon: Plus,
    path: "/dashboard/services",
    variant: "primary",
  },
  {
    titleAr: "طلباتي",
    titleEn: "My Orders",
    icon: Package,
    path: "/dashboard/orders",
    variant: "secondary",
  },
  {
    titleAr: "العقود",
    titleEn: "Contracts",
    icon: FileSignature,
    path: "/dashboard/contracts",
    variant: "secondary",
  },
  {
    titleAr: "الفواتير",
    titleEn: "Invoices",
    icon: Receipt,
    path: "/dashboard/invoices",
    variant: "secondary",
  },
  {
    titleAr: "المحفظة",
    titleEn: "Wallet",
    icon: Wallet,
    path: "/dashboard/wallet",
    variant: "secondary",
  },
  {
    titleAr: "التمويل",
    titleEn: "Finance",
    icon: Briefcase,
    path: "/dashboard/finance",
    variant: "accent",
  },
];

interface QuickActionPillsProps {
  isRTL: boolean;
}

export function QuickActionPills({ isRTL }: QuickActionPillsProps) {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.04,
      },
    },
  };

  const item = {
    hidden: reducedMotion ? {} : { opacity: 0, y: 8, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" as const }
    },
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const getVariantStyles = (variant: QuickAction["variant"]) => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-primary to-emerald-500 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]";
      case "accent":
        return "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.02]";
      default:
        return "bg-card border border-border text-foreground hover:bg-accent hover:border-primary/20 hover:scale-[1.02]";
    }
  };

  return (
    <div className="space-y-3">
      {/* Section Title */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 bg-primary rounded-full" />
        <h3 className="text-sm font-semibold text-muted-foreground">
          {isRTL ? "الوصول السريع" : "Quick Access"}
        </h3>
      </div>

      {/* Pills Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-wrap gap-2 md:gap-3"
      >
        {actions.map((action) => (
          <motion.button
            key={action.path}
            variants={item}
            onClick={() => navigate(action.path)}
            className={cn(
              "inline-flex items-center gap-2.5 h-11 px-5 rounded-xl font-medium",
              "transition-all duration-200 ease-out",
              "active:scale-[0.98]",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
              getVariantStyles(action.variant)
            )}
          >
            <action.icon className="h-4 w-4 shrink-0" />
            <span className="text-sm">{isRTL ? action.titleAr : action.titleEn}</span>
            <ArrowIcon className={cn(
              "h-3.5 w-3.5 transition-transform",
              action.variant !== "secondary" ? "opacity-70" : "opacity-40"
            )} />
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
