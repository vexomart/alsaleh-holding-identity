/**
 * Admin Sidebar - Modern Enterprise Design
 * Ultra-modern corporate style with smooth animations & full RTL support
 */

import { useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Bell, 
  ClipboardList, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
  Sparkles,
  X,
  Wallet,
  Landmark,
  FileText,
  CreditCard,
  Link2
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useRBAC } from "@/hooks/useRBAC";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  titleKey: string;
  titleAr: string;
  titleEn: string;
  icon: React.ElementType;
  href: string;
  permission?: string;
  badge?: number;
  badgeColor?: string;
  children?: NavItem[];
}

const mainNavItems: NavItem[] = [
  {
    titleKey: "overview",
    titleAr: "لوحة التحكم",
    titleEn: "Dashboard",
    icon: LayoutDashboard,
    href: ROUTES.ADMIN.OVERVIEW,
  },
  {
    titleKey: "users",
    titleAr: "إدارة المستخدمين",
    titleEn: "User Management",
    icon: Users,
    href: ROUTES.ADMIN.USERS,
    permission: "users.view",
  },
  {
    titleKey: "roles",
    titleAr: "الأدوار والصلاحيات",
    titleEn: "Roles & Permissions",
    icon: Shield,
    href: ROUTES.ADMIN.ROLES,
    permission: "roles.view",
  },
];

const businessNavItems: NavItem[] = [
  {
    titleKey: "services",
    titleAr: "إدارة الخدمات",
    titleEn: "Service Management",
    icon: Package,
    href: ROUTES.ADMIN.SERVICES,
    permission: "services.view",
  },
  {
    titleKey: "orders",
    titleAr: "إدارة الطلبات",
    titleEn: "Order Management",
    icon: ShoppingCart,
    href: ROUTES.ADMIN.ORDERS,
    permission: "orders.view",
    badge: 5,
    badgeColor: "bg-blue-500",
  },
  {
    titleKey: "contracts",
    titleAr: "إدارة العقود",
    titleEn: "Contracts Management",
    icon: FileText,
    href: ROUTES.ADMIN.CONTRACTS,
    permission: "contracts.view",
  },
  {
    titleKey: "wallets",
    titleAr: "إدارة المحافظ",
    titleEn: "Wallet Management",
    icon: Wallet,
    href: ROUTES.ADMIN.WALLETS,
  },
  {
    titleKey: "referrals",
    titleAr: "إدارة الإحالات",
    titleEn: "Referral Management",
    icon: Users,
    href: ROUTES.ADMIN.REFERRALS,
  },
  {
    titleKey: "finance",
    titleAr: "المركز المالي",
    titleEn: "Finance Center",
    icon: Landmark,
    href: ROUTES.ADMIN.FINANCE,
    permission: "finance.view",
  },
  {
    titleKey: "finance-internal",
    titleAr: "التمويل الداخلي",
    titleEn: "Internal Finance",
    icon: CreditCard,
    href: "/admin/finance-internal",
    permission: "finance.view",
  },
];

// CMS module removed - not implemented
// Will be added back when CMS is fully built

const systemNavItems: NavItem[] = [
  {
    titleKey: "integrations",
    titleAr: "التكاملات",
    titleEn: "Integrations",
    icon: Link2,
    href: "/admin/integrations",
    permission: "settings.view",
  },
  {
    titleKey: "reports",
    titleAr: "التقارير والتحليلات",
    titleEn: "Reports & Analytics",
    icon: BarChart3,
    href: ROUTES.ADMIN.REPORTS,
    permission: "reports.view",
  },
  {
    titleKey: "notifications",
    titleAr: "مركز الإشعارات",
    titleEn: "Notification Center",
    icon: Bell,
    href: ROUTES.ADMIN.NOTIFICATIONS,
    permission: "notifications.view",
    badge: 12,
    badgeColor: "bg-red-500",
  },
  {
    titleKey: "audit",
    titleAr: "سجل النشاط",
    titleEn: "Activity Log",
    icon: ClipboardList,
    href: ROUTES.ADMIN.AUDIT,
    permission: "audit.view",
  },
  {
    titleKey: "settings",
    titleAr: "إعدادات النظام",
    titleEn: "System Settings",
    icon: Settings,
    href: ROUTES.ADMIN.SETTINGS,
    permission: "settings.view",
  },
];

