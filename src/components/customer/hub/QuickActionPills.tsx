/**
 * Quick Action Pills - Mobile App-like Shortcuts
 * TRUE RTL: Pills flow from start, icon AFTER text visually
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
  LucideIcon,
} from "lucide-react";

interface QuickAction {
  titleAr: string;
  titleEn: string;
  icon: LucideIcon;
  path: string;
  variant: "primary" | "blue" | "emerald" | "purple";
}

const actions: QuickAction[] = [
  {
    titleAr: "طلب جديد",
    titleEn: "New Order",
    icon: Plus,
    path: "/app/services",
    variant: "primary",
  },
  {
    titleAr: "طلباتي",
    titleEn: "Orders",
    icon: Package,
    path: "/app/orders",
    variant: "blue",
  },
  {
    titleAr: "عقودي",
    titleEn: "Contracts",
    icon: FileSignature,
    path: "/app/contracts",
    variant: "emerald",
  },
  {
    titleAr: "المحفظة",
    titleEn: "Wallet",
    icon: Wallet,
    path: "/app/wallet",
    variant: "purple",
  },
];

const variantStyles: Record<QuickAction["variant"], string> = {
  primary: "bg-primary hover:bg-primary/90 text-primary-foreground",
  blue: "bg-blue-600 hover:bg-blue-700 text-white",
  emerald: "bg-emerald-600 hover:bg-emerald-700 text-white",
  purple: "bg-purple-600 hover:bg-purple-700 text-white",
};

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

  // RTL-safe animation: only animate y, not x
  const item = {
    hidden: reducedMotion ? {} : { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
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
              "h-11 min-h-[44px] px-4 rounded-full gap-2 font-medium shadow-lg shadow-black/10",
              "transition-transform duration-150 active:scale-95",
              "flex items-center",
              variantStyles[action.variant]
            )}
          >
            {/* In RTL, icon appears AFTER text (visually on the left) */}
            {/* Using flex-row-reverse to swap icon/text order in RTL */}
            <span className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <action.icon className="h-4 w-4 shrink-0" />
              <span>{isRTL ? action.titleAr : action.titleEn}</span>
            </span>
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
}
