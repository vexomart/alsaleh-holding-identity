/**
 * Modern Customer Overview
 * Premium Dashboard with Real-time Data
 * Stripe/Notion/Apple Inspired
 */

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import {
  ShoppingCart,
  Package,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Sparkles,
  Receipt,
  Activity,
  Plus,
  ArrowUpRight,
  Wallet,
  Bell,
  Settings,
  HelpCircle,
  Gift
} from 'lucide-react';
import {
  ModernStatCard,
  ModernStatsGrid,
  ModernCard,
  ModernCardHeader,
  ModernCardContent,
  ModernButton,
  ModernBadge,
  ModernEmptyState
} from '@/components/v3/primitives/ModernCard';
import {
  ModernList,
  ModernListItem,
  ModernQuickLinks,
  ModernStatsRow
} from '@/components/v3/data/ModernList';
import {
  ModernPieChart,
  ModernChartCard,
  ModernProgressRing,
  CHART_COLORS
} from '@/components/v3/data/ModernChart';
import {
  ModernStatusBadge
} from '@/components/v3/data/ModernTable';
import {
  RelatedSectionsPanel,
  ActionHub,
  AlertBanner
} from '@/components/v3/data/SectionConnectors';
import { SkeletonDashboard } from '@/components/v3/feedback/ModernSkeleton';
import '@/styles/v3/modern-theme.css';

interface CustomerStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  inProgressOrders: number;
  totalInvoices: number;
  pendingInvoices: number;
  paidInvoices: number;
  totalSpent: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  title: string;
  status: string;
  total_amount: number | null;
  created_at: string;
}

