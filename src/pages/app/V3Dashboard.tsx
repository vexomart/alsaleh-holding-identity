/**
 * V3 Customer Dashboard - Banking Portal
 * 100% Custom - NO SHADCN
 * 
 * STATUS: V3 REBUILD
 */

import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy, ReactNode } from 'react';
import { V3CustomerLayout } from '@/components/v3/layouts/V3CustomerLayout';
import { V3CustomerOverview } from '@/components/v3/pages/V3CustomerOverview';

// Keep existing page imports for functionality
import { CustomerOrdersList } from '@/components/customer/CustomerOrdersList';
import { CustomerServices } from '@/components/customer/CustomerServices';
import { CustomerCategoryServices } from '@/components/customer/CustomerCategoryServices';
import { CustomerServiceDetails } from '@/components/customer/CustomerServiceDetails';
import { CustomerNotifications } from '@/components/customer/CustomerNotifications';
import { CustomerProfile } from '@/components/customer/CustomerProfile';
import { CustomerWallet } from '@/components/customer/CustomerWallet';
import { CustomerTransactions } from '@/components/customer/CustomerTransactions';
import { CustomerContractsCenter } from '@/components/customer/contracts';
import { CustomerContractDetails } from '@/components/customer/CustomerContractDetails';
import { ContractSigningPage } from '@/components/customer/contracts/ContractSigningPage';
import { CustomerInvoicesCenter } from '@/components/customer/invoices';
import { FinanceCenter } from '@/components/finance/customer/FinanceCenter';
import ClientHubPage from '@/pages/customer/ClientHubPage';
import VersionPage from '@/pages/app/Version';
import SecurityPage from '@/pages/app/SecurityPage';

// Finance Pages
const NewFinanceApplicationPage = lazy(() => import('@/pages/app/finance/NewApplicationPage'));
const NewEntityPage = lazy(() => import('@/pages/app/finance/NewEntityPage'));
const ApplicationDetailsPage = lazy(() => import('@/pages/app/finance/ApplicationDetailsPage'));

// Referrals Page
const CustomerReferralsPage = lazy(() => import('@/components/customer/referrals/CustomerReferralsPage'));

// V3 Loader - Banking Style
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
          border: '3px solid hsl(222 60% 25% / 0.2)',
          borderTopColor: 'hsl(222 60% 25%)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  </div>
);

/**
 * Legacy Page Wrapper for Customer Dashboard
 * Banking Portal already has light theme, but we ensure consistency
 */
const LegacyPageWrapper = ({ children }: { children: ReactNode }) => (
  <div 
    className="legacy-customer-page"
    style={{
      background: 'hsl(0 0% 100%)',
      borderRadius: 'var(--v3-radius-xl)',
      padding: 'var(--v3-space-5)',
      minHeight: 'calc(100vh - 10rem)',
      boxShadow: 'var(--bank-shadow-sm)',
    }}
  >
    <style>{`
      .legacy-customer-page {
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
        --border: 214.3 31.8% 91.4%;
        --input: 214.3 31.8% 91.4%;
      }
    `}</style>
    {children}
  </div>
);

const V3CustomerDashboard = () => {
  return (
    <V3CustomerLayout>
      <Routes>
        {/* Main Routes - V3 Overview (Native V3) */}
        <Route index element={<V3CustomerOverview />} />
        
        {/* Legacy pages wrapped for compatibility */}
        <Route path="client-hub" element={<LegacyPageWrapper><ClientHubPage /></LegacyPageWrapper>} />
        <Route path="orders" element={<LegacyPageWrapper><CustomerOrdersList /></LegacyPageWrapper>} />
        <Route path="services" element={<LegacyPageWrapper><CustomerServices /></LegacyPageWrapper>} />
        <Route path="services/:category" element={<LegacyPageWrapper><CustomerCategoryServices /></LegacyPageWrapper>} />
        <Route path="service/:serviceId" element={<LegacyPageWrapper><CustomerServiceDetails /></LegacyPageWrapper>} />
        <Route path="contracts" element={<LegacyPageWrapper><CustomerContractsCenter /></LegacyPageWrapper>} />
        <Route path="contracts/:id" element={<LegacyPageWrapper><CustomerContractDetails /></LegacyPageWrapper>} />
        <Route path="contracts/:id/sign" element={<LegacyPageWrapper><ContractSigningPage /></LegacyPageWrapper>} />
        <Route path="invoices" element={<LegacyPageWrapper><CustomerInvoicesCenter /></LegacyPageWrapper>} />
        <Route path="wallet" element={<LegacyPageWrapper><CustomerWallet /></LegacyPageWrapper>} />
        <Route path="transactions" element={<LegacyPageWrapper><CustomerTransactions /></LegacyPageWrapper>} />
        <Route path="referrals" element={<LegacyPageWrapper><Suspense fallback={<V3PageLoader />}><CustomerReferralsPage /></Suspense></LegacyPageWrapper>} />
        <Route path="finance" element={<LegacyPageWrapper><FinanceCenter /></LegacyPageWrapper>} />
        <Route path="finance/apply" element={<LegacyPageWrapper><Suspense fallback={<V3PageLoader />}><NewFinanceApplicationPage /></Suspense></LegacyPageWrapper>} />
        <Route path="finance/entities/new" element={<LegacyPageWrapper><Suspense fallback={<V3PageLoader />}><NewEntityPage /></Suspense></LegacyPageWrapper>} />
        <Route path="finance/applications/:id" element={<LegacyPageWrapper><Suspense fallback={<V3PageLoader />}><ApplicationDetailsPage /></Suspense></LegacyPageWrapper>} />
        <Route path="notifications" element={<LegacyPageWrapper><CustomerNotifications /></LegacyPageWrapper>} />
        <Route path="profile" element={<LegacyPageWrapper><CustomerProfile /></LegacyPageWrapper>} />
        <Route path="security" element={<LegacyPageWrapper><SecurityPage /></LegacyPageWrapper>} />
        <Route path="version" element={<LegacyPageWrapper><VersionPage /></LegacyPageWrapper>} />
      </Routes>
    </V3CustomerLayout>
  );
};

export default V3CustomerDashboard;
