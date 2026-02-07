/**
 * V3 Admin Dashboard - Unified Light Theme
 * Modern SaaS Style with Collapsible Sidebar
 */

import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy, ReactNode } from 'react';
import { V3AdminLayout } from '@/components/v3/layouts/V3AdminLayout';
import { V3AdminOverview } from '@/components/v3/pages/V3AdminOverview';
import '@/styles/v3/light-theme.css';

// Keep existing page imports for functionality
import { UsersManagement } from '@/components/admin/users/UsersManagement';
import { RolesPermissions } from '@/components/admin/roles/RolesPermissions';
import { ServicesManagement } from '@/components/admin/services/ServicesManagement';
import { OrdersManagement } from '@/components/admin/orders/OrdersManagement';
import { ContractsManagement } from '@/components/admin/contracts/ContractsManagement';
import { WalletsManagement } from '@/components/admin/wallets/WalletsManagement';
import { WalletDetailsPage } from '@/components/admin/wallets/WalletDetailsPage';
import { ReportsPage } from '@/components/admin/reports/ReportsPage';
import { NotificationsPage } from '@/components/admin/notifications/NotificationsPage';
import { SettingsPage } from '@/components/admin/settings/SettingsPage';
import { AuditLogPage } from '@/components/admin/audit/AuditLogPage';
import { FinanceCenter } from '@/components/admin/finance';
import { FinanceManagement } from '@/components/finance/admin/FinanceManagement';
import { AdminClientHub } from '@/components/admin/clients';

// Lazy load pages
const AdminReferralsPage = lazy(() => import('@/components/admin/referrals/AdminReferralsPage'));
const IntegrationsPage = lazy(() => import('@/components/admin/integrations/IntegrationsPage'));
const OrderDetailsPage = lazy(() => import('@/pages/admin/OrderDetailsPage'));
const ContractDetailsPage = lazy(() => import('@/pages/admin/contracts/ContractDetailsPage'));

// User pages
const UserDetailsPage = lazy(() => import('@/pages/admin/users/UserDetailsPage'));
const UserEditPage = lazy(() => import('@/pages/admin/users/UserEditPage'));
const AddUserPage = lazy(() => import('@/pages/admin/users/AddUserPage'));

// V3 Loader - Light Theme Style
const V3PageLoader = () => (
  <div 
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div 
        style={{
          width: '40px',
          height: '40px',
          border: '3px solid hsl(217 91% 60% / 0.2)',
          borderTopColor: 'hsl(217 91% 60%)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  </div>
);

/**
 * Page Wrapper - Light Theme Consistent
 * Ensures all legacy pages inherit the light theme
 */
const PageWrapper = ({ children }: { children: ReactNode }) => (
  <div className="v3-page-wrapper">
    {children}
    <style>{`
      .v3-page-wrapper {
        /* Force light theme overrides for legacy components */
        --background: 0 0% 98%;
        --foreground: 222.2 84% 4.9%;
        --card: 0 0% 100%;
        --card-foreground: 222.2 84% 4.9%;
        --popover: 0 0% 100%;
        --popover-foreground: 222.2 84% 4.9%;
        --primary: 217 91% 60%;
        --primary-foreground: 0 0% 100%;
        --secondary: 220 14% 96%;
        --secondary-foreground: 222.2 47.4% 11.2%;
        --muted: 220 14% 96%;
        --muted-foreground: 215 16% 47%;
        --accent: 220 14% 96%;
        --accent-foreground: 222.2 47.4% 11.2%;
        --destructive: 0 84% 60%;
        --destructive-foreground: 0 0% 100%;
        --border: 220 13% 91%;
        --input: 220 13% 91%;
        --ring: 217 91% 60%;
        color: hsl(222.2 84% 4.9%);
      }
    `}</style>
  </div>
);

const V3AdminDashboard = () => {
  return (
    <V3AdminLayout>
      <Routes>
        {/* Main Routes - V3 Overview (Native V3) */}
        <Route index element={<V3AdminOverview />} />
        
        {/* User Management Routes */}
        <Route path="users" element={<PageWrapper><UsersManagement /></PageWrapper>} />
        <Route path="users/new" element={<PageWrapper><Suspense fallback={<V3PageLoader />}><AddUserPage /></Suspense></PageWrapper>} />
        <Route path="users/:id" element={<PageWrapper><Suspense fallback={<V3PageLoader />}><UserDetailsPage /></Suspense></PageWrapper>} />
        <Route path="users/:id/edit" element={<PageWrapper><Suspense fallback={<V3PageLoader />}><UserEditPage /></Suspense></PageWrapper>} />
        
        {/* Other pages wrapped for consistency */}
        <Route path="roles" element={<PageWrapper><RolesPermissions /></PageWrapper>} />
        <Route path="clients/:id" element={<PageWrapper><AdminClientHub /></PageWrapper>} />
        <Route path="services" element={<PageWrapper><ServicesManagement /></PageWrapper>} />
        <Route path="orders" element={<PageWrapper><OrdersManagement /></PageWrapper>} />
        <Route path="orders/:id" element={<PageWrapper><Suspense fallback={<V3PageLoader />}><OrderDetailsPage /></Suspense></PageWrapper>} />
        <Route path="contracts" element={<PageWrapper><ContractsManagement /></PageWrapper>} />
        <Route path="contracts/:id" element={<PageWrapper><Suspense fallback={<V3PageLoader />}><ContractDetailsPage /></Suspense></PageWrapper>} />
        <Route path="wallets" element={<PageWrapper><WalletsManagement /></PageWrapper>} />
        <Route path="wallets/:id" element={<PageWrapper><WalletDetailsPage /></PageWrapper>} />
        <Route path="finance" element={<PageWrapper><FinanceCenter /></PageWrapper>} />
        <Route path="finance-internal" element={<PageWrapper><FinanceManagement /></PageWrapper>} />
        <Route path="referrals" element={<PageWrapper><Suspense fallback={<V3PageLoader />}><AdminReferralsPage /></Suspense></PageWrapper>} />
        <Route path="integrations" element={<PageWrapper><Suspense fallback={<V3PageLoader />}><IntegrationsPage /></Suspense></PageWrapper>} />
        <Route path="reports" element={<PageWrapper><ReportsPage /></PageWrapper>} />
        <Route path="notifications" element={<PageWrapper><NotificationsPage /></PageWrapper>} />
        <Route path="audit" element={<PageWrapper><AuditLogPage /></PageWrapper>} />
        <Route path="settings" element={<PageWrapper><SettingsPage /></PageWrapper>} />
      </Routes>
    </V3AdminLayout>
  );
};

export default V3AdminDashboard;
