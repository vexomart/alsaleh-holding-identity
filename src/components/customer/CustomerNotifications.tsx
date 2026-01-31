/**
 * Customer Notifications Page
 * Notifications list with mark read functionality
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  ExternalLink,
} from "lucide-react";
import type { NotificationType } from "@/types/notifications";

const typeConfig: Record<NotificationType, {
  icon: React.ElementType;
  color: string;
  bg: string;
}> = {
  info: {
    icon: Info,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  success: {
    icon: CheckCircle,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  error: {
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/30",
  },
  system: {
    icon: Settings,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
  },
};

export function CustomerNotifications() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications({ userId: user?.id });

  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const handleMarkAsRead = async (id: string) => {
    setProcessingIds((prev) => new Set(prev).add(id));
    try {
      await markAsRead(id);
    } catch (error) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل تحديث الإشعار" : "Failed to update notification",
        variant: "destructive",
      });
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast({
        title: isRTL ? "تم" : "Done",
        description: isRTL ? "تم تحديث جميع الإشعارات" : "All notifications marked as read",
      });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل تحديث الإشعارات" : "Failed to update notifications",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    setProcessingIds((prev) => new Set(prev).add(id));
    try {
      await deleteNotification(id);
      toast({
        title: isRTL ? "تم الحذف" : "Deleted",
        description: isRTL ? "تم حذف الإشعار" : "Notification deleted",
      });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل حذف الإشعار" : "Failed to delete notification",
        variant: "destructive",
      });
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleNotificationClick = (link: string | null, id: string, isRead: boolean) => {
    if (!isRead) {
      handleMarkAsRead(id);
    }
    if (link) {
      navigate(link);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return isRTL ? `منذ ${diffMins} دقيقة` : `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return isRTL ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return isRTL ? `منذ ${diffDays} يوم` : `${diffDays}d ago`;
    } else {
      return new Intl.DateTimeFormat(isRTL ? "ar-SA" : "en-US", {
        month: "short",
        day: "numeric",
      }).format(date);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Bell className="h-7 w-7 text-primary" />
            {isRTL ? "الإشعارات" : "Notifications"}
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {isRTL
                ? `${unreadCount} إشعار غير مقروء`
                : `${unreadCount} unread notifications`}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline" className="gap-2">
            <CheckCheck className="h-4 w-4" />
            {isRTL ? "قراءة الكل" : "Mark All Read"}
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BellOff className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">
              {isRTL ? "لا توجد إشعارات" : "No Notifications"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isRTL
                ? "ستظهر الإشعارات الجديدة هنا"
                : "New notifications will appear here"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification, index) => {
            const typeInfo = typeConfig[notification.type] || typeConfig.info;
            const TypeIcon = typeInfo.icon;
            const isProcessing = processingIds.has(notification.id);

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={cn(
                    "transition-all cursor-pointer hover:shadow-md",
                    !notification.is_read && "border-primary/30 bg-primary/5"
                  )}
                  onClick={() =>
                    handleNotificationClick(
                      notification.link,
                      notification.id,
                      notification.is_read
                    )
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={cn("p-2.5 rounded-lg shrink-0", typeInfo.bg)}>
                        <TypeIcon className={cn("h-5 w-5", typeInfo.color)} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3
                              className={cn(
                                "font-medium",
                                !notification.is_read && "font-semibold"
                              )}
                            >
                              {isRTL
                                ? notification.title_ar || notification.title
                                : notification.title}
                            </h3>
                            {(notification.message || notification.message_ar) && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {isRTL
                                  ? notification.message_ar || notification.message
                                  : notification.message}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatRelativeTime(notification.created_at)}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-3">
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              disabled={isProcessing}
                              className="h-8 text-xs gap-1"
                            >
                              <Check className="h-3.5 w-3.5" />
                              {isRTL ? "تم القراءة" : "Mark Read"}
                            </Button>
                          )}
                          {notification.link && (
                            <Badge variant="secondary" className="gap-1 text-xs">
                              <ExternalLink className="h-3 w-3" />
                              {isRTL ? "عرض التفاصيل" : "View Details"}
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                            disabled={isProcessing}
                            className="h-8 text-xs gap-1 text-destructive hover:text-destructive ms-auto"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Unread indicator */}
                      {!notification.is_read && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-2" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
