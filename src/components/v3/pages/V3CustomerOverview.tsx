/**
 * V3 Customer Banking Portal Overview
 * 100% Custom - NO SHADCN
 * Premium Banking App Inspired
 */

import * as React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { V3StatCard } from '../data/V3StatCard';
import { V3Badge } from '../primitives/V3Badge';
import { V3Button } from '../primitives/V3Button';
import { V3Card, V3CardHeader, V3CardTitle, V3CardContent } from '../primitives/V3Card';
import '@/styles/v3/tokens.css';
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

// Mock data
const recentTransactions = [
  { id: 1, type: 'deposit', amount: 5000, description: 'إيداع بنكي', date: '2024-01-15', status: 'completed' },
  { id: 2, type: 'payment', amount: -2500, description: 'دفعة خدمة', date: '2024-01-14', status: 'completed' },
  { id: 3, type: 'refund', amount: 1000, description: 'استرداد', date: '2024-01-13', status: 'pending' },
];

const activeOrders = [
  { id: 'ORD-001', service: 'تطوير موقع إلكتروني', progress: 75, status: 'in_progress' },
  { id: 'ORD-002', service: 'تصميم هوية بصرية', progress: 40, status: 'in_progress' },
];

const quickActions = [
  { id: 'order', label: 'طلب جديد', labelEn: 'New Order', icon: <OrderIcon /> },
  { id: 'deposit', label: 'إيداع رصيد', labelEn: 'Deposit', icon: <WalletIcon /> },
  { id: 'services', label: 'تصفح الخدمات', labelEn: 'Browse Services', icon: <ServiceIcon /> },
  { id: 'contracts', label: 'العقود', labelEn: 'Contracts', icon: <ContractIcon /> },
];

export const V3CustomerOverview: React.FC = () => {
  const { language } = useLanguage();
  const { profile } = useAuth();
  const isAr = language === 'ar';

  const formatCurrency = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString('ar-SA');
    return `${amount < 0 ? '-' : ''}${formatted}`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return isAr ? 'صباح الخير' : 'Good Morning';
    if (hour < 18) return isAr ? 'مساء الخير' : 'Good Afternoon';
    return isAr ? 'مساء الخير' : 'Good Evening';
  };

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

      {/* Wallet Card - Hero Element */}
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
              <span className="bank-wallet-hero__value">12,450</span>
              <span className="bank-wallet-hero__currency">SAR</span>
            </div>
            <div className="bank-wallet-hero__footer">
              <div className="bank-wallet-hero__account">
                <span className="bank-wallet-hero__account-label">
                  {isAr ? 'رقم المحفظة' : 'Wallet No.'}
                </span>
                <span className="bank-wallet-hero__account-number">4*** **** **** 8521</span>
              </div>
              <V3Button context="bank" variant="secondary" size="sm">
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
            <button key={action.id} className="bank-quick-action">
              <div className="bank-quick-action__icon">{action.icon}</div>
              <span className="bank-quick-action__label">
                {isAr ? action.label : action.labelEn}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="bank-overview__stats">
        <V3StatCard
          context="bank"
          title={isAr ? 'الطلبات النشطة' : 'Active Orders'}
          value="2"
          icon={<OrderIcon />}
          variant="info"
        />
        <V3StatCard
          context="bank"
          title={isAr ? 'العقود السارية' : 'Active Contracts'}
          value="3"
          icon={<ContractIcon />}
          variant="success"
        />
        <V3StatCard
          context="bank"
          title={isAr ? 'الخدمات المتاحة' : 'Available Services'}
          value="15"
          icon={<ServiceIcon />}
        />
      </div>

      {/* Content Grid */}
      <div className="bank-overview__grid">
        {/* Active Orders */}
        <V3Card context="bank">
          <V3CardHeader>
            <V3CardTitle context="bank">
              {isAr ? 'طلباتي النشطة' : 'My Active Orders'}
            </V3CardTitle>
            <V3Button context="bank" variant="ghost" size="sm">
              {isAr ? 'عرض الكل' : 'View All'}
              <ArrowIcon />
            </V3Button>
          </V3CardHeader>
          <V3CardContent>
            <div className="bank-orders-list">
              {activeOrders.map((order) => (
                <div key={order.id} className="bank-order-item">
                  <div className="bank-order-item__info">
                    <span className="bank-order-item__id">{order.id}</span>
                    <span className="bank-order-item__service">{order.service}</span>
                  </div>
                  <div className="bank-order-item__progress">
                    <div className="bank-order-item__progress-bar">
                      <div 
                        className="bank-order-item__progress-fill"
                        style={{ width: `${order.progress}%` }}
                      />
                    </div>
                    <span className="bank-order-item__progress-text">{order.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </V3CardContent>
        </V3Card>

        {/* Recent Transactions */}
        <V3Card context="bank">
          <V3CardHeader>
            <V3CardTitle context="bank">
              {isAr ? 'آخر المعاملات' : 'Recent Transactions'}
            </V3CardTitle>
            <V3Button context="bank" variant="ghost" size="sm">
              {isAr ? 'عرض الكل' : 'View All'}
              <ArrowIcon />
            </V3Button>
          </V3CardHeader>
          <V3CardContent>
            <div className="bank-transactions-list">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="bank-transaction-item">
                  <div className="bank-transaction-item__icon">
                    {tx.type === 'deposit' && <span className="bank-tx-icon bank-tx-icon--in">↓</span>}
                    {tx.type === 'payment' && <span className="bank-tx-icon bank-tx-icon--out">↑</span>}
                    {tx.type === 'refund' && <span className="bank-tx-icon bank-tx-icon--refund">↻</span>}
                  </div>
                  <div className="bank-transaction-item__info">
                    <span className="bank-transaction-item__desc">{tx.description}</span>
                    <span className="bank-transaction-item__date">{tx.date}</span>
                  </div>
                  <div className={`bank-transaction-item__amount ${tx.amount >= 0 ? 'bank-transaction-item__amount--positive' : 'bank-transaction-item__amount--negative'}`}>
                    {formatCurrency(tx.amount)} SAR
                  </div>
                </div>
              ))}
            </div>
          </V3CardContent>
        </V3Card>
      </div>
    </div>
  );
};

V3CustomerOverview.displayName = 'V3CustomerOverview';
