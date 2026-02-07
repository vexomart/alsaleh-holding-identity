/**
 * V3 Admin Dashboard - Command Center
 * 100% Custom - NO SHADCN
 * 
 * STATUS: V3 REBUILD
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, ReactNode } from 'react';
import { V3AdminLayout } from '@/components/v3/layouts/V3AdminLayout';
import { V3AdminOverview } from '@/components/v3/pages/V3AdminOverview';

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

// V3 Loader - Command Center Style
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
          border: '3px solid hsl(185 75% 48% / 0.3)',
          borderTopColor: 'hsl(185 75% 48%)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  </div>
);

/**
 * Legacy Page Wrapper - Dark Command Center Style
 * Inherits dark theme from parent layout
 */
const LegacyPageWrapper = ({ children }: { children: ReactNode }) => (
  <div className="legacy-admin-page">
    {children}
  </div>
);

const V3AdminDashboard = () => {
  return (
    <V3AdminLayout>
      <Routes>
        {/* Main Routes - V3 Overview (Native V3) */}
        <Route index element={<V3AdminOverview />} />
        
        {/* Legacy pages wrapped for compatibility */}
        <Route path="users" element={<LegacyPageWrapper><UsersManagement /></LegacyPageWrapper>} />
        <Route path="roles" element={<LegacyPageWrapper><RolesPermissions /></LegacyPageWrapper>} />
        <Route path="clients/:id" element={<LegacyPageWrapper><AdminClientHub /></LegacyPageWrapper>} />
        <Route path="services" element={<LegacyPageWrapper><ServicesManagement /></LegacyPageWrapper>} />
        <Route path="orders" element={<LegacyPageWrapper><OrdersManagement /></LegacyPageWrapper>} />
        <Route path="orders/:id" element={<LegacyPageWrapper><Suspense fallback={<V3PageLoader />}><OrderDetailsPage /></Suspense></LegacyPageWrapper>} />
        <Route path="contracts" element={<LegacyPageWrapper><ContractsManagement /></LegacyPageWrapper>} />
        <Route path="wallets" element={<LegacyPageWrapper><WalletsManagement /></LegacyPageWrapper>} />
        <Route path="wallets/:id" element={<LegacyPageWrapper><WalletDetailsPage /></LegacyPageWrapper>} />
        <Route path="finance" element={<LegacyPageWrapper><FinanceCenter /></LegacyPageWrapper>} />
        <Route path="finance-internal" element={<LegacyPageWrapper><FinanceManagement /></LegacyPageWrapper>} />
        <Route path="referrals" element={<LegacyPageWrapper><Suspense fallback={<V3PageLoader />}><AdminReferralsPage /></Suspense></LegacyPageWrapper>} />
        <Route path="integrations" element={<LegacyPageWrapper><Suspense fallback={<V3PageLoader />}><IntegrationsPage /></Suspense></LegacyPageWrapper>} />
        <Route path="reports" element={<LegacyPageWrapper><ReportsPage /></LegacyPageWrapper>} />
        <Route path="notifications" element={<LegacyPageWrapper><NotificationsPage /></LegacyPageWrapper>} />
        <Route path="audit" element={<LegacyPageWrapper><AuditLogPage /></LegacyPageWrapper>} />
        <Route path="settings" element={<LegacyPageWrapper><SettingsPage /></LegacyPageWrapper>} />
      </Routes>
    </V3AdminLayout>
  );
};

export default V3AdminDashboard;
