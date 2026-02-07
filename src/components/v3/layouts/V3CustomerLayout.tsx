/**
 * V3 Customer Dashboard Layout
 * Modern Stripe/Notion Inspired Design
 * RTL-First Arabic Native
 * V3 Unified Real-time Sync
 */

import * as React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCustomerDashboardSync } from '@/hooks/realtime';
import { CustomerGuard } from '@/components/auth/RouteGuard';
import { ModernAppShell } from './ModernAppShell';
import { SidebarNavGroup } from './ModernSidebar';
import { RealtimeIndicator } from './RealtimeIndicator';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Briefcase, 
  FileSignature, 
  Receipt, 
  Wallet, 
  Building2, 
  Gift, 
  Bell, 
  User,
  Shield,
  CreditCard,
  Headphones,
  Settings
} from 'lucide-react';

export interface V3CustomerLayoutProps {
  children: React.ReactNode;
}

// Customer Navigation Groups
const customerNavGroups: SidebarNavGroup[] = [
  {
    id: 'main',
    labelAr: 'الرئيسية',
    labelEn: 'Main',
    items: [
      { id: 'overview', labelAr: 'نظرة عامة', labelEn: 'Overview', icon: <LayoutDashboard size={18} />, href: '/portal' },
      { id: 'orders', labelAr: 'طلباتي', labelEn: 'My Orders', icon: <ShoppingCart size={18} />, href: '/portal/orders' },
      { id: 'services', labelAr: 'الخدمات', labelEn: 'Services', icon: <Briefcase size={18} />, href: '/portal/services' },
    ],
  },
  {
    id: 'documents',
    labelAr: 'المستندات',
    labelEn: 'Documents',
    items: [
      { id: 'contracts', labelAr: 'عقودي', labelEn: 'My Contracts', icon: <FileSignature size={18} />, href: '/portal/contracts' },
      { id: 'invoices', labelAr: 'فواتيري', labelEn: 'My Invoices', icon: <Receipt size={18} />, href: '/portal/invoices' },
    ],
  },
  {
    id: 'finance',
    labelAr: 'المالية',
    labelEn: 'Finance',
    items: [
      { id: 'wallet', labelAr: 'المحفظة', labelEn: 'Wallet', icon: <Wallet size={18} />, href: '/portal/wallet' },
      { id: 'transactions', labelAr: 'المعاملات', labelEn: 'Transactions', icon: <CreditCard size={18} />, href: '/portal/transactions' },
      { id: 'finance-center', labelAr: 'التمويل', labelEn: 'Finance', icon: <Building2 size={18} />, href: '/portal/finance' },
      { id: 'referrals', labelAr: 'الإحالات', labelEn: 'Referrals', icon: <Gift size={18} />, href: '/portal/referrals' },
    ],
  },
  {
    id: 'account',
    labelAr: 'الحساب',
    labelEn: 'Account',
    items: [
      { id: 'notifications', labelAr: 'الإشعارات', labelEn: 'Notifications', icon: <Bell size={18} />, href: '/portal/notifications' },
      { id: 'profile', labelAr: 'الملف الشخصي', labelEn: 'Profile', icon: <User size={18} />, href: '/portal/profile' },
      { id: 'security', labelAr: 'الأمان', labelEn: 'Security', icon: <Shield size={18} />, href: '/portal/security' },
      { id: 'support', labelAr: 'الدعم', labelEn: 'Support', icon: <Headphones size={18} />, href: '/portal/support' },
      { id: 'settings', labelAr: 'الإعدادات', labelEn: 'Settings', icon: <Settings size={18} />, href: '/portal/settings' },
    ],
  },
];

const V3CustomerLayoutContent: React.FC<V3CustomerLayoutProps> = ({ children }) => {
  const { user } = useAuth();

  // V3 Unified Real-time sync with Admin dashboard
  const { isConnected, connectionStatus, eventCount } = useCustomerDashboardSync({
    enabled: !!user,
  });

  // Sidebar footer with realtime indicator
  const sidebarFooter = React.useMemo(() => (
    <RealtimeIndicator 
      isConnected={isConnected}
      connectionStatus={connectionStatus}
      eventCount={eventCount}
    />
  ), [isConnected, connectionStatus, eventCount]);

  return (
    <ModernAppShell
      variant="customer"
      navGroups={customerNavGroups}
      sidebarFooter={sidebarFooter}
    >
      {children}
    </ModernAppShell>
  );
};

export const V3CustomerLayout: React.FC<V3CustomerLayoutProps> = ({ children }) => {
  return (
    <CustomerGuard>
      <V3CustomerLayoutContent>{children}</V3CustomerLayoutContent>
    </CustomerGuard>
  );
};

V3CustomerLayout.displayName = 'V3CustomerLayout';
