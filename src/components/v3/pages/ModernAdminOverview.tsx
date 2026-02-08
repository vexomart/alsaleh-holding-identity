/**
 * Modern Admin Overview
 * Premium Dashboard with Real-time Data
 * Stripe/Notion/Apple Inspired
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
  ClipboardList
} from 'lucide-react';
import {
  ModernStatCard,
  ModernStatsGrid,
  ModernCard,
  ModernCardHeader,
  ModernCardContent,
  ModernButton,
  ModernSectionHeader,
  ModernBadge
} from '@/components/v3/primitives/ModernCard';
import {
  ModernList,
  ModernListItem,
  ModernQuickLinks,
  ModernStatsRow,
  ModernTimeline
} from '@/components/v3/data/ModernList';
import {
  ModernAreaChart,
  ModernPieChart,
  ModernChartCard,
  CHART_COLORS
} from '@/components/v3/data/ModernChart';
import {
  RelatedSectionsPanel,
  ActionHub,
  AlertBanner
} from '@/components/v3/data/SectionConnectors';
import { SkeletonDashboard } from '@/components/v3/feedback/ModernSkeleton';
import '@/styles/v3/modern-theme.css';

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
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(amount);
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

  // Quick actions for admin
  const quickActions = [
    {
      id: 'new-order',
      label: isRTL ? 'طلب جديد' : 'New Order',
      icon: <Plus size={24} />,
      onClick: () => navigate('/adminash/orders'),
      variant: 'primary' as const,
    },
    {
      id: 'add-user',
      label: isRTL ? 'إضافة مستخدم' : 'Add User',
      icon: <UserPlus size={24} />,
      onClick: () => navigate('/adminash/users'),
      variant: 'secondary' as const,
    },
    {
      id: 'view-reports',
      label: isRTL ? 'التقارير' : 'Reports',
      icon: <BarChart3 size={24} />,
      onClick: () => navigate('/adminash/reports'),
      variant: 'secondary' as const,
    },
    {
      id: 'settings',
      label: isRTL ? 'الإعدادات' : 'Settings',
      icon: <Settings size={24} />,
      onClick: () => navigate('/adminash/settings'),
      variant: 'secondary' as const,
    },
  ];

  // Related sections
  const relatedSections = [
    {
      id: 'orders',
      title: isRTL ? 'الطلبات' : 'Orders',
      description: isRTL ? 'إدارة ومتابعة الطلبات' : 'Manage and track orders',
      href: '/adminash/orders',
      icon: <ShoppingCart size={18} />,
      stats: { value: analytics.totalOrders, label: isRTL ? 'طلب' : 'orders' },
    },
    {
      id: 'users',
      title: isRTL ? 'المستخدمين' : 'Users',
      description: isRTL ? 'إدارة الحسابات والصلاحيات' : 'Manage accounts and permissions',
      href: '/adminash/users',
      icon: <Users size={18} />,
      stats: { value: analytics.totalUsers, label: isRTL ? 'مستخدم' : 'users' },
    },
    {
      id: 'services',
      title: isRTL ? 'الخدمات' : 'Services',
      description: isRTL ? 'إدارة كتالوج الخدمات' : 'Manage service catalog',
      href: '/adminash/services',
      icon: <Package size={18} />,
      stats: { value: analytics.totalServices, label: isRTL ? 'خدمة' : 'services' },
    },
    {
      id: 'wallets',
      title: isRTL ? 'المحافظ' : 'Wallets',
      description: isRTL ? 'إدارة المحافظ المالية' : 'Manage customer wallets',
      href: '/adminash/wallets',
      icon: <Wallet size={18} />,
    },
  ];

  // Revenue chart data
  const revenueData = analytics.monthlyRevenue.map(item => ({
    name: isRTL ? item.month : item.monthEn,
    revenue: item.revenue,
  }));

  // Order status pie data
  const orderStatusData = [
    { name: isRTL ? 'قيد الانتظار' : 'Pending', value: pendingOrders, color: CHART_COLORS.warning },
    { name: isRTL ? 'قيد التنفيذ' : 'In Progress', value: inProgressOrders, color: CHART_COLORS.primary },
    { name: isRTL ? 'مكتمل' : 'Completed', value: completedOrders, color: CHART_COLORS.success },
  ].filter(item => item.value > 0);

  // Recent activities from orders
  const recentActivities = analytics.recentOrders.slice(0, 5).map(order => ({
    id: order.id,
    type: (order.status === 'completed' ? 'success' : order.status === 'pending' ? 'warning' : 'info') as any,
    title: `${isRTL ? 'طلب:' : 'Order:'} ${order.title}`,
    description: order.order_number,
    timestamp: formatRelativeTime(order.created_at),
  }));

  if (loading) {
    return <SkeletonDashboard />;
  }

  return (
    <div className="space-y-8">
      {/* Header with Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 
            className="text-2xl font-bold flex items-center gap-2"
            style={{ color: 'hsl(var(--modern-text-primary))' }}
          >
            {getGreeting()}، {profile?.full_name || profile?.email?.split('@')[0]} 👋
          </h1>
          <p 
            className="mt-1 text-sm"
            style={{ color: 'hsl(var(--modern-text-muted))' }}
          >
            {isRTL ? 'إليك نظرة عامة على النظام اليوم' : "Here's your system overview for today"}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <ModernButton
            variant="secondary"
            size="sm"
            icon={<RefreshCw size={16} className={cn(isRefreshing && 'animate-spin')} />}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRTL ? 'تحديث' : 'Refresh'}
          </ModernButton>
        </div>
      </motion.div>

      {/* Alerts */}
      {pendingOrders > 5 && (
        <AlertBanner
          type="warning"
          title={isRTL ? `لديك ${pendingOrders} طلبات معلقة` : `You have ${pendingOrders} pending orders`}
          message={isRTL ? 'يرجى مراجعتها في أقرب وقت' : 'Please review them soon'}
          action={{
            label: isRTL ? 'عرض الطلبات' : 'View Orders',
            onClick: () => navigate('/adminash/orders'),
          }}
          dismissible
        />
      )}

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ModernStatsGrid columns={4}>
          <ModernStatCard
            icon={<Users size={20} />}
            iconColor="hsl(217 91% 60%)"
            iconBg="hsl(217 91% 60% / 0.1)"
            label={isRTL ? 'إجمالي المستخدمين' : 'Total Users'}
            value={analytics.totalUsers.toLocaleString()}
            onClick={() => navigate('/adminash/users')}
          />
          <ModernStatCard
            icon={<ShoppingCart size={20} />}
            iconColor="hsl(165 82% 51%)"
            iconBg="hsl(165 82% 51% / 0.1)"
            label={isRTL ? 'الطلبات' : 'Orders'}
            value={analytics.totalOrders.toLocaleString()}
            change={analytics.totalOrders > 0 ? { value: 12, direction: 'up', label: isRTL ? 'هذا الشهر' : 'this month' } : undefined}
            onClick={() => navigate('/adminash/orders')}
          />
          <ModernStatCard
            icon={<Package size={20} />}
            iconColor="hsl(262 83% 58%)"
            iconBg="hsl(262 83% 58% / 0.1)"
            label={isRTL ? 'الخدمات' : 'Services'}
            value={analytics.totalServices}
            onClick={() => navigate('/adminash/services')}
          />
          <ModernStatCard
            icon={<DollarSign size={20} />}
            iconColor="hsl(38 92% 50%)"
            iconBg="hsl(38 92% 50% / 0.1)"
            label={isRTL ? 'الإيرادات' : 'Revenue'}
            value={formatCurrency(analytics.totalRevenue)}
            change={analytics.totalRevenue > 0 ? { value: 8, direction: 'up' } : undefined}
          />
        </ModernStatsGrid>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <ActionHub
          title={isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
          actions={quickActions}
          columns={4}
        />
      </motion.div>

      {/* Charts Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-6 grid-cols-1 lg:grid-cols-7"
      >
        {/* Revenue Chart */}
        <div className="lg:col-span-5">
          <ModernChartCard
            title={isRTL ? 'الإيرادات الشهرية' : 'Monthly Revenue'}
            description={isRTL ? 'تتبع الإيرادات على مدار العام' : 'Track revenue throughout the year'}
            action={
              <ModernBadge variant="info">
                {isRTL ? 'آخر 7 أشهر' : 'Last 7 months'}
              </ModernBadge>
            }
          >
            {revenueData.length > 0 ? (
              <ModernAreaChart
                data={revenueData}
                dataKey="revenue"
                xAxisKey="name"
                height={280}
                formatter={(value) => formatCurrency(value)}
              />
            ) : (
              <div 
                className="h-[280px] flex items-center justify-center"
                style={{ color: 'hsl(var(--modern-text-muted))' }}
              >
                {isRTL ? 'لا توجد بيانات إيرادات' : 'No revenue data'}
              </div>
            )}
          </ModernChartCard>
        </div>

        {/* Order Status Pie */}
        <div className="lg:col-span-2">
          <ModernChartCard
            title={isRTL ? 'حالة الطلبات' : 'Order Status'}
          >
            {orderStatusData.length > 0 ? (
              <ModernPieChart
                data={orderStatusData}
                height={280}
                innerRadius={50}
                outerRadius={80}
              />
            ) : (
              <div 
                className="h-[280px] flex items-center justify-center"
                style={{ color: 'hsl(var(--modern-text-muted))' }}
              >
                {isRTL ? 'لا توجد طلبات' : 'No orders'}
              </div>
            )}
          </ModernChartCard>
        </div>
      </motion.div>

      {/* Bottom Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="grid gap-6 grid-cols-1 lg:grid-cols-3"
      >
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <ModernCard>
            <ModernCardHeader
              title={isRTL ? 'النشاط الأخير' : 'Recent Activity'}
              description={isRTL ? 'آخر التحديثات في النظام' : 'Latest updates in the system'}
              action={
                <ModernButton
                  variant="ghost"
                  size="sm"
                  icon={<ArrowUpRight size={14} />}
                  iconPosition="end"
                  onClick={() => navigate('/adminash/orders')}
                >
                  {isRTL ? 'عرض الكل' : 'View All'}
                </ModernButton>
              }
            />
            <ModernCardContent noPadding>
              {recentActivities.length > 0 ? (
                <ModernList>
                  {recentActivities.map((activity) => (
                    <ModernListItem
                      key={activity.id}
                      icon={<Activity size={16} />}
                      iconBg={activity.type === 'success' 
                        ? 'hsl(var(--modern-success-bg))' 
                        : activity.type === 'warning' 
                          ? 'hsl(var(--modern-warning-bg))' 
                          : 'hsl(var(--modern-info-bg))'
                      }
                      iconColor={activity.type === 'success' 
                        ? 'hsl(var(--modern-success))' 
                        : activity.type === 'warning' 
                          ? 'hsl(var(--modern-warning))' 
                          : 'hsl(var(--modern-info))'
                      }
                      title={activity.title}
                      description={activity.description}
                      meta={activity.timestamp}
                    />
                  ))}
                </ModernList>
              ) : (
                <div 
                  className="py-12 text-center"
                  style={{ color: 'hsl(var(--modern-text-muted))' }}
                >
                  {isRTL ? 'لا يوجد نشاط حديث' : 'No recent activity'}
                </div>
              )}
            </ModernCardContent>
          </ModernCard>
        </div>

        {/* Related Sections */}
        <div>
          <RelatedSectionsPanel
            title={isRTL ? 'أقسام النظام' : 'System Sections'}
            sections={relatedSections}
          />
        </div>
      </motion.div>
    </div>
  );
}

export default ModernAdminOverview;
