/**
 * Orders Management - Premium Dark Theme
 * Full CRUD with workflow management and real-time updates
 * Navigation-based order details (no popups)
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Zap,
  Radio,
  TrendingUp,
} from 'lucide-react';
import { db } from '@/integrations/supabase/db';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import { useSmsNotifications } from '@/hooks/useSmsNotifications';
import { SELLER_INFO } from '@/lib/invoices/constants';
import { type InvoiceData, downloadInvoicePdf } from '@/lib/invoices';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { sendOrderStatusEmail } from '@/lib/api/email-notifications';

// Import sub-components
import { OrdersStats } from './OrdersStats';
import { OrdersFilters } from './OrdersFilters';
import { OrderCard } from './OrderCard';
import { OrdersTable } from './OrdersTable';
import { OrdersPagination } from './OrdersPagination';

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
  customer?: {
    full_name: string | null;
    phone: string | null;
    email: string | null;
  } | null;
}

const ITEMS_PER_PAGE = 10;

export function OrdersManagement() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const navigate = useNavigate();
  
  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLive, setIsLive] = useState(true);

  // SMS Hook for status notifications
  const {
    notifyOrderStatus,
    notifyOrderProcessing,
    notifyOrderCompleted,
    notifyOrderCancelled,
  } = useSmsNotifications();

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await db
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch customer profiles for orders with customer_id
      const customerIds = [...new Set(ordersData?.filter(o => o.customer_id).map(o => o.customer_id) || [])];
      
      let customersMap: Record<string, { full_name: string | null; phone: string | null; email: string | null }> = {};
      
      if (customerIds.length > 0) {
        const { data: profilesData } = await db
          .from('profiles')
          .select('id, full_name, phone, email')
          .in('id', customerIds);
        
        profilesData?.forEach(p => {
          customersMap[p.id] = { full_name: p.full_name, phone: p.phone, email: p.email };
        });
      }

      // Merge customer data into orders
      const ordersWithCustomers = ordersData?.map(order => ({
        ...order,
        customer: order.customer_id ? customersMap[order.customer_id] || null : null,
      })) || [];

      setOrders(ordersWithCustomers);
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
      .channel('orders-realtime-v2')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          setIsLive(true);
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Stats
  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => ['processing', 'in_progress'].includes(o.status || '')).length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.total_amount || 0), 0),
  }), [orders]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customer?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Status config for notifications
  const statusLabels: Record<string, { ar: string; en: string }> = {
    pending: { ar: 'قيد الانتظار', en: 'Pending' },
    processing: { ar: 'قيد المعالجة', en: 'Processing' },
    in_progress: { ar: 'قيد التنفيذ', en: 'In Progress' },
    completed: { ar: 'مكتمل', en: 'Completed' },
    cancelled: { ar: 'ملغي', en: 'Cancelled' },
    refunded: { ar: 'مسترد', en: 'Refunded' },
  };

  // Handle status change with SMS notification
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const order = orders.find(o => o.id === orderId);
    const previousStatus = order?.status;
    
    try {
      const { error } = await db
        .from('orders')
        .update({ status: newStatus as any })
        .eq('id', orderId);

      if (error) throw error;
      
      toast({ 
        title: isRTL ? 'تم تحديث حالة الطلب' : 'Order status updated' 
      });
      
      // Send SMS notification based on status
      if (order?.customer?.phone) {
        const phone = order.customer.phone;
        const orderNumber = order.order_number;
        
        let smsResult;
        
        switch (newStatus) {
          case 'processing':
            smsResult = await notifyOrderProcessing(phone, orderNumber);
            break;
          case 'completed':
            smsResult = await notifyOrderCompleted(phone, orderNumber);
            break;
          case 'cancelled':
            smsResult = await notifyOrderCancelled(phone, orderNumber);
            break;
          default:
            const statusLabel = isRTL 
              ? statusLabels[newStatus]?.ar 
              : statusLabels[newStatus]?.en;
            smsResult = await notifyOrderStatus(phone, orderNumber, statusLabel || newStatus);
        }

        if (smsResult?.success) {
          toast({
            title: isRTL ? 'تم إرسال رسالة SMS للعميل' : 'SMS sent to customer',
            description: order.customer.phone,
          });
        }
      }
      
      // Send email notification to customer
      if (order?.customer?.email && order.customer_id) {
        sendOrderStatusEmail({
          orderId: orderId,
          orderNumber: order.order_number,
          customerEmail: order.customer.email,
          customerName: order.customer.full_name || '',
          customerPhone: order.customer.phone || undefined,
          serviceName: order.title,
          serviceNameAr: order.title_ar || undefined,
          totalAmount: order.total_amount || 0,
          currency: order.currency || 'SAR',
          status: newStatus,
          previousStatus: previousStatus || undefined,
        }).catch(err => console.error('Email notification failed:', err));
      }
    } catch (err) {
      console.error('Error updating order:', err);
      toast({
        title: isRTL ? 'خطأ في تحديث الطلب' : 'Error updating order',
        variant: 'destructive',
      });
    }
  };

  // Handle price update
  const handlePriceUpdate = async (orderId: string, newPrice: number) => {
    try {
      const { error } = await db
        .from('orders')
        .update({ total_amount: newPrice })
        .eq('id', orderId);

      if (error) throw error;
      
      toast({ 
        title: isRTL ? 'تم تحديث المبلغ' : 'Amount updated' 
      });
    } catch (err) {
      console.error('Error updating price:', err);
      toast({
        title: isRTL ? 'خطأ في تحديث المبلغ' : 'Error updating amount',
        variant: 'destructive',
      });
    }
  };

  // Copy order number
  const copyOrderNumber = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber);
    toast({
      title: isRTL ? 'تم نسخ رقم الطلب' : 'Order number copied',
    });
  };

  // Handle PDF download
  const handleDownloadPDF = async (order: Order) => {
    try {
      toast({
        title: isRTL ? 'جاري إنشاء الفاتورة...' : 'Generating invoice...',
      });

      const customerName = order.customer?.full_name || (isRTL ? 'عميل' : 'Customer');
      const customerPhone = order.customer?.phone || '0555812567';

      const invoiceData: InvoiceData = {
        invoiceNumber: order.order_number,
        date: order.created_at || new Date().toISOString(),
        dueDate: order.due_date || undefined,
        status: order.status || 'pending',
        
        seller: {
          name: SELLER_INFO.name_ar,
          address: SELLER_INFO.address_ar,
          vatNumber: SELLER_INFO.vat,
        },
        
        buyer: {
          name: customerName,
          phone: customerPhone,
          email: order.customer?.email || undefined,
        },
        
        items: [{
          description: isRTL ? (order.title_ar || order.title) : order.title,
          quantity: 1,
          unitPrice: order.total_amount || 0,
        }],
        
        subtotal: order.total_amount || 0,
        vatRate: 0.15,
        vatAmount: (order.total_amount || 0) * 0.15,
        total: (order.total_amount || 0) * 1.15,
        
        currency: order.currency || 'SAR',
        notes: order.description || undefined,
      };

      const success = await downloadInvoicePdf(invoiceData);

      if (!success) {
        toast({
          title: isRTL ? 'خطأ في إنشاء الفاتورة' : 'Error generating invoice',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: isRTL ? 'تم تحميل الفاتورة بنجاح' : 'Invoice downloaded successfully',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: isRTL ? 'خطأ في إنشاء الفاتورة' : 'Error generating invoice',
        variant: 'destructive',
      });
    }
  };

  // View details
  const handleViewDetails = (orderId: string) => {
    navigate(`/adminash/orders/${orderId}`);
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a]" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="space-y-6 p-4 lg:p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 lg:p-8 border border-slate-800"
        >
          {/* Background effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 start-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 end-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">
                  {isRTL ? 'إدارة الطلبات' : 'Orders Management'}
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  {isRTL ? 'تتبع وإدارة جميع طلباتك في مكان واحد' : 'Track and manage all your orders in one place'}
                </p>
              </div>
            </div>
            
            {/* Live indicator */}
            <div className="flex items-center gap-4">
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
                isLive 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              )}>
                <Radio className={cn("h-3 w-3", isLive && "animate-pulse")} />
                {isLive ? (isRTL ? 'مباشر' : 'LIVE') : (isRTL ? 'غير متصل' : 'OFFLINE')}
              </div>
              
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-xs text-slate-300">
                  {stats.total} {isRTL ? 'طلب' : 'orders'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <OrdersStats stats={stats} isRTL={isRTL} />

        {/* Filters */}
        <OrdersFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          isRTL={isRTL}
        />

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <p className="text-sm text-slate-400">
              {isRTL ? 'جاري تحميل الطلبات...' : 'Loading orders...'}
            </p>
          </div>
        ) : paginatedOrders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 gap-4 rounded-xl bg-[#0f1629] border border-slate-800"
          >
            <div className="p-6 rounded-full bg-slate-800/50">
              <ShoppingCart className="h-16 w-16 text-slate-600" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-white text-lg">
                {isRTL ? 'لا توجد طلبات' : 'No orders found'}
              </p>
              <p className="text-sm text-slate-400 mt-2 max-w-md">
                {isRTL 
                  ? 'جرب تغيير معايير البحث أو الفلتر للعثور على ما تبحث عنه' 
                  : 'Try adjusting your search or filter criteria to find what you\'re looking for'}
              </p>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {paginatedOrders.map((order, index) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    index={index}
                    isRTL={isRTL}
                    onStatusChange={handleStatusChange}
                    onViewDetails={handleViewDetails}
                    onDownloadPDF={handleDownloadPDF}
                    onCopyOrderNumber={copyOrderNumber}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <OrdersTable
                  orders={paginatedOrders}
                  isRTL={isRTL}
                  onStatusChange={handleStatusChange}
                  onViewDetails={handleViewDetails}
                  onDownloadPDF={handleDownloadPDF}
                  onCopyOrderNumber={copyOrderNumber}
                  onPriceUpdate={handlePriceUpdate}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Pagination */}
        {!loading && filteredOrders.length > 0 && (
          <OrdersPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredOrders.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            isRTL={isRTL}
          />
        )}
      </div>
    </div>
  );
}
