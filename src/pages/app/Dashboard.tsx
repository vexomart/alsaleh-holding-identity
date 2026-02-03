/**
 * Customer Dashboard - World-Class Client Hub
 * Mobile-First App-like Experience
 * 
 * STATUS: IMPLEMENTED
 * PHASE: MVP - Premium Experience
 */

import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { CustomerLayout } from '@/components/customer/CustomerLayoutV2';
import { ClientHub } from '@/components/customer/ClientHub';
import { CustomerOrdersList } from '@/components/customer/CustomerOrdersList';
import { CustomerServices } from '@/components/customer/services';
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
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Finance Pages
const NewFinanceApplicationPage = lazy(() => import('@/pages/app/finance/NewApplicationPage'));
const NewEntityPage = lazy(() => import('@/pages/app/finance/NewEntityPage'));
const ApplicationDetailsPage = lazy(() => import('@/pages/app/finance/ApplicationDetailsPage'));

// Referrals Page
const CustomerReferralsPage = lazy(() => import('@/components/customer/referrals/CustomerReferralsPage'));

const PageLoader = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center justify-center min-h-[400px]"
  >
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-pulse" />
        <Loader2 className="h-8 w-8 animate-spin text-primary relative" />
      </div>
      <span className="text-sm text-muted-foreground">Loading...</span>
    </div>
  </motion.div>
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
        <Route path="contracts/:id/sign" element={<ContractSigningPage />} />
        <Route path="invoices" element={<CustomerInvoicesCenter />} />
        <Route path="wallet" element={<CustomerWallet />} />
        <Route path="transactions" element={<CustomerTransactions />} />
        
        {/* Referrals */}
        <Route path="referrals" element={<Suspense fallback={<PageLoader />}><CustomerReferralsPage /></Suspense>} />
        
        {/* Finance Routes */}
        <Route path="finance" element={<FinanceCenter />} />
        <Route path="finance/apply" element={<Suspense fallback={<PageLoader />}><NewFinanceApplicationPage /></Suspense>} />
        <Route path="finance/entities/new" element={<Suspense fallback={<PageLoader />}><NewEntityPage /></Suspense>} />
        <Route path="finance/applications/:id" element={<Suspense fallback={<PageLoader />}><ApplicationDetailsPage /></Suspense>} />
        
        <Route path="notifications" element={<CustomerNotifications />} />
        <Route path="profile" element={<CustomerProfile />} />
        <Route path="version" element={<VersionPage />} />
      </Routes>
    </CustomerLayout>
  );
};

export default CustomerDashboard;
