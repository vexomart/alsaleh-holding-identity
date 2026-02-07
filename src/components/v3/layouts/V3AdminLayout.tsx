/**
 * V3 Admin Layout - Command Center with Sidebar
 * Includes V3RailNav sidebar navigation
 * Simplified for UnifiedLayout integration
 */

import * as React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { AdminGuard } from '@/components/auth/RouteGuard';
import { V3RailNav, RailNavGroup } from '@/components/v3/navigation/V3RailNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
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
  Menu,
  X
} from 'lucide-react';
import '@/styles/v3/tokens.css';

export interface V3AdminLayoutProps {
  children: React.ReactNode;
}

// Admin Navigation Groups
const adminNavGroups: RailNavGroup[] = [
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
      { id: 'settings', labelAr: 'الإعدادات', labelEn: 'Settings', icon: <Settings size={20} />, href: '/adminash/settings' },
    ],
  },
];

const V3AdminLayoutContent: React.FC<V3AdminLayoutProps> = ({ children }) => {
  const { isRTL, language } = useLanguage();
  const isMobile = useIsMobile();
  const [sidebarExpanded, setSidebarExpanded] = React.useState(!isMobile);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  // Close mobile sidebar on route change
  React.useEffect(() => {
    setMobileSidebarOpen(false);
  }, []);

  // Update sidebar state on mobile change
  React.useEffect(() => {
    setSidebarExpanded(!isMobile);
  }, [isMobile]);

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-full bg-background flex"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {/* Mobile Sidebar Toggle */}
      {isMobile && (
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className={cn(
            "fixed top-20 z-50 p-2 rounded-lg bg-primary text-primary-foreground shadow-lg",
            isRTL ? "right-4" : "left-4"
          )}
        >
          {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Sidebar - Desktop: Always visible, Mobile: Overlay */}
      <div className={cn(
        "shrink-0",
        isMobile && "fixed inset-y-0 z-40 transition-transform duration-300",
        isMobile && isRTL && (mobileSidebarOpen ? "translate-x-0 right-0" : "translate-x-full right-0"),
        isMobile && !isRTL && (mobileSidebarOpen ? "translate-x-0 left-0" : "-translate-x-full left-0"),
        !isMobile && "relative"
      )}>
        <V3RailNav
          context="command"
          groups={adminNavGroups}
          isExpanded={isMobile ? true : sidebarExpanded}
          onToggle={() => isMobile ? setMobileSidebarOpen(false) : setSidebarExpanded(!sidebarExpanded)}
          language={language as 'ar' | 'en'}
        />
      </div>

      {/* Mobile Overlay */}
      {isMobile && mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Content Area */}
      <main className={cn(
        "flex-1 min-w-0 overflow-x-hidden",
        isMobile ? "px-3 py-4 pt-16" : "px-4 py-6 lg:px-8 lg:py-8"
      )}>
        {children}
      </main>
    </div>
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
