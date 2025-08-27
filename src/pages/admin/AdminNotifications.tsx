import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, 
  Search, 
  Eye, 
  Calendar,
  Mail,
  AlertCircle,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { ResponsiveCard } from '@/components/ResponsiveCard';

interface Notification {
  id: string;
  project_id: string;
  recipient_email: string;
  notification_type: string;
  title: string;
  message?: string;
  is_read: boolean;
  sent_via_email: boolean;
  created_at: string;
}

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('project_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "خطأ في جلب الإشعارات",
        description: "حدث خطأ أثناء جلب بيانات الإشعارات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('project_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, is_read: true }
          : notification
      ));

      toast({
        title: "تم تحديث الإشعار",
        description: "تم وضع علامة مقروء على الإشعار",
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "خطأ في تحديث الإشعار",
        description: "حدث خطأ أثناء تحديث حالة الإشعار",
        variant: "destructive",
      });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project_update': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'payment_received': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'project_completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'reminder': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'project_update': return 'تحديث مشروع';
      case 'payment_received': return 'استلام دفعة';
      case 'project_completed': return 'اكتمال مشروع';
      case 'urgent': return 'عاجل';
      case 'reminder': return 'تذكير';
      case 'system': return 'نظام';
      case 'user_action': return 'إجراء مستخدم';
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project_update': return <Eye className="h-4 w-4" />;
      case 'payment_received': return <CheckCircle className="h-4 w-4" />;
      case 'project_completed': return <CheckCircle className="h-4 w-4" />;
      case 'urgent': return <AlertCircle className="h-4 w-4" />;
      case 'reminder': return <Clock className="h-4 w-4" />;
      case 'system': return <Bell className="h-4 w-4" />;
      case 'user_action': return <Users className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.recipient_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || notification.notification_type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'read' && notification.is_read) ||
      (statusFilter === 'unread' && !notification.is_read);
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.is_read).length,
    emailSent: notifications.filter(n => n.sent_via_email).length,
    urgent: notifications.filter(n => n.notification_type === 'urgent').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">جارٍ تحميل الإشعارات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">إدارة الإشعارات</h1>
        <p className="text-muted-foreground">عرض وإدارة جميع إشعارات النظام</p>
      </div>

      {/* Stats Cards */}
      <ResponsiveGrid cols="1-2-4" gap="md" className="mb-6">
        <ResponsiveCard size="sm" className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">إجمالي الإشعارات</p>
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Bell className="h-6 w-6 text-primary" />
            </div>
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 dark:from-amber-900/10 dark:to-amber-900/20">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">غير مقروءة</p>
              <p className="text-2xl font-bold text-amber-600">{stats.unread}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg dark:bg-amber-900/20">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 dark:from-emerald-900/10 dark:to-emerald-900/20">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">مُرسلة بالإيميل</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.emailSent}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg dark:bg-emerald-900/20">
              <Mail className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 dark:from-red-900/10 dark:to-red-900/20">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">عاجلة</p>
              <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg dark:bg-red-900/20">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </ResponsiveCard>
      </ResponsiveGrid>

      {/* Filters and Search */}
      <ResponsiveCard>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="البحث في الإشعارات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
                dir="rtl"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="نوع الإشعار" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="project_update">تحديث مشروع</SelectItem>
                <SelectItem value="payment_received">استلام دفعة</SelectItem>
                <SelectItem value="project_completed">اكتمال مشروع</SelectItem>
                <SelectItem value="urgent">عاجل</SelectItem>
                <SelectItem value="reminder">تذكير</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="حالة القراءة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="unread">غير مقروءة</SelectItem>
                <SelectItem value="read">مقروءة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ResponsiveCard>

      {/* Notifications Grid */}
      {filteredNotifications.length === 0 ? (
        <ResponsiveCard className="text-center py-12">
          <div className="text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">لا توجد إشعارات</p>
            <p className="text-sm">لا توجد إشعارات تطابق معايير البحث</p>
          </div>
        </ResponsiveCard>
      ) : (
        <ResponsiveGrid cols="1-2-3" gap="md">
          {filteredNotifications.map((notification) => (
            <ResponsiveCard key={notification.id} className={`space-y-4 ${!notification.is_read ? 'border-l-4 border-l-primary' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="text-right flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(notification.notification_type)}
                    <h3 className={`font-semibold truncate ${!notification.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {notification.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{notification.recipient_email}</p>
                  {notification.message && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getTypeColor(notification.notification_type)}>{getTypeText(notification.notification_type)}</Badge>
                  {!notification.is_read && (
                    <Badge variant="secondary" className="text-xs">جديد</Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-xs">
                    {new Date(notification.created_at).toLocaleDateString('ar-SA')}
                  </span>
                </div>
                {notification.sent_via_email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-emerald-600" />
                    <span className="text-xs text-emerald-600">مُرسل بالإيميل</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 ml-2" />
                  عرض
                </Button>
                {!notification.is_read && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CheckCircle className="w-4 h-4 ml-2" />
                    وضع علامة مقروء
                  </Button>
                )}
              </div>
            </ResponsiveCard>
          ))}
        </ResponsiveGrid>
      )}
    </div>
  );
};

export default AdminNotifications;