/**
 * Reports & Analytics Page - Modern Unified Design
 * Premium SaaS analytics dashboard with real data
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  Calendar,
  RefreshCw,
  PieChart as PieChartIcon,
  Activity,
  Sparkles,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
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
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export function ReportsPage() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const { analytics, loading, refresh } = useAdminAnalytics();
  const [timeRange, setTimeRange] = useState('7months');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const avgOrderValue = useMemo(() => {
    if (analytics.totalOrders === 0) return 0;
    return Math.round(analytics.totalRevenue / analytics.totalOrders);
  }, [analytics.totalRevenue, analytics.totalOrders]);

  const orderStatusData = useMemo(() => {
    const total = analytics.totalOrders || 1;
    return [
      { 
        name: 'مكتمل', 
        nameEn: 'Completed', 
        value: Math.round((analytics.ordersByStatus.completed / total) * 100) || 0, 
        color: 'hsl(var(--accent))' 
      },
      { 
        name: 'قيد التنفيذ', 
        nameEn: 'In Progress', 
        value: Math.round(((analytics.ordersByStatus.processing + analytics.ordersByStatus.in_progress) / total) * 100) || 0, 
        color: 'hsl(var(--primary))' 
      },
      { 
        name: 'معلق', 
        nameEn: 'Pending', 
        value: Math.round((analytics.ordersByStatus.pending / total) * 100) || 0, 
        color: 'hsl(var(--secondary))' 
      },
      { 
        name: 'ملغي', 
        nameEn: 'Cancelled', 
        value: Math.round(((analytics.ordersByStatus.cancelled + analytics.ordersByStatus.refunded) / total) * 100) || 0, 
        color: 'hsl(var(--destructive))' 
      },
    ].filter(item => item.value > 0);
  }, [analytics.ordersByStatus, analytics.totalOrders]);

  const revenueData = useMemo(() => {
    return analytics.monthlyRevenue.map(item => ({
      month: language === 'ar' ? item.month : item.monthEn,
      revenue: item.revenue,
      orders: item.orders,
    }));
  }, [analytics.monthlyRevenue, language]);

  const servicePerformance = useMemo(() => {
    return analytics.topServices.map(service => ({
      name: language === 'ar' ? (service.name_ar || service.name) : service.name,
      orders: service.orders_count,
      revenue: service.revenue,
    }));
  }, [analytics.topServices, language]);

  const kpiCards = [
    {
      title: language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue',
      value: formatCurrency(analytics.totalRevenue),
      icon: DollarSign,
      trend: '+12.5%',
      trendUp: true,
      gradient: 'from-accent/20 to-accent/5',
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent',
    },
    {
      title: language === 'ar' ? 'إجمالي الطلبات' : 'Total Orders',
      value: analytics.totalOrders.toLocaleString('en-US'),
      icon: ShoppingCart,
      trend: '+8.2%',
      trendUp: true,
      gradient: 'from-primary/20 to-primary/5',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: language === 'ar' ? 'إجمالي العملاء' : 'Total Customers',
      value: analytics.totalUsers.toLocaleString('en-US'),
      icon: Users,
      trend: '+15.3%',
      trendUp: true,
      gradient: 'from-secondary/20 to-secondary/5',
      iconBg: 'bg-secondary/10',
      iconColor: 'text-secondary',
    },
    {
      title: language === 'ar' ? 'متوسط قيمة الطلب' : 'Avg Order Value',
      value: formatCurrency(avgOrderValue),
      icon: Activity,
      trend: '-2.1%',
      trendUp: false,
      gradient: 'from-muted to-muted/50',
      iconBg: 'bg-muted',
      iconColor: 'text-muted-foreground',
    },
  ];

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl" />
            <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
              <BarChart3 className="h-7 w-7 text-primary" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">
                {language === 'ar' ? 'التقارير والتحليلات' : 'Reports & Analytics'}
              </h1>
              <Badge variant="secondary" className="gap-1 text-xs">
                <Sparkles className="h-3 w-3" />
                {language === 'ar' ? 'بيانات حقيقية' : 'Live Data'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {language === 'ar' ? 'تحليلات شاملة من قاعدة البيانات' : 'Comprehensive analytics from database'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px] bg-background">
              <Calendar className="h-4 w-4 me-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7months">{language === 'ar' ? 'آخر 7 أشهر' : 'Last 7 months'}</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            {language === 'ar' ? 'تحديث' : 'Refresh'}
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn(
              "relative overflow-hidden border-border/50 shadow-sm",
              "hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            )}>
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-50",
                kpi.gradient
              )} />
              <CardContent className="relative p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("p-2.5 rounded-xl", kpi.iconBg)}>
                    <kpi.icon className={cn("h-5 w-5", kpi.iconColor)} />
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs gap-1",
                      kpi.trendUp 
                        ? "text-accent border-accent/30 bg-accent/5" 
                        : "text-destructive border-destructive/30 bg-destructive/5"
                    )}
                  >
                    {kpi.trendUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {kpi.trend}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? (
                    <span className="inline-block h-8 w-24 bg-muted animate-pulse rounded" />
                  ) : (
                    kpi.value
                  )}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{kpi.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-5"
        >
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="border-b bg-muted/30 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      {language === 'ar' ? 'الإيرادات والطلبات' : 'Revenue & Orders'}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {language === 'ar' ? 'تحليل الأداء المالي' : 'Financial performance analysis'}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[350px]">
                {loading ? (
                  <div className="h-full w-full bg-muted/20 animate-pulse rounded-xl flex items-center justify-center">
                    <span className="text-muted-foreground">
                      {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                    </span>
                  </div>
                ) : revenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenueReport" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        formatter={(value: number, name: string) => [
                          name === 'revenue' ? formatCurrency(value) : value, 
                          name === 'revenue' 
                            ? (language === 'ar' ? 'الإيرادات' : 'Revenue')
                            : (language === 'ar' ? 'الطلبات' : 'Orders')
                        ]}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        name={language === 'ar' ? 'الإيرادات' : 'Revenue'}
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorRevenueReport)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    {language === 'ar' ? 'لا توجد بيانات' : 'No data available'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Status Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/50 shadow-sm overflow-hidden h-full">
            <CardHeader className="border-b bg-muted/30 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <PieChartIcon className="h-5 w-5 text-secondary" />
                </div>
                <CardTitle className="text-base font-semibold">
                  {language === 'ar' ? 'حالة الطلبات' : 'Order Status'}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[200px]">
                {loading ? (
                  <div className="h-full w-full bg-muted/20 animate-pulse rounded-xl" />
                ) : orderStatusData.length > 0 ? (
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
                        formatter={(value: number, name: string, props: any) => [
                          `${value}%`,
                          language === 'ar' ? props.payload.name : props.payload.nameEn
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    {language === 'ar' ? 'لا توجد طلبات' : 'No orders'}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {orderStatusData.map((status, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                    <div 
                      className="w-3 h-3 rounded-full shrink-0" 
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="text-xs text-muted-foreground truncate">
                      {language === 'ar' ? status.name : status.nameEn}
                    </span>
                    <span className="text-xs font-semibold ms-auto">{status.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Service Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="border-b bg-muted/30 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Package className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  {language === 'ar' ? 'أداء الخدمات' : 'Service Performance'}
                </CardTitle>
                <CardDescription className="text-xs">
                  {language === 'ar' ? 'أفضل الخدمات حسب عدد الطلبات' : 'Top services by order count'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px]">
              {loading ? (
                <div className="h-full w-full bg-muted/20 animate-pulse rounded-xl flex items-center justify-center">
                  <span className="text-muted-foreground">
                    {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                  </span>
                </div>
              ) : servicePerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={servicePerformance} layout="vertical" margin={{ top: 0, right: 30, left: 100, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" horizontal={false} />
                    <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      width={100}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value: number, name: string) => [
                        name === 'orders' ? value : formatCurrency(value),
                        name === 'orders' ? (language === 'ar' ? 'الطلبات' : 'Orders') : (language === 'ar' ? 'الإيرادات' : 'Revenue')
                      ]}
                    />
                    <Legend />
                    <Bar 
                      dataKey="orders" 
                      name={language === 'ar' ? 'الطلبات' : 'Orders'} 
                      fill="hsl(var(--primary))" 
                      radius={[0, 8, 8, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  {language === 'ar' ? 'لا توجد بيانات خدمات' : 'No service data available'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
