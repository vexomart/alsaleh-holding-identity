import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  DollarSign,
  Users,
  FileText,
  Settings,
  X,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'alert' | 'transaction';
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Investment Growth',
    titleAr: 'نمو الاستثمار',
    message: 'Your portfolio has grown by 15% this quarter',
    messageAr: 'نمت محفظتك بنسبة 15% هذا الربع',
    time: '5 mins ago',
    read: false,
  },
  {
    id: '2',
    type: 'transaction',
    title: 'New Transaction',
    titleAr: 'معاملة جديدة',
    message: 'Payment of $50,000 received successfully',
    messageAr: 'تم استلام دفعة بقيمة 50,000 دولار بنجاح',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'warning',
    title: 'Security Alert',
    titleAr: 'تنبيه أمني',
    message: 'New login detected from New York, USA',
    messageAr: 'تم اكتشاف تسجيل دخول جديد من نيويورك، الولايات المتحدة',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '4',
    type: 'info',
    title: 'Report Ready',
    titleAr: 'التقرير جاهز',
    message: 'Q4 2024 Financial Report is now available',
    messageAr: 'تقرير الربع الرابع 2024 المالي متاح الآن',
    time: '3 hours ago',
    read: true,
  },
  {
    id: '5',
    type: 'alert',
    title: 'Market Update',
    titleAr: 'تحديث السوق',
    message: 'Tech sector shows significant volatility',
    messageAr: 'قطاع التكنولوجيا يظهر تقلبات كبيرة',
    time: '5 hours ago',
    read: true,
  },
  {
    id: '6',
    type: 'success',
    title: 'New Client',
    titleAr: 'عميل جديد',
    message: 'Enterprise Corp has joined as a new client',
    messageAr: 'انضمت شركة إنتربرايز كعميل جديد',
    time: '1 day ago',
    read: true,
  },
];

const typeConfig = {
  success: {
    icon: TrendingUp,
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/20',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/20',
  },
  info: {
    icon: Info,
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-accent/20',
  },
  alert: {
    icon: TrendingDown,
    color: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-destructive/20',
  },
  transaction: {
    icon: DollarSign,
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    border: 'border-secondary/20',
  },
};

export const NotificationsPanel: React.FC = () => {
  const { t, language } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <Bell className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{t('dashboard.notifications')}</h2>
            <p className="text-muted-foreground">
              {unreadCount > 0 
                ? `${unreadCount} ${language === 'ar' ? 'إشعارات غير مقروءة' : 'unread notifications'}`
                : language === 'ar' ? 'لا توجد إشعارات جديدة' : 'No new notifications'
              }
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            {t('notification.mark_read')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAll}
            disabled={notifications.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t('notification.clear_all')}
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <Card>
        <ScrollArea className="h-[600px]">
          <CardContent className="p-4 space-y-3">
            <AnimatePresence mode="popLayout">
              {notifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-muted-foreground"
                >
                  <Bell className="w-16 h-16 mb-4 opacity-20" />
                  <p>{language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}</p>
                </motion.div>
              ) : (
                notifications.map((notification, index) => {
                  const config = typeConfig[notification.type];
                  const Icon = config.icon;

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className={cn(
                        'group relative flex items-start gap-4 p-4 rounded-xl border transition-all',
                        'hover:shadow-md cursor-pointer',
                        notification.read
                          ? 'bg-card border-border'
                          : cn('bg-muted/30', config.border)
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      {/* Icon */}
                      <div className={cn('p-2 rounded-lg shrink-0', config.bg)}>
                        <Icon className={cn('w-5 h-5', config.color)} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className={cn(
                              'font-semibold',
                              !notification.read && 'text-foreground'
                            )}>
                              {language === 'ar' ? notification.titleAr : notification.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {language === 'ar' ? notification.messageAr : notification.message}
                            </p>
                          </div>
                          {!notification.read && (
                            <Badge variant="secondary" className="shrink-0">
                              {t('notification.new')}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {notification.time}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </CardContent>
        </ScrollArea>
      </Card>
    </motion.div>
  );
};
