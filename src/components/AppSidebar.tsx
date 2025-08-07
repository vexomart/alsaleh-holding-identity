import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Building2,
  Globe,
  Zap,
  Phone,
  Mail,
  MessageCircle,
  Gift,
  Settings,
  PenTool,
  Palette,
  Users,
  Award,
  Heart,
  TrendingUp,
  Eye,
  Briefcase,
  Target,
  Menu,
  X,
  Clock,
  MapPin,
  Star,
  BarChart3
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
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const mainNavItems = [
  { title: "الرئيسية", url: "/", icon: Home },
  // { title: "لوحة التحكم", url: "/dashboard", icon: BarChart3 }, // Hidden as requested
  { title: "من نحن", url: "/about", icon: Building2 },
  { title: "رؤيتنا", url: "/vision", icon: Eye },
  { title: "شركاتنا", url: "/subsidiaries", icon: Briefcase },
  { title: "منتجاتنا", url: "/ready-projects", icon: Target },
  { title: "تواصل معنا", url: "/contact", icon: Phone },
];

const servicesItems = [
  { title: "العروض الحالية", url: "/current-offers", icon: Gift },
  { title: "خدماتنا الاحترافية", url: "/professional-services", icon: Settings },
  { title: "صناعة المحتوى", url: "/content-creation", icon: PenTool },
  { title: "حلول التصميم", url: "/design-solutions", icon: Palette },
  { title: "الاستثمار التقني", url: "/tech-investment", icon: Zap },
  { title: "التطوير والابتكار", url: "/development", icon: Building2 },
  { title: "الاستشارات الإستراتيجية", url: "/strategic-consulting", icon: Users },
  { title: "الحلول المتكاملة", url: "/integrated-solutions", icon: Award }
];

const otherItems = [
  { title: "طرق الدفع", url: "/payment-methods", icon: Phone },
  { title: "رحلة الإبداع والتميز", url: "/story", icon: Heart },
  { title: "قيمنا وثقافتنا", url: "/about", icon: TrendingUp },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = (path: string) =>
    isActive(path) 
      ? "bg-slate-100 text-slate-900 font-medium" 
      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50";

  return (
    <Sidebar
      className={`bg-white border-r border-slate-200 transition-all duration-300 ease-in-out
                  lg:static lg:translate-x-0 lg:w-72
                  fixed inset-y-0 left-0 z-50 w-80
                  ${collapsed ? '-translate-x-full' : 'translate-x-0'}
                  lg:${collapsed ? 'w-16' : 'w-72'}
                  flex flex-col h-full shadow-lg lg:shadow-none`}
      collapsible="icon"
    >
      {/* Header */}
      <SidebarHeader className="p-4 lg:p-6 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <img 
              src="/lovable-uploads/1b40cb28-9cbb-4fdf-9a92-f739dad1a3a7.png" 
              alt="ASH Holdings" 
              className="h-10 w-10 rounded-lg object-cover"
            />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="text-slate-900 font-semibold text-base leading-tight truncate">
                شركة علي صالح الشهري القابضة
              </h1>
              <span className="text-slate-500 text-sm">شركة رائدة منذ 2016</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto px-3 lg:px-4 py-4" 
                       style={{ 
                         WebkitOverflowScrolling: 'touch',
                         scrollbarWidth: 'thin'
                       }}>
        {/* التنقل الرئيسي */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 font-medium text-xs uppercase tracking-wide mb-4 px-2">
            {!collapsed && "التنقل الرئيسي"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${getNavCls(item.url)}`}
                    >
                      <item.icon className="w-5 h-5" />
                      {!collapsed && (
                        <span className="text-sm">
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* الخدمات */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-slate-500 font-medium text-xs uppercase tracking-wide mb-4 px-2">
            {!collapsed && "خدماتنا"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {servicesItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${getNavCls(item.url)}`}
                    >
                      <item.icon className="w-5 h-5" />
                      {!collapsed && (
                        <span className="text-sm">
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* أخرى */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-slate-500 font-medium text-xs uppercase tracking-wide mb-4 px-2">
            {!collapsed && "قصتنا"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {otherItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${getNavCls(item.url)}`}
                    >
                      <item.icon className="w-5 h-5" />
                      {!collapsed && (
                        <span className="text-sm">
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 lg:p-6 border-t border-slate-100 flex-shrink-0">
        {!collapsed && (
          <div className="space-y-4">
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-500">
                <Clock className="w-4 h-4" />
                <span className="text-xs">الأحد - الخميس 8:00 ص - 6:00 م</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin className="w-4 h-4" />
                <span className="text-xs">المملكة العربية السعودية</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <a 
                href="https://wa.me/966555812567"
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors duration-200 text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واتساب</span>
              </a>
              <a 
                href="tel:+966555812567"
                className="flex items-center gap-2 p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors duration-200 text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>0555812567</span>
              </a>
              <a 
                href="mailto:info@ash.holdings"
                className="flex items-center gap-2 p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors duration-200 text-sm"
              >
                <Mail className="w-4 h-4" />
                <span>info@ash.holdings</span>
              </a>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex flex-col items-center space-y-2">
            <a 
              href="https://wa.me/966555812567" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a 
              href="tel:+966555812567"
              className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}