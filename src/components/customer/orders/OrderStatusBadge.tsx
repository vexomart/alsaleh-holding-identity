/**
 * OrderStatusBadge - Status chip component with proper styling
 */

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Clock, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  CreditCard,
} from 'lucide-react';
import { OrderStatus, ORDER_STATUS_CONFIG } from './types';

const STATUS_ICONS: Record<OrderStatus, React.ElementType> = {
  pending: Clock,
  processing: Package,
  in_progress: Truck,
  completed: CheckCircle,
  cancelled: XCircle,
  refunded: CreditCard,
};

interface OrderStatusBadgeProps {
  status: OrderStatus | null;
  size?: 'sm' | 'default';
  showIcon?: boolean;
}

export function OrderStatusBadge({ 
  status, 
  size = 'default',
  showIcon = true,
}: OrderStatusBadgeProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const safeStatus = status || 'pending';
  const config = ORDER_STATUS_CONFIG[safeStatus] || ORDER_STATUS_CONFIG.pending;
  const Icon = STATUS_ICONS[safeStatus] || Clock;

  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1.5 font-medium border whitespace-nowrap',
        config.bgColor,
        config.color,
        config.borderColor,
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'
      )}
    >
      {showIcon && (
        <Icon className={cn(
          'shrink-0',
          size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'
        )} />
      )}
      <span>{isRTL ? config.labelAr : config.labelEn}</span>
    </Badge>
  );
}
