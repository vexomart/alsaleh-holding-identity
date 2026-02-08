/**
 * V3 Customer Portal Overview
 * Enterprise SaaS Dashboard - Full Width Premium Design
 * Smart Space Utilization with Balanced Layout
 */

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  ShoppingCart, 
  FileSignature, 
  Briefcase,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Sparkles,
  CreditCard,
  Bell,
  ChevronLeft,
  Plus,
  Receipt,
  Gift,
  Headphones,
  Calendar,
  Activity,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BarChart3,
  User,
  Shield,
  MessageSquare
} from 'lucide-react';
import '@/styles/v3/modern-theme.css';
import './CustomerOverview.css';

// Animation config
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.08 }
  }
};

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring' as const, stiffness: 400, damping: 28 }
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
    if (diffMins < 60) return isAr ? `منذ ${diffMins} د` : `${diffMins}m ago`;
    if (diffHours < 24) return isAr ? `منذ ${diffHours} س` : `${diffHours}h ago`;
    if (diffDays < 7) return isAr ? `منذ ${diffDays} ي` : `${diffDays}d ago`;
    
    return date.toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return isAr ? 'صباح الخير' : 'Good Morning';
    if (hour < 18) return isAr ? 'مساء الخير' : 'Good Afternoon';
    return isAr ? 'مساء الخير' : 'Good Evening';
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; labelEn: string; variant: string }> = {
      pending: { label: 'قيد الانتظار', labelEn: 'Pending', variant: 'warning' },
      processing: { label: 'قيد المعالجة', labelEn: 'Processing', variant: 'info' },
      in_progress: { label: 'قيد التنفيذ', labelEn: 'In Progress', variant: 'primary' },
      completed: { label: 'مكتمل', labelEn: 'Completed', variant: 'success' },
      cancelled: { label: 'ملغي', labelEn: 'Cancelled', variant: 'error' },
    };
    return configs[status] || { label: status, labelEn: status, variant: 'muted' };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="co-loading">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 size={32} />
        </motion.div>
        <span>{isAr ? 'جاري تحميل البيانات...' : 'Loading data...'}</span>
      </div>
    );
  }

  return (
    <motion.div 
      className="co-dashboard"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {/* ═══════════════════════════════════════════════════════════
          ROW 1: WELCOME HEADER (FULL WIDTH)
          ═══════════════════════════════════════════════════════════ */}
      <motion.header className="co-hero" variants={item}>
        <div className="co-hero__main">
          <p className="co-hero__greeting">{getGreeting()} 👋</p>
          <h1 className="co-hero__name">
            {profile?.full_name || (isAr ? 'عميلنا العزيز' : 'Dear Customer')}
          </h1>
          <p className="co-hero__subtitle">
            {isAr ? 'إليك ملخص حسابك اليوم' : "Here's your account summary for today"}
          </p>
        </div>
        <div className="co-hero__meta">
          <div className="co-hero__date">
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
      </motion.header>

      {/* ═══════════════════════════════════════════════════════════
          ROW 2: KPI CARDS (4-COLUMN FULL WIDTH)
          ═══════════════════════════════════════════════════════════ */}
      <motion.div className="co-kpi-row" variants={item}>
        <motion.div 
          className="co-kpi co-kpi--blue"
          whileHover={{ y: -3, boxShadow: '0 12px 28px -8px rgba(59, 130, 246, 0.25)' }}
          onClick={() => navigate('/portal/orders')}
        >
          <div className="co-kpi__icon">
            <ShoppingCart size={22} />
          </div>
          <div className="co-kpi__content">
            <span className="co-kpi__value">{stats.activeOrders}</span>
            <span className="co-kpi__label">{isAr ? 'طلبات نشطة' : 'Active Orders'}</span>
          </div>
          {stats.activeOrders > 0 && <span className="co-kpi__dot co-kpi__dot--blue" />}
        </motion.div>

        <motion.div 
          className="co-kpi co-kpi--green"
          whileHover={{ y: -3, boxShadow: '0 12px 28px -8px rgba(34, 197, 94, 0.25)' }}
          onClick={() => navigate('/portal/contracts')}
        >
          <div className="co-kpi__icon">
            <FileSignature size={22} />
          </div>
          <div className="co-kpi__content">
            <span className="co-kpi__value">{stats.activeContracts}</span>
            <span className="co-kpi__label">{isAr ? 'عقود سارية' : 'Contracts'}</span>
          </div>
        </motion.div>

        <motion.div 
          className="co-kpi co-kpi--orange"
          whileHover={{ y: -3, boxShadow: '0 12px 28px -8px rgba(249, 115, 22, 0.25)' }}
          onClick={() => navigate('/portal/invoices')}
        >
          <div className="co-kpi__icon">
            <Receipt size={22} />
          </div>
          <div className="co-kpi__content">
            <span className="co-kpi__value">{stats.pendingInvoices}</span>
            <span className="co-kpi__label">{isAr ? 'فواتير معلقة' : 'Invoices'}</span>
          </div>
          {stats.pendingInvoices > 0 && <span className="co-kpi__dot co-kpi__dot--orange" />}
        </motion.div>

        <motion.div 
          className="co-kpi co-kpi--purple"
          whileHover={{ y: -3, boxShadow: '0 12px 28px -8px rgba(168, 85, 247, 0.25)' }}
          onClick={() => navigate('/portal/services')}
        >
          <div className="co-kpi__icon">
            <Briefcase size={22} />
          </div>
          <div className="co-kpi__content">
            <span className="co-kpi__value">{stats.totalServices}</span>
            <span className="co-kpi__label">{isAr ? 'خدمات متاحة' : 'Services'}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════
          ROW 3: WALLET + QUICK ACTIONS (2-COLUMN)
          ═══════════════════════════════════════════════════════════ */}
      <div className="co-main-grid">
        {/* Column 1: Wallet Card */}
        <motion.div className="co-wallet-card" variants={item}>
          <div className="co-wallet-card__header">
            <div className="co-wallet-card__title">
              <CreditCard size={20} />
              <span>{isAr ? 'المحفظة الرقمية' : 'Digital Wallet'}</span>
            </div>
            <button 
              className="co-wallet-card__btn"
              onClick={() => navigate('/portal/wallet')}
            >
              {isAr ? 'عرض التفاصيل' : 'View Details'}
              <ExternalLink size={14} />
            </button>
          </div>

          <div className="co-wallet-card__body">
            <div className="co-wallet-card__visual" onClick={() => navigate('/portal/wallet')}>
              <div className="co-wallet-card__visual-bg" />
              <div className="co-wallet-card__visual-content">
                <div className="co-wallet-card__label">{isAr ? 'الرصيد المتاح' : 'Available Balance'}</div>
                <div className="co-wallet-card__balance" dir="ltr">
                  <span className="co-wallet-card__amount">{formatCurrency(wallet?.balance || 0)}</span>
                  <span className="co-wallet-card__currency">SAR</span>
                </div>
                <div className="co-wallet-card__number" dir="ltr">
                  {formatWalletNumber(wallet?.wallet_number)}
                </div>
                <div className="co-wallet-card__brand" dir="ltr">ASH WALLET</div>
              </div>
            </div>

            <div className="co-wallet-card__actions">
              <button 
                className="co-wallet-action"
                onClick={() => navigate('/portal/wallet')}
              >
                <ArrowDownLeft size={18} />
                <span>{isAr ? 'إيداع' : 'Deposit'}</span>
              </button>
              <button 
                className="co-wallet-action"
                onClick={() => navigate('/portal/wallet')}
              >
                <ArrowUpRight size={18} />
                <span>{isAr ? 'تحويل' : 'Transfer'}</span>
              </button>
              <button 
                className="co-wallet-action"
                onClick={() => navigate('/portal/wallet')}
              >
                <TrendingUp size={18} />
                <span>{isAr ? 'السجل' : 'History'}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Column 2: Quick Access */}
        <motion.div className="co-quick-access" variants={item}>
          <div className="co-section-header">
            <h2 className="co-section-title">
              <Sparkles size={18} />
              {isAr ? 'الوصول السريع' : 'Quick Access'}
            </h2>
          </div>
          <div className="co-quick-grid">
            <motion.button
              className="co-quick-item co-quick-item--primary"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/portal/services')}
            >
              <div className="co-quick-item__icon">
                <Plus size={22} />
              </div>
              <span className="co-quick-item__label">{isAr ? 'طلب جديد' : 'New Order'}</span>
            </motion.button>
            <motion.button
              className="co-quick-item"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/portal/orders')}
            >
              <div className="co-quick-item__icon co-quick-item__icon--blue">
                <ShoppingCart size={20} />
              </div>
              <span className="co-quick-item__label">{isAr ? 'طلباتي' : 'My Orders'}</span>
            </motion.button>
            <motion.button
              className="co-quick-item"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/portal/invoices')}
            >
              <div className="co-quick-item__icon co-quick-item__icon--green">
                <Receipt size={20} />
              </div>
              <span className="co-quick-item__label">{isAr ? 'الفواتير' : 'Invoices'}</span>
            </motion.button>
            <motion.button
              className="co-quick-item"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/portal/contracts')}
            >
              <div className="co-quick-item__icon co-quick-item__icon--orange">
                <FileSignature size={20} />
              </div>
              <span className="co-quick-item__label">{isAr ? 'العقود' : 'Contracts'}</span>
            </motion.button>
            <motion.button
              className="co-quick-item"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/portal/referrals')}
            >
              <div className="co-quick-item__icon co-quick-item__icon--pink">
                <Gift size={20} />
              </div>
              <span className="co-quick-item__label">{isAr ? 'الإحالات' : 'Referrals'}</span>
            </motion.button>
            <motion.button
              className="co-quick-item"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/portal/support')}
            >
              <div className="co-quick-item__icon co-quick-item__icon--teal">
                <Headphones size={20} />
              </div>
              <span className="co-quick-item__label">{isAr ? 'الدعم' : 'Support'}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          ROW 4: RECENT ACTIVITY (2-COLUMN)
          ═══════════════════════════════════════════════════════════ */}
      <div className="co-activity-grid">
        {/* Recent Orders */}
        <motion.section className="co-card" variants={item}>
          <div className="co-card__header">
            <h3 className="co-card__title">
              <ShoppingCart size={18} />
              {isAr ? 'آخر الطلبات' : 'Recent Orders'}
            </h3>
            <button 
              className="co-card__link"
              onClick={() => navigate('/portal/orders')}
            >
              {isAr ? 'عرض الكل' : 'View All'}
              <ChevronLeft size={16} />
            </button>
          </div>
          <div className="co-card__body">
            {recentOrders.length === 0 ? (
              <div className="co-empty">
                <ShoppingCart size={40} strokeWidth={1.5} />
                <p>{isAr ? 'لا توجد طلبات حتى الآن' : 'No orders yet'}</p>
                <button 
                  className="co-empty__btn"
                  onClick={() => navigate('/portal/services')}
                >
                  <Plus size={16} />
                  {isAr ? 'اطلب خدمة' : 'Request Service'}
                </button>
              </div>
            ) : (
              <div className="co-orders-list">
                {recentOrders.slice(0, 4).map((order, i) => {
                  const status = getStatusConfig(order.status);
                  return (
                    <motion.div 
                      key={order.id} 
                      className="co-order-item"
                      initial={{ opacity: 0, x: isAr ? 12 : -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="co-order-item__main">
                        <span className="co-order-item__title">
                          {order.title || (isAr ? 'طلب خدمة' : 'Service Order')}
                        </span>
                        <span className={`co-order-item__status co-order-item__status--${status.variant}`}>
                          {isAr ? status.label : status.labelEn}
                        </span>
                      </div>
                      <div className="co-order-item__meta">
                        <span className="co-order-item__id" dir="ltr">#{order.order_number}</span>
                        <span className="co-order-item__time">{formatDate(order.created_at)}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.section>

        {/* Recent Transactions */}
        <motion.section className="co-card" variants={item}>
          <div className="co-card__header">
            <h3 className="co-card__title">
              <Activity size={18} />
              {isAr ? 'آخر المعاملات' : 'Recent Transactions'}
            </h3>
            <button 
              className="co-card__link"
              onClick={() => navigate('/portal/wallet')}
            >
              {isAr ? 'عرض الكل' : 'View All'}
              <ChevronLeft size={16} />
            </button>
          </div>
          <div className="co-card__body">
            {recentTransactions.length === 0 ? (
              <div className="co-empty">
                <Wallet size={40} strokeWidth={1.5} />
                <p>{isAr ? 'لا توجد معاملات مالية' : 'No transactions yet'}</p>
              </div>
            ) : (
              <div className="co-tx-list">
                {recentTransactions.slice(0, 4).map((tx, i) => {
                  const isCredit = ['topup', 'deposit', 'refund'].includes(tx.transaction_type);
                  return (
                    <motion.div 
                      key={tx.id} 
                      className="co-tx-item"
                      initial={{ opacity: 0, x: isAr ? 12 : -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className={`co-tx-item__icon ${isCredit ? 'co-tx-item__icon--in' : 'co-tx-item__icon--out'}`}>
                        {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                      </div>
                      <div className="co-tx-item__info">
                        <span className="co-tx-item__desc">
                          {isAr ? (tx.description_ar || tx.description || tx.transaction_type) : (tx.description || tx.transaction_type)}
                        </span>
                        <span className="co-tx-item__time">{formatDate(tx.created_at)}</span>
                      </div>
                      <div className={`co-tx-item__amount ${isCredit ? 'co-tx-item__amount--in' : ''}`} dir="ltr">
                        {isCredit ? '+' : '-'}{formatCurrency(tx.amount)} <small>SAR</small>
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
          ROW 5: ACCOUNT SHORTCUTS (FULL WIDTH)
          ═══════════════════════════════════════════════════════════ */}
      <motion.div className="co-shortcuts" variants={item}>
        <motion.button 
          className="co-shortcut"
          whileHover={{ y: -2 }}
          onClick={() => navigate('/portal/profile')}
        >
          <User size={18} />
          <span>{isAr ? 'الملف الشخصي' : 'My Profile'}</span>
        </motion.button>
        <motion.button 
          className="co-shortcut"
          whileHover={{ y: -2 }}
          onClick={() => navigate('/portal/security')}
        >
          <Shield size={18} />
          <span>{isAr ? 'الأمان' : 'Security'}</span>
        </motion.button>
        <motion.button 
          className="co-shortcut"
          whileHover={{ y: -2 }}
          onClick={() => navigate('/portal/notifications')}
        >
          <Bell size={18} />
          <span>{isAr ? 'الإشعارات' : 'Notifications'}</span>
        </motion.button>
        <motion.button 
          className="co-shortcut"
          whileHover={{ y: -2 }}
          onClick={() => navigate('/portal/support')}
        >
          <MessageSquare size={18} />
          <span>{isAr ? 'تواصل معنا' : 'Contact Us'}</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

V3CustomerOverview.displayName = 'V3CustomerOverview';
