/**
 * Modern Card Components
 * Stripe/Notion/Apple Inspired
 * Clean, Minimal, Professional
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import '@/styles/v3/modern-theme.css';

/* =========================================
   Base Card
   ========================================= */

interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  children,
  className,
  hover = false,
  onClick,
}) => {
  return (
    <div
      className={cn(
        'modern-card',
        hover && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

interface ModernCardHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const ModernCardHeader: React.FC<ModernCardHeaderProps> = ({
  title,
  description,
  action,
  className,
}) => {
  return (
    <div className={cn('modern-card-header', className)}>
      <div>
        <h3 className="modern-card-title">{title}</h3>
        {description && (
          <p className="modern-card-description">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

interface ModernCardContentProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const ModernCardContent: React.FC<ModernCardContentProps> = ({
  children,
  className,
  noPadding = false,
}) => {
  return (
    <div className={cn(!noPadding && 'modern-card-content', className)}>
      {children}
    </div>
  );
};

interface ModernCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const ModernCardFooter: React.FC<ModernCardFooterProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('modern-card-footer', className)}>
      {children}
    </div>
  );
};

/* =========================================
   Stat Card - Dashboard KPIs
   ========================================= */

type TrendDirection = 'up' | 'down' | 'neutral';

interface ModernStatCardProps {
  icon: React.ReactNode;
  iconColor?: string;
  iconBg?: string;
  label: string;
  value: string | number;
  change?: {
    value: number;
    direction: TrendDirection;
    label?: string;
  };
  className?: string;
  onClick?: () => void;
}

export const ModernStatCard: React.FC<ModernStatCardProps> = ({
  icon,
  iconColor = 'hsl(var(--modern-brand-primary))',
  iconBg = 'hsl(var(--modern-brand-primary) / 0.1)',
  label,
  value,
  change,
  className,
  onClick,
}) => {
  const TrendIcon = change?.direction === 'up' 
    ? TrendingUp 
    : change?.direction === 'down' 
      ? TrendingDown 
      : Minus;

  return (
    <motion.div
      className={cn('modern-stat-card', onClick && 'cursor-pointer', className)}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
    >
      <div 
        className="modern-stat-icon"
        style={{ 
          background: iconBg,
          color: iconColor,
        }}
      >
        {icon}
      </div>
      
      <div className="modern-stat-value">{value}</div>
      <div className="modern-stat-label">{label}</div>
      
      {change && (
        <div 
          className={cn(
            'modern-stat-change',
            change.direction === 'up' && 'positive',
            change.direction === 'down' && 'negative'
          )}
        >
          <TrendIcon size={12} />
          <span>{Math.abs(change.value)}%</span>
          {change.label && <span className="opacity-70">{change.label}</span>}
        </div>
      )}
    </motion.div>
  );
};

/* =========================================
   Stats Grid
   ========================================= */

interface ModernStatsGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export const ModernStatsGrid: React.FC<ModernStatsGridProps> = ({
  children,
  columns = 4,
  className,
}) => {
  const gridClass = columns === 2 
    ? 'modern-grid-2' 
    : columns === 3 
      ? 'modern-grid-3' 
      : 'modern-grid-4';

  return (
    <div className={cn(gridClass, className)}>
      {children}
    </div>
  );
};

/* =========================================
   Empty State
   ========================================= */

interface ModernEmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const ModernEmptyState: React.FC<ModernEmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div className={cn('modern-empty-state', className)}>
      <div className="modern-empty-state-icon">{icon}</div>
      <h3 className="modern-empty-state-title">{title}</h3>
      {description && (
        <p className="modern-empty-state-description">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

/* =========================================
   Section Header
   ========================================= */

interface ModernSectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const ModernSectionHeader: React.FC<ModernSectionHeaderProps> = ({
  title,
  description,
  action,
  className,
}) => {
  return (
    <div 
      className={cn(
        'flex items-start justify-between gap-4 mb-6',
        className
      )}
    >
      <div>
        <h2 
          className="font-semibold"
          style={{ 
            fontSize: 'var(--modern-text-xl)',
            color: 'hsl(var(--modern-text-primary))',
          }}
        >
          {title}
        </h2>
        {description && (
          <p 
            className="mt-1"
            style={{ 
              fontSize: 'var(--modern-text-sm)',
              color: 'hsl(var(--modern-text-muted))',
            }}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

/* =========================================
   Badge
   ========================================= */

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface ModernBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  className?: string;
}

export const ModernBadge: React.FC<ModernBadgeProps> = ({
  children,
  variant = 'neutral',
  icon,
  className,
}) => {
  const variantClass = `modern-badge-${variant}`;
  
  return (
    <span className={cn('modern-badge', variantClass, className)}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
};

/* =========================================
   Button
   ========================================= */

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  loading?: boolean;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'start',
  loading = false,
  className,
  disabled,
  ...props
}) => {
  const variantClass = `modern-btn-${variant}`;
  const sizeClass = size === 'sm' ? 'modern-btn-sm' : size === 'lg' ? 'modern-btn-lg' : '';

  return (
    <button
      className={cn(
        'modern-btn',
        variantClass,
        sizeClass,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon && iconPosition === 'start' ? (
        icon
      ) : null}
      {children}
      {!loading && icon && iconPosition === 'end' ? icon : null}
    </button>
  );
};

/* =========================================
   Divider
   ========================================= */

interface ModernDividerProps {
  className?: string;
}

export const ModernDivider: React.FC<ModernDividerProps> = ({ className }) => {
  return <div className={cn('modern-divider', className)} />;
};
