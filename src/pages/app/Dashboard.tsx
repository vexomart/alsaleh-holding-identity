import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, ShoppingCart, Bell, Settings, LogOut, Menu, X, Globe, Moon, Sun, MessageSquare, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth, AuthProvider } from '@/hooks/useAuth';
import { useLanguage, LanguageProvider } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useOrders } from '@/hooks/useOrders';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-500',
  processing: 'bg-blue-500/10 text-blue-500',
  in_progress: 'bg-purple-500/10 text-purple-500',
  completed: 'bg-emerald-500/10 text-emerald-500',
  cancelled: 'bg-red-500/10 text-red-500',
};

const statusLabels: Record<string, { ar: string; en: string }> = {
  pending: { ar: 'قيد الانتظار', en: 'Pending' },
  processing: { ar: 'قيد المعالجة', en: 'Processing' },
  in_progress: { ar: 'قيد التنفيذ', en: 'In Progress' },
  completed: { ar: 'مكتمل', en: 'Completed' },
  cancelled: { ar: 'ملغي', en: 'Cancelled' },
};

const CustomerOverview = () => {
  const { isRTL } = useLanguage();
  const { user } = useAuth();
  const { orders, loading } = useOrders({ customerId: user?.id });

  const stats = {
    total: orders.length,
    inProgress: orders.filter(o => o.status === 'in_progress' || o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{isRTL ? 'لوحة التحكم' : 'Dashboard'}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: isRTL ? 'طلباتي' : 'My Orders', value: stats.total },
          { label: isRTL ? 'قيد التنفيذ' : 'In Progress', value: stats.inProgress },
          { label: isRTL ? 'مكتملة' : 'Completed', value: stats.completed },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6 text-center">
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
              )}
              <p className="text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">{isRTL ? 'آخر الطلبات' : 'Recent Orders'}</h3>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              {isRTL ? 'لا توجد طلبات بعد' : 'No orders yet'}
            </p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{order.order_number}</p>
                    <p className="text-sm text-muted-foreground">{order.title}</p>
                  </div>
                  <Badge className={statusColors[order.status]}>
                    {isRTL ? statusLabels[order.status]?.ar : statusLabels[order.status]?.en || order.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const CustomerOrders = () => {
  const { isRTL } = useLanguage();
  const { user } = useAuth();
  const { orders, loading } = useOrders({ customerId: user?.id });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{isRTL ? 'طلباتي' : 'My Orders'}</h2>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {isRTL ? 'لا توجد طلبات بعد' : 'No orders yet'}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-lg">{order.order_number}</p>
                    <p className="text-muted-foreground">{order.title}</p>
                    {order.total_amount && (
                      <p className="text-primary font-semibold mt-2">
                        {order.total_amount} {isRTL ? 'ريال' : 'SAR'}
                      </p>
                    )}
                  </div>
                  <Badge className={statusColors[order.status]}>
                    {isRTL ? statusLabels[order.status]?.ar : statusLabels[order.status]?.en || order.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const navItems = [
  { id: 'overview', path: '', icon: LayoutDashboard, labelAr: 'الرئيسية', labelEn: 'Overview' },
  { id: 'orders', path: 'orders', icon: ShoppingCart, labelAr: 'طلباتي', labelEn: 'My Orders' },
  { id: 'support', path: 'support', icon: MessageSquare, labelAr: 'الدعم', labelEn: 'Support' },
  { id: 'settings', path: 'settings', icon: Settings, labelAr: 'الإعدادات', labelEn: 'Settings' },
];

const CustomerDashboardContent = () => {
  const { user, profile, signOut, isLoading } = useAuth();
  const { language, setLanguage, isRTL } = useLanguage();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={cn('min-h-screen flex bg-background', isRTL && 'flex-row-reverse')}>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 72 }}
        className={cn(
          'hidden lg:flex flex-col fixed h-screen z-40 bg-card border-e shadow-sm',
          isRTL ? 'right-0' : 'left-0'
        )}
      >
        <div className="p-4 flex items-center justify-between border-b">
          {sidebarOpen && <span className="font-bold">{isRTL ? 'لوحة العميل' : 'Customer'}</span>}
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
        <nav className="flex-1 p-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => navigate(`/app/${item.path}`)}
              className={cn('w-full justify-start gap-3 mb-1', !sidebarOpen && 'justify-center')}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span>{isRTL ? item.labelAr : item.labelEn}</span>}
            </Button>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" onClick={() => { signOut(); navigate('/auth/login'); }} className={cn('w-full justify-start gap-3 text-red-500', !sidebarOpen && 'justify-center')}>
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>{isRTL ? 'خروج' : 'Logout'}</span>}
          </Button>
        </div>
      </motion.aside>

      {/* Main */}
      <main className={cn('flex-1 min-h-screen', sidebarOpen ? (isRTL ? 'lg:mr-[240px]' : 'lg:ml-[240px]') : (isRTL ? 'lg:mr-[72px]' : 'lg:ml-[72px]'))}>
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b h-16 flex items-center justify-between px-4">
          <h1 className="font-semibold">{isRTL ? 'مرحباً' : 'Welcome'}, {profile?.full_name || user?.email?.split('@')[0]}</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}>
              <Globe className="w-4 h-4 me-1" />{language === 'ar' ? 'EN' : 'عربي'}
            </Button>
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </header>
        <div className="p-4 lg:p-6" dir={isRTL ? 'rtl' : 'ltr'}>
          <Routes>
            <Route path="/" element={<CustomerOverview />} />
            <Route path="/orders" element={<CustomerOrders />} />
            <Route path="/support" element={<div className="text-center py-20 text-muted-foreground">{isRTL ? 'صفحة الدعم' : 'Support Page'}</div>} />
            <Route path="/settings" element={<div className="text-center py-20 text-muted-foreground">{isRTL ? 'صفحة الإعدادات' : 'Settings Page'}</div>} />
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const CustomerDashboard = () => (
  <AuthProvider>
    <LanguageProvider>
      <CustomerDashboardContent />
    </LanguageProvider>
  </AuthProvider>
);

export default CustomerDashboard;
