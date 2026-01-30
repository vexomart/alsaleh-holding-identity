import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Settings,
  User,
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
  TrendingUp,
  Wallet,
  Shield,
  HelpCircle,
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
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  notificationCount: number;
}

const navItems = [
  { id: 'overview', icon: LayoutDashboard, labelKey: 'dashboard.overview' },
  { id: 'analytics', icon: BarChart3, labelKey: 'dashboard.analytics' },
  { id: 'portfolio', icon: Wallet, labelKey: 'kpi.portfolio' },
  { id: 'reports', icon: FileText, labelKey: 'dashboard.reports' },
  { id: 'investments', icon: TrendingUp, labelKey: 'sector.digital' },
];

const bottomNavItems = [
  { id: 'settings', icon: Settings, labelKey: 'dashboard.settings' },
  { id: 'security', icon: Shield, labelKey: 'settings.security' },
  { id: 'help', icon: HelpCircle, labelKey: 'action.view_all' },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  isDarkMode,
  toggleDarkMode,
  notificationCount,
}) => {
  const { t, language, setLanguage, dir } = useLanguage();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <div className={cn('min-h-screen flex w-full bg-background transition-colors duration-300', dir === 'rtl' ? 'flex-row-reverse' : '')}>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        className={cn(
          'hidden lg:flex flex-col fixed h-screen z-40 transition-all duration-300',
          'bg-gradient-to-b from-primary via-primary/95 to-primary-variant',
          'shadow-xl border-border/10',
          dir === 'rtl' ? 'right-0 border-l' : 'left-0 border-r'
        )}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-secondary-foreground" />
                </div>
                <span className="text-lg font-bold text-primary-foreground">
                  {language === 'ar' ? 'الشهري القابضة' : 'Alshehri Holding'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
          >
            {sidebarCollapsed ? (
              dir === 'rtl' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />
            ) : (
              dir === 'rtl' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-2">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                activeTab === item.id
                  ? 'bg-secondary text-secondary-foreground shadow-lg'
                  : 'text-primary-foreground/70 hover:bg-white/10 hover:text-primary-foreground'
              )}
            >
              <item.icon className={cn('w-5 h-5', sidebarCollapsed && 'mx-auto')} />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-medium whitespace-nowrap"
                  >
                    {t(item.labelKey)}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="px-3 py-4 border-t border-white/10 space-y-2">
          {bottomNavItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                activeTab === item.id
                  ? 'bg-secondary text-secondary-foreground'
                  : 'text-primary-foreground/70 hover:bg-white/10 hover:text-primary-foreground'
              )}
            >
              <item.icon className={cn('w-5 h-5', sidebarCollapsed && 'mx-auto')} />
              {!sidebarCollapsed && (
                <span className="font-medium">{t(item.labelKey)}</span>
              )}
            </motion.button>
          ))}
        </div>
      </motion.aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
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
              'lg:hidden fixed h-screen w-72 z-50',
              'bg-gradient-to-b from-primary via-primary/95 to-primary-variant',
              dir === 'rtl' ? 'right-0' : 'left-0'
            )}
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-secondary-foreground" />
                </div>
                <span className="text-lg font-bold text-primary-foreground">
                  {language === 'ar' ? 'الشهري القابضة' : 'Alshehri Holding'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="text-primary-foreground"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <nav className="px-3 py-4 space-y-2">
              {[...navItems, ...bottomNavItems].map((item) => (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                    activeTab === item.id
                      ? 'bg-secondary text-secondary-foreground'
                      : 'text-primary-foreground/70 hover:bg-white/10'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{t(item.labelKey)}</span>
                </motion.button>
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 min-h-screen transition-all duration-300',
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-[280px]',
          dir === 'rtl' && (sidebarCollapsed ? 'lg:mr-20 lg:ml-0' : 'lg:mr-[280px] lg:ml-0')
        )}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
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
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className={cn('absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground', dir === 'rtl' ? 'right-3' : 'left-3')} />
                <Input
                  placeholder={t('dashboard.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn('bg-muted/50 border-0', dir === 'rtl' ? 'pr-10' : 'pl-10')}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4">
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

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative" onClick={() => setActiveTab('notifications')}>
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                        {language === 'ar' ? 'م' : 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline font-medium">
                      {language === 'ar' ? 'مدير النظام' : 'Admin'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={dir === 'rtl' ? 'start' : 'end'} className="w-56">
                  <DropdownMenuItem onClick={() => setActiveTab('profile')}>
                    <User className="w-4 h-4 mr-2" />
                    {t('dashboard.profile')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    {t('dashboard.settings')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('dashboard.logout')}
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
