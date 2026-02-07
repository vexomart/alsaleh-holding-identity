/**
 * V3 Admin Dashboard - Command Center
 * 100% Custom - NO SHADCN
 * 
 * STATUS: V3 REBUILD
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { V3AdminLayout } from '@/components/v3/layouts/V3AdminLayout';
import { V3AdminOverview } from '@/components/v3/pages/V3AdminOverview';
import { Loader2 } from 'lucide-react';

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

// V3 Loader - Command Center Style
const V3PageLoader = () => (
  <div 
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      background: 'hsl(220 25% 6%)',
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

const V3AdminDashboard = () => {
  return (
    <V3AdminLayout>
      <Routes>
        {/* Main Routes - V3 Overview */}
        <Route index element={<V3AdminOverview />} />
        
        {/* Keep existing routes for functionality */}
        <Route path="users" element={<UsersManagement />} />
        <Route path="roles" element={<RolesPermissions />} />
        <Route path="clients/:id" element={<AdminClientHub />} />
        <Route path="services" element={<ServicesManagement />} />
        <Route path="orders" element={<OrdersManagement />} />
        <Route path="contracts" element={<ContractsManagement />} />
        <Route path="wallets" element={<WalletsManagement />} />
        <Route path="wallets/:id" element={<WalletDetailsPage />} />
        <Route path="finance" element={<FinanceCenter />} />
        <Route path="finance-internal" element={<FinanceManagement />} />
        <Route path="referrals" element={<Suspense fallback={<V3PageLoader />}><AdminReferralsPage /></Suspense>} />
        <Route path="integrations" element={<Suspense fallback={<V3PageLoader />}><IntegrationsPage /></Suspense>} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="audit" element={<AuditLogPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Routes>
    </V3AdminLayout>
  );
};

export default V3AdminDashboard;
