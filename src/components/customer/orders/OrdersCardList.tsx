/**
 * OrdersCardList - Mobile-first card view for orders
 * RTL-first with animations
 */

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import { CustomerOrder } from './types';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrdersCardListProps {
  orders: CustomerOrder[];
  isLoading: boolean;
  onCardClick: (order: CustomerOrder) => void;
  selectedOrderId?: string;
}

// Card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

export function OrdersCardList({
  orders,
  isLoading,
  onCardClick,
  selectedOrderId,
}: OrdersCardListProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

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
    }).format(new Date(dateString));
  };

  if (isLoading) {
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
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Card
            className={cn(
              'cursor-pointer transition-all duration-200',
              'hover:shadow-md hover:border-primary/20',
              'active:scale-[0.99]',
              selectedOrderId === order.id && 'border-primary ring-1 ring-primary/20'
            )}
            onClick={() => onCardClick(order)}
          >
            <CardContent className="p-4">
              {/* Header: Status + Service Name */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base truncate mb-1">
                    {isRTL 
                      ? (order.service?.name_ar || order.title_ar || order.title)
                      : (order.service?.name || order.title)}
                  </h3>
                  <OrderStatusBadge status={order.status} />
                </div>
                {order.total_amount && (
                  <div className="text-end shrink-0">
                    <p dir="ltr" className="text-lg font-bold text-primary tabular-nums">
                      {formatCurrency(order.total_amount, order.currency)}
                    </p>
                  </div>
                )}
              </div>

              {/* Order Number */}
              <div className="mb-3">
                <span 
                  dir="ltr" 
                  className="inline-block font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded tabular-nums"
                >
                  {order.order_number}
                </span>
              </div>

              {/* Footer: Date + CTA */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(order.created_at)}
                </span>
                <Button variant="ghost" size="sm" className="gap-1 text-primary h-8">
                  {isRTL ? 'عرض التفاصيل' : 'View Details'}
                  <ArrowIcon className="h-3.5 w-3.5" />
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
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-6 w-32 mb-3" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
