import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { ResponsiveCard } from '@/components/ResponsiveCard';
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
  DollarSign
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
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'المشاريع المكتملة',
      value: stats.completedProjects,
      icon: CheckCircle,
      description: 'من إجمالي المشاريع',
      trend: '+8%',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'الفواتير المعلقة',
      value: stats.pendingInvoices,
      icon: FileText,
      description: 'تحتاج للمراجعة',
      trend: '-5%',
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'إجمالي الإنفاق',
      value: `${stats.totalSpent.toLocaleString()} ريال`,
      icon: DollarSign,
      description: 'هذا الشهر',
      trend: '+15%',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-lg p-6 border border-blue-200/50 dark:border-blue-800/50">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          مرحباً بك في لوحة تحكم العميل
        </h1>
        <p className="text-muted-foreground">
          تابع مشاريعك، فواتيرك، ومدفوعاتك من مكان واحد
        </p>
      </div>

      {/* Stats Cards */}
      <ResponsiveGrid cols="1-2-4" gap="md">
        {statsCards.map((card, index) => (
          <ResponsiveCard key={index} size="sm" className="overflow-hidden hover-scale">
            <div className={`h-2 bg-gradient-to-r ${card.color}`} />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color} shadow-lg`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">{card.value}</div>
                  <div className="text-sm text-muted-foreground">{card.title}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600 font-medium">{card.trend}</span>
                <span className="text-muted-foreground">{card.description}</span>
              </div>
            </div>
          </ResponsiveCard>
        ))}
      </ResponsiveGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                النشاطات الأخيرة
              </CardTitle>
              <CardDescription>
                آخر التحديثات على مشاريعك وفواتيرك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0">
                      {activity.type === 'project' && <Package className="w-5 h-5 text-blue-500" />}
                      {activity.type === 'invoice' && <FileText className="w-5 h-5 text-green-500" />}
                      {activity.type === 'message' && <MessageSquare className="w-5 h-5 text-purple-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-foreground truncate">{activity.title}</h4>
                        <span className="text-xs text-muted-foreground">{activity.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                      {activity.status && (
                        <Badge className={`mt-2 ${getStatusColor(activity.status)}`}>
                          {getStatusText(activity.status)}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {recentActivities.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    لا توجد نشاطات حديثة
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إجراءات سريعة</CardTitle>
              <CardDescription>
                الإجراءات الأكثر استخداماً
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/client/projects">
                  <Package className="w-4 h-4 mr-2" />
                  عرض جميع المشاريع
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/client/invoices">
                  <FileText className="w-4 h-4 mr-2" />
                  مراجعة الفواتير
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/client/support-tickets">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  طلب دعم فني
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/client/service-requests">
                  <Clock className="w-4 h-4 mr-2" />
                  طلب خدمة جديدة
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Project Progress */}
          {stats.activeProjects > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>تقدم المشاريع</CardTitle>
                <CardDescription>
                  المشاريع النشطة حالياً
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>تطوير الموقع</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>تصميم الهوية</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>التسويق الرقمي</span>
                      <span>90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}