/**
 * Customer Order Details Page
 * Shows order information with invoice section
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Truck,
  CreditCard,
  Calendar,
  FileText,
  Loader2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { OrderInvoiceSection } from '@/components/orders/OrderInvoiceSection';
import { useInvoiceRealtime } from '@/hooks/useInvoiceRealtime';

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
    labelAr: 'قيد الانتظار',
    labelEn: 'Pending',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/50',
    icon: Clock,
  },
  processing: {
    labelAr: 'قيد المعالجة',
    labelEn: 'Processing',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/50',
    icon: Package,
  },
  in_progress: {
    labelAr: 'قيد التنفيذ',
    labelEn: 'In Progress',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/50',
    icon: Truck,
  },
  completed: {
    labelAr: 'مكتمل',
    labelEn: 'Completed',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/50',
    icon: CheckCircle,
  },
  cancelled: {
    labelAr: 'ملغي',
    labelEn: 'Cancelled',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/50',
    icon: XCircle,
  },
  refunded: {
    labelAr: 'مسترد',
    labelEn: 'Refunded',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/50',
    icon: CreditCard,
  },
};

export default function CustomerOrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const { user, isLoading: authLoading } = useAuth();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Real-time invoice updates
  useInvoiceRealtime({
    onInvoiceGenerated: (payload) => {
      if (payload.order_id === id) {
        toast({
          title: isRTL ? 'تم إصدار فاتورة جديدة!' : 'New invoice issued!',
          description: isRTL 
            ? `فاتورة رقم ${payload.invoice_number}` 
            : `Invoice ${payload.invoice_number}`,
        });
      }
    },
  });

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth/login');
    }
  }, [user, authLoading, navigate]);

  // Fetch order
  useEffect(() => {
    const fetchOrder = async () => {
      if (!id || !user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .eq('customer_id', user.id)
          .single();

        if (error) throw error;
        setOrder(data as Order);
      } catch (err) {
        console.error('Error fetching order:', err);
        toast({
          title: isRTL ? 'خطأ في جلب الطلب' : 'Error fetching order',
          variant: 'destructive',
        });
        navigate('/app');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user, isRTL, navigate]);

  // Format helpers
  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-';
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: order?.currency || 'SAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !order) {
    return null;
  }

  const statusInfo = statusConfig[order.status || 'pending'] || statusConfig.pending;
  const StatusIcon = statusInfo.icon;
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/app')}
            className="mb-4 gap-2"
          >
            <BackIcon className="h-4 w-4" />
            {isRTL ? 'العودة' : 'Back'}
          </Button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {isRTL ? 'تفاصيل الطلب' : 'Order Details'}
                </h1>
                <p className="text-sm text-muted-foreground font-mono" dir="ltr">
                  {order.order_number}
                </p>
              </div>
            </div>
            <Badge className={cn("gap-1.5 px-3 py-1", statusInfo.bgColor, statusInfo.color)}>
              <StatusIcon className="h-4 w-4" />
              {isRTL ? statusInfo.labelAr : statusInfo.labelEn}
            </Badge>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Order Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold mb-4">
                  {isRTL ? 'معلومات الطلب' : 'Order Information'}
                </h2>

                {/* Title */}
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <FileText className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">
                      {isRTL ? 'عنوان الطلب' : 'Order Title'}
                    </span>
                  </div>
                  <p className="font-medium">
                    {isRTL ? order.title_ar || order.title : order.title}
                  </p>
                </div>

                <Separator />

                {/* Amount */}
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">
                      {isRTL ? 'المبلغ' : 'Amount'}
                    </span>
                  </div>
                  <p className="text-xl font-bold text-primary">
                    {formatCurrency(order.total_amount)}
                  </p>
                </div>

                <Separator />

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-medium uppercase tracking-wider">
                        {isRTL ? 'تاريخ الإنشاء' : 'Created'}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{formatDate(order.created_at)}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-medium uppercase tracking-wider">
                        {isRTL ? 'الاستحقاق' : 'Due'}
                      </span>
                    </div>
                    <p className="text-sm font-medium">
                      {order.due_date ? formatDate(order.due_date) : (isRTL ? 'غير محدد' : 'Not set')}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {order.description && (
                  <>
                    <Separator />
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <FileText className="h-4 w-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">
                          {isRTL ? 'الوصف' : 'Description'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.description}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Invoice Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
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
              isAdmin={false}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
