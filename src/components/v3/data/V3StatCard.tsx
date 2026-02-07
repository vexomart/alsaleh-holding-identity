/**
 * V3 Stat Card - 100% Custom
 * Command Center & Banking Portal variants
 * NO SHADCN
 */

import * as React from 'react';
import './V3Data.css';

export interface V3StatCardProps {
  context?: 'command' | 'bank';
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const V3StatCard: React.FC<V3StatCardProps> = ({
  context = 'command',
  title,
  value,
  subtitle,
  trend,
  icon,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const baseClass = context === 'command' ? 'cmd-stat-card' : 'bank-stat-card';
  
  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend.direction === 'up') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      );
    }
    if (trend.direction === 'down') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      );
    }
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14"/>
      </svg>
    );
  };

  return (
    <div 
      className={`${baseClass} ${baseClass}--${variant} ${baseClass}--${size} ${className}`}
    >
      {/* Icon */}
      {icon && (
        <div className={`${baseClass}__icon`}>
          {icon}
        </div>
      )}
      
      {/* Content */}
      <div className={`${baseClass}__content`}>
        <span className={`${baseClass}__title`}>{title}</span>
        <span className={`${baseClass}__value`}>{value}</span>
        
        {/* Subtitle / Trend */}
        <div className={`${baseClass}__footer`}>
          {trend && (
            <span className={`${baseClass}__trend ${baseClass}__trend--${trend.direction}`}>
              {getTrendIcon()}
              <span>{Math.abs(trend.value)}%</span>
            </span>
          )}
          {subtitle && (
            <span className={`${baseClass}__subtitle`}>{subtitle}</span>
          )}
        </div>
      </div>
      
      {/* Command Center: Glow effect */}
      {context === 'command' && variant !== 'default' && (
        <div className={`${baseClass}__glow ${baseClass}__glow--${variant}`} />
      )}
    </div>
  );
};

V3StatCard.displayName = 'V3StatCard';
