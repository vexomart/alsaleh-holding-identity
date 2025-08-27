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
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const menuItems = [
  {
    groupLabel: 'الرئيسية',
    items: [
      { title: 'لوحة التحكم', url: '/admin/dashboard', icon: LayoutDashboard },
      { title: 'المشاريع', url: '/admin/projects', icon: Package },
      { title: 'الإحصائيات', url: '/admin/analytics', icon: BarChart3 },
    ]
  },
  {
    groupLabel: 'إدارة العملاء',
    items: [
      { title: 'العملاء', url: '/admin/clients', icon: Users },
      { title: 'الطلبات', url: '/admin/orders', icon: ShoppingCart },
      { title: 'الفواتير', url: '/admin/invoices', icon: FileText },
      { title: 'المدفوعات', url: '/admin/payments', icon: CreditCard },
    ]
  },
  {
    groupLabel: 'إدارة النظام',
    items: [
      { title: 'المستخدمين', url: '/admin/users', icon: UserCheck },
      { title: 'الأدوار', url: '/admin/roles', icon: Shield },
      { title: 'الشركات التابعة', url: '/admin/subsidiaries', icon: Building },
      { title: 'الرسائل', url: '/admin/messages', icon: MessageSquare },
    ]
  },
  {
    groupLabel: 'التقارير والإعدادات',
    items: [
      { title: 'الإشعارات', url: '/admin/notifications', icon: Bell },
      { title: 'سجل النشاطات', url: '/admin/activity-logs', icon: Activity },
      { title: 'النسخ الاحتياطي', url: '/admin/backup', icon: Database },
      { title: 'الإعدادات', url: '/admin/settings', icon: Settings },
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
      className={`${collapsed ? "w-16" : "w-72"} border-l border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`}
    >
      <SidebarHeader className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div className="text-right">
              <h2 className="text-xl font-bold text-foreground">لوحة الإدارة</h2>
              <p className="text-sm text-muted-foreground">علي صالح الشهري القابضة</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        {menuItems.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex} className="mb-6">
            {!collapsed && (
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider px-3 mb-2 text-right">
                {group.groupLabel}
              </SidebarGroupLabel>
            )}
            
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.items.map((item, itemIndex) => (
                  <SidebarMenuItem key={itemIndex}>
                    <SidebarMenuButton asChild className="h-11 transition-all duration-200">
                      <NavLink 
                        to={item.url} 
                        className={({ isActive }) => `
                          flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                          ${getNavCls({ isActive })}
                          ${collapsed ? 'justify-center' : 'justify-start'}
                        `}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && (
                          <span className="truncate flex-1 text-right">{item.title}</span>
                        )}
                        {!collapsed && item.title === 'الإشعارات' && (
                          <Badge variant="destructive" className="mr-auto h-5 w-5 p-0 flex items-center justify-center text-xs">
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