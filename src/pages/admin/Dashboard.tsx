import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Settings,
  Bell,
  FileText,
  Shield,
  Globe,
  Moon,
  Sun,
  LogOut,
  Menu,
  X,
  BarChart3,
  Layers,
  Package,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth, AuthProvider } from '@/hooks/useAuth';
import { useLanguage, LanguageProvider } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

// Admin Dashboard Pages (will be lazy loaded in production)
import AdminOverview from '@/pages/admin/Overview';
import AdminOrders from '@/pages/admin/Orders';
import AdminUsers from '@/pages/admin/Users';
import AdminServices from '@/pages/admin/Services';
import AdminReports from '@/pages/admin/Reports';
import AdminSettings from '@/pages/admin/Settings';

const navItems = [
  { id: 'overview', path: '', icon: LayoutDashboard, labelAr: 'نظرة عامة', labelEn: 'Overview' },
  { id: 'orders', path: 'orders', icon: ShoppingCart, labelAr: 'الطلبات', labelEn: 'Orders' },
  { id: 'users', path: 'users', icon: Users, labelAr: 'المستخدمين', labelEn: 'Users' },
  { id: 'services', path: 'services', icon: Package, labelAr: 'الخدمات', labelEn: 'Services' },
  { id: 'reports', path: 'reports', icon: BarChart3, labelAr: 'التقارير', labelEn: 'Reports' },
  { id: 'settings', path: 'settings', icon: Settings, labelAr: 'الإعدادات', labelEn: 'Settings' },
];

const AdminDashboardContent = () => {
  const { user, profile, isAdmin, signOut, isLoading } = useAuth();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect if not authenticated or not admin
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

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    navigate('/auth/login');
  };

  return (
    <div className={cn('min-h-screen flex bg-background', isRTL && 'flex-row-reverse')}>
      {/* Sidebar - Desktop */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 72 }}
        className={cn(
          'hidden lg:flex flex-col fixed h-screen z-40 transition-all duration-300',
          'bg-slate-900 text-white shadow-xl',
          isRTL ? 'right-0 border-l border-slate-800' : 'left-0 border-r border-slate-800'
        )}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <span className="font-bold text-white">ASH</span>
              </div>
              <div>
                <p className="font-semibold text-sm">{isRTL ? 'لوحة الإدارة' : 'Admin Panel'}</p>
                <p className="text-xs text-slate-400">{isRTL ? 'مستوى المدير' : 'Admin Level'}</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {sidebarOpen ? (
              isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />
            ) : (
              isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  onClick={() => navigate(`/admin/${item.path}`)}
                  className={cn(
                    'w-full justify-start gap-3 h-11 text-slate-300 hover:text-white hover:bg-slate-800',
                    location.pathname === `/admin/${item.path}` && 'bg-slate-800 text-white',
                    !sidebarOpen && 'justify-center px-2'
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {sidebarOpen && (
                    <span className="truncate">{isRTL ? item.labelAr : item.labelEn}</span>
                  )}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              'w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-900/20',
              !sidebarOpen && 'justify-center'
            )}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>{isRTL ? 'تسجيل الخروج' : 'Logout'}</span>}
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 min-h-screen transition-all duration-300',
          sidebarOpen ? (isRTL ? 'lg:mr-[260px]' : 'lg:ml-[260px]') : (isRTL ? 'lg:mr-[72px]' : 'lg:ml-[72px]')
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b">
          <div className="flex items-center justify-between px-4 lg:px-6 h-16">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            <h1 className="text-lg font-semibold hidden lg:block">
              {isRTL ? 'لوحة الإدارة' : 'Admin Dashboard'}
            </h1>

            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              >
                <Globe className="w-4 h-4 me-1" />
                {language === 'ar' ? 'EN' : 'عربي'}
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              {/* Notifications */}
              <Button variant="outline" size="icon" className="relative">
                <Bell className="w-4 h-4" />
                <Badge className="absolute -top-1 -end-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                  3
                </Badge>
              </Button>

              {/* User Menu */}
              <div className="flex items-center gap-2 ms-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || ''} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden md:block">
                  {profile?.full_name || user?.email?.split('@')[0]}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6" dir={isRTL ? 'rtl' : 'ltr'}>
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/orders" element={<AdminOrders />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/services" element={<AdminServices />} />
            <Route path="/reports" element={<AdminReports />} />
            <Route path="/settings" element={<AdminSettings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AdminDashboardContent />
      </LanguageProvider>
    </AuthProvider>
  );
};

export default AdminDashboard;
