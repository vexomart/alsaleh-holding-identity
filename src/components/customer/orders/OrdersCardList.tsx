/**
 * OrdersCardList - Premium Mobile-First Card View
 * RTL-first with staggered animations and inline actions
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  Calendar, 
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  ScrollText,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { CustomerOrder } from './types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { downloadInvoicePdf, orderToInvoiceData } from '@/lib/invoices';

interface OrdersCardListProps {
  orders: CustomerOrder[];
  isLoading: boolean;
  onCardClick: (order: CustomerOrder) => void;
  selectedOrderId?: string;
}

export function OrdersCardList({
  orders,
  isLoading,
  onCardClick,
  selectedOrderId,
}: OrdersCardListProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const reducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const ArrowIcon = isRTL ? ChevronLeft : ChevronRight;

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.06,
      },
    },
  };

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: reducedMotion ? 0 : 0.25,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 },
    },
  };

  // Actions animation
  const actionsVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { duration: 0.2 }
    },
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return null;
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
    }).format(new Date(dateString));
  };

  const handleDownloadInvoice = async (e: React.MouseEvent, order: CustomerOrder) => {
    e.stopPropagation();
    console.log('[PDF] CLICK', { kind: 'invoice', id: order.id, orderNumber: order.order_number });
    setDownloadingId(order.id);
    
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
      
      console.log('[PDF] Generating invoice for:', order.order_number);
      const success = await downloadInvoicePdf(invoiceData);
      
      if (success) {
        toast.success(isRTL ? 'تم تنزيل الفاتورة' : 'Invoice downloaded');
      } else {
        throw new Error('Download returned false');
      }
    } catch (error) {
      console.error('[PDF] Invoice download error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      toast.error(isRTL ? `فشل التنزيل: ${errorMsg}` : `Download failed: ${errorMsg}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleViewContract = (e: React.MouseEvent, order: CustomerOrder) => {
    e.stopPropagation();
    if (order.contract_id) {
      navigate(`/portal/contracts/${order.contract_id}`);
    }
  };

  const toggleExpand = (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    setExpandedCard(expandedCard === orderId ? null : orderId);
  };

  if (isLoading && orders.length === 0) {
    return <OrdersCardSkeleton />;
  }

  return (
    <motion.div 
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence mode="popLayout">
        {orders.map((order, index) => {
          const isExpanded = expandedCard === order.id;
          const isSelected = selectedOrderId === order.id;
          
          return (
            <motion.div
              key={order.id}
              variants={cardVariants}
              exit="exit"
              layout
              whileHover={reducedMotion ? {} : { scale: 1.01, y: -2 }}
              whileTap={reducedMotion ? {} : { scale: 0.98 }}
            >
              <Card
                className={cn(
                  'cursor-pointer transition-all duration-300 overflow-hidden',
                  'hover:shadow-xl hover:border-primary/40',
                  'bg-gradient-to-br from-card via-card to-card/95',
                  'border-2',
                  isSelected && 'border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10',
                  isExpanded && 'border-primary/50'
                )}
                onClick={() => onCardClick(order)}
              >
                <CardContent className="p-0">
                  {/* Main Card Content */}
                  <div className="p-4 pb-3">
                    {/* Top Row: Status Badge + Amount */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: reducedMotion ? 0 : 0.1 }}
                      >
                        <OrderStatusBadge status={order.status} />
                      </motion.div>
                      {order.total_amount && (
                        <motion.div 
                          className="text-end shrink-0"
                          initial={{ opacity: 0, x: isRTL ? -10 : 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: reducedMotion ? 0 : 0.15 }}
                        >
                          <p dir="ltr" className="text-2xl font-bold text-primary tabular-nums">
                            <span className="text-xs font-normal text-muted-foreground me-1">SAR</span>
                            {formatCurrency(order.total_amount)}
                          </p>
                        </motion.div>
                      )}
                    </div>

                    {/* Service Name */}
                    <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {isRTL 
                        ? (order.service?.name_ar || order.title_ar || order.title)
                        : (order.service?.name || order.title)}
                    </h3>

                    {/* Order Number */}
                    <div className="mb-3">
                      <span 
                        dir="ltr" 
                        className="inline-block font-mono text-xs text-muted-foreground bg-muted/70 px-3 py-1.5 rounded-lg tabular-nums"
                      >
                        {order.order_number}
                      </span>
                    </div>

                    {/* Date & Expand Toggle */}
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(order.created_at)}
                      </span>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={cn(
                          "gap-1 text-primary h-8 px-3",
                          "hover:bg-primary/10 transition-all duration-200"
                        )}
                        onClick={(e) => toggleExpand(e, order.id)}
                      >
                        {isExpanded ? (isRTL ? 'إخفاء' : 'Hide') : (isRTL ? 'الإجراءات' : 'Actions')}
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowIcon className="h-4 w-4" />
                        </motion.div>
                      </Button>
                    </div>
                  </div>

                  {/* Expandable Actions Section - NO POPUP */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={actionsVariants}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-2 border-t border-border/50 bg-muted/30">
                          <div className="grid grid-cols-3 gap-2">
                            {/* View Details */}
                            <Button 
                              variant="outline"
                              size="sm"
                              className="h-11 flex-col gap-1 hover:bg-primary hover:text-primary-foreground transition-all"
                              onClick={() => onCardClick(order)}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="text-[10px]">{isRTL ? 'التفاصيل' : 'Details'}</span>
                            </Button>

                            {/* Download Invoice */}
                            <Button 
                              variant="outline"
                              size="sm"
                              className="h-11 flex-col gap-1 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all"
                              onClick={(e) => handleDownloadInvoice(e, order)}
                              disabled={downloadingId === order.id}
                            >
                              {downloadingId === order.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                              <span className="text-[10px]">{isRTL ? 'الفاتورة' : 'Invoice'}</span>
                            </Button>

                            {/* Contract */}
                            {order.contract_id ? (
                              <Button 
                                variant="outline"
                                size="sm"
                                className="h-11 flex-col gap-1 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all"
                                onClick={(e) => handleViewContract(e, order)}
                              >
                                <ScrollText className="h-4 w-4" />
                                <span className="text-[10px]">{isRTL ? 'العقد' : 'Contract'}</span>
                              </Button>
                            ) : (
                              <Button 
                                variant="outline"
                                size="sm"
                                className="h-11 flex-col gap-1 opacity-50 cursor-not-allowed"
                                disabled
                              >
                                <ScrollText className="h-4 w-4" />
                                <span className="text-[10px]">{isRTL ? 'لا يوجد' : 'N/A'}</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}

// Enhanced Skeleton loader
function OrdersCardSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-8 w-24" />
              </div>
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-7 w-32 mb-3 rounded-lg" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
