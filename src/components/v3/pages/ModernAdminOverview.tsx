/**
 * Modern Admin Overview - V3 Design System
 * Unified Enterprise SaaS Dashboard
 * Uses DS tokens for strict visual consistency
 */

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { cn } from '@/lib/utils';
import {
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
  Settings,
  BarChart3,
  Activity,
  Bell,
  RefreshCw,
  Plus,
  Eye,
  ArrowUpRight,
  Wallet,
  UserPlus,
  ClipboardList,
  Zap,
  Building2
} from 'lucide-react';
import { SkeletonDashboard } from '@/components/v3/feedback/ModernSkeleton';
import '@/styles/v3/modern-theme.css';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: { value: number; direction: 'up' | 'down' | 'neutral' };
  color: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, change, color, onClick }) => (
  <motion.div
    variants={itemVariants}
    className={cn(
      'ds-stat-card group',
      onClick && 'cursor-pointer'
    )}
    onClick={onClick}
    whileHover={onClick ? { y: -2, scale: 1.01 } : undefined}
    whileTap={onClick ? { scale: 0.99 } : undefined}
  >
    <div 
      className="ds-stat-icon"
      style={{ 
        background: `${color}15`,
        color: color,
      }}
    >
      {icon}
    </div>
    
    <div className="ds-stat-value">{value}</div>
    <div className="ds-stat-label">{label}</div>
    
    {change && (
      <div 
        className={cn(
          'ds-badge ds-mt-4',
          change.direction === 'up' && 'ds-badge-success',
          change.direction === 'down' && 'ds-badge-error',
          change.direction === 'neutral' && 'ds-badge-neutral'
        )}
      >
        {change.direction === 'up' && <TrendingUp size={12} />}
        {change.direction === 'down' && <TrendingDown size={12} />}
        <span>{Math.abs(change.value)}%</span>
      </div>
    )}
    
    {onClick && (
      <div className="absolute bottom-4 start-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight size={16} style={{ color: 'hsl(var(--ds-text-muted))' }} />
      </div>
    )}
  </motion.div>
);

// Quick Action Button
interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onClick, variant = 'secondary' }) => (
  <motion.button
    variants={itemVariants}
    onClick={onClick}
    className={cn(
      'ds-btn ds-btn-md flex flex-col items-center ds-gap-2 h-auto py-4 px-6',
      variant === 'primary' ? 'ds-btn-primary' : 'ds-btn-secondary'
    )}
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.98 }}
  >
    <span className="ds-icon-lg">{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </motion.button>
);

// Activity Item
interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  status: 'success' | 'warning' | 'info' | 'pending';
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon, title, description, time, status }) => {
  const statusColors = {
    success: 'hsl(var(--ds-success))',
    warning: 'hsl(var(--ds-warning))',
    info: 'hsl(var(--ds-info))',
    pending: 'hsl(var(--ds-text-muted))',
  };
  
  return (
    <div className="flex items-start ds-gap-3 p-3 rounded-lg hover:bg-[hsl(var(--ds-bg-hover))] transition-colors">
      <div 
        className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
        style={{ 
          background: `${statusColors[status]}15`,
          color: statusColors[status],
        }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ color: 'hsl(var(--ds-text-primary))' }}>
          {title}
        </p>
        <p className="text-xs" style={{ color: 'hsl(var(--ds-text-muted))' }}>
          {description}
        </p>
      </div>
      <span className="text-xs shrink-0" style={{ color: 'hsl(var(--ds-text-disabled))' }}>
        {time}
      </span>
    </div>
  );
};

// Section Link
interface SectionLinkProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  stats?: { value: number | string; label: string };
}

