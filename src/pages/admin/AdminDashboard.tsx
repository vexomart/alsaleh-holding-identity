import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    totalClients: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    pendingTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
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
        .select('amount, status')
        .eq('status', 'COMPLETED');

      if (projectsError) throw projectsError;
      if (clientsError) throw clientsError;
      if (paymentsError) throw paymentsError;

      // Calculate stats
      const totalRevenue = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
      const activeProjects = projects?.filter(p => p.status === 'in_progress').length || 0;

      setStats({
        totalProjects: projects?.length || 0,
        activeProjects,
        totalClients: clients?.length || 0,
        totalRevenue,
        monthlyGrowth: 12.5, // This would be calculated based on historical data
        pendingTasks: Math.floor(Math.random() * 10) + 5, // Mock data
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

  const statsCards = [
    {
      title: 'إجمالي المشاريع',
      value: stats.totalProjects,
      change: '+12%',
      changeType: 'positive',
      icon: Package,
      color: 'blue',
    },
    {
      title: 'المشاريع النشطة',
      value: stats.activeProjects,
      change: '+8%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'green',
    },
    {
      title: 'العملاء',
      value: stats.totalClients,
      change: '+15%',
      changeType: 'positive',
      icon: Users,
      color: 'purple',
    },
    {
      title: 'الإيرادات',
      value: `${stats.totalRevenue.toLocaleString()} ر.س`,
      change: '+22%',
      changeType: 'positive',
      icon: CreditCard,
      color: 'orange',
    },
  ];

  const recentActivities = [
    { id: 1, type: 'project', title: 'تم إنشاء مشروع جديد: تطوير موقع تجاري', time: 'منذ ساعتين', status: 'success' },
    { id: 2, type: 'payment', title: 'تم استلام دفعة مالية بقيمة 25,000 ر.س', time: 'منذ 3 ساعات', status: 'success' },
    { id: 3, type: 'client', title: 'عميل جديد: شركة التقنيات المتطورة', time: 'منذ 5 ساعات', status: 'info' },
    { id: 4, type: 'task', title: 'مهمة معلقة: مراجعة التصميم النهائي', time: 'منذ يوم', status: 'warning' },
    { id: 5, type: 'project', title: 'تم إكمال مشروع: نظام إدارة المخزون', time: 'منذ يومين', status: 'success' },
  ];

  const quickActions = [
    { title: 'إضافة مشروع جديد', description: 'إنشاء مشروع جديد للعملاء', action: '/admin-projects' },
    { title: 'إدارة العملاء', description: 'عرض وإدارة قائمة العملاء', action: '/admin-clients' },
    { title: 'تقارير الأداء', description: 'عرض تقارير مفصلة عن الأداء', action: '/admin-analytics' },
    { title: 'إعدادات النظام', description: 'تخصيص إعدادات النظام', action: '/admin-settings' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div className="text-right">
          <h1 className="text-3xl font-bold text-foreground">مرحباً بك في لوحة الإدارة</h1>
          <p className="text-muted-foreground mt-2">نظرة شاملة على أداء الشركة والمشاريع النشطة</p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          آخر تحديث: الآن
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden transition-all duration-200 hover:shadow-lg border-0 bg-gradient-to-br from-background to-background/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2 justify-end">
                    {stat.changeType === 'positive' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-right">
              <Clock className="h-5 w-5" />
              النشاطات الأخيرة
            </CardTitle>
            <CardDescription className="text-right">آخر الأحداث والتحديثات في النظام</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className={`p-2 rounded-lg ${
                    activity.status === 'success' ? 'bg-green-100 dark:bg-green-900/20' :
                    activity.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                    'bg-blue-100 dark:bg-blue-900/20'
                  }`}>
                    {activity.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : activity.status === 'warning' ? (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-right">
              <BarChart3 className="h-5 w-5" />
              إجراءات سريعة
            </CardTitle>
            <CardDescription className="text-right">الوصول السريع للمهام الأساسية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full h-auto p-4 justify-start text-right"
                  onClick={() => window.location.href = action.action}
                >
                  <div className="text-right">
                    <p className="font-medium text-sm">{action.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">نظرة عامة على التقدم</CardTitle>
          <CardDescription className="text-right">ملخص سريع لحالة المشاريع والأهداف الشهرية</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>75%</span>
                <span>إكمال المشاريع</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>92%</span>
                <span>رضا العملاء</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>68%</span>
                <span>الهدف الشهري</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;