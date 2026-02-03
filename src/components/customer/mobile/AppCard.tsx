/**
 * App Card - Mobile-First Card Component
 * Beautiful cards with large touch targets and clean design
 */

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface AppCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  status?: {
    label: string;
    variant: "default" | "success" | "warning" | "destructive" | "secondary";
  };
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
  showChevron?: boolean;
  delay?: number;
}

const statusVariantMap = {
  default: "bg-primary/10 text-primary border-primary/20",
  success: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  destructive: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  secondary: "bg-muted text-muted-foreground border-border",
};

export function AppCard({
  title,
  subtitle,
  icon,
  status,
  onClick,
  children,
  className,
  showChevron = true,
  delay = 0,
}: AppCardProps) {
  const { isRTL } = useLanguage();
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.05 }}
      onClick={onClick}
      className={cn(
        "relative bg-card rounded-2xl",
        "border border-border/50",
        "p-4",
        "transition-all duration-200",
        onClick && [
          "cursor-pointer",
          "active:scale-[0.98]",
          "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
        ],
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        {icon && (
          <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {title}
              </h3>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Status Badge */}
            {status && (
              <Badge
                variant="outline"
                className={cn(
                  "shrink-0 text-xs font-medium",
                  statusVariantMap[status.variant]
                )}
              >
                {status.label}
              </Badge>
            )}
          </div>

          {/* Additional Content */}
          {children && (
            <div className="mt-3">
              {children}
            </div>
          )}
        </div>

        {/* Chevron */}
        {onClick && showChevron && (
          <ChevronIcon className="h-5 w-5 text-muted-foreground shrink-0 self-center" />
        )}
      </div>
    </motion.div>
  );
}

/**
 * App Card List - Stacked Cards with Stagger Animation
 */
interface AppCardListProps {
  children: ReactNode;
  className?: string;
}

export function AppCardList({ children, className }: AppCardListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {children}
    </div>
  );
}

/**
 * App Card Skeleton - Loading State
 */
export function AppCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-2xl border border-border/50 p-4 animate-pulse"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-muted rounded w-2/3" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AppCard;
