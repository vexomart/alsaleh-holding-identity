/**
 * V3 Admin Command Center Overview
 * 100% Custom - NO SHADCN
 * Bloomberg Terminal Inspired
 */

import * as React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { V3StatCard } from '../data/V3StatCard';
import { V3Table } from '../data/V3Table';
import { V3Badge } from '../primitives/V3Badge';
import { V3Button } from '../primitives/V3Button';
import { V3Card, V3CardHeader, V3CardTitle, V3CardContent } from '../primitives/V3Card';
import '@/styles/v3/tokens.css';
import './V3Pages.css';

// Icons
const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
  </svg>
);

const OrdersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
  </svg>
);

const WalletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
  </svg>
);

const ContractIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

// Mock data for demo
const recentOrders = [
  { id: 'ORD-001', customer: 'محمد أحمد', service: 'تطوير موقع', status: 'pending', amount: '15,000' },
  { id: 'ORD-002', customer: 'فاطمة علي', service: 'تطبيق جوال', status: 'in_progress', amount: '25,000' },
  { id: 'ORD-003', customer: 'أحمد سالم', service: 'استشارة', status: 'completed', amount: '5,000' },
  { id: 'ORD-004', customer: 'نورة خالد', service: 'تصميم هوية', status: 'pending', amount: '8,000' },
  { id: 'ORD-005', customer: 'عبدالله محمد', service: 'تطوير نظام', status: 'in_progress', amount: '45,000' },
];

const systemAlerts = [
  { id: 1, type: 'warning', message: '5 طلبات بانتظار الموافقة', time: 'منذ 10 دقائق' },
  { id: 2, type: 'danger', message: '3 عقود قاربت على الانتهاء', time: 'منذ ساعة' },
  { id: 3, type: 'info', message: 'تحديث النظام متاح', time: 'منذ 3 ساعات' },
];

export const V3AdminOverview: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'info' }> = {
      pending: { label: isAr ? 'بانتظار' : 'Pending', variant: 'warning' },
      in_progress: { label: isAr ? 'قيد التنفيذ' : 'In Progress', variant: 'info' },
      completed: { label: isAr ? 'مكتمل' : 'Completed', variant: 'success' },
    };
    const { label, variant } = statusMap[status] || statusMap.pending;
    return <V3Badge context="command" variant={variant}>{label}</V3Badge>;
  };

  const orderColumns = [
    { key: 'id', header: 'Order ID', headerAr: 'رقم الطلب', width: '120px' },
    { key: 'customer', header: 'Customer', headerAr: 'العميل' },
    { key: 'service', header: 'Service', headerAr: 'الخدمة' },
    { 
      key: 'status', 
      header: 'Status', 
      headerAr: 'الحالة',
      render: (row: typeof recentOrders[0]) => getStatusBadge(row.status),
    },
    { 
      key: 'amount', 
      header: 'Amount', 
      headerAr: 'المبلغ',
      align: 'end' as const,
      render: (row: typeof recentOrders[0]) => (
        <span className="v3-text-mono">{row.amount} SAR</span>
      ),
    },
  ];

  return (
    <div className="cmd-overview">
      {/* Page Header */}
      <div className="cmd-overview__header">
        <div>
          <h1 className="cmd-overview__title">
            {isAr ? 'مركز القيادة' : 'Command Center'}
          </h1>
          <p className="cmd-overview__subtitle">
            {isAr ? 'نظرة شاملة على النظام' : 'System Overview'}
          </p>
        </div>
        <div className="cmd-overview__actions">
          <V3Button context="command" variant="ghost" size="sm">
            {isAr ? 'تصدير التقرير' : 'Export Report'}
          </V3Button>
          <V3Button context="command" variant="primary" size="sm">
            {isAr ? 'طلب جديد' : 'New Order'}
          </V3Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="cmd-overview__stats">
        <V3StatCard
          context="command"
          title={isAr ? 'إجمالي المستخدمين' : 'Total Users'}
          value="1,284"
          trend={{ value: 12, direction: 'up' }}
          subtitle={isAr ? 'هذا الشهر' : 'This month'}
          icon={<UsersIcon />}
          variant="info"
        />
        <V3StatCard
          context="command"
          title={isAr ? 'الطلبات النشطة' : 'Active Orders'}
          value="47"
          trend={{ value: 8, direction: 'up' }}
          subtitle={isAr ? 'قيد التنفيذ' : 'In progress'}
          icon={<OrdersIcon />}
          variant="warning"
        />
        <V3StatCard
          context="command"
          title={isAr ? 'رصيد المحافظ' : 'Wallet Balance'}
          value="2.4M"
          trend={{ value: 3, direction: 'down' }}
          subtitle="SAR"
          icon={<WalletIcon />}
          variant="success"
        />
        <V3StatCard
          context="command"
          title={isAr ? 'العقود السارية' : 'Active Contracts'}
          value="156"
          trend={{ value: 0, direction: 'neutral' }}
          subtitle={isAr ? 'سارية' : 'Active'}
          icon={<ContractIcon />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="cmd-overview__grid">
        {/* Recent Orders */}
        <div className="cmd-overview__main">
          <V3Card context="command">
            <V3CardHeader>
              <V3CardTitle context="command">
                {isAr ? 'آخر الطلبات' : 'Recent Orders'}
              </V3CardTitle>
            </V3CardHeader>
            <V3CardContent noPadding>
              <V3Table
                context="command"
                columns={orderColumns}
                data={recentOrders}
                language={language}
                onRowClick={(row) => console.log('Order clicked:', row.id)}
                compact
              />
            </V3CardContent>
          </V3Card>
        </div>

        {/* System Alerts */}
        <div className="cmd-overview__sidebar">
          <V3Card context="command">
            <V3CardHeader>
              <V3CardTitle context="command">
                {isAr ? 'تنبيهات النظام' : 'System Alerts'}
              </V3CardTitle>
            </V3CardHeader>
            <V3CardContent>
              <div className="cmd-alerts">
                {systemAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`cmd-alert cmd-alert--${alert.type}`}
                  >
                    <div className="cmd-alert__icon">
                      <AlertIcon />
                    </div>
                    <div className="cmd-alert__content">
                      <p className="cmd-alert__message">{alert.message}</p>
                      <span className="cmd-alert__time">{alert.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </V3CardContent>
          </V3Card>

          {/* Quick Stats */}
          <V3Card context="command">
            <V3CardHeader>
              <V3CardTitle context="command">
                {isAr ? 'إحصائيات سريعة' : 'Quick Stats'}
              </V3CardTitle>
            </V3CardHeader>
            <V3CardContent>
              <div className="cmd-quick-stats">
                <div className="cmd-quick-stat">
                  <span className="cmd-quick-stat__label">
                    {isAr ? 'معدل الإنجاز' : 'Completion Rate'}
                  </span>
                  <span className="cmd-quick-stat__value cmd-quick-stat__value--success">94%</span>
                </div>
                <div className="cmd-quick-stat">
                  <span className="cmd-quick-stat__label">
                    {isAr ? 'رضا العملاء' : 'Customer Satisfaction'}
                  </span>
                  <span className="cmd-quick-stat__value cmd-quick-stat__value--info">4.8/5</span>
                </div>
                <div className="cmd-quick-stat">
                  <span className="cmd-quick-stat__label">
                    {isAr ? 'الإيرادات اليومية' : 'Daily Revenue'}
                  </span>
                  <span className="cmd-quick-stat__value">45K SAR</span>
                </div>
              </div>
            </V3CardContent>
          </V3Card>
        </div>
      </div>
    </div>
  );
};

V3AdminOverview.displayName = 'V3AdminOverview';
