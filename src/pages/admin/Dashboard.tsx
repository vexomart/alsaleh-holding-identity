/**
 * Admin Dashboard - Phase 1
 * 
 * STATUS: Layout Implemented
 * PHASE: UI Shell with Routing
 */

import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from '@/components/admin';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingCart, Package, TrendingUp } from 'lucide-react';

// Placeholder Overview component
function AdminOverview() {
  const { language } = useLanguage();
  
  const stats = [
    {
      titleAr: "إجمالي المستخدمين",
      titleEn: "Total Users",
      value: "0",
      icon: Users,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    },
    {
      titleAr: "الطلبات",
      titleEn: "Orders",
      value: "0",
      icon: ShoppingCart,
      color: "text-green-600 bg-green-100 dark:bg-green-900/30",
    },
    {
      titleAr: "الخدمات",
      titleEn: "Services",
      value: "0",
      icon: Package,
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
    },
    {
      titleAr: "الإيرادات",
      titleEn: "Revenue",
      value: "0",
      icon: TrendingUp,
      color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {language === "ar" ? "مرحباً بك في لوحة الإدارة" : "Welcome to Admin Dashboard"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === "ar" 
            ? "إليك نظرة عامة على نظامك" 
            : "Here's an overview of your system"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {language === "ar" ? stat.titleAr : stat.titleEn}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === "ar" ? "المحتوى قريباً" : "Content Coming Soon"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {language === "ar" 
              ? "سيتم إضافة المزيد من الميزات والمحتوى في المراحل القادمة."
              : "More features and content will be added in upcoming phases."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

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
        <Route path="users" element={<PlaceholderPage title="إدارة المستخدمين" />} />
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
