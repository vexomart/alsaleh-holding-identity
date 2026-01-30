import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning';
  loading?: boolean;
  index?: number;
}

const colorVariants = {
  primary: {
    bg: 'bg-primary/10 dark:bg-primary/20',
    icon: 'text-primary',
    border: 'border-primary/20',
    glow: 'hover:shadow-primary/20',
  },
  secondary: {
    bg: 'bg-secondary/10 dark:bg-secondary/20',
    icon: 'text-secondary',
    border: 'border-secondary/20',
    glow: 'hover:shadow-secondary/20',
  },
  accent: {
    bg: 'bg-accent/10 dark:bg-accent/20',
    icon: 'text-accent',
    border: 'border-accent/20',
    glow: 'hover:shadow-accent/20',
  },
  success: {
    bg: 'bg-success/10 dark:bg-success/20',
    icon: 'text-success',
    border: 'border-success/20',
    glow: 'hover:shadow-success/20',
  },
  warning: {
    bg: 'bg-warning/10 dark:bg-warning/20',
    icon: 'text-warning',
    border: 'border-warning/20',
    glow: 'hover:shadow-warning/20',
  },
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  trend = 'neutral',
  color = 'primary',
  loading = false,
  index = 0,
}) => {
  const colors = colorVariants[color];

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        'relative group rounded-2xl p-6 bg-card border transition-all duration-300',
        'hover:shadow-xl cursor-pointer',
        colors.border,
        colors.glow
      )}
    >
      {/* Background Gradient */}
      <div className={cn(
        'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        'bg-gradient-to-br from-transparent via-transparent to-primary/5'
      )} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn('p-3 rounded-xl', colors.bg)}>
            <Icon className={cn('w-6 h-6', colors.icon)} />
          </div>
          {change !== undefined && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                trend === 'up' && 'bg-success/10 text-success',
                trend === 'down' && 'bg-destructive/10 text-destructive',
                trend === 'neutral' && 'bg-muted text-muted-foreground'
              )}
            >
              <TrendIcon className="w-3 h-3" />
              <span>{Math.abs(change)}%</span>
            </motion.div>
          )}
        </div>

        {/* Value */}
        <div className="space-y-1">
          {loading ? (
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="text-2xl md:text-3xl font-bold text-foreground"
            >
              {value}
            </motion.p>
          )}
          <p className="text-sm text-muted-foreground">{title}</p>
          {changeLabel && (
            <p className={cn('text-xs', trendColor)}>{changeLabel}</p>
          )}
        </div>

        {/* Animated Progress Bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
          className={cn(
            'absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl origin-left',
            colors.bg
          )}
        />
      </div>
    </motion.div>
  );
};
