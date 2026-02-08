/**
 * V3 Customer Banking Portal Overview
 * Premium Smart Dashboard - Enterprise Grade
 * Real-time Data + Intelligent Insights
 */

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  ShoppingCart, 
  FileSignature, 
  Briefcase,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Clock,
  Sparkles,
  CreditCard,
  Bell,
  ChevronLeft,
  Plus,
  Eye
} from 'lucide-react';
import '@/styles/v3/modern-theme.css';

// Animation variants with proper typing
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
  }
};

interface WalletData {
  id: string;
  balance: number;
  wallet_number: string;
  currency: string;
  reserved_balance?: number;
}

interface OrderData {
  id: string;
  order_number: string;
  title?: string;
  status: string;
  created_at: string;
  total_amount?: number;
}

interface TransactionData {
  id: string;
  transaction_type: string;
  amount: number;
  description?: string;
  description_ar?: string;
  created_at: string;
  status: string;
}

interface DashboardStats {
  activeOrders: number;
  activeContracts: number;
  totalServices: number;
  pendingInvoices: number;
}

export const V3CustomerOverview: React.FC = () => {
  const { language } = useLanguage();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const isAr = language === 'ar';

  // Real data state
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [recentOrders, setRecentOrders] = React.useState<OrderData[]>([]);
  const [recentTransactions, setRecentTransactions] = React.useState<TransactionData[]>([]);
  const [stats, setStats] = React.useState<DashboardStats>({
    activeOrders: 0,
    activeContracts: 0,
    totalServices: 0,
    pendingInvoices: 0,
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Update time every minute
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real data from database
  React.useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Parallel fetches for performance
        const [walletRes, ordersRes, contractsRes, servicesRes, invoicesRes, transactionsRes] = await Promise.all([
          supabase.from('customer_wallets').select('id, balance, wallet_number, currency, reserved_balance').eq('customer_user_id', user.id).maybeSingle(),
          supabase.from('orders').select('id, order_number, title, status, created_at, total_amount').eq('customer_id', user.id).order('created_at', { ascending: false }).limit(5),
          supabase.from('contracts').select('*', { count: 'exact', head: true }).eq('customer_user_id', user.id).in('status', ['signed', 'pending_signature', 'pre_approved_by_customer']),
          supabase.from('services').select('*', { count: 'exact', head: true }).eq('is_active', true).eq('is_visible_to_customers', true),
          supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('customer_id', user.id).eq('status', 'draft'),
          supabase.from('financial_transactions').select('id, transaction_type, amount, description, description_ar, created_at, status').eq('customer_user_id', user.id).order('created_at', { ascending: false }).limit(5),
        ]);

        if (walletRes.data) setWallet(walletRes.data as WalletData);
        if (ordersRes.data) setRecentOrders(ordersRes.data as OrderData[]);
        if (transactionsRes.data) setRecentTransactions(transactionsRes.data as TransactionData[]);

        const activeOrdersCount = (ordersRes.data || []).filter(
          o => ['pending', 'processing', 'in_progress'].includes(o.status)
        ).length;

        setStats({
          activeOrders: activeOrdersCount,
          activeContracts: contractsRes.count || 0,
          totalServices: servicesRes.count || 0,
          pendingInvoices: invoicesRes.count || 0,
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const formatWalletNumber = (walletNumber: string | undefined) => {
    if (!walletNumber || walletNumber.length < 4) return '•••• •••• •••• ••••';
    return `•••• •••• •••• ${walletNumber.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return isAr ? 'الآن' : 'Just now';
    if (diffMins < 60) return isAr ? `منذ ${diffMins} دقيقة` : `${diffMins}m ago`;
    if (diffHours < 24) return isAr ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
    if (diffDays < 7) return isAr ? `منذ ${diffDays} يوم` : `${diffDays}d ago`;
    
    return date.toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return isAr ? 'صباح الخير' : 'Good Morning';
    if (hour < 18) return isAr ? 'مساء الخير' : 'Good Afternoon';
    return isAr ? 'مساء الخير' : 'Good Evening';
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; labelEn: string; color: string; bg: string }> = {
      pending: { label: 'قيد الانتظار', labelEn: 'Pending', color: 'hsl(var(--modern-warning))', bg: 'hsl(var(--modern-warning) / 0.1)' },
      processing: { label: 'قيد المعالجة', labelEn: 'Processing', color: 'hsl(var(--modern-info))', bg: 'hsl(var(--modern-info) / 0.1)' },
      in_progress: { label: 'قيد التنفيذ', labelEn: 'In Progress', color: 'hsl(var(--modern-brand-primary))', bg: 'hsl(var(--modern-brand-primary) / 0.1)' },
      completed: { label: 'مكتمل', labelEn: 'Completed', color: 'hsl(var(--modern-success))', bg: 'hsl(var(--modern-success) / 0.1)' },
      cancelled: { label: 'ملغي', labelEn: 'Cancelled', color: 'hsl(var(--modern-error))', bg: 'hsl(var(--modern-error) / 0.1)' },
    };
    return configs[status] || { label: status, labelEn: status, color: 'hsl(var(--modern-text-muted))', bg: 'hsl(var(--modern-bg-elevated))' };
  };

  const quickActions = [
    { id: 'order', label: 'طلب جديد', labelEn: 'New Order', icon: Plus, path: '/portal/services', color: 'var(--modern-brand-primary)' },
    { id: 'wallet', label: 'المحفظة', labelEn: 'Wallet', icon: Wallet, path: '/portal/wallet', color: 'var(--modern-success)' },
    { id: 'orders', label: 'طلباتي', labelEn: 'My Orders', icon: ShoppingCart, path: '/portal/orders', color: 'var(--modern-info)' },
    { id: 'contracts', label: 'العقود', labelEn: 'Contracts', icon: FileSignature, path: '/portal/contracts', color: 'var(--modern-warning)' },
  ];

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="smart-overview">
        <div className="smart-overview__loading">
          <motion.div 
            className="smart-loading-pulse"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Sparkles size={32} />
            <span>{isAr ? 'جاري تحميل بياناتك...' : 'Loading your data...'}</span>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="smart-overview"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Header */}
      <motion.header className="smart-overview__header" variants={itemVariants}>
        <div className="smart-overview__greeting">
          <div className="smart-overview__greeting-row">
            <span className="smart-overview__greeting-emoji">👋</span>
            <span className="smart-overview__greeting-text">{getGreeting()}</span>
          </div>
          <h1 className="smart-overview__name">
            {profile?.full_name || (isAr ? 'عميلنا العزيز' : 'Dear Customer')}
          </h1>
        </div>
        <div className="smart-overview__datetime">
          <Clock size={14} />
          <span>
            {currentTime.toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
              weekday: 'long',
              day: 'numeric',
              month: 'short',
            })}
          </span>
        </div>
      </motion.header>

      {/* Premium Wallet Card */}
      <motion.div className="smart-wallet" variants={itemVariants}>
        <motion.div 
          className="smart-wallet__card"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => navigate('/portal/wallet')}
        >
          {/* Decorative Elements */}
          <div className="smart-wallet__decor">
            <div className="smart-wallet__decor-circle smart-wallet__decor-circle--1" />
            <div className="smart-wallet__decor-circle smart-wallet__decor-circle--2" />
            <div className="smart-wallet__decor-pattern" />
          </div>

          <div className="smart-wallet__content">
            <div className="smart-wallet__top">
              <div className="smart-wallet__label">
                <CreditCard size={16} />
                <span>{isAr ? 'المحفظة الرقمية' : 'Digital Wallet'}</span>
              </div>
              <div className="smart-wallet__chip" />
            </div>

            <div className="smart-wallet__balance">
              <span className="smart-wallet__balance-label">
                {isAr ? 'الرصيد المتاح' : 'Available Balance'}
              </span>
              <div className="smart-wallet__balance-amount">
                <span className="smart-wallet__balance-value" dir="ltr">
                  {formatCurrency(wallet?.balance || 0)}
                </span>
                <span className="smart-wallet__balance-currency">SAR</span>
              </div>
            </div>

            <div className="smart-wallet__bottom">
              <div className="smart-wallet__number" dir="ltr">
                {formatWalletNumber(wallet?.wallet_number)}
              </div>
              <div className="smart-wallet__brand">
                ASH WALLET
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Wallet Actions */}
        <div className="smart-wallet__actions">
          <motion.button 
            className="smart-wallet__action"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/portal/wallet')}
          >
            <ArrowDownLeft size={18} />
            <span>{isAr ? 'إيداع' : 'Deposit'}</span>
          </motion.button>
          <motion.button 
            className="smart-wallet__action"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/portal/wallet')}
          >
            <ArrowUpRight size={18} />
            <span>{isAr ? 'تحويل' : 'Transfer'}</span>
          </motion.button>
          <motion.button 
            className="smart-wallet__action"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/portal/wallet')}
          >
            <Eye size={18} />
            <span>{isAr ? 'التفاصيل' : 'Details'}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Smart Stats Grid */}
      <motion.div className="smart-stats" variants={itemVariants}>
        <motion.div 
          className="smart-stat"
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/portal/orders')}
        >
          <div className="smart-stat__icon" style={{ background: 'hsl(var(--modern-info) / 0.1)', color: 'hsl(var(--modern-info))' }}>
            <ShoppingCart size={20} />
          </div>
          <div className="smart-stat__content">
            <span className="smart-stat__value">{stats.activeOrders}</span>
            <span className="smart-stat__label">{isAr ? 'طلبات نشطة' : 'Active Orders'}</span>
          </div>
          {stats.activeOrders > 0 && (
            <div className="smart-stat__indicator smart-stat__indicator--active" />
          )}
        </motion.div>

        <motion.div 
          className="smart-stat"
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/portal/contracts')}
        >
          <div className="smart-stat__icon" style={{ background: 'hsl(var(--modern-success) / 0.1)', color: 'hsl(var(--modern-success))' }}>
            <FileSignature size={20} />
          </div>
          <div className="smart-stat__content">
            <span className="smart-stat__value">{stats.activeContracts}</span>
            <span className="smart-stat__label">{isAr ? 'عقود سارية' : 'Active Contracts'}</span>
          </div>
        </motion.div>

        <motion.div 
          className="smart-stat"
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/portal/services')}
        >
          <div className="smart-stat__icon" style={{ background: 'hsl(var(--modern-brand-primary) / 0.1)', color: 'hsl(var(--modern-brand-primary))' }}>
            <Briefcase size={20} />
          </div>
          <div className="smart-stat__content">
            <span className="smart-stat__value">{stats.totalServices}</span>
            <span className="smart-stat__label">{isAr ? 'خدمات متاحة' : 'Services'}</span>
          </div>
        </motion.div>

        <motion.div 
          className="smart-stat"
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/portal/invoices')}
        >
          <div className="smart-stat__icon" style={{ background: 'hsl(var(--modern-warning) / 0.1)', color: 'hsl(var(--modern-warning))' }}>
            <Bell size={20} />
          </div>
          <div className="smart-stat__content">
            <span className="smart-stat__value">{stats.pendingInvoices}</span>
            <span className="smart-stat__label">{isAr ? 'فواتير معلقة' : 'Pending Invoices'}</span>
          </div>
          {stats.pendingInvoices > 0 && (
            <div className="smart-stat__indicator smart-stat__indicator--warning" />
          )}
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.section className="smart-actions" variants={itemVariants}>
        <h2 className="smart-section-title">
          <Sparkles size={16} />
          {isAr ? 'إجراءات سريعة' : 'Quick Actions'}
        </h2>
        <div className="smart-actions__grid">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                className="smart-action"
                onClick={() => navigate(action.path)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div 
                  className="smart-action__icon"
                  style={{ background: `hsl(${action.color} / 0.1)`, color: `hsl(${action.color})` }}
                >
                  <Icon size={22} />
                </div>
                <span className="smart-action__label">
                  {isAr ? action.label : action.labelEn}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* Content Grid */}
      <div className="smart-grid">
        {/* Recent Orders */}
        <motion.section className="smart-card" variants={itemVariants}>
          <div className="smart-card__header">
            <h3 className="smart-card__title">
              <ShoppingCart size={18} />
              {isAr ? 'آخر الطلبات' : 'Recent Orders'}
            </h3>
            <button 
              className="smart-card__link"
              onClick={() => navigate('/portal/orders')}
            >
              {isAr ? 'عرض الكل' : 'View All'}
              <ChevronLeft size={16} />
            </button>
          </div>
          <div className="smart-card__content">
            {recentOrders.length === 0 ? (
              <div className="smart-empty">
                <ShoppingCart size={40} strokeWidth={1} />
                <p>{isAr ? 'لا توجد طلبات بعد' : 'No orders yet'}</p>
                <button 
                  className="smart-empty__action"
                  onClick={() => navigate('/portal/services')}
                >
                  {isAr ? 'اطلب خدمة الآن' : 'Request a Service'}
                </button>
              </div>
            ) : (
              <div className="smart-orders">
                <AnimatePresence>
                  {recentOrders.slice(0, 4).map((order, index) => {
                    const statusConfig = getStatusConfig(order.status);
                    return (
                      <motion.div 
                        key={order.id} 
                        className="smart-order"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="smart-order__main">
                          <span className="smart-order__title">
                            {order.title || (isAr ? 'طلب خدمة' : 'Service Order')}
                          </span>
                          <span className="smart-order__number" dir="ltr">
                            #{order.order_number}
                          </span>
                        </div>
                        <div className="smart-order__meta">
                          <span 
                            className="smart-order__status"
                            style={{ background: statusConfig.bg, color: statusConfig.color }}
                          >
                            {isAr ? statusConfig.label : statusConfig.labelEn}
                          </span>
                          <span className="smart-order__time">
                            {formatDate(order.created_at)}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.section>

        {/* Recent Transactions */}
        <motion.section className="smart-card" variants={itemVariants}>
          <div className="smart-card__header">
            <h3 className="smart-card__title">
              <TrendingUp size={18} />
              {isAr ? 'آخر المعاملات' : 'Recent Transactions'}
            </h3>
            <button 
              className="smart-card__link"
              onClick={() => navigate('/portal/wallet')}
            >
              {isAr ? 'عرض الكل' : 'View All'}
              <ChevronLeft size={16} />
            </button>
          </div>
          <div className="smart-card__content">
            {recentTransactions.length === 0 ? (
              <div className="smart-empty">
                <Wallet size={40} strokeWidth={1} />
                <p>{isAr ? 'لا توجد معاملات بعد' : 'No transactions yet'}</p>
              </div>
            ) : (
              <div className="smart-transactions">
                <AnimatePresence>
                  {recentTransactions.map((tx, index) => {
                    const isCredit = ['topup', 'deposit', 'refund'].includes(tx.transaction_type);
                    return (
                      <motion.div 
                        key={tx.id} 
                        className="smart-transaction"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div 
                          className="smart-transaction__icon"
                          style={{ 
                            background: isCredit ? 'hsl(var(--modern-success) / 0.1)' : 'hsl(var(--modern-error) / 0.1)',
                            color: isCredit ? 'hsl(var(--modern-success))' : 'hsl(var(--modern-error))'
                          }}
                        >
                          {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                        </div>
                        <div className="smart-transaction__info">
                          <span className="smart-transaction__desc">
                            {isAr ? (tx.description_ar || tx.description || tx.transaction_type) : (tx.description || tx.transaction_type)}
                          </span>
                          <span className="smart-transaction__time">
                            {formatDate(tx.created_at)}
                          </span>
                        </div>
                        <div 
                          className="smart-transaction__amount"
                          style={{ color: isCredit ? 'hsl(var(--modern-success))' : 'hsl(var(--modern-text-primary))' }}
                          dir="ltr"
                        >
                          {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                          <span className="smart-transaction__currency">SAR</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

V3CustomerOverview.displayName = 'V3CustomerOverview';
