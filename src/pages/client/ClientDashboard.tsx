import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { NumberFormatter } from '@/components/NumberFormatter';
import { 
  Package, 
  FileText, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Calendar,
  MessageSquare,
  DollarSign,
  Wallet,
  Users,
  Star,
  Target,
  Activity,
  BarChart3,
  Bell,
  Gift,
  Zap,
  Shield,
  Award,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Globe,
  Smartphone,
  Settings,
  PieChart
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { NotificationsSection } from '@/components/client/NotificationsSection';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  pendingInvoices: number;
  totalSpent: number;
  pendingPayments: number;
}

interface RecentActivity {
  id: string;
  type: 'project' | 'invoice' | 'message';
  title: string;
  description: string;
  date: string;
  status?: string;
}

export default function ClientDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    pendingInvoices: 0,
    totalSpent: 0,
    pendingPayments: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id);

      const { data: invoices } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id);

      const totalProjects = projects?.length || 0;
      const activeProjects = projects?.filter(p => p.status === 'in_progress').length || 0;
      const completedProjects = projects?.filter(p => p.status === 'completed').length || 0;
      const pendingInvoices = invoices?.filter(i => i.status === 'pending').length || 0;
      const totalSpent = invoices?.reduce((sum, i) => sum + (parseFloat(i.amount.toString()) || 0), 0) || 0;
      const pendingPayments = invoices?.filter(i => i.payment_status === 'pending').length || 0;

      setStats({
        totalProjects,
        activeProjects,
        completedProjects,
        pendingInvoices,
        totalSpent,
        pendingPayments,
      });

      const activities: RecentActivity[] = [];
      
      if (projects) {
        projects.slice(0, 3).forEach(project => {
          activities.push({
            id: project.id,
            type: 'project',
            title: project.project_number || 'مشروع بدون عنوان',
            description: `حالة المشروع: ${getStatusText(project.status)}`,
            date: new Date(project.updated_at).toLocaleDateString('ar-SA'),
            status: project.status
          });
        });
      }

      if (invoices) {
        invoices.slice(0, 2).forEach(invoice => {
          activities.push({
            id: invoice.id,
            type: 'invoice',
            title: `فاتورة رقم ${invoice.invoice_number}`,
            description: `المبلغ: ${parseFloat(invoice.amount.toString()).toLocaleString()} ريال`,
            date: new Date(invoice.created_at).toLocaleDateString('ar-SA'),
            status: invoice.payment_status
          });
        });
      }

      setRecentActivities(activities.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'في الانتظار',
      'in_progress': 'قيد التنفيذ',
      'completed': 'مكتمل',
      'cancelled': 'ملغي'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'in_progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-20 bg-muted rounded-lg"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: 'مشاريعي',
      description: 'عرض وإدارة جميع المشاريع',
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      action: '/client/projects'
    },
    {
      title: 'الفواتير',
      description: 'مراجعة الفواتير والمدفوعات',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      action: '/client/invoices'
    },
    {
      title: 'الدعم الفني',
      description: 'تواصل مع فريق الدعم',
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-600',
      action: '/client/support'
    },
    {
      title: 'طلب خدمة جديدة',
      description: 'احصل على خدمة مخصصة',
      icon: Zap,
      color: 'from-orange-500 to-orange-600',
      action: '/client/new-service'
    },
    {
      title: 'بوابة الدفع',
      description: 'ادفع فواتيرك بسهولة وأمان',
      icon: CreditCard,
      color: 'from-emerald-500 to-emerald-600',
      action: '/client/payment-interface'
    }
  ];

  return (
    <div className="space-y-6" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Executive Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-border/60 shadow-xl">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        <div className="relative z-10 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center lg:text-right space-y-4">
              <div className="flex items-center justify-center lg:justify-end gap-3 flex-wrap">
                <Badge className="px-4 py-2 bg-primary text-primary-foreground shadow-lg">
                  <Award className="w-4 h-4 ml-2" />
                  بوابة العميل التنفيذية
                </Badge>
                <Badge variant="outline" className="px-3 py-1.5 bg-success/10 border-success/30 text-success">
                  <Shield className="w-3 h-3 ml-2" />
                  حساب محقق
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  لوحة التحكم الشاملة
                </h1>
                <p className="text-sm lg:text-base text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                  منصة إدارة متطورة لمتابعة مشاريعك والخدمات المالية بكفاءة احترافية
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-primary/10 p-3 rounded-xl border border-primary/20">
                  <div className="text-lg lg:text-xl font-bold text-primary">
                    <NumberFormatter number={stats.totalProjects} />
                  </div>
                  <div className="text-xs text-muted-foreground">مشاريع إجمالية</div>
                </div>
                <div className="bg-success/10 p-3 rounded-xl border border-success/20">
                  <div className="text-lg lg:text-xl font-bold text-success">
                    <NumberFormatter number={stats.completedProjects} />
                  </div>
                  <div className="text-xs text-muted-foreground">مشاريع مكتملة</div>
                </div>
                <div className="bg-accent/10 p-3 rounded-xl border border-accent/20">
                  <div className="text-lg lg:text-xl font-bold text-accent">
                    <NumberFormatter number={stats.totalSpent} suffix="K" />
                  </div>
                  <div className="text-xs text-muted-foreground">إجمالي الاستثمار</div>
                </div>
                <div className="bg-secondary/10 p-3 rounded-xl border border-secondary/20">
                  <div className="text-lg lg:text-xl font-bold text-secondary">
                    {stats.totalProjects > 0 ? Math.round((stats.completedProjects / stats.totalProjects) * 100) : 0}%
                  </div>
                  <div className="text-xs text-muted-foreground">معدل الإنجاز</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-60 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-primary to-accent p-6 rounded-full shadow-xl">
                  <Users className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="text-center space-y-1">
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-success">متصل - نشط</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. إجراءات سريعة */}
      <Card className="shadow-lg border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5 text-primary" />
            إجراءات سريعة
          </CardTitle>
          <CardDescription>الوصول السريع إلى الخدمات الأساسية</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.action}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border border-border/50 hover:border-primary/30">
                  <CardContent className="p-4 text-center">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${action.color} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2. النشاطات الأخيرة والتحديثات */}
      <Card className="shadow-lg border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5 text-accent" />
            النشاطات الأخيرة والتحديثات
          </CardTitle>
          <CardDescription>تتبع آخر التطورات في حسابك</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted/30 rounded-full flex items-center justify-center">
                <Activity className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">لا توجد أنشطة حديثة</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'project' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'invoice' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {activity.type === 'project' ? <Package className="w-4 h-4" /> :
                     activity.type === 'invoice' ? <FileText className="w-4 h-4" /> :
                     <MessageSquare className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 text-right">
                    <div className="font-medium text-sm">{activity.title}</div>
                    <div className="text-xs text-muted-foreground">{activity.description}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">{activity.date}</div>
                    {activity.status && (
                      <Badge className={`text-xs mt-1 ${getStatusColor(activity.status)}`}>
                        {getStatusText(activity.status)}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. تقدم المشاريع - تصميم تفاعلي */}
      <Card className="shadow-lg border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5 text-secondary" />
            تقدم المشاريع
          </CardTitle>
          <CardDescription>متابعة تفاعلية لحالة مشاريعك</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* المشاريع النشطة */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl"></div>
              <div className="relative p-6 text-center">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="100" strokeDashoffset="0" className="text-muted/30" />
                    <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="100" strokeDashoffset={100 - ((stats.activeProjects / Math.max(stats.totalProjects, 1)) * 100)} className="text-blue-500 transition-all duration-1000 ease-out" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">{stats.activeProjects}</div>
                <div className="text-sm text-muted-foreground">مشاريع نشطة</div>
                <div className="text-xs text-blue-600 mt-2">
                  {stats.totalProjects > 0 ? Math.round((stats.activeProjects / stats.totalProjects) * 100) : 0}% من الإجمالي
                </div>
              </div>
            </div>

            {/* المشاريع المكتملة */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl"></div>
              <div className="relative p-6 text-center">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="100" strokeDashoffset="0" className="text-muted/30" />
                    <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="100" strokeDashoffset={100 - ((stats.completedProjects / Math.max(stats.totalProjects, 1)) * 100)} className="text-green-500 transition-all duration-1000 ease-out" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">{stats.completedProjects}</div>
                <div className="text-sm text-muted-foreground">مشاريع مكتملة</div>
                <div className="text-xs text-green-600 mt-2">
                  {stats.totalProjects > 0 ? Math.round((stats.completedProjects / stats.totalProjects) * 100) : 0}% نسبة الإنجاز
                </div>
              </div>
            </div>

            {/* معدل الأداء */}
            <div className="relative group md:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl"></div>
              <div className="relative p-6 text-center">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="100" strokeDashoffset="0" className="text-muted/30" />
                    <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="100" strokeDashoffset={100 - (stats.totalProjects > 0 ? 98 : 0)} className="text-purple-500 transition-all duration-1000 ease-out" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Target className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-1">98%</div>
                <div className="text-sm text-muted-foreground">معدل الرضا</div>
                <div className="text-xs text-purple-600 mt-2">أداء ممتاز</div>
              </div>
            </div>
          </div>

          {/* شريط التقدم العام */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">التقدم الإجمالي للمشاريع</span>
              <span className="text-sm font-bold text-primary">
                {stats.totalProjects > 0 ? Math.round((stats.completedProjects / stats.totalProjects) * 100) : 0}%
              </span>
            </div>
            <Progress 
              value={stats.totalProjects > 0 ? (stats.completedProjects / stats.totalProjects) * 100 : 0} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. الإشعارات والتنبيهات - لحظية وحقيقية */}
      <NotificationsSection />
    </div>
  );
}