export function ModernCustomerOverview() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, profile } = useAuth();
  const isRTL = language === 'ar';

  const [stats, setStats] = React.useState<CustomerStats | null>(null);
  const [recentOrders, setRecentOrders] = React.useState<RecentOrder[]>([]);
  const [loading, setLoading] = React.useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return isRTL ? 'صباح الخير' : 'Good Morning';
    if (hour < 17) return isRTL ? 'مساء الخير' : 'Good Afternoon';
    return isRTL ? 'مساء الخير' : 'Good Evening';
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return isRTL ? '٠ ر.س' : '0 SAR';
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

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { type: 'success' | 'warning' | 'error' | 'info' | 'pending'; label: string }> = {
      pending: { type: 'pending', label: isRTL ? 'قيد الانتظار' : 'Pending' },
      processing: { type: 'info', label: isRTL ? 'قيد المعالجة' : 'Processing' },
      in_progress: { type: 'info', label: isRTL ? 'قيد التنفيذ' : 'In Progress' },
      completed: { type: 'success', label: isRTL ? 'مكتمل' : 'Completed' },
      cancelled: { type: 'error', label: isRTL ? 'ملغي' : 'Cancelled' },
    };
    return configs[status] || { type: 'neutral' as const, label: status };
  };

  React.useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [ordersResult, invoicesResult] = await Promise.all([
          supabase
            .from('orders')
            .select('*')
            .eq('customer_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('invoices')
            .select('*')
            .eq('customer_id', user.id),
        ]);

        const orders = ordersResult.data || [];
        const invoices = invoicesResult.data || [];

        const totalSpent = invoices
          .filter(i => i.status === 'paid')
          .reduce((sum, i) => sum + (i.total || 0), 0);

        setStats({
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => o.status === 'pending').length,
          inProgressOrders: orders.filter(o => ['processing', 'in_progress'].includes(o.status || '')).length,
          completedOrders: orders.filter(o => o.status === 'completed').length,
          totalInvoices: invoices.length,
          pendingInvoices: invoices.filter(i => i.status === 'issued').length,
          paidInvoices: invoices.filter(i => i.status === 'paid').length,
          totalSpent,
        });

        setRecentOrders(orders.slice(0, 5) as RecentOrder[]);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Real-time subscription
    const channel = supabase
      .channel('customer-overview')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `customer_id=eq.${user.id}` },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Quick actions
  const quickActions = [
    {
      id: 'new-service',
      label: isRTL ? 'طلب خدمة' : 'New Service',
      icon: <Plus size={24} />,
      onClick: () => navigate('/portal/services'),
      variant: 'primary' as const,
    },
    {
      id: 'track-orders',
      label: isRTL ? 'تتبع الطلبات' : 'Track Orders',
      icon: <Package size={24} />,
      onClick: () => navigate('/portal/orders'),
      variant: 'secondary' as const,
      badge: stats?.inProgressOrders,
    },
    {
      id: 'wallet',
      label: isRTL ? 'المحفظة' : 'Wallet',
      icon: <Wallet size={24} />,
      onClick: () => navigate('/portal/wallet'),
      variant: 'secondary' as const,
    },
    {
      id: 'support',
      label: isRTL ? 'الدعم' : 'Support',
      icon: <HelpCircle size={24} />,
      onClick: () => navigate('/portal/support'),
      variant: 'secondary' as const,
    },
  ];

  // Quick links
  const quickLinks = [
    {
      id: 'services',
      icon: <Package size={18} />,
      iconBg: 'hsl(217 91% 60% / 0.1)',
      iconColor: 'hsl(217 91% 60%)',
      title: isRTL ? 'تصفح الخدمات' : 'Browse Services',
      description: isRTL ? 'اكتشف خدماتنا' : 'Discover our services',
      onClick: () => navigate('/portal/services'),
    },
    {
      id: 'contracts',
      icon: <FileText size={18} />,
      iconBg: 'hsl(262 83% 58% / 0.1)',
      iconColor: 'hsl(262 83% 58%)',
      title: isRTL ? 'العقود' : 'Contracts',
      description: isRTL ? 'إدارة عقودك' : 'Manage your contracts',
      onClick: () => navigate('/portal/contracts'),
    },
    {
      id: 'referrals',
      icon: <Gift size={18} />,
      iconBg: 'hsl(38 92% 50% / 0.1)',
      iconColor: 'hsl(38 92% 50%)',
      title: isRTL ? 'الإحالات' : 'Referrals',
      description: isRTL ? 'اربح من الإحالات' : 'Earn from referrals',
      onClick: () => navigate('/portal/referrals'),
    },
  ];

  // Order status data for pie chart
  const orderStatusData = stats ? [
    { name: isRTL ? 'قيد الانتظار' : 'Pending', value: stats.pendingOrders, color: CHART_COLORS.warning },
    { name: isRTL ? 'قيد التنفيذ' : 'In Progress', value: stats.inProgressOrders, color: CHART_COLORS.primary },
    { name: isRTL ? 'مكتمل' : 'Completed', value: stats.completedOrders, color: CHART_COLORS.success },
  ].filter(item => item.value > 0) : [];

  if (loading) {
    return <SkeletonDashboard />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="modern-welcome-banner"
      >
        <div className="modern-welcome-content">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} style={{ color: 'hsl(38 92% 50%)' }} />
            <span 
              className="text-sm font-medium"
              style={{ color: 'hsl(38 92% 50%)' }}
            >
              {isRTL ? 'بوابة العميل' : 'Customer Portal'}
            </span>
          </div>
          
          <h1 
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: 'hsl(var(--modern-text-primary))' }}
          >
            {getGreeting()}، {profile?.full_name || profile?.email?.split('@')[0]} 👋
          </h1>
          
          <p 
            className="text-sm md:text-base max-w-xl"
            style={{ color: 'hsl(var(--modern-text-muted))' }}
          >
            {isRTL 
              ? 'مرحباً بك في لوحة التحكم الخاصة بك. يمكنك متابعة طلباتك وإدارة حسابك من هنا.'
              : 'Welcome to your dashboard. Track your orders and manage your account here.'
            }
          </p>

          {/* Mini Stats in Header */}
          <div className="flex flex-wrap gap-3 mt-6">
            {stats?.inProgressOrders ? (
              <div 
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ background: 'hsl(var(--modern-bg-elevated))' }}
              >
                <Package size={16} style={{ color: 'hsl(var(--modern-brand-primary))' }} />
                <span 
                  className="text-sm font-medium"
                  style={{ color: 'hsl(var(--modern-text-primary))' }}
                >
                  {stats.inProgressOrders} {isRTL ? 'طلب نشط' : 'active orders'}
                </span>
              </div>
            ) : null}
            {stats?.pendingInvoices ? (
              <div 
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ background: 'hsl(var(--modern-warning-bg))' }}
              >
                <Receipt size={16} style={{ color: 'hsl(var(--modern-warning))' }} />
                <span 
                  className="text-sm font-medium"
                  style={{ color: 'hsl(var(--modern-warning))' }}
                >
                  {stats.pendingInvoices} {isRTL ? 'فاتورة معلقة' : 'pending invoices'}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ActionHub
          title={isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
          actions={quickActions}
          columns={4}
        />
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <ModernStatsGrid columns={4}>
          <ModernStatCard
            icon={<ShoppingCart size={20} />}
            iconColor="hsl(217 91% 60%)"
            iconBg="hsl(217 91% 60% / 0.1)"
            label={isRTL ? 'إجمالي الطلبات' : 'Total Orders'}
            value={stats?.totalOrders || 0}
            onClick={() => navigate('/portal/orders')}
          />
          <ModernStatCard
            icon={<Activity size={20} />}
            iconColor="hsl(38 92% 50%)"
            iconBg="hsl(38 92% 50% / 0.1)"
            label={isRTL ? 'طلبات نشطة' : 'Active Orders'}
            value={stats?.inProgressOrders || 0}
          />
          <ModernStatCard
            icon={<CheckCircle2 size={20} />}
            iconColor="hsl(152 69% 41%)"
            iconBg="hsl(152 69% 41% / 0.1)"
            label={isRTL ? 'مكتملة' : 'Completed'}
            value={stats?.completedOrders || 0}
          />
          <ModernStatCard
            icon={<CreditCard size={20} />}
            iconColor="hsl(262 83% 58%)"
            iconBg="hsl(262 83% 58% / 0.1)"
            label={isRTL ? 'إجمالي المدفوعات' : 'Total Spent'}
            value={formatCurrency(stats?.totalSpent || 0)}
          />
        </ModernStatsGrid>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-6 grid-cols-1 lg:grid-cols-3"
      >
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <ModernCard>
            <ModernCardHeader
              title={isRTL ? 'الطلبات الأخيرة' : 'Recent Orders'}
              description={isRTL ? 'آخر 5 طلبات' : 'Your last 5 orders'}
              action={
                <ModernButton
                  variant="ghost"
                  size="sm"
                  icon={<ArrowUpRight size={14} />}
                  iconPosition="end"
                  onClick={() => navigate('/portal/orders')}
                >
                  {isRTL ? 'عرض الكل' : 'View All'}
                </ModernButton>
              }
            />
            <ModernCardContent noPadding>
              {recentOrders.length > 0 ? (
                <ModernList>
                  {recentOrders.map((order) => {
                    const statusConfig = getStatusConfig(order.status);
                    return (
                      <ModernListItem
                        key={order.id}
                        icon={<Package size={16} />}
                        iconBg="hsl(var(--modern-bg-elevated))"
                        iconColor="hsl(var(--modern-text-secondary))"
                        title={order.title}
                        description={order.order_number}
                        meta={formatRelativeTime(order.created_at)}
                        badge={
                          <ModernStatusBadge 
                            status={statusConfig.type} 
                            label={statusConfig.label}
                          />
                        }
                        onClick={() => navigate(`/portal/orders`)}
                      />
                    );
                  })}
                </ModernList>
              ) : (
                <div className="py-12">
                  <ModernEmptyState
                    icon={<Package size={48} />}
                    title={isRTL ? 'لا توجد طلبات' : 'No Orders Yet'}
                    description={isRTL ? 'ابدأ بطلب خدمة جديدة' : 'Start by requesting a new service'}
                    action={
                      <ModernButton
                        variant="primary"
                        icon={<Plus size={16} />}
                        onClick={() => navigate('/portal/services')}
                      >
                        {isRTL ? 'تصفح الخدمات' : 'Browse Services'}
                      </ModernButton>
                    }
                  />
                </div>
              )}
            </ModernCardContent>
          </ModernCard>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Order Status Distribution */}
          {orderStatusData.length > 0 && (
            <ModernChartCard
              title={isRTL ? 'حالة الطلبات' : 'Order Status'}
            >
              <ModernPieChart
                data={orderStatusData}
                height={200}
                innerRadius={40}
                outerRadius={70}
              />
            </ModernChartCard>
          )}

          {/* Quick Links */}
          <ModernCard>
            <ModernCardHeader
              title={isRTL ? 'روابط سريعة' : 'Quick Links'}
            />
            <ModernCardContent noPadding>
              <div className="p-2">
                {quickLinks.map((link, index) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <ModernListItem
                      icon={link.icon}
                      iconBg={link.iconBg}
                      iconColor={link.iconColor}
                      title={link.title}
                      description={link.description}
                      onClick={link.onClick}
                    />
                  </motion.div>
                ))}
              </div>
            </ModernCardContent>
          </ModernCard>
        </div>
      </motion.div>
    </div>
  );
}

export default ModernCustomerOverview;
