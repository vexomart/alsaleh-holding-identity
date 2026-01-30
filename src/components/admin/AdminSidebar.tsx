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
  Building2
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

interface NavItem {
  titleKey: string;
  titleAr: string;
  titleEn: string;
  icon: React.ElementType;
  href: string;
  permission?: string;
  children?: NavItem[];
}

const mainNavItems: NavItem[] = [
  {
    titleKey: "overview",
    titleAr: "نظرة عامة",
    titleEn: "Overview",
    icon: LayoutDashboard,
    href: ROUTES.ADMIN.OVERVIEW,
  },
  {
    titleKey: "users",
    titleAr: "المستخدمين",
    titleEn: "Users",
    icon: Users,
    href: ROUTES.ADMIN.USERS,
    permission: "users.view_all",
  },
  {
    titleKey: "roles",
    titleAr: "الأدوار والصلاحيات",
    titleEn: "Roles & Permissions",
    icon: Shield,
    href: ROUTES.ADMIN.ROLES,
    permission: "roles.view",
  },
  {
    titleKey: "services",
    titleAr: "الخدمات",
    titleEn: "Services",
    icon: Package,
    href: ROUTES.ADMIN.SERVICES,
    permission: "services.view_all",
  },
  {
    titleKey: "orders",
    titleAr: "الطلبات",
    titleEn: "Orders",
    icon: ShoppingCart,
    href: ROUTES.ADMIN.ORDERS,
    permission: "orders.view_all",
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
    icon: FileText,
    href: ROUTES.ADMIN.CMS.MENUS,
    permission: "cms.menus.view",
  },
  {
    titleKey: "media",
    titleAr: "الوسائط",
    titleEn: "Media",
    icon: FileText,
    href: ROUTES.ADMIN.CMS.MEDIA,
    permission: "cms.media.view",
  },
];

const systemNavItems: NavItem[] = [
  {
    titleKey: "reports",
    titleAr: "التقارير",
    titleEn: "Reports",
    icon: BarChart3,
    href: ROUTES.ADMIN.REPORTS,
    permission: "reports.view",
  },
  {
    titleKey: "notifications",
    titleAr: "الإشعارات",
    titleEn: "Notifications",
    icon: Bell,
    href: ROUTES.ADMIN.NOTIFICATIONS,
    permission: "notifications.manage",
  },
  {
    titleKey: "audit",
    titleAr: "سجل التدقيق",
    titleEn: "Audit Log",
    icon: ClipboardList,
    href: ROUTES.ADMIN.AUDIT,
    permission: "audit.view",
  },
  {
    titleKey: "settings",
    titleAr: "الإعدادات",
    titleEn: "Settings",
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
  const filteredCmsNav = cmsNavItems.filter(hasAccess);
  const filteredSystemNav = systemNavItems.filter(hasAccess);

  const isCmsActive = cmsNavItems.some(item => currentPath.startsWith(item.href));

  const handleSignOut = async () => {
    await signOut();
    navigate(ROUTES.AUTH.LOGIN);
  };

  const NavItem = ({ item }: { item: NavItem }) => {
    const isActive = currentPath === item.href;
    const Icon = item.icon;

    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip={isCollapsed ? getTitle(item) : undefined}
        >
          <a
            href={item.href}
            className={cn(
              "flex items-center gap-3 transition-colors",
              isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
            onClick={(e) => {
              e.preventDefault();
              navigate(item.href);
            }}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>{getTitle(item)}</span>}
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar 
      side={isRTL ? "right" : "left"} 
      collapsible="icon"
      className="border-sidebar-border"
    >
      {/* Header */}
      <SidebarHeader className="border-b border-sidebar-border">
        <div className={cn(
          "flex items-center gap-3 px-2 py-3",
          isCollapsed && "justify-center"
        )}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sidebar-foreground">
                {language === "ar" ? "لوحة الإدارة" : "Admin Panel"}
              </span>
              <span className="text-xs text-sidebar-foreground/60">
                {language === "ar" ? "الصالح القابضة" : "AlSaleh Holding"}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel>
              {language === "ar" ? "الرئيسية" : "Main"}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMainNav.map((item) => (
                <NavItem key={item.titleKey} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* CMS Navigation */}
        {filteredCmsNav.length > 0 && (
          <SidebarGroup>
            {!isCollapsed ? (
              <Collapsible defaultOpen={isCmsActive} className="group/collapsible">
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex w-full items-center justify-between">
                    {language === "ar" ? "إدارة المحتوى" : "Content Management"}
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {filteredCmsNav.map((item) => (
                        <NavItem key={item.titleKey} item={item} />
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredCmsNav.map((item) => (
                    <NavItem key={item.titleKey} item={item} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        )}

        <SidebarSeparator />

        {/* System Navigation */}
        {filteredSystemNav.length > 0 && (
          <SidebarGroup>
            {!isCollapsed && (
              <SidebarGroupLabel>
                {language === "ar" ? "النظام" : "System"}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredSystemNav.map((item) => (
                  <NavItem key={item.titleKey} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer - User Profile */}
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className={cn(
              "flex items-center gap-3 rounded-lg px-2 py-3",
              isCollapsed && "justify-center"
            )}>
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                  {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex flex-1 flex-col overflow-hidden">
                  <span className="truncate text-sm font-medium text-sidebar-foreground">
                    {profile?.full_name || profile?.email}
                  </span>
                  <span className="truncate text-xs text-sidebar-foreground/60">
                    {profile?.email}
                  </span>
                </div>
              )}
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              tooltip={isCollapsed ? (language === "ar" ? "تسجيل الخروج" : "Sign Out") : undefined}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!isCollapsed && (
                <span>{language === "ar" ? "تسجيل الخروج" : "Sign Out"}</span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
