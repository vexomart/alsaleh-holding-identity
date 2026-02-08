/**
 * V3 Customer Portal Overview
 * Premium Animated Dashboard
 * RTL-First with Smart Responsive Design
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
  Loader2,
  User,
  Shield,
  MessageSquare,
  Zap,
  Star
} from 'lucide-react';
import '@/styles/v3/modern-theme.css';

// ═══════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
    }
  }
};

const cardVariants = {
  hidden: {
    opacity: 0, 
    y: 24,
    scale: 0.96
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      type: 'spring' as const,
      stiffness: 300,
      damping: 24,
      mass: 0.8
    }
  }
};

const kpiVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      type: 'spring' as const,
      stiffness: 400,
      damping: 25
    }
  })
};

const listItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.06,
      type: 'spring' as const,
      stiffness: 350,
      damping: 25
    }
  })
};

const quickActionVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.05,
      type: 'spring' as const,
      stiffness: 400,
      damping: 20
    }
  })
};

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

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
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

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
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  // Helpers
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

  const getStatusStyle = (status: string) => {
    const styles: Record<string, { bg: string; color: string; label: string; labelEn: string }> = {
      pending: { bg: 'rgba(245, 158, 11, 0.12)', color: '#d97706', label: 'قيد الانتظار', labelEn: 'Pending' },
      processing: { bg: 'rgba(59, 130, 246, 0.12)', color: '#2563eb', label: 'قيد المعالجة', labelEn: 'Processing' },
      in_progress: { bg: 'rgba(99, 102, 241, 0.12)', color: '#4f46e5', label: 'قيد التنفيذ', labelEn: 'In Progress' },
      completed: { bg: 'rgba(34, 197, 94, 0.12)', color: '#16a34a', label: 'مكتمل', labelEn: 'Completed' },
      cancelled: { bg: 'rgba(239, 68, 68, 0.12)', color: '#dc2626', label: 'ملغي', labelEn: 'Cancelled' },
    };
    return styles[status] || { bg: 'rgba(107, 114, 128, 0.12)', color: '#6b7280', label: status, labelEn: status };
  };

  // KPIs data
  const kpis = [
    { id: 'orders', value: stats.activeOrders, label: isAr ? 'طلبات نشطة' : 'Active Orders', icon: ShoppingCart, color: '#3b82f6', path: '/portal/orders', hasNotification: stats.activeOrders > 0 },
    { id: 'contracts', value: stats.activeContracts, label: isAr ? 'عقود سارية' : 'Active Contracts', icon: FileSignature, color: '#22c55e', path: '/portal/contracts', hasNotification: false },
    { id: 'invoices', value: stats.pendingInvoices, label: isAr ? 'فواتير معلقة' : 'Pending Invoices', icon: Receipt, color: '#f97316', path: '/portal/invoices', hasNotification: stats.pendingInvoices > 0 },
    { id: 'services', value: stats.totalServices, label: isAr ? 'خدمات متاحة' : 'Available Services', icon: Briefcase, color: '#a855f7', path: '/portal/services', hasNotification: false },
  ];

  // Quick actions
  const quickActions = [
    { id: 'new', label: isAr ? 'طلب جديد' : 'New Order', icon: Plus, path: '/portal/services', primary: true },
    { id: 'orders', label: isAr ? 'طلباتي' : 'My Orders', icon: ShoppingCart, path: '/portal/orders', color: '#3b82f6' },
    { id: 'invoices', label: isAr ? 'الفواتير' : 'Invoices', icon: Receipt, path: '/portal/invoices', color: '#22c55e' },
    { id: 'contracts', label: isAr ? 'العقود' : 'Contracts', icon: FileSignature, path: '/portal/contracts', color: '#f97316' },
    { id: 'referrals', label: isAr ? 'الإحالات' : 'Referrals', icon: Gift, path: '/portal/referrals', color: '#ec4899' },
    { id: 'support', label: isAr ? 'الدعم' : 'Support', icon: Headphones, path: '/portal/support', color: '#06b6d4' },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        minHeight: '50vh',
        color: 'hsl(var(--modern-text-muted))'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 size={36} style={{ color: 'hsl(var(--modern-brand-primary))' }} />
        </motion.div>
        <span>{isAr ? 'جاري تحميل البيانات...' : 'Loading dashboard...'}</span>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(1.25rem, 3vw, 1.75rem)',
        padding: 'clamp(1rem, 3vw, 1.5rem)',
        maxWidth: '100%',
        minHeight: '100%'
      }}
    >
      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════════ */}
      <motion.header
        variants={cardVariants}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: 'clamp(1.25rem, 3vw, 1.75rem)',
          background: 'linear-gradient(135deg, hsl(var(--modern-brand-primary) / 0.05) 0%, hsl(var(--modern-bg-card)) 100%)',
          border: '1px solid hsl(var(--modern-border-light))',
          borderRadius: '1.25rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: isAr ? 'auto' : '-20%',
          left: isAr ? '-20%' : 'auto',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, hsl(var(--modern-brand-primary) / 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              color: 'hsl(var(--modern-brand-primary))',
              fontWeight: 600,
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {getGreeting()} 
            <motion.span
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
            >
              👋
            </motion.span>
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 700,
              color: 'hsl(var(--modern-text-primary))',
              margin: '0.25rem 0 0.5rem'
            }}
          >
            {profile?.full_name || (isAr ? 'عميلنا العزيز' : 'Dear Customer')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
              color: 'hsl(var(--modern-text-muted))',
              margin: 0
            }}
          >
            {isAr ? 'إليك ملخص حسابك اليوم' : "Here's your account summary for today"}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.875rem',
            background: 'hsl(var(--modern-bg-elevated))',
            borderRadius: '0.75rem',
            fontSize: '0.85rem',
            color: 'hsl(var(--modern-text-secondary))'
          }}
        >
          <Calendar size={14} />
          <span>
            {currentTime.toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </span>
        </motion.div>
      </motion.header>

      {/* ═══════════════════════════════════════════════════════════
          KPI CARDS
          ═══════════════════════════════════════════════════════════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
        gap: 'clamp(0.75rem, 2vw, 1rem)'
      }}>
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.id}
              custom={i}
              variants={kpiVariants}
              whileHover={{ 
                y: -4, 
                boxShadow: `0 12px 28px -8px ${kpi.color}33`,
                borderColor: `${kpi.color}40`
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(kpi.path)}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: 'clamp(1rem, 3vw, 1.25rem)',
                background: 'hsl(var(--modern-bg-card))',
                border: '1px solid hsl(var(--modern-border-light))',
                borderRadius: '1rem',
                cursor: 'pointer',
                transition: 'border-color 0.3s, box-shadow 0.3s'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'clamp(44px, 10vw, 52px)',
                height: 'clamp(44px, 10vw, 52px)',
                borderRadius: '0.875rem',
                background: `${kpi.color}14`,
                color: kpi.color,
                flexShrink: 0
              }}>
                <Icon size={22} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
                  fontWeight: 700,
                  color: 'hsl(var(--modern-text-primary))',
                  lineHeight: 1.1
                }}>
                  {kpi.value}
                </div>
                <div style={{
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  color: 'hsl(var(--modern-text-muted))',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {kpi.label}
                </div>
              </div>
              {kpi.hasNotification && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, delay: 0.5 + i * 0.1 }}
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    insetInlineEnd: '0.75rem',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: kpi.color,
                    boxShadow: `0 0 0 3px ${kpi.color}30`
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          WALLET + QUICK ACTIONS (2-Column)
          ═══════════════════════════════════════════════════════════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
        gap: 'clamp(1rem, 3vw, 1.5rem)'
      }}>
        {/* Wallet Card */}
        <motion.div
          variants={cardVariants}
          style={{
            background: 'hsl(var(--modern-bg-card))',
            border: '1px solid hsl(var(--modern-border-light))',
            borderRadius: '1.25rem',
            overflow: 'hidden'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid hsl(var(--modern-border-light))'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'hsl(var(--modern-text-primary))'
            }}>
              <CreditCard size={18} />
              <span>{isAr ? 'المحفظة الرقمية' : 'Digital Wallet'}</span>
            </div>
            <motion.button
              whileHover={{ x: isAr ? 4 : -4 }}
              onClick={() => navigate('/portal/wallet')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.85rem',
                color: 'hsl(var(--modern-brand-primary))',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              {isAr ? 'التفاصيل' : 'Details'}
              <ExternalLink size={14} />
            </motion.button>
          </div>

          {/* Credit Card Visual */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/portal/wallet')}
            style={{
              margin: '1.25rem',
              padding: '1.5rem',
              borderRadius: '1rem',
              background: 'linear-gradient(135deg, hsl(var(--modern-brand-primary)) 0%, hsl(250 70% 55%) 100%)',
              color: 'white',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '140px'
            }}
          >
            {/* Card decorations */}
            <div style={{
              position: 'absolute',
              top: '-30%',
              right: '-10%',
              width: '200px',
              height: '200px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-40%',
              left: '-10%',
              width: '180px',
              height: '180px',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '50%'
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '0.75rem', opacity: 0.85, marginBottom: '0.25rem' }}>
                {isAr ? 'الرصيد المتاح' : 'Available Balance'}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1.5rem' }} dir="ltr">
                <span style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 700 }}>
                  {formatCurrency(wallet?.balance || 0)}
                </span>
                <span style={{ fontSize: '1rem', opacity: 0.9 }}>SAR</span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', letterSpacing: '0.15em', opacity: 0.9 }} dir="ltr">
                {formatWalletNumber(wallet?.wallet_number)}
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', opacity: 0.7, marginTop: '0.5rem' }} dir="ltr">
                ASH WALLET
              </div>
            </div>
          </motion.div>

          {/* Wallet Actions */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem',
            padding: '0 1.25rem 1.25rem'
          }}>
            {[
              { icon: ArrowDownLeft, label: isAr ? 'إيداع' : 'Deposit' },
              { icon: ArrowUpRight, label: isAr ? 'تحويل' : 'Transfer' },
              { icon: TrendingUp, label: isAr ? 'السجل' : 'History' },
            ].map((action, i) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.03, background: 'hsl(var(--modern-bg-hover))' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/portal/wallet')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 0.5rem',
                  background: 'hsl(var(--modern-bg-elevated))',
                  border: '1px solid hsl(var(--modern-border-light))',
                  borderRadius: '0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: 'hsl(var(--modern-text-primary))',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                <action.icon size={18} />
                <span>{action.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Quick Access */}
        <motion.div variants={cardVariants} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1.1rem',
            fontWeight: 600,
            color: 'hsl(var(--modern-text-primary))'
          }}>
            <Sparkles size={18} style={{ color: 'hsl(var(--modern-brand-primary))' }} />
            {isAr ? 'الوصول السريع' : 'Quick Access'}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem',
            flex: 1
          }}>
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              const isPrimary = action.primary;
              return (
                <motion.button
                  key={action.id}
                  custom={i}
                  variants={quickActionVariants}
                  whileHover={{ 
                    y: -3, 
                    boxShadow: isPrimary 
                      ? '0 12px 24px -8px hsl(var(--modern-brand-primary) / 0.4)'
                      : '0 8px 20px -6px rgba(0,0,0,0.12)'
                  }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate(action.path)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    padding: 'clamp(1rem, 3vw, 1.25rem)',
                    background: isPrimary
                      ? 'linear-gradient(135deg, hsl(var(--modern-brand-primary)), hsl(var(--modern-brand-primary) / 0.9))'
                      : 'hsl(var(--modern-bg-card))',
                    border: isPrimary ? 'none' : '1px solid hsl(var(--modern-border-light))',
                    borderRadius: '1rem',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.3s'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '44px',
                    height: '44px',
                    borderRadius: '0.75rem',
                    background: isPrimary ? 'rgba(255,255,255,0.2)' : `${action.color}14`,
                    color: isPrimary ? 'white' : action.color
                  }}>
                    <Icon size={20} />
                  </div>
                  <span style={{
                    fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                    fontWeight: 600,
                    color: isPrimary ? 'white' : 'hsl(var(--modern-text-primary))',
                    textAlign: 'center'
                  }}>
                    {action.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          RECENT ACTIVITY (2-Column)
          ═══════════════════════════════════════════════════════════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
        gap: 'clamp(1rem, 3vw, 1.5rem)'
      }}>
        {/* Recent Orders */}
        <motion.section
          variants={cardVariants}
          style={{
            background: 'hsl(var(--modern-bg-card))',
            border: '1px solid hsl(var(--modern-border-light))',
            borderRadius: '1rem',
            overflow: 'hidden'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid hsl(var(--modern-border-light))'
          }}>
            <h3 style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'hsl(var(--modern-text-primary))',
              margin: 0
            }}>
              <ShoppingCart size={18} style={{ color: 'hsl(var(--modern-text-muted))' }} />
              {isAr ? 'آخر الطلبات' : 'Recent Orders'}
            </h3>
            <motion.button
              whileHover={{ x: isAr ? 4 : -4 }}
              onClick={() => navigate('/portal/orders')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.85rem',
                color: 'hsl(var(--modern-brand-primary))',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              {isAr ? 'عرض الكل' : 'View All'}
              <ChevronLeft size={16} style={{ transform: isAr ? 'none' : 'rotate(180deg)' }} />
            </motion.button>
          </div>

          <div style={{ padding: '0.75rem 1.25rem 1.25rem', minHeight: '200px' }}>
            {recentOrders.length === 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                padding: '2rem 1rem',
                textAlign: 'center',
                color: 'hsl(var(--modern-text-muted))'
              }}>
                <ShoppingCart size={40} strokeWidth={1.5} />
                <p style={{ margin: 0, fontSize: '0.9rem' }}>{isAr ? 'لا توجد طلبات حتى الآن' : 'No orders yet'}</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/portal/services')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'hsl(var(--modern-brand-primary))',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={16} />
                  {isAr ? 'اطلب خدمة' : 'Request Service'}
                </motion.button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <AnimatePresence>
                  {recentOrders.slice(0, 4).map((order, i) => {
                    const status = getStatusStyle(order.status);
                    return (
                      <motion.div
                        key={order.id}
                        custom={i}
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem',
                          padding: '0.75rem',
                          background: 'hsl(var(--modern-bg-elevated))',
                          borderRadius: '0.75rem',
                          transition: 'background 0.2s',
                          cursor: 'pointer'
                        }}
                        whileHover={{ background: 'hsl(var(--modern-bg-hover))' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            color: 'hsl(var(--modern-text-primary))',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {order.title || (isAr ? 'طلب خدمة' : 'Service Order')}
                          </span>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            padding: '0.2rem 0.6rem',
                            borderRadius: '9999px',
                            background: status.bg,
                            color: status.color,
                            flexShrink: 0
                          }}>
                            {isAr ? status.label : status.labelEn}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'hsl(var(--modern-text-muted))' }} dir="ltr">
                            #{order.order_number}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'hsl(var(--modern-text-muted))' }}>
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
        <motion.section
          variants={cardVariants}
          style={{
            background: 'hsl(var(--modern-bg-card))',
            border: '1px solid hsl(var(--modern-border-light))',
            borderRadius: '1rem',
            overflow: 'hidden'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid hsl(var(--modern-border-light))'
          }}>
            <h3 style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'hsl(var(--modern-text-primary))',
              margin: 0
            }}>
              <Activity size={18} style={{ color: 'hsl(var(--modern-text-muted))' }} />
              {isAr ? 'آخر المعاملات' : 'Recent Transactions'}
            </h3>
            <motion.button
              whileHover={{ x: isAr ? 4 : -4 }}
              onClick={() => navigate('/portal/wallet')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.85rem',
                color: 'hsl(var(--modern-brand-primary))',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              {isAr ? 'عرض الكل' : 'View All'}
              <ChevronLeft size={16} style={{ transform: isAr ? 'none' : 'rotate(180deg)' }} />
            </motion.button>
          </div>

          <div style={{ padding: '0.75rem 1.25rem 1.25rem', minHeight: '200px' }}>
            {recentTransactions.length === 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                padding: '2rem 1rem',
                textAlign: 'center',
                color: 'hsl(var(--modern-text-muted))'
              }}>
                <Wallet size={40} strokeWidth={1.5} />
                <p style={{ margin: 0, fontSize: '0.9rem' }}>{isAr ? 'لا توجد معاملات مالية' : 'No transactions yet'}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <AnimatePresence>
                  {recentTransactions.slice(0, 4).map((tx, i) => {
                    const isCredit = ['topup', 'deposit', 'refund'].includes(tx.transaction_type);
                    return (
                      <motion.div
                        key={tx.id}
                        custom={i}
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ background: 'hsl(var(--modern-bg-hover))' }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          borderRadius: '0.75rem',
                          transition: 'background 0.2s',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '36px',
                          height: '36px',
                          borderRadius: '0.5rem',
                          background: isCredit ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                          color: isCredit ? '#16a34a' : '#dc2626',
                          flexShrink: 0
                        }}>
                          {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: 'hsl(var(--modern-text-primary))',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {isAr ? (tx.description_ar || tx.description || tx.transaction_type) : (tx.description || tx.transaction_type)}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'hsl(var(--modern-text-muted))' }}>
                            {formatDate(tx.created_at)}
                          </div>
                        </div>
                        <div style={{
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: isCredit ? '#16a34a' : 'hsl(var(--modern-text-primary))',
                          flexShrink: 0
                        }} dir="ltr">
                          {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                          <span style={{ fontSize: '0.7rem', opacity: 0.7, marginInlineStart: '2px' }}>SAR</span>
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

      {/* ═══════════════════════════════════════════════════════════
          ACCOUNT SHORTCUTS
          ═══════════════════════════════════════════════════════════ */}
      <motion.div
        variants={cardVariants}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        {[
          { icon: User, label: isAr ? 'الملف الشخصي' : 'Profile', path: '/portal/profile' },
          { icon: Shield, label: isAr ? 'الأمان' : 'Security', path: '/portal/security' },
          { icon: Bell, label: isAr ? 'الإشعارات' : 'Notifications', path: '/portal/notifications' },
          { icon: MessageSquare, label: isAr ? 'تواصل معنا' : 'Contact Us', path: '/portal/support' },
        ].map((item, i) => (
          <motion.button
            key={item.path}
            whileHover={{ y: -2, borderColor: 'hsl(var(--modern-brand-primary) / 0.3)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              background: 'hsl(var(--modern-bg-card))',
              border: '1px solid hsl(var(--modern-border-light))',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'hsl(var(--modern-text-secondary))',
              cursor: 'pointer',
              flex: '1 1 auto',
              minWidth: 'max-content',
              justifyContent: 'center',
              transition: 'border-color 0.2s, color 0.2s'
            }}
          >
            <item.icon size={16} />
            <span>{item.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
};

V3CustomerOverview.displayName = 'V3CustomerOverview';
