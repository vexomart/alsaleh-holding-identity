/**
 * V3 Customer Dashboard Layout
 * Uses UnifiedAppShell with Light Theme
 * RTL-First Arabic Native
 */

import * as React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCustomerRealtime } from '@/hooks/useCustomerRealtime';
import { CustomerGuard } from '@/components/auth/RouteGuard';
import { UnifiedAppShell } from './UnifiedAppShell';
import { SidebarNavGroup } from './UnifiedSidebar';
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
  CreditCard
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
      { id: 'overview', labelAr: 'نظرة عامة', labelEn: 'Overview', icon: <LayoutDashboard size={20} />, href: '/portal' },
      { id: 'orders', labelAr: 'طلباتي', labelEn: 'My Orders', icon: <ShoppingCart size={20} />, href: '/portal/orders' },
      { id: 'services', labelAr: 'الخدمات', labelEn: 'Services', icon: <Briefcase size={20} />, href: '/portal/services' },
    ],
  },
  {
    id: 'documents',
    labelAr: 'المستندات',
    labelEn: 'Documents',
    items: [
      { id: 'contracts', labelAr: 'عقودي', labelEn: 'My Contracts', icon: <FileSignature size={20} />, href: '/portal/contracts' },
      { id: 'invoices', labelAr: 'فواتيري', labelEn: 'My Invoices', icon: <Receipt size={20} />, href: '/portal/invoices' },
    ],
  },
  {
    id: 'finance',
    labelAr: 'المالية',
    labelEn: 'Finance',
    items: [
      { id: 'wallet', labelAr: 'المحفظة', labelEn: 'Wallet', icon: <Wallet size={20} />, href: '/portal/wallet' },
      { id: 'transactions', labelAr: 'المعاملات', labelEn: 'Transactions', icon: <CreditCard size={20} />, href: '/portal/transactions' },
      { id: 'finance-center', labelAr: 'التمويل', labelEn: 'Finance', icon: <Building2 size={20} />, href: '/portal/finance' },
      { id: 'referrals', labelAr: 'الإحالات', labelEn: 'Referrals', icon: <Gift size={20} />, href: '/portal/referrals' },
    ],
  },
  {
    id: 'account',
    labelAr: 'الحساب',
    labelEn: 'Account',
    items: [
      { id: 'notifications', labelAr: 'الإشعارات', labelEn: 'Notifications', icon: <Bell size={20} />, href: '/portal/notifications' },
      { id: 'profile', labelAr: 'الملف الشخصي', labelEn: 'Profile', icon: <User size={20} />, href: '/portal/profile' },
      { id: 'security', labelAr: 'الأمان', labelEn: 'Security', icon: <Shield size={20} />, href: '/portal/security' },
    ],
  },
];

const V3CustomerLayoutContent: React.FC<V3CustomerLayoutProps> = ({ children }) => {
  const { user, profile } = useAuth();

  // Real-time subscriptions for services and invoices
  useCustomerRealtime({
    userId: user?.id,
    tenantId: profile?.tenant_id || undefined,
    enabled: !!user,
  });

  return (
    <UnifiedAppShell
      variant="customer"
      navGroups={customerNavGroups}
    >
      {children}
    </UnifiedAppShell>
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
