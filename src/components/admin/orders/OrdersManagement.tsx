/**
 * Orders Management - Enterprise Grade Design
 * Full CRUD with workflow management and real-time updates
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Eye,
  MoreVertical,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  Calendar,
  User,
  Filter,
  Download,
  RefreshCw,
  ChevronRight,
  Package,
  Truck,
  CreditCard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/integrations/supabase/db';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Order {
  id: string;
  order_number: string;
  title: string;
  title_ar: string | null;
  status: string | null;
  priority: number | null;
  total_amount: number | null;
  currency: string | null;
  customer_id: string | null;
  service_id: string | null;
  assigned_to: string | null;
  due_date: string | null;
  created_at: string | null;
  updated_at: string | null;
  description: string | null;
}

const statusConfig: Record<string, { 
  labelAr: string; 
  labelEn: string; 
  color: string; 
  bgColor: string;
  icon: React.ElementType;
}> = {
  pending: { 
    labelAr: "قيد الانتظار", 
    labelEn: "Pending", 
    color: "text-amber-600", 
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    icon: Clock
  },
  processing: { 
    labelAr: "قيد المعالجة", 
    labelEn: "Processing", 
    color: "text-blue-600", 
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    icon: Package
  },
  in_progress: { 
    labelAr: "قيد التنفيذ", 
    labelEn: "In Progress", 
    color: "text-indigo-600", 
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    icon: Truck
  },
  completed: { 
    labelAr: "مكتمل", 
    labelEn: "Completed", 
    color: "text-green-600", 
    bgColor: "bg-green-100 dark:bg-green-900/30",
    icon: CheckCircle
  },
  cancelled: { 
    labelAr: "ملغي", 
    labelEn: "Cancelled", 
    color: "text-red-600", 
    bgColor: "bg-red-100 dark:bg-red-900/30",
    icon: XCircle
  },
  refunded: { 
    labelAr: "مسترد", 
    labelEn: "Refunded", 
    color: "text-purple-600", 
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    icon: CreditCard
  },
};

export function OrdersManagement() {
  const { language } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const { data, error } = await db
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast({
        title: language === 'ar' ? 'خطأ في جلب الطلبات' : 'Error fetching orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Real-time subscription
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => fetchOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => ['processing', 'in_progress'].includes(o.status || '')).length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.total_amount || 0), 0),
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'pending' && order.status === 'pending') ||
      (activeTab === 'active' && ['processing', 'in_progress'].includes(order.status || '')) ||
      (activeTab === 'completed' && order.status === 'completed');
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  // Handle status change
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await db
        .from('orders')
        .update({ status: newStatus as any })
        .eq('id', orderId);

      if (error) throw error;
      
      toast({ 
        title: language === 'ar' ? 'تم تحديث حالة الطلب' : 'Order status updated' 
      });
    } catch (err) {
      console.error('Error updating order:', err);
      toast({
        title: language === 'ar' ? 'خطأ في تحديث الطلب' : 'Error updating order',
        variant: 'destructive',
      });
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-';
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  const getStatusBadge = (status: string | null) => {
    const config = statusConfig[status || 'pending'];
    const Icon = config.icon;
    return (
      <Badge className={cn("gap-1.5 font-medium", config.bgColor, config.color)}>
        <Icon className="h-3 w-3" />
        {language === 'ar' ? config.labelAr : config.labelEn}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-1" dir="rtl">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-primary" />
            {language === 'ar' ? 'إدارة الطلبات' : 'Order Management'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {language === 'ar' ? 'تتبع وإدارة جميع الطلبات' : 'Track and manage all orders'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-row-reverse md:flex-row">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {language === 'ar' ? 'طلب جديد' : 'New Order'}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            {language === 'ar' ? 'تصدير' : 'Export'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setRefreshing(true);
              fetchOrders();
            }}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            {language === 'ar' ? 'تحديث' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: language === 'ar' ? 'إجمالي الطلبات' : 'Total Orders', value: stats.total, icon: ShoppingCart, color: 'primary' },
          { label: language === 'ar' ? 'قيد الانتظار' : 'Pending', value: stats.pending, icon: Clock, color: 'amber-500' },
          { label: language === 'ar' ? 'قيد التنفيذ' : 'In Progress', value: stats.inProgress, icon: Package, color: 'blue-500' },
          { label: language === 'ar' ? 'مكتمل' : 'Completed', value: stats.completed, icon: CheckCircle, color: 'green-500' },
          { label: language === 'ar' ? 'ملغي' : 'Cancelled', value: stats.cancelled, icon: XCircle, color: 'red-500' },
          { label: language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: CreditCard, color: 'purple-500', isRevenue: true },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between flex-row-reverse">
                  <div className={cn(
                    "p-2 rounded-lg",
                    stat.color === 'primary' ? 'bg-primary/10 text-primary' : `bg-${stat.color}/10 text-${stat.color}`
                  )} style={{ 
                    backgroundColor: stat.color !== 'primary' ? `hsl(var(--${stat.color.replace('-500', '')}))` : undefined,
                    opacity: 0.1 
                  }}>
                    <stat.icon className={cn("h-4 w-4", stat.color === 'primary' ? 'text-primary' : '')} />
                  </div>
                </div>
                <div className="mt-3 text-right">
                  <p className={cn(
                    "text-2xl font-bold",
                    stat.color === 'primary' ? 'text-primary' : ''
                  )}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs and Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <TabsList className="grid w-full md:w-auto grid-cols-4 h-10">
                <TabsTrigger value="all" className="gap-2">
                  {language === 'ar' ? 'الكل' : 'All'}
                  <Badge variant="secondary" className="h-5 text-xs">{orders.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="pending" className="gap-2">
                  {language === 'ar' ? 'انتظار' : 'Pending'}
                  <Badge variant="secondary" className="h-5 text-xs">{stats.pending}</Badge>
                </TabsTrigger>
                <TabsTrigger value="active" className="gap-2">
                  {language === 'ar' ? 'نشط' : 'Active'}
                  <Badge variant="secondary" className="h-5 text-xs">{stats.inProgress}</Badge>
                </TabsTrigger>
                <TabsTrigger value="completed" className="gap-2">
                  {language === 'ar' ? 'مكتمل' : 'Done'}
                  <Badge variant="secondary" className="h-5 text-xs">{stats.completed}</Badge>
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2 flex-row-reverse md:flex-row">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px]">
                    <Filter className="h-4 w-4 ms-2" />
                    <SelectValue placeholder={language === 'ar' ? 'الحالة' : 'Status'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</SelectItem>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {language === 'ar' ? config.labelAr : config.labelEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={language === 'ar' ? 'بحث عن طلب...' : 'Search orders...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="ps-10"
                  />
                </div>
              </div>
            </div>

            <TabsContent value={activeTab} className="mt-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>{language === 'ar' ? 'لا توجد طلبات' : 'No orders found'}</p>
                </div>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold text-right">{language === 'ar' ? 'رقم الطلب' : 'Order #'}</TableHead>
                        <TableHead className="font-semibold text-right">{language === 'ar' ? 'العنوان' : 'Title'}</TableHead>
                        <TableHead className="font-semibold text-right">{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                        <TableHead className="font-semibold text-right">{language === 'ar' ? 'المبلغ' : 'Amount'}</TableHead>
                        <TableHead className="font-semibold text-right">{language === 'ar' ? 'التاريخ' : 'Date'}</TableHead>
                        <TableHead className="font-semibold w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {filteredOrders.map((order, index) => (
                          <motion.tr
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: index * 0.02 }}
                            className="group hover:bg-muted/50 cursor-pointer"
                            onClick={() => {
                              setSelectedOrder(order);
                              setViewDialogOpen(true);
                            }}
                          >
                            <TableCell className="font-mono text-sm font-medium text-right">
                              {order.order_number}
                            </TableCell>
                            <TableCell className="text-right">
                              <div>
                                <p className="font-medium">{language === 'ar' ? order.title_ar || order.title : order.title}</p>
                                {order.description && (
                                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                    {order.description}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{getStatusBadge(order.status)}</TableCell>
                            <TableCell className="font-medium text-right">{formatCurrency(order.total_amount)}</TableCell>
                            <TableCell className="text-muted-foreground text-right">{formatDate(order.created_at)}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedOrder(order);
                                    setViewDialogOpen(true);
                                  }}>
                                    <Eye className="h-4 w-4 ms-2" />
                                    {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {Object.entries(statusConfig).map(([key, config]) => (
                                    order.status !== key && (
                                      <DropdownMenuItem 
                                        key={key}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleStatusChange(order.id, key);
                                        }}
                                      >
                                        <config.icon className="h-4 w-4 ms-2" />
                                        {language === 'ar' ? `تحويل إلى ${config.labelAr}` : `Mark as ${config.labelEn}`}
                                      </DropdownMenuItem>
                                    )
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Order Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'تفاصيل الطلب' : 'Order Details'}
            </DialogTitle>
            <DialogDescription>
              {selectedOrder?.order_number}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Status Timeline */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg flex-row-reverse">
                {['completed', 'in_progress', 'processing', 'pending'].map((status, idx) => {
                  const config = statusConfig[status];
                  const Icon = config.icon;
                  const isActive = selectedOrder.status === status;
                  const statusOrder = ['pending', 'processing', 'in_progress', 'completed'];
                  const currentStatusIndex = statusOrder.indexOf(selectedOrder.status || '');
                  const thisStatusIndex = statusOrder.indexOf(status);
                  const isPast = currentStatusIndex >= thisStatusIndex;
                  
                  return (
                    <div key={status} className="flex items-center flex-row-reverse">
                      <div className={cn(
                        "flex flex-col items-center gap-1",
                        isPast ? "opacity-100" : "opacity-40"
                      )}>
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          isActive ? `${config.bgColor} ${config.color}` : isPast ? "bg-primary/10 text-primary" : "bg-muted"
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-medium">
                          {language === 'ar' ? config.labelAr : config.labelEn}
                        </span>
                      </div>
                      {idx < 3 && (
                        <div className={cn(
                          "w-12 h-0.5 mx-2",
                          isPast ? "bg-primary" : "bg-muted"
                        )} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 text-right">
                  <span className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'عنوان الطلب' : 'Order Title'}
                  </span>
                  <p className="font-medium">{language === 'ar' ? selectedOrder.title_ar || selectedOrder.title : selectedOrder.title}</p>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'المبلغ الإجمالي' : 'Total Amount'}
                  </span>
                  <p className="font-bold text-lg text-primary">{formatCurrency(selectedOrder.total_amount)}</p>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'تاريخ الإنشاء' : 'Created Date'}
                  </span>
                  <p className="font-medium">{formatDate(selectedOrder.created_at)}</p>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date'}
                  </span>
                  <p className="font-medium">{formatDate(selectedOrder.due_date)}</p>
                </div>
              </div>

              {selectedOrder.description && (
                <div className="space-y-1 text-right">
                  <span className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'الوصف' : 'Description'}
                  </span>
                  <p className="text-sm">{selectedOrder.description}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex-row-reverse sm:flex-row-reverse">
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              {language === 'ar' ? 'إغلاق' : 'Close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
