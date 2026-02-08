/**
 * V3 Admin Dashboard - Modern SaaS Architecture
 * Pure V3 Design System - No Legacy Components
 * RTL-First with Unified Theme
 */

import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { V3AdminLayout } from '@/components/v3/layouts/V3AdminLayout';
import { V3AdminOverview } from '@/components/v3/pages/V3AdminOverview';
import '@/styles/v3/modern-theme.css';

// Page imports - These will receive V3 wrapper automatically from layout
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

// V3 Modern Loader - Minimal shimmer
const V3PageLoader = () => (
  <div className="modern-page-loader">
    <div className="modern-loader-spinner" />
  </div>
);

const V3AdminDashboard = () => {
  return (
    <V3AdminLayout>
      <Routes>
        {/* Main Routes - V3 Overview */}
        <Route index element={<V3AdminOverview />} />
        
        {/* User Management Routes */}
        <Route path="users" element={<UsersManagement />} />
        <Route path="users/new" element={<Suspense fallback={<V3PageLoader />}><AddUserPage /></Suspense>} />
        <Route path="users/:id" element={<Suspense fallback={<V3PageLoader />}><UserDetailsPage /></Suspense>} />
        <Route path="users/:id/edit" element={<Suspense fallback={<V3PageLoader />}><UserEditPage /></Suspense>} />
        
        {/* Operations Routes */}
        <Route path="roles" element={<RolesPermissions />} />
        <Route path="clients/:id" element={<AdminClientHub />} />
        <Route path="services" element={<ServicesManagement />} />
        <Route path="orders" element={<OrdersManagement />} />
        <Route path="orders/:id" element={<Suspense fallback={<V3PageLoader />}><OrderDetailsPage /></Suspense>} />
        <Route path="contracts" element={<ContractsManagement />} />
        <Route path="contracts/:id" element={<Suspense fallback={<V3PageLoader />}><ContractDetailsPage /></Suspense>} />
        
        {/* Finance Routes */}
        <Route path="wallets" element={<WalletsManagement />} />
        <Route path="wallets/:id" element={<WalletDetailsPage />} />
        <Route path="finance" element={<FinanceCenter />} />
        <Route path="finance-internal" element={<FinanceManagement />} />
        <Route path="referrals" element={<Suspense fallback={<V3PageLoader />}><AdminReferralsPage /></Suspense>} />
        
        {/* System Routes */}
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
