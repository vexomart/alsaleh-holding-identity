/**
 * Customer Dashboard Sidebar
 * TRUE RTL - Sidebar on RIGHT in Arabic mode
 * Mobile-optimized with premium design
 */

import { useLocation, useNavigate } from "react-router-dom";
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
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";

interface NavItem {
  titleAr: string;
  titleEn: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
  section?: "main" | "finance" | "account";
}

export function CustomerSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const { unreadCount } = useNotifications({ userId: user?.id });
  const { state, toggleSidebar, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();

  const navItems: NavItem[] = [
    {
      titleAr: "نظرة عامة",
      titleEn: "Overview",
      icon: LayoutDashboard,
      href: "/dashboard",
      section: "main",
    },
    {
      titleAr: "طلباتي",
      titleEn: "My Orders",
      icon: ShoppingCart,
      href: "/dashboard/orders",
      section: "main",
    },
    {
      titleAr: "الخدمات",
      titleEn: "Services",
      icon: Package,
      href: "/dashboard/services",
      section: "main",
    },
    {
      titleAr: "عقودي",
      titleEn: "My Contracts",
      icon: FileSignature,
      href: "/dashboard/contracts",
      section: "main",
    },
    {
      titleAr: "فواتيري",
      titleEn: "My Invoices",
      icon: Receipt,
      href: "/dashboard/invoices",
      section: "main",
    },
    {
      titleAr: "المحفظة",
      titleEn: "Wallet",
      icon: Wallet,
      href: "/dashboard/wallet",
      section: "finance",
    },
    {
      titleAr: "التمويل",
      titleEn: "Finance",
      icon: Landmark,
      href: "/dashboard/finance",
      section: "finance",
    },
    {
      titleAr: "الإحالات",
      titleEn: "Referrals",
      icon: User,
      href: "/dashboard/referrals",
      section: "account",
    },
    {
      titleAr: "الإشعارات",
      titleEn: "Notifications",
      icon: Bell,
      href: "/dashboard/notifications",
      badge: unreadCount,
      section: "account",
    },
    {
      titleAr: "الأمان",
      titleEn: "Security",
      icon: Shield,
      href: "/dashboard/security",
      section: "account",
    },
    {
      titleAr: "الملف الشخصي",
      titleEn: "Profile",
      icon: User,
      href: "/dashboard/profile",
      section: "account",
    },
  ];

  const mainItems = navItems.filter(item => item.section === "main");
  const financeItems = navItems.filter(item => item.section === "finance");
  const accountItems = navItems.filter(item => item.section === "account");

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === "/dashboard";
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

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    return (
      <SidebarMenuItem key={item.href}>
        <SidebarMenuButton
          onClick={() => handleNavigation(item.href)}
          tooltip={isRTL ? item.titleAr : item.titleEn}
          className={cn(
            "w-full rounded-xl transition-all duration-200 gap-3",
            // Mobile: larger touch targets
            isMobile ? "h-12 px-4" : "h-11",
            active
              ? "bg-[hsl(173_65%_32%/0.12)] text-[hsl(173_80%_48%)] font-medium border border-[hsl(173_65%_32%/0.2)]"
              : "text-slate-300 hover:bg-white/5 hover:text-white"
          )}
        >
          <Icon className={cn("h-5 w-5 shrink-0", active && "text-[hsl(173_80%_48%)]")} />
          <span className="flex-1 text-start text-sm">
            {isRTL ? item.titleAr : item.titleEn}
          </span>
          {item.badge && item.badge > 0 && (
            <Badge 
              variant="destructive" 
              className="h-5 min-w-5 px-1.5 text-xs font-bold"
            >
              {item.badge > 99 ? "99+" : item.badge}
            </Badge>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  const renderSection = (items: NavItem[], labelAr: string, labelEn: string) => (
    <SidebarGroup className="mb-2">
      <SidebarGroupLabel className={cn(
        "text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2 px-3",
        isRTL && "text-right"
      )}>
        {isRTL ? labelAr : labelEn}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          {items.map(renderNavItem)}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar 
      collapsible="icon"
      side={isRTL ? "right" : "left"}
      className={cn(
        "bg-[hsl(222_47%_11%)] text-white",
        // Logical border - end side
        "border-e border-white/10"
      )}
    >
      {/* Header */}
      <SidebarHeader className={cn(
        "border-b border-white/10",
        isMobile ? "p-4" : "p-4"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "rounded-xl bg-gradient-to-br from-[hsl(173_65%_32%)] to-[hsl(173_70%_42%)] flex items-center justify-center shadow-lg shadow-[hsl(173_65%_32%/0.3)]",
              isMobile ? "w-11 h-11" : "w-10 h-10"
            )}>
              <Building2 className={cn("text-white", isMobile ? "h-6 w-6" : "h-5 w-5")} />
            </div>
            {(state === "expanded" || isMobile) && (
              <div className="flex flex-col text-start">
                <span className={cn("font-bold text-white", isMobile ? "text-base" : "text-sm")}>
                  ASH
                </span>
                <span className={cn("text-slate-400", isMobile ? "text-sm" : "text-xs")}>
                  {isRTL ? "بوابة العميل" : "Customer Portal"}
                </span>
              </div>
            )}
          </div>
          
          {/* Mobile close button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenMobile(false)}
              className="h-10 w-10 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className={cn(
        "flex-1 overflow-y-auto",
        isMobile ? "px-3 py-4" : "px-2 py-4"
      )}>
        {/* Main Navigation */}
        {renderSection(mainItems, "القائمة الرئيسية", "Main Menu")}
        
        {/* Finance Section */}
        {renderSection(financeItems, "المالية", "Finance")}
        
        {/* Account Section */}
        {renderSection(accountItems, "الحساب", "Account")}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className={cn(
        "border-t border-white/10",
        isMobile ? "p-4 pb-safe" : "p-3"
      )}>
        {/* User Info */}
        <div className={cn(
          "flex items-center gap-3 rounded-xl bg-white/5 mb-3",
          isMobile ? "p-3" : "p-2",
          state === "collapsed" && !isMobile && "justify-center"
        )}>
          <Avatar className={cn(
            "border-2 border-[hsl(173_65%_32%/0.3)]",
            isMobile ? "h-11 w-11" : "h-9 w-9"
          )}>
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-[hsl(173_65%_32%/0.2)] text-[hsl(173_80%_48%)] font-bold">
              {(profile?.full_name || profile?.email)?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          {(state === "expanded" || isMobile) && (
            <div className="flex-1 min-w-0">
              <p className={cn(
                "font-medium text-white truncate",
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
            </div>
          )}
        </div>

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
              className="flex-1 h-9 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl"
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
              className="h-11 text-slate-300 hover:text-amber-400 hover:bg-amber-500/10 rounded-xl justify-start gap-3 px-4"
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
              "text-slate-300 hover:text-red-400 hover:bg-red-500/10 rounded-xl",
              isMobile ? "h-11 justify-start gap-3 px-4" : "flex-1 h-9"
            )}
          >
            <LogOut className={cn(isMobile ? "h-5 w-5" : "h-4 w-4", isRTL && "scale-x-[-1]")} />
            {(state === "expanded" || isMobile) && (
              <span className={cn(!isMobile && "ms-2")}>{isRTL ? "خروج" : "Logout"}</span>
            )}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
