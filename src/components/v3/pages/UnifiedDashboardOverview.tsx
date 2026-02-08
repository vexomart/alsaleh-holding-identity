/**
 * Unified Dashboard Overview
 * Shared between Admin & Customer Dashboards
 * Same visual identity, different content
 */

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  RefreshCw,
  Zap,
  Activity,
  Clock,
} from 'lucide-react';
import '@/styles/v3/unified-dashboard.css';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } }
};

// Types
export interface DashboardStat {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: { value: number; direction: 'up' | 'down' };
  variant?: 'primary' | 'success' | 'warning' | 'info' | 'purple' | 'teal';
  href?: string;
}

export interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  href: string;
  primary?: boolean;
}

export interface ActivityItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  status: 'success' | 'warning' | 'info' | 'pending';
}

export interface SectionLink {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  stats?: { value: string | number; label: string };
}

export interface UnifiedDashboardOverviewProps {
  variant: 'admin' | 'customer';
  stats: DashboardStat[];
  quickActions: QuickAction[];
  recentActivity: ActivityItem[];
  sectionLinks: SectionLink[];
  alertBanner?: {
    type: 'warning' | 'error' | 'info' | 'success';
    icon: React.ReactNode;
    title: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
  };
  isLoading?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

// Loading Skeleton
const DashboardSkeleton: React.FC = () => (
  <div className="dashboard-loading">
    <div className="dashboard-loading__header">
      <div className="dashboard-loading__avatar" />
      <div className="dashboard-loading__text">
        <div className="dashboard-loading__text-line" />
        <div className="dashboard-loading__text-line" />
      </div>
    </div>
    <div className="dashboard-loading__stats">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="dashboard-loading__stat" />
      ))}
    </div>
  </div>
);

