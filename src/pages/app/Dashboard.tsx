/**
 * Customer Dashboard - World-Class Client Hub
 * 
 * STATUS: IMPLEMENTED
 * PHASE: MVP - Premium Experience
 */

import { Routes, Route } from 'react-router-dom';
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

const CustomerDashboard = () => {
  return (
    <CustomerLayout>
      <Routes>
        {/* Main Routes */}
        <Route index element={<ClientHub />} />
        <Route path="orders" element={<CustomerOrdersList />} />
        <Route path="services" element={<CustomerServices />} />
        <Route path="services/:category" element={<CustomerCategoryServices />} />
        <Route path="service/:serviceId" element={<CustomerServiceDetails />} />
        <Route path="contracts" element={<CustomerContractsCenter />} />
        <Route path="contracts/:id" element={<CustomerContractDetails />} />
        <Route path="wallet" element={<CustomerWallet />} />
        <Route path="transactions" element={<CustomerTransactions />} />
        <Route path="notifications" element={<CustomerNotifications />} />
        <Route path="profile" element={<CustomerProfile />} />
      </Routes>
    </CustomerLayout>
  );
};

export default CustomerDashboard;
