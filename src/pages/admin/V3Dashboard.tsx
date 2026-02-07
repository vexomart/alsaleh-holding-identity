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
 * Legacy Page Wrapper
 * Provides a light-mode container for legacy shadcn pages
 * within the dark Command Center layout
 */
const LegacyPageWrapper = ({ children }: { children: ReactNode }) => (
  <div 
    className="legacy-page-container"
    style={{
      background: 'hsl(0 0% 100%)',
      borderRadius: 'var(--v3-radius-xl)',
      padding: 'var(--v3-space-6)',
      minHeight: 'calc(100vh - 8rem)',
      boxShadow: '0 4px 24px hsl(0 0% 0% / 0.2)',
      // Reset text colors for light mode
      color: 'hsl(222 47% 11%)',
    }}
  >
    {/* Override dark mode variables for legacy content */}
    <style>{`
      .legacy-page-container {
        --background: 0 0% 100%;
        --foreground: 222.2 84% 4.9%;
        --card: 0 0% 100%;
        --card-foreground: 222.2 84% 4.9%;
        --popover: 0 0% 100%;
        --popover-foreground: 222.2 84% 4.9%;
        --primary: 222 47% 18%;
        --primary-foreground: 210 40% 98%;
        --secondary: 210 40% 96.1%;
        --secondary-foreground: 222.2 47.4% 11.2%;
        --muted: 210 40% 96.1%;
        --muted-foreground: 215.4 16.3% 46.9%;
        --accent: 210 40% 96.1%;
        --accent-foreground: 222.2 47.4% 11.2%;
        --destructive: 0 84.2% 60.2%;
        --destructive-foreground: 210 40% 98%;
        --border: 214.3 31.8% 91.4%;
        --input: 214.3 31.8% 91.4%;
        --ring: 222 47% 18%;
      }
      .legacy-page-container * {
        border-color: hsl(214.3 31.8% 91.4%);
      }
      .legacy-page-container .bg-background {
        background: hsl(0 0% 100%) !important;
      }
      .legacy-page-container .text-foreground {
        color: hsl(222.2 84% 4.9%) !important;
      }
      .legacy-page-container .bg-card {
        background: hsl(0 0% 100%) !important;
      }
      .legacy-page-container .text-card-foreground {
        color: hsl(222.2 84% 4.9%) !important;
      }
      .legacy-page-container .bg-muted {
        background: hsl(210 40% 96.1%) !important;
      }
      .legacy-page-container .text-muted-foreground {
        color: hsl(215.4 16.3% 46.9%) !important;
      }
      .legacy-page-container .border {
        border-color: hsl(214.3 31.8% 91.4%) !important;
      }
      .legacy-page-container input,
      .legacy-page-container select,
      .legacy-page-container textarea {
        background: hsl(0 0% 100%) !important;
        color: hsl(222.2 84% 4.9%) !important;
        border-color: hsl(214.3 31.8% 91.4%) !important;
      }
      .legacy-page-container button {
        color: inherit;
      }
      .legacy-page-container .bg-white {
        background: hsl(0 0% 100%) !important;
      }
      .legacy-page-container [class*="skeleton"] {
        background: hsl(210 40% 96.1%) !important;
      }
    `}</style>
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