// Stat Card Component
const StatCard: React.FC<DashboardStat & { onClick?: () => void }> = ({
  icon, label, value, change, variant = 'primary', onClick
}) => (
  <motion.div
    variants={itemVariants}
    className={cn('dashboard-stat', `dashboard-stat--${variant}`)}
    onClick={onClick}
    whileHover={onClick ? { y: -2 } : undefined}
    whileTap={onClick ? { scale: 0.98 } : undefined}
  >
    <div className="dashboard-stat__header">
      <div className="dashboard-stat__icon">{icon}</div>
      {change && (
        <div className={cn(
          'dashboard-stat__trend',
          change.direction === 'up' ? 'dashboard-stat__trend--up' : 'dashboard-stat__trend--down'
        )}>
          {change.direction === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{Math.abs(change.value)}%</span>
        </div>
      )}
    </div>
    <div className="dashboard-stat__value">{value}</div>
    <div className="dashboard-stat__label">{label}</div>
    {onClick && (
      <div className="dashboard-stat__arrow">
        <ArrowUpRight size={16} />
      </div>
    )}
  </motion.div>
);

// Activity Item Component
const ActivityItemRow: React.FC<ActivityItem> = ({ icon, title, description, time, status }) => (
  <div className="dashboard-activity__item">
    <div className={cn('dashboard-activity__item-icon', `dashboard-activity__item-icon--${status}`)}>
      {icon}
    </div>
    <div className="dashboard-activity__item-content">
      <div className="dashboard-activity__item-title">{title}</div>
      <div className="dashboard-activity__item-desc">{description}</div>
    </div>
    <div className="dashboard-activity__item-time">{time}</div>
  </div>
);

// Section Link Component
const SectionLinkRow: React.FC<SectionLink & { onClick: () => void }> = ({
  icon, title, description, stats, onClick
}) => (
  <motion.div
    variants={itemVariants}
    className="dashboard-section-link"
    onClick={onClick}
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
  >
    <div className="dashboard-section-link__icon">{icon}</div>
    <div className="dashboard-section-link__content">
      <div className="dashboard-section-link__title">{title}</div>
      <div className="dashboard-section-link__desc">{description}</div>
    </div>
    {stats && (
      <div className="dashboard-section-link__stats">
        <div className="dashboard-section-link__stats-value">{stats.value}</div>
        <div className="dashboard-section-link__stats-label">{stats.label}</div>
      </div>
    )}
  </motion.div>
);

// Main Component
export const UnifiedDashboardOverview: React.FC<UnifiedDashboardOverviewProps> = ({
  variant,
  stats,
  quickActions,
  recentActivity,
  sectionLinks,
  alertBanner,
  isLoading,
  onRefresh,
  isRefreshing,
}) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { profile } = useAuth();
  const isRTL = language === 'ar';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return isRTL ? 'صباح الخير' : 'Good Morning';
    if (hour < 18) return isRTL ? 'مساء الخير' : 'Good Afternoon';
    return isRTL ? 'مساء الخير' : 'Good Evening';
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div
      className="unified-dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="dashboard-header">
        <div className="dashboard-header__welcome">
          <div className="dashboard-header__avatar">
            <Zap size={24} />
          </div>
          <div className="dashboard-header__info">
            <span className="dashboard-header__greeting">{getGreeting()}</span>
            <h1 className="dashboard-header__name">
              {profile?.full_name || profile?.email?.split('@')[0] || (isRTL ? 'مرحباً' : 'Welcome')} 👋
            </h1>
            <div className="dashboard-header__status">
              <span className="dashboard-header__status-dot" />
              {isRTL ? 'بيانات حية' : 'Live Data'}
            </div>
          </div>
        </div>
        
        <div className="dashboard-header__actions">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="ds-btn ds-btn-secondary ds-btn-sm"
            >
              <RefreshCw size={16} className={cn(isRefreshing && 'animate-spin')} />
              {isRTL ? 'تحديث' : 'Refresh'}
            </button>
          )}
        </div>
      </motion.div>

      {/* Alert Banner */}
      {alertBanner && (
        <motion.div 
          variants={itemVariants}
          className={cn('dashboard-alert', `dashboard-alert--${alertBanner.type}`)}
        >
          <div className="dashboard-alert__icon">{alertBanner.icon}</div>
          <div className="dashboard-alert__content">
            <div className="dashboard-alert__title">{alertBanner.title}</div>
            {alertBanner.description && (
              <div className="dashboard-alert__desc">{alertBanner.description}</div>
            )}
          </div>
          {alertBanner.actionLabel && alertBanner.actionHref && (
            <button
              onClick={() => navigate(alertBanner.actionHref!)}
              className="ds-btn ds-btn-sm ds-btn-primary"
            >
              {alertBanner.actionLabel}
            </button>
          )}
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="dashboard-stats">
        {stats.map(stat => (
          <StatCard
            key={stat.id}
            {...stat}
            onClick={stat.href ? () => navigate(stat.href!) : undefined}
          />
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="dashboard-actions">
        <h2 className="dashboard-actions__title">
          <Zap size={18} className="dashboard-actions__title-icon" />
          {isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
        </h2>
        <div className="dashboard-actions__grid">
          {quickActions.map(action => (
            <button
              key={action.id}
              onClick={() => navigate(action.href)}
              className={cn('dashboard-action', action.primary && 'dashboard-action--primary')}
            >
              <div className="dashboard-action__icon">{action.icon}</div>
              <span className="dashboard-action__label">{action.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="dashboard-grid">
        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="dashboard-activity">
          <div className="dashboard-activity__header">
            <h3 className="dashboard-activity__title">
              {isRTL ? 'النشاط الأخير' : 'Recent Activity'}
            </h3>
            <button
              onClick={() => navigate(variant === 'admin' ? '/adminash/orders' : '/portal/orders')}
              className="ds-btn ds-btn-ghost ds-btn-sm"
            >
              {isRTL ? 'عرض الكل' : 'View All'}
              <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="dashboard-activity__content">
            {recentActivity.length > 0 ? (
              recentActivity.map(item => (
                <ActivityItemRow key={item.id} {...item} />
              ))
            ) : (
              <div className="dashboard-activity__empty">
                <Clock className="dashboard-activity__empty-icon" size={32} />
                <span>{isRTL ? 'لا يوجد نشاط حديث' : 'No recent activity'}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Section Links */}
        <motion.div variants={itemVariants} className="dashboard-sections">
          <div className="dashboard-sections__header">
            <h3 className="dashboard-sections__title">
              {isRTL ? 'الأقسام' : 'Sections'}
            </h3>
          </div>
          <div className="dashboard-sections__content">
            {sectionLinks.map(link => (
              <SectionLinkRow
                key={link.id}
                {...link}
                onClick={() => navigate(link.href)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

UnifiedDashboardOverview.displayName = 'UnifiedDashboardOverview';
