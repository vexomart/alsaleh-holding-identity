/**
 * Order Details Page - Premium Dark Theme
 * Full-featured order management with real-time customer sync
 */

import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
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
  ExternalLink,
  Eye,
  Zap,
  Radio,
  ChevronRight,
  ChevronLeft,
  Star,
  Shield,
  Activity,
  TrendingUp,
  Wallet,
  Receipt,
  FileCheck,
  Users,
  Globe,
  MoreVertical,
  Printer,
  Share2,
  Bookmark,
  Target,
  DollarSign,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
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
    id: string;
    full_name: string | null;
    phone: string | null;
    email: string | null;
    national_id?: string | null;
    city?: string | null;
    avatar_url?: string | null;
  } | null;
  service?: {
    id: string;
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

interface CustomerStats {
  totalOrders: number;
  completedOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
}

const statusConfig: Record<string, {
  labelAr: string;
  labelEn: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ElementType;
  gradient: string;
  step: number;
}> = {
  pending: {
    labelAr: "قيد الانتظار",
    labelEn: "Pending",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    icon: Clock,
    gradient: "from-amber-500 to-orange-500",
    step: 1
  },
  processing: {
    labelAr: "قيد المعالجة",
    labelEn: "Processing",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    icon: Package,
    gradient: "from-blue-500 to-indigo-500",
    step: 2
  },
  in_progress: {
    labelAr: "قيد التنفيذ",
    labelEn: "In Progress",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    icon: Truck,
    gradient: "from-purple-500 to-pink-500",
    step: 3
  },
  completed: {
    labelAr: "مكتمل",
    labelEn: "Completed",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    icon: CheckCircle,
    gradient: "from-emerald-500 to-teal-500",
    step: 4
  },
  cancelled: {
    labelAr: "ملغي",
    labelEn: "Cancelled",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    icon: XCircle,
    gradient: "from-red-500 to-rose-500",
    step: 0
  },
  refunded: {
    labelAr: "مسترد",
    labelEn: "Refunded",
    color: "text-slate-400",
    bgColor: "bg-slate-500/10",
    borderColor: "border-slate-500/30",
    icon: CreditCard,
    gradient: "from-slate-500 to-slate-600",
    step: 0
  },
};

const priorityConfig: Record<number, { labelAr: string; labelEn: string; color: string; bgColor: string }> = {
  1: { labelAr: 'منخفضة', labelEn: 'Low', color: 'text-slate-400', bgColor: 'bg-slate-500/10' },
  2: { labelAr: 'متوسطة', labelEn: 'Medium', color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
  3: { labelAr: 'عالية', labelEn: 'High', color: 'text-red-400', bgColor: 'bg-red-500/10' },
};

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;
  
  // State
  const [order, setOrder] = useState<Order | null>(null);
  const [events, setEvents] = useState<OrderEvent[]>([]);
  const [customerStats, setCustomerStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingSms, setSendingSms] = useState(false);
  const [customSmsMessage, setCustomSmsMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Partial<Order>>({});
  const [activeTab, setActiveTab] = useState('overview');
  const [isLive, setIsLive] = useState(true);
  
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
      // Fetch order
      const { data: orderData, error: orderError } = await db
        .from('orders')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (orderError) throw orderError;
      if (!orderData) {
        setOrder(null);
        setLoading(false);
        return;
      }

      // Fetch customer profile
      let customer = null;
      if (orderData.customer_id) {
        const { data: profileData } = await db
          .from('profiles')
          .select('id, full_name, phone, email, national_id, city, avatar_url')
          .eq('id', orderData.customer_id)
          .maybeSingle();
        customer = profileData;

        // Fetch customer stats
        if (profileData) {
          const { data: customerOrders } = await db
            .from('orders')
            .select('id, status, total_amount, created_at')
            .eq('customer_id', orderData.customer_id);
          
          if (customerOrders) {
            const completed = customerOrders.filter(o => o.status === 'completed');
            setCustomerStats({
              totalOrders: customerOrders.length,
              completedOrders: completed.length,
              totalSpent: completed.reduce((sum, o) => sum + (o.total_amount || 0), 0),
              lastOrderDate: customerOrders[0]?.created_at || null,
            });
          }
        }
      }

      // Fetch service if exists
      let service = null;
      if (orderData.service_id) {
        const { data: serviceData } = await db
          .from('services')
          .select('id, name, name_ar')
          .eq('id', orderData.service_id)
          .maybeSingle();
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
    const orderChannel = supabase
      .channel(`order-realtime-${id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `id=eq.${id}` },
        () => {
          setIsLive(true);
          fetchOrder();
        }
      )
      .subscribe();

    // Real-time subscription for order events
    const eventsChannel = supabase
      .channel(`order-events-${id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'order_events', filter: `order_id=eq.${id}` },
        () => fetchOrder()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(eventsChannel);
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

  const formatDate = (dateString: string | null, includeTime = true) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(includeTime && { hour: '2-digit', minute: '2-digit' }),
    }).format(new Date(dateString));
  };

  const getTimeAgo = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return isRTL ? `منذ ${minutes} دقيقة` : `${minutes}m ago`;
    if (hours < 24) return isRTL ? `منذ ${hours} ساعة` : `${hours}h ago`;
    return isRTL ? `منذ ${days} يوم` : `${days}d ago`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <p className="text-slate-400">
            {isRTL ? 'جاري تحميل تفاصيل الطلب...' : 'Loading order details...'}
          </p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!order) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex flex-col items-center justify-center gap-6">
        <div className="p-6 rounded-full bg-slate-800/50">
          <AlertCircle className="h-16 w-16 text-slate-600" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">
            {isRTL ? 'الطلب غير موجود' : 'Order not found'}
          </h2>
          <p className="text-slate-400 mt-2">
            {isRTL ? 'لم نتمكن من العثور على هذا الطلب' : 'We couldn\'t find this order'}
          </p>
        </div>
        <Button 
          onClick={() => navigate('/adminash/orders')}
          className="bg-blue-600 hover:bg-blue-700 gap-2"
        >
          <ArrowIcon className="h-4 w-4" />
          {isRTL ? 'العودة للطلبات' : 'Back to Orders'}
        </Button>
      </div>
    );
  }

  const currentStatus = statusConfig[order.status || 'pending'];
  const StatusIcon = currentStatus.icon;
  const priority = priorityConfig[order.priority || 1];
  const progressValue = (currentStatus.step / 4) * 100;

  return (
    <div className="min-h-screen bg-[#0a0e1a]" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="space-y-6 p-4 lg:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-800"
        >
          {/* Background effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className={cn(
              "absolute top-0 start-0 w-96 h-96 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2",
              `bg-gradient-to-br ${currentStatus.gradient} opacity-20`
            )} />
            <div className="absolute bottom-0 end-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative p-6">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/adminash/orders')}
                className="text-slate-300 hover:text-white hover:bg-slate-800 gap-2"
              >
                <ArrowIcon className="h-4 w-4" />
                {isRTL ? 'العودة' : 'Back'}
              </Button>
              
              <div className="flex items-center gap-2">
                {/* Live indicator */}
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
                  isLive 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                )}>
                  <Radio className={cn("h-3 w-3", isLive && "animate-pulse")} />
                  {isLive ? 'LIVE' : 'OFFLINE'}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyOrderNumber}
                  className="text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={fetchOrder}
                  className="text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#0f1629] border-slate-700 w-48">
                    <DropdownMenuItem className="text-slate-200 focus:bg-slate-800 gap-2">
                      <Printer className="h-4 w-4" />
                      {isRTL ? 'طباعة' : 'Print'}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-slate-200 focus:bg-slate-800 gap-2">
                      <Share2 className="h-4 w-4" />
                      {isRTL ? 'مشاركة' : 'Share'}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-slate-200 focus:bg-slate-800 gap-2">
                      <Bookmark className="h-4 w-4" />
                      {isRTL ? 'حفظ' : 'Bookmark'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Main header content */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-4 rounded-2xl bg-gradient-to-br shadow-lg",
                  currentStatus.gradient
                )}>
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">
                      {order.order_number}
                    </h1>
                    <Badge className={cn(priority?.bgColor, priority?.color, "border-0")}>
                      {isRTL ? priority?.labelAr : priority?.labelEn}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-lg">
                    {isRTL ? order.title_ar || order.title : order.title}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(order.created_at, false)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {getTimeAgo(order.updated_at)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                {/* Status badge */}
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl border",
                  currentStatus.bgColor,
                  currentStatus.borderColor
                )}>
                  <StatusIcon className={cn("h-5 w-5", currentStatus.color)} />
                  <span className={cn("font-semibold", currentStatus.color)}>
                    {isRTL ? currentStatus.labelAr : currentStatus.labelEn}
                  </span>
                </div>

                {/* Amount */}
                <div className="text-3xl font-bold text-emerald-400">
                  {formatCurrency(order.total_amount)}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-400">
                  {isRTL ? 'تقدم الطلب' : 'Order Progress'}
                </span>
                <span className="text-sm font-medium text-white">{Math.round(progressValue)}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressValue}%` }}
                  transition={{ duration: 0.5 }}
                  className={cn("h-full rounded-full bg-gradient-to-r", currentStatus.gradient)}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Status Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-[#0f1629] border border-slate-800"
        >
          <div className="flex items-center justify-between">
            {['pending', 'processing', 'in_progress', 'completed'].map((status, idx) => {
              const config = statusConfig[status];
              const Icon = config.icon;
              const isActive = order.status === status;
              const isPast = config.step <= currentStatus.step && currentStatus.step > 0;

              return (
                <div key={status} className="flex items-center flex-1">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleStatusChange(status)}
                    className="flex flex-col items-center gap-2 cursor-pointer group"
                  >
                    <div className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300",
                      isActive
                        ? `bg-gradient-to-br ${config.gradient} text-white shadow-lg shadow-${status === 'completed' ? 'emerald' : status === 'pending' ? 'amber' : status === 'processing' ? 'blue' : 'purple'}-500/25`
                        : isPast
                          ? "bg-slate-700 text-white"
                          : "bg-slate-800 text-slate-500 group-hover:bg-slate-700"
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={cn(
                      "text-xs font-medium text-center hidden sm:block",
                      isActive ? config.color : isPast ? "text-slate-300" : "text-slate-500"
                    )}>
                      {isRTL ? config.labelAr : config.labelEn}
                    </span>
                  </motion.div>
                  {idx < 3 && (
                    <div className="flex-1 h-1 mx-2 rounded-full overflow-hidden bg-slate-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: isPast && config.step < currentStatus.step ? '100%' : '0%' }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className={cn("h-full bg-gradient-to-r", config.gradient)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full bg-[#0f1629] border border-slate-800 p-1 h-12">
                  <TabsTrigger 
                    value="overview" 
                    className="flex-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400"
                  >
                    <Eye className="h-4 w-4 me-2" />
                    {isRTL ? 'نظرة عامة' : 'Overview'}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="invoice" 
                    className="flex-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400"
                  >
                    <Receipt className="h-4 w-4 me-2" />
                    {isRTL ? 'الفاتورة' : 'Invoice'}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="history" 
                    className="flex-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400"
                  >
                    <History className="h-4 w-4 me-2" />
                    {isRTL ? 'السجل' : 'History'}
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-4 space-y-4">
                  <div className="p-6 rounded-xl bg-[#0f1629] border border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-400" />
                        {isRTL ? 'تفاصيل الطلب' : 'Order Details'}
                      </h3>
                      <Button
                        variant={editMode ? "default" : "outline"}
                        size="sm"
                        onClick={() => editMode ? handleSaveOrder() : setEditMode(true)}
                        disabled={saving}
                        className={editMode ? "bg-blue-600 hover:bg-blue-700" : "border-slate-700 text-slate-300"}
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Title */}
                      <div className="space-y-2">
                        <label className="text-sm text-slate-400">
                          {isRTL ? 'العنوان' : 'Title'}
                        </label>
                        {editMode ? (
                          <Input
                            value={editedOrder.title || ''}
                            onChange={(e) => setEditedOrder({ ...editedOrder, title: e.target.value })}
                            className="bg-slate-900 border-slate-700 text-white"
                          />
                        ) : (
                          <p className="font-medium text-white">{order.title}</p>
                        )}
                      </div>

                      {/* Arabic Title */}
                      <div className="space-y-2">
                        <label className="text-sm text-slate-400">
                          {isRTL ? 'العنوان بالعربي' : 'Arabic Title'}
                        </label>
                        {editMode ? (
                          <Input
                            value={editedOrder.title_ar || ''}
                            onChange={(e) => setEditedOrder({ ...editedOrder, title_ar: e.target.value })}
                            className="bg-slate-900 border-slate-700 text-white"
                            dir="rtl"
                          />
                        ) : (
                          <p className="font-medium text-white">{order.title_ar || '-'}</p>
                        )}
                      </div>

                      {/* Amount */}
                      <div className="space-y-2">
                        <label className="text-sm text-slate-400">
                          {isRTL ? 'المبلغ' : 'Amount'}
                        </label>
                        {editMode ? (
                          <Input
                            type="number"
                            value={editedOrder.total_amount || ''}
                            onChange={(e) => setEditedOrder({ ...editedOrder, total_amount: parseFloat(e.target.value) })}
                            className="bg-slate-900 border-slate-700 text-white"
                          />
                        ) : (
                          <p className="text-2xl font-bold text-emerald-400">
                            {formatCurrency(order.total_amount)}
                          </p>
                        )}
                      </div>

                      {/* Due Date */}
                      <div className="space-y-2">
                        <label className="text-sm text-slate-400">
                          {isRTL ? 'تاريخ الاستحقاق' : 'Due Date'}
                        </label>
                        {editMode ? (
                          <Input
                            type="date"
                            value={editedOrder.due_date?.split('T')[0] || ''}
                            onChange={(e) => setEditedOrder({ ...editedOrder, due_date: e.target.value })}
                            className="bg-slate-900 border-slate-700 text-white"
                          />
                        ) : (
                          <p className="font-medium text-white">
                            {order.due_date ? formatDate(order.due_date, false) : (isRTL ? 'غير محدد' : 'Not set')}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mt-6 space-y-2">
                      <label className="text-sm text-slate-400">
                        {isRTL ? 'الوصف' : 'Description'}
                      </label>
                      {editMode ? (
                        <Textarea
                          value={editedOrder.description || ''}
                          onChange={(e) => setEditedOrder({ ...editedOrder, description: e.target.value })}
                          className="bg-slate-900 border-slate-700 text-white"
                          rows={3}
                        />
                      ) : (
                        <p className="text-slate-300">
                          {order.description || (isRTL ? 'لا يوجد وصف' : 'No description')}
                        </p>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-slate-800">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500">
                          {isRTL ? 'تاريخ الإنشاء' : 'Created'}
                        </p>
                        <p className="text-sm font-medium text-slate-300">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500">
                          {isRTL ? 'آخر تحديث' : 'Last Updated'}
                        </p>
                        <p className="text-sm font-medium text-slate-300">{formatDate(order.updated_at)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="p-6 rounded-xl bg-[#0f1629] border border-slate-800">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-amber-400" />
                      {isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
                    </h3>
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
                              "gap-2 border",
                              config.borderColor,
                              config.bgColor,
                              config.color,
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
                </TabsContent>

                {/* Invoice Tab */}
                <TabsContent value="invoice" className="mt-4">
                  <div className="p-6 rounded-xl bg-[#0f1629] border border-slate-800">
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
                      onClick={handleDownloadPDF}
                      className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 gap-2"
                    >
                      <Download className="h-4 w-4" />
                      {isRTL ? 'تحميل الفاتورة PDF' : 'Download Invoice PDF'}
                    </Button>
                  </div>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history" className="mt-4">
                  <div className="p-6 rounded-xl bg-[#0f1629] border border-slate-800">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                      <History className="h-5 w-5 text-purple-400" />
                      {isRTL ? 'سجل النشاط' : 'Activity Log'}
                    </h3>
                    
                    {events.length === 0 ? (
                      <div className="text-center py-10">
                        <Activity className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400">
                          {isRTL ? 'لا توجد أحداث مسجلة' : 'No events recorded'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {events.map((event, index) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start gap-4 p-4 rounded-lg bg-slate-900/50 border border-slate-800"
                          >
                            <div className="p-2 rounded-full bg-blue-500/10">
                              <Activity className="h-4 w-4 text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white">
                                {event.event_type}
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                {formatDate(event.created_at)}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Right Column - Customer & SMS */}
          <div className="space-y-6">
            {/* Customer Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-xl bg-[#0f1629] border border-slate-800"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-400" />
                  {isRTL ? 'العميل' : 'Customer'}
                </h3>
                {order.customer && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-blue-400 hover:text-blue-300 hover:bg-slate-800"
                  >
                    <Link to={`/adminash/clients/${order.customer.id}`}>
                      <ExternalLink className="h-4 w-4 me-1" />
                      {isRTL ? 'عرض' : 'View'}
                    </Link>
                  </Button>
                )}
              </div>

              {order.customer ? (
                <div className="space-y-4">
                  {/* Customer Avatar & Name */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                    <Avatar className="h-14 w-14 border-2 border-blue-500/30">
                      <AvatarImage src={order.customer.avatar_url || undefined} />
                      <AvatarFallback className="bg-blue-500/20 text-blue-400 text-lg font-bold">
                        {order.customer.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-white text-lg">
                        {order.customer.full_name || (isRTL ? 'عميل' : 'Customer')}
                      </p>
                      {order.customer.city && (
                        <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {order.customer.city}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    {order.customer.phone && (
                      <a 
                        href={`tel:${order.customer.phone}`}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-emerald-500/10">
                          <Phone className="h-4 w-4 text-emerald-400" />
                        </div>
                        <span className="text-slate-300 font-mono text-sm" dir="ltr">
                          {order.customer.phone}
                        </span>
                      </a>
                    )}
                    
                    {order.customer.email && (
                      <a 
                        href={`mailto:${order.customer.email}`}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <Mail className="h-4 w-4 text-blue-400" />
                        </div>
                        <span className="text-slate-300 text-sm truncate">
                          {order.customer.email}
                        </span>
                      </a>
                    )}
                  </div>

                  {/* Customer Stats */}
                  {customerStats && (
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                      <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 text-center">
                        <p className="text-2xl font-bold text-white">{customerStats.totalOrders}</p>
                        <p className="text-xs text-slate-400">{isRTL ? 'إجمالي الطلبات' : 'Total Orders'}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 text-center">
                        <p className="text-2xl font-bold text-emerald-400">{formatCurrency(customerStats.totalSpent)}</p>
                        <p className="text-xs text-slate-400">{isRTL ? 'إجمالي المشتريات' : 'Total Spent'}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">
                    {isRTL ? 'لا توجد بيانات عميل' : 'No customer data'}
                  </p>
                </div>
              )}
            </motion.div>

            {/* SMS Card */}
            {order.customer?.phone && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-xl bg-[#0f1629] border border-slate-800"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-emerald-400" />
                  {isRTL ? 'إرسال رسالة SMS' : 'Send SMS'}
                </h3>

                <div className="space-y-4">
                  <Textarea
                    value={customSmsMessage}
                    onChange={(e) => setCustomSmsMessage(e.target.value)}
                    placeholder={isRTL ? 'اكتب رسالتك هنا...' : 'Type your message here...'}
                    className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    rows={4}
                  />
                  
                  <Button
                    onClick={handleSendCustomSms}
                    disabled={sendingSms || !customSmsMessage.trim()}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 gap-2"
                  >
                    {sendingSms ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {isRTL ? 'إرسال' : 'Send'}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Service Info */}
            {order.service && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-xl bg-[#0f1629] border border-slate-800"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-400" />
                  {isRTL ? 'الخدمة' : 'Service'}
                </h3>

                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <p className="font-semibold text-white">
                    {isRTL ? order.service.name_ar || order.service.name : order.service.name}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="mt-3 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 w-full justify-center"
                  >
                    <Link to={`/adminash/services`}>
                      <ExternalLink className="h-4 w-4 me-1" />
                      {isRTL ? 'عرض الخدمة' : 'View Service'}
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
