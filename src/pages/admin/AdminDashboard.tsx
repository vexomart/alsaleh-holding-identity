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
  Monitor,
  Award,
  Wrench,
  TestTube,
  Search,
  Sparkles,
  Bell,
  MessageSquare
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthDiagnostics from '@/components/admin/AuthDiagnostics';

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
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    await Promise.all([fetchStatsData(), fetchRecentActivities(), fetchChartData()]);
    setLoading(false);
  };

  const fetchStatsData = async () => {
    try {
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*');

      const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select('*');

      const { data: payments, error: paymentsError } = await supabase
        .from('payment_transactions')
        .select('amount, status, created_at')
        .eq('status', 'COMPLETED');

      if (projectsError) throw projectsError;
      if (clientsError) throw clientsError;
      if (paymentsError) throw paymentsError;

      const totalRevenue = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
      const activeProjects = projects?.filter(p => p.status === 'in_progress').length || 0;
      const completedProjects = projects?.filter(p => p.status === 'completed').length || 0;
      
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
    }
  };

  const fetchChartData = async () => {
    try {
      const { data: payments } = await supabase
        .from('payment_transactions')
        .select('amount, created_at, status')
        .eq('status', 'COMPLETED')
        .order('created_at', { ascending: false });

      const { data: projectsData } = await supabase
        .from('projects')
        .select('created_at, status')
        .order('created_at', { ascending: false });

      const { data: clientsData } = await supabase
        .from('clients')
        .select('created_at')
        .order('created_at', { ascending: false });

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

    } catch (error) {
      console.error('Error fetching real chart data:', error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const { data: projectActivity } = await supabase
        .from('projects')
        .select('name, created_at, status')
        .order('created_at', { ascending: false })
        .limit(3);

      const { data: paymentActivity } = await supabase
        .from('payment_transactions')
        .select('amount, created_at, status, offer_title')
        .eq('status', 'COMPLETED')
        .order('created_at', { ascending: false })
        .limit(2);

      const activities = [];

      projectActivity?.forEach((project, index) => {
        activities.push({
          id: `project-${index}`,
          type: 'project',
          title: `مشروع: ${project.name}`,
          time: new Date(project.created_at).toLocaleDateString('ar-SA'),
          status: project.status === 'completed' ? 'success' : 'info'
        });
      });

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
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      title: 'المشاريع النشطة',
      value: stats.activeProjects,
      change: getChangePercentage(stats.activeProjects, Math.max(1, stats.activeProjects - 1)),
      changeType: stats.activeProjects >= Math.max(1, stats.activeProjects - 1) ? 'positive' : 'negative',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
    },
    {
      title: 'العملاء',
      value: stats.totalClients,
      change: getChangePercentage(stats.totalClients, Math.max(1, stats.totalClients - 1)),
      changeType: stats.totalClients >= Math.max(1, stats.totalClients - 1) ? 'positive' : 'negative',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    },
    {
      title: 'الإيرادات',
      value: `${stats.totalRevenue.toLocaleString()} ر.س`,
      change: `${stats.monthlyGrowth >= 0 ? '+' : ''}${stats.monthlyGrowth}%`,
      changeType: stats.monthlyGrowth >= 0 ? 'positive' : 'negative',
      icon: CreditCard,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    },
  ];

  const quickActions = [
    { title: 'نظام إدارة المشاريع المتطور', description: 'إدارة متقدمة للمشاريع مع تتبع الأداء', icon: Briefcase, action: '/admin/project-management' },
    { title: 'إضافة مشروع جديد', description: 'إنشاء مشروع جديد للعملاء', icon: Package, action: '/admin/projects' },
    { title: 'إدارة العملاء', description: 'عرض وإدارة قائمة العملاء', icon: Users, action: '/admin/clients' },
    { title: 'تقارير الأداء', description: 'عرض تقارير مفصلة عن الأداء', icon: BarChart3, action: '/admin/analytics' },
    { title: 'إعدادات النظام', description: 'تخصيص إعدادات النظام', icon: Settings, action: '/admin/settings' },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-primary/5 p-4 lg:p-8">
        <div className="container mx-auto space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 lg:p-8">
                  <div className="h-20 lg:h-24 bg-muted rounded-xl"></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 lg:p-8">
                  <div className="h-48 lg:h-64 bg-muted rounded-xl"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-primary/5 dark:from-background dark:via-card/30 dark:to-primary/5 font-corporate" dir="rtl">
      <div className="container mx-auto p-4 lg:p-8 space-y-6 lg:space-y-8">
        {/* Executive Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card/98 to-card/95 border border-border/60 shadow-2xl backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/8 via-accent/8 to-secondary/8 rounded-full blur-3xl transform rotate-45 -translate-y-1/3 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-secondary/8 via-primary/8 to-accent/8 rounded-full blur-3xl transform -rotate-45 translate-y-1/3 -translate-x-1/3"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
          </div>
          
          <div className="relative z-10 p-6 lg:p-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
              <div className="flex-1 text-center lg:text-right space-y-4 lg:space-y-6">
                <div className="flex items-center justify-center lg:justify-end gap-3 lg:gap-4 flex-wrap">
                  <Badge className="px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-primary via-accent to-secondary text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-500 animate-scale-in delay-100 text-sm lg:text-base">
                    <Building2 className="w-4 lg:w-5 h-4 lg:h-5 ml-2" />
                    Executive Command Center
                  </Badge>
                  <Badge variant="outline" className="px-3 lg:px-4 py-1.5 lg:py-2 bg-background/80 backdrop-blur border-primary/20 hover:border-primary/40 transition-all duration-300 animate-scale-in delay-200">
                    <Shield className="w-3 lg:w-4 h-3 lg:h-4 ml-2" />
                    Admin Access
                  </Badge>
                </div>
                
                <div className="space-y-3 lg:space-y-4">
                  <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight animate-fade-in delay-300">
                    مركز القيادة التنفيذية
                  </h1>
                  <p className="text-base lg:text-lg xl:text-xl text-muted-foreground max-w-3xl mx-auto lg:mx-0 leading-relaxed animate-fade-in delay-400">
                    نظام إدارة متطور بتقنيات الذكاء الاصطناعي لمراقبة الأداء والتحكم في العمليات التجارية على مستوى عالمي
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 lg:gap-6 animate-fade-in delay-500">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-3xl blur opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-primary via-accent to-secondary p-4 lg:p-6 rounded-3xl shadow-2xl">
                    <Activity className="w-8 lg:w-12 h-8 lg:h-12 text-white animate-bounce" />
                  </div>
                </div>
                <div className="space-y-2 lg:space-y-3 text-center lg:text-right">
                  <div className="flex items-center gap-2 lg:gap-3 justify-center lg:justify-start">
                    <div className="w-2 lg:w-3 h-2 lg:h-3 bg-success rounded-full animate-pulse"></div>
                    <span className="text-xs lg:text-sm font-medium text-muted-foreground">النظام يعمل بكفاءة</span>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-3 justify-center lg:justify-start">
                    <Clock className="w-3 lg:w-4 h-3 lg:h-4 text-primary" />
                    <span className="text-xs lg:text-sm font-medium text-muted-foreground">آخر تحديث: الآن</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content with Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="dashboard" className="text-lg">
              <BarChart3 className="w-5 h-5 ml-2" />
              لوحة التحكم الرئيسية
            </TabsTrigger>
            <TabsTrigger value="auth-diagnostics" className="text-lg">
              <Shield className="w-5 h-5 ml-2" />
              تشخيص نظام المصادقة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 lg:space-y-8">
            {/* Executive KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          {statsCards.map((stat, index) => (
            <Card key={index} className={`group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 border border-border/50 ${stat.bgColor} backdrop-blur-sm hover:scale-105 cursor-pointer animate-fade-in`} style={{ animationDelay: `${index * 150}ms` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-24 lg:w-32 h-24 lg:h-32 opacity-20">
                <div className={`w-full h-full bg-gradient-to-br ${stat.color} rounded-full blur-3xl transform rotate-45 group-hover:scale-150 transition-transform duration-700`}></div>
              </div>
              
              <CardContent className="relative p-4 lg:p-6 xl:p-8">
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <div className={`p-3 lg:p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <stat.icon className="w-6 lg:w-8 h-6 lg:h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-xl lg:text-2xl xl:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {stat.value}
                    </p>
                    <p className="text-xs lg:text-sm font-medium text-muted-foreground">{stat.title}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-1 rounded-lg ${
                    stat.changeType === 'positive' 
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                  }`}>
                    {stat.changeType === 'positive' ? (
                      <ArrowUpRight className="h-3 lg:h-4 w-3 lg:w-4" />
                    ) : (
                      <ArrowDownRight className="h-3 lg:h-4 w-3 lg:w-4" />
                    )}
                    <span className="text-xs lg:text-sm font-semibold">
                      {stat.change}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 lg:mt-4 h-1 lg:h-2 bg-muted/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000 group-hover:animate-pulse`}
                    style={{ width: `${Math.min(Math.random() * 100 + 30, 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Charts and Activities */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Analytics Charts */}
          <div className="xl:col-span-2 space-y-6 lg:space-y-8">
            {/* Revenue Chart */}
            {chartData.length > 0 && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/95 backdrop-blur-sm animate-fade-in delay-200">
                <CardHeader className="pb-4 lg:pb-6">
                  <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
                    <div className="p-2 lg:p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
                      <BarChart3 className="w-5 lg:w-6 h-5 lg:h-6 text-white" />
                    </div>
                    تحليلات الإيرادات والأداء
                  </CardTitle>
                  <CardDescription className="text-sm lg:text-base">
                    نظرة شاملة على الأداء المالي والتشغيلي للأشهر الستة الماضية
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 lg:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '12px',
                            fontSize: '14px'
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="hsl(var(--primary))" 
                          fill="url(#revenueGradient)" 
                          strokeWidth={3}
                        />
                        <defs>
                          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Project Status Chart */}
            {projectStatusData.length > 0 && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/95 backdrop-blur-sm animate-fade-in delay-300">
                <CardHeader className="pb-4 lg:pb-6">
                  <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
                    <div className="p-2 lg:p-3 rounded-xl bg-gradient-to-br from-accent to-secondary">
                      <PieChartIcon className="w-5 lg:w-6 h-5 lg:h-6 text-white" />
                    </div>
                    توزيع حالات المشاريع
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 lg:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={projectStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="count"
                        >
                          {projectStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '12px'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-3 lg:gap-4 mt-4 lg:mt-6">
                    {projectStatusData.map((item, index) => (
                      <div key={item.status} className="flex items-center gap-2 lg:gap-3">
                        <div 
                          className="w-3 lg:w-4 h-3 lg:h-4 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-xs lg:text-sm text-muted-foreground">{item.status}: {item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recent Activities & Quick Actions */}
          <div className="space-y-6 lg:space-y-8">
            {/* Recent Activities */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/95 backdrop-blur-sm animate-fade-in delay-400">
              <CardHeader className="pb-4 lg:pb-6">
                <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
                  <div className="p-2 lg:p-3 rounded-xl bg-gradient-to-br from-secondary to-primary">
                    <Activity className="w-5 lg:w-6 h-5 lg:h-6 text-white" />
                  </div>
                  النشاطات الأخيرة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 lg:space-y-4">
                {recentActivities.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className="group p-3 lg:p-4 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className={`p-2 lg:p-3 rounded-xl transition-transform group-hover:scale-110 ${
                          activity.type === 'project' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'
                        }`}>
                          {activity.type === 'project' ? 
                            <Package className="w-4 lg:w-5 h-4 lg:h-5 text-blue-600" /> :
                            <CreditCard className="w-4 lg:w-5 h-4 lg:h-5 text-green-600" />
                          }
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm lg:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                          {activity.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3 lg:w-4 h-3 lg:h-4 text-muted-foreground" />
                          <span className="text-xs lg:text-sm text-muted-foreground">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/95 backdrop-blur-sm animate-fade-in delay-500">
              <CardHeader className="pb-4 lg:pb-6">
                <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
                  <div className="p-2 lg:p-3 rounded-xl bg-gradient-to-br from-accent to-primary">
                    <Zap className="w-5 lg:w-6 h-5 lg:h-6 text-white" />
                  </div>
                  إجراءات سريعة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 lg:space-y-4">
                {quickActions.map((action, index) => (
                  <Link 
                    key={index} 
                    to={action.action}
                    className="group block p-3 lg:p-4 rounded-xl border border-border/50 bg-muted/30 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 lg:p-3 rounded-xl bg-gradient-to-br from-muted to-muted/50 group-hover:from-primary group-hover:to-primary/80 transition-all duration-300">
                        <action.icon className="w-4 lg:w-5 h-4 lg:h-5 text-foreground group-hover:text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm lg:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                          {action.title}
                        </h4>
                        <p className="text-xs lg:text-sm text-muted-foreground mt-1">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
          </TabsContent>

          <TabsContent value="auth-diagnostics">
            <AuthDiagnostics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;