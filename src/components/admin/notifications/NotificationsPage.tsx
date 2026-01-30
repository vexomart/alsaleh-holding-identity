/**
 * Notifications Center - Enterprise Grade Design
 * Real-time notification management
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Check,
  CheckCheck,
  X,
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
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import { db } from '@/integrations/supabase/db';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  title_ar: string | null;
  message: string | null;
  message_ar: string | null;
  type: 'info' | 'warning' | 'success' | 'error' | 'system' | null;
  is_read: boolean | null;
  link: string | null;
  created_at: string | null;
}

const typeConfig: Record<string, { 
  icon: React.ElementType; 
  color: string; 
  bgColor: string;
  labelAr: string;
  labelEn: string;
}> = {
  info: { 
    icon: Info, 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    labelAr: 'معلومات',
    labelEn: 'Info'
  },
  warning: { 
    icon: AlertTriangle, 
    color: 'text-amber-600', 
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    labelAr: 'تحذير',
    labelEn: 'Warning'
  },
  success: { 
    icon: CheckCircle, 
    color: 'text-green-600', 
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    labelAr: 'نجاح',
    labelEn: 'Success'
  },
  error: { 
    icon: AlertCircle, 
    color: 'text-red-600', 
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    labelAr: 'خطأ',
    labelEn: 'Error'
  },
  system: { 
    icon: Settings, 
    color: 'text-purple-600', 
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    labelAr: 'نظام',
    labelEn: 'System'
  },
};

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Order Received',
    title_ar: 'طلب جديد',
    message: 'You have received a new order #ORD-2024-0125',
    message_ar: 'لقد استلمت طلباً جديداً #ORD-2024-0125',
    type: 'info',
    is_read: false,
    link: '/admin/orders',
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: '2',
    title: 'Payment Successful',
    title_ar: 'تم الدفع بنجاح',
    message: 'Payment of 5,000 SAR has been confirmed',
    message_ar: 'تم تأكيد دفع مبلغ 5,000 ريال سعودي',
    type: 'success',
    is_read: false,
    link: null,
    created_at: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: '3',
    title: 'Service Expiring Soon',
    title_ar: 'الخدمة ستنتهي قريباً',
    message: 'License renewal service is expiring in 3 days',
    message_ar: 'خدمة تجديد الرخصة ستنتهي خلال 3 أيام',
    type: 'warning',
    is_read: true,
    link: '/admin/services',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: '4',
    title: 'System Update Required',
    title_ar: 'يلزم تحديث النظام',
    message: 'A new system update is available',
    message_ar: 'تحديث جديد للنظام متاح',
    type: 'system',
    is_read: true,
    link: null,
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: '5',
    title: 'Failed Transaction',
    title_ar: 'فشل في المعاملة',
    message: 'Transaction #TXN-789 has failed',
    message_ar: 'فشلت المعاملة #TXN-789',
    type: 'error',
    is_read: false,
    link: null,
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
];

export function NotificationsPage() {
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Stats
  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.is_read).length,
    info: notifications.filter(n => n.type === 'info').length,
    warning: notifications.filter(n => n.type === 'warning').length,
    error: notifications.filter(n => n.type === 'error').length,
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = 
      (notif.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (notif.title_ar?.includes(searchQuery) || false) ||
      (notif.message?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    const matchesType = typeFilter === 'all' || notif.type === typeFilter;
    
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'unread' && !notif.is_read);
    
    return matchesSearch && matchesType && matchesTab;
  });

  // Mark as read
  const markAsRead = (ids: string[]) => {
    setNotifications(prev => 
      prev.map(n => ids.includes(n.id) ? { ...n, is_read: true } : n)
    );
    setSelectedIds([]);
    toast({ title: language === 'ar' ? 'تم التحديث' : 'Updated' });
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    toast({ title: language === 'ar' ? 'تم تحديد الكل كمقروء' : 'All marked as read' });
  };

  // Delete notifications
  const deleteNotifications = (ids: string[]) => {
    setNotifications(prev => prev.filter(n => !ids.includes(n.id)));
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

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            {language === 'ar' ? 'مركز الإشعارات' : 'Notification Center'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {language === 'ar' ? 'إدارة جميع الإشعارات والتنبيهات' : 'Manage all notifications and alerts'}
          </p>
        </div>
        <div className="flex items-center gap-2">
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
          { label: language === 'ar' ? 'الإجمالي' : 'Total', value: stats.total, icon: Bell, color: 'primary' },
          { label: language === 'ar' ? 'غير مقروء' : 'Unread', value: stats.unread, icon: Mail, color: 'blue-500' },
          { label: language === 'ar' ? 'معلومات' : 'Info', value: stats.info, icon: Info, color: 'sky-500' },
          { label: language === 'ar' ? 'تحذيرات' : 'Warnings', value: stats.warning, icon: AlertTriangle, color: 'amber-500' },
          { label: language === 'ar' ? 'أخطاء' : 'Errors', value: stats.error, icon: AlertCircle, color: 'red-500' },
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
                  <stat.icon className={cn(
                    "h-5 w-5",
                    stat.color === 'primary' ? 'text-primary' : `text-${stat.color}`
                  )} />
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

            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
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
                onClick={() => markAsRead(selectedIds)}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                {language === 'ar' ? 'تحديد كمقروء' : 'Mark as read'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => deleteNotifications(selectedIds)}
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
                    const config = typeConfig[notif.type || 'info'];
                    const Icon = config.icon;

                    return (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.02 }}
                        className={cn(
                          "flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                          !notif.is_read && "bg-primary/5"
                        )}
                      >
                        <Checkbox
                          checked={selectedIds.includes(notif.id)}
                          onCheckedChange={() => toggleSelect(notif.id)}
                          onClick={(e) => e.stopPropagation()}
                        />

                        <div className={cn(
                          "p-2.5 rounded-lg shrink-0",
                          config.bgColor
                        )}>
                          <Icon className={cn("h-5 w-5", config.color)} />
                        </div>

                        <div className="flex-1 min-w-0" onClick={() => !notif.is_read && markAsRead([notif.id])}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className={cn(
                                "font-medium",
                                !notif.is_read && "text-foreground"
                              )}>
                                {language === 'ar' ? notif.title_ar || notif.title : notif.title}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {language === 'ar' ? notif.message_ar || notif.message : notif.message}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(notif.created_at)}
                              </span>
                              {!notif.is_read && (
                                <div className="w-2 h-2 rounded-full bg-primary" />
                              )}
                            </div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!notif.is_read && (
                              <DropdownMenuItem onClick={() => markAsRead([notif.id])}>
                                <Check className="h-4 w-4 ml-2" />
                                {language === 'ar' ? 'تحديد كمقروء' : 'Mark as read'}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => deleteNotifications([notif.id])}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 ml-2" />
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
