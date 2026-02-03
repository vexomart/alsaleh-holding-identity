/**
 * Sticky Footer Actions - Mobile CTA Bar
 * Fixed bottom bar for primary actions on detail pages
 */

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StickyFooterActionsProps {
  children: ReactNode;
  className?: string;
  visible?: boolean;
}

export function StickyFooterActions({
  children,
  className,
  visible = true,
}: StickyFooterActionsProps) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "fixed bottom-0 inset-x-0 z-50",
        "bg-background/95 backdrop-blur-xl",
        "border-t border-border/50",
        "px-4 py-3",
        "pb-safe",
        "md:hidden", // Only on mobile
        className
      )}
      style={{
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="flex gap-3">
        {children}
      </div>
    </motion.div>
  );
}

export default StickyFooterActions;
