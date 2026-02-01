/**
 * OrdersKPIStrip - Mini KPI cards for orders overview
 * RTL-first with count-up animations
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import { CustomerOrder, OrderStatus } from './types';

interface OrdersKPIStripProps {
  orders: CustomerOrder[];
  isLoading: boolean;
  onFilterByStatus: (status: OrderStatus | 'all') => void;
  activeFilter: OrderStatus | 'all';
}

interface KPIConfig {
  key: OrderStatus | 'all';
  labelAr: string;
  labelEn: string;
  icon: React.ElementType;
  gradient: string;
  iconBg: string;
}

const KPI_CONFIG: KPIConfig[] = [
  {
    key: 'all',
    labelAr: 'إجمالي الطلبات',
    labelEn: 'Total Orders',
    icon: Package,
    gradient: 'from-primary/10 to-primary/5',
    iconBg: 'bg-primary/10 text-primary',
  },
  {
    key: 'pending',
    labelAr: 'قيد المراجعة',
    labelEn: 'Pending Review',
    icon: Clock,
    gradient: 'from-amber-500/10 to-amber-500/5',
    iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  },
  {
    key: 'in_progress',
    labelAr: 'قيد التنفيذ',
    labelEn: 'In Progress',
    icon: Truck,
    gradient: 'from-blue-500/10 to-blue-500/5',
    iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    key: 'completed',
    labelAr: 'مكتملة',
    labelEn: 'Completed',
    icon: CheckCircle,
    gradient: 'from-emerald-500/10 to-emerald-500/5',
    iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
];

// Animated number component
function AnimatedNumber({ value, reducedMotion }: { value: number; reducedMotion: boolean }) {
  if (reducedMotion) {
    return <span>{value}</span>;
  }

  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {value}
    </motion.span>
  );
}

export function OrdersKPIStrip({
  orders,
  isLoading,
  onFilterByStatus,
  activeFilter,
}: OrdersKPIStripProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const reducedMotion = useReducedMotion();

  // Calculate counts
  const counts = useMemo(() => {
    const result: Record<string, number> = { all: orders.length };
    
    orders.forEach((order) => {
      const status = order.status || 'pending';
      result[status] = (result[status] || 0) + 1;
    });
    
    return result;
  }, [orders]);

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: reducedMotion ? 0 : i * 0.05,
        duration: reducedMotion ? 0 : 0.2,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    }),
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {KPI_CONFIG.map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-10" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {KPI_CONFIG.map((config, index) => {
        const Icon = config.icon;
        const count = counts[config.key] || 0;
        const isActive = activeFilter === config.key;

        return (
          <motion.div
            key={config.key}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card
              onClick={() => onFilterByStatus(config.key)}
              className={cn(
                'p-4 cursor-pointer transition-all duration-200',
                'hover:shadow-md hover:scale-[1.02]',
                'bg-gradient-to-br',
                config.gradient,
                isActive && 'ring-2 ring-primary shadow-md scale-[1.02]'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'h-10 w-10 rounded-xl flex items-center justify-center shrink-0',
                  config.iconBg
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground truncate">
                    {isRTL ? config.labelAr : config.labelEn}
                  </p>
                  <p className="text-2xl font-bold tabular-nums">
                    <AnimatedNumber value={count} reducedMotion={reducedMotion} />
                  </p>
                </div>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-2 w-2 rounded-full bg-primary shrink-0"
                  />
                )}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
