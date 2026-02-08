/**
 * Modern List Components
 * Notion/Apple Inspired Activity Lists
 * Clean, Minimal, Interactive
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ExternalLink,
  Clock,
  Circle,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';
import '@/styles/v3/modern-theme.css';

/* =========================================
   List Container
   ========================================= */

interface ModernListProps {
  children: React.ReactNode;
  className?: string;
  divided?: boolean;
}

export const ModernList: React.FC<ModernListProps> = ({ 
  children, 
  className,
  divided = true 
}) => {
  return (
    <div className={cn('modern-list', divided && 'divided', className)}>
      <AnimatePresence mode="sync">
        {children}
      </AnimatePresence>
    </div>
  );
};

/* =========================================
   List Item
   ========================================= */

interface ModernListItemProps {
  icon?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  title: string;
  description?: string;
  meta?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  isNew?: boolean;
  className?: string;
}

export const ModernListItem: React.FC<ModernListItemProps> = ({
  icon,
  iconBg = 'hsl(var(--modern-bg-elevated))',
  iconColor = 'hsl(var(--modern-text-secondary))',
  title,
  description,
  meta,
  badge,
  action,
  onClick,
  href,
  isNew,
  className,
}) => {
  const isClickable = onClick || href;

  const content = (
    <>
      {icon && (
        <div 
          className="modern-list-icon"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </div>
      )}
      
      <div className="modern-list-content">
        <div className="modern-list-title-row">
          <span className="modern-list-title">{title}</span>
          {badge}
        </div>
        {description && (
          <p className="modern-list-description">{description}</p>
        )}
        {meta && (
          <span className="modern-list-meta">
            <Clock size={12} />
            {meta}
          </span>
        )}
      </div>
      
      {(action || isClickable) && (
        <div className="modern-list-action">
          {action || (
            <ChevronLeft size={18} style={{ color: 'hsl(var(--modern-text-muted))' }} />
          )}
        </div>
      )}
      
      {isNew && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="modern-list-new-indicator"
        />
      )}
    </>
  );

  const baseClass = cn(
    'modern-list-item',
    isClickable && 'clickable',
    isNew && 'is-new',
    className
  );

  if (href) {
    return (
      <motion.a
        href={href}
        initial={isNew ? { opacity: 0, x: -20 } : false}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className={baseClass}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div
      initial={isNew ? { opacity: 0, x: -20 } : false}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={baseClass}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {content}
    </motion.div>
  );
};

/* =========================================
   Activity Timeline
   ========================================= */

type ActivityType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface TimelineEvent {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: string;
  icon?: React.ReactNode;
}

interface ModernTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export const ModernTimeline: React.FC<ModernTimelineProps> = ({ events, className }) => {
  const getIcon = (type: ActivityType, customIcon?: React.ReactNode) => {
    if (customIcon) return customIcon;
    
    switch (type) {
      case 'success': return <CheckCircle2 size={16} />;
      case 'error': return <AlertCircle size={16} />;
      case 'warning': return <AlertCircle size={16} />;
      case 'info': return <Info size={16} />;
      default: return <Circle size={16} />;
    }
  };

  const getColors = (type: ActivityType) => {
    switch (type) {
      case 'success': return { bg: 'hsl(var(--modern-success-bg))', color: 'hsl(var(--modern-success))' };
      case 'error': return { bg: 'hsl(var(--modern-error-bg))', color: 'hsl(var(--modern-error))' };
      case 'warning': return { bg: 'hsl(var(--modern-warning-bg))', color: 'hsl(var(--modern-warning))' };
      case 'info': return { bg: 'hsl(var(--modern-info-bg))', color: 'hsl(var(--modern-info))' };
      default: return { bg: 'hsl(var(--modern-bg-elevated))', color: 'hsl(var(--modern-text-secondary))' };
    }
  };

  return (
    <div className={cn('modern-timeline', className)}>
      {events.map((event, index) => {
        const colors = getColors(event.type);
        const isLast = index === events.length - 1;
        
        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="modern-timeline-item"
          >
            {/* Connector line */}
            {!isLast && (
              <div className="modern-timeline-line" />
            )}
            
            {/* Icon */}
            <div 
              className="modern-timeline-icon"
              style={{ background: colors.bg, color: colors.color }}
            >
              {getIcon(event.type, event.icon)}
            </div>
            
            {/* Content */}
            <div className="modern-timeline-content">
              <p className="modern-timeline-title">{event.title}</p>
              {event.description && (
                <p className="modern-timeline-description">{event.description}</p>
              )}
              <span className="modern-timeline-time">{event.timestamp}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

/* =========================================
   Quick Links Grid
   ========================================= */

interface QuickLink {
  id: string;
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  title: string;
  description?: string;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
}

interface ModernQuickLinksProps {
  links: QuickLink[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export const ModernQuickLinks: React.FC<ModernQuickLinksProps> = ({
  links,
  columns = 3,
  className,
}) => {
  const gridClass = columns === 2 
    ? 'modern-grid-2' 
    : columns === 4 
      ? 'modern-grid-4' 
      : 'modern-grid-3';

  return (
    <div className={cn(gridClass, className)}>
      {links.map((link, index) => (
        <motion.div
          key={link.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="modern-quick-link"
          onClick={link.onClick}
          role={link.onClick ? 'button' : undefined}
          tabIndex={link.onClick ? 0 : undefined}
        >
          <div 
            className="modern-quick-link-icon"
            style={{ 
              background: link.iconBg || 'hsl(var(--modern-brand-primary) / 0.1)',
              color: link.iconColor || 'hsl(var(--modern-brand-primary))'
            }}
          >
            {link.icon}
          </div>
          
          <div className="modern-quick-link-content">
            <span className="modern-quick-link-title">{link.title}</span>
            {link.description && (
              <span className="modern-quick-link-desc">{link.description}</span>
            )}
          </div>
          
          {link.badge !== undefined && (
            <span className="modern-quick-link-badge">{link.badge}</span>
          )}
          
          <ChevronLeft 
            size={16} 
            className="modern-quick-link-arrow" 
          />
        </motion.div>
      ))}
    </div>
  );
};

/* =========================================
   Stats Row (Inline KPIs)
   ========================================= */

interface StatItem {
  id: string;
  label: string;
  value: string | number;
  change?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
}

interface ModernStatsRowProps {
  stats: StatItem[];
  className?: string;
}

export const ModernStatsRow: React.FC<ModernStatsRowProps> = ({ stats, className }) => {
  return (
    <div className={cn('modern-stats-row', className)}>
      {stats.map((stat, index) => (
        <React.Fragment key={stat.id}>
          {index > 0 && <div className="modern-stats-row-divider" />}
          <div className="modern-stats-row-item">
            <span className="modern-stats-row-value">{stat.value}</span>
            <span className="modern-stats-row-label">{stat.label}</span>
            {stat.change && (
              <span 
                className={cn(
                  'modern-stats-row-change',
                  stat.change.direction === 'up' && 'positive',
                  stat.change.direction === 'down' && 'negative'
                )}
              >
                {stat.change.direction === 'up' ? '↑' : stat.change.direction === 'down' ? '↓' : '→'}
                {Math.abs(stat.change.value)}%
              </span>
            )}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ModernList;
