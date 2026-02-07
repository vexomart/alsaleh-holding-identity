/**
 * Activity Feed - Global SaaS Style Timeline
 * TRUE RTL: Icon on start, text aligned to start, badge on end
 */

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import {
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  Truck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ActivityFeedProps {
  orders: any[];
  isLoading: boolean;
  isRTL: boolean;
}

const statusConfig: Record<string, {
  labelAr: string;
  labelEn: string;
  icon: React.ElementType;
  color: string;
}> = {
  pending: {
    labelAr: "قيد الانتظار",
    labelEn: "Pending",
    icon: Clock,
    color: "text-amber-500",
  },
  processing: {
    labelAr: "قيد المعالجة",
    labelEn: "Processing",
    icon: Package,
    color: "text-blue-500",
  },
  in_progress: {
    labelAr: "قيد التنفيذ",
    labelEn: "In Progress",
    icon: Truck,
    color: "text-indigo-500",
  },
  completed: {
    labelAr: "مكتمل",
    labelEn: "Completed",
    icon: CheckCircle2,
    color: "text-emerald-500",
  },
  cancelled: {
    labelAr: "ملغي",
    labelEn: "Cancelled",
    icon: XCircle,
    color: "text-destructive",
  },
};

export function ActivityFeed({ orders, isLoading, isRTL }: ActivityFeedProps) {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const ArrowIcon = isRTL ? ChevronLeft : ChevronRight;

  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: isRTL ? ar : enUS,
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.03,
      },
    },
  };

  // RTL-safe animation: only animate y, not x
  const item = {
    hidden: reducedMotion ? {} : { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-primary" />
            {isRTL ? "النشاط الأخير" : "Recent Activity"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="p-4 rounded-full bg-muted">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {isRTL ? "لا يوجد نشاط حديث" : "No recent activity"}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard/services")}
              className="mt-2 min-h-[44px]"
            >
              {isRTL ? "تصفح الخدمات" : "Browse Services"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-primary" />
            {isRTL ? "النشاط الأخير" : "Recent Activity"}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/orders")}
            className="gap-1 text-xs h-9 min-h-[44px] px-3"
          >
            {isRTL ? "عرض الكل" : "View All"}
            <ArrowIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-1"
        >
          {orders.slice(0, 6).map((order) => {
            const status = statusConfig[order.status || "pending"] || statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={order.id}
                variants={item}
                onClick={() => navigate("/dashboard/orders")}
                className={cn(
                  "group flex items-center gap-3 p-3 rounded-xl min-h-[56px]",
                  "hover:bg-muted/50 cursor-pointer transition-colors"
                )}
              >
                {/* Icon - appears on start (right in RTL, left in LTR) */}
                <div className="p-2 rounded-lg bg-muted shrink-0">
                  <StatusIcon className={cn("h-4 w-4", status.color)} />
                </div>

                {/* Content - flex-1 fills middle */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {isRTL ? order.title_ar || order.title : order.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {/* Order number ALWAYS LTR */}
                    <span dir="ltr" className="text-xs text-muted-foreground font-mono tabular-nums">
                      {order.order_number}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(order.created_at)}
                    </span>
                  </div>
                </div>

                {/* Status Badge - appears on end */}
                <Badge
                  variant="secondary"
                  className={cn("text-xs shrink-0 font-medium", status.color)}
                >
                  {isRTL ? status.labelAr : status.labelEn}
                </Badge>
              </motion.div>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
  );
}
