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
  Package,
  FileText,
  CreditCard,
  MessageSquare,
  Settings,
  User,
  Clock,
  Receipt,
  Wallet,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const menuItems = [
  {
    groupLabel: 'Main',
    groupLabelAr: 'الرئيسية',
    items: [
      { title: 'لوحة التحكم', titleEn: 'Dashboard', url: '/client/dashboard', icon: LayoutDashboard },
      { title: 'مشاريعي', titleEn: 'My Projects', url: '/client/projects', icon: Package },
      { title: 'طلباتي', titleEn: 'My Orders', url: '/client/orders', icon: Clock },
    ]
  },
  {
    groupLabel: 'Finance',
    groupLabelAr: 'المالية',
    items: [
      { title: 'فواتيري', titleEn: 'My Invoices', url: '/client/invoices', icon: FileText },
      { title: 'مدفوعاتي', titleEn: 'My Payments', url: '/client/payments', icon: CreditCard },
      { title: 'محفظتي', titleEn: 'My Wallet', url: '/client/wallet', icon: Wallet },
    ]
  },
  {
    groupLabel: 'Affiliate Marketing',
    groupLabelAr: 'التسويق بالعمولة',
    items: [
      { title: 'التسويق بالعمولة', titleEn: 'Affiliate Marketing', url: '/client/affiliate', icon: Receipt },
    ]
  },
  {
    groupLabel: 'Communication',
    groupLabelAr: 'التواصل والدعم',
    items: [
      { title: 'الرسائل', titleEn: 'Messages', url: '/client/messages', icon: MessageSquare },
      { title: 'التنبيهات', titleEn: 'Notifications', url: '/client/notifications', icon: MessageSquare },
      { title: 'تذاكر الدعم', titleEn: 'Support Tickets', url: '/client/support-tickets', icon: MessageSquare },
    ]
  },
  {
    groupLabel: 'Account',
    groupLabelAr: 'الحساب',
    items: [
      { title: 'الملف الشخصي', titleEn: 'Profile', url: '/client/profile', icon: User },
      { title: 'الإعدادات', titleEn: 'Settings', url: '/client/settings', icon: Settings },
    ]
  }
];

export const ClientSidebar = () => {
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
      className={`${collapsed ? "w-16" : "w-60"} font-inter transition-all duration-300 ease-in-out border-l border-border/20`}
      style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-card/95 backdrop-blur-sm"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background/50"></div>
      
      
      <SidebarHeader className="relative z-10 p-3 border-b border-border/20">
        <div className={`flex items-center gap-2 transition-all duration-300 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="text-right min-w-0">
              <h2 className="text-sm font-semibold text-foreground">لوحة التحكم</h2>
              <p className="text-xs text-muted-foreground">إدارة حسابك</p>
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
                            ? 'bg-primary/10 text-primary border-r-2 border-primary' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          }
                          ${collapsed ? 'justify-center' : 'justify-start'}
                          transition-all duration-200
                        `}
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="truncate flex-1 text-right">{item.title}</span>
                            {item.title === 'الرسائل' && (
                              <Badge variant="destructive" className="h-4 w-4 p-0 flex items-center justify-center text-xs">
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