import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { ResponsiveCard } from '@/components/ResponsiveCard';
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
  Sparkles
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

      // Fetch projects data
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id);

      // Fetch invoices data
      const { data: invoices } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id);

      // Calculate stats
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

      // Generate recent activities
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
      'pending': 'bg-yellow-100 text-yellow-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'إجمالي المشاريع',
      value: stats.totalProjects,
      icon: Package,
      description: `${stats.activeProjects} قيد التنفيذ`,
      trend: '+12%',
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
      trend: '+8%',
      trendIcon: Target,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      title: 'الفواتير المعلقة',
      value: stats.pendingInvoices,
      icon: FileText,
      description: 'تحتاج للمراجعة',
      trend: '-5%',
      trendIcon: AlertCircle,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30',
      borderColor: 'border-orange-200 dark:border-orange-800'
    },
    {
      title: 'إجمالي الإنفاق',
      value: `${stats.totalSpent.toLocaleString()} ريال`,
      icon: DollarSign,
      description: 'هذا الشهر',
      trend: '+15%',
      trendIcon: BarChart3,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    {
      title: 'المحفظة الإلكترونية',
      value: '2,500 ريال',
      icon: Wallet,
      description: 'الرصيد المتاح',
      trend: '+3%',
      trendIcon: Activity,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
      borderColor: 'border-indigo-200 dark:border-indigo-800'
    },
    {
      title: 'نقاط المكافآت',
      value: '1,850 نقطة',
      icon: Gift,
      description: 'قابلة للاستبدال',
      trend: '+22%',
      trendIcon: Star,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-950/30',
      borderColor: 'border-pink-200 dark:border-pink-800'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30 font-cairo">
      <div className="space-y-8 p-6">
        {/* Enhanced Welcome Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-secondary/5 rounded-2xl"></div>
          <div className="absolute top-4 right-4 text-primary/20">
            <Sparkles className="w-12 h-12 animate-pulse" />
          </div>
          <div className="relative p-8 rounded-2xl border border-primary/20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg animate-bounce">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                  مرحباً بك في لوحة تحكم العميل المتطورة
                </h1>
                <p className="text-lg text-muted-foreground">
                  إدارة شاملة ومتقدمة لجميع مشاريعك وخدماتك المالية بتقنية عالية
                </p>
              </div>
            </div>
            
            {/* Achievement Badges */}
            <div className="flex flex-wrap gap-3 mb-4">
              <Badge variant="secondary" className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300">
                <Award className="w-4 h-4 mr-1" />
                عميل متميز
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300">
                <Shield className="w-4 h-4 mr-1" />
                حساب محقق
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300">
                <Star className="w-4 h-4 mr-1" />
                تقييم عالي
              </Badge>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-3 rounded-lg bg-white/70 dark:bg-gray-800/70 border border-primary/10">
                <div className="text-2xl font-bold text-primary">
                  <NumberFormatter number={stats.totalProjects} />
                </div>
                <div className="text-sm text-muted-foreground">مشاريع إجمالية</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/70 dark:bg-gray-800/70 border border-green-200">
                <div className="text-2xl font-bold text-green-600">
                  <NumberFormatter number={stats.completedProjects} />
                </div>
                <div className="text-sm text-muted-foreground">مشاريع مكتملة</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/70 dark:bg-gray-800/70 border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">
                  <NumberFormatter number={stats.totalSpent} suffix=" ريال" />
                </div>
                <div className="text-sm text-muted-foreground">إجمالي الإنفاق</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/70 dark:bg-gray-800/70 border border-orange-200">
                <div className="text-2xl font-bold text-orange-600">98%</div>
                <div className="text-sm text-muted-foreground">معدل الرضا</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <ResponsiveGrid cols="1-2-3" gap="lg" className="mt-8">
          {statsCards.map((card, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-2xl border ${card.borderColor} ${card.bgColor} p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/10 cursor-pointer`}
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <div className={`w-full h-full bg-gradient-to-br ${card.color} rounded-full blur-3xl`}></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${card.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-foreground mb-1 animate-fade-in">
                      {typeof card.value === 'number' ? (
                        <NumberFormatter number={card.value} />
                      ) : (
                        card.value
                      )}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">{card.title}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <card.trendIcon className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-bold text-green-600">{card.trend}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{card.description}</span>
                </div>
                
                {/* Progress Indicator */}
                <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${card.color} rounded-full transition-all duration-1000 animate-[scale-in_1s_ease-out]`}
                    style={{ width: `${Math.min(Math.random() * 100 + 20, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </ResponsiveGrid>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Recent Activities */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    النشاطات الأخيرة والتحديثات
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                    عرض الكل
                    <Clock className="w-4 h-4 mr-2" />
                  </Button>
                </div>
                <CardDescription className="text-lg">
                  تتبع مباشر لجميع العمليات والتحديثات على حسابك
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div 
                      key={activity.id} 
                      className={`group relative p-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer animate-fade-in`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${
                            activity.type === 'project' ? 'bg-blue-100 dark:bg-blue-900/30' :
                            activity.type === 'invoice' ? 'bg-green-100 dark:bg-green-900/30' :
                            'bg-purple-100 dark:bg-purple-900/30'
                          }`}>
                            {activity.type === 'project' && <Package className="w-6 h-6 text-blue-600" />}
                            {activity.type === 'invoice' && <FileText className="w-6 h-6 text-green-600" />}
                            {activity.type === 'message' && <MessageSquare className="w-6 h-6 text-purple-600" />}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                              {activity.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium text-muted-foreground">{activity.date}</span>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-3 text-base">{activity.description}</p>
                          {activity.status && (
                            <div className="flex items-center gap-2">
                              <Badge className={`px-3 py-1 font-medium ${getStatusColor(activity.status)}`}>
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
                    <div className="text-center py-12">
                      <div className="p-4 rounded-full bg-muted inline-block mb-4">
                        <Bell className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">لا توجد نشاطات حديثة</h3>
                      <p className="text-muted-foreground">ستظهر هنا جميع التحديثات والنشاطات الجديدة</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Quick Actions & Services */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  إجراءات سريعة ومتطورة
                </CardTitle>
                <CardDescription className="text-base">
                  الخدمات والإجراءات الأكثر استخداماً بواجهة محدثة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full justify-start h-14 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300" variant="default">
                  <Link to="/client/projects">
                    <Package className="w-5 h-5 mr-3" />
                    عرض جميع المشاريع
                    <div className="mr-auto">
                      <Badge variant="secondary" className="bg-white/20 text-white border-0">
                        {stats.totalProjects}
                      </Badge>
                    </div>
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start h-14 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300" variant="default">
                  <Link to="/client/invoices">
                    <FileText className="w-5 h-5 mr-3" />
                    مراجعة الفواتير
                    <div className="mr-auto">
                      <Badge variant="secondary" className="bg-white/20 text-white border-0">
                        {stats.pendingInvoices}
                      </Badge>
                    </div>
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start h-14 text-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300" variant="default">
                  <Link to="/client/support-tickets">
                    <MessageSquare className="w-5 h-5 mr-3" />
                    طلب دعم فني متقدم
                    <div className="mr-auto">
                      <Badge variant="secondary" className="bg-white/20 text-white border-0">
                        جديد
                      </Badge>
                    </div>
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start h-14 text-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300" variant="default">
                  <Link to="/client/service-requests">
                    <Clock className="w-5 h-5 mr-3" />
                    طلب خدمة جديدة
                    <div className="mr-auto">
                      <Badge variant="secondary" className="bg-white/20 text-white border-0">
                        سريع
                      </Badge>
                    </div>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Project Progress */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  تقدم المشاريع النشطة
                </CardTitle>
                <CardDescription className="text-base">
                  متابعة مفصلة لتقدم جميع مشاريعك الحالية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-blue-600" />
                        <span className="font-bold text-blue-800 dark:text-blue-200">تطوير الموقع الإلكتروني</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-blue-600">75%</span>
                        <Badge variant="secondary" className="bg-blue-200 text-blue-800">نشط</Badge>
                      </div>
                    </div>
                    <Progress value={75} className="h-3 bg-blue-200" />
                    <div className="flex justify-between text-sm text-blue-600 mt-2">
                      <span>المرحلة: التطوير الأساسي</span>
                      <span>متبقي: 3 أسابيع</span>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-green-600" />
                        <span className="font-bold text-green-800 dark:text-green-200">تصميم الهوية التجارية</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-green-600">45%</span>
                        <Badge variant="secondary" className="bg-green-200 text-green-800">جديد</Badge>
                      </div>
                    </div>
                    <Progress value={45} className="h-3 bg-green-200" />
                    <div className="flex justify-between text-sm text-green-600 mt-2">
                      <span>المرحلة: المراجعة والتعديل</span>
                      <span>متبقي: 5 أيام</span>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        <span className="font-bold text-purple-800 dark:text-purple-200">التسويق الرقمي المتقدم</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-purple-600">90%</span>
                        <Badge variant="secondary" className="bg-purple-200 text-purple-800">شبه مكتمل</Badge>
                      </div>
                    </div>
                    <Progress value={90} className="h-3 bg-purple-200" />
                    <div className="flex justify-between text-sm text-purple-600 mt-2">
                      <span>المرحلة: التحليل النهائي</span>
                      <span>متبقي: يومان</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications Panel */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary relative">
                    <Bell className="w-6 h-6 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                  التنبيهات والإشعارات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200">
                  <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">فاتورة جديدة تحتاج للمراجعة</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">تم اكتمال مرحلة من مشروعك</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <Gift className="w-4 h-4" />
                    <span className="text-sm font-medium">حصلت على 50 نقطة مكافأة</span>
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