/**
 * OrdersStats - Dark Theme Stats Component
 * Premium KPI cards with animations
 */

import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Clock, 
  Truck, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  DollarSign,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrdersStatsProps {
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    totalRevenue: number;
  };
  isRTL: boolean;
}

export function OrdersStats({ stats, isRTL }: OrdersStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statsCards = [
    { 
      key: 'total',
      label: isRTL ? 'إجمالي الطلبات' : 'Total Orders', 
      value: stats.total, 
      icon: ShoppingCart, 
      gradient: 'from-blue-500 to-blue-600',
      bgGlow: 'bg-blue-500/20',
      iconBg: 'bg-blue-500/20',
      textColor: 'text-blue-400',
      change: '+12%',
      changePositive: true
    },
    { 
      key: 'pending',
      label: isRTL ? 'قيد الانتظار' : 'Pending', 
      value: stats.pending, 
      icon: Clock, 
      gradient: 'from-amber-500 to-orange-500',
      bgGlow: 'bg-amber-500/20',
      iconBg: 'bg-amber-500/20',
      textColor: 'text-amber-400',
      change: '-3%',
      changePositive: false
    },
    { 
      key: 'inProgress',
      label: isRTL ? 'قيد التنفيذ' : 'In Progress', 
      value: stats.inProgress, 
      icon: Truck, 
      gradient: 'from-indigo-500 to-purple-500',
      bgGlow: 'bg-indigo-500/20',
      iconBg: 'bg-indigo-500/20',
      textColor: 'text-indigo-400',
      change: '+8%',
      changePositive: true
    },
    { 
      key: 'completed',
      label: isRTL ? 'مكتمل' : 'Completed', 
      value: stats.completed, 
      icon: CheckCircle, 
      gradient: 'from-emerald-500 to-teal-500',
      bgGlow: 'bg-emerald-500/20',
      iconBg: 'bg-emerald-500/20',
      textColor: 'text-emerald-400',
      change: '+24%',
      changePositive: true
    },
    { 
      key: 'cancelled',
      label: isRTL ? 'ملغي' : 'Cancelled', 
      value: stats.cancelled, 
      icon: XCircle, 
      gradient: 'from-red-500 to-rose-500',
      bgGlow: 'bg-red-500/20',
      iconBg: 'bg-red-500/20',
      textColor: 'text-red-400',
      change: '-5%',
      changePositive: true
    },
    { 
      key: 'revenue',
      label: isRTL ? 'الإيرادات' : 'Revenue', 
      value: formatCurrency(stats.totalRevenue), 
      icon: DollarSign, 
      gradient: 'from-cyan-500 to-blue-500',
      bgGlow: 'bg-cyan-500/20',
      iconBg: 'bg-cyan-500/20',
      textColor: 'text-cyan-400',
      change: '+18%',
      changePositive: true,
      isRevenue: true
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statsCards.map((stat, index) => (
        <motion.div
          key={stat.key}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="group"
        >
          <div className={cn(
            "relative overflow-hidden rounded-xl p-4",
            "bg-[#0f1629] border border-slate-800",
            "hover:border-slate-700 transition-all duration-300",
            "hover:shadow-lg hover:shadow-slate-900/50"
          )}>
            {/* Background glow effect */}
            <div className={cn(
              "absolute -top-10 -end-10 w-24 h-24 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity",
              stat.bgGlow
            )} />
            
            {/* Content */}
            <div className="relative space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className={cn(
                  "p-2 rounded-lg",
                  stat.iconBg
                )}>
                  <stat.icon className={cn("h-4 w-4", stat.textColor)} />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                  stat.changePositive 
                    ? "bg-emerald-500/10 text-emerald-400" 
                    : "bg-red-500/10 text-red-400"
                )}>
                  <TrendingUp className={cn(
                    "h-2.5 w-2.5",
                    !stat.changePositive && "rotate-180"
                  )} />
                  {stat.change}
                </div>
              </div>
              
              {/* Value */}
              <div>
                <p className={cn(
                  "text-2xl font-bold text-white",
                  stat.isRevenue && "text-lg"
                )}>
                  {stat.value}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
              </div>
              
              {/* Progress bar */}
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((typeof stat.value === 'number' ? stat.value : 50) / stats.total * 100, 100)}%` }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  className={cn("h-full rounded-full bg-gradient-to-r", stat.gradient)}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
