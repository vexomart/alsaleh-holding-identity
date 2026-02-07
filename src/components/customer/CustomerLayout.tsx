/**
 * Customer Dashboard Layout - Modern Responsive Edition
 * Full dark theme with intelligent responsive sidebar
 * Premium mobile-first design with gesture support
 * 
 * OPTIMIZED: Uses centralized RouteGuard for auth checks
 */

import { ReactNode, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useCustomerRealtime } from "@/hooks/useCustomerRealtime";
import { cn } from "@/lib/utils";
import { CustomerSidebar } from "./CustomerSidebar";
import { CacheBuster } from "@/components/CacheBuster";
import { CustomerGuard } from "@/components/auth/RouteGuard";
import { SidebarProvider, SidebarInset, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Menu, 
  Bell, 
  Search,
  User,
  Home,
  ShoppingCart,
  FileText,
  Wallet,
  MoreHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";
import '@/styles/v3/tokens.css';

interface CustomerLayoutProps {
  children: ReactNode;
}

// Mobile Bottom Navigation Component
function MobileBottomNav() {
  const location = useLocation();
  const { isRTL } = useLanguage();
  const { setOpenMobile } = useSidebar();
  const { user } = useAuth();
  const { unreadCount } = useNotifications({ userId: user?.id });

  const navItems = [
    { 
      icon: Home, 
      labelAr: "الرئيسية", 
      labelEn: "Home", 
      href: "/portal",
      exact: true 
    },
    { 
      icon: ShoppingCart, 
      labelAr: "الطلبات", 
      labelEn: "Orders", 
      href: "/portal/orders" 
    },
    { 
      icon: FileText, 
      labelAr: "العقود", 
      labelEn: "Contracts", 
      href: "/portal/contracts" 
    },
    { 
      icon: Wallet, 
      labelAr: "المحفظة", 
      labelEn: "Wallet", 
      href: "/portal/wallet" 
    },
    { 
      icon: MoreHorizontal, 
      labelAr: "المزيد", 
      labelEn: "More", 
      action: () => setOpenMobile(true),
      badge: unreadCount
    },
  ];

  const isActive = (href?: string, exact?: boolean) => {
    if (!href) return false;
    if (exact) return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed bottom-0 inset-x-0 z-50 md:hidden",
        "bg-[hsl(222_47%_11%)]/95 backdrop-blur-xl",
        "border-t border-white/10",
        "pb-safe"
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);
          
          return (
            <motion.button
              key={index}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else if (item.href) {
                  window.location.href = item.href;
                }
              }}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 relative",
                "min-w-[60px]",
                active 
                  ? "text-[hsl(173_80%_48%)]" 
                  : "text-slate-400 active:text-white"
              )}
            >
              {/* Active indicator */}
              {active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-1 w-8 h-1 bg-[hsl(173_65%_40%)] rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -end-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              
              <span className={cn(
                "text-[10px] font-medium",
                active && "font-semibold"
              )}>
                {isRTL ? item.labelAr : item.labelEn}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}

// Smart Mobile Header Component
function MobileHeader() {
  const { isRTL } = useLanguage();
  const { setOpenMobile } = useSidebar();
  const { user, profile } = useAuth();
  const { unreadCount } = useNotifications({ userId: user?.id });
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get current page title
  const getPageTitle = () => {
    const path = location.pathname;
    const titles: Record<string, { ar: string; en: string }> = {
      "/portal": { ar: "نظرة عامة", en: "Overview" },
      "/portal/orders": { ar: "طلباتي", en: "My Orders" },
      "/portal/services": { ar: "الخدمات", en: "Services" },
      "/portal/contracts": { ar: "عقودي", en: "Contracts" },
      "/portal/invoices": { ar: "فواتيري", en: "Invoices" },
      "/portal/wallet": { ar: "المحفظة", en: "Wallet" },
      "/portal/finance": { ar: "التمويل", en: "Finance" },
      "/portal/notifications": { ar: "الإشعارات", en: "Notifications" },
      "/portal/profile": { ar: "الملف الشخصي", en: "Profile" },
      "/portal/referrals": { ar: "الإحالات", en: "Referrals" },
      "/portal/security": { ar: "الأمان", en: "Security" },
    };
    
    // Check for exact match first, then prefix match
    if (titles[path]) return titles[path];
    
    for (const [key, value] of Object.entries(titles)) {
      if (path.startsWith(key) && key !== "/portal") return value;
    }
    
    return titles["/portal"];
  };

  const pageTitle = getPageTitle();

  return (
    <motion.header 
      className={cn(
        "sticky top-0 z-40 md:hidden transition-all duration-300",
        scrolled 
          ? "bg-[hsl(222_47%_11%)]/95 backdrop-blur-xl shadow-lg shadow-black/20" 
          : "bg-[hsl(222_47%_11%)]",
        "border-b border-white/10"
      )}
    >
      <div className="flex items-center justify-between h-14 px-4">
        {/* Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpenMobile(true)}
          className="h-10 w-10 text-white hover:bg-white/10 rounded-xl"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Page Title */}
        <motion.h1 
          key={location.pathname}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-bold text-white text-base"
        >
          {isRTL ? pageTitle.ar : pageTitle.en}
        </motion.h1>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.location.href = "/portal/notifications"}
            className="h-10 w-10 text-white hover:bg-white/10 rounded-xl relative"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 end-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </motion.header>
  );
}

