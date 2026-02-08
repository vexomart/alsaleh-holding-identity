/**
 * V3 Customer Dashboard - Modern SaaS Architecture
 * Pure V3 Design System - No Legacy Components
 * RTL-First with Unified Theme
 */

import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { V3CustomerLayout } from '@/components/v3/layouts/V3CustomerLayout';
import { V3CustomerOverview } from '@/components/v3/pages/V3CustomerOverview';
import '@/styles/v3/modern-theme.css';

// Page imports - These will receive V3 wrapper automatically from layout
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

// V3 Modern Loader - Minimal shimmer
const V3PageLoader = () => (
  <div className="modern-page-loader">
    <div className="modern-loader-spinner" />
  </div>
);

const V3CustomerDashboard = () => {
  return (
    <V3CustomerLayout>
      <Routes>
        {/* Main Routes - V3 Overview */}
        <Route index element={<V3CustomerOverview />} />
        
        {/* Main Pages */}
        <Route path="client-hub" element={<ClientHubPage />} />
        <Route path="orders" element={<CustomerOrdersList />} />
        <Route path="services" element={<CustomerServices />} />
        <Route path="services/:category" element={<CustomerCategoryServices />} />
        <Route path="service/:serviceId" element={<CustomerServiceDetails />} />
        
        {/* Documents */}
        <Route path="contracts" element={<CustomerContractsCenter />} />
        <Route path="contracts/:id" element={<CustomerContractDetails />} />
        <Route path="contracts/:id/sign" element={<ContractSigningPage />} />
        <Route path="invoices" element={<CustomerInvoicesCenter />} />
        
        {/* Finance Routes */}
        <Route path="wallet" element={<CustomerWallet />} />
        <Route path="transactions" element={<CustomerTransactions />} />
        <Route path="referrals" element={<Suspense fallback={<V3PageLoader />}><CustomerReferralsPage /></Suspense>} />
        <Route path="finance" element={<FinanceCenter />} />
        <Route path="finance/apply" element={<Suspense fallback={<V3PageLoader />}><NewFinanceApplicationPage /></Suspense>} />
        <Route path="finance/entities/new" element={<Suspense fallback={<V3PageLoader />}><NewEntityPage /></Suspense>} />
        <Route path="finance/applications/:id" element={<Suspense fallback={<V3PageLoader />}><ApplicationDetailsPage /></Suspense>} />
        
        {/* Account Routes */}
        <Route path="notifications" element={<CustomerNotifications />} />
        <Route path="profile" element={<CustomerProfile />} />
        <Route path="security" element={<SecurityPage />} />
        <Route path="support" element={<CustomerSupport />} />
        <Route path="settings" element={<CustomerSettings />} />
        <Route path="version" element={<VersionPage />} />
      </Routes>
    </V3CustomerLayout>
  );
};

export default V3CustomerDashboard;
