/**
 * Customer Dashboard Sidebar
 * TRUE RTL - Sidebar on RIGHT in Arabic mode
 */

import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
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
} from "lucide-react";

interface NavItem {
  titleAr: string;
  titleEn: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

export function CustomerSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const { unreadCount } = useNotifications({ userId: user?.id });
  const { state, toggleSidebar } = useSidebar();

  const navItems: NavItem[] = [
    {
      titleAr: "نظرة عامة",
      titleEn: "Overview",
      icon: LayoutDashboard,
      href: "/app",
    },
    {
      titleAr: "طلباتي",
      titleEn: "My Orders",
      icon: ShoppingCart,
      href: "/app/orders",
    },
    {
      titleAr: "الخدمات",
      titleEn: "Services",
      icon: Package,
      href: "/app/services",
    },
    {
      titleAr: "الإشعارات",
      titleEn: "Notifications",
      icon: Bell,
      href: "/app/notifications",
      badge: unreadCount,
    },
    {
      titleAr: "الملف الشخصي",
      titleEn: "Profile",
      icon: User,
      href: "/app/profile",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/app") {
      return location.pathname === "/app";
    }
    return location.pathname.startsWith(href);
  };

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  // RTL-aware collapse icons
  const CollapseIcon = isRTL ? ChevronLeft : ChevronRight;
  const ExpandIcon = isRTL ? ChevronRight : ChevronLeft;

  return (
    <Sidebar 
      collapsible="icon"
      side={isRTL ? "right" : "left"}
      className={cn(
        "bg-gradient-to-b from-slate-950 to-slate-900 text-white",
        // Border on the correct side based on RTL
        isRTL ? "border-s border-e-0" : "border-e border-s-0"
      )}
    >
      {/* Header */}
      <SidebarHeader className="border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          {state === "expanded" && (
            <div className="flex flex-col text-start">
              <span className="font-bold text-sm text-white">
                ASH
              </span>
              <span className="text-xs text-slate-400">
                {isRTL ? "بوابة العميل" : "Customer Portal"}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "text-slate-400 text-xs mb-2",
            isRTL && "text-right"
          )}>
            {isRTL ? "القائمة الرئيسية" : "Main Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      onClick={() => handleNavigation(item.href)}
                      tooltip={isRTL ? item.titleAr : item.titleEn}
                      className={cn(
                        "w-full h-11 rounded-lg transition-all duration-200 gap-3",
                        active
                          ? "bg-amber-500/20 text-amber-400 font-medium"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <Icon className={cn("h-5 w-5 shrink-0", active && "text-amber-400")} />
                      <span className="flex-1 text-start">
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
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-white/10 p-3">
        {/* User Info */}
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-lg bg-white/5 mb-2",
          state === "collapsed" && "justify-center",
          isRTL && state !== "collapsed" && "flex-row-reverse"
        )}>
          <Avatar className="h-9 w-9 border-2 border-amber-500/30">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-amber-500/20 text-amber-400 text-sm font-bold">
              {(profile?.full_name || profile?.email)?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          {state === "expanded" && (
            <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
              <p className="text-sm font-medium text-white truncate">
                {profile?.full_name || profile?.email?.split("@")[0]}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {profile?.email}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="flex-1 h-9 text-slate-300 hover:text-white hover:bg-white/10"
          >
            {state === "expanded" ? (
              <CollapseIcon className="h-4 w-4" />
            ) : (
              <ExpandIcon className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className={cn(
              "flex-1 h-9 text-slate-300 hover:text-red-400 hover:bg-red-500/10",
              isRTL && "flex-row-reverse"
            )}
          >
            <LogOut className={cn("h-4 w-4", isRTL && "scale-x-[-1]")} />
            {state === "expanded" && (
              <span className={isRTL ? "me-2" : "ms-2"}>{isRTL ? "خروج" : "Logout"}</span>
            )}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
