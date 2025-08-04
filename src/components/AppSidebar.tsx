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
  { title: "لوحة التحكم", url: "/dashboard", icon: BarChart3 },
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
      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105" 
      : "text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:transform hover:scale-105";

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-80"} bg-gradient-to-b from-gray-900 via-gray-800 to-black border-r border-gray-700 transition-all duration-300 ease-in-out`}
      collapsible="icon"
    >
      {/* Header */}
      <SidebarHeader className="p-6 border-b border-gray-700/50">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src="/lovable-uploads/1b40cb28-9cbb-4fdf-9a92-f739dad1a3a7.png" 
              alt="ASH Holdings" 
              className="h-12 w-12 rounded-lg shadow-lg ring-2 ring-blue-500/30 animate-pulse"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
          </div>
          {!collapsed && (
            <div className="flex-1 animate-fade-in">
              <h1 className="text-white font-bold text-lg leading-tight">
                شركة علي صالح الشهري القابضة
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current animate-pulse" />
                <span className="text-gray-400 text-sm">شركة رائدة منذ 2016</span>
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        {/* التنقل الرئيسي */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-400 font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 animate-spin" />
            {!collapsed && "التنقل الرئيسي"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${getNavCls(item.url)} group`}
                    >
                      <item.icon className={`w-5 h-5 transition-all duration-300 group-hover:animate-bounce ${isActive(item.url) ? 'text-white' : 'text-blue-400'}`} />
                      {!collapsed && (
                        <span className="font-medium text-sm transition-all duration-300">
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
        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-purple-400 font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4 animate-pulse" />
            {!collapsed && "خدماتنا"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {servicesItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${getNavCls(item.url)} group`}
                    >
                      <item.icon className={`w-5 h-5 transition-all duration-300 group-hover:animate-spin ${isActive(item.url) ? 'text-white' : 'text-purple-400'}`} />
                      {!collapsed && (
                        <span className="font-medium text-sm transition-all duration-300">
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
        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-green-400 font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <Heart className="w-4 h-4 animate-pulse" />
            {!collapsed && "قصتنا"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {otherItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${getNavCls(item.url)} group`}
                    >
                      <item.icon className={`w-5 h-5 transition-all duration-300 group-hover:animate-bounce ${isActive(item.url) ? 'text-white' : 'text-green-400'}`} />
                      {!collapsed && (
                        <span className="font-medium text-sm transition-all duration-300">
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
      <SidebarFooter className="p-6 border-t border-gray-700/50">
        {!collapsed && (
          <div className="space-y-4 animate-fade-in">
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group">
                <Clock className="w-4 h-4 text-blue-400 group-hover:animate-spin" />
                <span className="text-xs">الأحد - الخميس 8:00 ص - 6:00 م</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group">
                <MapPin className="w-4 h-4 text-red-400 group-hover:animate-bounce" />
                <span className="text-xs">المملكة العربية السعودية</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <a 
                href="https://wa.me/966555812567" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-all duration-300 transform hover:scale-105 group"
              >
                <MessageCircle className="w-4 h-4 group-hover:animate-bounce" />
                <span className="text-sm font-medium">واتساب</span>
              </a>
              <a 
                href="tel:+966555812567"
                className="flex items-center gap-3 p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all duration-300 transform hover:scale-105 group"
              >
                <Phone className="w-4 h-4 group-hover:animate-bounce" />
                <span className="text-sm font-medium">0555812567</span>
              </a>
              <a 
                href="mailto:info@ash.holdings"
                className="flex items-center gap-3 p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all duration-300 transform hover:scale-105 group"
              >
                <Mail className="w-4 h-4 group-hover:animate-bounce" />
                <span className="text-sm font-medium">info@ash.holdings</span>
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
              className="p-3 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-all duration-300 transform hover:scale-110"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a 
              href="tel:+966555812567"
              className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all duration-300 transform hover:scale-110"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}