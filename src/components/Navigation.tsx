import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  X, 
  Globe, 
  Zap, 
  Phone, 
  Mail, 
  MessageCircle,
  ChevronDown,
  Clock,
  MapPin,
  Star,
  Award,
  Users,
  Building2,
  HeadphonesIcon,
  Search,
  Bell,
  Gift,
  Settings,
  PenTool,
  Palette,
  BookOpen,
  Sparkles,
  TrendingUp,
  Package,
  Code,
  ShieldCheck,
  ArrowUpRight
} from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showOthers, setShowOthers] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileOthersOpen, setMobileOthersOpen] = useState(false);
  const location = useLocation();
  const servicesHideRef = useRef<number | undefined>(undefined);
  const productsHideRef = useRef<number | undefined>(undefined);
  const othersHideRef = useRef<number | undefined>(undefined);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    { name: "العروض الحالية", href: "/current-offers", icon: Gift },
    { name: "خدمات الأعمال", href: "/business-services", icon: Building2 },
    { name: "الاستضافات و الخوادم", href: "/hosting-services", icon: Globe },
    { name: "خدماتنا الاحترافية", href: "/professional-services", icon: Settings },
    { name: "خدماتنا الأخرى", href: "/services-catalog", icon: Package },
    { name: "صناعة المحتوى", href: "/content-creation", icon: PenTool },
    { name: "حلول التصميم", href: "/design-solutions", icon: Palette },
    { name: "الاستثمار التقني", href: "/tech-investment", icon: Zap },
    { name: "التطوير والابتكار", href: "/development", icon: Building2 },
    { name: "الاستشارات الإستراتيجية", href: "/strategic-consulting", icon: Users },
    { name: "الحلول المتكاملة", href: "/integrated-solutions", icon: Award },
    { name: "المنظومة التقنية المتكاملة", href: "/tech-ecosystem", icon: Zap }
  ];

  const othersItems = [
    { name: "العمل عن بُعد", href: "/remote-work", icon: Globe },
    { name: "الشراكات", href: "/partnerships", icon: Users },
    { name: "التسويق بالعمولة", href: "/affiliate-marketing", icon: TrendingUp },
    { name: "طرق الدفع", href: "/payment-methods", icon: Phone },
    { name: "رحلة الإبداع والتميز", href: "/story", icon: Sparkles },
    { name: "قيمنا وثقافتنا", href: "/about", icon: TrendingUp },
  ];

  return (
    <>
      {/* Corporate Top Bar */}
      <div className="hidden lg:block bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-8 text-sm text-slate-300">
              <div className="flex items-center gap-2 group hover:text-blue-300 transition-colors">
                <Clock className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium">الأحد - الخميس • 8:00 ص - 6:00 م</span>
              </div>
              <div className="flex items-center gap-2 group hover:text-emerald-300 transition-colors">
                <MapPin className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium">جدة، المملكة العربية السعودية</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="mailto:info@alialshehriholding.com" className="flex items-center gap-2 text-slate-300 hover:text-blue-300 transition-all duration-300 group">
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium">info@alialshehriholding.com</span>
              </a>
              <a href="tel:0555812567" className="flex items-center gap-2 text-slate-300 hover:text-blue-300 transition-all duration-300 group">
                <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium">0555812567</span>
              </a>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-400/30">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-300 font-semibold text-sm">متاح الآن</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Corporate Navigation */}
      <nav className={`fixed ${isScrolled ? 'top-0 shadow-xl' : 'top-0 lg:top-[56px]'} w-full z-50 transition-all duration-300`}>
        <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/80">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex items-center justify-between h-16 lg:h-18">
              
              {/* Logo & Company Name - Enhanced Responsive */}
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                <a href="/" className="flex items-center gap-2 sm:gap-3 group">
                  {/* Logo */}
                  <div className="relative">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <img 
                        src="/lovable-uploads/1b40cb28-9cbb-4fdf-9a92-f739dad1a3a7.png" 
                        alt="ASH Holdings" 
                        className="h-4 w-auto sm:h-5 lg:h-6 object-contain filter brightness-0 invert"
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  
                  {/* Company Name - Enhanced Typography */}
                  <div className="hidden sm:block">
                    <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                      <span className="hidden lg:inline">شركة علي صالح الشهري القابضة</span>
                      <span className="lg:hidden">علي الشهري القابضة</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 text-amber-400 fill-current group-hover:text-amber-500 transition-colors" />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        <span className="hidden lg:inline">شركة رائدة منذ 2016 • مستوى عالمي</span>
                        <span className="lg:hidden">منذ 2016</span>
                      </span>
                      <Badge variant="secondary" className="hidden lg:flex text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 border-emerald-200">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        موثق
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Mobile Company Name */}
                  <div className="block sm:hidden">
                    <h1 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      علي الشهري
                    </h1>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-2 h-2 text-amber-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500">2016</span>
                    </div>
                  </div>
                </a>
              </div>

              {/* Navigation Menu - Center */}
              <div className="hidden lg:flex items-center gap-1 xl:gap-2">
                <a 
                  href="/" 
                  className="relative px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 transition-all duration-300 group rounded-lg hover:bg-blue-50/80"
                >
                  الرئيسية
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
                </a>
                <a 
                  href="/about" 
                  className="relative px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 transition-all duration-300 group rounded-lg hover:bg-blue-50/80"
                >
                  من نحن
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
                </a>
              
                {/* Services Dropdown */}
                <div 
                  className="relative group"
                  onMouseEnter={() => { if (servicesHideRef.current) clearTimeout(servicesHideRef.current); setShowServices(true); }}
                  onMouseLeave={() => { servicesHideRef.current = window.setTimeout(() => setShowServices(false), 200); }}
                >
                  <button 
                    className="relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 transition-all duration-300 rounded-lg hover:bg-blue-50/80 group"
                  >
                    خدماتنا
                    <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition-all duration-300" />
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
                  </button>
                  
                  {showServices && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/60 z-[60] max-h-[75vh] overflow-y-auto"
                      onMouseEnter={() => { if (servicesHideRef.current) clearTimeout(servicesHideRef.current); setShowServices(true); }}
                      onMouseLeave={() => { servicesHideRef.current = window.setTimeout(() => setShowServices(false), 200); }}
                    >
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-2">
                          {services.map((service, index) => {
                            const IconComponent = service.icon;
                            return (
                              <a
                                key={index}
                                href={service.href}
                                className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 rounded-xl group border border-transparent hover:border-blue-200/50"
                              >
                                <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300 group-hover:scale-110">
                                  <IconComponent className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
                                </div>
                                <span className="text-xs font-medium text-slate-700 group-hover:text-blue-600 leading-tight">{service.name}</span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Others Dropdown */}
                <div 
                  className="relative group"
                  onMouseEnter={() => { if (othersHideRef.current) clearTimeout(othersHideRef.current); setShowOthers(true); }}
                  onMouseLeave={() => { othersHideRef.current = window.setTimeout(() => setShowOthers(false), 200); }}
                >
                  <button 
                    className="relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 transition-all duration-300 rounded-lg hover:bg-blue-50/80 group"
                  >
                    أخرى
                    <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition-all duration-300" />
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
                  </button>
                  
                  {showOthers && (
                    <div className="absolute top-full left-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/60 z-[60] max-h-[75vh] overflow-y-auto"
                      onMouseEnter={() => { if (othersHideRef.current) clearTimeout(othersHideRef.current); setShowOthers(true); }}
                      onMouseLeave={() => { othersHideRef.current = window.setTimeout(() => setShowOthers(false), 200); }}
                    >
                      <div className="p-4">
                        <div className="space-y-2">
                          {othersItems.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                              <a
                                key={index}
                                href={item.href}
                                className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 rounded-xl group border border-transparent hover:border-blue-200/50"
                              >
                                <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300 group-hover:scale-110">
                                  <IconComponent className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
                                </div>
                                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600">{item.name}</span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                
                <a 
                  href="/vision" 
                  className="relative px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 transition-all duration-300 group rounded-lg hover:bg-blue-50/80"
                >
                  رؤيتنا
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
                </a>
                <a 
                  href="/subsidiaries"
                  className="relative px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 transition-all duration-300 group rounded-lg hover:bg-blue-50/80"
                >
                  شركاتنا
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
                </a>
              
                {/* Products Dropdown */}
                <div 
                  className="relative group"
                  onMouseEnter={() => { if (productsHideRef.current) clearTimeout(productsHideRef.current); setShowProducts(true); }}
                  onMouseLeave={() => { productsHideRef.current = window.setTimeout(() => setShowProducts(false), 200); }}
                >
                  <button 
                    className="relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 transition-all duration-300 rounded-lg hover:bg-blue-50/80 group"
                  >
                    منتجاتنا
                    <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition-all duration-300" />
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
                  </button>
                  
                  {showProducts && (
                    <div className="absolute top-full left-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/60 z-[60]"
                      onMouseEnter={() => { if (productsHideRef.current) clearTimeout(productsHideRef.current); setShowProducts(true); }}
                      onMouseLeave={() => { productsHideRef.current = window.setTimeout(() => setShowProducts(false), 200); }}
                    >
                      <div className="p-4 space-y-2">
                        <a
                          href="/ready-projects"
                          className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-300 group border border-transparent hover:border-blue-200/50"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300 group-hover:scale-110">
                            <Package className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">المشاريع الجاهزة</div>
                            <div className="text-xs text-slate-500">حلول جاهزة للتطبيق فوراً</div>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </a>
                        <Link
                          to="/software-products"
                          className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 rounded-xl transition-all duration-300 group border border-transparent hover:border-purple-200/50"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:from-purple-600 group-hover:to-indigo-600 transition-all duration-300 group-hover:scale-110">
                            <Code className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-slate-800 group-hover:text-purple-600 transition-colors">منتجاتنا البرمجية</div>
                            <div className="text-xs text-slate-500">برمجيات وتطبيقات متخصصة</div>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            {/* Action Buttons - Responsive */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Contact Buttons - Hidden on mobile, visible on larger screens */}
              <div className="hidden lg:flex items-center gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 lg:px-3 text-xs flex items-center gap-1 lg:gap-1.5 border-green-500 text-green-600 hover:bg-green-50"
                  asChild
                >
                  <a href="https://wa.me/966555812567" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-3 h-3" />
                    <span className="hidden xl:block">واتساب</span>
                  </a>
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 lg:px-3 text-xs flex items-center gap-1 lg:gap-1.5 border-blue-500 text-blue-600 hover:bg-blue-50"
                  asChild
                >
                  <a href="tel:0555812567">
                    <Phone className="w-3 h-3" />
                    <span className="hidden xl:block">اتصال</span>
                  </a>
                </Button>
              </div>
              
              {/* Main CTA - Responsive */}
              <Button 
                size="sm"
                className="h-8 px-2 sm:px-4 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <a href="/start-with-us">
                  <span className="hidden sm:block">ابدأ معنا</span>
                  <span className="sm:hidden">ابدأ</span>
                  <Zap className="w-3 h-3 mr-1 sm:mr-1.5" />
                </a>
              </Button>
              
              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
            
            {/* Mobile Menu - Enhanced Design */}
            {isOpen && (
              <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-xl">
                <div className="px-4 py-4 space-y-3 max-h-screen overflow-y-auto">
                  
                  {/* Mobile Contact Info */}
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200/50">
                    <div className="grid grid-cols-2 gap-3">
                      <a href="tel:0555812567" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors group">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                          <Phone className="w-4 h-4 group-hover:text-white" />
                        </div>
                        <span className="font-medium text-sm">اتصال</span>
                      </a>
                      <a href="https://wa.me/966555812567" target="_blank" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 transition-colors group">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                          <MessageCircle className="w-4 h-4 group-hover:text-white" />
                        </div>
                        <span className="font-medium text-sm">واتساب</span>
                      </a>
                    </div>
                  </div>
                  
                  <a 
                    href="/" 
                    className="block py-4 px-4 text-slate-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 font-medium rounded-xl transition-all duration-300 border border-transparent hover:border-blue-200/50"
                    onClick={() => setIsOpen(false)}
                  >
                    الرئيسية
                  </a>
                  <a 
                    href="/about" 
                    className="block py-4 px-4 text-slate-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 font-medium rounded-xl transition-all duration-300 border border-transparent hover:border-blue-200/50"
                    onClick={() => setIsOpen(false)}
                  >
                    من نحن
                  </a>
                
                  {/* خدماتنا في الموبايل - Enhanced */}
                  <div className="border-b border-slate-200 pb-4">
                    <button 
                      className="flex items-center justify-between w-full py-4 px-4 text-slate-900 font-semibold hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all rounded-xl border border-transparent hover:border-blue-200/50"
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    >
                      <span>خدماتنا</span>
                      <ChevronDown className={`w-5 h-5 transition-all duration-300 ${mobileServicesOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                    </button>
                    {mobileServicesOpen && (
                      <div className="grid grid-cols-1 gap-2 pr-2 mt-3 max-h-64 overflow-y-auto">
                        {services.map((service, index) => {
                          const IconComponent = service.icon;
                          return (
                            <a
                              key={index}
                              href={service.href}
                              className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 rounded-xl text-sm border border-transparent hover:border-blue-200/50 group"
                              onClick={() => setIsOpen(false)}
                            >
                              <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                                <IconComponent className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
                              </div>
                              <span className="text-slate-700 group-hover:text-blue-600 leading-tight font-medium">{service.name}</span>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                
                  <a 
                    href="/vision" 
                    className="block py-4 px-4 text-slate-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 font-medium rounded-xl transition-all duration-300 border border-transparent hover:border-blue-200/50"
                    onClick={() => setIsOpen(false)}
                  >
                    رؤيتنا
                  </a>
                  <a 
                    href="/subsidiaries" 
                    className="block py-4 px-4 text-slate-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 font-medium rounded-xl transition-all duration-300 border border-transparent hover:border-blue-200/50"
                    onClick={() => setIsOpen(false)}
                  >
                    شركاتنا
                  </a>
                
                  {/* Products Dropdown for Mobile */}
                  <div className="border-b border-slate-200 pb-4">
                    <div className="py-2">
                      <h3 className="px-4 py-2 text-slate-900 font-semibold text-sm">منتجاتنا</h3>
                    </div>
                    <div className="space-y-2 pr-2">
                      <a
                        href="/ready-projects"
                        className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 rounded-xl text-sm border border-transparent hover:border-blue-200/50 group"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                          <Package className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1">
                          <span className="text-slate-700 group-hover:text-blue-600 leading-tight font-medium">المشاريع الجاهزة</span>
                          <div className="text-xs text-slate-500 mt-1">حلول جاهزة للتطبيق</div>
                        </div>
                      </a>
                      <Link
                        to="/software-products"
                        className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-300 rounded-xl text-sm border border-transparent hover:border-purple-200/50 group"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-purple-600 group-hover:to-indigo-600 transition-all duration-300">
                          <Code className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1">
                          <span className="text-slate-700 group-hover:text-purple-600 leading-tight font-medium">منتجاتنا البرمجية</span>
                          <div className="text-xs text-slate-500 mt-1">برمجيات متخصصة</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                
                  {/* أخرى في الموبايل - Enhanced */}
                  <div className="pb-4">
                    <button 
                      className="flex items-center justify-between w-full py-4 px-4 text-slate-900 font-semibold hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all rounded-xl border border-transparent hover:border-blue-200/50"
                      onClick={() => setMobileOthersOpen(!mobileOthersOpen)}
                    >
                      <span>أخرى</span>
                      <ChevronDown className={`w-5 h-5 transition-all duration-300 ${mobileOthersOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                    </button>
                    {mobileOthersOpen && (
                      <div className="space-y-2 pr-2 mt-3 max-h-48 overflow-y-auto">
                        {othersItems.map((item, index) => {
                          const IconComponent = item.icon;
                          return (
                            <a
                              key={index}
                              href={item.href}
                              className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 rounded-xl text-sm border border-transparent hover:border-blue-200/50 group"
                              onClick={() => setIsOpen(false)}
                            >
                              <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                                <IconComponent className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
                              </div>
                              <span className="text-slate-700 group-hover:text-blue-600 leading-tight font-medium">{item.name}</span>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  {/* Mobile CTA */}
                  <div className="pt-4 border-t border-slate-200">
                    <Button 
                      size="lg"
                      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      asChild
                    >
                      <a href="/start-with-us" onClick={() => setIsOpen(false)}>
                        <Zap className="w-5 h-5 mr-2" />
                        ابدأ رحلتك معنا الآن
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;