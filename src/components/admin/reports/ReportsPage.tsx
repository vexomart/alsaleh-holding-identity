/**
 * Reports & Analytics Page - Enterprise Grade Design
 * Advanced data visualization and insights
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/integrations/supabase/db';
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
  LineChart,
  Line,
  Legend
} from 'recharts';

const revenueData = [
  { month: 'يناير', revenue: 45000, orders: 120, target: 40000 },
  { month: 'فبراير', revenue: 52000, orders: 145, target: 45000 },
  { month: 'مارس', revenue: 48000, orders: 130, target: 50000 },
  { month: 'أبريل', revenue: 61000, orders: 165, target: 55000 },
  { month: 'مايو', revenue: 55000, orders: 150, target: 55000 },
  { month: 'يونيو', revenue: 72000, orders: 190, target: 60000 },
  { month: 'يوليو', revenue: 68000, orders: 180, target: 65000 },
];

const orderStatusData = [
  { name: 'مكتمل', nameEn: 'Completed', value: 45, color: '#10b981' },
  { name: 'قيد التنفيذ', nameEn: 'In Progress', value: 25, color: '#3b82f6' },
  { name: 'معلق', nameEn: 'Pending', value: 20, color: '#f59e0b' },
  { name: 'ملغي', nameEn: 'Cancelled', value: 10, color: '#ef4444' },
];

const servicePerformance = [
  { name: 'استشارات قانونية', orders: 85, revenue: 25000 },
  { name: 'تسجيل الشركات', orders: 65, revenue: 19500 },
  { name: 'تراخيص تجارية', orders: 45, revenue: 13500 },
  { name: 'خدمات محاسبية', orders: 35, revenue: 10500 },
  { name: 'استشارات ضريبية', orders: 25, revenue: 7500 },
];

export function ReportsPage() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('7days');
  const [stats, setStats] = useState({
    totalRevenue: 401000,
    totalOrders: 1080,
    totalUsers: 256,
    avgOrderValue: 371,
    revenueGrowth: 12.5,
    ordersGrowth: 8.2,
    usersGrowth: 15.3,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const kpiCards = [
    {
      title: language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      change: stats.revenueGrowth,
      icon: DollarSign,
      color: 'emerald',
    },
    {
      title: language === 'ar' ? 'إجمالي الطلبات' : 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: stats.ordersGrowth,
      icon: ShoppingCart,
      color: 'blue',
    },
    {
      title: language === 'ar' ? 'إجمالي العملاء' : 'Total Customers',
      value: stats.totalUsers.toLocaleString(),
      change: stats.usersGrowth,
      icon: Users,
      color: 'violet',
    },
    {
      title: language === 'ar' ? 'متوسط قيمة الطلب' : 'Avg Order Value',
      value: formatCurrency(stats.avgOrderValue),
      change: 5.2,
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
            {language === 'ar' ? 'تحليلات متقدمة ورؤى الأعمال' : 'Advanced analytics and business insights'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="h-4 w-4 ml-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">{language === 'ar' ? 'آخر 7 أيام' : 'Last 7 days'}</SelectItem>
              <SelectItem value="30days">{language === 'ar' ? 'آخر 30 يوم' : 'Last 30 days'}</SelectItem>
              <SelectItem value="90days">{language === 'ar' ? 'آخر 90 يوم' : 'Last 90 days'}</SelectItem>
              <SelectItem value="year">{language === 'ar' ? 'هذه السنة' : 'This year'}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            {language === 'ar' ? 'تصدير' : 'Export'}
          </Button>
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
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "gap-1 text-xs",
                      kpi.change > 0 ? "text-emerald-600 bg-emerald-100" : "text-red-600 bg-red-100"
                    )}
                  >
                    {kpi.change > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {Math.abs(kpi.change)}%
                  </Badge>
                </div>
                <p className="text-2xl font-bold">{kpi.value}</p>
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
                  {language === 'ar' ? 'مقارنة الأداء مع الأهداف' : 'Performance vs targets'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
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
                    tickFormatter={(value) => `${value / 1000}k`}
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
                      formatCurrency(value), 
                      name === 'revenue' 
                        ? (language === 'ar' ? 'الإيرادات' : 'Revenue')
                        : (language === 'ar' ? 'الهدف' : 'Target')
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
                    fill="url(#colorRevenue)"
                  />
                  <Area
                    type="monotone"
                    dataKey="target"
                    name={language === 'ar' ? 'الهدف' : 'Target'}
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fillOpacity={1}
                    fill="url(#colorTarget)"
                  />
                </AreaChart>
              </ResponsiveContainer>
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
                {language === 'ar' ? 'أفضل الخدمات حسب الطلبات والإيرادات' : 'Top services by orders and revenue'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
