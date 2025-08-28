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
      className={`${collapsed ? "w-16" : "w-80"} font-tajawal transition-all duration-500 ease-in-out transform`}
    >
      {/* خلفية متدرجة للسايدبار */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 opacity-95"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10"></div>
      
      <SidebarHeader className="relative z-10 p-6 border-b border-white/10">
        <div className={`flex items-center gap-4 transition-all duration-300 ${collapsed ? 'justify-center' : ''}`}>
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-primary via-accent to-secondary rounded-xl flex items-center justify-center shadow-2xl animate-glow">
              <User className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-30 animate-pulse"></div>
          </div>
          {!collapsed && (
            <div className="text-right min-w-0 animate-fade-in">
              <h2 className="text-xl font-bold text-white truncate gradient-text-primary">لوحة التحكم</h2>
              <p className="text-sm text-white/70 truncate animate-slide-in-right">إدارة مشاريعك وخدماتك</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="relative z-10 p-4 overflow-y-auto custom-scrollbar">
        {menuItems.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex} className={`mb-6 animate-fade-in delay-${groupIndex * 100}`}>
            {!collapsed && (
              <SidebarGroupLabel className="text-xs font-bold text-white/60 uppercase tracking-wider px-3 mb-3 text-right border-r-2 border-primary/50">
                {group.groupLabelAr}
              </SidebarGroupLabel>
            )}
            
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {group.items.map((item, itemIndex) => (
                  <SidebarMenuItem key={itemIndex} className="group">
                    <SidebarMenuButton asChild className="h-auto">
                      <NavLink 
                        to={item.url} 
                        className={({ isActive }) => `
                          flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium
                          ${isActive 
                            ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-white border border-primary/30 shadow-lg shadow-primary/20' 
                            : 'text-white/80 hover:text-white hover:bg-white/10 hover:scale-105'
                          }
                          ${collapsed ? 'justify-center' : 'justify-start'}
                          transition-all duration-300 group-hover:shadow-lg backdrop-blur-sm
                        `}
                        title={collapsed ? item.title : undefined}
                      >
                        <div className="relative">
                          <item.icon className={`w-6 h-6 flex-shrink-0 transition-all duration-300 ${isActive(item.url) ? 'text-primary' : 'group-hover:text-accent'}`} />
                          {isActive(item.url) && (
                            <div className="absolute -inset-2 bg-primary/20 rounded-full blur animate-pulse"></div>
                          )}
                        </div>
                        {!collapsed && (
                          <>
                            <span className="truncate flex-1 text-right transition-all duration-300">{item.title}</span>
                            {item.title === 'الرسائل' && (
                              <Badge variant="destructive" className="h-6 w-6 p-0 flex items-center justify-center text-xs animate-bounce-gentle">
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
      
      {/* تأثير ضوئي في الأسفل */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none"></div>
    </Sidebar>
  );
};