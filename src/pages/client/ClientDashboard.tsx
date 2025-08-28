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
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-primary/5 p-4 lg:p-8">
        <div className="container mx-auto space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 lg:p-8">
                  <div className="h-20 lg:h-24 bg-muted rounded-xl"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'إجمالي المشاريع',
      value: stats.totalProjects,
      icon: Package,
      description: `${stats.activeProjects} قيد التنفيذ`,
      trend: stats.totalProjects > 0 ? '+' + Math.round((stats.activeProjects / stats.totalProjects) * 100) + '%' : '0%',
      trendIcon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      title: 'المشاريع المكتملة',
      value: stats.completedProjects,
      icon: CheckCircle,
      description: 'من إجمالي المشاريع',
      trend: stats.totalProjects > 0 ? '+' + Math.round((stats.completedProjects / stats.totalProjects) * 100) + '%' : '0%',
      trendIcon: Target,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      title: 'الفواتير المعلقة',
      value: stats.pendingInvoices,
      icon: FileText,
      description: stats.pendingInvoices > 0 ? 'تحتاج للمراجعة' : 'لا توجد فواتير معلقة',
      trend: stats.pendingInvoices > 0 ? 'معلق' : 'محدث',
      trendIcon: stats.pendingInvoices > 0 ? AlertCircle : CheckCircle,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30',
      borderColor: 'border-orange-200 dark:border-orange-800'
    },
    {
      title: 'إجمالي الاستثمار',
      value: `${stats.totalSpent.toLocaleString()} ريال`,
      icon: DollarSign,
      description: 'إجمالي المدفوعات',
      trend: stats.totalSpent > 0 ? 'نشط' : 'لا توجد مدفوعات',
      trendIcon: stats.totalSpent > 0 ? BarChart3 : DollarSign,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
      borderColor: 'border-purple-200 dark:border-purple-800'
    }
  ];

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
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-primary/5 dark:from-background dark:via-card/30 dark:to-primary/5 font-corporate">
      <div className="container mx-auto p-4 lg:p-8 space-y-6 lg:space-y-8">
        {/* Executive Client Portal Header */}
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
                    <Award className="w-4 lg:w-5 h-4 lg:h-5 ml-2" />
                    Client Executive Portal
                  </Badge>
                  <Badge variant="outline" className="px-3 lg:px-4 py-1.5 lg:py-2 bg-success/10 border-success/30 text-success hover:bg-success/20 transition-all duration-300 animate-scale-in delay-200">
                    <Shield className="w-3 lg:w-4 h-3 lg:h-4 ml-2" />
                    حساب محقق ومتميز
                  </Badge>
                </div>
                
                <div className="space-y-3 lg:space-y-4">
                  <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight animate-fade-in delay-300">
                    بوابة العميل التنفيذية
                  </h1>
                  <p className="text-base lg:text-lg xl:text-xl text-muted-foreground max-w-3xl mx-auto lg:mx-0 leading-relaxed animate-fade-in delay-400">
                    منصة إدارة متطورة بتقنيات عالمية لمتابعة مشاريعك والخدمات المالية بكفاءة احترافية
                  </p>
                </div>
                
                {/* Performance Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 animate-fade-in delay-500">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-3 lg:p-4 rounded-2xl border border-primary/20 backdrop-blur-sm">
                    <div className="text-xl lg:text-2xl xl:text-3xl font-bold text-primary mb-1">
                      <NumberFormatter number={stats.totalProjects} />
                    </div>
                    <div className="text-xs lg:text-sm text-muted-foreground font-medium">مشاريع إجمالية</div>
                  </div>
                  <div className="bg-gradient-to-br from-success/10 to-success/5 p-3 lg:p-4 rounded-2xl border border-success/20 backdrop-blur-sm">
                    <div className="text-xl lg:text-2xl xl:text-3xl font-bold text-success mb-1">
                      <NumberFormatter number={stats.completedProjects} />
                    </div>
                    <div className="text-xs lg:text-sm text-muted-foreground font-medium">مشاريع مكتملة</div>
                  </div>
                  <div className="bg-gradient-to-br from-accent/10 to-accent/5 p-3 lg:p-4 rounded-2xl border border-accent/20 backdrop-blur-sm">
                    <div className="text-lg lg:text-xl xl:text-2xl font-bold text-accent mb-1">
                      <NumberFormatter number={stats.totalSpent} suffix="K" />
                    </div>
                    <div className="text-xs lg:text-sm text-muted-foreground font-medium">إجمالي الاستثمار</div>
                  </div>
                  <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 p-3 lg:p-4 rounded-2xl border border-secondary/20 backdrop-blur-sm">
                    <div className="text-xl lg:text-2xl xl:text-3xl font-bold text-secondary mb-1">
                      {stats.totalProjects > 0 ? Math.round((stats.completedProjects / stats.totalProjects) * 100) : 0}%
                    </div>
                    <div className="text-xs lg:text-sm text-muted-foreground font-medium">معدل الإنجاز</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-4 lg:gap-6 animate-fade-in delay-600">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary rounded-full blur-lg opacity-60 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-primary via-accent to-secondary p-6 lg:p-8 rounded-full shadow-2xl">
                    <Users className="w-12 lg:w-16 h-12 lg:h-16 text-white animate-float" />
                  </div>
                </div>
                
                <div className="text-center space-y-2 lg:space-y-3">
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-2 lg:w-3 h-2 lg:h-3 bg-success rounded-full animate-pulse"></div>
                    <span className="text-xs lg:text-sm font-semibold text-success">متصل - نشط</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <Star className="w-3 lg:w-4 h-3 lg:h-4 text-secondary" />
                    <span className="text-xs lg:text-sm font-medium text-muted-foreground">مستوى VIP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Executive Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {statsCards.map((card, index) => (
            <Card 
              key={index}
              className={`group relative overflow-hidden border-2 ${card.borderColor} ${card.bgColor} transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer animate-fade-in`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-24 lg:w-32 h-24 lg:h-32 opacity-20">
                <div className={`w-full h-full bg-gradient-to-br ${card.color} rounded-full blur-3xl transform rotate-45 group-hover:scale-150 transition-transform duration-700`}></div>
              </div>
              
              <CardContent className="relative z-10 p-4 lg:p-6 xl:p-8">
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <div className={`p-3 lg:p-4 xl:p-5 rounded-2xl bg-gradient-to-br ${card.color} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <card.icon className="w-6 lg:w-8 xl:w-10 h-6 lg:h-8 xl:h-10 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground mb-1 group-hover:scale-110 transition-transform duration-300">
                      {typeof card.value === 'number' ? (
                        <NumberFormatter number={card.value} />
                      ) : (
                        card.value
                      )}
                    </div>
                    <div className="text-xs lg:text-sm xl:text-base font-medium text-muted-foreground">{card.title}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <div className="flex items-center gap-1 lg:gap-2">
                    <card.trendIcon className={`w-3 lg:w-4 h-3 lg:h-4 ${
                      card.trend.includes('+') ? 'text-success' : 
                      card.trend.includes('-') ? 'text-destructive' : 
                      'text-muted-foreground'
                    }`} />
                    <span className={`text-xs lg:text-sm font-bold ${
                      card.trend.includes('+') ? 'text-success' : 
                      card.trend.includes('-') ? 'text-destructive' : 
                      'text-muted-foreground'
                    }`}>{card.trend}</span>
                  </div>
                  <span className="text-xs lg:text-sm text-muted-foreground">{card.description}</span>
                </div>
                
                <div className="h-1 lg:h-2 bg-muted/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${card.color} rounded-full transition-all duration-1000 group-hover:animate-pulse`}
                    style={{ 
                      width: `${
                        card.title === 'إجمالي المشاريع' ? Math.min((stats.totalProjects / 10) * 100, 100) :
                        card.title === 'المشاريع المكتملة' ? Math.min((stats.completedProjects / stats.totalProjects) * 100 || 0, 100) :
                        card.title === 'الفواتير المعلقة' ? Math.min((stats.pendingInvoices / 5) * 100, 100) :
                        card.title === 'إجمالي الاستثمار' ? Math.min((stats.totalSpent / 100000) * 100, 100) :
                        0
                      }%`
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Enhanced Recent Activities */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/95 backdrop-blur-sm animate-fade-in delay-200">
              <CardHeader className="pb-4 lg:pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
                    <div className="p-2 lg:p-3 rounded-xl bg-gradient-to-br from-primary to-secondary">
                      <Activity className="w-5 lg:w-6 h-5 lg:h-6 text-white" />
                    </div>
                    النشاطات الأخيرة والتحديثات
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 text-xs lg:text-sm">
                    عرض الكل
                    <Clock className="w-3 lg:w-4 h-3 lg:h-4 mr-2" />
                  </Button>
                </div>
                <CardDescription className="text-sm lg:text-base">
                  تتبع مباشر لجميع العمليات والتحديثات على حسابك
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 lg:space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div 
                      key={activity.id} 
                      className={`group relative p-4 lg:p-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer animate-fade-in`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start gap-3 lg:gap-4">
                        <div className="flex-shrink-0">
                          <div className={`p-2 lg:p-3 rounded-xl transition-transform group-hover:scale-110 ${
                            activity.type === 'project' ? 'bg-blue-100 dark:bg-blue-900/30' :
                            activity.type === 'invoice' ? 'bg-green-100 dark:bg-green-900/30' :
                            'bg-purple-100 dark:bg-purple-900/30'
                          }`}>
                            {activity.type === 'project' && <Package className="w-5 lg:w-6 h-5 lg:h-6 text-blue-600" />}
                            {activity.type === 'invoice' && <FileText className="w-5 lg:w-6 h-5 lg:h-6 text-green-600" />}
                            {activity.type === 'message' && <MessageSquare className="w-5 lg:w-6 h-5 lg:h-6 text-purple-600" />}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-base lg:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                              {activity.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 lg:w-4 h-3 lg:h-4 text-muted-foreground" />
                              <span className="text-xs lg:text-sm font-medium text-muted-foreground">{activity.date}</span>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-3 text-sm lg:text-base">{activity.description}</p>
                          {activity.status && (
                            <div className="flex items-center gap-2">
                              <Badge className={`px-2 lg:px-3 py-1 font-medium text-xs lg:text-sm border ${getStatusColor(activity.status)}`}>
                                {getStatusText(activity.status)}
                              </Badge>
                              <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {recentActivities.length === 0 && (
                    <div className="text-center py-8 lg:py-12">
                      <Activity className="w-12 lg:w-16 h-12 lg:h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground text-sm lg:text-base">لا توجد أنشطة حديثة</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Services */}
          <div className="space-y-6 lg:space-y-8">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/95 backdrop-blur-sm animate-fade-in delay-300">
              <CardHeader className="pb-4 lg:pb-6">
                <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
                  <div className="p-2 lg:p-3 rounded-xl bg-gradient-to-br from-accent to-primary">
                    <Zap className="w-5 lg:w-6 h-5 lg:h-6 text-white" />
                  </div>
                  إجراءات سريعة
                </CardTitle>
                <CardDescription className="text-sm lg:text-base">
                  الوصول السريع للخدمات المهمة
                </CardDescription>
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
                      <div className={`p-2 lg:p-3 rounded-xl bg-gradient-to-br ${action.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="w-4 lg:w-5 h-4 lg:h-5 text-white" />
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

            {/* Project Progress */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/95 backdrop-blur-sm animate-fade-in delay-400">
              <CardHeader className="pb-4 lg:pb-6">
                <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
                  <div className="p-2 lg:p-3 rounded-xl bg-gradient-to-br from-secondary to-accent">
                    <PieChart className="w-5 lg:w-6 h-5 lg:h-6 text-white" />
                  </div>
                  تقدم المشاريع
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 lg:space-y-6">
                <div className="space-y-3 lg:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm lg:text-base font-medium">المشاريع النشطة</span>
                    <span className="text-xs lg:text-sm text-muted-foreground">{stats.activeProjects} من {stats.totalProjects}</span>
                  </div>
                  <Progress value={(stats.activeProjects / Math.max(stats.totalProjects, 1)) * 100} className="h-2 lg:h-3" />
                </div>
                
                <div className="space-y-3 lg:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm lg:text-base font-medium">معدل الإنجاز</span>
                    <span className="text-xs lg:text-sm text-muted-foreground">{stats.completedProjects} من {stats.totalProjects}</span>
                  </div>
                  <Progress value={(stats.completedProjects / Math.max(stats.totalProjects, 1)) * 100} className="h-2 lg:h-3" />
                </div>
                
                <div className="space-y-3 lg:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm lg:text-base font-medium">معدل الرضا</span>
                    <span className="text-xs lg:text-sm text-muted-foreground">98%</span>
                  </div>
                  <Progress value={98} className="h-2 lg:h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/95 backdrop-blur-sm animate-fade-in delay-500">
              <CardHeader className="pb-4 lg:pb-6">
                <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
                  <div className="p-2 lg:p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                    <Bell className="w-5 lg:w-6 h-5 lg:h-6 text-white" />
                  </div>
                  الإشعارات والتنبيهات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 lg:space-y-4">
                <div className="p-3 lg:p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 lg:w-5 h-4 lg:h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-xs lg:text-sm font-medium text-blue-800 dark:text-blue-200">تم اعتماد مشروعك الجديد</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">منذ ساعتين</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 lg:p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 lg:w-5 h-4 lg:h-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-xs lg:text-sm font-medium text-green-800 dark:text-green-200">تم إيداع 1,500 ريال في محفظتك</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">اليوم</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 lg:p-4 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-4 lg:w-5 h-4 lg:h-5 text-orange-600" />
                    <div className="flex-1">
                      <p className="text-xs lg:text-sm font-medium text-orange-800 dark:text-orange-200">فاتورة جديدة تحتاج للمراجعة</p>
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">منذ يوم</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}