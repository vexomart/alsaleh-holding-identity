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
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
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
    { name: "الخدمات التقنية", href: "/technical-services", icon: Code },
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

  const products = [
    { 
      name: "المشاريع الجاهزة", 
      href: "/ready-projects", 
      icon: Package,
      description: "مشاريع جاهزة للتطبيق الفوري"
    },
    { 
      name: "منتجاتنا البرمجية", 
      href: "/software-products", 
      icon: Code,
      description: "حلول برمجية متخصصة"
    }
  ];

  const othersItems = [
    { name: "أعمالنا", href: "/our-works", icon: Award },
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
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-6 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 group hover:text-blue-300 transition-colors">
                <Clock className="w-3 h-3 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium">الأحد - الخميس • 8:00 ص - 6:00 م</span>
              </div>
              <div className="flex items-center gap-1.5 group hover:text-emerald-300 transition-colors">
                <MapPin className="w-3 h-3 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium">جدة، المملكة العربية السعودية</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="mailto:info@alialshehriholding.com" className="flex items-center gap-1.5 text-slate-300 hover:text-blue-300 transition-all duration-300 group">
                <Mail className="w-3 h-3 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-xs">info@alialshehriholding.com</span>
              </a>
              <a href="tel:0555812567" className="flex items-center gap-1.5 text-slate-300 hover:text-blue-300 transition-all duration-300 group">
                <Phone className="w-3 h-3 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-xs">0555812567</span>
              </a>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/20 rounded-full border border-emerald-400/30">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-300 font-semibold text-xs">متاح الآن</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Corporate Navigation */}
      <nav className={`fixed ${isScrolled ? 'top-0 shadow-xl' : 'top-0 lg:top-[40px]'} w-full z-50 transition-all duration-300`}>
        <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/80">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex items-center justify-between h-14 lg:h-16">
              
              {/* Logo & Company Name - Enhanced Mobile */}
              <div className="flex items-center gap-2 sm:gap-3">
                <a href="/" className="flex items-center gap-2 group">
                  {/* Logo */}
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                      <span className="text-white font-bold text-sm lg:text-base">ASH</span>
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white animate-pulse"></div>
                  </div>
                  
                  {/* Company Name - Enhanced Typography */}
                  <div className="hidden sm:block">
                    <h1 className="text-base lg:text-lg font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                      ASH HOLDING
                    </h1>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-2 h-2 text-amber-400 fill-current group-hover:text-amber-500 transition-colors" />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        منذ 2016
                      </span>
                      <Badge variant="secondary" className="hidden lg:flex text-xs px-1.5 py-0.5 bg-emerald-100 text-emerald-700 border-emerald-200">
                        <ShieldCheck className="w-2.5 h-2.5 mr-1" />
                        موثق
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Mobile Company Name */}
                  <div className="block sm:hidden">
                    <h1 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      ASH HOLDING
                    </h1>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-1.5 h-1.5 text-amber-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500">2016</span>
                    </div>
                  </div>
                </a>
              </div>

              {/* Desktop Navigation Menu */}
              <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
                <a 
                  href="/" 
                  className="relative px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-all duration-300 group rounded-lg hover:bg-blue-50/80"
                >
                  الرئيسية
                  <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
                </a>
                <a 
                  href="/about" 
                  className="relative px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-all duration-300 group rounded-lg hover:bg-blue-50/80"
                >
                  من نحن
                  <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
                </a>
              
                {/* Services Dropdown */}
                <div 
                  className="relative group"
                  onMouseEnter={() => { if (servicesHideRef.current) clearTimeout(servicesHideRef.current); setShowServices(true); }}
                  onMouseLeave={() => { servicesHideRef.current = window.setTimeout(() => setShowServices(false), 200); }}
                >
                  <button 
                    className="relative flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-all duration-300 rounded-lg hover:bg-blue-50/80 group"
                  >
                    خدماتنا
                    <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-all duration-300" />
                    <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
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

                {/* Products Dropdown */}
                <div 
                  className="relative group"
                  onMouseEnter={() => { if (productsHideRef.current) clearTimeout(productsHideRef.current); setShowProducts(true); }}
                  onMouseLeave={() => { productsHideRef.current = window.setTimeout(() => setShowProducts(false), 200); }}
                >
                  <button 
                    className="relative flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-all duration-300 rounded-lg hover:bg-blue-50/80 group"
                  >
                    منتجاتنا
                    <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-all duration-300" />
                    <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
                  </button>
                  
                  {showProducts && (
                    <div className="absolute top-full left-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/60 z-[60]">
                      <div className="p-4">
                        <div className="space-y-2">
                          {products.map((product, index) => {
                            const IconComponent = product.icon;
                            return (
                              <a
                                key={index}
                                href={product.href}
                                className="flex items-start gap-3 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 rounded-xl group border border-transparent hover:border-blue-200/50"
                              >
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300 group-hover:scale-110 flex-shrink-0">
                                  <IconComponent className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 block leading-tight">{product.name}</span>
                                  <span className="text-xs text-slate-500 mt-1 block">{product.description}</span>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100" />
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
                  className="relative px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-all duration-300 group rounded-lg hover:bg-blue-50/80"
                >
                  رؤيتنا
                  <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
                </a>
                <a 
                  href="/subsidiaries"
                  className="relative px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-all duration-300 group rounded-lg hover:bg-blue-50/80"
                >
                  شركاتنا
                  <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
                </a>

                {/* Others Dropdown */}
                <div 
                  className="relative group"
                  onMouseEnter={() => { if (othersHideRef.current) clearTimeout(othersHideRef.current); setShowOthers(true); }}
                  onMouseLeave={() => { othersHideRef.current = window.setTimeout(() => setShowOthers(false), 200); }}
                >
                  <button 
                    className="relative flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-all duration-300 rounded-lg hover:bg-blue-50/80 group"
                  >
                    أخرى
                    <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-all duration-300" />
                    <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
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
                  href="/contact" 
                  className="relative px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 transition-all duration-300 group rounded-lg hover:bg-blue-50/80"
                >
                  تواصل معنا
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
                </a>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2 lg:gap-4">
                {/* Desktop CTA Button */}
                <div className="hidden lg:flex items-center gap-3">
                  <a 
                    href="/login"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Users className="w-4 h-4" />
                    دخول العملاء
                  </a>
                  <a 
                    href="/book-consultation"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <HeadphonesIcon className="w-4 h-4" />
                    احجز استشارة مجانية
                  </a>
                </div>

                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(!isOpen)}
                  className="lg:hidden p-2 h-10 w-10 touch-manipulation active:scale-95 transition-transform"
                  aria-label="فتح القائمة"
                >
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    <div className={`transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-0' : 'rotate-0 -translate-y-1'}`}>
                      <div className={`w-5 h-0.5 bg-slate-700 transition-all duration-300 ${isOpen ? 'rotate-90' : ''}`}></div>
                    </div>
                    <div className={`absolute w-5 h-0.5 bg-slate-700 transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></div>
                    <div className={`transition-all duration-300 ${isOpen ? '-rotate-45 translate-y-0' : 'rotate-0 translate-y-1'}`}>
                      <div className="w-5 h-0.5 bg-slate-700"></div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Mobile Menu Modal */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Enhanced Backdrop */}
          <div 
            className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md transition-all duration-300" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Mobile Modal Panel */}
          <div className="fixed top-0 right-0 h-full w-[90vw] max-w-md bg-white shadow-2xl transform transition-all duration-300 ease-out overflow-hidden rounded-l-3xl">
            <div className="flex flex-col h-full relative">
              {/* Decorative Top Gradient */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 opacity-10"></div>
              
              {/* Enhanced Header */}
              <div className="relative flex items-center justify-between p-6 border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-blue-50/30">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">ASH</span>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      ASH HOLDING
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-amber-400 fill-current" />
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-emerald-600 font-medium">متاح الآن</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-3 hover:bg-white/80 rounded-xl transition-all duration-200 active:scale-95 touch-manipulation group"
                >
                  <X className="w-6 h-6 text-slate-600 group-hover:text-red-500 transition-colors" />
                </button>
              </div>
              
              {/* Enhanced Navigation */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                <nav className="p-6 space-y-2">
                  {/* Home */}
                  <a 
                    href="/" 
                    className="flex items-center gap-4 p-4 text-slate-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-2xl transition-all duration-300 font-medium group active:scale-98 touch-manipulation border border-transparent hover:border-blue-200/50 hover:shadow-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-11 h-11 bg-gradient-to-br from-blue-100 to-indigo-100 group-hover:from-blue-600 group-hover:to-indigo-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm">
                      <Code className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-base font-semibold">الرئيسية</span>
                  </a>
                  
                  {/* About */}
                  <a 
                    href="/about" 
                    className="flex items-center gap-4 p-4 text-slate-700 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 rounded-2xl transition-all duration-300 font-medium group active:scale-98 touch-manipulation border border-transparent hover:border-emerald-200/50 hover:shadow-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-11 h-11 bg-gradient-to-br from-emerald-100 to-green-100 group-hover:from-emerald-600 group-hover:to-green-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm">
                      <Users className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-base font-semibold">من نحن</span>
                  </a>
                  
                  {/* Services Accordion */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="w-full flex items-center justify-between gap-4 p-4 text-slate-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 rounded-2xl transition-all duration-300 font-medium group active:scale-98 touch-manipulation border border-transparent hover:border-purple-200/50 hover:shadow-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-gradient-to-br from-purple-100 to-indigo-100 group-hover:from-purple-600 group-hover:to-indigo-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm">
                          <Settings className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-base font-semibold">خدماتنا</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 transition-all duration-300 ${mobileServicesOpen ? 'rotate-180 text-purple-600' : 'text-slate-400'}`} />
                    </button>
                    
                    {mobileServicesOpen && (
                      <div className="bg-gradient-to-r from-purple-50/50 to-indigo-50/50 rounded-2xl p-3 space-y-1 animate-fade-in border border-purple-200/30">
                        {services.map((service, index) => {
                          const IconComponent = service.icon;
                          return (
                            <a
                              key={index}
                              href={service.href}
                              className="flex items-center gap-3 p-3 text-sm text-slate-600 hover:text-purple-600 hover:bg-white/80 rounded-xl transition-all duration-200 group active:scale-95 touch-manipulation"
                              onClick={() => setIsOpen(false)}
                            >
                              <div className="w-8 h-8 bg-white group-hover:bg-purple-100 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm">
                                <IconComponent className="w-4 h-4 text-purple-600 transition-colors" />
                              </div>
                              <span className="font-medium">{service.name}</span>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  {/* Products Accordion */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                      className="w-full flex items-center justify-between gap-4 p-4 text-slate-700 hover:text-rose-600 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 rounded-2xl transition-all duration-300 font-medium group active:scale-98 touch-manipulation border border-transparent hover:border-rose-200/50 hover:shadow-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-gradient-to-br from-rose-100 to-pink-100 group-hover:from-rose-600 group-hover:to-pink-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm">
                          <Package className="w-5 h-5 text-rose-600 group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-base font-semibold">منتجاتنا</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 transition-all duration-300 ${mobileProductsOpen ? 'rotate-180 text-rose-600' : 'text-slate-400'}`} />
                    </button>
                    
                    {mobileProductsOpen && (
                      <div className="bg-gradient-to-r from-rose-50/50 to-pink-50/50 rounded-2xl p-3 space-y-1 animate-fade-in border border-rose-200/30">
                        {products.map((product, index) => {
                          const IconComponent = product.icon;
                          return (
                            <a
                              key={index}
                              href={product.href}
                              className="flex items-center gap-3 p-3 text-sm text-slate-600 hover:text-rose-600 hover:bg-white/80 rounded-xl transition-all duration-200 group active:scale-95 touch-manipulation"
                              onClick={() => setIsOpen(false)}
                            >
                              <div className="w-8 h-8 bg-white group-hover:bg-rose-100 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm">
                                <IconComponent className="w-4 h-4 text-rose-600 transition-colors" />
                              </div>
                              <div className="flex-1">
                                <span className="block font-medium leading-tight">{product.name}</span>
                                <span className="text-xs text-slate-500 mt-0.5 block">{product.description}</span>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  {/* Vision */}
                  <a 
                    href="/vision" 
                    className="flex items-center gap-4 p-4 text-slate-700 hover:text-amber-600 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 rounded-2xl transition-all duration-300 font-medium group active:scale-98 touch-manipulation border border-transparent hover:border-amber-200/50 hover:shadow-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-11 h-11 bg-gradient-to-br from-amber-100 to-yellow-100 group-hover:from-amber-600 group-hover:to-yellow-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm">
                      <Star className="w-5 h-5 text-amber-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-base font-semibold">رؤيتنا</span>
                  </a>
                  
                  {/* Subsidiaries */}
                  <a 
                    href="/subsidiaries" 
                    className="flex items-center gap-4 p-4 text-slate-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 rounded-2xl transition-all duration-300 font-medium group active:scale-98 touch-manipulation border border-transparent hover:border-indigo-200/50 hover:shadow-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-11 h-11 bg-gradient-to-br from-indigo-100 to-blue-100 group-hover:from-indigo-600 group-hover:to-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm">
                      <Building2 className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-base font-semibold">شركاتنا</span>
                  </a>
                  
                  {/* Others Accordion */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setMobileOthersOpen(!mobileOthersOpen)}
                      className="w-full flex items-center justify-between gap-4 p-4 text-slate-700 hover:text-teal-600 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 rounded-2xl transition-all duration-300 font-medium group active:scale-98 touch-manipulation border border-transparent hover:border-teal-200/50 hover:shadow-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-gradient-to-br from-teal-100 to-cyan-100 group-hover:from-teal-600 group-hover:to-cyan-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm">
                          <Globe className="w-5 h-5 text-teal-600 group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-base font-semibold">أخرى</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 transition-all duration-300 ${mobileOthersOpen ? 'rotate-180 text-teal-600' : 'text-slate-400'}`} />
                    </button>
                    
                    {mobileOthersOpen && (
                      <div className="bg-gradient-to-r from-teal-50/50 to-cyan-50/50 rounded-2xl p-3 space-y-1 animate-fade-in border border-teal-200/30">
                        {othersItems.map((item, index) => {
                          const IconComponent = item.icon;
                          return (
                            <a
                              key={index}
                              href={item.href}
                              className="flex items-center gap-3 p-3 text-sm text-slate-600 hover:text-teal-600 hover:bg-white/80 rounded-xl transition-all duration-200 group active:scale-95 touch-manipulation"
                              onClick={() => setIsOpen(false)}
                            >
                              <div className="w-8 h-8 bg-white group-hover:bg-teal-100 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm">
                                <IconComponent className="w-4 h-4 text-teal-600 transition-colors" />
                              </div>
                              <span className="font-medium">{item.name}</span>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  {/* Contact */}
                  <a 
                    href="/contact" 
                    className="flex items-center gap-4 p-4 text-slate-700 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-2xl transition-all duration-300 font-medium group active:scale-98 touch-manipulation border border-transparent hover:border-green-200/50 hover:shadow-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-11 h-11 bg-gradient-to-br from-green-100 to-emerald-100 group-hover:from-green-600 group-hover:to-emerald-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm">
                      <Phone className="w-5 h-5 text-green-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-base font-semibold">تواصل معنا</span>
                  </a>
                </nav>
              </div>
              
                {/* Enhanced Footer */}
              <div className="p-6 border-t border-slate-200/60 bg-gradient-to-r from-slate-50/80 to-blue-50/30 space-y-4">
                <a 
                  href="/login"
                  className="block w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center py-3 rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-98 touch-manipulation"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center justify-center gap-3">
                    <Users className="w-5 h-5" />
                    <span className="text-base">دخول العملاء</span>
                  </div>
                </a>
                <a 
                  href="/book-consultation"
                  className="block w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-center py-4 rounded-2xl font-semibold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-98 touch-manipulation"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center justify-center gap-3">
                    <HeadphonesIcon className="w-5 h-5" />
                    <span className="text-base">احجز استشارة مجانية</span>
                  </div>
                </a>
                
                <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl p-3">
                  <a 
                    href="tel:0555812567"
                    className="flex items-center gap-3 text-slate-700 hover:text-blue-600 transition-colors touch-manipulation group"
                  >
                    <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition-all duration-200">
                      <Phone className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-semibold">0555812567</span>
                  </a>
                  <a 
                    href="mailto:info@alialshehriholding.com"
                    className="flex items-center gap-3 text-slate-700 hover:text-blue-600 transition-colors touch-manipulation group"
                  >
                    <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition-all duration-200">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">إيميل</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
