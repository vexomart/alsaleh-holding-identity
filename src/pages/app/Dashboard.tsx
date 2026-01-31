/**
 * Customer Dashboard - Complete Implementation
 * 
 * STATUS: IMPLEMENTED
 * PHASE: MVP
 */

import { Routes, Route } from 'react-router-dom';
import { CustomerLayout } from '@/components/customer/CustomerLayout';
import { CustomerOverview } from '@/components/customer/CustomerOverview';
import { CustomerOrdersList } from '@/components/customer/CustomerOrdersList';
import { CustomerServices } from '@/components/customer/CustomerServices';
import { CustomerNotifications } from '@/components/customer/CustomerNotifications';
import { CustomerProfile } from '@/components/customer/CustomerProfile';

const CustomerDashboard = () => {
  return (
    <CustomerLayout>
      <Routes>
        {/* Main Routes */}
        <Route index element={<CustomerOverview />} />
        <Route path="orders" element={<CustomerOrdersList />} />
        <Route path="services" element={<CustomerServices />} />
        <Route path="notifications" element={<CustomerNotifications />} />
        <Route path="profile" element={<CustomerProfile />} />
      </Routes>
    </CustomerLayout>
  );
};

export default CustomerDashboard;
