/**
 * Page Container - Mobile-First Layout Wrapper
 * Consistent spacing and safe area handling
 */

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
  noPadding?: boolean;
}

export function PageContainer({
  children,
  className,
  header,
  footer,
  noPadding = false,
}: PageContainerProps) {
  return (
    <div className="min-h-full flex flex-col">
      {/* Optional Header */}
      {header && (
        <div className="shrink-0">
          {header}
        </div>
      )}

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex-1",
          !noPadding && "px-4 py-4 md:px-6 md:py-6",
          footer && "pb-20 md:pb-6", // Space for sticky footer on mobile
          className
        )}
      >
        {children}
      </motion.main>

      {/* Optional Footer */}
      {footer}
    </div>
  );
}

/**
 * Section Container - Grouped Content Area
 */
interface SectionProps {
  title?: string;
  titleAr?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function Section({
  title,
  titleAr,
  children,
  className,
  action,
}: SectionProps) {
  return (
    <section className={cn("space-y-3", className)}>
      {(title || titleAr) && (
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {title || titleAr}
          </h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export default PageContainer;
