/**
 * V3 Customer Dashboard - Banking Portal
 * 100% Custom - NO SHADCN
 * 
 * STATUS: V3 REBUILD
 */

import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
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
      background: 'hsl(220 20% 98%)',
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

const V3CustomerDashboard = () => {
  return (
    <V3CustomerLayout>
      <Routes>
        {/* Main Routes - V3 Overview */}
        <Route index element={<V3CustomerOverview />} />
        
        {/* Keep existing routes for functionality */}
        <Route path="client-hub" element={<ClientHubPage />} />
        <Route path="orders" element={<CustomerOrdersList />} />
        <Route path="services" element={<CustomerServices />} />
        <Route path="services/:category" element={<CustomerCategoryServices />} />
        <Route path="service/:serviceId" element={<CustomerServiceDetails />} />
        <Route path="contracts" element={<CustomerContractsCenter />} />
        <Route path="contracts/:id" element={<CustomerContractDetails />} />
        <Route path="contracts/:id/sign" element={<ContractSigningPage />} />
        <Route path="invoices" element={<CustomerInvoicesCenter />} />
        <Route path="wallet" element={<CustomerWallet />} />
        <Route path="transactions" element={<CustomerTransactions />} />
        <Route path="referrals" element={<Suspense fallback={<V3PageLoader />}><CustomerReferralsPage /></Suspense>} />
        <Route path="finance" element={<FinanceCenter />} />
        <Route path="finance/apply" element={<Suspense fallback={<V3PageLoader />}><NewFinanceApplicationPage /></Suspense>} />
        <Route path="finance/entities/new" element={<Suspense fallback={<V3PageLoader />}><NewEntityPage /></Suspense>} />
        <Route path="finance/applications/:id" element={<Suspense fallback={<V3PageLoader />}><ApplicationDetailsPage /></Suspense>} />
        <Route path="notifications" element={<CustomerNotifications />} />
        <Route path="profile" element={<CustomerProfile />} />
        <Route path="security" element={<SecurityPage />} />
        <Route path="version" element={<VersionPage />} />
      </Routes>
    </V3CustomerLayout>
  );
};

export default V3CustomerDashboard;
