/**
 * OrdersCardList - Mobile-first app-like card view for orders
 * RTL-first with premium animations
 */

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  ArrowLeft, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { CustomerOrder } from './types';
import { OrderStatusBadge } from './OrderStatusBadge';

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

  const ArrowIcon = isRTL ? ChevronLeft : ChevronRight;

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.97 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: reducedMotion ? 0 : i * 0.04,
        duration: reducedMotion ? 0 : 0.2,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    }),
  };

  const formatCurrency = (amount: number | null, currency: string | null) => {
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

  if (isLoading && orders.length === 0) {
    return <OrdersCardSkeleton />;
  }

  return (
    <div className="space-y-3">
      {orders.map((order, index) => (
        <motion.div
          key={order.id}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={reducedMotion ? {} : { scale: 1.01, y: -2 }}
          whileTap={reducedMotion ? {} : { scale: 0.99 }}
        >
          <Card
            className={cn(
              'cursor-pointer transition-all duration-200 overflow-hidden',
              'hover:shadow-lg hover:border-primary/30',
              'active:scale-[0.99]',
              'bg-gradient-to-br from-card to-card/95',
              selectedOrderId === order.id && 'border-primary ring-2 ring-primary/20 shadow-lg'
            )}
            onClick={() => onCardClick(order)}
          >
            <CardContent className="p-4">
              {/* Top Row: Status Badge + Amount */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <OrderStatusBadge status={order.status} />
                {order.total_amount && (
                  <div className="text-end shrink-0">
                    <p dir="ltr" className="text-xl font-bold text-primary tabular-nums">
                      <span className="text-xs font-normal text-muted-foreground me-1">SAR</span>
                      {formatCurrency(order.total_amount, order.currency)}
                    </p>
                  </div>
                )}
              </div>

              {/* Service Name */}
              <h3 className="font-semibold text-base mb-2 line-clamp-1">
                {isRTL 
                  ? (order.service?.name_ar || order.title_ar || order.title)
                  : (order.service?.name || order.title)}
              </h3>

              {/* Order Number - Always LTR */}
              <div className="mb-3">
                <span 
                  dir="ltr" 
                  className="inline-block font-mono text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-md tabular-nums"
                >
                  {order.order_number}
                </span>
              </div>

              {/* Footer: Date + CTA */}
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(order.created_at)}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1 text-primary h-8 px-2 hover:bg-primary/10"
                >
                  {isRTL ? 'التفاصيل' : 'Details'}
                  <ArrowIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// Skeleton loader for cards
function OrdersCardSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-7 w-20" />
            </div>
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-6 w-32 mb-3 rounded-md" />
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
