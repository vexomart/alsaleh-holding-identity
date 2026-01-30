import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Shield,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Globe,
  LogOut,
  Activity,
  Server,
  FileText,
  DollarSign,
  Database,
  Lock,
  AlertTriangle,
  Zap,
  TrendingUp,
  Building2,
  Layers,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  notificationCount: number;
  alertCount: number;
}

const mainNavItems = [
  { id: 'overview', icon: LayoutDashboard, labelEn: 'Executive Overview', labelAr: 'النظرة التنفيذية' },
  { id: 'analytics', icon: BarChart3, labelEn: 'Analytics', labelAr: 'التحليلات' },
  { id: 'finance', icon: DollarSign, labelEn: 'Financial Reports', labelAr: 'التقارير المالية' },
  { id: 'investments', icon: TrendingUp, labelEn: 'Investments', labelAr: 'الاستثمارات' },
];

const managementNavItems = [
  { id: 'users', icon: Users, labelEn: 'User Management', labelAr: 'إدارة المستخدمين' },
  { id: 'roles', icon: Lock, labelEn: 'Roles & Permissions', labelAr: 'الأدوار والصلاحيات' },
  { id: 'subsidiaries', icon: Building2, labelEn: 'Subsidiaries', labelAr: 'الشركات التابعة' },
];

const systemNavItems = [
  { id: 'system', icon: Server, labelEn: 'System Health', labelAr: 'صحة النظام' },
  { id: 'security', icon: Shield, labelEn: 'Security & Audit', labelAr: 'الأمان والتدقيق' },
  { id: 'logs', icon: Database, labelEn: 'System Logs', labelAr: 'سجلات النظام' },
  { id: 'alerts', icon: AlertTriangle, labelEn: 'Alerts Center', labelAr: 'مركز التنبيهات' },
];

const bottomNavItems = [
  { id: 'settings', icon: Settings, labelEn: 'Settings', labelAr: 'الإعدادات' },
];

