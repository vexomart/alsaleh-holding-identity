/**
 * Customer Overview Page
 * KPIs, recent activity, quick actions
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  ShoppingCart,
  Package,
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Bell,
  CreditCard,
} from "lucide-react";

interface CustomerStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalInvoices: number;
  pendingInvoices: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  title: string;
  status: string;
  total_amount: number | null;
  created_at: string;
}

interface RecentNotification {
  id: string;
  title: string;
  title_ar: string | null;
  message: string | null;
  type: string;
  created_at: string;
  is_read: boolean;
}

const statusConfig: Record<string, { labelAr: string; labelEn: string; color: string }> = {
  pending: { labelAr: "قيد الانتظار", labelEn: "Pending", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  processing: { labelAr: "قيد المعالجة", labelEn: "Processing", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  in_progress: { labelAr: "قيد التنفيذ", labelEn: "In Progress", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" },
  completed: { labelAr: "مكتمل", labelEn: "Completed", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  cancelled: { labelAr: "ملغي", labelEn: "Cancelled", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

export function CustomerOverview() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [notifications, setNotifications] = useState<RecentNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch orders
        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("customer_id", user.id)
          .order("created_at", { ascending: false });

        if (ordersError) throw ordersError;

        // Fetch invoices
        const { data: invoices, error: invoicesError } = await supabase
          .from("invoices")
          .select("*")
          .eq("customer_id", user.id);

        if (invoicesError) throw invoicesError;

        // Fetch notifications
        const { data: notifs, error: notifsError } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (notifsError) throw notifsError;

        // Calculate stats
        const ordersList = orders || [];
        const invoicesList = invoices || [];

        setStats({
          totalOrders: ordersList.length,
          pendingOrders: ordersList.filter(o => ["pending", "processing", "in_progress"].includes(o.status || "")).length,
          completedOrders: ordersList.filter(o => o.status === "completed").length,
          totalInvoices: invoicesList.length,
          pendingInvoices: invoicesList.filter(i => i.status === "issued").length,
        });

        setRecentOrders(ordersList.slice(0, 5) as RecentOrder[]);
        setNotifications((notifs || []) as RecentNotification[]);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Real-time subscription for orders
    const channel = supabase
      .channel("customer-orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `customer_id=eq.${user.id}` },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "-";
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return isRTL ? `منذ ${diffMins} دقيقة` : `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return isRTL ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
    } else {
      return isRTL ? `منذ ${diffDays} يوم` : `${diffDays}d ago`;
    }
  };

  const quickActions = [
    {
      titleAr: "طلب جديد",
      titleEn: "New Order",
      icon: Plus,
      onClick: () => navigate("/app/services"),
      color: "bg-primary hover:bg-primary/90",
    },
    {
      titleAr: "طلباتي",
      titleEn: "My Orders",
      icon: ShoppingCart,
      onClick: () => navigate("/app/orders"),
      color: "bg-secondary hover:bg-secondary/90",
    },
    {
      titleAr: "الإشعارات",
      titleEn: "Notifications",
      icon: Bell,
      onClick: () => navigate("/app/notifications"),
      color: "bg-secondary hover:bg-secondary/90",
    },
  ];

  const statCards = [
    {
      titleAr: "إجمالي الطلبات",
      titleEn: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      titleAr: "طلبات قيد التنفيذ",
      titleEn: "In Progress",
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      titleAr: "طلبات مكتملة",
      titleEn: "Completed",
      value: stats?.completedOrders || 0,
      icon: CheckCircle,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      titleAr: "فواتير معلقة",
      titleEn: "Pending Invoices",
      value: stats?.pendingInvoices || 0,
      icon: FileText,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 md:p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 md:h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-2 md:space-y-3 pt-0">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-14 md:h-16 w-full" />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-2 md:space-y-3 pt-0">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-14 md:h-16 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Quick Actions - Hidden on mobile, shown in header */}
      <div className="hidden sm:flex flex-wrap gap-2 md:gap-3">
        {quickActions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button 
              onClick={action.onClick} 
              className={cn("gap-2 text-sm", action.color)}
              size="sm"
            >
              <action.icon className="h-4 w-4" />
              <span className="hidden md:inline">{isRTL ? action.titleAr : action.titleEn}</span>
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Stats Grid - 1 col mobile, 2 col tablet, 4 col desktop */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className={cn(
                  "flex items-center justify-between gap-3",
                  isRTL && "flex-row-reverse"
                )}>
                  <div className={cn("flex-1", isRTL ? "text-right" : "text-left")}>
                    <span className="text-xs md:text-sm font-medium text-muted-foreground block mb-1">
                      {isRTL ? stat.titleAr : stat.titleEn}
                    </span>
                    <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
                  </div>
                  <div className={cn("p-2 md:p-3 rounded-lg shrink-0", stat.bg)}>
                    <stat.icon className={cn("h-4 w-4 md:h-5 md:w-5", stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Content Grid - Stack on mobile, 2 cols on desktop */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className={cn(
              "flex flex-row items-center justify-between pb-3",
              isRTL && "flex-row-reverse"
            )}>
              <CardTitle className="text-base md:text-lg">
                {isRTL ? "أحدث الطلبات" : "Recent Orders"}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/app/orders")} className="text-xs md:text-sm">
                {isRTL ? "عرض الكل" : "View All"}
                <ArrowUpRight className={cn("h-3 w-3 md:h-4 md:w-4", isRTL ? "me-1" : "ms-1")} />
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              {recentOrders.length === 0 ? (
                <div className="text-center py-6 md:py-8 text-muted-foreground">
                  <ShoppingCart className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">{isRTL ? "لا توجد طلبات حتى الآن" : "No orders yet"}</p>
                  <Button
                    variant="link"
                    onClick={() => navigate("/app/services")}
                    className="mt-2 text-sm"
                  >
                    {isRTL ? "تصفح الخدمات" : "Browse Services"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 md:space-y-3">
                  {recentOrders.map((order) => {
                    const status = statusConfig[order.status || "pending"] || statusConfig.pending;
                    return (
                      <div
                        key={order.id}
                        onClick={() => navigate(`/app/orders/${order.id}`)}
                        className={cn(
                          "flex items-center gap-3 p-2 md:p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors",
                          isRTL && "flex-row-reverse"
                        )}
                      >
                        <div className={cn("flex-1 min-w-0", isRTL ? "text-right" : "text-left")}>
                          <p className="font-medium truncate text-sm md:text-base">{order.title}</p>
                          <p className="text-xs text-muted-foreground font-mono" dir="ltr">
                            {order.order_number}
                          </p>
                        </div>
                        <div className={cn(
                          "flex items-center gap-2 shrink-0",
                          isRTL && "flex-row-reverse"
                        )}>
                          <Badge className={cn(status.color, "text-xs")}>
                            {isRTL ? status.labelAr : status.labelEn}
                          </Badge>
                          {order.total_amount && (
                            <span className="text-xs md:text-sm font-medium whitespace-nowrap" dir="ltr">
                              {formatCurrency(order.total_amount)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className={cn(
              "flex flex-row items-center justify-between pb-3",
              isRTL && "flex-row-reverse"
            )}>
              <CardTitle className="text-base md:text-lg">
                {isRTL ? "آخر الإشعارات" : "Recent Notifications"}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/app/notifications")} className="text-xs md:text-sm">
                {isRTL ? "عرض الكل" : "View All"}
                <ArrowUpRight className={cn("h-3 w-3 md:h-4 md:w-4", isRTL ? "me-1" : "ms-1")} />
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              {notifications.length === 0 ? (
                <div className="text-center py-6 md:py-8 text-muted-foreground">
                  <Bell className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">{isRTL ? "لا توجد إشعارات" : "No notifications"}</p>
                </div>
              ) : (
                <div className="space-y-2 md:space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        "p-2 md:p-3 rounded-lg border transition-colors",
                        !notif.is_read && "bg-primary/5 border-primary/20"
                      )}
                    >
                      <div className={cn(
                        "flex items-start justify-between gap-2",
                        isRTL && "flex-row-reverse"
                      )}>
                        <div className={cn("flex-1 min-w-0", isRTL ? "text-right" : "text-left")}>
                          <p className={cn("font-medium text-xs md:text-sm", !notif.is_read && "font-semibold")}>
                            {isRTL ? notif.title_ar || notif.title : notif.title}
                          </p>
                          {notif.message && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {notif.message}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                          {formatRelativeTime(notif.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
