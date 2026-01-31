/**
 * Customer Overview Page - Premium Enterprise Design
 * Rich analytics, personalized greeting, visual KPIs
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
import { Progress } from "@/components/ui/progress";
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
  Sparkles,
  Calendar,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Activity,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface CustomerStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  inProgressOrders: number;
  totalInvoices: number;
  pendingInvoices: number;
  paidInvoices: number;
  totalSpent: number;
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

const statusConfig: Record<string, { labelAr: string; labelEn: string; color: string; bgColor: string }> = {
  pending: { 
    labelAr: "قيد الانتظار", 
    labelEn: "Pending", 
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30" 
  },
  processing: { 
    labelAr: "قيد المعالجة", 
    labelEn: "Processing", 
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30" 
  },
  in_progress: { 
    labelAr: "قيد التنفيذ", 
    labelEn: "In Progress", 
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30" 
  },
  completed: { 
    labelAr: "مكتمل", 
    labelEn: "Completed", 
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30" 
  },
  cancelled: { 
    labelAr: "ملغي", 
    labelEn: "Cancelled", 
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/30" 
  },
};

const CHART_COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#6366f1'];

export function CustomerOverview() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [notifications, setNotifications] = useState<RecentNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return isRTL ? "صباح الخير" : "Good Morning";
    if (hour < 17) return isRTL ? "مساء الخير" : "Good Afternoon";
    return isRTL ? "مساء الخير" : "Good Evening";
  };

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

        const totalSpent = invoicesList
          .filter(i => i.status === 'paid')
          .reduce((sum, i) => sum + (i.total || 0), 0);

        setStats({
          totalOrders: ordersList.length,
          pendingOrders: ordersList.filter(o => o.status === "pending").length,
          inProgressOrders: ordersList.filter(o => ["processing", "in_progress"].includes(o.status || "")).length,
          completedOrders: ordersList.filter(o => o.status === "completed").length,
          totalInvoices: invoicesList.length,
          pendingInvoices: invoicesList.filter(i => i.status === "issued").length,
          paidInvoices: invoicesList.filter(i => i.status === "paid").length,
          totalSpent,
        });

        setRecentOrders(ordersList.slice(0, 4) as RecentOrder[]);
        setNotifications((notifs || []) as RecentNotification[]);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Real-time subscription
    const channel = supabase
      .channel("customer-overview")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `customer_id=eq.${user.id}` },
        () => fetchData()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "invoices", filter: `customer_id=eq.${user.id}` },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const formatCurrency = (amount: number | null) => {
    if (!amount) return isRTL ? "٠ ر.س" : "0 SAR";
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

  // Pie chart data for order status distribution
  const orderStatusData = stats ? [
    { name: isRTL ? "قيد الانتظار" : "Pending", value: stats.pendingOrders, color: '#f59e0b' },
    { name: isRTL ? "قيد التنفيذ" : "In Progress", value: stats.inProgressOrders, color: '#3b82f6' },
    { name: isRTL ? "مكتمل" : "Completed", value: stats.completedOrders, color: '#10b981' },
  ].filter(item => item.value > 0) : [];

  // Quick actions
  const quickActions = [
    {
      titleAr: "طلب خدمة جديدة",
      titleEn: "New Service Request",
      descAr: "تصفح خدماتنا وابدأ طلبك",
      descEn: "Browse services and start your order",
      icon: Plus,
      onClick: () => navigate("/app/services"),
      gradient: "from-amber-500 to-orange-500",
    },
    {
      titleAr: "تتبع طلباتي",
      titleEn: "Track Orders",
      descAr: "متابعة حالة طلباتك",
      descEn: "Monitor your order status",
      icon: Package,
      onClick: () => navigate("/app/orders"),
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      titleAr: "الفواتير والمدفوعات",
      titleEn: "Invoices & Payments",
      descAr: "عرض وتحميل الفواتير",
      descEn: "View and download invoices",
      icon: Receipt,
      onClick: () => navigate("/app/orders"),
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  // Premium stat cards
  const statCards = [
    {
      titleAr: "إجمالي الطلبات",
      titleEn: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      gradient: "from-blue-500/20 to-blue-600/20",
      iconBg: "bg-blue-500",
      trend: "+12%",
      trendUp: true,
    },
    {
      titleAr: "طلبات نشطة",
      titleEn: "Active Orders",
      value: stats?.inProgressOrders || 0,
      icon: Activity,
      gradient: "from-amber-500/20 to-orange-600/20",
      iconBg: "bg-amber-500",
      trend: null,
      trendUp: false,
    },
    {
      titleAr: "طلبات مكتملة",
      titleEn: "Completed",
      value: stats?.completedOrders || 0,
      icon: CheckCircle,
      gradient: "from-emerald-500/20 to-teal-600/20",
      iconBg: "bg-emerald-500",
      trend: "+8%",
      trendUp: true,
    },
    {
      titleAr: "إجمالي المدفوعات",
      titleEn: "Total Spent",
      value: formatCurrency(stats?.totalSpent || 0),
      icon: CreditCard,
      gradient: "from-purple-500/20 to-indigo-600/20",
      iconBg: "bg-purple-500",
      trend: null,
      trendUp: false,
      isAmount: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Greeting skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        {/* Stats skeleton */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-5">
                <Skeleton className="h-10 w-10 rounded-xl mb-4" />
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Content skeleton */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Premium Greeting Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8",
          isRTL ? "text-right" : "text-left"
        )}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className={cn("flex items-center gap-2 mb-2", isRTL && "flex-row-reverse")}>
            <Sparkles className="h-5 w-5 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">
              {isRTL ? "بوابة العميل" : "Customer Portal"}
            </span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {getGreeting()}، {profile?.full_name || profile?.email?.split("@")[0]} 👋
          </h1>
          
          <p className="text-slate-300 text-sm md:text-base max-w-xl">
            {isRTL 
              ? "مرحباً بك في لوحة التحكم الخاصة بك. يمكنك متابعة طلباتك وإدارة حسابك من هنا."
              : "Welcome to your dashboard. Track your orders and manage your account here."
            }
          </p>

          {/* Quick Stats in Header */}
          <div className={cn(
            "flex flex-wrap gap-4 mt-6",
            isRTL && "flex-row-reverse"
          )}>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <Package className="h-4 w-4 text-amber-400" />
              <span className="text-white text-sm">
                {stats?.inProgressOrders || 0} {isRTL ? "طلب نشط" : "active orders"}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <FileText className="h-4 w-4 text-emerald-400" />
              <span className="text-white text-sm">
                {stats?.pendingInvoices || 0} {isRTL ? "فاتورة معلقة" : "pending invoices"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {quickActions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={action.onClick}
            >
              <CardContent className="p-5 relative">
                {/* Gradient background on hover */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  action.gradient
                )} />
                
                <div className="relative z-10">
                  <div className={cn(
                    "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform",
                    action.gradient
                  )}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className={cn(
                    "font-semibold text-foreground group-hover:text-white transition-colors mb-1",
                    isRTL && "text-right"
                  )}>
                    {isRTL ? action.titleAr : action.titleEn}
                  </h3>
                  
                  <p className={cn(
                    "text-sm text-muted-foreground group-hover:text-white/80 transition-colors",
                    isRTL && "text-right"
                  )}>
                    {isRTL ? action.descAr : action.descEn}
                  </p>
                  
                  <div className={cn(
                    "flex items-center gap-1 mt-3 text-primary group-hover:text-white transition-colors",
                    isRTL && "flex-row-reverse justify-end"
                  )}>
                    <span className="text-sm font-medium">
                      {isRTL ? "ابدأ الآن" : "Get started"}
                    </span>
                    {isRTL ? (
                      <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    ) : (
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-5 relative">
                {/* Gradient overlay */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-50",
                  stat.gradient
                )} />
                
                <div className="relative z-10">
                  <div className={cn(
                    "flex items-start justify-between mb-4",
                    isRTL && "flex-row-reverse"
                  )}>
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      stat.iconBg
                    )}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    
                    {stat.trend && (
                      <div className={cn(
                        "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                        stat.trendUp 
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      )}>
                        <TrendingUp className={cn("h-3 w-3", !stat.trendUp && "rotate-180")} />
                        {stat.trend}
                      </div>
                    )}
                  </div>
                  
                  <p className={cn(
                    "text-sm text-muted-foreground mb-1",
                    isRTL && "text-right"
                  )}>
                    {isRTL ? stat.titleAr : stat.titleEn}
                  </p>
                  
                  <p className={cn(
                    "text-2xl md:text-3xl font-bold text-foreground",
                    isRTL && "text-right",
                    stat.isAmount && "font-mono"
                  )} dir={stat.isAmount ? "ltr" : undefined}>
                    {stat.isAmount ? stat.value : stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Order Status Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full border-0 shadow-lg">
            <CardHeader className={cn("pb-2", isRTL && "text-right")}>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                {isRTL ? "توزيع الطلبات" : "Order Distribution"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orderStatusData.length > 0 ? (
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">{isRTL ? "لا توجد طلبات" : "No orders yet"}</p>
                  </div>
                </div>
              )}
              
              {/* Legend */}
              {orderStatusData.length > 0 && (
                <div className={cn(
                  "flex flex-wrap justify-center gap-4 mt-4",
                  isRTL && "flex-row-reverse"
                )}>
                  {orderStatusData.map((item, index) => (
                    <div key={index} className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {item.name} ({item.value})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="h-full border-0 shadow-lg">
            <CardHeader className={cn(
              "flex flex-row items-center justify-between pb-2",
              isRTL && "flex-row-reverse"
            )}>
              <CardTitle className={cn("text-lg flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <Package className="h-5 w-5 text-primary" />
                {isRTL ? "أحدث الطلبات" : "Recent Orders"}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/app/orders")}
                className="text-primary hover:text-primary/80"
              >
                {isRTL ? "عرض الكل" : "View All"}
                <ArrowUpRight className={cn("h-4 w-4", isRTL ? "me-1" : "ms-1")} />
              </Button>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="h-8 w-8 opacity-50" />
                  </div>
                  <p className="font-medium mb-1">{isRTL ? "لا توجد طلبات" : "No orders yet"}</p>
                  <p className="text-sm mb-4">
                    {isRTL ? "ابدأ بتصفح خدماتنا" : "Start by browsing our services"}
                  </p>
                  <Button onClick={() => navigate("/app/services")} size="sm">
                    <Plus className={cn("h-4 w-4", isRTL ? "ms-2" : "me-2")} />
                    {isRTL ? "طلب جديد" : "New Order"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order, index) => {
                    const status = statusConfig[order.status || "pending"] || statusConfig.pending;
                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        onClick={() => navigate(`/app/orders/${order.id}`)}
                        className={cn(
                          "group flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent/50 cursor-pointer transition-all duration-200",
                          isRTL && "flex-row-reverse"
                        )}
                      >
                        {/* Order Icon */}
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                          status.bgColor
                        )}>
                          <Package className={cn("h-5 w-5", status.color)} />
                        </div>
                        
                        {/* Order Details */}
                        <div className={cn("flex-1 min-w-0", isRTL ? "text-right" : "text-left")}>
                          <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                            {order.title}
                          </p>
                          <div className={cn(
                            "flex items-center gap-2 text-xs text-muted-foreground mt-1",
                            isRTL && "flex-row-reverse justify-end"
                          )}>
                            <span className="font-mono" dir="ltr">{order.order_number}</span>
                            <span>•</span>
                            <span>{formatRelativeTime(order.created_at)}</span>
                          </div>
                        </div>
                        
                        {/* Status & Amount */}
                        <div className={cn(
                          "flex items-center gap-3 shrink-0",
                          isRTL && "flex-row-reverse"
                        )}>
                          <Badge className={cn(status.bgColor, status.color, "border-0")}>
                            {isRTL ? status.labelAr : status.labelEn}
                          </Badge>
                          {order.total_amount && (
                            <span className="text-sm font-semibold font-mono" dir="ltr">
                              {formatCurrency(order.total_amount)}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className={cn(
            "flex flex-row items-center justify-between pb-2",
            isRTL && "flex-row-reverse"
          )}>
            <CardTitle className={cn("text-lg flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <Bell className="h-5 w-5 text-primary" />
              {isRTL ? "آخر الإشعارات" : "Recent Notifications"}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/app/notifications")}
              className="text-primary hover:text-primary/80"
            >
              {isRTL ? "عرض الكل" : "View All"}
              <ArrowUpRight className={cn("h-4 w-4", isRTL ? "me-1" : "ms-1")} />
            </Button>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">{isRTL ? "لا توجد إشعارات جديدة" : "No new notifications"}</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {notifications.slice(0, 3).map((notif, index) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className={cn(
                      "p-4 rounded-xl border transition-all duration-200 hover:shadow-md",
                      !notif.is_read 
                        ? "bg-primary/5 border-primary/20" 
                        : "bg-card hover:bg-accent/50"
                    )}
                  >
                    <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                        !notif.is_read ? "bg-primary/20" : "bg-muted"
                      )}>
                        <Bell className={cn(
                          "h-4 w-4",
                          !notif.is_read ? "text-primary" : "text-muted-foreground"
                        )} />
                      </div>
                      <div className={cn("flex-1 min-w-0", isRTL ? "text-right" : "text-left")}>
                        <p className={cn(
                          "text-sm font-medium truncate",
                          !notif.is_read && "font-semibold"
                        )}>
                          {isRTL ? notif.title_ar || notif.title : notif.title}
                        </p>
                        {notif.message && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notif.message}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatRelativeTime(notif.created_at)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
