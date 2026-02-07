/**
 * ServicesStats - Dark Theme Stats Cards
 * Premium statistics display for services
 */

import { motion } from 'framer-motion';
import { 
  Package, 
  CheckCircle, 
  XCircle, 
  Layers,
  DollarSign,
  TrendingUp,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Service {
  id: string;
  price: number | null;
  is_active: boolean | null;
  is_visible_to_customers: boolean | null;
  category: string | null;
}

interface ServicesStatsProps {
  services: Service[];
}

export function ServicesStats({ services }: ServicesStatsProps) {
  const stats = {
    total: services.length,
    active: services.filter(s => s.is_active).length,
    inactive: services.filter(s => !s.is_active).length,
    visible: services.filter(s => s.is_visible_to_customers).length,
    hidden: services.filter(s => !s.is_visible_to_customers).length,
    categories: [...new Set(services.map(s => s.category).filter(Boolean))].length,
    totalRevenue: services.reduce((acc, s) => acc + (s.price || 0), 0),
    avgPrice: services.length > 0 
      ? services.reduce((acc, s) => acc + (s.price || 0), 0) / services.filter(s => s.price).length 
      : 0,
  };

  const statCards = [
    {
      label: 'إجمالي الخدمات',
      value: stats.total,
      icon: Package,
      gradient: 'from-blue-500 to-indigo-600',
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'خدمات نشطة',
      value: stats.active,
      icon: CheckCircle,
      gradient: 'from-emerald-500 to-teal-600',
      iconColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'خدمات متوقفة',
      value: stats.inactive,
      icon: XCircle,
      gradient: 'from-red-500 to-rose-600',
      iconColor: 'text-red-400',
      bgColor: 'bg-red-500/10',
    },
    {
      label: 'التصنيفات',
      value: stats.categories,
      icon: Layers,
      gradient: 'from-purple-500 to-violet-600',
      iconColor: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'مرئية للعملاء',
      value: stats.visible,
      icon: Eye,
      gradient: 'from-cyan-500 to-blue-600',
      iconColor: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
    },
    {
      label: 'مخفية',
      value: stats.hidden,
      icon: EyeOff,
      gradient: 'from-orange-500 to-amber-600',
      iconColor: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className={cn(
            "relative overflow-hidden rounded-xl",
            "bg-[#0f1629] border border-slate-800",
            "hover:border-slate-700 transition-all duration-300",
            "group"
          )}>
            {/* Top Gradient Bar */}
            <div className={cn(
              "absolute top-0 inset-x-0 h-1 bg-gradient-to-r",
              stat.gradient
            )} />

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
                  <motion.p 
                    className="text-2xl font-bold text-white"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <div className={cn(
                  "p-2.5 rounded-xl transition-transform group-hover:scale-110",
                  stat.bgColor
                )}>
                  <stat.icon className={cn("h-5 w-5", stat.iconColor)} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
