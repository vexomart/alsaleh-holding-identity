import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch counts in parallel
        const [usersRes, ordersRes, servicesRes] = await Promise.all([
          supabase.from("profiles").select("id", { count: "exact", head: true }),
          supabase.from("orders").select("id, total_amount", { count: "exact" }),
          supabase.from("services").select("id", { count: "exact", head: true }),
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
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return language === "ar" ? "صباح الخير" : "Good Morning";
    if (hour < 18) return language === "ar" ? "مساء الخير" : "Good Afternoon";
    return language === "ar" ? "مساء الخير" : "Good Evening";
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">👋</span>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {getGreeting()}، {profile?.full_name || profile?.email?.split("@")[0]}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {language === "ar"
            ? "إليك نظرة عامة على نظامك اليوم"
            : "Here's an overview of your system today"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className={cn(
              "relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
              "animate-fade-in"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient accent */}
            <div className={cn(
              "absolute top-0 inset-x-0 h-1 bg-gradient-to-r",
              stat.gradient
            )} />
            
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {language === "ar" ? stat.titleAr : stat.titleEn}
              </CardTitle>
              <div className={cn("p-2.5 rounded-xl", stat.iconBg)}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl md:text-3xl font-bold tracking-tight">
                    {stat.titleEn === "Revenue" 
                      ? formatCurrency(stat.value)
                      : stat.value.toLocaleString()}
                  </div>
                  {stat.changeType !== "neutral" && (
                    <div className={cn(
                      "flex items-center gap-1 mt-1 text-xs font-medium",
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
                      <span className="text-muted-foreground">
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

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Recent Orders */}
        <Card 
          className="lg:col-span-4 animate-fade-in border-0 shadow-lg"
          style={{ animationDelay: "400ms" }}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                {language === "ar" ? "أحدث الطلبات" : "Recent Orders"}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {language === "ar" ? "آخر 5 طلبات في النظام" : "Last 5 orders in the system"}
              </p>
            </div>
            <Badge variant="secondary" className="font-normal">
              {stats.orders} {language === "ar" ? "طلب" : "orders"}
            </Badge>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="h-10 w-10 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-muted" />
                      <div className="h-3 w-1/2 rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <div
                    key={order.id}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-xl transition-colors hover:bg-muted/50",
                      "animate-fade-in"
                    )}
                    style={{ animationDelay: `${500 + index * 100}ms` }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                      <ShoppingCart className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{order.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-mono text-xs">{order.order_number}</span>
                        <span>•</span>
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(order.created_at)}</span>
                      </div>
                    </div>
                    <div className="text-left">
                      <Badge className={cn("font-normal", getStatusColor(order.status))}>
                        {getStatusText(order.status)}
                      </Badge>
                      {order.total_amount && (
                        <p className="text-sm font-medium mt-1">
                          {formatCurrency(order.total_amount)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-muted p-3 mb-3">
                  <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  {language === "ar" ? "لا توجد طلبات حتى الآن" : "No orders yet"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card 
          className="lg:col-span-3 animate-fade-in border-0 shadow-lg"
          style={{ animationDelay: "500ms" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {language === "ar" ? "إحصائيات سريعة" : "Quick Stats"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Status Distribution */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {language === "ar" ? "الطلبات المكتملة" : "Completed Orders"}
                </span>
                <span className="text-sm text-muted-foreground">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {language === "ar" ? "رضا العملاء" : "Customer Satisfaction"}
                </span>
                <span className="text-sm text-muted-foreground">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {language === "ar" ? "معدل الاستجابة" : "Response Rate"}
                </span>
                <span className="text-sm text-muted-foreground">88%</span>
              </div>
              <Progress value={88} className="h-2" />
            </div>

            {/* Status Summary */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">
                {language === "ar" ? "ملخص الحالات" : "Status Summary"}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm">
                    {language === "ar" ? "مكتمل" : "Completed"}
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">
                    {language === "ar" ? "قيد التنفيذ" : "In Progress"}
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm">
                    {language === "ar" ? "معلق" : "Pending"}
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-violet-50 dark:bg-violet-900/20">
                  <TrendingUp className="h-4 w-4 text-violet-600" />
                  <span className="text-sm">
                    {language === "ar" ? "نمو" : "Growth"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
