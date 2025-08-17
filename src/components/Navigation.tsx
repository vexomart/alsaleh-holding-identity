import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { CompanyProfilePDF } from "@/components/CompanyProfilePDF";

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
  Code
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

  const productsItems = [
    { name: "المشاريع الجاهزة", href: "/ready-projects", icon: Package },
    { name: "متجر الكوتشينة للعبايات", href: "/abaya-store", icon: Building2 },
    { name: "متجر البطائق الإلكترونية", href: "/cards-store", icon: Code },
    { name: "موقع تأجير السيارات", href: "/car-rental", icon: Globe },
    { name: "موقع البناء والمقاولات", href: "/construction", icon: Building2 },
    { name: "موقع التسويق الرقمي", href: "/digital-marketing-website", icon: TrendingUp },
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
      <div className="hidden lg:block bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>ساعات العمل: الأحد - الخميس 8:00 ص - 6:00 م</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-400" />
                <span>جدة، المملكة العربية السعودية</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@alialshehriholding.com">info@alialshehriholding.com</a>
              </div>
              <div className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors">
                <Phone className="w-4 h-4" />
                <a href="tel:0555812567">0555812567</a>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-semibold">متاح الآن</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Corporate Navigation */}
      <nav className={`fixed ${isScrolled ? 'top-0' : 'top-0 lg:top-[48px]'} w-full z-50 bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50 mobile-tap`}>
        <div className="container-fluid">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Logo & Company Name - Enhanced Responsive */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              <a href="/" className="flex items-center gap-1 sm:gap-2 group touch-target">
                {/* Logo */}
                <div className="relative">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                    <img 
                      src="/lovable-uploads/1b40cb28-9cbb-4fdf-9a92-f739dad1a3a7.png" 
                      alt="ASH Holdings" 
                      className="h-3 w-auto sm:h-4 md:h-5 lg:h-6 object-contain filter brightness-0 invert retina-optimized"
                    />
                  </div>
                </div>
                
                {/* Company Name - Hidden on mobile, visible on tablet+ */}
                <div className="hidden md:block">
                  <h1 className="text-base lg:text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                    شركة علي صالح الشهري القابضة
                  </h1>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2 h-2 lg:w-2.5 lg:h-2.5 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      شركة رائدة منذ 2016 • مستوى عالمي
                    </span>
                  </div>
                </div>
                
                {/* Mobile Company Name - Visible only on mobile */}
                <div className="block md:hidden">
                  <h1 className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                    علي الشهري القابضة
                  </h1>
                </div>
              </a>
            </div>

            {/* Navigation Menu - Center */}
            <div className="hidden lg:flex items-center gap-6">
              <a 
                href="/" 
                className="relative px-3 py-2 text-sm text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group"
              >
                الرئيسية
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
              </a>
              <a 
                href="/about" 
                className="relative px-3 py-2 text-sm text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group"
              >
                من نحن
                <div className="absolute bottom-0 left-0 w-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
              </a>
              
              {/* Services Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => { if (servicesHideRef.current) clearTimeout(servicesHideRef.current); setShowServices(true); }}
                onMouseLeave={() => { servicesHideRef.current = window.setTimeout(() => setShowServices(false), 200); }}
              >
                <button 
                  className="relative flex items-center gap-1 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 font-medium transition-all duration-300"
                >
                  خدماتنا
                  <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
                </button>
                
                {showServices && (
                  <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-lg shadow-xl border border-gray-100 z-[60] max-h-[70vh] overflow-y-auto overscroll-contain"
                    onMouseEnter={() => { if (servicesHideRef.current) clearTimeout(servicesHideRef.current); setShowServices(true); }}
                    onMouseLeave={() => { servicesHideRef.current = window.setTimeout(() => setShowServices(false), 200); }}
                  >
                    <div className="p-3">
                      <div className="grid grid-cols-2 gap-2">
                        {services.map((service, index) => {
                          const IconComponent = service.icon;
                          return (
                            <a
                              key={index}
                              href={service.href}
                              className="flex items-center gap-2 p-2 hover:bg-gray-50 transition-colors rounded-lg group"
                            >
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                <IconComponent className="w-4 h-4 text-blue-600 group-hover:text-white" />
                              </div>
                              <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600">{service.name}</span>
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
                  className="relative flex items-center gap-1 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 font-medium transition-all duration-300"
                >
                  أخرى
                  <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
                </button>
                
                {showOthers && (
                  <div className="absolute top-full left-0 mt-1 w-60 bg-white rounded-lg shadow-xl border border-gray-100 z-[60] max-h-[70vh] overflow-y-auto overscroll-contain"
                    onMouseEnter={() => { if (othersHideRef.current) clearTimeout(othersHideRef.current); setShowOthers(true); }}
                    onMouseLeave={() => { othersHideRef.current = window.setTimeout(() => setShowOthers(false), 200); }}
                  >
                    <div className="p-3">
                      <div className="space-y-1">
                        {othersItems.map((item, index) => {
                          const IconComponent = item.icon;
                          return (
                            <a
                              key={index}
                              href={item.href}
                              className="flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors rounded-lg group"
                            >
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                <IconComponent className="w-4 h-4 text-blue-600 group-hover:text-white" />
                              </div>
                              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{item.name}</span>
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
                className="relative px-3 py-2 text-sm text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group"
              >
                رؤيتنا
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
              </a>
              <a 
                href="/subsidiaries"
                className="relative px-3 py-2 text-sm text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group"
              >
                شركاتنا
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
              </a>
              
              {/* Products Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => { if (productsHideRef.current) clearTimeout(productsHideRef.current); setShowProducts(true); }}
                onMouseLeave={() => { productsHideRef.current = window.setTimeout(() => setShowProducts(false), 200); }}
              >
                <button 
                  className="relative flex items-center gap-1 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 font-medium transition-all duration-300"
                >
                  منتجاتنا
                  <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
                </button>
                
                {showProducts && (
                  <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-lg shadow-xl border border-gray-100 z-[60] max-h-[70vh] overflow-y-auto overscroll-contain"
                    onMouseEnter={() => { if (productsHideRef.current) clearTimeout(productsHideRef.current); setShowProducts(true); }}
                    onMouseLeave={() => { productsHideRef.current = window.setTimeout(() => setShowProducts(false), 200); }}
                  >
                    <div className="p-3">
                      <div className="grid grid-cols-2 gap-2">
                        {productsItems.map((product, index) => {
                          const IconComponent = product.icon;
                          return (
                            <a
                              key={index}
                              href={product.href}
                              className="flex items-center gap-2 p-2 hover:bg-gray-50 transition-colors rounded-lg group"
                            >
                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                                <IconComponent className="w-4 h-4 text-purple-600 group-hover:text-white" />
                              </div>
                              <span className="text-xs font-medium text-gray-700 group-hover:text-purple-600">{product.name}</span>
                            </a>
                          );
                        })}
                      </div>
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
          
          {/* Mobile Menu - Enhanced Responsive Design */}
          {isOpen && (
            <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg max-h-screen overflow-y-auto">
              <div className="px-4 py-3 space-y-2">
                
                {/* Mobile Contact Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="flex flex-col gap-2 text-sm">
                    <a href="tel:0555812567" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                      <Phone className="w-4 h-4" />
                      <span>0555812567</span>
                    </a>
                    <a href="https://wa.me/966555812567" className="flex items-center gap-2 text-green-600 hover:text-green-800">
                      <MessageCircle className="w-4 h-4" />
                      <span>واتساب</span>
                    </a>
                  </div>
                </div>
                
                <a 
                  href="/" 
                  className="block py-3 px-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  الرئيسية
                </a>
                <a 
                  href="/about" 
                  className="block py-3 px-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  من نحن
                </a>
                
                {/* خدماتنا في الموبايل - Enhanced */}
                <div className="border-b border-gray-200 pb-3">
                  <button 
                    className="flex items-center justify-between w-full py-3 px-2 text-gray-900 font-semibold hover:text-blue-600 hover:bg-blue-50 transition-all rounded-lg"
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  >
                    <span>خدماتنا</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileServicesOpen && (
                    <div className="grid grid-cols-1 gap-1 pr-2 mt-2 max-h-64 overflow-y-auto">
                      {services.map((service, index) => {
                        const IconComponent = service.icon;
                        return (
                          <a
                            key={index}
                            href={service.href}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors rounded-lg text-sm"
                            onClick={() => setIsOpen(false)}
                          >
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <IconComponent className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-gray-700 leading-tight">{service.name}</span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <a 
                  href="/vision" 
                  className="block py-3 px-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  رؤيتنا
                </a>
                <a 
                  href="/subsidiaries" 
                  className="block py-3 px-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  شركاتنا
                </a>
                
                {/* Products Dropdown for Mobile */}
                <div className="border-b border-gray-200 pb-3">
                  <button 
                    className="flex items-center justify-between w-full py-3 px-2 text-gray-900 font-semibold hover:text-blue-600 hover:bg-blue-50 transition-all rounded-lg"
                    onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                  >
                    <span>منتجاتنا</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileProductsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileProductsOpen && (
                    <div className="grid grid-cols-1 gap-1 pr-2 mt-2 max-h-64 overflow-y-auto">
                      {productsItems.map((product, index) => {
                        const IconComponent = product.icon;
                        return (
                          <a
                            key={index}
                            href={product.href}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors rounded-lg text-sm"
                            onClick={() => setIsOpen(false)}
                          >
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <IconComponent className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="text-gray-700 leading-tight">{product.name}</span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                {/* أخرى في الموبايل - Enhanced */}
                <div className="border-b border-gray-200 pb-3">
                  <button 
                    className="flex items-center justify-between w-full py-3 px-2 text-gray-900 font-semibold hover:text-blue-600 hover:bg-blue-50 transition-all rounded-lg"
                    onClick={() => setMobileOthersOpen(!mobileOthersOpen)}
                  >
                    <span>أخرى</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileOthersOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileOthersOpen && (
                    <div className="space-y-1 pr-2 mt-2 max-h-48 overflow-y-auto">
                      {othersItems.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                          <a
                            key={index}
                            href={item.href}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors rounded-lg text-sm"
                            onClick={() => setIsOpen(false)}
                          >
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <IconComponent className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-gray-700 leading-tight">{item.name}</span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                
                {/* Mobile Action Button */}
                {/* CTA button hidden as requested */}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navigation;