/**
 * Modern Card Components
 * Unified Design System - Enterprise SaaS Standard
 * Uses Design System tokens from design-system.css
 * 
 * STRICT SPECIFICATIONS - All dimensions follow DS tokens
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import '@/styles/v3/modern-theme.css';

/* =========================================
   Base Card - Uses ds-card class
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
        'ds-card',
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
    <div className={cn('ds-card-header', className)}>
      <div>
        <h3 className="ds-heading-4">{title}</h3>
        {description && (
          <p className="ds-body-sm ds-mt-2">{description}</p>
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
    <div className={cn(!noPadding && 'ds-card-content', className)}>
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
    <div className={cn('ds-card-footer', className)}>
      {children}
    </div>
  );
};

/* =========================================
   Stat Card - Dashboard KPIs (Uses DS tokens)
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
  iconColor = 'hsl(var(--ds-brand-primary))',
  iconBg = 'hsl(var(--ds-brand-primary) / 0.1)',
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
      className={cn('ds-stat-card', onClick && 'cursor-pointer', className)}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
    >
      <div 
        className="ds-stat-icon"
        style={{ 
          background: iconBg,
          color: iconColor,
        }}
      >
        {icon}
      </div>
      
      <div className="ds-stat-value">{value}</div>
      <div className="ds-stat-label">{label}</div>
      
      {change && (
        <div 
          className={cn(
            'ds-badge',
            change.direction === 'up' && 'ds-badge-success',
            change.direction === 'down' && 'ds-badge-error',
            change.direction === 'neutral' && 'ds-badge-neutral',
            'ds-mt-4'
          )}
        >
          <TrendIcon size={12} />
          <span>{Math.abs(change.value)}%</span>
          {change.label && <span style={{ opacity: 0.7 }}>{change.label}</span>}
        </div>
      )}
    </motion.div>
  );
};

/* =========================================
   Stats Grid (Uses DS tokens)
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
    ? 'ds-grid-2' 
    : columns === 3 
      ? 'ds-grid-3' 
      : 'ds-grid-4';

  return (
    <div className={cn(gridClass, className)}>
      {children}
    </div>
  );
};

/* =========================================
   Empty State (Uses DS tokens)
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
    <div 
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'ds-py-6',
        className
      )}
    >
      <div 
        className="ds-icon-xl ds-mb-4"
        style={{ color: 'hsl(var(--ds-text-muted))' }}
      >
        {icon}
      </div>
      <h3 className="ds-heading-4 ds-mb-2">{title}</h3>
      {description && (
        <p className="ds-body-sm" style={{ maxWidth: '24rem' }}>
          {description}
        </p>
      )}
      {action && <div className="ds-mt-6">{action}</div>}
    </div>
  );
};

/* =========================================
   Section Header (Uses DS tokens)
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
        'flex items-start justify-between ds-gap-4 ds-mb-6',
        className
      )}
    >
      <div>
        <h2 className="ds-heading-3">{title}</h2>
        {description && (
          <p className="ds-body-sm ds-mt-2">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

/* =========================================
   Badge (Uses DS tokens)
   ========================================= */

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary';

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
  const variantClass = `ds-badge-${variant}`;
  
  return (
    <span className={cn('ds-badge', variantClass, className)}>
      {icon && <span className="ds-icon-xs">{icon}</span>}
      {children}
    </span>
  );
};

/* =========================================
   Button (Uses DS tokens)
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
  const variantClass = `ds-btn-${variant}`;
  const sizeClass = size === 'sm' ? 'ds-btn-sm' : size === 'lg' ? 'ds-btn-lg' : 'ds-btn-md';

  return (
    <button
      className={cn(
        'ds-btn',
        variantClass,
        sizeClass,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="ds-icon-sm border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon && iconPosition === 'start' ? (
        <span className="ds-icon-sm">{icon}</span>
      ) : null}
      {children}
      {!loading && icon && iconPosition === 'end' ? <span className="ds-icon-sm">{icon}</span> : null}
    </button>
  );
};

/* =========================================
   Divider (Uses DS tokens)
   ========================================= */

interface ModernDividerProps {
  className?: string;
  subtle?: boolean;
}

export const ModernDivider: React.FC<ModernDividerProps> = ({ className, subtle = false }) => {
  return <hr className={cn(subtle ? 'ds-divider-subtle' : 'ds-divider', className)} />;
};
