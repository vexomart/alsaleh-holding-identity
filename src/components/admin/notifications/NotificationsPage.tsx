/**
 * Notifications Center - Redesigned Enterprise UI
 * Full real-time bidirectional notifications between Admin & Customers
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Check,
  CheckCheck,
  Trash2,
  Search,
  RefreshCw,
  Wifi,
  WifiOff,
  Send,
  Filter,
  X,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useNotificationsRealtime } from '@/hooks/useNotificationsRealtime';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { NotificationStats } from './NotificationStats';
import { NotificationItem } from './NotificationItem';
import { SendNotificationDialog } from './SendNotificationDialog';
import type { NotificationType, NotificationSeverity } from '@/types/notifications';

const typeLabels: Record<NotificationType, { ar: string; en: string }> = {
  info: { ar: 'معلومات', en: 'Info' },
  warning: { ar: 'تحذير', en: 'Warning' },
  success: { ar: 'نجاح', en: 'Success' },
  error: { ar: 'خطأ', en: 'Error' },
  system: { ar: 'نظام', en: 'System' },
  invoice_due: { ar: 'فاتورة مستحقة', en: 'Invoice Due' },
  payment_failed: { ar: 'فشل الدفع', en: 'Payment Failed' },
  low_wallet_balance: { ar: 'رصيد منخفض', en: 'Low Balance' },
  order_status_changed: { ar: 'تغيير حالة الطلب', en: 'Order Status' },
  order_delayed: { ar: 'طلب متأخر', en: 'Order Delayed' },
  contract_pending_signature: { ar: 'عقد بانتظار التوقيع', en: 'Pending Signature' },
  contract_signed: { ar: 'عقد موقع', en: 'Contract Signed' },
  contract_expired: { ar: 'عقد منتهي', en: 'Contract Expired' },
  admin_message: { ar: 'رسالة إدارية', en: 'Admin Message' },
};

const severityLabels: Record<NotificationSeverity, { ar: string; en: string }> = {
  info: { ar: 'عادي', en: 'Normal' },
  warning: { ar: 'تحذير', en: 'Warning' },
  critical: { ar: 'حرج', en: 'Critical' },
};

export function NotificationsPage() {
  const { language, isRTL } = useLanguage();
  const { user, profile } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);

  const {
    notifications,
    unreadCount,
    isLoading,
    isConnected,
    connectionStatus,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    sendNotification,
    refetch,
  } = useNotificationsRealtime({
    userId: user?.id,
    tenantId: profile?.tenant_id || undefined,
    roleTarget: 'admin',
    limit: 100,
    showToasts: true,
  });

  // Calculate stats
  const stats = useMemo(() => ({
    total: notifications.length,
    unread: unreadCount,
    info: notifications.filter(n => n.severity === 'info').length,
    warning: notifications.filter(n => n.severity === 'warning').length,
    critical: notifications.filter(n => n.severity === 'critical').length,
  }), [notifications, unreadCount]);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      const matchesSearch = 
        (notif.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (notif.title_ar?.includes(searchQuery) || false) ||
        (notif.message?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
      
      const matchesType = typeFilter === 'all' || notif.type === typeFilter;
      const matchesSeverity = severityFilter === 'all' || notif.severity === severityFilter;
      const matchesTab = activeTab === 'all' || (activeTab === 'unread' && !notif.is_read);
      
      return matchesSearch && matchesType && matchesSeverity && matchesTab;
    });
  }, [notifications, searchQuery, typeFilter, severityFilter, activeTab]);

  // Bulk actions
  const handleBulkMarkAsRead = async () => {
    for (const id of selectedIds) {
      await markAsRead(id);
    }
    setSelectedIds([]);
    toast({ title: language === 'ar' ? 'تم التحديث' : 'Updated' });
  };

  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      await deleteNotification(id);
    }
    setSelectedIds([]);
    toast({ title: language === 'ar' ? 'تم الحذف' : 'Deleted' });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Send notification handler
  const handleSendNotification = async (data: any) => {
    try {
      await sendNotification({
        ...data,
        body_ar: data.message_ar,
        body_en: data.message,
      });
      toast({
        title: language === 'ar' ? 'تم الإرسال بنجاح' : 'Sent Successfully',
        description: language === 'ar' ? 'تم إرسال الإشعار للمستخدمين' : 'Notification sent to users',
      });
    } catch (error) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'فشل إرسال الإشعار' : 'Failed to send notification',
        variant: 'destructive',
      });
    }
  };

  const hasActiveFilters = typeFilter !== 'all' || severityFilter !== 'all' || searchQuery;

  if (isLoading) {
    return (
      <div className="space-y-6 p-1">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-[500px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ rotate: -20 }}
              animate={{ rotate: 0 }}
              className="p-2 rounded-xl bg-primary/10"
            >
              <Bell className="h-6 w-6 text-primary" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {language === 'ar' ? 'مركز الإشعارات' : 'Notification Center'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {language === 'ar' ? 'إدارة الإشعارات والتنبيهات الفورية' : 'Manage instant notifications & alerts'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Connection Status */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
              isConnected 
                ? "bg-accent/10 text-accent dark:text-accent" 
                : connectionStatus === 'connecting'
                  ? "bg-secondary/10 text-secondary"
                  : "bg-muted text-muted-foreground"
            )}
          >
            {isConnected ? (
              <>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Zap className="h-4 w-4" />
                </motion.div>
                {language === 'ar' ? 'متصل مباشر' : 'Live'}
              </>
            ) : connectionStatus === 'connecting' ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                {language === 'ar' ? 'جاري الاتصال' : 'Connecting'}
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4" />
                {language === 'ar' ? 'غير متصل' : 'Offline'}
              </>
            )}
          </motion.div>

          <Button variant="outline" size="sm" onClick={refetch} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            {language === 'ar' ? 'تحديث' : 'Refresh'}
          </Button>

          {stats.unread > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-2">
              <CheckCheck className="h-4 w-4" />
              {language === 'ar' ? 'قراءة الكل' : 'Read all'}
            </Button>
          )}

          <Button onClick={() => setSendDialogOpen(true)} className="gap-2">
            <Send className="h-4 w-4" />
            {language === 'ar' ? 'إرسال إشعار' : 'Send Notification'}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <NotificationStats 
        {...stats} 
        language={language} 
      />

      {/* Main Content */}
      <Card className="border shadow-lg overflow-hidden">
        <CardHeader className="border-b bg-muted/30 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-background">
                <TabsTrigger value="all" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  {language === 'ar' ? 'الكل' : 'All'}
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">{stats.total}</Badge>
                </TabsTrigger>
                <TabsTrigger value="unread" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  {language === 'ar' ? 'غير مقروء' : 'Unread'}
                  {stats.unread > 0 && (
                    <Badge className="h-5 px-1.5 text-xs bg-red-500">{stats.unread}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-10 bg-background"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute end-1 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px] bg-background">
                  <Filter className="h-4 w-4 me-2 text-muted-foreground" />
                  <SelectValue placeholder={language === 'ar' ? 'النوع' : 'Type'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'ar' ? 'جميع الأنواع' : 'All Types'}</SelectItem>
                  {Object.entries(typeLabels).map(([key, labels]) => (
                    <SelectItem key={key} value={key}>
                      {language === 'ar' ? labels.ar : labels.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[120px] bg-background">
                  <SelectValue placeholder={language === 'ar' ? 'الأهمية' : 'Severity'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                  {Object.entries(severityLabels).map(([key, labels]) => (
                    <SelectItem key={key} value={key}>
                      {language === 'ar' ? labels.ar : labels.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setTypeFilter('all');
                    setSeverityFilter('all');
                  }}
                  className="text-muted-foreground"
                >
                  <X className="h-4 w-4 me-1" />
                  {language === 'ar' ? 'مسح الفلاتر' : 'Clear'}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Bulk Actions */}
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 px-4 py-3 bg-primary/5 border-b"
              >
                <Badge variant="secondary">
                  {selectedIds.length} {language === 'ar' ? 'محدد' : 'selected'}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleBulkMarkAsRead}
                  className="gap-2"
                >
                  <Check className="h-4 w-4" />
                  {language === 'ar' ? 'تحديد كمقروء' : 'Mark as read'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleBulkDelete}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  {language === 'ar' ? 'حذف' : 'Delete'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIds([])}
                >
                  {language === 'ar' ? 'إلغاء التحديد' : 'Clear selection'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notifications List */}
          <ScrollArea className="h-[500px]">
            {filteredNotifications.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16 text-muted-foreground"
              >
                <div className="p-4 rounded-full bg-muted/50 mb-4">
                  <Sparkles className="h-10 w-10 opacity-50" />
                </div>
                <p className="text-lg font-medium">
                  {language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}
                </p>
                <p className="text-sm">
                  {language === 'ar' ? 'ستظهر الإشعارات الجديدة هنا' : 'New notifications will appear here'}
                </p>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredNotifications.map((notif, index) => (
                  <NotificationItem
                    key={notif.id}
                    notification={notif}
                    isSelected={selectedIds.includes(notif.id)}
                    onSelect={() => toggleSelect(notif.id)}
                    onMarkAsRead={() => markAsRead(notif.id)}
                    onDelete={() => deleteNotification(notif.id)}
                    language={language}
                    isRTL={isRTL}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Send Dialog */}
      <SendNotificationDialog
        open={sendDialogOpen}
        onOpenChange={setSendDialogOpen}
        onSend={handleSendNotification}
        language={language}
      />
    </div>
  );
}
