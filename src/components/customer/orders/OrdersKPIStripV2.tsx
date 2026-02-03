/**
 * OrdersKPIStripV2 - Next-Gen Premium KPI Cards
 * Ultra-modern design with advanced animations and 3D effects
 */

import { useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { CustomerOrder, OrderStatus } from './types';

interface OrdersKPIStripV2Props {
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
  iconColor: string;
  glowColor: string;
  ringColor: string;
}

const KPI_CONFIG: KPIConfig[] = [
  {
    key: 'all',
    labelAr: 'إجمالي الطلبات',
    labelEn: 'Total Orders',
    icon: Package,
    gradient: 'from-primary/10 via-primary/5 to-transparent',
    iconBg: 'bg-gradient-to-br from-primary/20 to-primary/10',
    iconColor: 'text-primary',
    glowColor: 'shadow-primary/20',
    ringColor: 'ring-primary',
  },
  {
    key: 'pending',
    labelAr: 'قيد المراجعة',
    labelEn: 'Pending Review',
    icon: Clock,
    gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    iconBg: 'bg-gradient-to-br from-amber-500/20 to-amber-500/10',
    iconColor: 'text-amber-500',
    glowColor: 'shadow-amber-500/20',
    ringColor: 'ring-amber-500',
  },
  {
    key: 'in_progress',
    labelAr: 'قيد التنفيذ',
    labelEn: 'In Progress',
    icon: Truck,
    gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
    iconBg: 'bg-gradient-to-br from-blue-500/20 to-blue-500/10',
    iconColor: 'text-blue-500',
    glowColor: 'shadow-blue-500/20',
    ringColor: 'ring-blue-500',
  },
  {
    key: 'completed',
    labelAr: 'مكتملة',
    labelEn: 'Completed',
    icon: CheckCircle,
    gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    iconBg: 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/10',
    iconColor: 'text-emerald-500',
    glowColor: 'shadow-emerald-500/20',
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
    
    const duration = 800;
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

export function OrdersKPIStripV2({
  orders,
  isLoading,
  onFilterByStatus,
  activeFilter,
}: OrdersKPIStripV2Props) {
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
        staggerChildren: reducedMotion ? 0 : 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: reducedMotion ? {} : { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CONFIG.map((_, i) => (
          <Card key={i} className="p-5 border-2">
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-2xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-16" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
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
                  'relative p-5 cursor-pointer transition-all duration-500 border-2 overflow-hidden',
                  'hover:shadow-2xl',
                  isActive && `ring-2 ${config.ringColor} shadow-xl border-transparent ${config.glowColor}`
                )}
              >
                {/* Background Gradient */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-50",
                  config.gradient
                )} />

                {/* Glow effect on active */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </AnimatePresence>

                {/* Sparkle on active */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-3 end-3"
                    >
                      <motion.div
                        animate={reducedMotion ? {} : { rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="h-5 w-5 text-primary/60" />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="relative flex items-center gap-4">
                  <motion.div 
                    className={cn(
                      'h-14 w-14 rounded-2xl flex items-center justify-center shrink-0',
                      'shadow-lg transition-all duration-300',
                      config.iconBg
                    )}
                    animate={isActive && !reducedMotion ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <Icon className={cn("h-7 w-7", config.iconColor)} />
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground truncate font-medium mb-1">
                      {isRTL ? config.labelAr : config.labelEn}
                    </p>
                    <motion.p 
                      className="text-4xl font-bold"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                    >
                      <AnimatedCounter value={count} reducedMotion={reducedMotion} />
                    </motion.p>
                  </div>
                </div>

                {/* Bottom Progress Bar */}
                <div className="absolute bottom-0 inset-x-0 h-1 bg-muted/30">
                  <motion.div
                    className={cn(
                      "h-full rounded-full",
                      config.key === 'all' && "bg-gradient-to-r from-primary to-emerald-500",
                      config.key === 'pending' && "bg-gradient-to-r from-amber-500 to-orange-500",
                      config.key === 'in_progress' && "bg-gradient-to-r from-blue-500 to-cyan-500",
                      config.key === 'completed' && "bg-gradient-to-r from-emerald-500 to-teal-500"
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: isActive ? '100%' : `${Math.min((count / Math.max(counts.all, 1)) * 100, 100)}%` }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </Card>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
