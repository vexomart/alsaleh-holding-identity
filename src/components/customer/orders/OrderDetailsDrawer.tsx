/**
 * OrderDetailsDrawer - Premium side panel for order details
 * RTL-first with timeline preview and smooth animations
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { 
  Eye, 
  FileText, 
  ScrollText,
  Clock,
  X,
  CheckCircle,
  Package,
  Truck,
  CreditCard,
  XCircle,
  Download,
  Loader2,
  CalendarDays,
  Hash,
  Banknote,
  ArrowUpRight,
} from 'lucide-react';
import { CustomerOrder, OrderEvent } from './types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { orderToInvoiceData } from '@/lib/pdf';
import { runPdfDebug } from '@/lib/pdf/debug/run-pdf-debug';

interface OrderDetailsDrawerProps {
  order: CustomerOrder | null;
  open: boolean;
  onClose: () => void;
}

const EVENT_ICONS: Record<string, React.ElementType> = {
  created: Package,
  status_changed: Clock,
  assigned: Truck,
  note_added: FileText,
  attachment_added: FileText,
  cancelled: XCircle,
  completed: CheckCircle,
  payment: CreditCard,
};

export function OrderDetailsDrawer({
  order,
  open,
  onClose,
}: OrderDetailsDrawerProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const reducedMotion = useReducedMotion();
  const navigate = useNavigate();

  const [events, setEvents] = useState<OrderEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);

  // Handle invoice download
  const handleDownloadInvoice = async () => {
    if (!order) return;

    console.log('[PDF] clicked', { kind: 'invoice', id: order.id });
    
    setGeneratingInvoice(true);
    
    try {
      const metadata = (order as any).metadata || {};
      const customer = {
        full_name: metadata.customer_name || 'Customer',
        email: metadata.customer_email || '',
        phone: metadata.customer_phone,
      };
      
      const services = [{
        name: order.service?.name || order.title,
        name_ar: order.service?.name_ar || order.title_ar || order.title,
        price: order.total_amount || 0,
        quantity: 1,
      }];
      
      const invoiceData = orderToInvoiceData(
        {
          order_number: order.order_number,
          created_at: order.created_at || new Date().toISOString(),
          total_amount: order.total_amount || 0,
          currency: order.currency || 'SAR',
        },
        customer,
        services
      );
      
      const report = await runPdfDebug('invoice', invoiceData);
      if (report.ok) {
        toast.success(isRTL ? 'تم تحميل الفاتورة' : 'Invoice downloaded');
      }
    } catch (error) {
      console.error('[Invoice Download] ❌ Error:', error);
      toast.error(isRTL ? 'فشل التحميل' : 'Download failed');
    } finally {
      setGeneratingInvoice(false);
    }
  };

  // Handle contract view
  const handleViewContract = () => {
    if (!order?.contract_id) return;
    onClose();
    navigate(`/app/contracts/${order.contract_id}`);
  };

  // Handle full details
  const handleViewFullDetails = () => {
    if (!order) return;
    onClose();
    navigate(`/app/orders/${order.id}`);
  };

  // Fetch order events when order changes
  useEffect(() => {
    if (!order?.id || !open) return;

    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        const { data, error } = await supabase
          .from('order_events')
          .select('*')
          .eq('order_id', order.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setEvents((data || []) as OrderEvent[]);
      } catch (err) {
        console.error('Error fetching order events:', err);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [order?.id, open]);

  const formatCurrency = (amount: number | null, currency: string | null) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const formatEventDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const getEventLabel = (eventType: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      created: { ar: 'تم إنشاء الطلب', en: 'Order created' },
      status_changed: { ar: 'تم تغيير الحالة', en: 'Status changed' },
      assigned: { ar: 'تم تعيين مسؤول', en: 'Assigned' },
      note_added: { ar: 'تمت إضافة ملاحظة', en: 'Note added' },
      attachment_added: { ar: 'تمت إضافة مرفق', en: 'Attachment added' },
      cancelled: { ar: 'تم إلغاء الطلب', en: 'Order cancelled' },
      completed: { ar: 'تم إكمال الطلب', en: 'Order completed' },
      payment: { ar: 'تم الدفع', en: 'Payment received' },
    };
    return labels[eventType] || { ar: eventType, en: eventType };
  };

  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0, x: isRTL ? -20 : 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: reducedMotion ? 0 : 0.2, ease: [0.25, 0.1, 0.25, 1] as const }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: reducedMotion ? 0 : i * 0.05,
        duration: reducedMotion ? 0 : 0.15,
      },
    }),
  };

  if (!order) return null;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent 
        side={isRTL ? 'left' : 'right'} 
        className="w-full sm:max-w-lg p-0 flex flex-col"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <motion.div 
          className="flex flex-col h-full"
          initial="hidden"
          animate="visible"
          variants={contentVariants}
        >
          {/* Header */}
          <SheetHeader className="p-6 pb-4 border-b bg-gradient-to-b from-muted/50 to-transparent">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-xl font-bold mb-2 line-clamp-2">
                  {isRTL 
                    ? (order.service?.name_ar || order.title_ar || order.title)
                    : (order.service?.name || order.title)}
                </SheetTitle>
                <SheetDescription className="flex flex-wrap items-center gap-2">
                  <span dir="ltr" className="font-mono text-sm bg-muted px-2 py-0.5 rounded">
                    {order.order_number}
                  </span>
                  <OrderStatusBadge status={order.status} size="sm" />
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Order Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div 
                custom={0}
                variants={itemVariants}
                className="p-4 rounded-xl bg-muted/50 border"
              >
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Banknote className="h-4 w-4" />
                  <span className="text-xs">{isRTL ? 'المبلغ' : 'Amount'}</span>
                </div>
                {order.total_amount ? (
                  <p dir="ltr" className="text-xl font-bold text-primary tabular-nums">
                    <span className="text-xs font-normal text-muted-foreground me-1">SAR</span>
                    {formatCurrency(order.total_amount, order.currency)}
                  </p>
                ) : (
                  <p className="text-muted-foreground">-</p>
                )}
              </motion.div>

              <motion.div 
                custom={1}
                variants={itemVariants}
                className="p-4 rounded-xl bg-muted/50 border"
              >
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-xs">{isRTL ? 'تاريخ الإنشاء' : 'Created'}</span>
                </div>
                <p className="text-sm font-medium">
                  {formatDate(order.created_at)}
                </p>
              </motion.div>
            </div>

            {/* Description */}
            {order.description && (
              <motion.div custom={2} variants={itemVariants}>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  {isRTL ? 'الوصف' : 'Description'}
                </h4>
                <p className="text-sm bg-muted/30 p-3 rounded-lg">{order.description}</p>
              </motion.div>
            )}

            <Separator />

            {/* Timeline Preview */}
            <motion.div custom={3} variants={itemVariants}>
              <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {isRTL ? 'آخر التحديثات' : 'Recent Updates'}
              </h4>
              
              {loadingEvents ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">{isRTL ? 'لا توجد تحديثات بعد' : 'No updates yet'}</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div className={cn(
                    "absolute top-0 bottom-0 w-px bg-border",
                    isRTL ? "right-[18px]" : "left-[18px]"
                  )} />
                  
                  <AnimatePresence>
                    {events.map((event, index) => {
                      const Icon = EVENT_ICONS[event.event_type] || Clock;
                      const label = getEventLabel(event.event_type);
                      
                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: isRTL ? 16 : -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: reducedMotion ? 0 : index * 0.05 }}
                          className={cn(
                            "relative flex gap-3 pb-4 last:pb-0",
                            isRTL ? "pr-10" : "pl-10"
                          )}
                        >
                          {/* Icon */}
                          <div className={cn(
                            "absolute w-9 h-9 rounded-full bg-muted flex items-center justify-center border-2 border-background z-10",
                            isRTL ? "right-0" : "left-0"
                          )}>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0 pt-1">
                            <p className="text-sm font-medium">
                              {isRTL ? label.ar : label.en}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatEventDate(event.created_at)}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </div>

          {/* Footer Actions */}
          <SheetFooter className="p-4 border-t bg-muted/30">
            <div className="w-full space-y-3">
              {/* Primary Action */}
              <Button
                onClick={handleViewFullDetails}
                className="w-full gap-2 h-11"
                size="lg"
              >
                <Eye className="h-4 w-4" />
                {isRTL ? 'فتح التفاصيل' : 'Full Details'}
                <ArrowUpRight className="h-4 w-4 ms-auto" />
              </Button>

              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={handleDownloadInvoice}
                  disabled={generatingInvoice}
                >
                  {generatingInvoice ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {isRTL ? 'الفاتورة' : 'Invoice'}
                </Button>
                {order.contract_id && (
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={handleViewContract}
                  >
                    <ScrollText className="h-4 w-4" />
                    {isRTL ? 'العقد' : 'Contract'}
                  </Button>
                )}
              </div>
            </div>
          </SheetFooter>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
