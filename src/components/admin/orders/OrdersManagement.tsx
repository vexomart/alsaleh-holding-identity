/**
 * Orders Management - Modern Enterprise Design
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
  CreditCard,
  TrendingUp,
  BarChart3,
  FileText,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  Hash
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
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
  DropdownMenuLabel,
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
import { ScrollArea } from '@/components/ui/scroll-area';
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
  borderColor: string;
  icon: React.ElementType;
  gradient: string;
}> = {
  pending: { 
    labelAr: "قيد الانتظار", 
    labelEn: "Pending", 
    color: "text-amber-600 dark:text-amber-400", 
    bgColor: "bg-amber-50 dark:bg-amber-950/50",
    borderColor: "border-amber-200 dark:border-amber-800",
    icon: Clock,
    gradient: "from-amber-500 to-orange-500"
  },
  processing: { 
    labelAr: "قيد المعالجة", 
    labelEn: "Processing", 
    color: "text-blue-600 dark:text-blue-400", 
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
    borderColor: "border-blue-200 dark:border-blue-800",
    icon: Package,
    gradient: "from-blue-500 to-cyan-500"
  },
  in_progress: { 
    labelAr: "قيد التنفيذ", 
    labelEn: "In Progress", 
    color: "text-indigo-600 dark:text-indigo-400", 
    bgColor: "bg-indigo-50 dark:bg-indigo-950/50",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    icon: Truck,
    gradient: "from-indigo-500 to-purple-500"
  },
  completed: { 
    labelAr: "مكتمل", 
    labelEn: "Completed", 
    color: "text-emerald-600 dark:text-emerald-400", 
    bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    icon: CheckCircle,
    gradient: "from-emerald-500 to-green-500"
  },
  cancelled: { 
    labelAr: "ملغي", 
    labelEn: "Cancelled", 
    color: "text-red-600 dark:text-red-400", 
    bgColor: "bg-red-50 dark:bg-red-950/50",
    borderColor: "border-red-200 dark:border-red-800",
    icon: XCircle,
    gradient: "from-red-500 to-rose-500"
  },
  refunded: { 
    labelAr: "مسترد", 
    labelEn: "Refunded", 
    color: "text-purple-600 dark:text-purple-400", 
    bgColor: "bg-purple-50 dark:bg-purple-950/50",
    borderColor: "border-purple-200 dark:border-purple-800",
    icon: CreditCard,
    gradient: "from-purple-500 to-pink-500"
  },
};

const priorityConfig: Record<number, { labelAr: string; labelEn: string; color: string }> = {
  1: { labelAr: 'منخفضة', labelEn: 'Low', color: 'text-slate-500' },
  2: { labelAr: 'متوسطة', labelEn: 'Medium', color: 'text-amber-500' },
  3: { labelAr: 'عالية', labelEn: 'High', color: 'text-red-500' },
};

export function OrdersManagement() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
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
        title: isRTL ? 'خطأ في جلب الطلبات' : 'Error fetching orders',
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

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle status change
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await db
        .from('orders')
        .update({ status: newStatus as any })
        .eq('id', orderId);

      if (error) throw error;
      
      toast({ 
        title: isRTL ? 'تم تحديث حالة الطلب' : 'Order status updated' 
      });
    } catch (err) {
      console.error('Error updating order:', err);
      toast({
        title: isRTL ? 'خطأ في تحديث الطلب' : 'Error updating order',
        variant: 'destructive',
      });
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-';
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const getStatusBadge = (status: string | null) => {
    const config = statusConfig[status || 'pending'];
    const Icon = config.icon;
    return (
      <div className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.bgColor,
        config.color,
        config.borderColor
      )}>
        <Icon className="h-3 w-3" />
        {isRTL ? config.labelAr : config.labelEn}
      </div>
    );
  };

  const copyOrderNumber = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber);
    toast({
      title: isRTL ? 'تم نسخ رقم الطلب' : 'Order number copied',
    });
  };

  // Stats cards data
  const statsCards = [
    { 
      key: 'total',
      label: isRTL ? 'إجمالي الطلبات' : 'Total Orders', 
      value: stats.total, 
      icon: ShoppingCart, 
      gradient: 'from-primary to-primary/70',
      bgGradient: 'from-primary/10 to-primary/5',
      change: '+12%'
    },
    { 
      key: 'pending',
      label: isRTL ? 'قيد الانتظار' : 'Pending', 
      value: stats.pending, 
      icon: Clock, 
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-500/10 to-orange-500/5',
      change: '-3%'
    },
    { 
      key: 'inProgress',
      label: isRTL ? 'قيد التنفيذ' : 'In Progress', 
      value: stats.inProgress, 
      icon: Truck, 
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/5',
      change: '+8%'
    },
    { 
      key: 'completed',
      label: isRTL ? 'مكتمل' : 'Completed', 
      value: stats.completed, 
      icon: CheckCircle, 
      gradient: 'from-emerald-500 to-green-500',
      bgGradient: 'from-emerald-500/10 to-green-500/5',
      change: '+24%'
    },
    { 
      key: 'revenue',
      label: isRTL ? 'الإيرادات' : 'Revenue', 
      value: formatCurrency(stats.totalRevenue), 
      icon: TrendingUp, 
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/5',
      change: '+18%',
      isRevenue: true
    },
  ];

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="space-y-6 p-6">
        {/* Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 via-primary to-primary/80 p-8 text-white"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          </div>
          
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <ShoppingCart className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">
                    {isRTL ? 'إدارة الطلبات' : 'Order Management'}
                  </h1>
                  <p className="text-white/80 text-sm mt-1">
                    {isRTL ? 'تتبع وإدارة جميع طلباتك في مكان واحد' : 'Track and manage all your orders in one place'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <Button 
                className="bg-white text-primary hover:bg-white/90 shadow-lg gap-2 min-w-fit"
                size="lg"
              >
                <Plus className="h-5 w-5 shrink-0" />
                <span>{isRTL ? 'طلب جديد' : 'New Order'}</span>
              </Button>
              <Button 
                variant="outline" 
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 gap-2 min-w-fit"
              >
                <Download className="h-4 w-4 shrink-0" />
                <span>{isRTL ? 'تصدير' : 'Export'}</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                onClick={() => {
                  setRefreshing(true);
                  fetchOrders();
                }}
                disabled={refreshing}
              >
                <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={cn(
                "relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer",
                `bg-gradient-to-br ${stat.bgGradient}`
              )}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-20 rounded-full -translate-y-1/2 translate-x-1/2" 
                  style={{ background: `linear-gradient(135deg, var(--primary), transparent)` }}
                />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className={cn(
                      "p-2.5 rounded-xl bg-gradient-to-br shadow-lg",
                      stat.gradient
                    )}>
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-medium bg-white/80 dark:bg-slate-800/80">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="mt-4 space-y-1">
                    <p className={cn(
                      "text-2xl font-bold",
                      stat.isRevenue ? "text-purple-600 dark:text-purple-400" : "text-foreground"
                    )}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg overflow-hidden">
            {/* Tabs Header */}
            <div className="border-b bg-muted/30">
              <div className="p-4">
                <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setCurrentPage(1); }} className="w-full">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <TabsList className="grid w-full lg:w-auto grid-cols-4 h-11 p-1 bg-muted/50">
                      <TabsTrigger value="all" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">
                        {isRTL ? 'الكل' : 'All'}
                        <span className="hidden sm:inline px-1.5 py-0.5 rounded-md bg-muted text-[10px] font-semibold">
                          {orders.length}
                        </span>
                      </TabsTrigger>
                      <TabsTrigger value="pending" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                        {isRTL ? 'انتظار' : 'Pending'}
                        <span className="hidden sm:inline px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 text-[10px] font-semibold">
                          {stats.pending}
                        </span>
                      </TabsTrigger>
                      <TabsTrigger value="active" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                        {isRTL ? 'نشط' : 'Active'}
                        <span className="hidden sm:inline px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-[10px] font-semibold">
                          {stats.inProgress}
                        </span>
                      </TabsTrigger>
                      <TabsTrigger value="completed" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                        {isRTL ? 'مكتمل' : 'Done'}
                        <span className="hidden sm:inline px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
                          {stats.completed}
                        </span>
                      </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-3">
                      <div className="relative flex-1 lg:w-72">
                        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={isRTL ? 'بحث برقم الطلب أو العنوان...' : 'Search by order # or title...'}
                          value={searchQuery}
                          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                          className="ps-10 h-11 bg-white dark:bg-slate-900 border-muted"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                        <SelectTrigger className="w-[180px] h-11 bg-white dark:bg-slate-900">
                          <Filter className="h-4 w-4 me-2 text-muted-foreground" />
                          <SelectValue placeholder={isRTL ? 'فلتر الحالة' : 'Filter Status'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{isRTL ? 'جميع الحالات' : 'All Status'}</SelectItem>
                          <Separator className="my-1" />
                          {Object.entries(statusConfig).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <config.icon className={cn("h-3.5 w-3.5", config.color)} />
                                {isRTL ? config.labelAr : config.labelEn}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <TabsContent value={activeTab} className="mt-0">
                    {/* Table Content moved outside for consistent rendering */}
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Table Content */}
            <CardContent className="p-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'جاري تحميل الطلبات...' : 'Loading orders...'}
                  </p>
                </div>
              ) : paginatedOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="p-4 rounded-full bg-muted/50">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-foreground">
                      {isRTL ? 'لا توجد طلبات' : 'No orders found'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {isRTL ? 'جرب تغيير معايير البحث أو الفلتر' : 'Try adjusting your search or filter criteria'}
                    </p>
                  </div>
                  <Button variant="outline" className="mt-2 gap-2">
                    <Plus className="h-4 w-4" />
                    {isRTL ? 'إضافة طلب جديد' : 'Add New Order'}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                          <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">
                            {isRTL ? 'التاريخ' : 'Date'}
                          </TableHead>
                          <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">
                            {isRTL ? 'المبلغ' : 'Amount'}
                          </TableHead>
                          <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">
                            {isRTL ? 'الحالة' : 'Status'}
                          </TableHead>
                          <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">
                            {isRTL ? 'العنوان' : 'Title'}
                          </TableHead>
                          <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">
                            {isRTL ? 'رقم الطلب' : 'Order #'}
                          </TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence mode="popLayout">
                          {paginatedOrders.map((order, index) => (
                            <motion.tr
                              key={order.id}
                              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                              transition={{ delay: index * 0.03 }}
                              className="group hover:bg-muted/50 cursor-pointer border-b last:border-0"
                              onClick={() => {
                                setSelectedOrder(order);
                                setViewDialogOpen(true);
                              }}
                            >
                              <TableCell className="text-right">
                                <div className="space-y-0.5">
                                  <p className="text-sm">{formatDate(order.created_at)}</p>
                                  <p className="text-xs text-muted-foreground">{formatTime(order.created_at)}</p>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <span className="font-semibold">
                                  {formatCurrency(order.total_amount)}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                {getStatusBadge(order.status)}
                              </TableCell>
                              <TableCell className="min-w-[250px] max-w-[350px] text-right">
                                <div className="space-y-0.5">
                                  <p className="font-medium line-clamp-2">
                                    {isRTL ? order.title_ar || order.title : order.title}
                                  </p>
                                  {order.description && (
                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                      {order.description}
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center gap-2 justify-end">
                                  <span className="font-mono text-sm font-semibold text-primary">
                                    {order.order_number}
                                  </span>
                                  <div className="p-1.5 rounded-lg bg-primary/10">
                                    <Hash className="h-3.5 w-3.5 text-primary" />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="w-[50px]">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                                      {isRTL ? 'إجراءات' : 'Actions'}
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedOrder(order);
                                      setViewDialogOpen(true);
                                    }}>
                                      <Eye className="h-4 w-4 me-2" />
                                      {isRTL ? 'عرض التفاصيل' : 'View Details'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      copyOrderNumber(order.order_number);
                                    }}>
                                      <Copy className="h-4 w-4 me-2" />
                                      {isRTL ? 'نسخ الرقم' : 'Copy Number'}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                                      {isRTL ? 'تغيير الحالة' : 'Change Status'}
                                    </DropdownMenuLabel>
                                    {Object.entries(statusConfig).map(([key, config]) => (
                                      order.status !== key && (
                                        <DropdownMenuItem 
                                          key={key}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleStatusChange(order.id, key);
                                          }}
                                          className="gap-2"
                                        >
                                          <config.icon className={cn("h-4 w-4", config.color)} />
                                          {isRTL ? config.labelAr : config.labelEn}
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/20">
                      <p className="text-sm text-muted-foreground">
                        {isRTL 
                          ? `عرض ${(currentPage - 1) * itemsPerPage + 1} إلى ${Math.min(currentPage * itemsPerPage, filteredOrders.length)} من ${filteredOrders.length} طلب`
                          : `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredOrders.length)} of ${filteredOrders.length} orders`
                        }
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="gap-1"
                        >
                          {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                          {isRTL ? 'السابق' : 'Previous'}
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className="w-8 h-8 p-0"
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="gap-1"
                        >
                          {isRTL ? 'التالي' : 'Next'}
                          {isRTL ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* View Order Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
          {selectedOrder && (
            <>
              {/* Dialog Header with gradient */}
              <div className={cn(
                "p-6 text-white",
                `bg-gradient-to-r ${statusConfig[selectedOrder.status || 'pending'].gradient}`
              )}>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                        <ShoppingCart className="h-6 w-6" />
                      </div>
                      <div>
                        <DialogTitle className="text-xl font-bold text-white">
                          {isRTL ? 'تفاصيل الطلب' : 'Order Details'}
                        </DialogTitle>
                        <DialogDescription className="text-white/80 mt-0.5">
                          {selectedOrder.order_number}
                        </DialogDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyOrderNumber(selectedOrder.order_number)}
                      className="text-white hover:bg-white/20"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </DialogHeader>
              </div>

              <div className="p-6 space-y-6">
                {/* Status Timeline */}
                <div className="p-4 bg-muted/30 rounded-xl">
                  <p className="text-xs font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                    {isRTL ? 'مسار الطلب' : 'Order Progress'}
                  </p>
                  <div className="flex items-center justify-between">
                    {['pending', 'processing', 'in_progress', 'completed'].map((status, idx) => {
                      const config = statusConfig[status];
                      const Icon = config.icon;
                      const statusOrder = ['pending', 'processing', 'in_progress', 'completed'];
                      const currentStatusIndex = statusOrder.indexOf(selectedOrder.status || '');
                      const thisStatusIndex = statusOrder.indexOf(status);
                      const isActive = selectedOrder.status === status;
                      const isPast = currentStatusIndex >= thisStatusIndex;
                      
                      return (
                        <div key={status} className="flex items-center flex-1">
                          <div className={cn(
                            "flex flex-col items-center gap-2 relative z-10",
                            isPast ? "opacity-100" : "opacity-40"
                          )}>
                            <div className={cn(
                              "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                              isActive 
                                ? `bg-gradient-to-br ${config.gradient} text-white shadow-lg`
                                : isPast 
                                  ? "bg-primary text-white" 
                                  : "bg-muted text-muted-foreground"
                            )}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <span className={cn(
                              "text-xs font-medium text-center",
                              isActive ? config.color : "text-muted-foreground"
                            )}>
                              {isRTL ? config.labelAr : config.labelEn}
                            </span>
                          </div>
                          {idx < 3 && (
                            <div className="flex-1 h-1 mx-2 rounded-full overflow-hidden bg-muted">
                              <div 
                                className={cn(
                                  "h-full transition-all duration-500",
                                  isPast ? "bg-primary w-full" : "w-0"
                                )} 
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border bg-card">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">
                          {isRTL ? 'عنوان الطلب' : 'Order Title'}
                        </span>
                      </div>
                      <p className="font-semibold">
                        {isRTL ? selectedOrder.title_ar || selectedOrder.title : selectedOrder.title}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border bg-card">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">
                          {isRTL ? 'تاريخ الإنشاء' : 'Created Date'}
                        </span>
                      </div>
                      <p className="font-semibold">{formatDate(selectedOrder.created_at)}</p>
                      <p className="text-xs text-muted-foreground">{formatTime(selectedOrder.created_at)}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border bg-card">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <CreditCard className="h-4 w-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">
                          {isRTL ? 'المبلغ الإجمالي' : 'Total Amount'}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(selectedOrder.total_amount)}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border bg-card">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">
                          {isRTL ? 'تاريخ الاستحقاق' : 'Due Date'}
                        </span>
                      </div>
                      <p className="font-semibold">
                        {selectedOrder.due_date ? formatDate(selectedOrder.due_date) : (isRTL ? 'غير محدد' : 'Not set')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedOrder.description && (
                  <div className="p-4 rounded-xl border bg-card">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-xs font-medium uppercase tracking-wider">
                        {isRTL ? 'الوصف' : 'Description'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedOrder.description}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <Select 
                    value={selectedOrder.status || 'pending'} 
                    onValueChange={(v) => handleStatusChange(selectedOrder.id, v)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <config.icon className={cn("h-4 w-4", config.color)} />
                            {isRTL ? config.labelAr : config.labelEn}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                    {isRTL ? 'إغلاق' : 'Close'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
