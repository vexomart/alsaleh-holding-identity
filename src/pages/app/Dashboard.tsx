import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, ShoppingCart, Bell, Settings, LogOut, Menu, X, Plus, Globe, Moon, Sun, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, AuthProvider } from '@/hooks/useAuth';
import { useLanguage, LanguageProvider } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

const CustomerOverview = () => {
  const { isRTL } = useLanguage();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{isRTL ? 'لوحة التحكم' : 'Dashboard'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: isRTL ? 'طلباتي' : 'My Orders', value: '5' },
          { label: isRTL ? 'قيد التنفيذ' : 'In Progress', value: '2' },
          { label: isRTL ? 'مكتملة' : 'Completed', value: '3' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
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
            <Route path="/orders" element={<div className="text-center py-20 text-muted-foreground">{isRTL ? 'صفحة الطلبات' : 'Orders Page'}</div>} />
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
