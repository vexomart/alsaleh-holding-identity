/**
 * Notifications Center - Enterprise Grade Design
 * Real-time notification management with proactive alerts
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Search,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  Settings,
  RefreshCw,
  MoreVertical,
  Clock,
  Mail,
  MessageSquare,
  Receipt,
  CreditCard,
  Wallet,
  Package,
  FileSignature,
  FileCheck,
  FileX,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useProactiveNotifications } from '@/hooks/useProactiveNotifications';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { NotificationType, NotificationSeverity } from '@/types/notifications';

const typeConfig: Record<NotificationType, { 
  icon: React.ElementType; 
  color: string; 
  bgColor: string;
  labelAr: string;
  labelEn: string;
}> = {
  info: { icon: Info, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', labelAr: 'معلومات', labelEn: 'Info' },
  warning: { icon: AlertTriangle, color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30', labelAr: 'تحذير', labelEn: 'Warning' },
  success: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30', labelAr: 'نجاح', labelEn: 'Success' },
  error: { icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30', labelAr: 'خطأ', labelEn: 'Error' },
  system: { icon: Settings, color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30', labelAr: 'نظام', labelEn: 'System' },
  invoice_due: { icon: Receipt, color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30', labelAr: 'فاتورة مستحقة', labelEn: 'Invoice Due' },
  payment_failed: { icon: CreditCard, color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30', labelAr: 'فشل الدفع', labelEn: 'Payment Failed' },
  low_wallet_balance: { icon: Wallet, color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30', labelAr: 'رصيد منخفض', labelEn: 'Low Balance' },
  order_status_changed: { icon: Package, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', labelAr: 'تغيير حالة الطلب', labelEn: 'Order Status' },
  order_delayed: { icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30', labelAr: 'طلب متأخر', labelEn: 'Order Delayed' },
  contract_pending_signature: { icon: FileSignature, color: 'text-indigo-600', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30', labelAr: 'عقد بانتظار التوقيع', labelEn: 'Pending Signature' },
  contract_signed: { icon: FileCheck, color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30', labelAr: 'عقد موقع', labelEn: 'Contract Signed' },
  contract_expired: { icon: FileX, color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30', labelAr: 'عقد منتهي', labelEn: 'Contract Expired' },
  admin_message: { icon: MessageSquare, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', labelAr: 'رسالة إدارية', labelEn: 'Admin Message' },
};

const severityConfig: Record<NotificationSeverity, { label: string; labelAr: string; color: string }> = {
  info: { label: 'Info', labelAr: 'معلومات', color: 'text-blue-600' },
  warning: { label: 'Warning', labelAr: 'تحذير', color: 'text-amber-600' },
  critical: { label: 'Critical', labelAr: 'حرج', color: 'text-red-600' },
};

export function NotificationsPage() {
  const { language, isRTL } = useLanguage();
  const { user, profile } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
    tenantId: profile?.tenant_id || undefined,
    roleTarget: 'admin',
    limit: 100,
    enableRealtime: true,
    showToasts: true,
  });

  // Stats
  const stats = {
    total: notifications.length,
    unread: unreadCount,
    info: notifications.filter(n => n.severity === 'info').length,
    warning: notifications.filter(n => n.severity === 'warning').length,
    critical: notifications.filter(n => n.severity === 'critical').length,
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = 
      (notif.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (notif.title_ar?.includes(searchQuery) || false) ||
      (notif.message?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    const matchesType = typeFilter === 'all' || notif.type === typeFilter;
    const matchesSeverity = severityFilter === 'all' || notif.severity === severityFilter;
    const matchesTab = activeTab === 'all' || (activeTab === 'unread' && !notif.is_read);
    
    return matchesSearch && matchesType && matchesSeverity && matchesTab;
  });

  // Bulk actions
  const handleMarkAsRead = async (ids: string[]) => {
    for (const id of ids) {
      await markAsRead(id);
    }
    setSelectedIds([]);
    toast({ title: language === 'ar' ? 'تم التحديث' : 'Updated' });
  };

  const handleDeleteNotifications = async (ids: string[]) => {
    for (const id of ids) {
      await deleteNotification(id);
    }
    setSelectedIds([]);
    toast({ title: language === 'ar' ? 'تم الحذف' : 'Deleted' });
  };

  // Format time
  const formatTime = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return language === 'ar' ? `منذ ${diffMins} دقيقة` : `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return language === 'ar' ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
    } else {
      return language === 'ar' ? `منذ ${diffDays} يوم` : `${diffDays}d ago`;
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map(n => n.id));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-1">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Bell className="h-6 w-6 text-primary" />
              {language === 'ar' ? 'مركز الإشعارات' : 'Notification Center'}
            </h1>
            {isConnected ? (
              <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
                <Wifi className="h-3 w-3" />
                {language === 'ar' ? 'مباشر' : 'Live'}
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 text-muted-foreground">
                <WifiOff className="h-3 w-3" />
                {language === 'ar' ? 'غير متصل' : 'Offline'}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {language === 'ar' ? 'إدارة جميع الإشعارات والتنبيهات الاستباقية' : 'Manage all notifications and proactive alerts'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refetch} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            {language === 'ar' ? 'تحديث' : 'Refresh'}
          </Button>
          {stats.unread > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-2">
              <CheckCheck className="h-4 w-4" />
              {language === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all as read'}
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: language === 'ar' ? 'الإجمالي' : 'Total', value: stats.total, icon: Bell, color: 'text-primary' },
          { label: language === 'ar' ? 'غير مقروء' : 'Unread', value: stats.unread, icon: Mail, color: 'text-blue-500' },
          { label: language === 'ar' ? 'معلومات' : 'Info', value: stats.info, icon: Info, color: 'text-sky-500' },
          { label: language === 'ar' ? 'تحذيرات' : 'Warnings', value: stats.warning, icon: AlertTriangle, color: 'text-amber-500' },
          { label: language === 'ar' ? 'حرج' : 'Critical', value: stats.critical, icon: AlertCircle, color: 'text-red-500' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all" className="gap-2">
                  {language === 'ar' ? 'الكل' : 'All'}
                  <Badge variant="secondary" className="h-5 text-xs">{stats.total}</Badge>
                </TabsTrigger>
                <TabsTrigger value="unread" className="gap-2">
                  {language === 'ar' ? 'غير مقروء' : 'Unread'}
                  {stats.unread > 0 && (
                    <Badge className="h-5 text-xs bg-primary">{stats.unread}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder={language === 'ar' ? 'النوع' : 'Type'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'ar' ? 'جميع الأنواع' : 'All Types'}</SelectItem>
                  {Object.entries(typeConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {language === 'ar' ? config.labelAr : config.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder={language === 'ar' ? 'الأهمية' : 'Severity'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                  {Object.entries(severityConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {language === 'ar' ? config.labelAr : config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 bg-muted/50 border-b"
            >
              <span className="text-sm text-muted-foreground">
                {selectedIds.length} {language === 'ar' ? 'محدد' : 'selected'}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleMarkAsRead(selectedIds)}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                {language === 'ar' ? 'تحديد كمقروء' : 'Mark as read'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDeleteNotifications(selectedIds)}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                {language === 'ar' ? 'حذف' : 'Delete'}
              </Button>
            </motion.div>
          )}

          {/* Notifications List */}
          <ScrollArea className="h-[500px]">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Bell className="h-12 w-12 mb-3 opacity-50" />
                <p>{language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}</p>
              </div>
            ) : (
              <div className="divide-y">
                <AnimatePresence>
                  {filteredNotifications.map((notif, index) => {
                    const config = typeConfig[notif.type] || typeConfig.info;
                    const Icon = config.icon;

                    return (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                        transition={{ delay: index * 0.02 }}
                        className={cn(
                          "flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                          !notif.is_read && "bg-primary/5"
                        )}
                        dir={isRTL ? "rtl" : "ltr"}
                      >
                        <Checkbox
                          checked={selectedIds.includes(notif.id)}
                          onCheckedChange={() => toggleSelect(notif.id)}
                          onClick={(e) => e.stopPropagation()}
                        />

                        <div className={cn("p-2.5 rounded-lg shrink-0", config.bgColor)}>
                          <Icon className={cn("h-5 w-5", config.color)} />
                        </div>

                        <div className="flex-1 min-w-0" onClick={() => !notif.is_read && markAsRead(notif.id)}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className={cn("font-medium", !notif.is_read && "text-foreground")}>
                                  {language === 'ar' ? notif.title_ar || notif.title : notif.title}
                                </p>
                                {notif.severity === 'critical' && (
                                  <Badge variant="destructive" className="text-xs">
                                    {language === 'ar' ? 'حرج' : 'Critical'}
                                  </Badge>
                                )}
                                {notif.severity === 'warning' && (
                                  <Badge variant="outline" className="text-xs text-amber-600 border-amber-600">
                                    {language === 'ar' ? 'تحذير' : 'Warning'}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {language === 'ar' 
                                  ? notif.body_ar || notif.message_ar || notif.message 
                                  : notif.body_en || notif.message}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {!notif.is_read && (
                                <div className="w-2 h-2 rounded-full bg-primary" />
                              )}
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(notif.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align={isRTL ? "start" : "end"}>
                            {!notif.is_read && (
                              <DropdownMenuItem onClick={() => markAsRead(notif.id)}>
                                <Check className="h-4 w-4 me-2" />
                                {language === 'ar' ? 'تحديد كمقروء' : 'Mark as read'}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => deleteNotification(notif.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 me-2" />
                              {language === 'ar' ? 'حذف' : 'Delete'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
