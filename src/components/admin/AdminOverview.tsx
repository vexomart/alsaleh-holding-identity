import { useEffect, useState, useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  DollarSign,
  BarChart3,
  Calendar,
  Star,
  Zap,
  Eye,
  Plus,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface StatCard {
  titleAr: string;
  titleEn: string;
  value: number;
  icon: React.ElementType;
  gradient: string;
  iconBg: string;
}

export function AdminOverview() {
  const { language } = useLanguage();
  const { profile } = useAuth();
  const { analytics, loading: isLoading, refresh: handleRefresh } = useAdminAnalytics();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await handleRefresh();
    setIsRefreshing(false);
  };

  // Compute order status data for pie chart from real data
  const orderStatusData = useMemo(() => {
    const total = analytics.totalOrders || 1; // Avoid division by zero
    return [
      { 
        name: "مكتمل", 
        nameEn: "Completed",
        value: Math.round((analytics.ordersByStatus.completed / total) * 100) || 0, 
        color: "#10b981" 
      },
      { 
        name: "قيد التنفيذ", 
        nameEn: "In Progress",
        value: Math.round(((analytics.ordersByStatus.processing + analytics.ordersByStatus.in_progress) / total) * 100) || 0, 
        color: "#3b82f6" 
      },
      { 
        name: "معلق", 
        nameEn: "Pending",
        value: Math.round((analytics.ordersByStatus.pending / total) * 100) || 0, 
        color: "#f59e0b" 
      },
      { 
        name: "ملغي", 
        nameEn: "Cancelled",
        value: Math.round(((analytics.ordersByStatus.cancelled + analytics.ordersByStatus.refunded) / total) * 100) || 0, 
        color: "#ef4444" 
      },
    ].filter(item => item.value > 0);
  }, [analytics.ordersByStatus, analytics.totalOrders]);

  // Revenue data for chart from real monthly data
  const revenueData = useMemo(() => {
    return analytics.monthlyRevenue.map(item => ({
      month: language === "ar" ? item.month : item.monthEn,
      revenue: item.revenue,
    }));
  }, [analytics.monthlyRevenue, language]);

  // Calculate completion rate from real data
  const completionRate = useMemo(() => {
    const total = analytics.totalOrders || 1;
    return Math.round((analytics.ordersByStatus.completed / total) * 100);
  }, [analytics.ordersByStatus.completed, analytics.totalOrders]);

  // Average order value
  const avgOrderValue = useMemo(() => {
    if (analytics.totalOrders === 0) return 0;
    return Math.round(analytics.totalRevenue / analytics.totalOrders);
  }, [analytics.totalRevenue, analytics.totalOrders]);

  const statCards: StatCard[] = [
    {
      titleAr: "إجمالي المستخدمين",
      titleEn: "Total Users",
      value: analytics.totalUsers,
      icon: Users,
      gradient: "from-[hsl(222_47%_18%)] to-[hsl(222_55%_26%)]",
      iconBg: "bg-[hsl(222_47%_18%/0.1)] text-[hsl(222_47%_18%)] dark:text-[hsl(222_75%_55%)]",
    },
    {
      titleAr: "الطلبات",
      titleEn: "Orders",
      value: analytics.totalOrders,
      icon: ShoppingCart,
      gradient: "from-[hsl(173_65%_32%)] to-[hsl(173_70%_42%)]",
      iconBg: "bg-[hsl(173_65%_32%/0.1)] text-[hsl(173_65%_32%)] dark:text-[hsl(173_80%_48%)]",
    },
    {
      titleAr: "الخدمات النشطة",
      titleEn: "Active Services",
      value: analytics.totalServices,
      icon: Package,
      gradient: "from-[hsl(260_65%_50%)] to-[hsl(260_70%_60%)]",
      iconBg: "bg-[hsl(260_65%_50%/0.1)] text-[hsl(260_65%_50%)] dark:text-[hsl(260_75%_65%)]",
    },
    {
      titleAr: "الإيرادات",
      titleEn: "Revenue",
      value: analytics.totalRevenue,
      icon: DollarSign,
      gradient: "from-[hsl(25_80%_52%)] to-[hsl(20_75%_42%)]",
      iconBg: "bg-[hsl(25_80%_52%/0.1)] text-[hsl(25_80%_52%)] dark:text-[hsl(25_85%_58%)]",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "processing":
      case "in_progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "cancelled":
      case "refunded":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, { ar: string; en: string }> = {
      pending: { ar: "قيد الانتظار", en: "Pending" },
      processing: { ar: "قيد المعالجة", en: "Processing" },
      in_progress: { ar: "قيد التنفيذ", en: "In Progress" },
      completed: { ar: "مكتمل", en: "Completed" },
      cancelled: { ar: "ملغي", en: "Cancelled" },
      refunded: { ar: "مسترد", en: "Refunded" },
    };
    return statusMap[status]?.[language === "ar" ? "ar" : "en"] || status;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
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
      return language === "ar" ? `منذ ${diffMins} دقيقة` : `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return language === "ar" ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
    } else {
      return language === "ar" ? `منذ ${diffDays} يوم` : `${diffDays}d ago`;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return language === "ar" ? "صباح الخير" : "Good Morning";
    if (hour < 18) return language === "ar" ? "مساء الخير" : "Good Afternoon";
    return language === "ar" ? "مساء الخير" : "Good Evening";
  };

  const quickActions = [
    { 
      titleAr: "إضافة طلب", 
      titleEn: "Add Order", 
      icon: Plus, 
      color: "bg-blue-500 hover:bg-blue-600" 
    },
    { 
      titleAr: "إضافة خدمة", 
      titleEn: "Add Service", 
      icon: Package, 
      color: "bg-emerald-500 hover:bg-emerald-600" 
    },
    { 
      titleAr: "عرض التقارير", 
      titleEn: "View Reports", 
      icon: BarChart3, 
      color: "bg-violet-500 hover:bg-violet-600" 
    },
  ];

  // Generate activities from recent orders
  const activities = useMemo(() => {
    return analytics.recentOrders.slice(0, 5).map((order) => ({
      id: order.id,
      type: "order" as const,
      titleAr: `طلب جديد: ${order.title}`,
      titleEn: `New order: ${order.title}`,
      time: order.created_at,
      icon: ShoppingCart,
      color: "text-blue-500",
    }));
  }, [analytics.recentOrders]);

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Welcome Section with Quick Actions */}
      <div className="flex flex-col gap-4 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl md:text-2xl">👋</span>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
              {getGreeting()}، {profile?.full_name || profile?.email?.split("@")[0]}
            </h1>
          </div>
          <p className="text-sm md:text-base text-muted-foreground">
            {language === "ar"
              ? "إليك نظرة عامة على نظامك اليوم"
              : "Here's an overview of your system today"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            <span className="hidden xs:inline">{language === "ar" ? "تحديث" : "Refresh"}</span>
          </Button>
          {quickActions.map((action, index) => (
            <Button
              key={index}
              size="sm"
              className={cn("gap-1.5 text-white", action.color)}
            >
              <action.icon className="h-4 w-4" />
              <span className="hidden md:inline">
                {language === "ar" ? action.titleAr : action.titleEn}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className={cn(
              "relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group cursor-pointer",
              "animate-fade-in"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient accent */}
            <div className={cn(
              "absolute top-0 inset-x-0 h-1 bg-gradient-to-r transition-all duration-300 group-hover:h-1.5",
              stat.gradient
            )} />
            
            <CardHeader className="flex flex-row items-center justify-between p-3 md:p-4 pb-1 md:pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                {language === "ar" ? stat.titleAr : stat.titleEn}
              </CardTitle>
              <div className={cn("p-1.5 md:p-2.5 rounded-lg md:rounded-xl transition-transform duration-300 group-hover:scale-110", stat.iconBg)}>
                <stat.icon className="h-4 w-4 md:h-5 md:w-5" />
              </div>
            </CardHeader>
            <CardContent className="p-3 md:p-4 pt-0">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-lg md:text-2xl lg:text-3xl font-bold tracking-tight">
                    {isLoading ? (
                      <div className="h-8 w-20 bg-muted animate-pulse rounded" />
                    ) : stat.titleEn === "Revenue" 
                      ? formatCurrency(stat.value)
                      : stat.value.toLocaleString('en-US')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-7">
        {/* Revenue Chart */}
        <Card 
          className="lg:col-span-5 animate-fade-in border-0 shadow-lg"
          style={{ animationDelay: "400ms" }}
        >
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 md:p-6">
            <div>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                {language === "ar" ? "الإيرادات الشهرية" : "Monthly Revenue"}
              </CardTitle>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                {language === "ar" ? "بيانات حقيقية من قاعدة البيانات" : "Real data from database"}
              </p>
            </div>
            <Badge variant="secondary" className="font-normal text-xs w-fit">
              {language === "ar" ? "آخر 7 أشهر" : "Last 7 months"}
            </Badge>
          </CardHeader>
          <CardContent className="p-2 md:p-6 pt-0">
            <div className="h-[200px] md:h-[300px]">
              {isLoading ? (
                <div className="h-full w-full bg-muted/50 animate-pulse rounded flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">
                    {language === "ar" ? "جاري التحميل..." : "Loading..."}
                  </span>
                </div>
              ) : revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                      tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
                      tickLine={false}
                      axisLine={false}
                      width={35}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number) => [formatCurrency(value), language === "ar" ? "الإيرادات" : "Revenue"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  {language === "ar" ? "لا توجد بيانات إيرادات" : "No revenue data"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Status Pie Chart */}
        <Card 
          className="lg:col-span-2 animate-fade-in border-0 shadow-lg"
          style={{ animationDelay: "450ms" }}
        >
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Activity className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              {language === "ar" ? "حالة الطلبات" : "Order Status"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="h-[150px] md:h-[200px]">
              {isLoading ? (
                <div className="h-full w-full bg-muted/50 animate-pulse rounded" />
              ) : orderStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={55}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name: string, props: any) => [
                        `${value}%`, 
                        language === "ar" ? props.payload.name : props.payload.nameEn
                      ]}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  {language === "ar" ? "لا توجد طلبات" : "No orders"}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1.5 md:gap-2 mt-2 md:mt-4">
              {orderStatusData.map((status, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <div 
                    className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-[10px] md:text-xs text-muted-foreground truncate">
                    {language === "ar" ? status.name : status.nameEn}
                  </span>
                  <span className="text-[10px] md:text-xs font-medium ml-auto">{status.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Three Column Layout */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card 
          className="animate-fade-in border-0 shadow-lg"
          style={{ animationDelay: "500ms" }}
        >
          <CardHeader className="flex flex-row items-center justify-between p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              {language === "ar" ? "أحدث الطلبات" : "Recent Orders"}
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-primary text-xs md:text-sm h-8 px-2">
              <Eye className="h-3 w-3 md:h-4 md:w-4 me-1" />
              <span className="hidden sm:inline">{language === "ar" ? "عرض الكل" : "View All"}</span>
            </Button>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 md:h-4 w-3/4 rounded bg-muted" />
                      <div className="h-2 md:h-3 w-1/2 rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            ) : analytics.recentOrders.length > 0 ? (
              <div className="space-y-2 md:space-y-3">
                {analytics.recentOrders.map((order, index) => (
                  <div
                    key={order.id}
                    className={cn(
                      "flex items-center gap-2 md:gap-3 p-2 md:p-2.5 rounded-lg md:rounded-xl transition-colors hover:bg-muted/50",
                      "animate-fade-in"
                    )}
                    style={{ animationDelay: `${550 + index * 50}ms` }}
                  >
                    <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex-shrink-0">
                      <ShoppingCart className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs md:text-sm truncate">{order.title}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground">{order.order_number}</p>
                    </div>
                    <Badge className={cn("text-[10px] md:text-xs px-1.5 md:px-2", getStatusColor(order.status))}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 md:py-8 text-center">
                <div className="rounded-full bg-muted p-2.5 md:p-3 mb-2 md:mb-3">
                  <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" ? "لا توجد طلبات حتى الآن" : "No orders yet"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Services */}
        <Card 
          className="animate-fade-in border-0 shadow-lg"
          style={{ animationDelay: "550ms" }}
        >
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Star className="h-4 w-4 md:h-5 md:w-5 text-amber-500" />
              {language === "ar" ? "أفضل الخدمات" : "Top Services"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex justify-between mb-1">
                      <div className="h-4 w-24 bg-muted rounded" />
                      <div className="h-4 w-12 bg-muted rounded" />
                    </div>
                    <div className="h-2 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : analytics.topServices.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {analytics.topServices.map((service, index) => {
                  const maxOrders = Math.max(...analytics.topServices.map(s => s.orders_count), 1);
                  return (
                    <div
                      key={service.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${600 + index * 50}ms` }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs md:text-sm font-medium truncate max-w-[120px] md:max-w-[150px]">
                          {language === "ar" ? service.name_ar || service.name : service.name}
                        </span>
                        <span className="text-[10px] md:text-xs text-muted-foreground">
                          {service.orders_count} {language === "ar" ? "طلب" : "orders"}
                        </span>
                      </div>
                      <Progress 
                        value={(service.orders_count / maxOrders) * 100} 
                        className="h-1.5 md:h-2"
                      />
                      <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                        {formatCurrency(service.revenue)}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 md:py-8 text-center">
                <div className="rounded-full bg-muted p-2.5 md:p-3 mb-2 md:mb-3">
                  <Package className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" ? "لا توجد خدمات" : "No services"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card 
          className="md:col-span-2 lg:col-span-1 animate-fade-in border-0 shadow-lg"
          style={{ animationDelay: "600ms" }}
        >
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Zap className="h-4 w-4 md:h-5 md:w-5 text-violet-500" />
              {language === "ar" ? "النشاط الأخير" : "Recent Activity"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="h-9 w-9 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-muted rounded" />
                      <div className="h-3 w-1/2 bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.length > 0 ? (
              <div className="relative space-y-3 md:space-y-4">
                {/* Timeline line */}
                <div className="absolute start-[14px] md:start-[18px] top-2 bottom-2 w-px bg-border" />
                
                {activities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="relative flex gap-2 md:gap-3 animate-fade-in"
                    style={{ animationDelay: `${650 + index * 50}ms` }}
                  >
                    <div className={cn(
                      "relative z-10 flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-full bg-background border-2 border-border flex-shrink-0",
                      activity.color
                    )}>
                      <activity.icon className="h-3 w-3 md:h-4 md:w-4" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5 md:pt-1">
                      <p className="text-xs md:text-sm font-medium truncate">
                        {language === "ar" ? activity.titleAr : activity.titleEn}
                      </p>
                      <p className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5 md:h-3 md:w-3" />
                        {formatRelativeTime(activity.time)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 md:py-8 text-center">
                <div className="rounded-full bg-muted p-2.5 md:p-3 mb-2 md:mb-3">
                  <Activity className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" ? "لا يوجد نشاط" : "No activity"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Footer - Using Real Data */}
      <Card 
        className="animate-fade-in border-0 shadow-lg bg-gradient-to-r from-primary/5 via-transparent to-primary/5"
        style={{ animationDelay: "700ms" }}
      >
        <CardContent className="py-4 md:py-6 px-3 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-1.5 md:mb-2">
                <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
              </div>
              <p className="text-lg md:text-2xl font-bold">
                {isLoading ? "--" : `${completionRate}%`}
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground">
                {language === "ar" ? "معدل الإكمال" : "Completion Rate"}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/30 mb-1.5 md:mb-2">
                <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
              </div>
              <p className="text-lg md:text-2xl font-bold">
                {isLoading ? "--" : analytics.activeUsers}
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground">
                {language === "ar" ? "المستخدمون النشطون" : "Active Users"}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/30 mb-1.5 md:mb-2">
                <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />
              </div>
              <p className="text-lg md:text-2xl font-bold">
                {isLoading ? "--" : formatCurrency(avgOrderValue)}
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground">
                {language === "ar" ? "متوسط قيمة الطلب" : "Avg Order Value"}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full bg-violet-100 dark:bg-violet-900/30 mb-1.5 md:mb-2">
                <AlertCircle className="h-5 w-5 md:h-6 md:w-6 text-violet-600" />
              </div>
              <p className="text-lg md:text-2xl font-bold">
                {isLoading ? "--" : analytics.ordersByStatus.pending}
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground">
                {language === "ar" ? "طلبات معلقة" : "Pending Orders"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
