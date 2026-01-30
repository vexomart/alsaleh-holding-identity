import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
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
  change: number;
  changeType: "increase" | "decrease" | "neutral";
  icon: React.ElementType;
  gradient: string;
  iconBg: string;
}

interface RecentOrder {
  id: string;
  order_number: string;
  title: string;
  status: string;
  created_at: string;
  total_amount: number | null;
}

interface TopService {
  id: string;
  name: string;
  name_ar: string | null;
  orders_count: number;
  revenue: number;
}

interface ActivityItem {
  id: string;
  type: "order" | "user" | "service";
  titleAr: string;
  titleEn: string;
  time: string;
  icon: React.ElementType;
  color: string;
}

const revenueData = [
  { month: "يناير", revenue: 4500 },
  { month: "فبراير", revenue: 5200 },
  { month: "مارس", revenue: 4800 },
  { month: "أبريل", revenue: 6100 },
  { month: "مايو", revenue: 5500 },
  { month: "يونيو", revenue: 7200 },
  { month: "يوليو", revenue: 6800 },
];

const orderStatusData = [
  { name: "مكتمل", value: 45, color: "#10b981" },
  { name: "قيد التنفيذ", value: 25, color: "#3b82f6" },
  { name: "معلق", value: 20, color: "#f59e0b" },
  { name: "ملغي", value: 10, color: "#ef4444" },
];

export function AdminOverview() {
  const { language } = useLanguage();
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    services: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topServices, setTopServices] = useState<TopService[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      // Fetch counts in parallel
      const [usersRes, ordersRes, servicesRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id, total_amount, created_at, title, status", { count: "exact" }),
        supabase.from("services").select("id, name, name_ar", { count: "exact" }),
      ]);

      // Calculate total revenue from orders
      const revenue = ordersRes.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

      setStats({
        users: usersRes.count || 0,
        orders: ordersRes.count || 0,
        services: servicesRes.count || 0,
        revenue,
      });

      // Fetch recent orders
      const { data: orders } = await supabase
        .from("orders")
        .select("id, order_number, title, status, created_at, total_amount")
        .order("created_at", { ascending: false })
        .limit(5);

      setRecentOrders(orders || []);

      // Generate mock top services (since we don't have order-service join data)
      const mockTopServices: TopService[] = (servicesRes.data || []).slice(0, 4).map((s, i) => ({
        id: s.id,
        name: s.name,
        name_ar: s.name_ar,
        orders_count: Math.floor(Math.random() * 50) + 10,
        revenue: Math.floor(Math.random() * 10000) + 1000,
      }));
      setTopServices(mockTopServices);

      // Generate activities from recent orders
      const generatedActivities: ActivityItem[] = (orders || []).slice(0, 5).map((order) => ({
        id: order.id,
        type: "order" as const,
        titleAr: `طلب جديد: ${order.title}`,
        titleEn: `New order: ${order.title}`,
        time: order.created_at,
        icon: ShoppingCart,
        color: "text-blue-500",
      }));
      setActivities(generatedActivities);

    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  const statCards: StatCard[] = [
    {
      titleAr: "إجمالي المستخدمين",
      titleEn: "Total Users",
      value: stats.users,
      change: 12.5,
      changeType: "increase",
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      titleAr: "الطلبات",
      titleEn: "Orders",
      value: stats.orders,
      change: 8.2,
      changeType: "increase",
      icon: ShoppingCart,
      gradient: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      titleAr: "الخدمات النشطة",
      titleEn: "Active Services",
      value: stats.services,
      change: 0,
      changeType: "neutral",
      icon: Package,
      gradient: "from-violet-500 to-violet-600",
      iconBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
    {
      titleAr: "الإيرادات",
      titleEn: "Revenue",
      value: stats.revenue,
      change: 23.1,
      changeType: "increase",
      icon: DollarSign,
      gradient: "from-amber-500 to-amber-600",
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
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
    };
    return statusMap[status]?.[language === "ar" ? "ar" : "en"] || status;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === "ar" ? "ar-SA" : "en-US", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === "ar" ? "ar-SA" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
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
            onClick={handleRefresh}
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
                    {stat.titleEn === "Revenue" 
                      ? formatCurrency(stat.value)
                      : stat.value.toLocaleString()}
                  </div>
                  {stat.changeType !== "neutral" && (
                    <div className={cn(
                      "flex items-center gap-1 mt-1 text-[10px] md:text-xs font-medium",
                      stat.changeType === "increase" 
                        ? "text-emerald-600 dark:text-emerald-400" 
                        : "text-red-600 dark:text-red-400"
                    )}>
                      {stat.changeType === "increase" ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      <span>{stat.change}%</span>
                      <span className="text-muted-foreground hidden sm:inline">
                        {language === "ar" ? "من الشهر الماضي" : "from last month"}
                      </span>
                    </div>
                  )}
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
                {language === "ar" ? "تتبع إيراداتك على مدار الأشهر" : "Track your revenue over months"}
              </p>
            </div>
            <Badge variant="secondary" className="font-normal text-xs w-fit">
              {language === "ar" ? "آخر 7 أشهر" : "Last 7 months"}
            </Badge>
          </CardHeader>
          <CardContent className="p-2 md:p-6 pt-0">
            <div className="h-[200px] md:h-[300px]">
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
                    tickFormatter={(value) => `${value / 1000}k`}
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
                    formatter={(value: number) => [`${value}%`, ""]}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-1.5 md:gap-2 mt-2 md:mt-4">
              {orderStatusData.map((status, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <div 
                    className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-[10px] md:text-xs text-muted-foreground truncate">{status.name}</span>
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
            ) : recentOrders.length > 0 ? (
              <div className="space-y-2 md:space-y-3">
                {recentOrders.map((order, index) => (
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
            {topServices.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {topServices.map((service, index) => (
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
                      value={(service.orders_count / 50) * 100} 
                      className="h-1.5 md:h-2"
                    />
                    <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                      {formatCurrency(service.revenue)}
                    </p>
                  </div>
                ))}
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
            {activities.length > 0 ? (
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

      {/* Quick Stats Footer */}
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
              <p className="text-lg md:text-2xl font-bold">75%</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">
                {language === "ar" ? "معدل الإكمال" : "Completion Rate"}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/30 mb-1.5 md:mb-2">
                <Clock className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
              </div>
              <p className="text-lg md:text-2xl font-bold">2.5h</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">
                {language === "ar" ? "متوسط الاستجابة" : "Avg Response"}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/30 mb-1.5 md:mb-2">
                <Star className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />
              </div>
              <p className="text-lg md:text-2xl font-bold">4.8</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">
                {language === "ar" ? "تقييم العملاء" : "Customer Rating"}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full bg-violet-100 dark:bg-violet-900/30 mb-1.5 md:mb-2">
                <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-violet-600" />
              </div>
              <p className="text-lg md:text-2xl font-bold">+23%</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">
                {language === "ar" ? "النمو الشهري" : "Monthly Growth"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
