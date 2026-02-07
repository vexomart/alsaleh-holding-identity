/**
 * V3 Customer Dashboard - Unified Light Theme
 * Modern SaaS Style with Collapsible Sidebar
 */

import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy, ReactNode } from 'react';
import { V3CustomerLayout } from '@/components/v3/layouts/V3CustomerLayout';
import { V3CustomerOverview } from '@/components/v3/pages/V3CustomerOverview';
import '@/styles/v3/light-theme.css';

// Keep existing page imports for functionality
import { CustomerOrdersList } from '@/components/customer/CustomerOrdersList';
import { CustomerServices } from '@/components/customer/CustomerServices';
import { CustomerCategoryServices } from '@/components/customer/CustomerCategoryServices';
import { CustomerServiceDetails } from '@/components/customer/CustomerServiceDetails';
import { CustomerNotifications } from '@/components/customer/CustomerNotifications';
import { CustomerProfile } from '@/components/customer/CustomerProfile';
import { CustomerWallet } from '@/components/customer/CustomerWallet';
import { CustomerTransactions } from '@/components/customer/CustomerTransactions';
import { CustomerSupport } from '@/components/customer/CustomerSupport';
import { CustomerSettings } from '@/components/customer/CustomerSettings';
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

const V3CustomerDashboard = () => {
  return (
    <V3CustomerLayout>
      <Routes>
        {/* Main Routes - V3 Overview (Native V3) */}
        <Route index element={<V3CustomerOverview />} />
        
        {/* All pages wrapped for consistency */}
        <Route path="client-hub" element={<PageWrapper><ClientHubPage /></PageWrapper>} />
        <Route path="orders" element={<PageWrapper><CustomerOrdersList /></PageWrapper>} />
        <Route path="services" element={<PageWrapper><CustomerServices /></PageWrapper>} />
        <Route path="services/:category" element={<PageWrapper><CustomerCategoryServices /></PageWrapper>} />
        <Route path="service/:serviceId" element={<PageWrapper><CustomerServiceDetails /></PageWrapper>} />
        <Route path="contracts" element={<PageWrapper><CustomerContractsCenter /></PageWrapper>} />
        <Route path="contracts/:id" element={<PageWrapper><CustomerContractDetails /></PageWrapper>} />
        <Route path="contracts/:id/sign" element={<PageWrapper><ContractSigningPage /></PageWrapper>} />
        <Route path="invoices" element={<PageWrapper><CustomerInvoicesCenter /></PageWrapper>} />
        <Route path="wallet" element={<PageWrapper><CustomerWallet /></PageWrapper>} />
        <Route path="transactions" element={<PageWrapper><CustomerTransactions /></PageWrapper>} />
        <Route path="referrals" element={<PageWrapper><Suspense fallback={<V3PageLoader />}><CustomerReferralsPage /></Suspense></PageWrapper>} />
        <Route path="finance" element={<PageWrapper><FinanceCenter /></PageWrapper>} />
        <Route path="finance/apply" element={<PageWrapper><Suspense fallback={<V3PageLoader />}><NewFinanceApplicationPage /></Suspense></PageWrapper>} />
        <Route path="finance/entities/new" element={<PageWrapper><Suspense fallback={<V3PageLoader />}><NewEntityPage /></Suspense></PageWrapper>} />
        <Route path="finance/applications/:id" element={<PageWrapper><Suspense fallback={<V3PageLoader />}><ApplicationDetailsPage /></Suspense></PageWrapper>} />
        <Route path="notifications" element={<PageWrapper><CustomerNotifications /></PageWrapper>} />
        <Route path="profile" element={<PageWrapper><CustomerProfile /></PageWrapper>} />
        <Route path="security" element={<PageWrapper><SecurityPage /></PageWrapper>} />
        <Route path="support" element={<PageWrapper><CustomerSupport /></PageWrapper>} />
        <Route path="settings" element={<PageWrapper><CustomerSettings /></PageWrapper>} />
        <Route path="version" element={<PageWrapper><VersionPage /></PageWrapper>} />
      </Routes>
    </V3CustomerLayout>
  );
};

export default V3CustomerDashboard;
