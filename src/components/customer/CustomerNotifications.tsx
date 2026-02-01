/**
 * Customer Notifications Center - Premium Notifications Hub
 * Full RTL/LTR support with bilingual UI and realtime updates
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useProactiveNotifications } from "@/hooks/useProactiveNotifications";
import { Card, CardContent } from "@/components/ui/card";
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
  RefreshCw,
  Receipt,
  CreditCard,
  Wallet,
  Package,
  Clock,
  FileSignature,
  FileCheck,
  FileX,
  MessageSquare,
  Wifi,
  WifiOff,
} from "lucide-react";
import type { NotificationType, NotificationSeverity } from "@/types/notifications";

const typeConfig: Record<NotificationType, {
  icon: React.ElementType;
  color: string;
  bg: string;
}> = {
  info: { icon: Info, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
  warning: { icon: AlertTriangle, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30" },
  success: { icon: CheckCircle, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
  error: { icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" },
  system: { icon: Settings, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30" },
  invoice_due: { icon: Receipt, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/30" },
  payment_failed: { icon: CreditCard, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" },
  low_wallet_balance: { icon: Wallet, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30" },
  order_status_changed: { icon: Package, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
  order_delayed: { icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30" },
  contract_pending_signature: { icon: FileSignature, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
  contract_signed: { icon: FileCheck, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
  contract_expired: { icon: FileX, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" },
  admin_message: { icon: MessageSquare, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
};

const severityStyles: Record<NotificationSeverity, string> = {
  info: "border-blue-200 dark:border-blue-800",
  warning: "border-amber-200 dark:border-amber-800",
  critical: "border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20",
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
    isConnected,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch,
  } = useProactiveNotifications({
    userId: user?.id,
    roleTarget: 'customer',
    limit: 50,
    enableRealtime: true,
    showToasts: true,
  });

  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const rtlRow = isRTL ? "flex-row-reverse" : "flex-row";
  const rtlText = isRTL ? "text-right" : "text-left";

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
      <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        <div className={cn("flex items-center justify-between", rtlRow)}>
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
    <div className={cn("space-y-6", rtlText)} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={cn("flex items-center justify-between flex-wrap gap-4", rtlRow)}>
        <div className={cn("flex items-center gap-3", rtlRow)}>
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Bell className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                {isRTL ? "الإشعارات" : "Notifications"}
              </h1>
              {isConnected ? (
                <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
                  <Wifi className="h-3 w-3" />
                  {isRTL ? 'مباشر' : 'Live'}
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1 text-muted-foreground">
                  <WifiOff className="h-3 w-3" />
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {isRTL
                  ? `${unreadCount} إشعار غير مقروء`
                  : `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`}
              </p>
            )}
          </div>
        </div>
        <div className={cn("flex items-center gap-2", rtlRow)}>
          <Button onClick={refetch} variant="outline" size="sm" className={cn("gap-2", rtlRow)}>
            <RefreshCw className="h-4 w-4" />
            {isRTL ? "تحديث" : "Refresh"}
          </Button>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline" size="sm" className={cn("gap-2", rtlRow)}>
              <CheckCheck className="h-4 w-4" />
              {isRTL ? "قراءة الكل" : "Mark All Read"}
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-4 rounded-full bg-muted">
                <BellOff className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">
                  {isRTL ? "لا توجد إشعارات" : "No Notifications"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {isRTL
                    ? "ستظهر الإشعارات الجديدة هنا عند توفرها"
                    : "New notifications will appear here when available"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification, index) => {
            const typeInfo = typeConfig[notification.type] || typeConfig.info;
            const TypeIcon = typeInfo.icon;
            const isProcessing = processingIds.has(notification.id);
            const severityStyle = severityStyles[notification.severity || 'info'];

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
                    !notification.is_read && "border-primary/30 bg-primary/5",
                    notification.severity === 'critical' && severityStyle
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
                    <div className={cn("flex items-start gap-4", rtlRow)}>
                      {/* Icon */}
                      <div className={cn("p-2.5 rounded-lg shrink-0", typeInfo.bg)}>
                        <TypeIcon className={cn("h-5 w-5", typeInfo.color)} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className={cn("flex items-start justify-between gap-2", rtlRow)}>
                          <div className={rtlText}>
                            <div className="flex items-center gap-2">
                              <h3 className={cn("font-medium", !notification.is_read && "font-semibold")}>
                                {isRTL
                                  ? notification.title_ar || notification.title
                                  : notification.title}
                              </h3>
                              {notification.severity === 'critical' && (
                                <Badge variant="destructive" className="text-xs">
                                  {isRTL ? 'حرج' : 'Critical'}
                                </Badge>
                              )}
                              {notification.severity === 'warning' && (
                                <Badge variant="outline" className="text-xs text-amber-600 border-amber-600">
                                  {isRTL ? 'تحذير' : 'Warning'}
                                </Badge>
                              )}
                            </div>
                            {(notification.body_ar || notification.body_en || notification.message) && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {isRTL
                                  ? notification.body_ar || notification.message_ar || notification.message
                                  : notification.body_en || notification.message}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatRelativeTime(notification.created_at)}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className={cn("flex items-center gap-2 mt-3 flex-wrap", rtlRow)}>
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              disabled={isProcessing}
                              className={cn("h-8 text-xs gap-1", rtlRow)}
                            >
                              <Check className="h-3.5 w-3.5" />
                              {isRTL ? "تم القراءة" : "Mark Read"}
                            </Button>
                          )}
                          {notification.link && (
                            <Badge variant="secondary" className={cn("gap-1 text-xs", rtlRow)}>
                              <ExternalLink className="h-3 w-3" />
                              {isRTL ? "عرض التفاصيل" : "View Details"}
                            </Badge>
                          )}
                          <div className={isRTL ? "me-auto" : "ms-auto"}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(notification.id);
                              }}
                              disabled={isProcessing}
                              className="h-8 text-xs gap-1 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
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
