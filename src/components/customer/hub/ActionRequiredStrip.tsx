/**
 * Action Required Strip - Smart Priority Actions
 * TRUE RTL: Cards flow start → end, icons on start
 */

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  AlertCircle,
  FileSignature,
  Receipt,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import type { ActionItem } from "../ClientHub";

interface ActionRequiredStripProps {
  items: ActionItem[];
  isRTL: boolean;
}

const typeIcons: Record<ActionItem["type"], React.ElementType> = {
  contract_signature: FileSignature,
  pending_invoice: Receipt,
  order_update: Clock,
  contract_approval: Clock,
};

const typeColors: Record<ActionItem["type"], { bg: string; text: string }> = {
  contract_signature: {
    bg: "bg-primary/10",
    text: "text-primary",
  },
  pending_invoice: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-600 dark:text-amber-400",
  },
  order_update: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-600 dark:text-blue-400",
  },
  contract_approval: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-600 dark:text-purple-400",
  },
};

export function ActionRequiredStrip({ items, isRTL }: ActionRequiredStripProps) {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const ArrowIcon = isRTL ? ChevronLeft : ChevronRight;

  // Only show top 3 high/medium priority items
  const visibleItems = items
    .filter((i) => i.priority === "high" || i.priority === "medium")
    .slice(0, 3);

  if (visibleItems.length === 0) {
    return null;
  }

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
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-amber-500" />
        <h2 className="text-sm font-semibold text-foreground">
          {isRTL ? "يحتاج انتباهك" : "Needs Your Action"}
        </h2>
        <Badge variant="secondary" className="text-xs">
          {visibleItems.length}
        </Badge>
      </div>

      {/* Action Cards - Grid respects RTL via dir attribute */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visibleItems.map((actionItem) => {
          const TypeIcon = typeIcons[actionItem.type];
          const colors = typeColors[actionItem.type];

          return (
            <motion.div key={actionItem.id} variants={item}>
              <Card
                onClick={() => navigate(actionItem.link)}
                className={cn(
                  "group cursor-pointer transition-all duration-200 rounded-xl min-h-[80px]",
                  "hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]",
                  "border",
                  actionItem.priority === "high" &&
                    "border-destructive/30 bg-destructive/5"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Icon - on start (right in RTL) */}
                    <div className={cn("p-2.5 rounded-xl shrink-0", colors.bg)}>
                      <TypeIcon className={cn("h-5 w-5", colors.text)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm truncate">
                          {isRTL ? actionItem.titleAr : actionItem.titleEn}
                        </h3>
                        {actionItem.priority === "high" && (
                          <Sparkles className="h-3.5 w-3.5 text-destructive shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {isRTL ? actionItem.descriptionAr : actionItem.descriptionEn}
                      </p>
                      {actionItem.metadata?.invoiceNumber && (
                        <p dir="ltr" className="text-xs text-muted-foreground mt-1 font-mono tabular-nums">
                          {actionItem.metadata.invoiceNumber}
                        </p>
                      )}
                    </div>

                    {/* Arrow - on end */}
                    <ArrowIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
