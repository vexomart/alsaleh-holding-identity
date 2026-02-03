/**
 * Quick Action Pills - Premium Action Buttons
 * Gradient pills with hover effects
 */

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface QuickAction {
  titleAr: string;
  titleEn: string;
  icon: LucideIcon;
  path: string;
  gradient: string;
  shadowColor: string;
}

const actions: QuickAction[] = [
  {
    titleAr: "طلب جديد",
    titleEn: "New Order",
    icon: Plus,
    path: "/app/services",
    gradient: "from-teal-500 to-emerald-600",
    shadowColor: "shadow-teal-500/30",
  },
  {
    titleAr: "طلباتي",
    titleEn: "My Orders",
    icon: Package,
    path: "/app/orders",
    gradient: "from-blue-500 to-blue-600",
    shadowColor: "shadow-blue-500/30",
  },
  {
    titleAr: "العقود",
    titleEn: "Contracts",
    icon: FileSignature,
    path: "/app/contracts",
    gradient: "from-violet-500 to-purple-600",
    shadowColor: "shadow-violet-500/30",
  },
  {
    titleAr: "الفواتير",
    titleEn: "Invoices",
    icon: Receipt,
    path: "/app/invoices",
    gradient: "from-amber-500 to-orange-500",
    shadowColor: "shadow-amber-500/30",
  },
  {
    titleAr: "المحفظة",
    titleEn: "Wallet",
    icon: Wallet,
    path: "/app/wallet",
    gradient: "from-pink-500 to-rose-600",
    shadowColor: "shadow-pink-500/30",
  },
  {
    titleAr: "التمويل",
    titleEn: "Finance",
    icon: Briefcase,
    path: "/app/finance",
    gradient: "from-slate-600 to-slate-700",
    shadowColor: "shadow-slate-500/30",
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
        staggerChildren: reducedMotion ? 0 : 0.05,
      },
    },
  };

  const item = {
    hidden: reducedMotion ? {} : { opacity: 0, y: 10, scale: 0.9 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.25, ease: "easeOut" as const }
    },
  };

  const ArrowIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="space-y-3">
      {/* Section Title */}
      <div className="flex items-center justify-between">
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
          <motion.div key={action.path} variants={item}>
            <Button
              onClick={() => navigate(action.path)}
              className={cn(
                "h-11 min-h-[44px] px-5 rounded-full gap-2.5 font-semibold",
                "transition-all duration-200",
                "active:scale-95 hover:scale-105",
                "text-white border-0",
                `bg-gradient-to-r ${action.gradient}`,
                `shadow-lg ${action.shadowColor}`,
                "hover:shadow-xl"
              )}
            >
              <action.icon className="h-4 w-4 shrink-0" />
              <span>{isRTL ? action.titleAr : action.titleEn}</span>
              <ArrowIcon className="h-3.5 w-3.5 opacity-60" />
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
