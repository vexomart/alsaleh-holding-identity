import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  ShoppingCart,
  BarChart3,
  Settings,
  Shield,
  Bell,
  Database,
  Activity,
  Building,
  UserCheck,
  Package,
  MessageSquare,
  Image,
  Receipt,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const menuItems = [
  {
    groupLabel: 'Dashboard',
    groupLabelAr: 'لوحة التحكم',
    items: [
      { title: 'لوحة التحكم', titleEn: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
      { title: 'الإحصائيات', titleEn: 'Analytics', url: '/admin/analytics', icon: BarChart3 },
    ]
  },
  {
    groupLabel: 'Projects',
    groupLabelAr: 'المشاريع',
    items: [
      { title: 'المشاريع', titleEn: 'Projects', url: '/admin/projects', icon: Package },
      { title: 'الطلبات', titleEn: 'Orders', url: '/admin/orders', icon: ShoppingCart },
    ]
  },
  {
    groupLabel: 'Financial',
    groupLabelAr: 'الشؤون المالية',
    items: [
      { title: 'العملاء', titleEn: 'Clients', url: '/admin/clients', icon: Users },
      { title: 'الفواتير', titleEn: 'Invoices', url: '/admin/invoices', icon: FileText },
      { title: 'المدفوعات', titleEn: 'Payments', url: '/admin/payments', icon: CreditCard },
      { title: 'طرق الدفع', titleEn: 'Payment Methods', url: '/admin/payment-methods', icon: CreditCard },
    ]
  },
  {
    groupLabel: 'Wallet & Marketing',
    groupLabelAr: 'المحفظة والتسويق',
    items: [
      { title: 'المحفظة الرقمية', titleEn: 'Digital Wallet', url: '/admin/wallet', icon: Receipt },
      { title: 'التسويق بالعمولة', titleEn: 'Affiliate Marketing', url: '/admin/affiliate', icon: UserCheck },
    ]
  },
  {
    groupLabel: 'System Management',
    groupLabelAr: 'إدارة النظام',
    items: [
      { title: 'المستخدمين', titleEn: 'Users', url: '/admin/users', icon: UserCheck },
      { title: 'الصلاحيات', titleEn: 'Permissions', url: '/admin/permissions', icon: Shield },
      { title: 'الإشعارات', titleEn: 'Notifications', url: '/admin/notifications', icon: Bell },
      { title: 'سجل النشاطات', titleEn: 'Activity Logs', url: '/admin/activity-logs', icon: Activity },
      { title: 'الإعدادات', titleEn: 'Settings', url: '/admin/settings', icon: Settings },
    ]
  }
];

export const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary border-l-2 border-primary font-medium" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar 
      side="right"
      className={`${collapsed ? "w-14 lg:w-16" : "w-64 lg:w-72"} border-l border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 transition-all duration-300`}
    >
      <SidebarHeader className="p-3 sm:p-4 lg:p-6 border-b border-border/30">
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg lg:rounded-xl flex items-center justify-center shadow-md">
            <Shield className="w-4 h-4 lg:w-6 lg:h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="text-right min-w-0">
              <h2 className="text-lg lg:text-xl font-bold text-foreground truncate">لوحة الإدارة</h2>
              <p className="text-xs lg:text-sm text-muted-foreground truncate">علي صالح الشهري القابضة</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2 sm:p-3 lg:p-4 overflow-y-auto">
        {menuItems.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex} className="mb-4 lg:mb-6">
            {!collapsed && (
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider px-2 lg:px-3 mb-2 text-right">
                {group.groupLabel}
              </SidebarGroupLabel>
            )}
            
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.items.map((item, itemIndex) => (
                  <SidebarMenuItem key={itemIndex}>
                    <SidebarMenuButton asChild className="h-10 lg:h-11 transition-all duration-200 hover:scale-105">
                      <NavLink 
                        to={item.url} 
                        className={({ isActive }) => `
                          flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 rounded-lg text-sm lg:text-base
                          ${getNavCls({ isActive })}
                          ${collapsed ? 'justify-center' : 'justify-start'}
                          transition-all duration-200
                        `}
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                        {!collapsed && (
                          <span className="truncate flex-1 text-right font-medium">{item.title}</span>
                        )}
                        {!collapsed && item.title === 'الإشعارات' && (
                          <Badge variant="destructive" className="mr-auto h-4 w-4 lg:h-5 lg:w-5 p-0 flex items-center justify-center text-xs">
                            3
                          </Badge>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};