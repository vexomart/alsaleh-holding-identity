/**
 * Section Connector Components
 * Link sections together for cohesive navigation
 */

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ArrowUpRight,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  Package,
  FileText,
  CreditCard,
  Users,
  Settings,
  BarChart3,
  Bell
} from 'lucide-react';
import '@/styles/v3/modern-theme.css';

/* =========================================
   Related Sections Panel
   ========================================= */

interface RelatedSection {
  id: string;
  title: string;
  description?: string;
  href: string;
  icon: React.ReactNode;
  stats?: {
    value: string | number;
    label: string;
    trend?: 'up' | 'down' | 'neutral';
  };
}

interface RelatedSectionsPanelProps {
  title?: string;
  sections: RelatedSection[];
  className?: string;
}

export const RelatedSectionsPanel: React.FC<RelatedSectionsPanelProps> = ({
  title = 'أقسام ذات صلة',
  sections,
  className,
}) => {
  const navigate = useNavigate();

  return (
    <div className={cn('modern-card', className)}>
      <div className="modern-card-header">
        <h3 className="modern-card-title">{title}</h3>
      </div>
      <div className="p-2">
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="related-section-item"
            onClick={() => navigate(section.href)}
          >
            <div 
              className="related-section-icon"
              style={{ 
                background: 'hsl(var(--modern-brand-primary) / 0.1)',
                color: 'hsl(var(--modern-brand-primary))'
              }}
            >
              {section.icon}
            </div>
            
            <div className="related-section-content">
              <span className="related-section-title">{section.title}</span>
              {section.description && (
                <span className="related-section-desc">{section.description}</span>
              )}
            </div>
            
            {section.stats && (
              <div className="related-section-stats">
                <span className="related-section-stats-value">{section.stats.value}</span>
                <span className="related-section-stats-label">{section.stats.label}</span>
              </div>
            )}
            
            <ChevronLeft size={16} className="related-section-arrow" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* =========================================
   Action Hub - Quick Actions Grid
   ========================================= */

interface ActionItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  badge?: number;
}

interface ActionHubProps {
  title?: string;
  actions: ActionItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export const ActionHub: React.FC<ActionHubProps> = ({
  title,
  actions,
  columns = 3,
  className,
}) => {
  const getVariantStyles = (variant: ActionItem['variant'] = 'primary') => {
    const styles = {
      primary: {
        bg: 'hsl(var(--modern-brand-primary) / 0.1)',
        color: 'hsl(var(--modern-brand-primary))',
        hoverBg: 'hsl(var(--modern-brand-primary) / 0.15)',
      },
      secondary: {
        bg: 'hsl(var(--modern-bg-elevated))',
        color: 'hsl(var(--modern-text-secondary))',
        hoverBg: 'hsl(var(--modern-bg-hover))',
      },
      success: {
        bg: 'hsl(var(--modern-success-bg))',
        color: 'hsl(var(--modern-success))',
        hoverBg: 'hsl(152 69% 91%)',
      },
      warning: {
        bg: 'hsl(var(--modern-warning-bg))',
        color: 'hsl(var(--modern-warning))',
        hoverBg: 'hsl(38 92% 91%)',
      },
    };
    return styles[variant];
  };

  const gridClass = columns === 2 
    ? 'grid-cols-2' 
    : columns === 4 
      ? 'grid-cols-2 sm:grid-cols-4' 
      : 'grid-cols-2 sm:grid-cols-3';

  return (
    <div className={className}>
      {title && (
        <h3 
          className="font-semibold mb-4"
          style={{ 
            fontSize: 'var(--modern-text-lg)',
            color: 'hsl(var(--modern-text-primary))'
          }}
        >
          {title}
        </h3>
      )}
      
      <div className={cn('grid gap-3', gridClass)}>
        {actions.map((action, index) => {
          const styles = getVariantStyles(action.variant);
          
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="action-hub-item"
              style={{ background: styles.bg }}
              onClick={action.onClick}
            >
              <div 
                className="action-hub-icon"
                style={{ color: styles.color }}
              >
                {action.icon}
              </div>
              
              <span 
                className="action-hub-label"
                style={{ color: styles.color }}
              >
                {action.label}
              </span>
              
              {action.description && (
                <span className="action-hub-desc">{action.description}</span>
              )}
              
              {action.badge !== undefined && action.badge > 0 && (
                <span className="action-hub-badge">{action.badge}</span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

/* =========================================
   Breadcrumb Navigation
   ========================================= */

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ModernBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const ModernBreadcrumb: React.FC<ModernBreadcrumbProps> = ({
  items,
  className,
}) => {
  const navigate = useNavigate();

  return (
    <nav className={cn('modern-breadcrumb', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <React.Fragment key={index}>
            {item.href && !isLast ? (
              <button
                className="modern-breadcrumb-link"
                onClick={() => navigate(item.href!)}
              >
                {item.label}
              </button>
            ) : (
              <span className={cn('modern-breadcrumb-text', isLast && 'current')}>
                {item.label}
              </span>
            )}
            
            {!isLast && (
              <ChevronLeft size={14} className="modern-breadcrumb-separator" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

/* =========================================
   Section Header with Actions
   ========================================= */

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  breadcrumb?: BreadcrumbItem[];
  actions?: React.ReactNode;
  stats?: {
    label: string;
    value: string | number;
    variant?: 'success' | 'warning' | 'error' | 'neutral';
  }[];
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  icon,
  breadcrumb,
  actions,
  stats,
  className,
}) => {
  return (
    <div className={cn('section-header', className)}>
      {breadcrumb && breadcrumb.length > 0 && (
        <ModernBreadcrumb items={breadcrumb} />
      )}
      
      <div className="section-header-main">
        <div className="section-header-content">
          {icon && (
            <div className="section-header-icon">{icon}</div>
          )}
          <div>
            <h1 className="section-header-title">{title}</h1>
            {description && (
              <p className="section-header-description">{description}</p>
            )}
          </div>
        </div>
        
        {actions && (
          <div className="section-header-actions">{actions}</div>
        )}
      </div>
      
      {stats && stats.length > 0 && (
        <div className="section-header-stats">
          {stats.map((stat, index) => (
            <div key={index} className="section-header-stat">
              <span className={cn('section-header-stat-value', stat.variant)}>
                {stat.value}
              </span>
              <span className="section-header-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* =========================================
   Alert Banner
   ========================================= */

interface AlertBannerProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type,
  title,
  message,
  action,
  dismissible,
  onDismiss,
  className,
}) => {
  const [visible, setVisible] = React.useState(true);

  const typeStyles = {
    info: {
      bg: 'hsl(var(--modern-info-bg))',
      border: 'hsl(var(--modern-info) / 0.3)',
      color: 'hsl(var(--modern-info))',
      icon: <AlertCircle size={18} />,
    },
    success: {
      bg: 'hsl(var(--modern-success-bg))',
      border: 'hsl(var(--modern-success) / 0.3)',
      color: 'hsl(var(--modern-success))',
      icon: <CheckCircle2 size={18} />,
    },
    warning: {
      bg: 'hsl(var(--modern-warning-bg))',
      border: 'hsl(var(--modern-warning) / 0.3)',
      color: 'hsl(var(--modern-warning))',
      icon: <AlertCircle size={18} />,
    },
    error: {
      bg: 'hsl(var(--modern-error-bg))',
      border: 'hsl(var(--modern-error) / 0.3)',
      color: 'hsl(var(--modern-error))',
      icon: <AlertCircle size={18} />,
    },
  };

  const styles = typeStyles[type];

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn('alert-banner', className)}
      style={{ 
        background: styles.bg,
        borderColor: styles.border,
      }}
    >
      <div className="alert-banner-icon" style={{ color: styles.color }}>
        {styles.icon}
      </div>
      
      <div className="alert-banner-content">
        <p className="alert-banner-title" style={{ color: styles.color }}>
          {title}
        </p>
        {message && (
          <p className="alert-banner-message">{message}</p>
        )}
      </div>
      
      {action && (
        <button 
          className="alert-banner-action"
          onClick={action.onClick}
          style={{ color: styles.color }}
        >
          {action.label}
        </button>
      )}
      
      {dismissible && (
        <button
          className="alert-banner-close"
          onClick={() => {
            setVisible(false);
            onDismiss?.();
          }}
        >
          ×
        </button>
      )}
    </motion.div>
  );
};

export default RelatedSectionsPanel;
