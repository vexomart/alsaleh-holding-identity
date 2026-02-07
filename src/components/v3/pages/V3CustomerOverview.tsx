/**
 * V3 Customer Banking Portal Overview
 * 100% Custom - NO SHADCN
 * Premium Banking App Inspired
 * NOW WITH REAL DATA - NO MOCK DATA
 */

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { V3StatCard } from '../data/V3StatCard';
import { V3Badge } from '../primitives/V3Badge';
import { V3Button } from '../primitives/V3Button';
import { V3Card, V3CardHeader, V3CardTitle, V3CardContent } from '../primitives/V3Card';
import '@/styles/v3/light-theme.css';
import './V3Pages.css';

// Icons
const WalletIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
  </svg>
);

const OrderIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <rect width="8" height="4" x="8" y="2" rx="1"/>
    <path d="M9 14l2 2 4-4"/>
  </svg>
);

const ContractIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
    <path d="M9 13h6"/><path d="M9 17h3"/>
  </svg>
);

const ServiceIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

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

interface ContractData {
  id: string;
  contract_number: string;
  status: string;
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
  });
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch real data from database
  React.useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch wallet - filtered by current user
        const { data: walletData } = await supabase
          .from('customer_wallets')
          .select('id, balance, wallet_number, currency')
          .eq('customer_user_id', user.id)
          .maybeSingle();

        if (walletData) {
          setWallet(walletData as WalletData);
        }

        // Fetch orders - filtered by current user
        const { data: ordersData } = await supabase
          .from('orders')
          .select('id, order_number, title, status, created_at, total_amount')
          .eq('customer_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (ordersData) {
          setRecentOrders(ordersData as OrderData[]);
        }

        // Fetch contracts count - filtered by current user
        const { count: contractsCount } = await supabase
          .from('contracts')
          .select('*', { count: 'exact', head: true })
          .eq('customer_user_id', user.id)
          .in('status', ['signed', 'pending_signature', 'pre_approved_by_customer']);

        // Fetch active orders count
        const activeOrdersCount = (ordersData || []).filter(
          o => ['pending', 'processing', 'in_progress'].includes(o.status)
        ).length;

        // Fetch services count (public services)
        const { count: servicesCount } = await supabase
          .from('services')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)
          .eq('is_visible_to_customers', true);

        setStats({
          activeOrders: activeOrdersCount,
          activeContracts: contractsCount || 0,
          totalServices: servicesCount || 0,
        });

        // Fetch transactions - filtered by current user
        const { data: transactionsData } = await supabase
          .from('financial_transactions')
          .select('id, transaction_type, amount, description, description_ar, created_at, status')
          .eq('customer_user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (transactionsData) {
          setRecentTransactions(transactionsData as TransactionData[]);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  const formatCurrency = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString('ar-SA');
    return `${amount < 0 ? '-' : ''}${formatted}`;
  };

  const formatWalletNumber = (walletNumber: string | undefined) => {
    if (!walletNumber || walletNumber.length < 4) return '****';
    return `${walletNumber.slice(0, 4).replace(/./g, '*')} **** **** ${walletNumber.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return isAr ? 'صباح الخير' : 'Good Morning';
    if (hour < 18) return isAr ? 'مساء الخير' : 'Good Afternoon';
    return isAr ? 'مساء الخير' : 'Good Evening';
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'topup':
      case 'deposit':
        return <span className="bank-tx-icon bank-tx-icon--in">↓</span>;
      case 'invoice_payment':
      case 'payment':
        return <span className="bank-tx-icon bank-tx-icon--out">↑</span>;
      case 'refund':
        return <span className="bank-tx-icon bank-tx-icon--refund">↻</span>;
      default:
        return <span className="bank-tx-icon">•</span>;
    }
  };

  const quickActions = [
    { id: 'order', label: 'طلب جديد', labelEn: 'New Order', icon: <OrderIcon />, path: '/portal/services' },
    { id: 'deposit', label: 'إيداع رصيد', labelEn: 'Deposit', icon: <WalletIcon />, path: '/portal/wallet' },
    { id: 'services', label: 'تصفح الخدمات', labelEn: 'Browse Services', icon: <ServiceIcon />, path: '/portal/services' },
    { id: 'contracts', label: 'العقود', labelEn: 'Contracts', icon: <ContractIcon />, path: '/portal/contracts' },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="bank-overview">
        <div className="bank-overview__welcome">
          <div className="bank-overview__greeting">
            <div style={{ height: '24px', width: '120px', background: 'var(--v3-neutral-200)', borderRadius: '4px', marginBottom: '8px' }} />
            <div style={{ height: '32px', width: '200px', background: 'var(--v3-neutral-200)', borderRadius: '4px' }} />
          </div>
        </div>
        <div className="bank-wallet-hero">
          <div className="bank-wallet-hero__card" style={{ opacity: 0.5 }}>
            <div className="bank-wallet-hero__background" />
            <div className="bank-wallet-hero__content">
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                {isAr ? 'جاري التحميل...' : 'Loading...'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bank-overview">
      {/* Welcome Header */}
      <div className="bank-overview__welcome">
        <div className="bank-overview__greeting">
          <span className="bank-overview__greeting-time">{getGreeting()}</span>
          <h1 className="bank-overview__greeting-name">
            {profile?.full_name || (isAr ? 'عميلنا العزيز' : 'Dear Customer')}
          </h1>
        </div>
        <div className="bank-overview__date">
          {new Date().toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      {/* Wallet Card - Real Data */}
      <div className="bank-wallet-hero">
        <div className="bank-wallet-hero__card">
          <div className="bank-wallet-hero__background" />
          <div className="bank-wallet-hero__content">
            <div className="bank-wallet-hero__header">
              <span className="bank-wallet-hero__label">
                {isAr ? 'الرصيد المتاح' : 'Available Balance'}
              </span>
              <div className="bank-wallet-hero__icon">
                <WalletIcon />
              </div>
            </div>
            <div className="bank-wallet-hero__amount">
              <span className="bank-wallet-hero__value">
                {formatCurrency(wallet?.balance || 0)}
              </span>
              <span className="bank-wallet-hero__currency">SAR</span>
            </div>
            <div className="bank-wallet-hero__footer">
              <div className="bank-wallet-hero__account">
                <span className="bank-wallet-hero__account-label">
                  {isAr ? 'رقم المحفظة' : 'Wallet No.'}
                </span>
                <span className="bank-wallet-hero__account-number">
                  {formatWalletNumber(wallet?.wallet_number)}
                </span>
              </div>
              <V3Button 
                context="bank" 
                variant="secondary" 
                size="sm"
                onClick={() => navigate('/portal/wallet')}
              >
                {isAr ? 'إيداع' : 'Deposit'}
              </V3Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bank-quick-actions">
        <h2 className="bank-section-title">
          {isAr ? 'إجراءات سريعة' : 'Quick Actions'}
        </h2>
        <div className="bank-quick-actions__grid">
          {quickActions.map((action) => (
            <button 
              key={action.id} 
              className="bank-quick-action"
              onClick={() => navigate(action.path)}
            >
              <div className="bank-quick-action__icon">{action.icon}</div>
              <span className="bank-quick-action__label">
                {isAr ? action.label : action.labelEn}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row - Real Data */}
      <div className="bank-overview__stats">
        <V3StatCard
          context="bank"
          title={isAr ? 'الطلبات النشطة' : 'Active Orders'}
          value={String(stats.activeOrders)}
          icon={<OrderIcon />}
          variant="info"
        />
        <V3StatCard
          context="bank"
          title={isAr ? 'العقود السارية' : 'Active Contracts'}
          value={String(stats.activeContracts)}
          icon={<ContractIcon />}
          variant="success"
        />
        <V3StatCard
          context="bank"
          title={isAr ? 'الخدمات المتاحة' : 'Available Services'}
          value={String(stats.totalServices)}
          icon={<ServiceIcon />}
        />
      </div>

      {/* Content Grid */}
      <div className="bank-overview__grid">
        {/* Active Orders - Real Data */}
        <V3Card context="bank">
          <V3CardHeader>
            <V3CardTitle context="bank">
              {isAr ? 'طلباتي النشطة' : 'My Active Orders'}
            </V3CardTitle>
            <V3Button 
              context="bank" 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/portal/orders')}
            >
              {isAr ? 'عرض الكل' : 'View All'}
              <ArrowIcon />
            </V3Button>
          </V3CardHeader>
          <V3CardContent>
            <div className="bank-orders-list">
              {recentOrders.length === 0 ? (
                <div className="bank-empty-state">
                  <p>{isAr ? 'لا توجد طلبات بعد' : 'No orders yet'}</p>
                  <V3Button 
                    context="bank" 
                    variant="primary" 
                    size="sm"
                    onClick={() => navigate('/portal/services')}
                  >
                    {isAr ? 'اطلب خدمة الآن' : 'Request a Service'}
                  </V3Button>
                </div>
              ) : (
                recentOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="bank-order-item">
                    <div className="bank-order-item__info">
                      <span className="bank-order-item__id">{order.order_number}</span>
                      <span className="bank-order-item__service">
                        {order.title || (isAr ? 'طلب خدمة' : 'Service Order')}
                      </span>
                    </div>
                    <div className="bank-order-item__status">
                      <V3Badge 
                        context="bank"
                        variant={
                          order.status === 'completed' ? 'success' :
                          order.status === 'pending' ? 'warning' :
                          order.status === 'cancelled' ? 'danger' : 'info'
                        }
                      >
                        {isAr ? (
                          order.status === 'pending' ? 'قيد الانتظار' :
                          order.status === 'processing' ? 'قيد المعالجة' :
                          order.status === 'in_progress' ? 'قيد التنفيذ' :
                          order.status === 'completed' ? 'مكتمل' :
                          order.status === 'cancelled' ? 'ملغي' : order.status
                        ) : order.status}
                      </V3Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </V3CardContent>
        </V3Card>

        {/* Recent Transactions - Real Data */}
        <V3Card context="bank">
          <V3CardHeader>
            <V3CardTitle context="bank">
              {isAr ? 'آخر المعاملات' : 'Recent Transactions'}
            </V3CardTitle>
            <V3Button 
              context="bank" 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/portal/wallet')}
            >
              {isAr ? 'عرض الكل' : 'View All'}
              <ArrowIcon />
            </V3Button>
          </V3CardHeader>
          <V3CardContent>
            <div className="bank-transactions-list">
              {recentTransactions.length === 0 ? (
                <div className="bank-empty-state">
                  <p>{isAr ? 'لا توجد معاملات بعد' : 'No transactions yet'}</p>
                </div>
              ) : (
                recentTransactions.map((tx) => (
                  <div key={tx.id} className="bank-transaction-item">
                    <div className="bank-transaction-item__icon">
                      {getTransactionIcon(tx.transaction_type)}
                    </div>
                    <div className="bank-transaction-item__info">
                      <span className="bank-transaction-item__desc">
                        {isAr ? (tx.description_ar || tx.description || tx.transaction_type) : (tx.description || tx.transaction_type)}
                      </span>
                      <span className="bank-transaction-item__date">
                        {formatDate(tx.created_at)}
                      </span>
                    </div>
                    <div className={`bank-transaction-item__amount ${
                      tx.transaction_type === 'topup' || tx.transaction_type === 'refund' 
                        ? 'bank-transaction-item__amount--positive' 
                        : 'bank-transaction-item__amount--negative'
                    }`}>
                      {tx.transaction_type === 'topup' || tx.transaction_type === 'refund' ? '+' : '-'}
                      {formatCurrency(tx.amount)} SAR
                    </div>
                  </div>
                ))
              )}
            </div>
          </V3CardContent>
        </V3Card>
      </div>
    </div>
  );
};

V3CustomerOverview.displayName = 'V3CustomerOverview';
