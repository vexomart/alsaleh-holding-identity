/**
 * PageContainer - RTL-Native Page Wrapper
 * Simple wrapper for RTL direction
 * Header/Footer are handled by UnifiedLayout globally
 */

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ 
  children, 
  className,
}: PageContainerProps) {
  return (
    <div 
      dir="rtl"
      className={cn(
        "min-h-full bg-gradient-to-br from-background via-accent/5 to-secondary/5 dark:from-background dark:via-primary/5 dark:to-accent/5",
        "text-start",
        className
      )}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.03]" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
