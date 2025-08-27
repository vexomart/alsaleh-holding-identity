import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  CreditCard,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Building2,
  FileText,
  Settings,
  PieChart as PieChartIcon,
  Briefcase,
  Target,
  Zap,
  Shield,
  Activity,
  Star,
  DollarSign,
  Globe,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalClients: number;
  totalRevenue: number;
  monthlyGrowth: number;
  pendingTasks: number;
}

interface ChartData {
  month: string;
  revenue: number;
  projects: number;
  clients: number;
}

interface DeviceData {
  device: string;
  users: number;
  percentage: number;
}

interface ProjectStatusData {
  status: string;
  count: number;
  color: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    totalClients: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    pendingTasks: 0,
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [projectStatusData, setProjectStatusData] = useState<ProjectStatusData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    await Promise.all([fetchStatsData(), fetchRecentActivities()]);
    // Fetch chart data after stats are available
    await fetchChartData();
  };

  const fetchStatsData = async () => {
    try {
      // Fetch projects data
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*');

      // Fetch clients data
      const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select('*');

      // Fetch payment transactions
      const { data: payments, error: paymentsError } = await supabase
        .from('payment_transactions')
        .select('amount, status, created_at')
        .eq('status', 'COMPLETED');

      if (projectsError) throw projectsError;
      if (clientsError) throw clientsError;
      if (paymentsError) throw paymentsError;

      // Calculate stats from real data
      const totalRevenue = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
      const activeProjects = projects?.filter(p => p.status === 'in_progress').length || 0;
      const completedProjects = projects?.filter(p => p.status === 'completed').length || 0;
      
      // Calculate real growth rate based on actual data
      const currentMonth = new Date().getMonth();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const currentYear = new Date().getFullYear();
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      
      const thisMonthRevenue = payments?.filter(p => {
        const paymentDate = new Date(p.created_at);
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
      }).reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
      
      const lastMonthRevenue = payments?.filter(p => {
        const paymentDate = new Date(p.created_at);
        return paymentDate.getMonth() === lastMonth && paymentDate.getFullYear() === lastMonthYear;
      }).reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
      
      const growthRate = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100) : 0;

      setStats({
        totalProjects: projects?.length || 0,
        activeProjects,
        totalClients: clients?.length || 0,
        totalRevenue,
        monthlyGrowth: Math.round(growthRate * 10) / 10,
        pendingTasks: completedProjects,
      });

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch real chart data from database
  const fetchChartData = async () => {
    try {
      // Get real monthly revenue data from payment_transactions
      const { data: payments } = await supabase
        .from('payment_transactions')
        .select('amount, created_at, status')
        .eq('status', 'COMPLETED')
        .order('created_at', { ascending: false });

      // Get real projects data
      const { data: projectsData } = await supabase
        .from('projects')
        .select('created_at, status')
        .order('created_at', { ascending: false });

      // Get real clients data
      const { data: clientsData } = await supabase
        .from('clients')
        .select('created_at')
        .order('created_at', { ascending: false });

      // Process real monthly data for the past 6 months
      const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
      const now = new Date();
      const chartData: ChartData[] = [];

      for (let i = 5; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        
        const monthlyRevenue = payments?.filter(p => {
          const paymentDate = new Date(p.created_at);
          return paymentDate >= monthStart && paymentDate <= monthEnd;
        }).reduce((sum, p) => sum + Number(p.amount), 0) || 0;

        const monthlyProjects = projectsData?.filter(p => {
          const projectDate = new Date(p.created_at);
          return projectDate >= monthStart && projectDate <= monthEnd;
        }).length || 0;

        const monthlyClients = clientsData?.filter(c => {
          const clientDate = new Date(c.created_at);
          return clientDate >= monthStart && clientDate <= monthEnd;
        }).length || 0;

        chartData.push({
          month: months[5 - i] || `الشهر ${6 - i}`,
          revenue: monthlyRevenue,
          projects: monthlyProjects,
          clients: monthlyClients,
        });
      }
      
      setChartData(chartData);

      // Real project status data based on actual project statuses
      const statusCounts = projectsData?.reduce((acc, project) => {
        const status = project.status || 'draft';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const statusData: ProjectStatusData[] = [
        { status: 'مكتمل', count: statusCounts.completed || 0, color: '#10b981' },
        { status: 'قيد التنفيذ', count: statusCounts.in_progress || 0, color: '#3b82f6' },
        { status: 'معلق', count: statusCounts.pending || 0, color: '#f59e0b' },
        { status: 'مسودة', count: statusCounts.draft || 0, color: '#6b7280' },
      ];
      setProjectStatusData(statusData);

      // Remove fake device data - use real data if available or hide the section
      setDeviceData([]);

    } catch (error) {
      console.error('Error fetching real chart data:', error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: "تعذر تحميل البيانات الحقيقية",
        variant: "destructive",
      });
    }
  };

  const getChangePercentage = (value: number, baseValue: number) => {
    if (baseValue === 0) return '+0%';
    const change = ((value - baseValue) / baseValue * 100);
    return change >= 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`;
  };

  const statsCards = [
    {
      title: 'إجمالي المشاريع',
      value: stats.totalProjects,
      change: getChangePercentage(stats.totalProjects, Math.max(1, stats.totalProjects - 2)),
      changeType: stats.totalProjects >= Math.max(1, stats.totalProjects - 2) ? 'positive' : 'negative',
      icon: Package,
      color: 'blue',
    },
    {
      title: 'المشاريع النشطة',
      value: stats.activeProjects,
      change: getChangePercentage(stats.activeProjects, Math.max(1, stats.activeProjects - 1)),
      changeType: stats.activeProjects >= Math.max(1, stats.activeProjects - 1) ? 'positive' : 'negative',
      icon: TrendingUp,
      color: 'green',
    },
    {
      title: 'العملاء',
      value: stats.totalClients,
      change: getChangePercentage(stats.totalClients, Math.max(1, stats.totalClients - 1)),
      changeType: stats.totalClients >= Math.max(1, stats.totalClients - 1) ? 'positive' : 'negative',
      icon: Users,
      color: 'purple',
    },
    {
      title: 'الإيرادات',
      value: `${stats.totalRevenue.toLocaleString()} ر.س`,
      change: `${stats.monthlyGrowth >= 0 ? '+' : ''}${stats.monthlyGrowth}%`,
      changeType: stats.monthlyGrowth >= 0 ? 'positive' : 'negative',
      icon: CreditCard,
      color: 'orange',
    },
  ];

  // Fetch real activities from database
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  const fetchRecentActivities = async () => {
    try {
      // Get recent project activities
      const { data: projectActivity } = await supabase
        .from('projects')
        .select('name, created_at, status')
        .order('created_at', { ascending: false })
        .limit(3);

      // Get recent payment activities  
      const { data: paymentActivity } = await supabase
        .from('payment_transactions')
        .select('amount, created_at, status, offer_title')
        .eq('status', 'COMPLETED')
        .order('created_at', { ascending: false })
        .limit(2);

      const activities = [];

      // Add project activities
      projectActivity?.forEach((project, index) => {
        activities.push({
          id: `project-${index}`,
          type: 'project',
          title: `مشروع: ${project.name}`,
          time: new Date(project.created_at).toLocaleDateString('ar-SA'),
          status: project.status === 'completed' ? 'success' : 'info'
        });
      });

      // Add payment activities
      paymentActivity?.forEach((payment, index) => {
        activities.push({
          id: `payment-${index}`,
          type: 'payment', 
          title: `دفعة مالية: ${payment.amount} ر.س - ${payment.offer_title || 'خدمة'}`,
          time: new Date(payment.created_at).toLocaleDateString('ar-SA'),
          status: 'success'
        });
      });

      setRecentActivities(activities.slice(0, 5));
    } catch (error) {
      console.error('Error fetching activities:', error);
      setRecentActivities([]);
    }
  };

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  const quickActions = [
    { title: 'إضافة مشروع جديد', description: 'إنشاء مشروع جديد للعملاء', action: '/admin/projects' },
    { title: 'إدارة العملاء', description: 'عرض وإدارة قائمة العملاء', action: '/admin/clients' },
    { title: 'تقارير الأداء', description: 'عرض تقارير مفصلة عن الأداء', action: '/admin/analytics' },
    { title: 'إعدادات النظام', description: 'تخصيص إعدادات النظام', action: '/admin/settings' },
  ];

  // Colors for charts
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="space-y-8 p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 sm:p-6">
                <div className="h-16 sm:h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 sm:p-6">
                <div className="h-32 sm:h-48 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 font-corporate" dir="rtl">
      {/* Executive Header - Responsive */}
      <div className="relative bg-gradient-to-l from-primary/10 via-blue-50/50 to-slate-50/30 dark:from-primary/5 dark:via-slate-800 dark:to-slate-900/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-border/50 shadow-sm overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-0">
          <div className="text-right space-y-2 sm:space-y-3 order-2 lg:order-1">
            <div className="flex items-center gap-2 sm:gap-3 justify-end flex-wrap">
              <Badge variant="secondary" className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 transition-all duration-300 text-xs sm:text-sm">
                <Building2 className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                لوحة التحكم التنفيذية
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-l from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent leading-tight">
              إدارة الأعمال المتقدمة
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-full lg:max-w-2xl leading-relaxed">
              نظام إدارة شامل لمراقبة الأداء وتحليل البيانات وإدارة العمليات التجارية بكفاءة عالية
            </p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 justify-end lg:justify-start order-1 lg:order-2">
            <div className="bg-primary/10 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-primary/20">
              <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-pulse" />
            </div>
            <Badge variant="outline" className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 bg-background/80 backdrop-blur border-border/50 hover:bg-background transition-all duration-300">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
              آخر تحديث: الآن
            </Badge>
          </div>
        </div>
      </div>

      {/* Executive KPI Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 border border-border/50 bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm hover:scale-[1.02] cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="relative p-4 sm:p-6 lg:p-7">
              <div className="flex items-center justify-between">
                <div className="text-right space-y-2 sm:space-y-3 flex-1">
                  <div className="flex items-center justify-end gap-2">
                    <Badge variant="secondary" className="text-xs px-2 py-1 bg-muted/50 text-muted-foreground border-0">
                      {stat.title}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300 break-words">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-2 justify-end">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                        stat.changeType === 'positive' 
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                          : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                      }`}>
                        {stat.changeType === 'positive' ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        <span className="text-xs sm:text-sm font-semibold">
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`relative p-3 sm:p-4 rounded-xl sm:rounded-2xl ${
                  stat.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                  stat.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                  stat.color === 'purple' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' :
                  'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                } group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Charts Section - Responsive (Only show if real data exists) */}
      {(chartData.length > 0 || projectStatusData.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          
          {/* Revenue Chart - Only show if revenue data exists */}
          {chartData.some(item => item.revenue > 0) && (
            <Card className="lg:col-span-2 xl:col-span-2 border border-border/50 bg-gradient-to-br from-background via-background/98 to-background/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                  <div className="text-right space-y-2">
                    <CardTitle className="flex items-center gap-3 text-right text-lg sm:text-xl font-semibold">
                      <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                        <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      تحليل الإيرادات الشهرية
                    </CardTitle>
                    <CardDescription className="text-right text-sm sm:text-base">
                      الإيرادات الحقيقية من المعاملات المكتملة
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-blue-50/50 text-blue-700 border-blue-200 px-3 py-1 text-xs sm:text-sm self-end sm:self-auto">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                    بيانات حقيقية
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 sm:h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          direction: 'rtl'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3b82f6" 
                        fillOpacity={1} 
                        fill="url(#revenueGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Project Status Pie Chart - Only show if project data exists */}
          {projectStatusData.some(item => item.count > 0) && (
            <Card className="border border-border/50 bg-gradient-to-br from-background via-background/98 to-background/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="text-right space-y-2">
                  <CardTitle className="flex items-center gap-3 text-right text-lg sm:text-xl font-semibold">
                    <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                      <PieChartIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    حالة المشاريع الحقيقية
                  </CardTitle>
                  <CardDescription className="text-right text-sm sm:text-base">
                    توزيع المشاريع حسب الحالة الفعلية
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-48 sm:h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={projectStatusData.filter(item => item.count > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={window.innerWidth < 640 ? 30 : 40}
                        outerRadius={window.innerWidth < 640 ? 70 : 90}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {projectStatusData.filter(item => item.count > 0).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          direction: 'rtl'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {projectStatusData.filter(item => item.count > 0).map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.count}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{item.status}</span>
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Enterprise Activity Center */}
        <Card className="lg:col-span-2 border border-border/50 bg-gradient-to-br from-background via-background/98 to-background/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="text-right space-y-2">
                <CardTitle className="flex items-center gap-3 text-right text-xl font-semibold">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Activity className="h-5 w-5" />
                  </div>
                  مركز النشاطات التنفيذي
                </CardTitle>
                <CardDescription className="text-right text-base">
                  رصد شامل لجميع العمليات والأحداث الحديثة في النظام
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1">
                {recentActivities.length} نشاط
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={activity.id} className="group relative p-5 rounded-xl border border-border/30 bg-gradient-to-r from-muted/20 via-background/50 to-muted/20 hover:from-primary/5 hover:via-background/70 hover:to-blue-50/30 dark:hover:from-primary/5 dark:hover:via-slate-800/70 dark:hover:to-slate-700/30 transition-all duration-500 hover:shadow-md hover:scale-[1.01] cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                  <div className="relative flex items-center gap-4">
                    <div className={`relative p-3 rounded-xl ${
                      activity.status === 'success' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                      activity.status === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                      'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    } group-hover:scale-110 transition-transform duration-300`}>
                      {activity.status === 'success' ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : activity.status === 'warning' ? (
                        <AlertCircle className="h-5 w-5" />
                      ) : (
                        <Zap className="h-5 w-5" />
                      )}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="flex-1 text-right space-y-1">
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {activity.title}
                      </p>
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                          {activity.time}
                        </span>
                        <Badge variant={activity.status === 'success' ? 'default' : 'secondary'} className="text-xs px-2 py-0.5">
                          {activity.status === 'success' ? 'مكتمل' : activity.status === 'warning' ? 'تحذير' : 'جديد'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Executive Command Center */}
        <Card className="border border-border/50 bg-gradient-to-br from-background via-background/98 to-background/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="text-right space-y-2">
              <CardTitle className="flex items-center gap-3 text-right text-xl font-semibold">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Target className="h-5 w-5" />
                </div>
                مركز القيادة التنفيذي
              </CardTitle>
              <CardDescription className="text-right text-base">
                الوصول المباشر للعمليات الحيوية والمهام الاستراتيجية
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: 'إدارة المشاريع', description: 'إشراف على جميع المشاريع النشطة', action: '/admin/projects', icon: Briefcase, color: 'blue' },
                { title: 'إدارة العملاء', description: 'قاعدة بيانات العملاء والعلاقات', action: '/admin/clients', icon: Users, color: 'green' },
                { title: 'التقارير التحليلية', description: 'تحليلات متقدمة وإحصائيات الأداء', action: '/admin/analytics', icon: PieChart, color: 'purple' },
                { title: 'إعدادات النظام', description: 'تكوين وإدارة النظام المتقدمة', action: '/admin/settings', icon: Settings, color: 'orange' },
              ].map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="group w-full h-auto p-4 justify-end text-right hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all duration-300 rounded-xl"
                  onClick={() => window.location.href = action.action}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={`p-2 rounded-lg ${
                      action.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                      action.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                      action.color === 'purple' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' :
                      'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                    } group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="h-5 w-5" />
    </div>
                    <div className="text-right flex-1">
                      <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-300">
                        {action.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Executive Performance Analytics */}
      <Card className="border border-border/50 bg-gradient-to-br from-background via-background/98 to-background/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="text-right space-y-2">
              <CardTitle className="flex items-center gap-3 text-right text-xl font-semibold">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Shield className="h-5 w-5" />
                </div>
                لوحة التحليلات التنفيذية
              </CardTitle>
              <CardDescription className="text-right text-base">
                مؤشرات الأداء الرئيسية والتحليلات الاستراتيجية للأعمال
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-4 py-2">
              <Star className="w-4 h-4 ml-1" />
              مؤشرات حية
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group space-y-4 p-5 rounded-xl border border-border/30 bg-gradient-to-br from-blue-50/30 via-background/50 to-blue-50/20 dark:from-blue-900/10 dark:via-slate-800/50 dark:to-blue-900/5 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.totalProjects > 0 ? Math.round((stats.activeProjects / stats.totalProjects) * 100) : 0}%
                  </span>
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">المشاريع النشطة</p>
                  <p className="text-xs text-muted-foreground">من إجمالي المشاريع</p>
                </div>
              </div>
              <div className="relative">
                <Progress 
                  value={stats.totalProjects > 0 ? (stats.activeProjects / stats.totalProjects) * 100 : 0} 
                  className="h-3 bg-blue-100 dark:bg-blue-900/30"
                />
                <div className="absolute top-0 left-0 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500" 
                     style={{ width: `${stats.totalProjects > 0 ? (stats.activeProjects / stats.totalProjects) * 100 : 0}%` }}></div>
              </div>
            </div>
            
            <div className="group space-y-4 p-5 rounded-xl border border-border/30 bg-gradient-to-br from-green-50/30 via-background/50 to-green-50/20 dark:from-green-900/10 dark:via-slate-800/50 dark:to-green-900/5 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.totalProjects > 0 ? Math.round((stats.pendingTasks / stats.totalProjects) * 100) : 0}%
                  </span>
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">المشاريع المكتملة</p>
                  <p className="text-xs text-muted-foreground">معدل الإنجاز</p>
                </div>
              </div>
              <div className="relative">
                <Progress 
                  value={stats.totalProjects > 0 ? (stats.pendingTasks / stats.totalProjects) * 100 : 0} 
                  className="h-3 bg-green-100 dark:bg-green-900/30"
                />
                <div className="absolute top-0 left-0 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500" 
                     style={{ width: `${stats.totalProjects > 0 ? (stats.pendingTasks / stats.totalProjects) * 100 : 0}%` }}></div>
              </div>
            </div>
            
            <div className="group space-y-4 p-5 rounded-xl border border-border/30 bg-gradient-to-br from-purple-50/30 via-background/50 to-purple-50/20 dark:from-purple-900/10 dark:via-slate-800/50 dark:to-purple-900/5 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.abs(stats.monthlyGrowth)}%
                  </span>
                  {stats.monthlyGrowth >= 0 ? (
                    <ArrowUpRight className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">النمو الشهري</p>
                  <p className="text-xs text-muted-foreground">مقارنة بالشهر السابق</p>
                </div>
              </div>
              <div className="relative">
                <Progress 
                  value={Math.min(100, Math.abs(stats.monthlyGrowth))} 
                  className="h-3 bg-purple-100 dark:bg-purple-900/30"
                />
                <div className="absolute top-0 left-0 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500" 
                     style={{ width: `${Math.min(100, Math.abs(stats.monthlyGrowth))}%` }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;