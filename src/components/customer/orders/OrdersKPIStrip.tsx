/**
 * OrdersKPIStrip - Premium KPI Cards with Animations
 * RTL-first with count-up and hover effects
 */

import { useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
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
  Sparkles,
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
  ringColor: string;
}

const KPI_CONFIG: KPIConfig[] = [
  {
    key: 'all',
    labelAr: 'إجمالي الطلبات',
    labelEn: 'Total Orders',
    icon: Package,
    gradient: 'from-primary/15 via-primary/10 to-primary/5',
    iconBg: 'bg-primary/15 text-primary',
    ringColor: 'ring-primary',
  },
  {
    key: 'pending',
    labelAr: 'قيد المراجعة',
    labelEn: 'Pending Review',
    icon: Clock,
    gradient: 'from-amber-500/15 via-amber-500/10 to-amber-500/5',
    iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
    ringColor: 'ring-amber-500',
  },
  {
    key: 'in_progress',
    labelAr: 'قيد التنفيذ',
    labelEn: 'In Progress',
    icon: Truck,
    gradient: 'from-blue-500/15 via-blue-500/10 to-blue-500/5',
    iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
    ringColor: 'ring-blue-500',
  },
  {
    key: 'completed',
    labelAr: 'مكتملة',
    labelEn: 'Completed',
    icon: CheckCircle,
    gradient: 'from-emerald-500/15 via-emerald-500/10 to-emerald-500/5',
    iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
    ringColor: 'ring-emerald-500',
  },
];

// Animated counter component
function AnimatedCounter({ value, reducedMotion }: { value: number; reducedMotion: boolean }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (reducedMotion) {
      setDisplayValue(value);
      return;
    }
    
    const duration = 600;
    const startTime = Date.now();
    const startValue = displayValue;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (value - startValue) * eased);
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, reducedMotion]);
  
  return <span className="tabular-nums">{displayValue}</span>;
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: reducedMotion ? 0 : 0.3,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {KPI_CONFIG.map((_, i) => (
          <Card key={i} className="p-4 border-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-12" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {KPI_CONFIG.map((config, index) => {
        const Icon = config.icon;
        const count = counts[config.key] || 0;
        const isActive = activeFilter === config.key;

        return (
          <motion.div
            key={config.key}
            variants={cardVariants}
          >
            <motion.div
              whileHover={reducedMotion ? {} : { scale: 1.03, y: -4 }}
              whileTap={reducedMotion ? {} : { scale: 0.97 }}
            >
              <Card
                onClick={() => onFilterByStatus(config.key)}
                className={cn(
                  'p-4 cursor-pointer transition-all duration-300 border-2 overflow-hidden relative',
                  'hover:shadow-xl',
                  'bg-gradient-to-br',
                  config.gradient,
                  isActive && `ring-2 ${config.ringColor} shadow-lg border-transparent`
                )}
              >
                {/* Glow effect on active */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
                
                <div className="relative flex items-center gap-3">
                  <motion.div 
                    className={cn(
                      'h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm',
                      config.iconBg
                    )}
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="h-6 w-6" />
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground truncate font-medium">
                      {isRTL ? config.labelAr : config.labelEn}
                    </p>
                    <p className="text-3xl font-bold mt-0.5">
                      <AnimatedCounter value={count} reducedMotion={reducedMotion} />
                    </p>
                  </div>
                  
                  {/* Active indicator */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute top-2 end-2"
                      >
                        <Sparkles className="h-4 w-4 text-primary" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
