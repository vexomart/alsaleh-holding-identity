/**
 * Client Action Items - "What Needs Your Action" Section
 * Priority-based action items with visual indicators
 */

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  FileSignature,
  Receipt,
  Package,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import type { ActionItem } from "../ClientHub";

interface ClientActionItemsProps {
  items: ActionItem[];
  isRTL: boolean;
}

const typeConfig: Record<ActionItem['type'], {
  icon: React.ElementType;
  color: string;
  bgColor: string;
}> = {
  contract_signature: {
    icon: FileSignature,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  pending_invoice: {
    icon: Receipt,
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
  order_update: {
    icon: Package,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  contract_approval: {
    icon: Clock,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
};

const priorityConfig: Record<ActionItem['priority'], {
  labelAr: string;
  labelEn: string;
  color: string;
}> = {
  high: {
    labelAr: "عاجل",
    labelEn: "Urgent",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  medium: {
    labelAr: "متوسط",
    labelEn: "Medium",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  low: {
    labelAr: "منخفض",
    labelEn: "Low",
    color: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
  },
};

export function ClientActionItems({ items, isRTL }: ClientActionItemsProps) {
  const navigate = useNavigate();
  const rtlRow = isRTL ? "flex-row-reverse" : "flex-row";
  const ArrowIcon = isRTL ? ChevronLeft : ChevronRight;

  if (items.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="p-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-lg">
                {isRTL ? "لا توجد إجراءات معلقة" : "All Caught Up!"}
              </p>
              <p className="text-sm text-muted-foreground max-w-sm">
                {isRTL 
                  ? "ليس لديك أي إجراءات تحتاج انتباهك حالياً"
                  : "You have no pending actions that need your attention"
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className={cn("flex items-center justify-between", rtlRow)}>
          <div className={cn("flex items-center gap-3", rtlRow)}>
            <div className="p-2 rounded-lg bg-primary/10">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {isRTL ? "يحتاج انتباهك" : "Needs Your Action"}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isRTL 
                  ? `${items.length} إجراء معلق`
                  : `${items.length} pending action${items.length > 1 ? 's' : ''}`
                }
              </p>
            </div>
          </div>
          {items.filter(i => i.priority === 'high').length > 0 && (
            <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 gap-1">
              <Sparkles className="h-3 w-3" />
              {isRTL 
                ? `${items.filter(i => i.priority === 'high').length} عاجل`
                : `${items.filter(i => i.priority === 'high').length} Urgent`
              }
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {items.map((item, index) => {
            const typeInfo = typeConfig[item.type];
            const priorityInfo = priorityConfig[item.priority];
            const TypeIcon = typeInfo.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  className={cn(
                    "group flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors cursor-pointer",
                    item.priority === 'high' && "border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-900/10",
                    rtlRow
                  )}
                  onClick={() => navigate(item.link)}
                >
                  {/* Icon */}
                  <div className={cn("p-3 rounded-xl shrink-0", typeInfo.bgColor)}>
                    <TypeIcon className={cn("h-5 w-5", typeInfo.color)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className={cn("flex items-center gap-2 mb-1 flex-wrap", rtlRow)}>
                      <h4 className="font-semibold truncate">
                        {isRTL ? item.titleAr : item.titleEn}
                      </h4>
                      <Badge className={cn("text-xs", priorityInfo.color)}>
                        {isRTL ? priorityInfo.labelAr : priorityInfo.labelEn}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {isRTL ? item.descriptionAr : item.descriptionEn}
                    </p>
                    {item.metadata?.contractNumber && (
                      <p className="text-xs text-muted-foreground mt-1 font-mono" dir="ltr">
                        {item.metadata.contractNumber}
                      </p>
                    )}
                    {item.metadata?.invoiceNumber && (
                      <p className="text-xs text-muted-foreground mt-1 font-mono" dir="ltr">
                        {item.metadata.invoiceNumber}
                      </p>
                    )}
                  </div>

                  {/* Arrow */}
                  <ArrowIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