const SectionLink: React.FC<SectionLinkProps> = ({ icon, title, description, href, stats }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      variants={itemVariants}
      onClick={() => navigate(href)}
      className="flex items-center ds-gap-4 p-4 rounded-xl cursor-pointer transition-all hover:bg-[hsl(var(--ds-bg-hover))] border border-transparent hover:border-[hsl(var(--ds-border-default))]"
      whileHover={{ x: -4 }}
    >
      <div 
        className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
        style={{ 
          background: 'hsl(var(--ds-bg-elevated))',
          color: 'hsl(var(--ds-brand-primary))',
        }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium" style={{ color: 'hsl(var(--ds-text-primary))' }}>{title}</p>
        <p className="text-sm" style={{ color: 'hsl(var(--ds-text-muted))' }}>{description}</p>
      </div>
      {stats && (
        <div className="text-end shrink-0">
          <span className="text-lg font-bold" style={{ color: 'hsl(var(--ds-text-primary))' }}>
            {stats.value}
          </span>
          <span className="text-xs block" style={{ color: 'hsl(var(--ds-text-muted))' }}>
            {stats.label}
          </span>
        </div>
      )}
    </motion.div>
  );
};

// Main Component
export function ModernAdminOverview() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { profile } = useAuth();
  const { analytics, loading, refresh } = useAdminAnalytics();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const isRTL = language === 'ar';

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return isRTL ? 'صباح الخير' : 'Good Morning';
    if (hour < 18) return isRTL ? 'مساء الخير' : 'Good Afternoon';
    return isRTL ? 'مساء الخير' : 'Good Evening';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(amount) + ' SAR';
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return isRTL ? `منذ ${diffMins} دقيقة` : `${diffMins}m ago`;
    if (diffHours < 24) return isRTL ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
    return isRTL ? `منذ ${diffDays} يوم` : `${diffDays}d ago`;
  };

  // Calculate stats
  const pendingOrders = analytics.ordersByStatus.pending || 0;
  const inProgressOrders = (analytics.ordersByStatus.processing || 0) + (analytics.ordersByStatus.in_progress || 0);
  const completedOrders = analytics.ordersByStatus.completed || 0;

  // Recent activities
  const recentActivities = analytics.recentOrders.slice(0, 5).map(order => ({
    id: order.id,
    status: (order.status === 'completed' ? 'success' : order.status === 'pending' ? 'pending' : 'info') as any,
    title: `${isRTL ? 'طلب:' : 'Order:'} ${order.title || order.order_number}`,
    description: order.order_number,
    timestamp: formatRelativeTime(order.created_at),
  }));

  if (loading) {
    return <SkeletonDashboard />;
  }

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between ds-gap-4">
        <div className="flex items-center ds-gap-4">
          <div 
            className="flex items-center justify-center w-12 h-12 rounded-xl"
            style={{ 
              background: 'linear-gradient(135deg, hsl(var(--ds-brand-primary)), hsl(var(--ds-brand-secondary)))',
            }}
          >
            <Zap size={24} className="text-white" />
          </div>
          <div>
            <h1 className="ds-heading-2">
              {getGreeting()}، {profile?.full_name || profile?.email?.split('@')[0]} 👋
            </h1>
            <p className="ds-body-sm flex items-center ds-gap-2">
              <span 
                className="w-2 h-2 rounded-full animate-pulse" 
                style={{ background: 'hsl(var(--ds-success))' }} 
              />
              {isRTL ? 'بيانات حية' : 'Live Data'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center ds-gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="ds-btn ds-btn-secondary ds-btn-sm"
          >
            <RefreshCw size={16} className={cn(isRefreshing && 'animate-spin')} />
            {isRTL ? 'تحديث' : 'Refresh'}
          </button>
          <button
            onClick={() => navigate('/adminash/reports')}
            className="ds-btn ds-btn-primary ds-btn-sm"
          >
            <BarChart3 size={16} />
            {isRTL ? 'التقارير' : 'Reports'}
          </button>
        </div>
      </motion.div>

      {/* Alert Banner */}
      {pendingOrders > 5 && (
        <motion.div 
          variants={itemVariants}
          className="flex items-center ds-gap-4 p-4 rounded-xl border-s-4"
          style={{ 
            background: 'hsl(var(--ds-warning-bg))',
            borderColor: 'hsl(var(--ds-warning))',
          }}
        >
          <AlertCircle size={20} style={{ color: 'hsl(var(--ds-warning))' }} />
          <div className="flex-1">
            <p className="font-medium" style={{ color: 'hsl(var(--ds-text-primary))' }}>
              {isRTL ? `لديك ${pendingOrders} طلبات معلقة` : `You have ${pendingOrders} pending orders`}
            </p>
            <p className="text-sm" style={{ color: 'hsl(var(--ds-text-secondary))' }}>
              {isRTL ? 'يرجى مراجعتها في أقرب وقت' : 'Please review them soon'}
            </p>
          </div>
          <button
            onClick={() => navigate('/adminash/orders')}
            className="ds-btn ds-btn-sm ds-btn-primary"
          >
            {isRTL ? 'عرض' : 'View'}
          </button>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="ds-grid-4">
        <StatCard
          icon={<Users size={20} />}
          label={isRTL ? 'المستخدمين' : 'Users'}
          value={analytics.totalUsers.toLocaleString()}
          change={{ value: 12, direction: 'up' }}
          color="hsl(217, 91%, 60%)"
          onClick={() => navigate('/adminash/users')}
        />
        <StatCard
          icon={<ShoppingCart size={20} />}
          label={isRTL ? 'الطلبات' : 'Orders'}
          value={analytics.totalOrders.toLocaleString()}
          change={{ value: 8, direction: 'up' }}
          color="hsl(165, 82%, 51%)"
          onClick={() => navigate('/adminash/orders')}
        />
        <StatCard
          icon={<Package size={20} />}
          label={isRTL ? 'الخدمات' : 'Services'}
          value={analytics.totalServices}
          color="hsl(262, 83%, 58%)"
          onClick={() => navigate('/adminash/services')}
        />
        <StatCard
          icon={<DollarSign size={20} />}
          label={isRTL ? 'الإيرادات' : 'Revenue'}
          value={formatCurrency(analytics.totalRevenue)}
          change={{ value: 15, direction: 'up' }}
          color="hsl(38, 92%, 50%)"
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="ds-card">
        <div className="ds-card-header">
          <h3 className="ds-heading-4 flex items-center ds-gap-2">
            <Zap size={18} style={{ color: 'hsl(var(--ds-warning))' }} />
            {isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
          </h3>
        </div>
        <div className="ds-card-content">
          <div className="grid grid-cols-2 sm:grid-cols-4 ds-gap-4">
            <ActionButton
              icon={<Plus size={20} />}
              label={isRTL ? 'طلب جديد' : 'New Order'}
              onClick={() => navigate('/adminash/orders')}
              variant="primary"
            />
            <ActionButton
              icon={<UserPlus size={20} />}
              label={isRTL ? 'إضافة مستخدم' : 'Add User'}
              onClick={() => navigate('/adminash/users')}
            />
            <ActionButton
              icon={<BarChart3 size={20} />}
              label={isRTL ? 'التقارير' : 'Reports'}
              onClick={() => navigate('/adminash/reports')}
            />
            <ActionButton
              icon={<Settings size={20} />}
              label={isRTL ? 'الإعدادات' : 'Settings'}
              onClick={() => navigate('/adminash/settings')}
            />
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="ds-card">
            <div className="ds-card-header">
              <h3 className="ds-heading-4">{isRTL ? 'النشاط الأخير' : 'Recent Activity'}</h3>
              <button 
                onClick={() => navigate('/adminash/orders')}
                className="ds-btn ds-btn-ghost ds-btn-sm"
              >
                {isRTL ? 'عرض الكل' : 'View All'}
                <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="p-2">
              {recentActivities.length > 0 ? (
                <div className="space-y-1">
                  {recentActivities.map((activity) => (
                    <ActivityItem
                      key={activity.id}
                      icon={<Activity size={16} />}
                      title={activity.title}
                      description={activity.description}
                      time={activity.timestamp}
                      status={activity.status}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center" style={{ color: 'hsl(var(--ds-text-muted))' }}>
                  {isRTL ? 'لا يوجد نشاط حديث' : 'No recent activity'}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* System Sections */}
        <motion.div variants={itemVariants}>
          <div className="ds-card">
            <div className="ds-card-header">
              <h3 className="ds-heading-4">{isRTL ? 'أقسام النظام' : 'System Sections'}</h3>
            </div>
            <div className="p-2">
              <SectionLink
                icon={<ShoppingCart size={18} />}
                title={isRTL ? 'الطلبات' : 'Orders'}
                description={isRTL ? 'إدارة ومتابعة الطلبات' : 'Manage orders'}
                href="/adminash/orders"
                stats={{ value: analytics.totalOrders, label: isRTL ? 'طلب' : 'orders' }}
              />
              <SectionLink
                icon={<Users size={18} />}
                title={isRTL ? 'المستخدمين' : 'Users'}
                description={isRTL ? 'إدارة الحسابات' : 'Manage accounts'}
                href="/adminash/users"
                stats={{ value: analytics.totalUsers, label: isRTL ? 'مستخدم' : 'users' }}
              />
              <SectionLink
                icon={<FileText size={18} />}
                title={isRTL ? 'العقود' : 'Contracts'}
                description={isRTL ? 'إدارة العقود' : 'Manage contracts'}
                href="/adminash/contracts"
              />
              <SectionLink
                icon={<Wallet size={18} />}
                title={isRTL ? 'المحافظ' : 'Wallets'}
                description={isRTL ? 'المحافظ المالية' : 'Financial wallets'}
                href="/adminash/wallets"
              />
              <SectionLink
                icon={<Building2 size={18} />}
                title={isRTL ? 'التمويل' : 'Finance'}
                description={isRTL ? 'المركز المالي' : 'Finance center'}
                href="/adminash/finance"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Order Status Summary */}
      <motion.div variants={itemVariants}>
        <div className="ds-card">
          <div className="ds-card-header">
            <h3 className="ds-heading-4">{isRTL ? 'ملخص حالة الطلبات' : 'Order Status Summary'}</h3>
          </div>
          <div className="ds-card-content">
            <div className="ds-grid-3">
              <div className="text-center p-4 rounded-xl" style={{ background: 'hsl(var(--ds-warning-bg))' }}>
                <Clock size={24} className="mx-auto mb-2" style={{ color: 'hsl(var(--ds-warning))' }} />
                <div className="text-2xl font-bold" style={{ color: 'hsl(var(--ds-warning))' }}>
                  {pendingOrders}
                </div>
                <div className="text-sm" style={{ color: 'hsl(var(--ds-text-muted))' }}>
                  {isRTL ? 'معلق' : 'Pending'}
                </div>
              </div>
              <div className="text-center p-4 rounded-xl" style={{ background: 'hsl(var(--ds-info-bg))' }}>
                <Activity size={24} className="mx-auto mb-2" style={{ color: 'hsl(var(--ds-info))' }} />
                <div className="text-2xl font-bold" style={{ color: 'hsl(var(--ds-info))' }}>
                  {inProgressOrders}
                </div>
                <div className="text-sm" style={{ color: 'hsl(var(--ds-text-muted))' }}>
                  {isRTL ? 'قيد التنفيذ' : 'In Progress'}
                </div>
              </div>
              <div className="text-center p-4 rounded-xl" style={{ background: 'hsl(var(--ds-success-bg))' }}>
                <CheckCircle2 size={24} className="mx-auto mb-2" style={{ color: 'hsl(var(--ds-success))' }} />
                <div className="text-2xl font-bold" style={{ color: 'hsl(var(--ds-success))' }}>
                  {completedOrders}
                </div>
                <div className="text-sm" style={{ color: 'hsl(var(--ds-text-muted))' }}>
                  {isRTL ? 'مكتمل' : 'Completed'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ModernAdminOverview;
