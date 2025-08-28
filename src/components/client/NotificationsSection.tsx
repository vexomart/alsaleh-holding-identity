import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, AlertCircle, Package, FileText, Clock, CreditCard } from 'lucide-react';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
import { Link } from 'react-router-dom';

export const NotificationsSection = () => {
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead, getNotificationIcon } = useRealtimeNotifications({
    showToasts: false // Don't show toasts in the dashboard section
  });

  const getNotificationColor = (type: string, isRead: boolean) => {
    const opacity = isRead ? '50' : '100';
    const bgOpacity = isRead ? '20' : '50';
    
    switch (type) {
      case 'project_started':
        return `bg-blue-${bgOpacity} border-blue-200 text-blue-${opacity === '50' ? '600' : '900'}`;
      case 'project_completed':
      case 'phase_completed':
        return `bg-green-${bgOpacity} border-green-200 text-green-${opacity === '50' ? '600' : '900'}`;
      case 'deadline_approaching':
        return `bg-yellow-${bgOpacity} border-yellow-200 text-yellow-${opacity === '50' ? '600' : '900'}`;
      case 'issue_reported':
        return `bg-red-${bgOpacity} border-red-200 text-red-${opacity === '50' ? '600' : '900'}`;
      case 'payment_completed':
      case 'invoice_generated':
        return `bg-purple-${bgOpacity} border-purple-200 text-purple-${opacity === '50' ? '600' : '900'}`;
      default:
        return `bg-gray-${bgOpacity} border-gray-200 text-gray-${opacity === '50' ? '600' : '900'}`;
    }
  };

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

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'الآن';
    } else if (diffInHours < 24) {
      return `منذ ${diffInHours} ساعة`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `منذ ${diffInDays} يوم`;
    }
  };

  const recentNotifications = notifications.slice(0, 3);

  if (loading) {
    return (
      <Card className="shadow-lg border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="w-5 h-5 text-warning animate-pulse" />
            الإشعارات والتنبيهات
          </CardTitle>
          <CardDescription>جارٍ تحميل الإشعارات...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="w-16 h-4 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-warning" />
            الإشعارات والتنبيهات
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs"
            >
              قراءة الكل
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          التحديثات اللحظية لمشاريعك والخدمات
          {notifications.length > 0 && (
            <span className="text-primary"> • {notifications.length} إشعار إجمالي</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recentNotifications.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted/30 rounded-full flex items-center justify-center">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-2">لا توجد إشعارات</p>
            <p className="text-sm text-muted-foreground">سيظهر هنا آخر التحديثات عند توفرها</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentNotifications.map((notification) => {
              const IconComponent = getNotificationTypeIcon(notification.notification_type);
              return (
                <div 
                  key={notification.id} 
                  className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity ${getNotificationColor(notification.notification_type, notification.is_read)}`}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                >
                  <div className={`p-2 rounded-lg ${notification.is_read ? 'bg-muted/50' : 'bg-current/20'}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-right">
                    <div className={`font-medium text-sm ${!notification.is_read ? 'font-semibold' : ''}`}>
                      {notification.title}
                    </div>
                    {notification.message && (
                      <div className="text-xs opacity-75 line-clamp-1">
                        {notification.message}
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="text-xs opacity-75">
                      {getRelativeTime(notification.created_at)}
                    </div>
                    {!notification.is_read && (
                      <Badge className="text-xs mt-1 bg-current/20 text-current border-current/30">
                        جديد
                      </Badge>
                    )}
                    {notification.sent_via_email && (
                      <div className="text-xs opacity-60 mt-1">
                        📧 مُرسل
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t text-center">
          <Link to="/client/notifications">
            <Button variant="outline" size="sm" className="text-sm">
              <Bell className="w-4 h-4 ml-2" />
              عرض جميع الإشعارات
              {notifications.length > 3 && (
                <Badge variant="secondary" className="mr-2">
                  +{notifications.length - 3}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};