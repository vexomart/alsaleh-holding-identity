/**
 * Client Recent Activity - Activity Feed
 * Recent orders with status indicators
 */

import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
  ArrowUpRight,
} from "lucide-react";

interface RecentOrder {
  id: string;
  order_number: string;
  title: string;
  title_ar?: string;
  status: string;
  created_at: string;
  total_amount?: number;
}

interface ClientRecentActivityProps {
  orders: RecentOrder[];
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
    color: "text-amber-600",
  },
  processing: {
    labelAr: "قيد المعالجة",
    labelEn: "Processing",
    icon: Package,
    color: "text-blue-600",
  },
  in_progress: {
    labelAr: "قيد التنفيذ",
    labelEn: "In Progress",
    icon: Truck,
    color: "text-indigo-600",
  },
  completed: {
    labelAr: "مكتمل",
    labelEn: "Completed",
    icon: CheckCircle2,
    color: "text-emerald-600",
  },
  cancelled: {
    labelAr: "ملغي",
    labelEn: "Cancelled",
    icon: XCircle,
    color: "text-red-600",
  },
};

export function ClientRecentActivity({ orders, isRTL }: ClientRecentActivityProps) {
  const navigate = useNavigate();
  const rtlRow = isRTL ? "flex-row-reverse" : "flex-row";
  const ArrowIcon = isRTL ? ChevronLeft : ChevronRight;

  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: isRTL ? ar : enUS,
    });
  };

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-2 text-lg", rtlRow)}>
            <Activity className="h-5 w-5 text-primary" />
            {isRTL ? "النشاط الأخير" : "Recent Activity"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="p-3 rounded-full bg-muted">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {isRTL ? "لا يوجد نشاط حديث" : "No recent activity"}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/portal/services")}
            >
              {isRTL ? "تصفح الخدمات" : "Browse Services"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className={cn("flex items-center justify-between", rtlRow)}>
          <CardTitle className={cn("flex items-center gap-2 text-lg", rtlRow)}>
            <Activity className="h-5 w-5 text-primary" />
            {isRTL ? "النشاط الأخير" : "Recent Activity"}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/portal/orders")}
            className={cn("gap-1 text-xs h-8", rtlRow)}
          >
            {isRTL ? "عرض الكل" : "View All"}
            <ArrowIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {orders.map((order) => {
            const status = statusConfig[order.status || "pending"] || statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <div
                key={order.id}
                className={cn(
                  "group flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors",
                  rtlRow
                )}
                onClick={() => navigate(`/portal/orders`)}
              >
                <div className={cn("p-2 rounded-lg bg-muted shrink-0")}>
                  <StatusIcon className={cn("h-4 w-4", status.color)} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {isRTL ? order.title_ar || order.title : order.title}
                  </p>
                  <div className={cn("flex items-center gap-2 mt-1", rtlRow)}>
                    <span className="text-xs text-muted-foreground font-mono" dir="ltr">
                      {order.order_number}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(order.created_at)}
                    </span>
                  </div>
                </div>

                <Badge 
                  variant="secondary" 
                  className={cn("text-xs shrink-0", status.color)}
                >
                  {isRTL ? status.labelAr : status.labelEn}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
