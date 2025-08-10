import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  Package,
  MessageSquare,
  BarChart3,
  User,
  ChevronDown,
  ChevronRight,
  Home,
  Briefcase,
  Palette,
  Globe,
  PenTool,
  Activity
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface AppSidebarProps {
  user: any;
  profile: any;
  onSignOut: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sidebarItems = [
  {
    title: "نظرة عامة",
    icon: LayoutDashboard,
    key: "overview"
  },
  {
    title: "الخدمات",
    icon: Package,
    key: "services",
    subItems: [
      { title: "جميع الطلبات", key: "services" },
      { title: "الخدمات الرقمية", key: "digital-services" },
      { title: "خدمات التصميم", key: "design-services" },
      { title: "الخدمات التجارية", key: "business-services" },
      { title: "إنتاج المحتوى", key: "content-services" }
    ]
  },
  {
    title: "الفواتير",
    icon: FileText,
    key: "invoices"
  },
  {
    title: "المدفوعات",
    icon: CreditCard,
    key: "payments"
  },
  {
    title: "الدعم",
    icon: MessageSquare,
    key: "tickets"
  },
  {
    title: "الإشعارات",
    icon: Bell,
    key: "notifications"
  },
  {
    title: "الملف الشخصي",
    icon: User,
    key: "profile"
  }
];

const quickActions = [
  {
    title: "طلب خدمة جديدة",
    icon: Package,
    href: "/current-offers",
    color: "text-blue-600"
  },
  {
    title: "إنشاء تذكرة دعم",
    icon: MessageSquare,
    href: "/support",
    color: "text-green-600"
  },
  {
    title: "عرض العروض",
    icon: BarChart3,
    href: "/current-offers",
    color: "text-purple-600"
  }
];

export function AppSidebar({ user, profile, onSignOut, activeTab, onTabChange }: AppSidebarProps) {
  const sidebar = useSidebar();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['services']);

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev =>
      prev.includes(key)
        ? prev.filter(item => item !== key)
        : [...prev, key]
    );
  };

  const isActive = (key: string) => activeTab === key;
  const isExpanded = (key: string) => expandedGroups.includes(key);
  const isCollapsed = sidebar.state === 'collapsed';

  return (
    <Sidebar className="w-72"  variant="sidebar" collapsible="icon">
      <SidebarContent className="bg-card border-r">
        {/* Header */}
        <div className="p-4 border-b">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'ع'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {profile?.full_name || 'مستخدم'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {profile?.client_id || 'عميل جديد'}
                </p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="flex justify-center">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'ع'}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>

        {/* Navigation */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  {item.subItems ? (
                    <div>
                      <SidebarMenuButton
                        onClick={() => !collapsed && toggleGroup(item.key)}
                        className={`w-full justify-between ${
                          item.subItems.some(sub => isActive(sub.key)) ? 'bg-accent text-accent-foreground' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </div>
                        {!collapsed && (
                          isExpanded(item.key) ? 
                            <ChevronDown className="h-4 w-4" /> : 
                            <ChevronRight className="h-4 w-4" />
                        )}
                      </SidebarMenuButton>
                      
                      {!collapsed && isExpanded(item.key) && (
                        <div className="mr-6 mt-1 space-y-1">
                          {item.subItems.map((subItem) => (
                            <SidebarMenuButton
                              key={subItem.key}
                              onClick={() => onTabChange(subItem.key)}
                              className={`text-sm ${
                                isActive(subItem.key) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              {subItem.title}
                            </SidebarMenuButton>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.key)}
                      className={`w-full ${
                        isActive(item.key) ? 'bg-accent text-accent-foreground' : ''
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>إجراءات سريعة</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {quickActions.map((action, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild>
                      <a 
                        href={action.href}
                        className="flex items-center gap-2 text-sm"
                      >
                        <action.icon className={`h-4 w-4 ${action.color}`} />
                        <span>{action.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Sign Out */}
        <div className="mt-auto p-4 border-t">
          <Button
            variant="ghost"
            onClick={onSignOut}
            className={`w-full ${collapsed ? 'px-2' : 'justify-start'}`}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="mr-2">تسجيل الخروج</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}