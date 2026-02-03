/**
 * Reports & Analytics Page - Enterprise Grade Design
 * Real data from database
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
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  PieChart as PieChartIcon,
  Activity
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

  // Compute average order value
  const avgOrderValue = useMemo(() => {
    if (analytics.totalOrders === 0) return 0;
    return Math.round(analytics.totalRevenue / analytics.totalOrders);
  }, [analytics.totalRevenue, analytics.totalOrders]);

  // Order status data for pie chart
  const orderStatusData = useMemo(() => {
    const total = analytics.totalOrders || 1;
    return [
      { 
        name: 'مكتمل', 
        nameEn: 'Completed', 
        value: Math.round((analytics.ordersByStatus.completed / total) * 100) || 0, 
        color: '#10b981' 
      },
      { 
        name: 'قيد التنفيذ', 
        nameEn: 'In Progress', 
        value: Math.round(((analytics.ordersByStatus.processing + analytics.ordersByStatus.in_progress) / total) * 100) || 0, 
        color: '#3b82f6' 
      },
      { 
        name: 'معلق', 
        nameEn: 'Pending', 
        value: Math.round((analytics.ordersByStatus.pending / total) * 100) || 0, 
        color: '#f59e0b' 
      },
      { 
        name: 'ملغي', 
        nameEn: 'Cancelled', 
        value: Math.round(((analytics.ordersByStatus.cancelled + analytics.ordersByStatus.refunded) / total) * 100) || 0, 
        color: '#ef4444' 
      },
    ].filter(item => item.value > 0);
  }, [analytics.ordersByStatus, analytics.totalOrders]);

  // Revenue data for charts
  const revenueData = useMemo(() => {
    return analytics.monthlyRevenue.map(item => ({
      month: language === 'ar' ? item.month : item.monthEn,
      revenue: item.revenue,
      orders: item.orders,
    }));
  }, [analytics.monthlyRevenue, language]);

  // Top services for bar chart
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
      color: 'emerald',
    },
    {
      title: language === 'ar' ? 'إجمالي الطلبات' : 'Total Orders',
      value: analytics.totalOrders.toLocaleString('en-US'),
      icon: ShoppingCart,
      color: 'blue',
    },
    {
      title: language === 'ar' ? 'إجمالي العملاء' : 'Total Customers',
      value: analytics.totalUsers.toLocaleString('en-US'),
      icon: Users,
      color: 'violet',
    },
    {
      title: language === 'ar' ? 'متوسط قيمة الطلب' : 'Avg Order Value',
      value: formatCurrency(avgOrderValue),
      icon: Activity,
      color: 'amber',
    },
  ];

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            {language === 'ar' ? 'التقارير والتحليلات' : 'Reports & Analytics'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {language === 'ar' ? 'بيانات حقيقية من قاعدة البيانات' : 'Real data from database'}
          </p>
        </div>
        <div className="flex items-center gap-2">
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
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="h-4 w-4 ml-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7months">{language === 'ar' ? 'آخر 7 أشهر' : 'Last 7 months'}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className={cn(
                "absolute top-0 inset-x-0 h-1 bg-gradient-to-r",
                kpi.color === 'emerald' && "from-emerald-500 to-emerald-600",
                kpi.color === 'blue' && "from-blue-500 to-blue-600",
                kpi.color === 'violet' && "from-violet-500 to-violet-600",
                kpi.color === 'amber' && "from-amber-500 to-amber-600"
              )} />
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={cn(
                    "p-2.5 rounded-xl",
                    kpi.color === 'emerald' && "bg-emerald-500/10 text-emerald-600",
                    kpi.color === 'blue' && "bg-blue-500/10 text-blue-600",
                    kpi.color === 'violet' && "bg-violet-500/10 text-violet-600",
                    kpi.color === 'amber' && "bg-amber-500/10 text-amber-600"
                  )}>
                    <kpi.icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold">
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
        <Card className="lg:col-span-5 border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {language === 'ar' ? 'الإيرادات والطلبات' : 'Revenue & Orders'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'بيانات حقيقية من قاعدة البيانات' : 'Real data from database'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              {loading ? (
                <div className="h-full w-full bg-muted/50 animate-pulse rounded flex items-center justify-center">
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
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
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
                        borderRadius: '8px',
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

        {/* Order Status Pie */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'حالة الطلبات' : 'Order Status'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              {loading ? (
                <div className="h-full w-full bg-muted/50 animate-pulse rounded" />
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
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {language === 'ar' ? status.name : status.nameEn}
                  </span>
                  <span className="text-xs font-medium ml-auto">{status.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Performance */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                {language === 'ar' ? 'أداء الخدمات' : 'Service Performance'}
              </CardTitle>
              <CardDescription>
                {language === 'ar' ? 'أفضل الخدمات حسب عدد الطلبات' : 'Top services by order count'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {loading ? (
              <div className="h-full w-full bg-muted/50 animate-pulse rounded flex items-center justify-center">
                <span className="text-muted-foreground">
                  {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                </span>
              </div>
            ) : servicePerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={servicePerformance} layout="vertical" margin={{ top: 0, right: 30, left: 100, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
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
                      borderRadius: '8px',
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
                    radius={[0, 4, 4, 0]}
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
    </div>
  );
}