export function AdminSidebar() {
  const { language, isRTL } = useLanguage();
  const { profile, signOut } = useAuth();
  const { can, isSuperAdmin } = useRBAC();
  const { state, toggleSidebar, setOpenMobile, openMobile } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isCollapsed = state === "collapsed";
  const currentPath = location.pathname;

  const getTitle = (item: NavItem) => language === "ar" ? item.titleAr : item.titleEn;

  const hasAccess = (item: NavItem): boolean => {
    if (isSuperAdmin) return true;
    if (!item.permission) return true;
    return can(item.permission as any);
  };

  const filteredMainNav = mainNavItems.filter(hasAccess);
  const filteredBusinessNav = businessNavItems.filter(hasAccess);
  const filteredSystemNav = systemNavItems.filter(hasAccess);

  const handleSignOut = async () => {
    await signOut();
    navigate(ROUTES.AUTH.LOGIN);
  };

  const handleNavClick = (href: string) => {
    navigate(href);
    // Close mobile sidebar on navigation
    if (openMobile) {
      setOpenMobile(false);
    }
  };

  const NavItem = ({ item, index = 0 }: { item: NavItem; index?: number }) => {
    const isActive = currentPath === item.href;
    const Icon = item.icon;

    const itemContent = (
      <motion.div
        initial={{ opacity: 0, x: isRTL ? 15 : -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03, duration: 0.2 }}
        onClick={() => handleNavClick(item.href)}
        className={cn(
          "group/item relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-300",
          isActive 
            ? "bg-gradient-to-l from-amber-500/20 to-amber-500/5 text-amber-400 shadow-sm border border-amber-500/30" 
            : "hover:bg-white/5 text-slate-400 hover:text-white"
        )}
      >
        {/* Active Indicator Line */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-gradient-to-b from-amber-400 to-amber-600",
                isRTL ? "-left-1" : "-right-1"
              )}
            />
          )}
        </AnimatePresence>

        {/* Icon Container */}
        <div className={cn(
          "flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 shrink-0",
          isActive 
            ? "bg-gradient-to-br from-amber-500 to-amber-600 text-slate-900 shadow-lg shadow-amber-500/40" 
            : "bg-white/5 text-slate-400 group-hover/item:bg-white/10 group-hover/item:text-white group-hover/item:scale-105"
        )}>
          <Icon className="h-[18px] w-[18px]" />
        </div>

        {/* Text & Badge */}
        {!isCollapsed && (
          <>
            <span className={cn(
              "flex-1 truncate text-sm font-medium transition-colors",
              isActive ? "font-semibold text-white" : ""
            )}>
              {getTitle(item)}
            </span>
            {item.badge && (
              <Badge 
                className={cn(
                  "h-5 min-w-5 rounded-full text-[10px] font-bold text-white px-1.5 shadow-sm",
                  item.badgeColor || "bg-amber-500"
                )}
              >
                {item.badge > 99 ? "99+" : item.badge}
              </Badge>
            )}
          </>
        )}
      </motion.div>
    );

    if (isCollapsed) {
      return (
        <SidebarMenuItem>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                {itemContent}
              </TooltipTrigger>
              <TooltipContent 
                side={isRTL ? "left" : "right"} 
                className="flex items-center gap-2 font-medium"
              >
                {getTitle(item)}
                {item.badge && (
                  <Badge className={cn("h-4 text-[10px]", item.badgeColor || "bg-primary")}>
                    {item.badge}
                  </Badge>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SidebarMenuItem>
      );
    }

    return <SidebarMenuItem>{itemContent}</SidebarMenuItem>;
  };

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2"
    >
      {children}
    </motion.div>
  );

  return (
    <Sidebar 
      side={isRTL ? "right" : "left"} 
      collapsible="icon"
      className={cn(
        "border-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950",
        "shadow-2xl shadow-black/50"
      )}
    >
      {/* Header */}
      <SidebarHeader className="relative border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
        <div className={cn(
          "flex items-center gap-3 px-4 py-5",
          isCollapsed && "justify-center px-2"
        )}>
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative cursor-pointer"
            onClick={() => handleNavClick(ROUTES.ADMIN.OVERVIEW)}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-amber-400 to-yellow-500 text-slate-900 shadow-xl shadow-amber-500/40 ring-2 ring-amber-400/30 ring-offset-2 ring-offset-slate-900">
              <Building2 className="h-6 w-6" />
            </div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-lg shadow-emerald-500/50" 
            />
          </motion.div>

          {/* Brand Text */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRTL ? 10 : -10 }}
                className="flex flex-col overflow-hidden"
              >
              <span className="font-bold text-base text-white tracking-tight leading-tight">
                  ASH HOLDING
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" />
                  {language === "ar" ? "لوحة الإدارة" : "Admin Console"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse Toggle Button */}
        <motion.div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 z-10",
            isRTL ? "-left-3" : "-right-3"
          )}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSidebar}
            className="h-6 w-6 rounded-full border-slate-700 bg-slate-800 text-slate-300 shadow-lg hover:bg-slate-700 hover:text-white hover:scale-110 transition-transform hidden md:flex"
          >
            {isRTL ? (
              isCollapsed ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
            ) : (
              isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />
            )}
          </Button>
        </motion.div>

        {/* Mobile Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpenMobile(false)}
          className="absolute top-3 left-3 h-8 w-8 rounded-lg md:hidden text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </Button>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="px-3 py-4 custom-scrollbar-dark">
        {/* Main Navigation */}
        <SidebarGroup>
          {!isCollapsed && (
            <SectionLabel>
              {language === "ar" ? "الرئيسية" : "Main Menu"}
            </SectionLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {filteredMainNav.map((item, index) => (
                <NavItem key={item.titleKey} item={item} index={index} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Business Navigation */}
        {filteredBusinessNav.length > 0 && (
          <>
            <SidebarSeparator className="my-4 bg-white/10" />
            <SidebarGroup>
              {!isCollapsed && (
                <SectionLabel>
                  {language === "ar" ? "إدارة الأعمال" : "Business"}
                </SectionLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {filteredBusinessNav.map((item, index) => (
                    <NavItem key={item.titleKey} item={item} index={index} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* CMS Navigation - Removed (module not implemented) */}

        {/* System Navigation */}
        {filteredSystemNav.length > 0 && (
          <>
            <SidebarSeparator className="my-4 bg-white/10" />
            <SidebarGroup>
              {!isCollapsed && (
                <SectionLabel>
                  {language === "ar" ? "النظام والأدوات" : "System"}
                </SectionLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {filteredSystemNav.map((item, index) => (
                    <NavItem key={item.titleKey} item={item} index={index} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      {/* Footer - User Profile */}
      <SidebarFooter className="border-t border-white/10 p-3 bg-gradient-to-t from-black/30 to-transparent">
        <SidebarMenu>
          {/* User Card */}
          <SidebarMenuItem>
            <motion.div 
              whileHover={{ scale: isCollapsed ? 1 : 1.01 }}
              className={cn(
                "flex items-center gap-3 rounded-xl p-3 bg-gradient-to-l from-white/10 to-white/5 border border-white/10 transition-all duration-300 hover:border-white/20 hover:shadow-sm",
                isCollapsed && "justify-center p-2"
              )}
            >
              <div className="relative shrink-0">
                <Avatar className="h-10 w-10 ring-2 ring-amber-400/30 ring-offset-2 ring-offset-slate-900 shadow-lg">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-600 text-slate-900 font-bold text-sm">
                    {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <motion.div 
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                  className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-lg shadow-emerald-500/40" 
                />
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div 
                    initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-1 flex-col overflow-hidden min-w-0"
                  >
                    <span className="truncate text-sm font-semibold text-white">
                      {profile?.full_name || profile?.email?.split("@")[0] || "User"}
                    </span>
                    <span className="truncate text-[11px] text-slate-400 font-medium">
                      {isSuperAdmin 
                        ? (language === "ar" ? "مدير النظام" : "Super Admin")
                        : (language === "ar" ? "مدير" : "Administrator")}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </SidebarMenuItem>

          {/* Sign Out Button */}
          <SidebarMenuItem className="mt-2">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSignOut}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-300",
                      "text-red-400/80 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20",
                      isCollapsed && "justify-center px-2"
                    )}
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-500/10 shrink-0">
                      <LogOut className="h-[18px] w-[18px]" />
                    </div>
                    {!isCollapsed && (
                      <span className="font-medium text-sm">
                        {language === "ar" ? "تسجيل الخروج" : "Sign Out"}
                      </span>
                    )}
                  </motion.div>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side={isRTL ? "left" : "right"}>
                    {language === "ar" ? "تسجيل الخروج" : "Sign Out"}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
