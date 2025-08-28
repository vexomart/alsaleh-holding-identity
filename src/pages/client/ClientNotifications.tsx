import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, 
  Search, 
  CheckCircle, 
  Package, 
  FileText, 
  Clock,
  AlertCircle,
  CreditCard,
  Filter,
  Calendar
} from 'lucide-react';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';

const ClientNotifications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { 
    notifications, 
    loading, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    getNotificationIcon 
  } = useRealtimeNotifications();

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case 'project_started':
      case 'project_completed':
      case 'phase_completed':
        return Package;
      case 'payment_completed':
      case 'invoice_generated':
        return CreditCard;
      case 'deadline_approaching':
        return Clock;
      case 'issue_reported':
        return AlertCircle;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string, isRead: boolean) => {
    const opacity = isRead ? 'muted' : 'foreground';
    
    switch (type) {
      case 'project_started':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/10';
      case 'project_completed':
      case 'phase_completed':
        return 'bg-green-50 border-green-200 dark:bg-green-900/10';
      case 'deadline_approaching':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/10';
      case 'issue_reported':
        return 'bg-red-50 border-red-200 dark:bg-red-900/10';
      case 'payment_completed':
      case 'invoice_generated':
        return 'bg-purple-50 border-purple-200 dark:bg-purple-900/10';
      default:
        return 'bg-muted/20 border-border';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'project_started': return 'بدء مشروع';
      case 'project_completed': return 'اكتمال مشروع';
      case 'phase_completed': return 'اكتمال مرحلة';
      case 'status_change': return 'تغيير حالة';
      case 'deadline_approaching': return 'موعد قريب';
      case 'issue_reported': return 'تقرير مشكلة';
      case 'payment_completed': return 'اكتمال دفع';
      case 'invoice_generated': return 'فاتورة جديدة';
      default: return type;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || notification.notification_type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'read' && notification.is_read) ||
      (statusFilter === 'unread' && !notification.is_read);
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">جارٍ تحميل الإشعارات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">إشعاراتي</h1>
          <p className="text-muted-foreground">تتبع جميع التحديثات والإشعارات المهمة</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {unreadCount} جديد
            </Badge>
          )}
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} size="sm">
              <CheckCircle className="w-4 h-4 ml-2" />
              قراءة الكل
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">إجمالي الإشعارات</p>
                <p className="text-2xl font-bold text-primary">{notifications.length}</p>
              </div>
              <Bell className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 dark:from-amber-900/10 dark:to-amber-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">غير مقروءة</p>
                <p className="text-2xl font-bold text-amber-600">{unreadCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/10 dark:to-green-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">مقروءة</p>
                <p className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/10 dark:to-blue-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">اليوم</p>
                <p className="text-2xl font-bold text-blue-600">
                  {notifications.filter(n => 
                    new Date(n.created_at).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
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
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="نوع الإشعار" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="project_started">بدء مشروع</SelectItem>
                <SelectItem value="project_completed">اكتمال مشروع</SelectItem>
                <SelectItem value="phase_completed">اكتمال مرحلة</SelectItem>
                <SelectItem value="payment_completed">اكتمال دفع</SelectItem>
                <SelectItem value="invoice_generated">فاتورة جديدة</SelectItem>
                <SelectItem value="deadline_approaching">موعد قريب</SelectItem>
                <SelectItem value="issue_reported">تقرير مشكلة</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="حالة القراءة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="unread">غير مقروءة</SelectItem>
                <SelectItem value="read">مقروءة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">لا توجد إشعارات</h3>
            <p className="text-muted-foreground">
              {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' 
                ? 'لا توجد إشعارات تطابق معايير البحث' 
                : 'لم تتلق أي إشعارات بعد'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const IconComponent = getNotificationTypeIcon(notification.notification_type);
            return (
              <Card 
                key={notification.id} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  !notification.is_read ? 'border-r-4 border-r-primary' : ''
                } ${getNotificationColor(notification.notification_type, notification.is_read)}`}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      notification.is_read ? 'bg-muted/50' : 'bg-current/20'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 text-right">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {getTypeText(notification.notification_type)}
                          </Badge>
                          {!notification.is_read && (
                            <Badge variant="destructive" className="text-xs">
                              جديد
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <h3 className={`font-semibold mb-1 ${
                        !notification.is_read ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {notification.title}
                      </h3>
                      
                      {notification.message && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {notification.message}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span>
                            {new Date(notification.created_at).toLocaleDateString('ar-SA', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {notification.sent_via_email && (
                            <span className="text-green-600">📧 مُرسل بالإيميل</span>
                          )}
                        </div>
                        
                        {!notification.is_read && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                          >
                            <CheckCircle className="w-4 h-4 ml-1" />
                            وضع علامة مقروء
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClientNotifications;