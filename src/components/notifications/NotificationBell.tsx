/**
 * NotificationBell Component
 * Reusable notification bell with dropdown for both dashboards
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  X,
  ExternalLink,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useProactiveNotifications } from '@/hooks/useProactiveNotifications';
import type { Notification, NotificationType, NotificationSeverity } from '@/types/notifications';

interface NotificationBellProps {
  userId?: string;
  tenantId?: string;
  roleTarget?: 'admin' | 'customer';
  isRTL?: boolean;
  notificationsPageUrl?: string;
  maxItems?: number;
}

const typeIconMap: Record<NotificationType, React.ElementType> = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: XCircle,
  system: Settings,
  invoice_due: Receipt,
  payment_failed: CreditCard,
  low_wallet_balance: Wallet,
  order_status_changed: Package,
  order_delayed: Clock,
  contract_pending_signature: FileSignature,
  contract_signed: FileCheck,
  contract_expired: FileX,
  admin_message: MessageSquare,
};

const severityConfig: Record<NotificationSeverity, { bg: string; text: string }> = {
  info: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
  warning: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' },
  critical: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' },
};

export function NotificationBell({
  userId,
  tenantId,
  roleTarget = 'customer',
  isRTL = true,
  notificationsPageUrl = '/dashboard/notifications',
  maxItems = 5,
}: NotificationBellProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    isLoading,
    isConnected,
    markAsRead,
    markAllAsRead,
  } = useProactiveNotifications({
    userId,
    tenantId,
    roleTarget,
    limit: maxItems,
    enableRealtime: true,
    showToasts: true,
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return isRTL ? `منذ ${diffMins} د` : `${diffMins}m`;
    } else if (diffHours < 24) {
      return isRTL ? `منذ ${diffHours} س` : `${diffHours}h`;
    } else {
      return isRTL ? `منذ ${diffDays} ي` : `${diffDays}d`;
    }
  };

  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.is_read) {
      await markAsRead(notif.id);
    }
    if (notif.link) {
      navigate(notif.link);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative h-10 w-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -end-0.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </Button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute top-full mt-2 w-80 sm:w-96 bg-background border rounded-xl shadow-xl z-50",
              isRTL ? "end-0" : "start-0"
            )}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">
                  {isRTL ? 'الإشعارات' : 'Notifications'}
                </h3>
                {isConnected ? (
                  <Wifi className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <WifiOff className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs gap-1"
                    onClick={() => markAllAsRead()}
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    {isRTL ? 'قراءة الكل' : 'Read all'}
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <ScrollArea className="max-h-80">
              {isLoading ? (
                <div className="p-4 space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'لا توجد إشعارات' : 'No notifications'}
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.slice(0, maxItems).map((notif) => {
                    const Icon = typeIconMap[notif.type] || Info;
                    const severity = severityConfig[notif.severity || 'info'];

                    return (
                      <motion.button
                        key={notif.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={cn(
                          "w-full p-3 text-start hover:bg-muted/50 transition-colors flex gap-3",
                          !notif.is_read && "bg-primary/5"
                        )}
                        onClick={() => handleNotificationClick(notif)}
                      >
                        <div className={cn("p-2 rounded-lg shrink-0", severity.bg)}>
                          <Icon className={cn("h-4 w-4", severity.text)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn(
                              "text-sm line-clamp-1",
                              !notif.is_read && "font-medium"
                            )}>
                              {isRTL ? notif.title_ar || notif.title : notif.title}
                            </p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatTime(notif.created_at)}
                            </span>
                          </div>
                          {(notif.body_ar || notif.body_en || notif.message) && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {isRTL 
                                ? notif.body_ar || notif.message_ar || notif.message 
                                : notif.body_en || notif.message}
                            </p>
                          )}
                          {notif.link && (
                            <div className="flex items-center gap-1 mt-1">
                              <ExternalLink className="h-3 w-3 text-primary" />
                              <span className="text-xs text-primary">
                                {isRTL ? 'عرض التفاصيل' : 'View details'}
                              </span>
                            </div>
                          )}
                        </div>
                        {!notif.is_read && (
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t">
                <Button
                  variant="ghost"
                  className="w-full h-9 text-sm"
                  onClick={() => {
                    navigate(notificationsPageUrl);
                    setIsOpen(false);
                  }}
                >
                  {isRTL ? 'عرض كل الإشعارات' : 'View all notifications'}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
