/**
 * OrderDetailsDrawer - Side panel for order details
 * RTL-first with timeline preview
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { 
  Eye, 
  FileText, 
  ScrollText,
  Calendar,
  Clock,
  X,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Package,
  Truck,
  CreditCard,
  XCircle,
} from 'lucide-react';
import { CustomerOrder, OrderEvent, ORDER_STATUS_CONFIG } from './types';
import { OrderStatusBadge } from './OrderStatusBadge';

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
  const navigate = useNavigate();

  const [events, setEvents] = useState<OrderEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

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
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: currency || 'SAR',
      minimumFractionDigits: 0,
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

  if (!order) return null;

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-lg">
          {/* Header */}
          <DrawerHeader className="relative">
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute top-4",
                  isRTL ? "left-4" : "right-4"
                )}
              >
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
            
            <div className="space-y-2">
              <DrawerTitle className="text-xl">
                {isRTL 
                  ? (order.service?.name_ar || order.title_ar || order.title)
                  : (order.service?.name || order.title)}
              </DrawerTitle>
              <DrawerDescription className="flex items-center gap-2">
                <span dir="ltr" className="font-mono text-sm">
                  {order.order_number}
                </span>
                <OrderStatusBadge status={order.status} size="sm" />
              </DrawerDescription>
            </div>
          </DrawerHeader>

          {/* Content */}
          <div className="px-4 pb-4 space-y-6 overflow-y-auto max-h-[50vh]">
            {/* Order Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  {isRTL ? 'المبلغ' : 'Amount'}
                </p>
                <p dir="ltr" className="font-bold text-lg text-primary tabular-nums">
                  {formatCurrency(order.total_amount, order.currency)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  {isRTL ? 'تاريخ الإنشاء' : 'Created'}
                </p>
                <p className="text-sm font-medium">
                  {formatDate(order.created_at)}
                </p>
              </div>
            </div>

            {order.description && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  {isRTL ? 'الوصف' : 'Description'}
                </p>
                <p className="text-sm">{order.description}</p>
              </div>
            )}

            <Separator />

            {/* Timeline Preview */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {isRTL ? 'آخر التحديثات' : 'Recent Updates'}
              </h4>
              
              {loadingEvents ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : events.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {isRTL ? 'لا توجد تحديثات بعد' : 'No updates yet'}
                </p>
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div className={cn(
                    "absolute top-0 bottom-0 w-px bg-border",
                    isRTL ? "right-4" : "left-4"
                  )} />
                  
                  <AnimatePresence>
                    {events.map((event, index) => {
                      const Icon = EVENT_ICONS[event.event_type] || Clock;
                      const label = getEventLabel(event.event_type);
                      
                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={cn(
                            "relative flex gap-3 pb-4",
                            isRTL ? "pr-8" : "pl-8"
                          )}
                        >
                          {/* Icon */}
                          <div className={cn(
                            "absolute w-8 h-8 rounded-full bg-muted flex items-center justify-center",
                            isRTL ? "right-0" : "left-0"
                          )}>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
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
            </div>
          </div>

          {/* Footer Actions */}
          <DrawerFooter className="pt-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => navigate(`/app/orders/${order.id}`)}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                {isRTL ? 'عرض الكامل' : 'Full Details'}
              </Button>
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                {isRTL ? 'الفاتورة' : 'Invoice'}
              </Button>
            </div>
            {order.contract_id && (
              <Button variant="outline" className="w-full gap-2">
                <ScrollText className="h-4 w-4" />
                {isRTL ? 'عرض العقد' : 'View Contract'}
              </Button>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
