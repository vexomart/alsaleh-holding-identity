/**
 * Customer Dashboard Sidebar - Modern Responsive
 * TRUE RTL - Sidebar on RIGHT in Arabic mode
 * Premium mobile-first design with gestures
 */

import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Bell,
  User,
  LogOut,
  Building2,
  ChevronLeft,
  ChevronRight,
  Wallet,
  FileSignature,
  Receipt,
  Landmark,
  Trash2,
  X,
  Shield,
  Gift,
  Sparkles,
} from "lucide-react";

interface NavItem {
  titleAr: string;
  titleEn: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
  section?: "main" | "finance" | "account";
  gradient?: string;
}

export function CustomerSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const { unreadCount } = useNotifications({ userId: user?.id });
  const { state, toggleSidebar, setOpenMobile, openMobile } = useSidebar();
  const isMobile = useIsMobile();

  const navItems: NavItem[] = [
    {
      titleAr: "نظرة عامة",
      titleEn: "Overview",
      icon: LayoutDashboard,
      href: "/portal",
      section: "main",
      gradient: "from-teal-500/20 to-emerald-500/20",
    },
    {
      titleAr: "طلباتي",
      titleEn: "My Orders",
      icon: ShoppingCart,
      href: "/portal/orders",
      section: "main",
      gradient: "from-blue-500/20 to-indigo-500/20",
    },
    {
      titleAr: "الخدمات",
      titleEn: "Services",
      icon: Package,
      href: "/portal/services",
      section: "main",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      titleAr: "عقودي",
      titleEn: "My Contracts",
      icon: FileSignature,
      href: "/portal/contracts",
      section: "main",
      gradient: "from-amber-500/20 to-orange-500/20",
    },
    {
      titleAr: "فواتيري",
      titleEn: "My Invoices",
      icon: Receipt,
      href: "/portal/invoices",
      section: "main",
      gradient: "from-rose-500/20 to-red-500/20",
    },
    {
      titleAr: "المحفظة",
      titleEn: "Wallet",
      icon: Wallet,
      href: "/portal/wallet",
      section: "finance",
      gradient: "from-green-500/20 to-emerald-500/20",
    },
    {
      titleAr: "التمويل",
      titleEn: "Finance",
      icon: Landmark,
      href: "/portal/finance",
      section: "finance",
      gradient: "from-cyan-500/20 to-teal-500/20",
    },
    {
      titleAr: "الإحالات",
      titleEn: "Referrals",
      icon: Gift,
      href: "/portal/referrals",
      section: "account",
      gradient: "from-fuchsia-500/20 to-purple-500/20",
    },
    {
      titleAr: "الإشعارات",
      titleEn: "Notifications",
      icon: Bell,
      href: "/portal/notifications",
      badge: unreadCount,
      section: "account",
      gradient: "from-yellow-500/20 to-amber-500/20",
    },
    {
      titleAr: "الأمان",
      titleEn: "Security",
      icon: Shield,
      href: "/portal/security",
      section: "account",
      gradient: "from-slate-500/20 to-gray-500/20",
    },
    {
      titleAr: "الملف الشخصي",
      titleEn: "Profile",
      icon: User,
      href: "/portal/profile",
      section: "account",
      gradient: "from-indigo-500/20 to-blue-500/20",
    },
  ];

  const mainItems = navItems.filter(item => item.section === "main");
  const financeItems = navItems.filter(item => item.section === "finance");
  const accountItems = navItems.filter(item => item.section === "account");

  const isActive = (href: string) => {
    if (href === "/portal") {
      return location.pathname === "/portal";
    }
    return location.pathname.startsWith(href);
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    // Close mobile sidebar after navigation
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  // RTL-aware collapse icons - flip direction
  const CollapseIcon = isRTL ? ChevronRight : ChevronLeft;
  const ExpandIcon = isRTL ? ChevronLeft : ChevronRight;

  const renderNavItem = (item: NavItem, index: number) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    return (
      <SidebarMenuItem key={item.href}>
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.03, duration: 0.2 }}
        >
          <SidebarMenuButton
            onClick={() => handleNavigation(item.href)}
            tooltip={isRTL ? item.titleAr : item.titleEn}
            className={cn(
              "w-full rounded-xl transition-all duration-300 gap-3 group/item",
              // Mobile: larger touch targets (min 44px)
              isMobile ? "h-12 px-4" : "h-11 px-3",
              active
                ? cn(
                    "bg-gradient-to-r",
                    item.gradient || "from-teal-500/20 to-emerald-500/20",
                    "text-white font-medium border border-white/10",
                    "shadow-lg shadow-black/20"
                  )
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <div className={cn(
              "flex items-center justify-center rounded-lg transition-all duration-300",
              isMobile ? "w-9 h-9" : "w-8 h-8",
              active 
                ? "bg-white/10 text-[hsl(173_80%_55%)]" 
                : "text-slate-400 group-hover/item:text-[hsl(173_80%_55%)]"
            )}>
              <Icon className={cn(isMobile ? "h-5 w-5" : "h-4 w-4")} />
            </div>
            
            <span className="flex-1 text-start text-sm truncate">
              {isRTL ? item.titleAr : item.titleEn}
            </span>
            
            {item.badge && item.badge > 0 && (
              <Badge 
                variant="destructive" 
                className={cn(
                  "font-bold animate-pulse",
                  isMobile ? "h-6 min-w-6 px-2 text-xs" : "h-5 min-w-5 px-1.5 text-[10px]"
                )}
              >
                {item.badge > 99 ? "99+" : item.badge}
              </Badge>
            )}
            
            {/* Active indicator line */}
            {active && (
              <motion.div
                layoutId="activeNavIndicator"
                className={cn(
                  "absolute h-full w-1 bg-[hsl(173_65%_45%)] rounded-full",
                  isRTL ? "-start-0.5" : "-end-0.5"
                )}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </SidebarMenuButton>
        </motion.div>
      </SidebarMenuItem>
    );
  };

  const renderSection = (items: NavItem[], labelAr: string, labelEn: string, startIndex: number) => (
    <SidebarGroup className="mb-1">
      <SidebarGroupLabel className={cn(
        "text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2",
        isMobile ? "px-4" : "px-3",
        isRTL && "text-right"
      )}>
        {isRTL ? labelAr : labelEn}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-0.5">
          {items.map((item, index) => renderNavItem(item, startIndex + index))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar 
      collapsible="icon"
      side={isRTL ? "right" : "left"}
      className={cn(
        "bg-gradient-to-b from-[hsl(222_47%_11%)] to-[hsl(222_50%_8%)] text-white",
        // Logical border - end side
        "border-e border-white/10"
      )}
    >
      {/* Header */}
      <SidebarHeader className={cn(
        "border-b border-white/10",
        isMobile ? "p-4" : "p-3"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "rounded-xl bg-gradient-to-br from-[hsl(173_65%_32%)] to-[hsl(173_70%_45%)] flex items-center justify-center shadow-lg shadow-[hsl(173_65%_32%/0.3)]",
                isMobile ? "w-12 h-12" : "w-10 h-10"
              )}
            >
              <Building2 className={cn("text-white", isMobile ? "h-6 w-6" : "h-5 w-5")} />
            </motion.div>
            
            <AnimatePresence>
              {(state === "expanded" || isMobile) && (
                <motion.div 
                  initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRTL ? 10 : -10 }}
                  className="flex flex-col text-start"
                >
                  <span className={cn(
                    "font-bold text-white flex items-center gap-1.5",
                    isMobile ? "text-lg" : "text-base"
                  )}>
                    ASH
                    <Sparkles className="h-3.5 w-3.5 text-[hsl(173_80%_55%)]" />
                  </span>
                  <span className={cn(
                    "text-slate-400",
                    isMobile ? "text-sm" : "text-xs"
                  )}>
                    {isRTL ? "بوابة العميل" : "Customer Portal"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Mobile close button */}
          {isMobile && (
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpenMobile(false)}
                className="h-10 w-10 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl"
              >
                <X className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className={cn(
        "flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent",
        isMobile ? "px-3 py-4" : "px-2 py-3"
      )}>
        {/* Main Navigation */}
        {renderSection(mainItems, "القائمة الرئيسية", "Main Menu", 0)}
        
        {/* Finance Section */}
        {renderSection(financeItems, "المالية", "Finance", mainItems.length)}
        
        {/* Account Section */}
        {renderSection(accountItems, "الحساب", "Account", mainItems.length + financeItems.length)}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className={cn(
        "border-t border-white/10",
        isMobile ? "p-4 pb-safe" : "p-3"
      )}>
        {/* User Info Card */}
        <motion.div 
          whileHover={{ scale: isMobile ? 1 : 1.02 }}
          className={cn(
            "flex items-center gap-3 rounded-xl bg-gradient-to-r from-white/5 to-transparent mb-3 cursor-pointer transition-all",
            isMobile ? "p-3" : "p-2",
            state === "collapsed" && !isMobile && "justify-center"
          )}
          onClick={() => handleNavigation("/portal/profile")}
        >
          <Avatar className={cn(
            "border-2 border-[hsl(173_65%_32%/0.4)] ring-2 ring-[hsl(173_65%_32%/0.1)]",
            isMobile ? "h-12 w-12" : "h-9 w-9"
          )}>
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-[hsl(173_65%_32%)] to-[hsl(173_70%_45%)] text-white font-bold">
              {(profile?.full_name || profile?.email)?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          
          <AnimatePresence>
            {(state === "expanded" || isMobile) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className={cn(
                  "font-semibold text-white truncate",
                  isMobile ? "text-base" : "text-sm"
                )}>
                  {profile?.full_name || profile?.email?.split("@")[0]}
                </p>
                <p className={cn(
                  "text-slate-400 truncate",
                  isMobile ? "text-sm" : "text-xs"
                )} dir="ltr">
                  {profile?.email}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Actions */}
        <div className={cn(
          "flex gap-2",
          isMobile && "flex-col"
        )}>
          {/* Collapse toggle - only on desktop */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="flex-1 h-9 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl"
            >
              {state === "expanded" ? (
                <CollapseIcon className="h-4 w-4" />
              ) : (
                <ExpandIcon className="h-4 w-4" />
              )}
            </Button>
          )}
          
          {/* Clear Cache - Mobile */}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                sessionStorage.clear();
                localStorage.removeItem('app_cache_v36');
                window.location.reload();
              }}
              className="h-12 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-xl justify-start gap-3 px-4"
            >
              <Trash2 className="h-5 w-5" />
              <span>{isRTL ? "مسح الكاش" : "Clear Cache"}</span>
            </Button>
          )}
          
          {/* Sign Out */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className={cn(
              "text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors",
              isMobile ? "h-12 justify-start gap-3 px-4" : "flex-1 h-9"
            )}
          >
            <LogOut className={cn(isMobile ? "h-5 w-5" : "h-4 w-4", isRTL && "scale-x-[-1]")} />
            <AnimatePresence>
              {(state === "expanded" || isMobile) && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(!isMobile && "ms-2")}
                >
                  {isRTL ? "خروج" : "Logout"}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
