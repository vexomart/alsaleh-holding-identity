/**
 * Admin Sidebar - Fully Responsive Enterprise Design
 * Ultra-modern corporate style with smooth animations & full RTL support
 * Optimized for all screen sizes (mobile, tablet, desktop)
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
  Link2,
  Menu
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useRBAC } from "@/hooks/useRBAC";
import { useIsMobile } from "@/hooks/use-mobile";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    href: "/adminash/finance-internal",
    permission: "finance.view",
  },
];

const systemNavItems: NavItem[] = [
  {
    titleKey: "integrations",
    titleAr: "التكاملات",
    titleEn: "Integrations",
    icon: Link2,
    href: "/adminash/integrations",
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
  const { profile, signOut, isAdmin: authIsAdmin } = useAuth();
  const { can, isSuperAdmin, isLoading: rbacLoading } = useRBAC();
  const { state, toggleSidebar, setOpenMobile, openMobile } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const isCollapsed = state === "collapsed" && !isMobile;
  const currentPath = location.pathname;

  const getTitle = (item: NavItem) => language === "ar" ? item.titleAr : item.titleEn;

  // While RBAC is loading, show all items if user is admin (from useAuth)
  // This prevents items from being hidden during initial load
  const hasAccess = (item: NavItem): boolean => {
    // If RBAC is still loading and user is admin, show all items
    if (rbacLoading && authIsAdmin) return true;
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
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const NavItem = ({ item }: { item: NavItem }) => {
    const isActive = currentPath === item.href || 
      (item.href !== ROUTES.ADMIN.OVERVIEW && currentPath.startsWith(item.href));
    const Icon = item.icon;

    const itemContent = (
      <div
        onClick={() => handleNavClick(item.href)}
        className={cn(
          "group/item relative flex items-center gap-3 rounded-xl cursor-pointer transition-all duration-200",
          // Responsive padding and height
          isMobile ? "px-4 py-3.5 min-h-[52px]" : "px-3 py-2.5",
          isActive 
            ? "bg-gradient-to-l from-[hsl(25_80%_52%/0.15)] to-[hsl(25_80%_52%/0.05)] text-[hsl(25_85%_58%)] shadow-sm border border-[hsl(25_80%_52%/0.3)]" 
            : "hover:bg-white/5 text-slate-400 hover:text-white"
        )}
      >
        {/* Active Indicator Line */}
        {isActive && (
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-gradient-to-b from-[hsl(25_85%_58%)] to-[hsl(20_75%_42%)]",
              isRTL ? "-left-1" : "-right-1"
            )}
          />
        )}

        {/* Icon Container */}
        <div className={cn(
          "flex items-center justify-center rounded-xl transition-all duration-200 shrink-0",
          isMobile ? "w-10 h-10" : "w-9 h-9",
          isActive 
            ? "bg-gradient-to-br from-[hsl(25_80%_52%)] to-[hsl(20_75%_42%)] text-white shadow-lg shadow-[hsl(25_80%_52%/0.4)]" 
            : "bg-white/5 text-slate-400 group-hover/item:bg-white/10 group-hover/item:text-white"
        )}>
          <Icon className={cn(isMobile ? "h-5 w-5" : "h-[18px] w-[18px]")} />
        </div>

        {/* Text & Badge - Always show on mobile, conditional on desktop */}
        {(isMobile || !isCollapsed) && (
          <>
            <span className={cn(
              "flex-1 truncate font-medium transition-colors text-start",
              isMobile ? "text-base" : "text-sm",
              isActive && "font-semibold text-white"
            )}>
              {getTitle(item)}
            </span>
            {item.badge && item.badge > 0 && (
              <Badge 
                className={cn(
                  "rounded-full text-white font-bold shadow-sm shrink-0",
                  isMobile ? "h-6 min-w-6 px-2 text-xs" : "h-5 min-w-5 px-1.5 text-[10px]",
                  item.badgeColor || "bg-amber-500"
                )}
              >
                {item.badge > 99 ? "99+" : item.badge}
              </Badge>
            )}
          </>
        )}
      </div>
    );

    // On desktop collapsed mode, show tooltip
    if (isCollapsed && !isMobile) {
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

  const SectionLabel = ({ children }: { children: React.ReactNode }) => {
    if (isCollapsed && !isMobile) return null;
    
    return (
      <div className={cn(
        "font-bold text-slate-500 uppercase tracking-widest mb-2",
        isMobile ? "text-xs px-4" : "text-[11px] px-3"
      )}>
        {children}
      </div>
    );
  };

  return (
    <Sidebar 
      side={isRTL ? "right" : "left"} 
      collapsible="icon"
      className={cn(
        "border-0",
        "bg-[hsl(222_47%_11%)]",
        "shadow-2xl shadow-black/40"
      )}
    >
      {/* Header */}
      <SidebarHeader className={cn(
        "relative border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent",
        isMobile ? "px-4 py-4" : "px-3 py-4"
      )}>
        <div className={cn(
          "flex items-center gap-3",
          isCollapsed && !isMobile && "justify-center"
        )}>
          {/* Logo */}
          <div 
            className="relative cursor-pointer shrink-0"
            onClick={() => handleNavClick(ROUTES.ADMIN.OVERVIEW)}
          >
            <div className={cn(
              "flex items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(25_80%_52%)] to-[hsl(20_75%_42%)] text-white shadow-xl shadow-[hsl(25_80%_52%/0.4)] ring-2 ring-[hsl(25_80%_52%/0.3)] ring-offset-2 ring-offset-[hsl(222_47%_11%)]",
              isMobile ? "h-14 w-14" : "h-12 w-12"
            )}>
              <Building2 className={cn(isMobile ? "h-7 w-7" : "h-6 w-6")} />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-[hsl(152_70%_38%)] border-2 border-[hsl(222_47%_11%)] shadow-lg shadow-[hsl(152_70%_38%/0.5)]" />
          </div>

          {/* Brand Text */}
          {(isMobile || !isCollapsed) && (
            <div className="flex flex-col overflow-hidden min-w-0 flex-1">
              <span className={cn(
                "font-bold text-white tracking-tight leading-tight truncate",
                isMobile ? "text-lg" : "text-base"
              )}>
                ASH HOLDING
              </span>
              <span className={cn(
                "text-slate-400 flex items-center gap-1.5 mt-0.5",
                isMobile ? "text-sm" : "text-xs"
              )}>
                <Sparkles className="h-3 w-3 text-amber-400 shrink-0" />
                <span className="truncate">
                  {language === "ar" ? "لوحة الإدارة" : "Admin Console"}
                </span>
              </span>
            </div>
          )}

          {/* Mobile Close Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenMobile(false)}
              className="h-10 w-10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        {!isMobile && (
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 z-10",
              isRTL ? "-left-3" : "-right-3"
            )}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSidebar}
              className="h-6 w-6 rounded-full border-slate-700 bg-slate-800 text-slate-300 shadow-lg hover:bg-slate-700 hover:text-white transition-all"
            >
              {isRTL ? (
                isCollapsed ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
              ) : (
                isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />
              )}
            </Button>
          </div>
        )}
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className={cn(
        "flex-1 overflow-hidden",
        isMobile ? "px-2" : "px-2"
      )}>
        <ScrollArea className="h-full">
          <div className={cn("py-4", isMobile ? "space-y-2" : "space-y-1")}>
            {/* Main Navigation */}
            <SidebarGroup className="p-0">
              <SectionLabel>
                {language === "ar" ? "الرئيسية" : "Main Menu"}
              </SectionLabel>
              <SidebarGroupContent>
                <SidebarMenu className={cn(isMobile ? "space-y-1" : "space-y-0.5")}>
                  {filteredMainNav.map((item) => (
                    <NavItem key={item.titleKey} item={item} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Business Navigation */}
            {filteredBusinessNav.length > 0 && (
              <>
                <SidebarSeparator className="my-4 bg-white/10" />
                <SidebarGroup className="p-0">
                  <SectionLabel>
                    {language === "ar" ? "إدارة الأعمال" : "Business"}
                  </SectionLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className={cn(isMobile ? "space-y-1" : "space-y-0.5")}>
                      {filteredBusinessNav.map((item) => (
                        <NavItem key={item.titleKey} item={item} />
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </>
            )}

            {/* System Navigation */}
            {filteredSystemNav.length > 0 && (
              <>
                <SidebarSeparator className="my-4 bg-white/10" />
                <SidebarGroup className="p-0">
                  <SectionLabel>
                    {language === "ar" ? "النظام والأدوات" : "System"}
                  </SectionLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className={cn(isMobile ? "space-y-1" : "space-y-0.5")}>
                      {filteredSystemNav.map((item) => (
                        <NavItem key={item.titleKey} item={item} />
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </>
            )}
          </div>
        </ScrollArea>
      </SidebarContent>

      {/* Footer - User Profile */}
      <SidebarFooter className={cn(
        "border-t border-white/10 bg-gradient-to-t from-black/30 to-transparent",
        isMobile ? "p-4 pb-safe" : "p-3"
      )}>
        <SidebarMenu>
          {/* User Card */}
          <SidebarMenuItem>
            <div className={cn(
              "flex items-center gap-3 rounded-xl bg-gradient-to-l from-white/10 to-white/5 border border-white/10 transition-all duration-200",
              isMobile ? "p-3" : "p-2.5",
              isCollapsed && !isMobile && "justify-center p-2"
            )}>
              <div className="relative shrink-0">
                <Avatar className={cn(
                  "ring-2 ring-amber-400/30 ring-offset-2 ring-offset-slate-900 shadow-lg",
                  isMobile ? "h-12 w-12" : "h-10 w-10"
                )}>
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-600 text-slate-900 font-bold text-sm">
                    {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-lg shadow-emerald-500/40" />
              </div>
              
              {(isMobile || !isCollapsed) && (
                <div className="flex flex-1 flex-col overflow-hidden min-w-0">
                  <span className={cn(
                    "truncate font-semibold text-white",
                    isMobile ? "text-base" : "text-sm"
                  )}>
                    {profile?.full_name || profile?.email?.split("@")[0] || "User"}
                  </span>
                  <span className={cn(
                    "truncate text-slate-400 font-medium",
                    isMobile ? "text-sm" : "text-[11px]"
                  )}>
                    {isSuperAdmin 
                      ? (language === "ar" ? "مدير النظام" : "Super Admin")
                      : (language === "ar" ? "مدير" : "Administrator")}
                  </span>
                </div>
              )}
            </div>
          </SidebarMenuItem>

          {/* Sign Out Button */}
          <SidebarMenuItem className="mt-2">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    onClick={handleSignOut}
                    className={cn(
                      "flex items-center gap-3 rounded-xl cursor-pointer transition-all duration-200",
                      "text-red-400/80 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20",
                      isMobile ? "px-4 py-3.5 min-h-[52px]" : "px-3 py-2.5",
                      isCollapsed && !isMobile && "justify-center px-2"
                    )}
                  >
                    <div className={cn(
                      "flex items-center justify-center rounded-xl bg-red-500/10 shrink-0",
                      isMobile ? "w-10 h-10" : "w-9 h-9"
                    )}>
                      <LogOut className={cn(isMobile ? "h-5 w-5" : "h-[18px] w-[18px]")} />
                    </div>
                    {(isMobile || !isCollapsed) && (
                      <span className={cn(
                        "font-medium",
                        isMobile ? "text-base" : "text-sm"
                      )}>
                        {language === "ar" ? "تسجيل الخروج" : "Sign Out"}
                      </span>
                    )}
                  </div>
                </TooltipTrigger>
                {isCollapsed && !isMobile && (
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