// Desktop Header Component
function DesktopHeader() {
  const { isRTL } = useLanguage();
  const { user, profile } = useAuth();
  const { unreadCount } = useNotifications({ userId: user?.id });
  const { toggleSidebar, state } = useSidebar();

  return (
    <header className="hidden md:flex sticky top-0 z-40 h-14 items-center justify-between gap-4 border-b border-white/10 bg-[hsl(220_22%_9%)]/95 backdrop-blur-xl px-6">
      {/* Left: Toggle + Search */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-9 w-9 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder={isRTL ? "بحث..." : "Search..."}
            className={cn(
              "w-64 h-9 ps-10 pe-4 rounded-lg text-sm",
              "bg-white/5 border border-white/10",
              "text-white placeholder:text-slate-500",
              "focus:outline-none focus:ring-2 focus:ring-[hsl(173_65%_40%)] focus:border-transparent",
              "transition-all duration-200"
            )}
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.location.href = "/portal/notifications"}
          className="h-9 w-9 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg relative"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -end-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>

        {/* User */}
        <Button
          variant="ghost"
          onClick={() => window.location.href = "/portal/profile"}
          className="h-9 px-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-2"
        >
          <div className="w-7 h-7 rounded-full bg-[hsl(173_65%_32%/0.2)] flex items-center justify-center">
            <User className="h-4 w-4 text-[hsl(173_80%_48%)]" />
          </div>
          <span className="text-sm font-medium text-white hidden lg:block">
            {profile?.full_name || profile?.email?.split("@")[0]}
          </span>
        </Button>
      </div>
    </header>
  );
}

function CustomerLayoutContent({ children }: CustomerLayoutProps) {
  const { user, profile } = useAuth();
  const { isRTL } = useLanguage();
  const isMobile = useIsMobile();

  // Real-time subscriptions for services and invoices
  const { isServicesConnected, isInvoicesConnected } = useCustomerRealtime({
    userId: user?.id,
    tenantId: profile?.tenant_id || undefined,
    enabled: !!user,
  });

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div 
        dir={isRTL ? 'rtl' : 'ltr'}
        className="min-h-svh w-full flex cmd-center customer-portal"
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      >
        {/* Sidebar */}
        <CustomerSidebar />
        
        {/* Main Content Area */}
        <SidebarInset className="bg-[hsl(220_25%_6%)] flex-1 flex flex-col">
          {/* Mobile Header */}
          <MobileHeader />
          
          {/* Desktop Header */}
          <DesktopHeader />
          
          {/* Content */}
          <main className={cn(
            "flex-1 container mx-auto",
            // Responsive padding
            "px-3 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8",
            // Bottom padding for mobile nav
            "pb-20 md:pb-6",
            "text-white"
          )}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
          
          {/* Real-time connection indicators - Desktop only */}
          <div className={cn(
            "fixed bottom-4 hidden md:flex items-center gap-3 z-50",
            isRTL ? "start-4" : "end-4"
          )}>
            {/* Cache Buster Button */}
            <CacheBuster />
            
            {/* Connection indicators */}
            <div className="flex gap-2 bg-[hsl(220_22%_9%)]/80 backdrop-blur-sm rounded-full px-3 py-1.5">
              <div 
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  isServicesConnected ? "bg-[hsl(145_72%_45%)]" : "bg-[hsl(220_15%_30%)]"
                )}
                title={isRTL ? "اتصال الخدمات" : "Services connection"}
              />
              <div 
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  isInvoicesConnected ? "bg-[hsl(145_72%_45%)]" : "bg-[hsl(220_15%_30%)]"
                )}
                title={isRTL ? "اتصال الفواتير" : "Invoices connection"}
              />
            </div>
          </div>
        </SidebarInset>
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </SidebarProvider>
  );
}

// Wrap with CustomerGuard for auth protection
export function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <CustomerGuard>
      <CustomerLayoutContent>{children}</CustomerLayoutContent>
    </CustomerGuard>
  );
}
