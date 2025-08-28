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
  Package,
  FileText,
  CreditCard,
  MessageSquare,
  Settings,
  Shield,
  BarChart3,
  UserPlus,
  Building,
  Receipt,
  Wallet,
  Bell,
  Newspaper,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const menuItems = [
  {
    groupLabel: 'Main',
    groupLabelAr: 'الرئيسية',
    items: [
      { title: 'لوحة التحكم', titleEn: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
      { title: 'إدارة المشاريع', titleEn: 'Projects', url: '/admin/projects', icon: Package },
      { title: 'إدارة العملاء', titleEn: 'Clients', url: '/admin/clients', icon: Users },
      { title: 'إدارة الطلبات', titleEn: 'Orders', url: '/admin/orders', icon: FileText },
    ]
  },
  {
    groupLabel: 'Finance',
    groupLabelAr: 'المالية',
    items: [
      { title: 'إدارة الفواتير', titleEn: 'Invoices', url: '/admin/invoices', icon: FileText },
      { title: 'إدارة المدفوعات', titleEn: 'Payments', url: '/admin/payments', icon: CreditCard },
      { title: 'طرق الدفع', titleEn: 'Payment Methods', url: '/admin/payment-methods', icon: CreditCard },
      { title: 'المحفظة', titleEn: 'Wallet', url: '/admin/wallet', icon: Wallet },
      { title: 'القوالب المالية', titleEn: 'Financial Templates', url: '/admin/financial-templates', icon: Receipt },
    ]
  },
  {
    groupLabel: 'Communication',
    groupLabelAr: 'التواصل والإعلام',
    items: [
      { title: 'إدارة الدعم', titleEn: 'Support', url: '/admin/support', icon: MessageSquare },
      { title: 'إدارة الإشعارات', titleEn: 'Notifications', url: '/admin/notifications', icon: Bell },
      { title: 'إدارة التحديثات', titleEn: 'Updates', url: '/admin/updates', icon: Newspaper },
      { title: 'التسويق بالعمولة', titleEn: 'Affiliate', url: '/admin/affiliate', icon: Users },
    ]
  },
  {
    groupLabel: 'Branding',
    groupLabelAr: 'العلامة التجارية',
    items: [
      { title: 'إدارة الشعارات', titleEn: 'Logos', url: '/admin/logos', icon: Building },
    ]
  },
  {
    groupLabel: 'System',
    groupLabelAr: 'النظام',
    items: [
      { title: 'إدارة المستخدمين', titleEn: 'Users', url: '/admin/users', icon: UserPlus },
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

  return (
    <Sidebar 
      side="right"
      className={`${collapsed ? "w-16" : "w-60"} transition-all duration-300 ease-in-out border-l border-border/20`}
      style={{ fontFamily: 'Noto Kufi Arabic, Amiri, Tajawal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
    >
      {/* Professional Background */}
      <div className="absolute inset-0 bg-card/95 backdrop-blur-sm"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background/50"></div>
      
      <SidebarHeader className="relative z-10 p-3 border-b border-border/20">
        <div className={`flex items-center gap-2 transition-all duration-300 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-variant rounded-lg flex items-center justify-center shadow-lg">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="text-right min-w-0">
              <h2 className="text-sm font-semibold text-foreground">لوحة الإدارة</h2>
              <p className="text-xs text-muted-foreground">نظام إدارة شامل</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="relative z-10 p-2 overflow-y-auto">
        {menuItems.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex} className="mb-4">
            {!collapsed && (
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-2 mb-2 text-right">
                {group.groupLabelAr}
              </SidebarGroupLabel>
            )}
            
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.items.map((item, itemIndex) => (
                  <SidebarMenuItem key={itemIndex}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={({ isActive }) => `
                          flex items-center gap-2 px-2 py-2 rounded-md text-sm font-medium
                          ${isActive 
                            ? 'bg-primary/10 text-primary border-r-2 border-primary shadow-sm' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          }
                          ${collapsed ? 'justify-center' : 'justify-start'}
                          transition-all duration-200 hover:shadow-sm
                        `}
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="truncate flex-1 text-right font-medium">{item.title}</span>
                            {item.title === 'إدارة الإشعارات' && (
                              <Badge variant="destructive" className="h-4 w-4 p-0 flex items-center justify-center text-xs">
                                3
                              </Badge>
                            )}
                            {item.title === 'إدارة التحديثات' && (
                              <Badge className="h-4 w-4 p-0 flex items-center justify-center text-xs bg-blue-500 text-white">
                                2
                              </Badge>
                            )}
                          </>
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