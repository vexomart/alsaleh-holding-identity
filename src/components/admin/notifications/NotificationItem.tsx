/**
 * NotificationItem Component
 * Individual notification card with actions
 */

import { motion } from 'framer-motion';
import { 
  Check, 
  Trash2, 
  MoreVertical, 
  Clock,
  Info,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Settings,
  Receipt,
  CreditCard,
  Wallet,
  Package,
  FileSignature,
  FileCheck,
  FileX,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Notification, NotificationType } from '@/types/notifications';

const typeConfig: Record<NotificationType, { 
  icon: React.ElementType; 
  color: string; 
  bgColor: string;
}> = {
  info: { icon: Info, color: 'text-primary', bgColor: 'bg-primary/10 dark:bg-primary/20' },
  warning: { icon: AlertTriangle, color: 'text-secondary', bgColor: 'bg-secondary/10 dark:bg-secondary/20' },
  success: { icon: CheckCircle, color: 'text-accent', bgColor: 'bg-accent/10 dark:bg-accent/20' },
  error: { icon: AlertCircle, color: 'text-destructive', bgColor: 'bg-destructive/10 dark:bg-destructive/20' },
  system: { icon: Settings, color: 'text-primary', bgColor: 'bg-primary/10 dark:bg-primary/20' },
  invoice_due: { icon: Receipt, color: 'text-secondary', bgColor: 'bg-secondary/10 dark:bg-secondary/20' },
  payment_failed: { icon: CreditCard, color: 'text-destructive', bgColor: 'bg-destructive/10 dark:bg-destructive/20' },
  low_wallet_balance: { icon: Wallet, color: 'text-secondary', bgColor: 'bg-secondary/10 dark:bg-secondary/20' },
  order_status_changed: { icon: Package, color: 'text-primary', bgColor: 'bg-primary/10 dark:bg-primary/20' },
  order_delayed: { icon: Clock, color: 'text-secondary', bgColor: 'bg-secondary/10 dark:bg-secondary/20' },
  contract_pending_signature: { icon: FileSignature, color: 'text-primary', bgColor: 'bg-primary/10 dark:bg-primary/20' },
  contract_signed: { icon: FileCheck, color: 'text-accent', bgColor: 'bg-accent/10 dark:bg-accent/20' },
  contract_expired: { icon: FileX, color: 'text-destructive', bgColor: 'bg-destructive/10 dark:bg-destructive/20' },
  admin_message: { icon: MessageSquare, color: 'text-primary', bgColor: 'bg-primary/10 dark:bg-primary/20' },
};

interface NotificationItemProps {
  notification: Notification;
  isSelected: boolean;
  onSelect: () => void;
  onMarkAsRead: () => void;
  onDelete: () => void;
  language: 'ar' | 'en';
  isRTL: boolean;
  index: number;
}

export function NotificationItem({
  notification,
  isSelected,
  onSelect,
  onMarkAsRead,
  onDelete,
  language,
  isRTL,
  index,
}: NotificationItemProps) {
  const config = typeConfig[notification.type] || typeConfig.info;
  const Icon = config.icon;

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) {
      return language === 'ar' ? 'الآن' : 'now';
    } else if (diffMins < 60) {
      return language === 'ar' ? `منذ ${diffMins} د` : `${diffMins}m`;
    } else if (diffHours < 24) {
      return language === 'ar' ? `منذ ${diffHours} س` : `${diffHours}h`;
    } else {
      return language === 'ar' ? `منذ ${diffDays} ي` : `${diffDays}d`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
      transition={{ delay: index * 0.02 }}
      className={cn(
        "group flex items-start gap-4 p-4 hover:bg-muted/50 transition-all cursor-pointer border-b last:border-b-0",
        !notification.is_read && "bg-primary/5 hover:bg-primary/10"
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={onSelect}
        onClick={(e) => e.stopPropagation()}
        className="mt-1"
      />

      <motion.div 
        className={cn("p-2.5 rounded-xl shrink-0 transition-transform group-hover:scale-110", config.bgColor)}
        whileHover={{ rotate: [0, -5, 5, 0] }}
      >
        <Icon className={cn("h-5 w-5", config.color)} />
      </motion.div>

      <div 
        className="flex-1 min-w-0" 
        onClick={() => !notification.is_read && onMarkAsRead()}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className={cn(
                "font-semibold line-clamp-1",
                !notification.is_read ? "text-foreground" : "text-muted-foreground"
              )}>
                {language === 'ar' ? notification.title_ar || notification.title : notification.title}
              </p>
              
              {notification.severity === 'critical' && (
                <Badge variant="destructive" className="text-xs px-1.5 py-0">
                  {language === 'ar' ? 'حرج' : 'Critical'}
                </Badge>
              )}
              {notification.severity === 'warning' && (
                <Badge variant="outline" className="text-xs px-1.5 py-0 text-secondary border-secondary">
                  {language === 'ar' ? 'تحذير' : 'Warning'}
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {language === 'ar' 
                ? notification.body_ar || notification.message_ar || notification.message 
                : notification.body_en || notification.message}
            </p>

            {notification.link && (
              <a 
                href={notification.link}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
              >
                <ExternalLink className="h-3 w-3" />
                {language === 'ar' ? 'عرض التفاصيل' : 'View details'}
              </a>
            )}
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            {!notification.is_read && (
              <motion.div 
                className="w-2.5 h-2.5 rounded-full bg-primary"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
            <span className="text-xs text-muted-foreground flex items-center gap-1 whitespace-nowrap">
              <Clock className="h-3 w-3" />
              {formatTime(notification.created_at)}
            </span>
          </div>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={isRTL ? "start" : "end"}>
          {!notification.is_read && (
            <DropdownMenuItem onClick={onMarkAsRead}>
              <Check className="h-4 w-4 me-2" />
              {language === 'ar' ? 'تحديد كمقروء' : 'Mark as read'}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={onDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 me-2" />
            {language === 'ar' ? 'حذف' : 'Delete'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
