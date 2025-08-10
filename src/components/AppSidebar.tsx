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
  Activity,
  Monitor,
  Smartphone,
  Image,
  Video,
  TrendingUp,
  Target,
  Headphones,
  Building
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
      { title: "جميع الطلبات", key: "services", icon: Package },
      { title: "الخدمات الرقمية", key: "digital-services", icon: Monitor },
      { title: "خدمات التصميم", key: "design-services", icon: Palette },
      { title: "الخدمات التجارية", key: "business-services", icon: Briefcase },
      { title: "إنتاج المحتوى", key: "content-services", icon: PenTool }
    ]
  },
  {
    title: "الفواتير والمالية",
    icon: FileText,
    key: "invoices",
    subItems: [
      { title: "جميع الفواتير", key: "invoices", icon: FileText },
      { title: "الفواتير المدفوعة", key: "paid-invoices", icon: CreditCard },
      { title: "الفواتير المعلقة", key: "pending-invoices", icon: Bell }
    ]
  },
  {
    title: "المدفوعات",
    icon: CreditCard,
    key: "payments"
  },
  {
    title: "الدعم الفني",
    icon: Headphones,
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
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    title: "إنشاء تذكرة دعم",
    icon: Headphones,
    href: "/support", 
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20"
  },
  {
    title: "عرض العروض الحالية",
    icon: TrendingUp,
    href: "/current-offers",
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/20"
  },
  {
    title: "اتصل بنا",
    icon: Building,
    href: "/contact",
    color: "text-orange-600", 
    bgColor: "bg-orange-100 dark:bg-orange-900/20"
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
    <Sidebar className="w-80 sidebar-gradient" variant="sidebar" collapsible="icon" dir="rtl">
      <SidebarContent className="bg-sidebar-background text-sidebar-foreground border-sidebar-border border-l shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border">
          {!isCollapsed && (
            <div className="flex items-center gap-4 animate-fade-in">
              <Avatar className="h-12 w-12 ring-2 ring-sidebar-primary">
                <AvatarImage src="" />
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground font-bold">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'ع'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold truncate text-sidebar-foreground">
                  {profile?.full_name || 'مستخدم'}
                </p>
                <p className="text-sm text-sidebar-foreground/70 truncate">
                  {profile?.client_id || 'عميل جديد'}
                </p>
                <Badge variant="outline" className="mt-1 text-xs border-sidebar-primary text-sidebar-primary">
                  عضو مميز
                </Badge>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center">
              <Avatar className="h-10 w-10 ring-2 ring-sidebar-primary">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm font-bold">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'ع'}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>

        {/* Navigation */}
        <SidebarGroup className="px-4">
          {!isCollapsed && <SidebarGroupLabel className="text-sidebar-foreground/70 font-bold text-sm">القائمة الرئيسية</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {sidebarItems.map((item, index) => (
                <SidebarMenuItem key={item.key} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  {item.subItems ? (
                    <div>
                      <SidebarMenuButton
                        onClick={() => !isCollapsed && toggleGroup(item.key)}
                        className={`w-full justify-between transition-all duration-300 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg p-3 ${
                          item.subItems.some(sub => isActive(sub.key)) ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-lg' : 'text-sidebar-foreground hover:scale-105'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5" />
                          {!isCollapsed && <span className="font-medium">{item.title}</span>}
                        </div>
                        {!isCollapsed && (
                          isExpanded(item.key) ? 
                            <ChevronDown className="h-4 w-4 transition-transform" /> : 
                            <ChevronRight className="h-4 w-4 transition-transform" />
                        )}
                      </SidebarMenuButton>
                      
                      {!isCollapsed && isExpanded(item.key) && (
                        <div className="mr-8 mt-2 space-y-1 animate-slide-in-right">
                          {item.subItems.map((subItem) => (
                            <SidebarMenuButton
                              key={subItem.key}
                              onClick={() => onTabChange(subItem.key)}
                              className={`text-sm transition-all duration-200 hover:bg-sidebar-accent/50 rounded-md p-2 flex items-center gap-2 ${
                                isActive(subItem.key) ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md' : 'text-sidebar-foreground/80 hover:text-sidebar-foreground'
                              }`}
                            >
                              {subItem.icon && <subItem.icon className="h-4 w-4" />}
                              {subItem.title}
                            </SidebarMenuButton>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.key)}
                      className={`w-full transition-all duration-300 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg p-3 ${
                        isActive(item.key) ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-lg scale-105' : 'text-sidebar-foreground hover:scale-105'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        {!isCollapsed && <span className="font-medium">{item.title}</span>}
                      </div>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        {!isCollapsed && (
          <SidebarGroup className="px-4">
            <SidebarGroupLabel className="text-sidebar-foreground/70 font-bold text-sm">إجراءات سريعة</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {quickActions.map((action, index) => (
                  <SidebarMenuItem key={index} className="animate-fade-in" style={{ animationDelay: `${(index + 4) * 0.1}s` }}>
                    <SidebarMenuButton asChild>
                      <a 
                        href={action.href}
                        className="flex items-center gap-3 text-sm transition-all duration-300 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg p-3 group"
                      >
                        <div className={`p-2 rounded-md ${action.bgColor} group-hover:scale-110 transition-transform`}>
                          <action.icon className={`h-4 w-4 ${action.color}`} />
                        </div>
                        <span className="font-medium text-sidebar-foreground group-hover:text-sidebar-accent-foreground">{action.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Sign Out */}
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            onClick={onSignOut}
            className={`w-full transition-all duration-300 hover:bg-destructive hover:text-destructive-foreground rounded-lg p-3 text-sidebar-foreground ${isCollapsed ? 'px-2' : 'justify-start'}`}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="mr-3 font-medium">تسجيل الخروج</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}