/**
 * V3 Admin Dashboard Layout
 * Uses UnifiedAppShell with Light Theme
 * RTL-First Arabic Native
 * V3 Unified Real-time Sync
 */

import * as React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminDashboardSync } from '@/hooks/realtime';
import { AdminGuard } from '@/components/auth/RouteGuard';
import { UnifiedAppShell } from './UnifiedAppShell';
import { SidebarNavGroup } from './UnifiedSidebar';
import { RealtimeIndicator } from './RealtimeIndicator';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Briefcase, 
  ShoppingCart, 
  FileSignature, 
  Wallet, 
  Building2, 
  Gift, 
  Link2, 
  BarChart3, 
  Bell, 
  Settings,
  History
} from 'lucide-react';

export interface V3AdminLayoutProps {
  children: React.ReactNode;
}

// Admin Navigation Groups
const adminNavGroups: SidebarNavGroup[] = [
  {
    id: 'main',
    labelAr: 'الرئيسية',
    labelEn: 'Main',
    items: [
      { id: 'overview', labelAr: 'نظرة عامة', labelEn: 'Overview', icon: <LayoutDashboard size={20} />, href: '/adminash' },
      { id: 'users', labelAr: 'المستخدمين', labelEn: 'Users', icon: <Users size={20} />, href: '/adminash/users' },
      { id: 'roles', labelAr: 'الأدوار', labelEn: 'Roles', icon: <Shield size={20} />, href: '/adminash/roles' },
    ],
  },
  {
    id: 'operations',
    labelAr: 'العمليات',
    labelEn: 'Operations',
    items: [
      { id: 'services', labelAr: 'الخدمات', labelEn: 'Services', icon: <Briefcase size={20} />, href: '/adminash/services' },
      { id: 'orders', labelAr: 'الطلبات', labelEn: 'Orders', icon: <ShoppingCart size={20} />, href: '/adminash/orders' },
      { id: 'contracts', labelAr: 'العقود', labelEn: 'Contracts', icon: <FileSignature size={20} />, href: '/adminash/contracts' },
    ],
  },
  {
    id: 'finance',
    labelAr: 'المالية',
    labelEn: 'Finance',
    items: [
      { id: 'wallets', labelAr: 'المحافظ', labelEn: 'Wallets', icon: <Wallet size={20} />, href: '/adminash/wallets' },
      { id: 'finance-center', labelAr: 'مركز التمويل', labelEn: 'Finance Center', icon: <Building2 size={20} />, href: '/adminash/finance' },
      { id: 'referrals', labelAr: 'الإحالات', labelEn: 'Referrals', icon: <Gift size={20} />, href: '/adminash/referrals' },
    ],
  },
  {
    id: 'system',
    labelAr: 'النظام',
    labelEn: 'System',
    items: [
      { id: 'integrations', labelAr: 'التكاملات', labelEn: 'Integrations', icon: <Link2 size={20} />, href: '/adminash/integrations' },
      { id: 'reports', labelAr: 'التقارير', labelEn: 'Reports', icon: <BarChart3 size={20} />, href: '/adminash/reports' },
      { id: 'notifications', labelAr: 'الإشعارات', labelEn: 'Notifications', icon: <Bell size={20} />, href: '/adminash/notifications' },
      { id: 'audit', labelAr: 'سجل المراجعة', labelEn: 'Audit Log', icon: <History size={20} />, href: '/adminash/audit' },
      { id: 'settings', labelAr: 'الإعدادات', labelEn: 'Settings', icon: <Settings size={20} />, href: '/adminash/settings' },
    ],
  },
];

const V3AdminLayoutContent: React.FC<V3AdminLayoutProps> = ({ children }) => {
  const { user, profile } = useAuth();

  // V3 Unified Real-time sync with Customer dashboard
  const { isConnected, connectionStatus, eventCount } = useAdminDashboardSync({
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
    <UnifiedAppShell
      variant="admin"
      navGroups={adminNavGroups}
      sidebarFooter={sidebarFooter}
    >
      {children}
    </UnifiedAppShell>
  );
};

export const V3AdminLayout: React.FC<V3AdminLayoutProps> = ({ children }) => {
  return (
    <AdminGuard>
      <V3AdminLayoutContent>{children}</V3AdminLayoutContent>
    </AdminGuard>
  );
};

V3AdminLayout.displayName = 'V3AdminLayout';
