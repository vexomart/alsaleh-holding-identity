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
  const { state, isMobile } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = (path: string) =>
    isActive(path) 
      ? "bg-gradient-to-r from-blue-500/90 to-purple-500/90 text-white shadow-xl border border-blue-400/30 backdrop-blur-sm" 
      : "text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/30 hover:to-purple-600/30 hover:border hover:border-blue-400/20 hover:backdrop-blur-sm";

  return (
    <Sidebar
      className={`
        ${isMobile ? "w-72" : collapsed ? "w-16" : "w-80"} 
        bg-gradient-to-b from-gray-900/95 via-gray-800/95 to-black/95 
        backdrop-blur-xl border-r border-gray-700/50 
        transition-all duration-500 ease-in-out
        ${isMobile ? "shadow-2xl" : "shadow-lg"}
      `}
      collapsible={isMobile ? "offcanvas" : "icon"}
    >
      {/* Header */}
      <SidebarHeader className={`${isMobile ? "p-4" : "p-6"} border-b border-gray-700/50 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm`}>
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img 
              src="/lovable-uploads/1b40cb28-9cbb-4fdf-9a92-f739dad1a3a7.png" 
              alt="ASH Holdings" 
              className={`${isMobile ? "h-10 w-10" : "h-12 w-12"} rounded-xl shadow-xl ring-2 ring-blue-500/40 transition-all duration-300 hover:ring-blue-400/60`}
            />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
          </div>
          {(!collapsed || isMobile) && (
            <div className="flex-1 animate-fade-in min-w-0">
              <h1 className={`text-white font-bold ${isMobile ? "text-base" : "text-lg"} leading-tight truncate`}>
                شركة علي صالح الشهري القابضة
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current animate-pulse flex-shrink-0" />
                <span className={`text-gray-400 ${isMobile ? "text-xs" : "text-sm"} truncate`}>شركة رائدة منذ 2016</span>
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className={`${isMobile ? "px-3 py-4" : "px-4 py-6"} overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent`}>
        {/* التنقل الرئيسي */}
        <SidebarGroup>
          <SidebarGroupLabel className={`text-blue-400 font-semibold ${isMobile ? "text-xs" : "text-sm"} uppercase tracking-wider mb-3 flex items-center gap-2 px-2`}>
            <Globe className="w-4 h-4 animate-spin flex-shrink-0" />
            {(!collapsed || isMobile) && "التنقل الرئيسي"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center gap-3 ${isMobile ? "p-3" : "p-3"} rounded-xl transition-all duration-300 ${getNavCls(item.url)} group relative overflow-hidden`}
                    >
                      <item.icon className={`w-5 h-5 transition-all duration-300 group-hover:scale-110 flex-shrink-0 ${isActive(item.url) ? 'text-white drop-shadow-lg' : 'text-blue-400'}`} />
                      {(!collapsed || isMobile) && (
                        <span className={`font-medium ${isMobile ? "text-sm" : "text-sm"} transition-all duration-300 truncate`}>
                          {item.title}
                        </span>
                      )}
                      {isActive(item.url) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl animate-pulse"></div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* الخدمات */}
        <SidebarGroup className={`${isMobile ? "mt-6" : "mt-8"}`}>
          <SidebarGroupLabel className={`text-purple-400 font-semibold ${isMobile ? "text-xs" : "text-sm"} uppercase tracking-wider mb-3 flex items-center gap-2 px-2`}>
            <Settings className="w-4 h-4 animate-pulse flex-shrink-0" />
            {(!collapsed || isMobile) && "خدماتنا"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {servicesItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center gap-3 ${isMobile ? "p-3" : "p-3"} rounded-xl transition-all duration-300 ${getNavCls(item.url)} group relative overflow-hidden`}
                    >
                      <item.icon className={`w-5 h-5 transition-all duration-300 group-hover:scale-110 flex-shrink-0 ${isActive(item.url) ? 'text-white drop-shadow-lg' : 'text-purple-400'}`} />
                      {(!collapsed || isMobile) && (
                        <span className={`font-medium ${isMobile ? "text-sm" : "text-sm"} transition-all duration-300 truncate`}>
                          {item.title}
                        </span>
                      )}
                      {isActive(item.url) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl animate-pulse"></div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* أخرى */}
        <SidebarGroup className={`${isMobile ? "mt-6" : "mt-8"}`}>
          <SidebarGroupLabel className={`text-green-400 font-semibold ${isMobile ? "text-xs" : "text-sm"} uppercase tracking-wider mb-3 flex items-center gap-2 px-2`}>
            <Heart className="w-4 h-4 animate-pulse flex-shrink-0" />
            {(!collapsed || isMobile) && "قصتنا"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {otherItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center gap-3 ${isMobile ? "p-3" : "p-3"} rounded-xl transition-all duration-300 ${getNavCls(item.url)} group relative overflow-hidden`}
                    >
                      <item.icon className={`w-5 h-5 transition-all duration-300 group-hover:scale-110 flex-shrink-0 ${isActive(item.url) ? 'text-white drop-shadow-lg' : 'text-green-400'}`} />
                      {(!collapsed || isMobile) && (
                        <span className={`font-medium ${isMobile ? "text-sm" : "text-sm"} transition-all duration-300 truncate`}>
                          {item.title}
                        </span>
                      )}
                      {isActive(item.url) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl animate-pulse"></div>
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
      <SidebarFooter className={`${isMobile ? "p-3" : "p-6"} border-t border-gray-700/50 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-sm`}>
        {(!collapsed || isMobile) && (
          <div className={`space-y-3 animate-fade-in ${isMobile ? "space-y-2" : "space-y-4"}`}>
            {/* Contact Info */}
            <div className={`space-y-2 ${isMobile ? "space-y-1" : "space-y-3"}`}>
              <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group">
                <Clock className="w-3 h-3 text-blue-400 group-hover:animate-spin flex-shrink-0" />
                <span className={`${isMobile ? "text-xs" : "text-xs"} truncate`}>الأحد - الخميس 8:00 ص - 6:00 م</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group">
                <MapPin className="w-3 h-3 text-red-400 group-hover:animate-bounce flex-shrink-0" />
                <span className={`${isMobile ? "text-xs" : "text-xs"} truncate`}>المملكة العربية السعودية</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`space-y-1 ${isMobile ? "space-y-1" : "space-y-2"}`}>
              <a 
                href="https://wa.me/966555812567" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex items-center gap-2 ${isMobile ? "p-2" : "p-3"} bg-green-600/90 hover:bg-green-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105 group backdrop-blur-sm shadow-lg`}
              >
                <MessageCircle className="w-4 h-4 group-hover:animate-bounce flex-shrink-0" />
                <span className={`${isMobile ? "text-xs" : "text-sm"} font-medium truncate`}>واتساب</span>
              </a>
              <a 
                href="tel:+966555812567"
                className={`flex items-center gap-2 ${isMobile ? "p-2" : "p-3"} bg-blue-600/90 hover:bg-blue-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105 group backdrop-blur-sm shadow-lg`}
              >
                <Phone className="w-4 h-4 group-hover:animate-bounce flex-shrink-0" />
                <span className={`${isMobile ? "text-xs" : "text-sm"} font-medium truncate`}>0555812567</span>
              </a>
              <a 
                href="mailto:info@ash.holdings"
                className={`flex items-center gap-2 ${isMobile ? "p-2" : "p-3"} bg-purple-600/90 hover:bg-purple-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105 group backdrop-blur-sm shadow-lg`}
              >
                <Mail className="w-4 h-4 group-hover:animate-bounce flex-shrink-0" />
                <span className={`${isMobile ? "text-xs" : "text-sm"} font-medium truncate`}>البريد الإلكتروني</span>
              </a>
            </div>
          </div>
        )}
        {collapsed && !isMobile && (
          <div className="flex flex-col items-center space-y-2">
            <a 
              href="https://wa.me/966555812567" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-green-600/90 hover:bg-green-500 text-white rounded-xl transition-all duration-300 transform hover:scale-110 shadow-lg"
              title="واتساب"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a 
              href="tel:+966555812567"
              className="p-3 bg-blue-600/90 hover:bg-blue-500 text-white rounded-xl transition-all duration-300 transform hover:scale-110 shadow-lg"
              title="اتصال"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}