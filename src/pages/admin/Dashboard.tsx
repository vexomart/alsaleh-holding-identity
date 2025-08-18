import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Building2, 
  Newspaper, 
  Briefcase, 
  Users, 
  Send,
  Eye,
  TrendingUp,
  Calendar,
  Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useOutletContext } from 'react-router-dom';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor';
}

interface DashboardStats {
  pages: { total: number; published: number };
  news: { total: number; published: number };
  subsidiaries: { total: number; published: number };
  jobs: { total: number; open: number };
  applications: { total: number; today: number };
  submissions: { total: number; today: number };
}

interface AuditLogEntry {
  id: string;
  action: string;
  target_table: string;
  created_at: string;
  admin_users: { name: string } | null;
}

export default function AdminDashboard() {
  const { user } = useOutletContext<{ user: AdminUser }>();
  const [stats, setStats] = useState<DashboardStats>({
    pages: { total: 0, published: 0 },
    news: { total: 0, published: 0 },
    subsidiaries: { total: 0, published: 0 },
    jobs: { total: 0, open: 0 },
    applications: { total: 0, today: 0 },
    submissions: { total: 0, today: 0 }
  });
  const [recentActivity, setRecentActivity] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load statistics
      const [
        pagesData,
        newsData,
        subsidiariesData,
        jobsData,
        applicationsData,
        submissionsData,
        auditData
      ] = await Promise.all([
        supabase.from('cms_pages').select('status'),
        supabase.from('cms_news').select('status'),
        supabase.from('cms_subsidiaries').select('status'),
        supabase.from('cms_jobs').select('status'),
        supabase.from('cms_applications').select('created_at'),
        supabase.from('cms_form_submissions').select('created_at'),
        supabase
          .from('cms_audit_log')
          .select('id, action, target_table, created_at, admin_users(name)')
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      const today = new Date().toISOString().split('T')[0];

      setStats({
        pages: {
          total: pagesData.data?.length || 0,
          published: pagesData.data?.filter(p => p.status === 'published').length || 0
        },
        news: {
          total: newsData.data?.length || 0,
          published: newsData.data?.filter(n => n.status === 'published').length || 0
        },
        subsidiaries: {
          total: subsidiariesData.data?.length || 0,
          published: subsidiariesData.data?.filter(s => s.status === 'published').length || 0
        },
        jobs: {
          total: jobsData.data?.length || 0,
          open: jobsData.data?.filter(j => j.status === 'open').length || 0
        },
        applications: {
          total: applicationsData.data?.length || 0,
          today: applicationsData.data?.filter(a => a.created_at.startsWith(today)).length || 0
        },
        submissions: {
          total: submissionsData.data?.length || 0,
          today: submissionsData.data?.filter(s => s.created_at.startsWith(today)).length || 0
        }
      });

      setRecentActivity(auditData.data || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'الصفحات',
      icon: FileText,
      total: stats.pages.total,
      active: stats.pages.published,
      color: 'text-blue-600'
    },
    {
      title: 'الأخبار',
      icon: Newspaper,
      total: stats.news.total,
      active: stats.news.published,
      color: 'text-green-600'
    },
    {
      title: 'الشركات التابعة',
      icon: Building2,
      total: stats.subsidiaries.total,
      active: stats.subsidiaries.published,
      color: 'text-purple-600'
    },
    {
      title: 'الوظائف',
      icon: Briefcase,
      total: stats.jobs.total,
      active: stats.jobs.open,
      color: 'text-orange-600'
    },
    {
      title: 'طلبات التوظيف',
      icon: Users,
      total: stats.applications.total,
      active: stats.applications.today,
      color: 'text-red-600',
      subtitle: 'اليوم'
    },
    {
      title: 'واردات النماذج',
      icon: Send,
      total: stats.submissions.total,
      active: stats.submissions.today,
      color: 'text-cyan-600',
      subtitle: 'اليوم'
    }
  ];

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      create: 'إنشاء',
      update: 'تحديث',
      delete: 'حذف',
      publish: 'نشر',
      unpublish: 'إلغاء نشر',
      login: 'تسجيل دخول'
    };
    return labels[action] || action;
  };

  const getTableLabel = (table: string) => {
    const labels: Record<string, string> = {
      cms_pages: 'الصفحات',
      cms_news: 'الأخبار',
      cms_subsidiaries: 'الشركات التابعة',
      cms_jobs: 'الوظائف',
      admin_users: 'المستخدمين'
    };
    return labels[table] || table;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">مرحباً، {user.name}</h1>
        <p className="text-muted-foreground">إليك نظرة سريعة على أنشطة الموقع</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.total}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Badge variant="secondary" className="mr-1">
                  {stat.active}
                </Badge>
                {stat.subtitle || 'منشور/نشط'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            النشاط الأخير
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">لا يوجد نشاط حديث</p>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {activity.admin_users?.name || 'مستخدم غير معروف'}
                      </span>
                      <Badge variant="outline">
                        {getActionLabel(activity.action)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {getTableLabel(activity.target_table)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.created_at).toLocaleString('ar-SA')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <FileText className="h-6 w-6" />
              صفحة جديدة
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Newspaper className="h-6 w-6" />
              خبر جديد
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Briefcase className="h-6 w-6" />
              وظيفة جديدة
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Eye className="h-6 w-6" />
              معاينة الموقع
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}