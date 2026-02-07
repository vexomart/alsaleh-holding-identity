/**
 * Admin Dashboard - Enterprise Grade Design
 * Uses AdminLayout with unified Header/Footer
 */

import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AdminLayout } from '@/components/admin';
import { AdminOverview } from '@/components/admin/AdminOverview';
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
import { Loader2 } from 'lucide-react';

// Lazy load pages
const AdminReferralsPage = lazy(() => import('@/components/admin/referrals/AdminReferralsPage'));
const IntegrationsPage = lazy(() => import('@/components/admin/integrations/IntegrationsPage'));

// Page loader
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Routes>
        {/* Main Routes */}
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="roles" element={<RolesPermissions />} />
        
        {/* Client Hub Route */}
        <Route path="clients/:id" element={<AdminClientHub />} />
        
        {/* Business Routes */}
        <Route path="services" element={<ServicesManagement />} />
        <Route path="orders" element={<OrdersManagement />} />
        <Route path="contracts" element={<ContractsManagement />} />
        <Route path="wallets" element={<WalletsManagement />} />
        <Route path="wallets/:id" element={<WalletDetailsPage />} />
        <Route path="finance" element={<FinanceCenter />} />
        <Route path="finance-internal" element={<FinanceManagement />} />
        
        {/* Referrals Management */}
        <Route path="referrals" element={<Suspense fallback={<PageLoader />}><AdminReferralsPage /></Suspense>} />
        
        {/* Integrations Management */}
        <Route path="integrations" element={<Suspense fallback={<PageLoader />}><IntegrationsPage /></Suspense>} />
        
        {/* System Routes */}
        <Route path="reports" element={<ReportsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="audit" element={<AuditLogPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;
