/**
 * V3 Admin Layout - Command Center
 * 100% Custom - NO SHADCN
 * RTL-First Arabic Native
 */

import * as React from 'react';
import { V3RailNav, RailNavGroup } from '../navigation/V3RailNav';
import { V3CommandHeader } from '../navigation/V3CommandHeader';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import '@/styles/v3/tokens.css';

// Icons as SVG components
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
  </svg>
);

const PackageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
  </svg>
);

const ShoppingCartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
  </svg>
);

const WalletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
  </svg>
);

const FileTextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/>
  </svg>
);

const LandmarkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>
  </svg>
);

const BarChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
  </svg>
);

const ClipboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const LinkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

const ADMIN_BASE = '/adminash';

export interface V3AdminLayoutProps {
  children: React.ReactNode;
}

export const V3AdminLayout: React.FC<V3AdminLayoutProps> = ({ children }) => {
  const { language } = useLanguage();
  const { profile, signOut } = useAuth();
  const [isRailExpanded, setIsRailExpanded] = React.useState(false);

  const navGroups: RailNavGroup[] = [
    {
      id: 'main',
      labelAr: 'الرئيسية',
      labelEn: 'Main',
      items: [
        { id: 'overview', labelAr: 'لوحة التحكم', labelEn: 'Dashboard', icon: <DashboardIcon />, href: ADMIN_BASE },
        { id: 'users', labelAr: 'المستخدمين', labelEn: 'Users', icon: <UsersIcon />, href: `${ADMIN_BASE}/users` },
        { id: 'roles', labelAr: 'الصلاحيات', labelEn: 'Roles', icon: <ShieldIcon />, href: `${ADMIN_BASE}/roles` },
      ],
    },
    {
      id: 'business',
      labelAr: 'الأعمال',
      labelEn: 'Business',
      items: [
        { id: 'services', labelAr: 'الخدمات', labelEn: 'Services', icon: <PackageIcon />, href: `${ADMIN_BASE}/services` },
        { id: 'orders', labelAr: 'الطلبات', labelEn: 'Orders', icon: <ShoppingCartIcon />, href: `${ADMIN_BASE}/orders`, badge: 5, badgeVariant: 'warning' },
        { id: 'contracts', labelAr: 'العقود', labelEn: 'Contracts', icon: <FileTextIcon />, href: `${ADMIN_BASE}/contracts` },
        { id: 'wallets', labelAr: 'المحافظ', labelEn: 'Wallets', icon: <WalletIcon />, href: `${ADMIN_BASE}/wallets` },
        { id: 'finance', labelAr: 'المالية', labelEn: 'Finance', icon: <LandmarkIcon />, href: `${ADMIN_BASE}/finance` },
      ],
    },
    {
      id: 'system',
      labelAr: 'النظام',
      labelEn: 'System',
      items: [
        { id: 'reports', labelAr: 'التقارير', labelEn: 'Reports', icon: <BarChartIcon />, href: `${ADMIN_BASE}/reports` },
        { id: 'notifications', labelAr: 'الإشعارات', labelEn: 'Notifications', icon: <BellIcon />, href: `${ADMIN_BASE}/notifications`, badge: 12, badgeVariant: 'danger' },
        { id: 'audit', labelAr: 'السجلات', labelEn: 'Audit Log', icon: <ClipboardIcon />, href: `${ADMIN_BASE}/audit` },
        { id: 'integrations', labelAr: 'التكاملات', labelEn: 'Integrations', icon: <LinkIcon />, href: `${ADMIN_BASE}/integrations` },
        { id: 'settings', labelAr: 'الإعدادات', labelEn: 'Settings', icon: <SettingsIcon />, href: `${ADMIN_BASE}/settings` },
      ],
    },
  ];

  return (
    <div className="cmd-center">
      <div className={`cmd-grid ${isRailExpanded ? 'rail-expanded' : ''}`}>
        {/* Rail Navigation */}
        <V3RailNav
          context="command"
          groups={navGroups}
          isExpanded={isRailExpanded}
          onToggle={() => setIsRailExpanded(!isRailExpanded)}
          language={language}
        />

        {/* Main Area */}
        <div className="cmd-main">
          <V3CommandHeader
            user={{
              name: profile?.full_name || profile?.email?.split('@')[0] || 'Admin',
              email: profile?.email || '',
              role: language === 'ar' ? 'مدير النظام' : 'System Admin',
            }}
            notifications={3}
            onSearch={() => console.log('Search')}
            onNotifications={() => console.log('Notifications')}
            onProfile={() => console.log('Profile')}
            language={language}
          />

          {/* Content */}
          <main className="cmd-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

V3AdminLayout.displayName = 'V3AdminLayout';
