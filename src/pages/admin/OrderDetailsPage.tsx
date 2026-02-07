/**
 * Order Details Page - Internal Admin Page
 * Full-featured order management with SMS notifications
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ShoppingCart,
  User,
  Calendar,
  CreditCard,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Truck,
  Copy,
  Download,
  Send,
  MessageSquare,
  Phone,
  Mail,
  Edit,
  Save,
  RefreshCw,
  AlertCircle,
  History,
  Bell,
  Loader2,
  Hash,
  MapPin,
  Building,
  Banknote,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { db } from '@/integrations/supabase/db';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import { useSmsNotifications } from '@/hooks/useSmsNotifications';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { OrderInvoiceSection } from '@/components/orders/OrderInvoiceSection';
import { sendOrderStatusEmail } from '@/lib/api/email-notifications';
import { SELLER_INFO } from '@/lib/invoices/constants';
import { type InvoiceData, downloadInvoicePdf } from '@/lib/invoices';

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
    national_id?: string | null;
    city?: string | null;
  } | null;
  service?: {
    name: string | null;
    name_ar: string | null;
  } | null;
}

interface OrderEvent {
  id: string;
  event_type: string;
  previous_value: any;
  new_value: any;
  created_at: string;
  performed_by: string | null;
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
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    icon: Clock,
    gradient: "from-amber-500 to-amber-600"
  },
  processing: {
    labelAr: "قيد المعالجة",
    labelEn: "Processing",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    icon: Package,
    gradient: "from-blue-500 to-blue-600"
  },
  in_progress: {
    labelAr: "قيد التنفيذ",
    labelEn: "In Progress",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    icon: Truck,
    gradient: "from-purple-500 to-purple-600"
  },
  completed: {
    labelAr: "مكتمل",
    labelEn: "Completed",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    icon: CheckCircle,
    gradient: "from-emerald-500 to-emerald-600"
  },
  cancelled: {
    labelAr: "ملغي",
    labelEn: "Cancelled",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    icon: XCircle,
    gradient: "from-red-500 to-red-600"
  },
  refunded: {
    labelAr: "مسترد",
    labelEn: "Refunded",
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
    borderColor: "border-slate-500/30",
    icon: CreditCard,
    gradient: "from-slate-500 to-slate-600"
  },
};

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [order, setOrder] = useState<Order | null>(null);
  const [events, setEvents] = useState<OrderEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingSms, setSendingSms] = useState(false);
  const [customSmsMessage, setCustomSmsMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Partial<Order>>({});
  
  // SMS Hook
  const {
    notifyOrderStatus,
    notifyOrderProcessing,
    notifyOrderCompleted,
    notifyOrderCancelled,
    sendCustomSms,
  } = useSmsNotifications();

  // Fetch order data
  const fetchOrder = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      // Fetch order
      const { data: orderData, error: orderError } = await db
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (orderError) throw orderError;

      // Fetch customer profile
      let customer = null;
      if (orderData.customer_id) {
        const { data: profileData } = await db
          .from('profiles')
          .select('id, full_name, phone, email, national_id, city')
          .eq('id', orderData.customer_id)
          .single();
        customer = profileData;
      }

      // Fetch service if exists
      let service = null;
      if (orderData.service_id) {
        const { data: serviceData } = await db
          .from('services')
          .select('id, name, name_ar')
          .eq('id', orderData.service_id)
          .single();
        service = serviceData;
      }

      setOrder({ ...orderData, customer, service });
      setEditedOrder(orderData);

      // Fetch order events/history
      const { data: eventsData } = await db
        .from('order_events')
        .select('*')
        .eq('order_id', id)
        .order('created_at', { ascending: false });

      setEvents(eventsData || []);
    } catch (err) {
      console.error('Error fetching order:', err);
      toast({
        title: isRTL ? 'خطأ في جلب تفاصيل الطلب' : 'Error fetching order details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    // Real-time subscription for order updates
    const channel = supabase
      .channel(`order-${id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `id=eq.${id}` },
        () => fetchOrder()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  // Handle status change with SMS notification
  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    
    const previousStatus = order.status;
    
    try {
      setSaving(true);
      
      const { error } = await db
        .from('orders')
        .update({ status: newStatus as any })
        .eq('id', order.id);

      if (error) throw error;

      toast({
        title: isRTL ? 'تم تحديث حالة الطلب' : 'Order status updated',
      });

      // Send SMS notification based on status
      if (order.customer?.phone) {
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
              ? statusConfig[newStatus]?.labelAr 
              : statusConfig[newStatus]?.labelEn;
            smsResult = await notifyOrderStatus(phone, orderNumber, statusLabel || newStatus);
        }

        if (smsResult?.success) {
          toast({
            title: isRTL ? 'تم إرسال رسالة SMS للعميل' : 'SMS sent to customer',
            description: order.customer.phone,
          });
        }
      }

      // Send email notification
      if (order.customer?.email && order.customer_id) {
        sendOrderStatusEmail({
          orderId: order.id,
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

      // Refresh order data
      fetchOrder();
    } catch (err) {
      console.error('Error updating order:', err);
      toast({
        title: isRTL ? 'خطأ في تحديث الطلب' : 'Error updating order',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Send custom SMS
  const handleSendCustomSms = async () => {
    if (!order?.customer?.phone || !customSmsMessage.trim()) return;
    
    try {
      setSendingSms(true);
      const result = await sendCustomSms(order.customer.phone, customSmsMessage);
      
      if (result.success) {
        toast({
          title: isRTL ? 'تم إرسال الرسالة' : 'Message sent',
        });
        setCustomSmsMessage('');
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('Error sending SMS:', err);
      toast({
        title: isRTL ? 'خطأ في إرسال الرسالة' : 'Error sending message',
        variant: 'destructive',
      });
    } finally {
      setSendingSms(false);
    }
  };

  // Save edited order
  const handleSaveOrder = async () => {
    if (!order) return;
    
    try {
      setSaving(true);
      
      const { error } = await db
        .from('orders')
        .update({
          title: editedOrder.title,
          title_ar: editedOrder.title_ar,
          description: editedOrder.description,
          total_amount: editedOrder.total_amount,
          priority: editedOrder.priority,
          due_date: editedOrder.due_date,
        })
        .eq('id', order.id);

      if (error) throw error;

      toast({
        title: isRTL ? 'تم حفظ التغييرات' : 'Changes saved',
      });
      
      setEditMode(false);
      fetchOrder();
    } catch (err) {
      console.error('Error saving order:', err);
      toast({
        title: isRTL ? 'خطأ في حفظ التغييرات' : 'Error saving changes',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!order) return;
    
    try {
      toast({
        title: isRTL ? 'جاري إنشاء الفاتورة...' : 'Generating invoice...',
      });

      const customerName = order.customer?.full_name || (isRTL ? 'عميل' : 'Customer');
      const customerPhone = order.customer?.phone || '';

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

      if (success) {
        toast({
          title: isRTL ? 'تم تحميل الفاتورة' : 'Invoice downloaded',
        });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: isRTL ? 'خطأ في إنشاء الفاتورة' : 'Error generating invoice',
        variant: 'destructive',
      });
    }
  };

  const copyOrderNumber = () => {
    if (order?.order_number) {
      navigator.clipboard.writeText(order.order_number);
      toast({
        title: isRTL ? 'تم نسخ رقم الطلب' : 'Order number copied',
      });
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">
            {isRTL ? 'جاري تحميل تفاصيل الطلب...' : 'Loading order details...'}
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="h-16 w-16 text-muted-foreground" />
        <p className="text-xl font-medium">
          {isRTL ? 'الطلب غير موجود' : 'Order not found'}
        </p>
        <Button onClick={() => navigate('/adminash/orders')}>
          <ArrowRight className="h-4 w-4 me-2" />
          {isRTL ? 'العودة للطلبات' : 'Back to Orders'}
        </Button>
      </div>
    );
  }

  const currentStatus = statusConfig[order.status || 'pending'];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="space-y-6 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "relative overflow-hidden rounded-2xl p-6 text-white",
            `bg-gradient-to-br ${currentStatus.gradient}`
          )}
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/adminash/orders')}
                className="text-white hover:bg-white/20 gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                {isRTL ? 'العودة' : 'Back'}
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyOrderNumber}
                  className="text-white hover:bg-white/20"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={fetchOrder}
                  className="text-white hover:bg-white/20"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <ShoppingCart className="h-10 w-10" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{order.order_number}</h1>
                  <p className="text-white/80 mt-1">
                    {isRTL ? order.title_ar || order.title : order.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <StatusIcon className="h-5 w-5" />
                  <span className="font-medium">
                    {isRTL ? currentStatus.labelAr : currentStatus.labelEn}
                  </span>
                </div>
                <div className="text-2xl font-bold">
                  {formatCurrency(order.total_amount)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    {isRTL ? 'مسار الطلب' : 'Order Progress'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    {['pending', 'processing', 'in_progress', 'completed'].map((status, idx) => {
                      const config = statusConfig[status];
                      const Icon = config.icon;
                      const statusOrder = ['pending', 'processing', 'in_progress', 'completed'];
                      const currentStatusIndex = statusOrder.indexOf(order.status || '');
                      const thisStatusIndex = statusOrder.indexOf(status);
                      const isActive = order.status === status;
                      const isPast = currentStatusIndex >= thisStatusIndex;

                      return (
                        <div key={status} className="flex items-center flex-1">
                          <div className={cn(
                            "flex flex-col items-center gap-2 relative z-10",
                            isPast ? "opacity-100" : "opacity-40"
                          )}>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleStatusChange(status)}
                              className={cn(
                                "w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300",
                                isActive
                                  ? `bg-gradient-to-br ${config.gradient} text-white shadow-lg`
                                  : isPast
                                    ? "bg-primary text-white"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                              )}
                            >
                              <Icon className="h-6 w-6" />
                            </motion.div>
                            <span className={cn(
                              "text-xs font-medium text-center",
                              isActive ? config.color : "text-muted-foreground"
                            )}>
                              {isRTL ? config.labelAr : config.labelEn}
                            </span>
                          </div>
                          {idx < 3 && (
                            <div className="flex-1 h-1 mx-2 rounded-full overflow-hidden bg-muted">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: isPast ? '100%' : '0%' }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="h-full bg-primary"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick Status Actions */}
                  <div className="mt-6 pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-3">
                      {isRTL ? 'تغيير سريع للحالة:' : 'Quick status change:'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(statusConfig).map(([key, config]) => (
                        order.status !== key && (
                          <Button
                            key={key}
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(key)}
                            disabled={saving}
                            className={cn(
                              "gap-2",
                              config.color,
                              config.borderColor,
                              config.bgColor,
                              "hover:opacity-80"
                            )}
                          >
                            <config.icon className="h-4 w-4" />
                            {isRTL ? config.labelAr : config.labelEn}
                          </Button>
                        )
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {isRTL ? 'تفاصيل الطلب' : 'Order Details'}
                  </CardTitle>
                  <Button
                    variant={editMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => editMode ? handleSaveOrder() : setEditMode(true)}
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : editMode ? (
                      <>
                        <Save className="h-4 w-4 me-2" />
                        {isRTL ? 'حفظ' : 'Save'}
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 me-2" />
                        {isRTL ? 'تعديل' : 'Edit'}
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title */}
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">
                        {isRTL ? 'العنوان' : 'Title'}
                      </label>
                      {editMode ? (
                        <Input
                          value={editedOrder.title || ''}
                          onChange={(e) => setEditedOrder({ ...editedOrder, title: e.target.value })}
                        />
                      ) : (
                        <p className="font-medium">{order.title}</p>
                      )}
                    </div>

                    {/* Arabic Title */}
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">
                        {isRTL ? 'العنوان بالعربي' : 'Arabic Title'}
                      </label>
                      {editMode ? (
                        <Input
                          value={editedOrder.title_ar || ''}
                          onChange={(e) => setEditedOrder({ ...editedOrder, title_ar: e.target.value })}
                          dir="rtl"
                        />
                      ) : (
                        <p className="font-medium">{order.title_ar || '-'}</p>
                      )}
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">
                        {isRTL ? 'المبلغ' : 'Amount'}
                      </label>
                      {editMode ? (
                        <Input
                          type="number"
                          value={editedOrder.total_amount || ''}
                          onChange={(e) => setEditedOrder({ ...editedOrder, total_amount: parseFloat(e.target.value) })}
                        />
                      ) : (
                        <p className="text-2xl font-bold text-primary">
                          {formatCurrency(order.total_amount)}
                        </p>
                      )}
                    </div>

                    {/* Due Date */}
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">
                        {isRTL ? 'تاريخ الاستحقاق' : 'Due Date'}
                      </label>
                      {editMode ? (
                        <Input
                          type="date"
                          value={editedOrder.due_date?.split('T')[0] || ''}
                          onChange={(e) => setEditedOrder({ ...editedOrder, due_date: e.target.value })}
                        />
                      ) : (
                        <p className="font-medium">
                          {order.due_date ? formatDate(order.due_date) : (isRTL ? 'غير محدد' : 'Not set')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">
                      {isRTL ? 'الوصف' : 'Description'}
                    </label>
                    {editMode ? (
                      <Textarea
                        value={editedOrder.description || ''}
                        onChange={(e) => setEditedOrder({ ...editedOrder, description: e.target.value })}
                        rows={3}
                      />
                    ) : (
                      <p className="text-muted-foreground">
                        {order.description || (isRTL ? 'لا يوجد وصف' : 'No description')}
                      </p>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        {isRTL ? 'تاريخ الإنشاء' : 'Created'}
                      </p>
                      <p className="text-sm font-medium">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        {isRTL ? 'آخر تحديث' : 'Last Updated'}
                      </p>
                      <p className="text-sm font-medium">{formatDate(order.updated_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Invoice Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {isRTL ? 'الفاتورة' : 'Invoice'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <OrderInvoiceSection
                    orderId={order.id}
                    orderNumber={order.order_number}
                    orderTitle={order.title}
                    orderTitleAr={order.title_ar}
                    orderDescription={order.description}
                    totalAmount={order.total_amount || 0}
                    currency={order.currency || 'SAR'}
                    customerId={order.customer_id}
                    tenantId={null}
                    createdAt={order.created_at}
                    dueDate={order.due_date}
                    isAdmin={true}
                  />
                  
                  <Button
                    variant="outline"
                    onClick={handleDownloadPDF}
                    className="w-full mt-4 gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {isRTL ? 'تحميل الفاتورة PDF' : 'Download Invoice PDF'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Customer & SMS */}
          <div className="space-y-6">
            {/* Customer Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    {isRTL ? 'بيانات العميل' : 'Customer Info'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.customer ? (
                    <>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{order.customer.full_name || (isRTL ? 'عميل' : 'Customer')}</p>
                          <p className="text-sm text-muted-foreground">{order.customer_id?.slice(0, 8)}...</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {order.customer.phone && (
                          <div className="flex items-center gap-3 p-3 rounded-lg border">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono">{order.customer.phone}</span>
                          </div>
                        )}
                        {order.customer.email && (
                          <div className="flex items-center gap-3 p-3 rounded-lg border">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{order.customer.email}</span>
                          </div>
                        )}
                        {order.customer.city && (
                          <div className="flex items-center gap-3 p-3 rounded-lg border">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{order.customer.city}</span>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <User className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>{isRTL ? 'لا توجد بيانات عميل' : 'No customer data'}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* SMS Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    {isRTL ? 'إرسال رسالة SMS' : 'Send SMS'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.customer?.phone ? (
                    <>
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                        <div className="flex items-center gap-2 text-emerald-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {isRTL ? 'رقم الهاتف متاح' : 'Phone available'}
                          </span>
                        </div>
                        <p className="font-mono mt-1">{order.customer.phone}</p>
                      </div>

                      {/* Quick SMS Templates */}
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {isRTL ? 'قوالب سريعة:' : 'Quick templates:'}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => notifyOrderProcessing(order.customer!.phone!, order.order_number)}
                            className="text-xs"
                          >
                            {isRTL ? 'قيد المعالجة' : 'Processing'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => notifyOrderCompleted(order.customer!.phone!, order.order_number)}
                            className="text-xs"
                          >
                            {isRTL ? 'مكتمل' : 'Completed'}
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      {/* Custom SMS */}
                      <div className="space-y-3">
                        <Textarea
                          placeholder={isRTL ? 'اكتب رسالة مخصصة...' : 'Write a custom message...'}
                          value={customSmsMessage}
                          onChange={(e) => setCustomSmsMessage(e.target.value)}
                          maxLength={160}
                          rows={3}
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {customSmsMessage.length}/160
                          </span>
                          <Button
                            onClick={handleSendCustomSms}
                            disabled={!customSmsMessage.trim() || sendingSms}
                            size="sm"
                            className="gap-2"
                          >
                            {sendingSms ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                            {isRTL ? 'إرسال' : 'Send'}
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <Phone className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>{isRTL ? 'لا يوجد رقم هاتف للعميل' : 'No phone number available'}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Activity Log */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    {isRTL ? 'سجل النشاط' : 'Activity Log'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    {events.length > 0 ? (
                      <div className="space-y-3">
                        {events.map((event, idx) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                          >
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <Bell className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{event.event_type}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDate(event.created_at)}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <History className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p>{isRTL ? 'لا يوجد سجل نشاط' : 'No activity log'}</p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
