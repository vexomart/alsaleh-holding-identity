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
      ? "bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 text-white shadow-2xl border border-white/20 transform scale-[1.02] backdrop-blur-xl" 
      : "text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-slate-800/50 hover:via-slate-700/50 hover:to-slate-800/50 hover:backdrop-blur-xl hover:border hover:border-white/10 hover:shadow-xl hover:transform hover:scale-[1.01]";

  return (
    <Sidebar
      className={`
        ${isMobile ? "w-80" : collapsed ? "w-20" : "w-84"} 
        bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
        backdrop-blur-2xl border-r border-slate-700/30 
        transition-all duration-700 ease-out
        shadow-2xl
        ${isMobile ? "shadow-black/50" : ""}
      `}
      collapsible={isMobile ? "offcanvas" : "icon"}
    >
      {/* Header */}
      <SidebarHeader className={`${isMobile ? "p-5" : "p-7"} border-b border-slate-700/30 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-600/10 backdrop-blur-sm relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 animate-pulse"></div>
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative shrink-0 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
            <img 
              src="/lovable-uploads/1b40cb28-9cbb-4fdf-9a92-f739dad1a3a7.png" 
              alt="ASH Holdings" 
              className={`relative ${isMobile ? "h-12 w-12" : "h-14 w-14"} rounded-2xl shadow-2xl ring-2 ring-white/20 transition-all duration-500 group-hover:scale-110`}
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse shadow-lg border-2 border-white/30"></div>
          </div>
          {(!collapsed || isMobile) && (
            <div className="flex-1 animate-fade-in min-w-0">
              <h1 className={`text-white font-bold ${isMobile ? "text-lg" : "text-xl"} leading-tight truncate bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent`}>
                شركة علي صالح الشهري القابضة
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-current animate-pulse" style={{animationDelay: `${i * 0.1}s`}} />
                  ))}
                </div>
                <span className={`text-slate-300 ${isMobile ? "text-xs" : "text-sm"} truncate bg-gradient-to-r from-slate-300 to-slate-100 bg-clip-text text-transparent`}>
                  شركة رائدة منذ 2016
                </span>
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className={`${isMobile ? "px-4 py-5" : "px-5 py-7"} overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600/50 scrollbar-track-transparent hover:scrollbar-thumb-slate-500/70 transition-all`}>
        {/* التنقل الرئيسي */}
        <SidebarGroup className="relative">
          {/* Background Glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-600/5 rounded-2xl blur-xl"></div>
          
          <SidebarGroupLabel className={`relative text-transparent bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text font-bold ${isMobile ? "text-sm" : "text-base"} uppercase tracking-widest mb-4 flex items-center gap-3 px-3`}>
            <div className="p-2 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-600/20 rounded-xl backdrop-blur-sm border border-white/10">
              <Globe className="w-4 h-4 text-emerald-400 animate-spin flex-shrink-0" />
            </div>
            {(!collapsed || isMobile) && "التنقل الرئيسي"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {mainNavItems.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center gap-4 ${isMobile ? "p-3" : "p-4"} rounded-2xl transition-all duration-500 ${getNavCls(item.url)} group relative overflow-hidden border border-transparent`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {/* Background Animation */}
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                      
                      <div className={`p-2 rounded-xl transition-all duration-300 ${isActive(item.url) ? 'bg-white/20' : 'bg-slate-700/30 group-hover:bg-slate-600/40'} backdrop-blur-sm`}>
                        <item.icon className={`w-5 h-5 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 flex-shrink-0 ${isActive(item.url) ? 'text-white drop-shadow-lg' : 'text-emerald-400'}`} />
                      </div>
                      
                      {(!collapsed || isMobile) && (
                        <span className={`font-semibold ${isMobile ? "text-sm" : "text-base"} transition-all duration-300 truncate relative z-10`}>
                          {item.title}
                        </span>
                      )}
                      
                      {isActive(item.url) && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-emerald-400 via-blue-400 to-purple-400 rounded-l-full shadow-lg"></div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* الخدمات */}
        <SidebarGroup className={`${isMobile ? "mt-6" : "mt-8"} relative`}>
          {/* Background Glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-orange-500/5 rounded-2xl blur-xl"></div>
          
          <SidebarGroupLabel className={`relative text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text font-bold ${isMobile ? "text-sm" : "text-base"} uppercase tracking-widest mb-4 flex items-center gap-3 px-3`}>
            <div className="p-2 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-xl backdrop-blur-sm border border-white/10">
              <Settings className="w-4 h-4 text-purple-400 animate-pulse flex-shrink-0" />
            </div>
            {(!collapsed || isMobile) && "خدماتنا"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {servicesItems.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center gap-4 ${isMobile ? "p-3" : "p-4"} rounded-2xl transition-all duration-500 ${getNavCls(item.url)} group relative overflow-hidden border border-transparent`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {/* Background Animation */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                      
                      <div className={`p-2 rounded-xl transition-all duration-300 ${isActive(item.url) ? 'bg-white/20' : 'bg-slate-700/30 group-hover:bg-slate-600/40'} backdrop-blur-sm`}>
                        <item.icon className={`w-5 h-5 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 flex-shrink-0 ${isActive(item.url) ? 'text-white drop-shadow-lg' : 'text-purple-400'}`} />
                      </div>
                      
                      {(!collapsed || isMobile) && (
                        <span className={`font-semibold ${isMobile ? "text-sm" : "text-base"} transition-all duration-300 truncate relative z-10`}>
                          {item.title}
                        </span>
                      )}
                      
                      {isActive(item.url) && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 via-pink-400 to-orange-400 rounded-l-full shadow-lg"></div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* أخرى */}
        <SidebarGroup className={`${isMobile ? "mt-6" : "mt-8"} relative`}>
          {/* Background Glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-teal-500/5 rounded-2xl blur-xl"></div>
          
          <SidebarGroupLabel className={`relative text-transparent bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text font-bold ${isMobile ? "text-sm" : "text-base"} uppercase tracking-widest mb-4 flex items-center gap-3 px-3`}>
            <div className="p-2 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-xl backdrop-blur-sm border border-white/10">
              <Heart className="w-4 h-4 text-green-400 animate-pulse flex-shrink-0" />
            </div>
            {(!collapsed || isMobile) && "قصتنا"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {otherItems.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center gap-4 ${isMobile ? "p-3" : "p-4"} rounded-2xl transition-all duration-500 ${getNavCls(item.url)} group relative overflow-hidden border border-transparent`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {/* Background Animation */}
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                      
                      <div className={`p-2 rounded-xl transition-all duration-300 ${isActive(item.url) ? 'bg-white/20' : 'bg-slate-700/30 group-hover:bg-slate-600/40'} backdrop-blur-sm`}>
                        <item.icon className={`w-5 h-5 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 flex-shrink-0 ${isActive(item.url) ? 'text-white drop-shadow-lg' : 'text-green-400'}`} />
                      </div>
                      
                      {(!collapsed || isMobile) && (
                        <span className={`font-semibold ${isMobile ? "text-sm" : "text-base"} transition-all duration-300 truncate relative z-10`}>
                          {item.title}
                        </span>
                      )}
                      
                      {isActive(item.url) && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-green-400 via-emerald-400 to-teal-400 rounded-l-full shadow-lg"></div>
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
      <SidebarFooter className={`${isMobile ? "p-4" : "p-6"} border-t border-slate-700/30 bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-xl relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 animate-pulse"></div>
        </div>
        
        {(!collapsed || isMobile) && (
          <div className={`space-y-4 animate-fade-in ${isMobile ? "space-y-3" : "space-y-4"} relative z-10`}>
            {/* Contact Info */}
            <div className={`space-y-3 ${isMobile ? "space-y-2" : "space-y-3"}`}>
              <div className="flex items-center gap-3 text-slate-300 hover:text-white transition-all duration-300 group p-2 rounded-xl hover:bg-slate-700/30 backdrop-blur-sm">
                <div className="p-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-400 group-hover:animate-spin flex-shrink-0" />
                </div>
                <span className={`${isMobile ? "text-xs" : "text-sm"} truncate font-medium`}>الأحد - الخميس 8:00 ص - 6:00 م</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 hover:text-white transition-all duration-300 group p-2 rounded-xl hover:bg-slate-700/30 backdrop-blur-sm">
                <div className="p-1.5 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-lg">
                  <MapPin className="w-4 h-4 text-red-400 group-hover:animate-bounce flex-shrink-0" />
                </div>
                <span className={`${isMobile ? "text-xs" : "text-sm"} truncate font-medium`}>المملكة العربية السعودية</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`space-y-2 ${isMobile ? "space-y-2" : "space-y-3"}`}>
              <a 
                href="https://wa.me/966555812567" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`group flex items-center gap-3 ${isMobile ? "p-3" : "p-4"} bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 hover:from-green-500 hover:via-green-400 hover:to-emerald-400 text-white rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-2xl backdrop-blur-sm border border-white/10 relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <MessageCircle className="w-5 h-5 group-hover:animate-bounce flex-shrink-0 relative z-10" />
                <span className={`${isMobile ? "text-sm" : "text-base"} font-bold truncate relative z-10`}>واتساب</span>
              </a>
              
              <a 
                href="tel:+966555812567"
                className={`group flex items-center gap-3 ${isMobile ? "p-3" : "p-4"} bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:via-blue-400 hover:to-cyan-400 text-white rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-2xl backdrop-blur-sm border border-white/10 relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <Phone className="w-5 h-5 group-hover:animate-bounce flex-shrink-0 relative z-10" />
                <span className={`${isMobile ? "text-sm" : "text-base"} font-bold truncate relative z-10`}>0555812567</span>
              </a>
              
              <a 
                href="mailto:info@ash.holdings"
                className={`group flex items-center gap-3 ${isMobile ? "p-3" : "p-4"} bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-500 hover:via-purple-400 hover:to-pink-400 text-white rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-2xl backdrop-blur-sm border border-white/10 relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <Mail className="w-5 h-5 group-hover:animate-bounce flex-shrink-0 relative z-10" />
                <span className={`${isMobile ? "text-sm" : "text-base"} font-bold truncate relative z-10`}>البريد الإلكتروني</span>
              </a>
            </div>
          </div>
        )}
        
        {collapsed && !isMobile && (
          <div className="flex flex-col items-center space-y-3 relative z-10">
            <a 
              href="https://wa.me/966555812567" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group p-4 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white rounded-2xl transition-all duration-500 transform hover:scale-110 shadow-xl hover:shadow-2xl"
              title="واتساب"
            >
              <MessageCircle className="w-5 h-5 group-hover:animate-bounce" />
            </a>
            <a 
              href="tel:+966555812567"
              className="group p-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-2xl transition-all duration-500 transform hover:scale-110 shadow-xl hover:shadow-2xl"
              title="اتصال"
            >
              <Phone className="w-5 h-5 group-hover:animate-bounce" />
            </a>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}