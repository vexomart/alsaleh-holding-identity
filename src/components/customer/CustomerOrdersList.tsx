/**
 * Customer Orders List Page
 * Filters, status chips, realtime updates
 */

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  ShoppingCart,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Truck,
  CreditCard,
  Calendar,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  title: string;
  title_ar: string | null;
  status: string | null;
  total_amount: number | null;
  currency: string | null;
  created_at: string | null;
  due_date: string | null;
  service_id: string | null;
}

const statusConfig: Record<string, {
  labelAr: string;
  labelEn: string;
  color: string;
  icon: React.ElementType;
}> = {
  pending: {
    labelAr: "قيد الانتظار",
    labelEn: "Pending",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    icon: Clock,
  },
  processing: {
    labelAr: "قيد المعالجة",
    labelEn: "Processing",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Package,
  },
  in_progress: {
    labelAr: "قيد التنفيذ",
    labelEn: "In Progress",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    icon: Truck,
  },
  completed: {
    labelAr: "مكتمل",
    labelEn: "Completed",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    icon: CheckCircle,
  },
  cancelled: {
    labelAr: "ملغي",
    labelEn: "Cancelled",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: XCircle,
  },
  refunded: {
    labelAr: "مسترد",
    labelEn: "Refunded",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    icon: CreditCard,
  },
};

export function CustomerOrdersList() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchOrders = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders((data || []) as Order[]);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();

    // Real-time subscription
    if (!user) return;

    const channel = supabase
      .channel("customer-orders-list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `customer_id=eq.${user.id}` },
        () => fetchOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchOrders]);

  // Apply filters
  useEffect(() => {
    let result = orders;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (o) =>
          o.title.toLowerCase().includes(term) ||
          o.order_number.toLowerCase().includes(term) ||
          (o.title_ar && o.title_ar.toLowerCase().includes(term))
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }

    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrders();
  };

  const formatCurrency = (amount: number | null, currency: string | null) => {
    if (!amount) return "-";
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency: currency || "SAR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Intl.DateTimeFormat(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {isRTL ? "طلباتي" : "My Orders"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isRTL
              ? `${filteredOrders.length} طلب`
              : `${filteredOrders.length} orders`}
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" className="gap-2">
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          {isRTL ? "تحديث" : "Refresh"}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isRTL ? "البحث في الطلبات..." : "Search orders..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ps-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 me-2" />
                <SelectValue placeholder={isRTL ? "الحالة" : "Status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {isRTL ? "جميع الحالات" : "All Status"}
                </SelectItem>
                {Object.entries(statusConfig).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {isRTL ? value.labelAr : value.labelEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">
              {isRTL ? "لا توجد طلبات" : "No Orders Found"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all"
                ? isRTL
                  ? "جرب تغيير معايير البحث"
                  : "Try changing your search criteria"
                : isRTL
                ? "لم تقم بإنشاء أي طلبات بعد"
                : "You haven't created any orders yet"}
            </p>
            <Button onClick={() => navigate("/app/services")}>
              {isRTL ? "تصفح الخدمات" : "Browse Services"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => {
            const status = statusConfig[order.status || "pending"] || statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => navigate(`/app/orders/${order.id}`)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex items-start gap-4">
                        <div className={cn("p-3 rounded-lg", status.color.replace("text-", "bg-").split(" ")[0] + "/20")}>
                          <StatusIcon className={cn("h-5 w-5", status.color.split(" ")[0].replace("bg-", "text-"))} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate">
                              {isRTL ? order.title_ar || order.title : order.title}
                            </h3>
                            <Badge className={status.color}>
                              {isRTL ? status.labelAr : status.labelEn}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground font-mono" dir="ltr">
                            {order.order_number}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(order.created_at)}
                            </span>
                            {order.due_date && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {isRTL ? "الاستحقاق:" : "Due:"} {formatDate(order.due_date)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Amount & Action */}
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        {order.total_amount && (
                          <div className="text-end">
                            <p className="text-lg font-bold text-primary">
                              {formatCurrency(order.total_amount, order.currency)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {isRTL ? "المبلغ الإجمالي" : "Total Amount"}
                            </p>
                          </div>
                        )}
                        <ArrowIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
