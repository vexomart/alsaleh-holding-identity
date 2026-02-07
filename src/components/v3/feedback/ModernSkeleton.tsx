/**
 * Modern Skeleton Components
 * Apple/Stripe Inspired Loading States
 * Smooth shimmer animations
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import '@/styles/v3/modern-theme.css';

/* =========================================
   Base Skeleton
   ========================================= */

interface SkeletonProps {
  className?: string;
  animate?: boolean;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  animate = true,
  style 
}) => {
  return (
    <div
      className={cn(
        'rounded-md',
        animate && 'animate-shimmer',
        className
      )}
      style={{
        backgroundSize: '200% 100%',
        background: 'linear-gradient(90deg, hsl(var(--modern-bg-elevated)) 0%, hsl(var(--modern-border-light)) 50%, hsl(var(--modern-bg-elevated)) 100%)',
        ...style
      }}
    />
  );
};

/* =========================================
   Skeleton Card
   ========================================= */

interface SkeletonCardProps {
  lines?: number;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  lines = 3,
  showHeader = true,
  showFooter = false,
  className,
}) => {
  return (
    <div className={cn('modern-card', className)}>
      {showHeader && (
        <div className="modern-card-header">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      )}
      <div className="modern-card-content space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton 
            key={i} 
            className="h-4" 
            style={{ width: `${100 - (i * 15)}%` }}
          />
        ))}
      </div>
      {showFooter && (
        <div className="modern-card-footer">
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      )}
    </div>
  );
};

/* =========================================
   Skeleton Stat Card
   ========================================= */

export const SkeletonStatCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('modern-stat-card', className)}>
      <Skeleton className="w-10 h-10 rounded-lg mb-4" />
      <Skeleton className="h-8 w-24 mb-2" />
      <Skeleton className="h-4 w-20 mb-3" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  );
};

/* =========================================
   Skeleton Stats Grid
   ========================================= */

interface SkeletonStatsGridProps {
  count?: number;
  columns?: 2 | 3 | 4;
  className?: string;
}

export const SkeletonStatsGrid: React.FC<SkeletonStatsGridProps> = ({
  count = 4,
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
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonStatCard key={i} />
      ))}
    </div>
  );
};

/* =========================================
   Skeleton Table
   ========================================= */

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 5,
  showHeader = true,
  className,
}) => {
  return (
    <div className={cn('modern-card overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="modern-table">
          {showHeader && (
            <thead>
              <tr>
                {Array.from({ length: columns }).map((_, i) => (
                  <th key={i}>
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                {Array.from({ length: columns }).map((_, colIdx) => (
                  <td key={colIdx}>
                    <Skeleton 
                      className="h-4" 
                      style={{ width: colIdx === 0 ? '60%' : '80%' }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* =========================================
   Skeleton List
   ========================================= */

interface SkeletonListProps {
  items?: number;
  showAvatar?: boolean;
  className?: string;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  items = 5,
  showAvatar = true,
  className,
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div 
          key={i}
          className="flex items-center gap-3 p-4 rounded-xl"
          style={{ background: 'hsl(var(--modern-bg-card))' }}
        >
          {showAvatar && (
            <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
          )}
          <div className="flex-1">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="w-16 h-6 rounded-full" />
        </div>
      ))}
    </div>
  );
};

/* =========================================
   Skeleton Dashboard
   ========================================= */

export const SkeletonDashboard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('space-y-8', className)}>
      {/* Stats Grid */}
      <SkeletonStatsGrid count={4} />
      
      {/* Two Column Layout */}
      <div className="modern-grid-2">
        <SkeletonCard lines={5} showHeader />
        <SkeletonCard lines={5} showHeader />
      </div>
      
      {/* Table */}
      <SkeletonTable rows={5} columns={5} />
    </div>
  );
};

/* =========================================
   Inline Loading Spinner
   ========================================= */

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <div
      className={cn(
        'rounded-full border-current border-t-transparent animate-spin',
        sizeClasses[size],
        className
      )}
      style={{ borderColor: 'hsl(var(--modern-brand-primary))' }}
    />
  );
};

/* =========================================
   Loading Overlay
   ========================================= */

interface LoadingOverlayProps {
  show: boolean;
  message?: string;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  show,
  message,
  className,
}) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'absolute inset-0 flex flex-col items-center justify-center z-50 rounded-xl',
        className
      )}
      style={{
        background: 'hsl(var(--modern-bg-card) / 0.9)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <Spinner size="lg" />
      {message && (
        <p 
          className="mt-3 text-sm font-medium"
          style={{ color: 'hsl(var(--modern-text-secondary))' }}
        >
          {message}
        </p>
      )}
    </motion.div>
  );
};

/* =========================================
   Pulse Dot (for live indicators)
   ========================================= */

interface PulseDotProps {
  color?: 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PulseDot: React.FC<PulseDotProps> = ({
  color = 'success',
  size = 'md',
  className,
}) => {
  const colorMap = {
    success: 'hsl(var(--modern-success))',
    warning: 'hsl(var(--modern-warning))',
    error: 'hsl(var(--modern-error))',
    info: 'hsl(var(--modern-info))',
  };

  const sizeMap = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  return (
    <span className={cn('relative inline-flex', className)}>
      <span
        className={cn('rounded-full', sizeMap[size])}
        style={{ background: colorMap[color] }}
      />
      <span
        className={cn(
          'absolute inline-flex rounded-full opacity-75 animate-ping',
          sizeMap[size]
        )}
        style={{ background: colorMap[color] }}
      />
    </span>
  );
};