export const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  isDarkMode,
  toggleDarkMode,
  notificationCount,
  alertCount,
}) => {
  const { t, language, setLanguage, dir } = useLanguage();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const renderNavSection = (items: typeof mainNavItems, title?: string) => (
    <div className="space-y-1">
      {title && !sidebarCollapsed && (
        <p className="px-4 py-2 text-xs font-semibold text-primary-foreground/50 uppercase tracking-wider">
          {title}
        </p>
      )}
      {items.map((item) => {
        const isActive = activeTab === item.id;
        const hasAlert = item.id === 'alerts' && alertCount > 0;
        
        return (
          <Tooltip key={item.id} delayDuration={300}>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 relative',
                  isActive
                    ? 'bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground shadow-lg'
                    : 'text-primary-foreground/70 hover:bg-white/10 hover:text-primary-foreground'
                )}
              >
                <item.icon className={cn('w-5 h-5 shrink-0', sidebarCollapsed && 'mx-auto')} />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-medium whitespace-nowrap text-sm"
                    >
                      {language === 'ar' ? item.labelAr : item.labelEn}
                    </motion.span>
                  )}
                </AnimatePresence>
                {hasAlert && (
                  <span className={cn(
                    'absolute flex items-center justify-center h-5 w-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full',
                    sidebarCollapsed ? 'top-0 right-0' : 'right-3'
                  )}>
                    {alertCount > 9 ? '9+' : alertCount}
                  </span>
                )}
              </motion.button>
            </TooltipTrigger>
            {sidebarCollapsed && (
              <TooltipContent side={dir === 'rtl' ? 'left' : 'right'}>
                {language === 'ar' ? item.labelAr : item.labelEn}
              </TooltipContent>
            )}
          </Tooltip>
        );
      })}
    </div>
  );

  return (
    <div className={cn('min-h-screen flex w-full bg-background transition-colors duration-300', dir === 'rtl' ? 'flex-row-reverse' : '')}>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 72 : 280 }}
        className={cn(
          'hidden lg:flex flex-col fixed h-screen z-40 transition-all duration-300',
          'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950',
          'shadow-2xl border-border/10',
          dir === 'rtl' ? 'right-0 border-l' : 'left-0 border-r'
        )}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">
                    {language === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}
                  </span>
                  <span className="text-xs text-white/50">Enterprise</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            {sidebarCollapsed ? (
              dir === 'rtl' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />
            ) : (
              dir === 'rtl' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {renderNavSection(mainNavItems, language === 'ar' ? 'الرئيسية' : 'Main')}
          {renderNavSection(managementNavItems, language === 'ar' ? 'الإدارة' : 'Management')}
          {renderNavSection(systemNavItems, language === 'ar' ? 'النظام' : 'System')}
        </nav>

        {/* Bottom Navigation */}
        <div className="px-3 py-4 border-t border-white/10">
          {renderNavSection(bottomNavItems)}
          
          {/* User Info */}
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-3 rounded-xl bg-white/5 flex items-center gap-3"
            >
              <Avatar className="h-10 w-10 border-2 border-secondary/50">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-bold">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {language === 'ar' ? 'مدير النظام' : 'System Admin'}
                </p>
                <p className="text-xs text-white/50 truncate">admin@holding.com</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            initial={{ x: dir === 'rtl' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: dir === 'rtl' ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className={cn(
              'lg:hidden fixed h-screen w-80 z-50',
              'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950',
              dir === 'rtl' ? 'right-0' : 'left-0'
            )}
          >
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-secondary-foreground" />
                </div>
                <span className="text-lg font-bold text-white">
                  {language === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <nav className="px-3 py-4 space-y-6 overflow-y-auto h-[calc(100vh-80px)]">
              {renderNavSection(mainNavItems, language === 'ar' ? 'الرئيسية' : 'Main')}
              {renderNavSection(managementNavItems, language === 'ar' ? 'الإدارة' : 'Management')}
              {renderNavSection(systemNavItems, language === 'ar' ? 'النظام' : 'System')}
              {renderNavSection(bottomNavItems)}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 min-h-screen transition-all duration-300',
          sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[280px]',
          dir === 'rtl' && (sidebarCollapsed ? 'lg:mr-[72px] lg:ml-0' : 'lg:mr-[280px] lg:ml-0')
        )}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between px-4 md:px-6 h-16">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-4">
              <div className="relative w-full">
                <Search className={cn('absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground', dir === 'rtl' ? 'right-3' : 'left-3')} />
                <Input
                  placeholder={language === 'ar' ? 'بحث في النظام...' : 'Search system...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn('bg-muted/50 border-0 focus-visible:ring-1', dir === 'rtl' ? 'pr-10' : 'pl-10')}
                />
              </div>
            </div>

            {/* Status Indicators */}
            <div className="hidden lg:flex items-center gap-3 mx-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                {language === 'ar' ? 'النظام يعمل' : 'System Online'}
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                <Activity className="w-3 h-3" />
                {language === 'ar' ? 'بيانات حية' : 'Live Data'}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                className="relative"
              >
                <Globe className="w-5 h-5" />
                <span className="absolute -bottom-1 text-[10px] font-bold">
                  {language.toUpperCase()}
                </span>
              </Button>

              {/* Theme Toggle */}
              <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>

              {/* Alerts */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setActiveTab('alerts')}
              >
                <AlertTriangle className="w-5 h-5" />
                {alertCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs">
                    {alertCount > 9 ? '9+' : alertCount}
                  </Badge>
                )}
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setActiveTab('notifications')}
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-secondary text-secondary-foreground text-xs">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-2">
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                        AD
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline font-medium text-sm">
                      {language === 'ar' ? 'مدير النظام' : 'Admin'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={dir === 'rtl' ? 'start' : 'end'} className="w-56">
                  <DropdownMenuItem onClick={() => setActiveTab('settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'الإعدادات' : 'Settings'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('security')}>
                    <Shield className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'الأمان' : 'Security'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
