/**
 * OrdersTable - Premium Enterprise Table with Inline Actions
 * RTL-strict, animated rows, NO POPUPS - inline visible actions
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { 
  ChevronUp, 
  ChevronDown,
  Eye,
  FileText,
  ScrollText,
  ChevronRight,
  ChevronLeft,
  Download,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { CustomerOrder, OrdersSort, SortField } from './types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { downloadInvoicePdf, orderToInvoiceData } from '@/lib/invoices';

interface OrdersTableProps {
  orders: CustomerOrder[];
  isLoading: boolean;
  sort: OrdersSort;
  onSort: (field: SortField) => void;
  onRowClick: (order: CustomerOrder) => void;
  selectedOrderId?: string;
}

export function OrdersTable({
  orders,
  isLoading,
  sort,
  onSort,
  onRowClick,
  selectedOrderId,
}: OrdersTableProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const reducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const ExpandIcon = isRTL ? ChevronLeft : ChevronRight;

  // Row animation variants
  const rowVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: reducedMotion ? 0 : i * 0.03,
        duration: reducedMotion ? 0 : 0.2,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    }),
    hover: {
      scale: 1.005,
      transition: { duration: 0.15 },
    },
  };

  // Actions animation
  const actionsVariants = {
    hidden: { opacity: 0, x: isRTL ? 10 : -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.15, ease: 'easeOut' }
    },
  };

  const formatCurrency = (amount: number | null) => {
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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sort.field !== field) return null;
    return sort.direction === 'asc' 
      ? <ChevronUp className="h-4 w-4" />
      : <ChevronDown className="h-4 w-4" />;
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => onSort(field)}
      className={cn(
        'flex items-center gap-1 hover:text-foreground transition-colors whitespace-nowrap group',
        sort.field === field ? 'text-foreground font-semibold' : 'text-muted-foreground'
      )}
    >
      {children}
      <span className={cn(
        'transition-transform duration-200',
        sort.field === field && 'text-primary'
      )}>
        <SortIcon field={field} />
      </span>
    </button>
  );

  if (isLoading && orders.length === 0) {
    return <OrdersTableSkeleton />;
  }

  return (
    <TooltipProvider>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.3 }}
        dir={isRTL ? 'rtl' : 'ltr'} 
        className="rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <Table>
          <TableHeader className="bg-gradient-to-b from-muted/60 to-muted/30 sticky top-0 z-10">
            <TableRow className="hover:bg-transparent border-b-2 border-border/50">
              <TableHead className={cn("w-[130px]", isRTL && "text-right")}>
                <SortableHeader field="status">
                  {isRTL ? 'الحالة' : 'Status'}
                </SortableHeader>
              </TableHead>
              <TableHead className={cn("min-w-[200px]", isRTL && "text-right")}>
                {isRTL ? 'الخدمة' : 'Service'}
              </TableHead>
              <TableHead className={cn("w-[150px]", isRTL && "text-right")}>
                {isRTL ? 'رقم الطلب' : 'Order #'}
              </TableHead>
              <TableHead className={cn("w-[130px]", isRTL && "text-right")}>
                <SortableHeader field="created_at">
                  {isRTL ? 'التاريخ' : 'Date'}
                </SortableHeader>
              </TableHead>
              <TableHead className={cn("w-[130px]", isRTL && "text-right")}>
                <SortableHeader field="total_amount">
                  {isRTL ? 'المبلغ' : 'Amount'}
                </SortableHeader>
              </TableHead>
              <TableHead className={cn("w-[200px]", isRTL ? "text-left" : "text-right")}>
                {isRTL ? 'الإجراءات' : 'Actions'}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {orders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95 }}
                  variants={rowVariants}
                  whileHover={reducedMotion ? {} : "hover"}
                  onHoverStart={() => setHoveredRow(order.id)}
                  onHoverEnd={() => setHoveredRow(null)}
                  onClick={() => onRowClick(order)}
                  className={cn(
                    'cursor-pointer transition-all duration-200 border-b group relative',
                    'hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent',
                    selectedOrderId === order.id && 'bg-primary/10 hover:bg-primary/15 ring-1 ring-inset ring-primary/30'
                  )}
                >
                  {/* Status */}
                  <TableCell className={cn(isRTL && "text-right")}>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: reducedMotion ? 0 : index * 0.03 + 0.1 }}
                    >
                      <OrderStatusBadge status={order.status} size="sm" />
                    </motion.div>
                  </TableCell>
                  
                  {/* Service Name */}
                  <TableCell className={cn(isRTL && "text-right")}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate block max-w-[220px] group-hover:text-primary transition-colors">
                        {isRTL 
                          ? (order.service?.name_ar || order.title_ar || order.title)
                          : (order.service?.name || order.title)}
                      </span>
                    </div>
                  </TableCell>
                  
                  {/* Order Number */}
                  <TableCell className={cn(isRTL && "text-right")}>
                    <span 
                      dir="ltr" 
                      className="font-mono text-sm text-muted-foreground tabular-nums inline-block bg-muted/60 px-2.5 py-1 rounded-lg transition-colors group-hover:bg-muted"
                    >
                      {order.order_number}
                    </span>
                  </TableCell>
                  
                  {/* Date */}
                  <TableCell className={cn("text-sm text-muted-foreground", isRTL && "text-right")}>
                    {formatDate(order.created_at)}
                  </TableCell>
                  
                  {/* Amount */}
                  <TableCell className={cn(isRTL && "text-right")}>
                    {order.total_amount ? (
                      <span dir="ltr" className="font-semibold tabular-nums inline-flex items-center gap-1.5 text-primary">
                        <span className="text-muted-foreground text-xs font-normal">SAR</span>
                        {formatCurrency(order.total_amount)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  
                  {/* Actions - INLINE, NO POPUP */}
                  <TableCell className={cn(isRTL ? "text-left" : "text-right")}>
                    <motion.div 
                      className={cn(
                        "flex items-center gap-1.5",
                        isRTL ? "justify-start" : "justify-end"
                      )}
                      initial="hidden"
                      animate={hoveredRow === order.id || selectedOrderId === order.id ? "visible" : "hidden"}
                      variants={{
                        hidden: { opacity: 0.5 },
                        visible: { opacity: 1 },
                      }}
                    >
                      {/* View Details */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={cn(
                              "h-8 px-2.5 gap-1.5 transition-all duration-200",
                              "hover:bg-primary hover:text-primary-foreground",
                              "opacity-60 group-hover:opacity-100"
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              onRowClick(order);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="hidden lg:inline text-xs">
                              {isRTL ? 'عرض' : 'View'}
                            </span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          {isRTL ? 'عرض التفاصيل' : 'View Details'}
                        </TooltipContent>
                      </Tooltip>

                      {/* Download Invoice */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={cn(
                              "h-8 px-2.5 gap-1.5 transition-all duration-200",
                              "hover:bg-emerald-500 hover:text-white",
                              "opacity-60 group-hover:opacity-100"
                            )}
                            onClick={(e) => handleDownloadInvoice(e, order)}
                            disabled={downloadingId === order.id}
                          >
                            {downloadingId === order.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                            <span className="hidden lg:inline text-xs">
                              {isRTL ? 'فاتورة' : 'Invoice'}
                            </span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          {isRTL ? 'تحميل الفاتورة' : 'Download Invoice'}
                        </TooltipContent>
                      </Tooltip>

                      {/* View Contract */}
                      {order.contract_id && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className={cn(
                                "h-8 px-2.5 gap-1.5 transition-all duration-200",
                                "hover:bg-blue-500 hover:text-white",
                                "opacity-60 group-hover:opacity-100"
                              )}
                              onClick={(e) => handleViewContract(e, order)}
                            >
                              <ScrollText className="h-4 w-4" />
                              <span className="hidden lg:inline text-xs">
                                {isRTL ? 'العقد' : 'Contract'}
                              </span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            {isRTL ? 'عرض العقد' : 'View Contract'}
                          </TooltipContent>
                        </Tooltip>
                      )}

                      {/* Expand Arrow */}
                      <motion.div
                        animate={{ x: hoveredRow === order.id ? (isRTL ? -4 : 4) : 0 }}
                        transition={{ duration: 0.2 }}
                        className="opacity-40 group-hover:opacity-100"
                      >
                        <ExpandIcon className="h-4 w-4 text-muted-foreground" />
                      </motion.div>
                    </motion.div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </motion.div>
    </TooltipProvider>
  );
}

// Enhanced Skeleton loader
function OrdersTableSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border bg-card overflow-hidden shadow-sm"
    >
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex gap-4 border-b pb-4">
          {[28, '1fr', 32, 28, 24, 48].map((w, i) => (
            <Skeleton 
              key={i} 
              className={cn("h-8", typeof w === 'number' ? `w-${w}` : 'flex-1')} 
              style={{ width: typeof w === 'number' ? w * 4 : undefined, flex: w === '1fr' ? 1 : undefined }}
            />
          ))}
        </div>
        {/* Rows */}
        {[...Array(5)].map((_, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex gap-4 py-3"
          >
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 flex-1" />
            <Skeleton className="h-6 w-28 rounded-lg" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
            <div className="flex gap-1">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
