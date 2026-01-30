/**
 * Admin Sidebar - Enterprise Grade Design
 * Corporate professional style with micro-interactions
 */

import { useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Package, 
  ShoppingCart, 
  FileText, 
  BarChart3, 
  Bell, 
  ClipboardList, 
  Settings, 
  LogOut,
  ChevronDown,
  Building2,
  Image,
  Menu as MenuIcon,
  Sparkles,
  TrendingUp,
  Headphones,
  CreditCard,
  Wallet
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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

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
];

const cmsNavItems: NavItem[] = [
  {
    titleKey: "pages",
    titleAr: "الصفحات",
    titleEn: "Pages",
    icon: FileText,
    href: ROUTES.ADMIN.CMS.PAGES,
    permission: "cms.pages.view",
  },
  {
    titleKey: "menus",
    titleAr: "القوائم",
    titleEn: "Menus",
    icon: MenuIcon,
    href: ROUTES.ADMIN.CMS.MENUS,
    permission: "cms.menus.edit",
  },
  {
    titleKey: "media",
    titleAr: "مكتبة الوسائط",
    titleEn: "Media Library",
    icon: Image,
    href: ROUTES.ADMIN.CMS.MEDIA,
    permission: "cms.media.upload",
  },
];

const systemNavItems: NavItem[] = [
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
  const { state } = useSidebar();
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
  const filteredCmsNav = cmsNavItems.filter(hasAccess);
  const filteredSystemNav = systemNavItems.filter(hasAccess);

  const isCmsActive = cmsNavItems.some(item => currentPath.startsWith(item.href));

  const handleSignOut = async () => {
    await signOut();
    navigate(ROUTES.AUTH.LOGIN);
  };

  const NavItem = ({ item, index = 0 }: { item: NavItem; index?: number }) => {
    const isActive = currentPath === item.href;
    const Icon = item.icon;

    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip={isCollapsed ? getTitle(item) : undefined}
          className="group/item relative"
        >
          <motion.a
            href={item.href}
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "flex items-center gap-3 transition-all duration-200 rounded-lg",
              isActive 
                ? "bg-primary/10 text-primary font-medium shadow-sm" 
                : "hover:bg-muted/80"
            )}
            onClick={(e) => {
              e.preventDefault();
              navigate(item.href);
            }}
          >
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
              isActive 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "bg-muted/50 text-muted-foreground group-hover/item:bg-muted group-hover/item:text-foreground"
            )}>
              <Icon className="h-4 w-4" />
            </div>
            {!isCollapsed && (
              <span className="flex-1 truncate">{getTitle(item)}</span>
            )}
            {!isCollapsed && item.badge && (
              <Badge 
                className={cn(
                  "h-5 min-w-5 rounded-full text-[10px] font-medium text-white px-1.5",
                  item.badgeColor || "bg-primary"
                )}
              >
                {item.badge}
              </Badge>
            )}
            {isActive && (
              <motion.div
                layoutId="activeIndicator"
                className={cn(
                  "absolute h-8 w-1 rounded-full bg-primary",
                  isRTL ? "left-0" : "right-0"
                )}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar 
      side={isRTL ? "right" : "left"} 
      collapsible="icon"
      className="border-sidebar-border bg-gradient-to-b from-background to-muted/20"
    >
      {/* Header */}
      <SidebarHeader className="border-b border-sidebar-border/50">
        <div className={cn(
          "flex items-center gap-3 px-3 py-4",
          isCollapsed && "justify-center px-2"
        )}>
          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
          </div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col overflow-hidden"
            >
              <span className="font-bold text-foreground tracking-tight">
                {language === "ar" ? "الصالح القابضة" : "AlSaleh Holding"}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                {language === "ar" ? "لوحة الإدارة" : "Admin Console"}
              </span>
            </motion.div>
          )}
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="px-2">
        {/* Main Navigation */}
        <SidebarGroup className="pt-4">
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider px-3 mb-2">
              {language === "ar" ? "الرئيسية" : "Main Menu"}
            </SidebarGroupLabel>
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
            <SidebarSeparator className="my-4 bg-border/50" />
            <SidebarGroup>
              {!isCollapsed && (
                <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider px-3 mb-2">
                  {language === "ar" ? "إدارة الأعمال" : "Business"}
                </SidebarGroupLabel>
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

        {/* CMS Navigation */}
        {filteredCmsNav.length > 0 && (
          <>
            <SidebarSeparator className="my-4 bg-border/50" />
            <SidebarGroup>
              {!isCollapsed ? (
                <Collapsible defaultOpen={isCmsActive} className="group/collapsible">
                  <SidebarGroupLabel asChild className="px-3 mb-2">
                    <CollapsibleTrigger className="flex w-full items-center justify-between text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider hover:text-muted-foreground transition-colors">
                      {language === "ar" ? "إدارة المحتوى" : "Content"}
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu className="space-y-1">
                        {filteredCmsNav.map((item, index) => (
                          <NavItem key={item.titleKey} item={item} index={index} />
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1">
                    {filteredCmsNav.map((item, index) => (
                      <NavItem key={item.titleKey} item={item} index={index} />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          </>
        )}

        {/* System Navigation */}
        {filteredSystemNav.length > 0 && (
          <>
            <SidebarSeparator className="my-4 bg-border/50" />
            <SidebarGroup>
              {!isCollapsed && (
                <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider px-3 mb-2">
                  {language === "ar" ? "النظام والأدوات" : "System"}
                </SidebarGroupLabel>
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
      <SidebarFooter className="border-t border-sidebar-border/50 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className={cn(
              "flex items-center gap-3 rounded-xl p-3 bg-muted/30 transition-colors hover:bg-muted/50",
              isCollapsed && "justify-center p-2"
            )}>
              <div className="relative">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-medium">
                    {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-1 flex-col overflow-hidden">
                  <span className="truncate text-sm font-semibold text-foreground">
                    {profile?.full_name || profile?.email}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {isSuperAdmin 
                      ? (language === "ar" ? "مدير النظام" : "Super Admin")
                      : (language === "ar" ? "مدير" : "Administrator")}
                  </span>
                </div>
              )}
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem className="mt-1">
            <SidebarMenuButton
              onClick={handleSignOut}
              tooltip={isCollapsed ? (language === "ar" ? "تسجيل الخروج" : "Sign Out") : undefined}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-destructive/10">
                <LogOut className="h-4 w-4" />
              </div>
              {!isCollapsed && (
                <span className="font-medium">{language === "ar" ? "تسجيل الخروج" : "Sign Out"}</span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
