/**
 * OrdersTable - Enterprise data table for desktop view
 * RTL-strict with proper column ordering, LTR spans for IDs/amounts
 */

import { motion } from 'framer-motion';
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
import { cn } from '@/lib/utils';
import { 
  ChevronUp, 
  ChevronDown,
  Eye,
  FileText,
  ScrollText,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CustomerOrder, OrdersSort, SortField } from './types';
import { OrderStatusBadge } from './OrderStatusBadge';

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

  // Row animation variants
  const rowVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: reducedMotion ? 0 : i * 0.025,
        duration: reducedMotion ? 0 : 0.15,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    }),
  };

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
    }).format(new Date(dateString));
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sort.field !== field) return null;
    return sort.direction === 'asc' 
      ? <ChevronUp className="h-4 w-4" />
      : <ChevronDown className="h-4 w-4" />;
  };

  const SortableHeader = ({ 
    field, 
    children 
  }: { 
    field: SortField; 
    children: React.ReactNode;
  }) => (
    <button
      onClick={() => onSort(field)}
      className={cn(
        'flex items-center gap-1 hover:text-foreground transition-colors whitespace-nowrap',
        sort.field === field ? 'text-foreground font-semibold' : 'text-muted-foreground'
      )}
    >
      {children}
      <SortIcon field={field} />
    </button>
  );

  if (isLoading && orders.length === 0) {
    return <OrdersTableSkeleton />;
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/40 sticky top-0 z-10">
          <TableRow className="hover:bg-transparent border-b-2">
            {/* RTL Column Order: الحالة - الخدمة - رقم الطلب - تاريخ الإنشاء - آخر تحديث - المبلغ - إجراء */}
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
                {isRTL ? 'تاريخ الإنشاء' : 'Created'}
              </SortableHeader>
            </TableHead>
            <TableHead className={cn("w-[130px]", isRTL && "text-right")}>
              <SortableHeader field="updated_at">
                {isRTL ? 'آخر تحديث' : 'Updated'}
              </SortableHeader>
            </TableHead>
            <TableHead className={cn("w-[130px]", isRTL && "text-right")}>
              <SortableHeader field="total_amount">
                {isRTL ? 'المبلغ (ر.س)' : 'Amount'}
              </SortableHeader>
            </TableHead>
            {/* Actions column - Always on far left in RTL */}
            <TableHead className={cn("w-[80px]", isRTL ? "text-left" : "text-right")}>
              {isRTL ? 'إجراء' : 'Action'}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => (
            <motion.tr
              key={order.id}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={rowVariants}
              onClick={() => onRowClick(order)}
              className={cn(
                'cursor-pointer transition-all duration-150 border-b group',
                'hover:bg-muted/50 hover:shadow-sm',
                selectedOrderId === order.id && 'bg-primary/5 hover:bg-primary/10 ring-1 ring-inset ring-primary/20'
              )}
            >
              {/* Status */}
              <TableCell className={cn(isRTL && "text-right")}>
                <OrderStatusBadge status={order.status} size="sm" />
              </TableCell>
              
              {/* Service Name */}
              <TableCell className={cn(isRTL && "text-right")}>
                <span className="font-medium truncate block max-w-[220px]">
                  {isRTL 
                    ? (order.service?.name_ar || order.title_ar || order.title)
                    : (order.service?.name || order.title)}
                </span>
              </TableCell>
              
              {/* Order Number - Always LTR */}
              <TableCell className={cn(isRTL && "text-right")}>
                <span 
                  dir="ltr" 
                  className="font-mono text-sm text-muted-foreground tabular-nums inline-block bg-muted/50 px-2 py-0.5 rounded"
                >
                  {order.order_number}
                </span>
              </TableCell>
              
              {/* Created Date */}
              <TableCell className={cn("text-sm text-muted-foreground", isRTL && "text-right")}>
                {formatDate(order.created_at)}
              </TableCell>
              
              {/* Updated Date */}
              <TableCell className={cn("text-sm text-muted-foreground", isRTL && "text-right")}>
                {formatDate(order.updated_at)}
              </TableCell>
              
              {/* Amount - LTR for numbers */}
              <TableCell className={cn(isRTL && "text-right")}>
                {order.total_amount ? (
                  <span dir="ltr" className="font-semibold tabular-nums inline-flex items-center gap-1">
                    <span className="text-muted-foreground text-xs">SAR</span>
                    {formatCurrency(order.total_amount, order.currency)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              
              {/* Actions */}
              <TableCell className={cn(isRTL ? "text-left" : "text-right")}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-40">
                    <DropdownMenuItem onClick={() => onRowClick(order)}>
                      <Eye className="h-4 w-4 me-2" />
                      {isRTL ? 'عرض التفاصيل' : 'View Details'}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="h-4 w-4 me-2" />
                      {isRTL ? 'الفاتورة' : 'Invoice'}
                    </DropdownMenuItem>
                    {order.contract_id && (
                      <DropdownMenuItem>
                        <ScrollText className="h-4 w-4 me-2" />
                        {isRTL ? 'العقد' : 'Contract'}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Skeleton loader for table
function OrdersTableSkeleton() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <div className="p-4 space-y-4">
        {/* Header skeleton */}
        <div className="flex gap-4 border-b pb-4">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        {/* Row skeletons */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 py-3 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 flex-1" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}
