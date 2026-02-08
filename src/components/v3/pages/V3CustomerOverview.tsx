/**
 * V3 Customer Portal Overview
 * Enterprise SaaS Dashboard - Premium Design
 * Balanced Layout with Smart Space Utilization
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
  Eye,
  Receipt,
  Gift,
  Headphones,
  Settings,
  Calendar,
  Activity
} from 'lucide-react';
import '@/styles/v3/modern-theme.css';

// Animation config
const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring' as const, stiffness: 400, damping: 30 }
  }
};

interface WalletData {
  id: string;
  balance: number;
  wallet_number: string;
  currency: string;
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
  walletBalance: number;
}

export const V3CustomerOverview: React.FC = () => {
  const { language } = useLanguage();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const isAr = language === 'ar';

  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [recentOrders, setRecentOrders] = React.useState<OrderData[]>([]);
  const [recentTransactions, setRecentTransactions] = React.useState<TransactionData[]>([]);
  const [stats, setStats] = React.useState<DashboardStats>({
    activeOrders: 0,
    activeContracts: 0,
    totalServices: 0,
    pendingInvoices: 0,
    walletBalance: 0,
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [walletRes, ordersRes, contractsRes, servicesRes, invoicesRes, transactionsRes] = await Promise.all([
          supabase.from('customer_wallets').select('id, balance, wallet_number, currency').eq('customer_user_id', user.id).maybeSingle(),
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
          walletBalance: walletRes.data?.balance || 0,
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
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
    if (diffMins < 60) return isAr ? `${diffMins} د` : `${diffMins}m`;
    if (diffHours < 24) return isAr ? `${diffHours} س` : `${diffHours}h`;
    if (diffDays < 7) return isAr ? `${diffDays} ي` : `${diffDays}d`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return isAr ? 'صباح الخير' : 'Good Morning';
    if (hour < 18) return isAr ? 'مساء الخير' : 'Good Afternoon';
    return isAr ? 'مساء الخير' : 'Good Evening';
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; labelEn: string; color: string; bg: string }> = {
      pending: { label: 'قيد الانتظار', labelEn: 'Pending', color: 'var(--modern-warning)', bg: 'var(--modern-warning)' },
      processing: { label: 'قيد المعالجة', labelEn: 'Processing', color: 'var(--modern-info)', bg: 'var(--modern-info)' },
      in_progress: { label: 'قيد التنفيذ', labelEn: 'In Progress', color: 'var(--modern-brand-primary)', bg: 'var(--modern-brand-primary)' },
      completed: { label: 'مكتمل', labelEn: 'Completed', color: 'var(--modern-success)', bg: 'var(--modern-success)' },
      cancelled: { label: 'ملغي', labelEn: 'Cancelled', color: 'var(--modern-error)', bg: 'var(--modern-error)' },
    };
    return configs[status] || { label: status, labelEn: status, color: 'var(--modern-text-muted)', bg: 'var(--modern-bg-elevated)' };
  };

  // Quick Actions - 6 items for balanced grid
  const quickActions = [
    { id: 'new-order', label: 'طلب جديد', labelEn: 'New Order', icon: Plus, path: '/portal/services', color: 'var(--modern-brand-primary)' },
    { id: 'my-orders', label: 'طلباتي', labelEn: 'My Orders', icon: ShoppingCart, path: '/portal/orders', color: 'var(--modern-info)' },
    { id: 'invoices', label: 'الفواتير', labelEn: 'Invoices', icon: Receipt, path: '/portal/invoices', color: 'var(--modern-success)' },
    { id: 'contracts', label: 'العقود', labelEn: 'Contracts', icon: FileSignature, path: '/portal/contracts', color: 'var(--modern-warning)' },
    { id: 'referrals', label: 'الإحالات', labelEn: 'Referrals', icon: Gift, path: '/portal/referrals', color: 'var(--modern-error)' },
    { id: 'support', label: 'الدعم', labelEn: 'Support', icon: Headphones, path: '/portal/support', color: 'var(--modern-text-secondary)' },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="enterprise-dash">
        <div className="enterprise-dash__loading">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Activity size={32} />
          </motion.div>
          <span>{isAr ? 'جاري تحميل لوحة التحكم...' : 'Loading dashboard...'}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="enterprise-dash"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: WELCOME HEADER
          ═══════════════════════════════════════════════════════════ */}
      <motion.header className="enterprise-welcome" variants={fadeUp}>
        <div className="enterprise-welcome__content">
          <div className="enterprise-welcome__text">
            <span className="enterprise-welcome__greeting">
              {getGreeting()} 👋
            </span>
            <h1 className="enterprise-welcome__name">
              {profile?.full_name || (isAr ? 'عميلنا العزيز' : 'Dear Customer')}
            </h1>
            <p className="enterprise-welcome__subtitle">
              {isAr ? 'إليك ملخص حسابك اليوم' : "Here's your account summary for today"}
            </p>
          </div>
          <div className="enterprise-welcome__meta">
            <div className="enterprise-welcome__date">
              <Calendar size={14} />
              <span>
                {currentTime.toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: KPI CARDS ROW
          ═══════════════════════════════════════════════════════════ */}
      <motion.div className="enterprise-kpis" variants={fadeUp}>
        <motion.div 
          className="enterprise-kpi"
          whileHover={{ y: -2 }}
          onClick={() => navigate('/portal/orders')}
        >
          <div className="enterprise-kpi__icon enterprise-kpi__icon--blue">
            <ShoppingCart size={20} />
          </div>
          <div className="enterprise-kpi__data">
            <span className="enterprise-kpi__value">{stats.activeOrders}</span>
            <span className="enterprise-kpi__label">{isAr ? 'طلبات نشطة' : 'Active Orders'}</span>
          </div>
          {stats.activeOrders > 0 && <div className="enterprise-kpi__pulse enterprise-kpi__pulse--blue" />}
        </motion.div>

        <motion.div 
          className="enterprise-kpi"
          whileHover={{ y: -2 }}
          onClick={() => navigate('/portal/contracts')}
        >
          <div className="enterprise-kpi__icon enterprise-kpi__icon--green">
            <FileSignature size={20} />
          </div>
          <div className="enterprise-kpi__data">
            <span className="enterprise-kpi__value">{stats.activeContracts}</span>
            <span className="enterprise-kpi__label">{isAr ? 'عقود سارية' : 'Active Contracts'}</span>
          </div>
        </motion.div>

        <motion.div 
          className="enterprise-kpi"
          whileHover={{ y: -2 }}
          onClick={() => navigate('/portal/invoices')}
        >
          <div className="enterprise-kpi__icon enterprise-kpi__icon--orange">
            <Receipt size={20} />
          </div>
          <div className="enterprise-kpi__data">
            <span className="enterprise-kpi__value">{stats.pendingInvoices}</span>
            <span className="enterprise-kpi__label">{isAr ? 'فواتير معلقة' : 'Pending Invoices'}</span>
          </div>
          {stats.pendingInvoices > 0 && <div className="enterprise-kpi__pulse enterprise-kpi__pulse--orange" />}
        </motion.div>

        <motion.div 
          className="enterprise-kpi"
          whileHover={{ y: -2 }}
          onClick={() => navigate('/portal/services')}
        >
          <div className="enterprise-kpi__icon enterprise-kpi__icon--purple">
            <Briefcase size={20} />
          </div>
          <div className="enterprise-kpi__data">
            <span className="enterprise-kpi__value">{stats.totalServices}</span>
            <span className="enterprise-kpi__label">{isAr ? 'خدمات متاحة' : 'Services'}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: WALLET CARD (HERO)
          ═══════════════════════════════════════════════════════════ */}
      <motion.div className="enterprise-wallet-section" variants={fadeUp}>
        <motion.div 
          className="enterprise-wallet"
          whileHover={{ scale: 1.005 }}
          onClick={() => navigate('/portal/wallet')}
        >
          {/* Background Art */}
          <div className="enterprise-wallet__bg">
            <div className="enterprise-wallet__orb enterprise-wallet__orb--1" />
            <div className="enterprise-wallet__orb enterprise-wallet__orb--2" />
            <div className="enterprise-wallet__grid" />
          </div>

          {/* Content */}
          <div className="enterprise-wallet__content">
            <div className="enterprise-wallet__header">
              <div className="enterprise-wallet__label">
                <CreditCard size={18} />
                <span>{isAr ? 'المحفظة الرقمية' : 'Digital Wallet'}</span>
              </div>
              <div className="enterprise-wallet__chip" />
            </div>

            <div className="enterprise-wallet__balance">
              <span className="enterprise-wallet__balance-label">
                {isAr ? 'الرصيد المتاح' : 'Available Balance'}
              </span>
              <div className="enterprise-wallet__balance-row">
                <span className="enterprise-wallet__balance-value" dir="ltr">
                  {formatCurrency(wallet?.balance || 0)}
                </span>
                <span className="enterprise-wallet__balance-currency">SAR</span>
              </div>
            </div>

            <div className="enterprise-wallet__footer">
              <div className="enterprise-wallet__number" dir="ltr">
                {formatWalletNumber(wallet?.wallet_number)}
              </div>
              <div className="enterprise-wallet__brand" dir="ltr">
                ASH WALLET
              </div>
            </div>
          </div>
        </motion.div>

        {/* Wallet Quick Actions */}
        <div className="enterprise-wallet-actions">
          <motion.button 
            className="enterprise-wallet-action"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/portal/wallet')}
          >
            <ArrowDownLeft size={20} />
            <span>{isAr ? 'إيداع' : 'Deposit'}</span>
          </motion.button>
          <motion.button 
            className="enterprise-wallet-action"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/portal/wallet')}
          >
            <ArrowUpRight size={20} />
            <span>{isAr ? 'تحويل' : 'Transfer'}</span>
          </motion.button>
          <motion.button 
            className="enterprise-wallet-action"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/portal/wallet')}
          >
            <TrendingUp size={20} />
            <span>{isAr ? 'السجل' : 'History'}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: QUICK ACTIONS GRID
          ═══════════════════════════════════════════════════════════ */}
      <motion.section className="enterprise-actions" variants={fadeUp}>
        <div className="enterprise-section-header">
          <h2 className="enterprise-section-title">
            <Sparkles size={18} />
            {isAr ? 'الوصول السريع' : 'Quick Access'}
          </h2>
        </div>
        <div className="enterprise-actions__grid">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                className="enterprise-action"
                onClick={() => navigate(action.path)}
                whileHover={{ y: -3, boxShadow: '0 8px 24px -8px rgba(0,0,0,0.15)' }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div 
                  className="enterprise-action__icon"
                  style={{ 
                    background: `hsl(${action.color} / 0.1)`, 
                    color: `hsl(${action.color})` 
                  }}
                >
                  <Icon size={24} />
                </div>
                <span className="enterprise-action__label">
                  {isAr ? action.label : action.labelEn}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5: RECENT ACTIVITY (2-COLUMN GRID)
          ═══════════════════════════════════════════════════════════ */}
      <div className="enterprise-recent">
        {/* Recent Orders */}
        <motion.section className="enterprise-card" variants={fadeUp}>
          <div className="enterprise-card__header">
            <h3 className="enterprise-card__title">
              <ShoppingCart size={18} />
              {isAr ? 'آخر الطلبات' : 'Recent Orders'}
            </h3>
            <button 
              className="enterprise-card__link"
              onClick={() => navigate('/portal/orders')}
            >
              {isAr ? 'عرض الكل' : 'View All'}
              <ChevronLeft size={16} />
            </button>
          </div>
          <div className="enterprise-card__body">
            {recentOrders.length === 0 ? (
              <div className="enterprise-empty">
                <ShoppingCart size={36} strokeWidth={1.5} />
                <p>{isAr ? 'لا توجد طلبات حتى الآن' : 'No orders yet'}</p>
                <button 
                  className="enterprise-empty__btn"
                  onClick={() => navigate('/portal/services')}
                >
                  <Plus size={16} />
                  {isAr ? 'اطلب خدمة' : 'Request Service'}
                </button>
              </div>
            ) : (
              <div className="enterprise-orders">
                {recentOrders.slice(0, 4).map((order, i) => {
                  const status = getStatusConfig(order.status);
                  return (
                    <motion.div 
                      key={order.id} 
                      className="enterprise-order"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="enterprise-order__info">
                        <span className="enterprise-order__title">
                          {order.title || (isAr ? 'طلب خدمة' : 'Service Order')}
                        </span>
                        <span className="enterprise-order__id" dir="ltr">
                          #{order.order_number}
                        </span>
                      </div>
                      <div className="enterprise-order__meta">
                        <span 
                          className="enterprise-order__status"
                          style={{ 
                            background: `hsl(${status.bg} / 0.12)`, 
                            color: `hsl(${status.color})` 
                          }}
                        >
                          {isAr ? status.label : status.labelEn}
                        </span>
                        <span className="enterprise-order__time">
                          {formatDate(order.created_at)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.section>

        {/* Recent Transactions */}
        <motion.section className="enterprise-card" variants={fadeUp}>
          <div className="enterprise-card__header">
            <h3 className="enterprise-card__title">
              <Activity size={18} />
              {isAr ? 'آخر المعاملات' : 'Recent Transactions'}
            </h3>
            <button 
              className="enterprise-card__link"
              onClick={() => navigate('/portal/wallet')}
            >
              {isAr ? 'عرض الكل' : 'View All'}
              <ChevronLeft size={16} />
            </button>
          </div>
          <div className="enterprise-card__body">
            {recentTransactions.length === 0 ? (
              <div className="enterprise-empty">
                <Wallet size={36} strokeWidth={1.5} />
                <p>{isAr ? 'لا توجد معاملات مالية' : 'No transactions yet'}</p>
              </div>
            ) : (
              <div className="enterprise-transactions">
                {recentTransactions.map((tx, i) => {
                  const isCredit = ['topup', 'deposit', 'refund'].includes(tx.transaction_type);
                  return (
                    <motion.div 
                      key={tx.id} 
                      className="enterprise-tx"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div 
                        className="enterprise-tx__icon"
                        style={{ 
                          background: isCredit ? 'hsl(var(--modern-success) / 0.1)' : 'hsl(var(--modern-error) / 0.1)',
                          color: isCredit ? 'hsl(var(--modern-success))' : 'hsl(var(--modern-error))'
                        }}
                      >
                        {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                      </div>
                      <div className="enterprise-tx__info">
                        <span className="enterprise-tx__desc">
                          {isAr ? (tx.description_ar || tx.description || tx.transaction_type) : (tx.description || tx.transaction_type)}
                        </span>
                        <span className="enterprise-tx__time">
                          {formatDate(tx.created_at)}
                        </span>
                      </div>
                      <div 
                        className="enterprise-tx__amount"
                        style={{ color: isCredit ? 'hsl(var(--modern-success))' : 'hsl(var(--modern-text-primary))' }}
                        dir="ltr"
                      >
                        {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                        <span className="enterprise-tx__currency">SAR</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.section>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 6: FOOTER QUICK LINKS
          ═══════════════════════════════════════════════════════════ */}
      <motion.footer className="enterprise-footer" variants={fadeUp}>
        <button 
          className="enterprise-footer__link"
          onClick={() => navigate('/portal/profile')}
        >
          <Settings size={16} />
          {isAr ? 'إعدادات الحساب' : 'Account Settings'}
        </button>
        <button 
          className="enterprise-footer__link"
          onClick={() => navigate('/portal/support')}
        >
          <Headphones size={16} />
          {isAr ? 'مركز الدعم' : 'Support Center'}
        </button>
        <button 
          className="enterprise-footer__link"
          onClick={() => navigate('/portal/notifications')}
        >
          <Bell size={16} />
          {isAr ? 'الإشعارات' : 'Notifications'}
        </button>
      </motion.footer>
    </motion.div>
  );
};

V3CustomerOverview.displayName = 'V3CustomerOverview';
