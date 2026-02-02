/**
 * Customer Dashboard - World-Class Client Hub
 * 
 * STATUS: IMPLEMENTED
 * PHASE: MVP - Premium Experience
 */

import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { CustomerLayout } from '@/components/customer/CustomerLayout';
import { ClientHub } from '@/components/customer/ClientHub';
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
import { CustomerInvoicesCenter } from '@/components/customer/invoices';
import { FinanceCenter } from '@/components/finance/customer/FinanceCenter';
import ClientHubPage from '@/pages/customer/ClientHubPage';
import VersionPage from '@/pages/app/Version';
import { Loader2 } from 'lucide-react';

// Finance Pages
const NewFinanceApplicationPage = lazy(() => import('@/pages/app/finance/NewApplicationPage'));
const NewEntityPage = lazy(() => import('@/pages/app/finance/NewEntityPage'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const CustomerDashboard = () => {
  return (
    <CustomerLayout>
      <Routes>
        {/* Main Routes */}
        <Route index element={<ClientHub />} />
        <Route path="client-hub" element={<ClientHubPage />} />
        <Route path="orders" element={<CustomerOrdersList />} />
        <Route path="services" element={<CustomerServices />} />
        <Route path="services/:category" element={<CustomerCategoryServices />} />
        <Route path="service/:serviceId" element={<CustomerServiceDetails />} />
        <Route path="contracts" element={<CustomerContractsCenter />} />
        <Route path="contracts/:id" element={<CustomerContractDetails />} />
        <Route path="invoices" element={<CustomerInvoicesCenter />} />
        <Route path="wallet" element={<CustomerWallet />} />
        <Route path="transactions" element={<CustomerTransactions />} />
        
        {/* Finance Routes */}
        <Route path="finance" element={<FinanceCenter />} />
        <Route path="finance/apply" element={<Suspense fallback={<PageLoader />}><NewFinanceApplicationPage /></Suspense>} />
        <Route path="finance/entities/new" element={<Suspense fallback={<PageLoader />}><NewEntityPage /></Suspense>} />
        
        <Route path="notifications" element={<CustomerNotifications />} />
        <Route path="profile" element={<CustomerProfile />} />
        <Route path="version" element={<VersionPage />} />
      </Routes>
    </CustomerLayout>
  );
};

export default CustomerDashboard;
