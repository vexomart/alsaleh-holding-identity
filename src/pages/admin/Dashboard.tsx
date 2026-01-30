/**
 * Admin Dashboard - Phase 1
 * 
 * STATUS: Layout Implemented
 * PHASE: UI Shell with Routing
 */

import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from '@/components/admin';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { UsersManagement } from '@/components/admin/users/UsersManagement';
import { Card, CardContent } from '@/components/ui/card';

// Placeholder for other admin pages
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-[50vh]">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <p className="text-lg font-medium text-muted-foreground">{title}</p>
          <p className="text-sm text-muted-foreground/60 mt-2">
            قيد التطوير - Coming Soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="roles" element={<PlaceholderPage title="الأدوار والصلاحيات" />} />
        <Route path="services" element={<PlaceholderPage title="إدارة الخدمات" />} />
        <Route path="orders" element={<PlaceholderPage title="إدارة الطلبات" />} />
        <Route path="cms/*" element={<PlaceholderPage title="إدارة المحتوى" />} />
        <Route path="reports" element={<PlaceholderPage title="التقارير" />} />
        <Route path="notifications" element={<PlaceholderPage title="الإشعارات" />} />
        <Route path="audit" element={<PlaceholderPage title="سجل التدقيق" />} />
        <Route path="settings" element={<PlaceholderPage title="الإعدادات" />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;
