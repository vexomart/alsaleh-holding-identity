 import * as React from "react";
 import { useLocation, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  X, 
  Globe, 
  Zap, 
  Phone, 
  Mail, 
  ChevronDown,
   ChevronLeft,
  Clock,
  MapPin,
  Star,
  Award,
  Users,
  Building2,
  HeadphonesIcon,
  Gift,
  Settings,
  PenTool,
  Palette,
  Package,
  Code,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  Sparkles
} from "lucide-react";

const Navigation = () => {
   const [isOpen, setIsOpen] = React.useState(false);
   const [isScrolled, setIsScrolled] = React.useState(false);
   const [showServices, setShowServices] = React.useState(false);
   const [showProducts, setShowProducts] = React.useState(false);
   const [showOthers, setShowOthers] = React.useState(false);
   const [mobileServicesOpen, setMobileServicesOpen] = React.useState(false);
   const [mobileProductsOpen, setMobileProductsOpen] = React.useState(false);
   const [mobileOthersOpen, setMobileOthersOpen] = React.useState(false);
  const location = useLocation();
   const navigate = useNavigate();
  
   const servicesHideRef = React.useRef<number | undefined>(undefined);
   const productsHideRef = React.useRef<number | undefined>(undefined);
   const othersHideRef = React.useRef<number | undefined>(undefined);
  
   React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
   React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const services = [
    { name: "العروض الحالية", href: "/current-offers", icon: Gift },
    { name: "الخدمات التقنية", href: "/technical-services", icon: Code },
    { name: "خدمات الأعمال", href: "/business-services", icon: Building2 },
    { name: "الاستضافات والخوادم", href: "/hosting-services", icon: Globe },
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
    { name: "المشاريع الجاهزة", href: "/ready-projects", icon: Package, description: "مشاريع جاهزة للتطبيق الفوري" },
    { name: "منتجاتنا البرمجية", href: "/software-products", icon: Code, description: "حلول برمجية متخصصة" }
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

   // Helper to check active route
   const isActiveRoute = (href: string) => {
     if (href === '/') return location.pathname === '/';
     return location.pathname.startsWith(href);
   };

   // Close mobile menu and navigate
   const handleMobileNavigate = (href: string) => {
     setIsOpen(false);
     setMobileServicesOpen(false);
     setMobileProductsOpen(false);
     setMobileOthersOpen(false);
     navigate(href);
   };

  return (
    <>
      {/* ===== TOP BAR (Desktop Only) ===== */}
      <div className="hidden lg:block fixed top-0 inset-x-0 z-50 h-10 bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50">
        <div className="container mx-auto h-full px-6">
           <div className="flex h-full items-center justify-between" dir="rtl">
             {/* Right Side (RTL) - Time & Location */}
             <div className="flex items-center gap-6 text-xs text-slate-300 flex-row-reverse lg:flex-row">
              <div className="flex items-center gap-1.5 hover:text-blue-300 transition-colors">
                <span className="font-medium">الأحد - الخميس • 8:00 ص - 6:00 م</span>
                 <Clock className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors">
                <span className="font-medium">جدة، المملكة العربية السعودية</span>
                 <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
            
             {/* Left Side (RTL) - Contact & Status */}
            <div className="flex items-center gap-4">
              <a href="mailto:info@ash-holding.sa" className="flex items-center gap-1.5 text-slate-300 hover:text-blue-300 transition-colors">
                <span className="font-medium text-xs">info@ash-holding.sa</span>
                 <Mail className="w-3.5 h-3.5" />
              </a>
              <a href="tel:0555812567" className="flex items-center gap-1.5 text-slate-300 hover:text-blue-300 transition-colors">
                <span className="font-medium text-xs ltr" dir="ltr">0555812567</span>
                 <Phone className="w-3.5 h-3.5" />
              </a>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/20 rounded-full border border-emerald-400/30">
                <span className="text-emerald-300 font-semibold text-xs">متاح الآن</span>
                 <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN NAVIGATION ===== */}
      <header 
        className={`
          fixed inset-x-0 z-40 
          transition-all duration-300 ease-out
          ${isScrolled ? 'top-0 shadow-lg' : 'top-0 lg:top-10'}
        `}
      >
        <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/80">
          <div className="container mx-auto px-4 lg:px-6">
             {/* Main Nav Container - RTL Native Flow */}
             <div className="flex items-center justify-between h-14 lg:h-16" dir="rtl">
              
              {/* ===== LOGO (Right in RTL) ===== */}
              <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
                {/* Logo Icon */}
                <div className="relative">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                    <span className="text-white font-bold text-sm sm:text-base">ASH</span>
                  </div>
                   <div className="absolute -top-0.5 -end-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                
                {/* Company Name - Desktop */}
                <div className="hidden sm:block">
                  <h1 className="text-base lg:text-lg font-bold bg-gradient-to-l from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                    ASH HOLDING
                  </h1>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 font-medium">منذ 2016</span>
                    <Badge variant="secondary" className="hidden lg:inline-flex text-xs px-1.5 py-0.5 bg-emerald-100 text-emerald-700 border-emerald-200 gap-1">
                      موثق
                       <ShieldCheck className="w-2.5 h-2.5" />
                    </Badge>
                  </div>
                </div>
                
                {/* Company Name - Mobile */}
                <div className="sm:hidden">
                  <h1 className="text-sm font-bold text-slate-900">ASH HOLDING</h1>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2 h-2 text-amber-400 fill-current" />
                    ))}
                  </div>
                </div>
              </Link>

              {/* ===== DESKTOP NAV LINKS (Center) ===== */}
              <nav className="hidden lg:flex items-center gap-1">
                 <NavLinkItem to="/" isActive={isActiveRoute('/')}>الرئيسية</NavLinkItem>
                 <NavLinkItem to="/about" isActive={isActiveRoute('/about')}>من نحن</NavLinkItem>
                
                {/* Services Dropdown */}
                <DropdownMenu
                  label="خدماتنا"
                  isOpen={showServices}
                  onOpen={() => { clearTimeout(servicesHideRef.current); setShowServices(true); }}
                  onClose={() => { servicesHideRef.current = window.setTimeout(() => setShowServices(false), 150); }}
                   isActive={services.some(s => isActiveRoute(s.href))}
                >
                  <div className="p-3 grid grid-cols-2 gap-1.5 max-h-[70vh] overflow-y-auto">
                    {services.map((service, index) => (
                       <DropdownItem key={index} to={service.href} icon={service.icon} isActive={isActiveRoute(service.href)}>
                        {service.name}
                      </DropdownItem>
                    ))}
                  </div>
                </DropdownMenu>
                
                {/* Products Dropdown */}
                <DropdownMenu
                  label="منتجاتنا"
                  isOpen={showProducts}
                  onOpen={() => { clearTimeout(productsHideRef.current); setShowProducts(true); }}
                  onClose={() => { productsHideRef.current = window.setTimeout(() => setShowProducts(false), 150); }}
                   isActive={products.some(p => isActiveRoute(p.href))}
                >
                  <div className="p-3 space-y-1.5">
                    {products.map((product, index) => (
                       <Link
                        key={index}
                         to={product.href}
                         className={`flex items-center gap-3 p-3 rounded-xl transition-colors group ${
                           isActiveRoute(product.href) ? 'bg-blue-100' : 'hover:bg-blue-50'
                         }`}
                      >
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                           isActiveRoute(product.href) ? 'bg-blue-600' : 'bg-blue-100 group-hover:bg-blue-600'
                         }`}>
                           <product.icon className={`w-5 h-5 transition-colors ${
                             isActiveRoute(product.href) ? 'text-white' : 'text-blue-600 group-hover:text-white'
                           }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                           <span className={`block text-sm font-medium ${
                             isActiveRoute(product.href) ? 'text-blue-600' : 'text-slate-700 group-hover:text-blue-600'
                           }`}>{product.name}</span>
                          <span className="block text-xs text-slate-500 mt-0.5">{product.description}</span>
                        </div>
                         <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all" />
                       </Link>
                    ))}
                  </div>
                </DropdownMenu>
                
                 <NavLinkItem to="/vision" isActive={isActiveRoute('/vision')}>رؤيتنا</NavLinkItem>
                 <NavLinkItem to="/subsidiaries" isActive={isActiveRoute('/subsidiaries')}>شركاتنا</NavLinkItem>
                
                {/* Others Dropdown */}
                <DropdownMenu
                  label="أخرى"
                  isOpen={showOthers}
                  onOpen={() => { clearTimeout(othersHideRef.current); setShowOthers(true); }}
                  onClose={() => { othersHideRef.current = window.setTimeout(() => setShowOthers(false), 150); }}
                   isActive={othersItems.some(i => isActiveRoute(i.href))}
                >
                  <div className="p-3 space-y-1">
                    {othersItems.map((item, index) => (
                       <DropdownItem key={index} to={item.href} icon={item.icon} isActive={isActiveRoute(item.href)}>
                        {item.name}
                      </DropdownItem>
                    ))}
                  </div>
                </DropdownMenu>
                
                 <NavLinkItem to="/contact" isActive={isActiveRoute('/contact')}>تواصل معنا</NavLinkItem>
              </nav>

               {/* ===== CTA & MOBILE BUTTON ===== */}
              <div className="flex items-center gap-2 lg:gap-3 shrink-0">
                 {/* Mobile Menu Toggle - LEFT side in RTL */}
                 <button
                   onClick={() => setIsOpen(!isOpen)}
                   className="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl hover:bg-slate-100 transition-colors active:scale-95"
                   aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
                   aria-expanded={isOpen}
                 >
                   <div className="w-6 h-5 flex flex-col justify-center items-center gap-1.5">
                     <span className={`block w-5 h-0.5 bg-slate-700 rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                     <span className={`block w-5 h-0.5 bg-slate-700 rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
                     <span className={`block w-5 h-0.5 bg-slate-700 rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                   </div>
                 </button>

                {/* Desktop CTA */}
                 <Link 
                   to="/book-consultation"
                  className="hidden lg:inline-flex items-center gap-2 px-4 xl:px-5 py-2.5 bg-gradient-to-l from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
                >
                  <HeadphonesIcon className="w-4 h-4" />
                   <span>احجز استشارة مجانية</span>
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MOBILE MENU OVERLAY ===== */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
           {/* Panel - Opens from RIGHT in RTL */}
           <div className="absolute top-0 end-0 h-full w-[85vw] max-w-sm bg-white shadow-2xl animate-slide-in-rtl" dir="rtl">
            {/* Mobile Header */}
             <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/50">
               {/* Logo on Right */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow">
                  <span className="text-white font-bold text-sm">ASH</span>
                </div>
                <div>
                  <span className="block text-sm font-bold text-slate-900">ASH HOLDING</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2 h-2 text-amber-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
               {/* Close button on Left */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
                aria-label="إغلاق القائمة"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Mobile Nav Items */}
             <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-1 max-h-[calc(100vh-180px)]">
               <MobileNavLink 
                 to="/" 
                 icon={Code} 
                 onClick={() => handleMobileNavigate('/')}
                 isActive={isActiveRoute('/')}
               >
                الرئيسية
              </MobileNavLink>
              
               <MobileNavLink 
                 to="/about" 
                 icon={Users} 
                 onClick={() => handleMobileNavigate('/about')}
                 isActive={isActiveRoute('/about')}
               >
                من نحن
              </MobileNavLink>
              
              {/* Services Accordion */}
              <MobileAccordion
                label="خدماتنا"
                icon={Settings}
                isOpen={mobileServicesOpen}
                onToggle={() => setMobileServicesOpen(!mobileServicesOpen)}
                 isActive={services.some(s => isActiveRoute(s.href))}
              >
                {services.map((service, index) => (
                   <button
                    key={index}
                     onClick={() => handleMobileNavigate(service.href)}
                     className={`w-full flex items-center gap-3 p-3 text-sm rounded-xl transition-colors text-start ${
                       isActiveRoute(service.href) 
                         ? 'text-blue-600 bg-blue-50 font-medium' 
                         : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                     }`}
                  >
                    <service.icon className="w-4 h-4" />
                    <span>{service.name}</span>
                   </button>
                ))}
              </MobileAccordion>
              
              {/* Products Accordion */}
              <MobileAccordion
                label="منتجاتنا"
                icon={Package}
                isOpen={mobileProductsOpen}
                onToggle={() => setMobileProductsOpen(!mobileProductsOpen)}
                 isActive={products.some(p => isActiveRoute(p.href))}
              >
                {products.map((product, index) => (
                   <button
                    key={index}
                     onClick={() => handleMobileNavigate(product.href)}
                     className={`w-full flex items-center gap-3 p-3 text-sm rounded-xl transition-colors text-start ${
                       isActiveRoute(product.href) 
                         ? 'text-blue-600 bg-blue-50 font-medium' 
                         : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                     }`}
                  >
                    <product.icon className="w-4 h-4" />
                    <div>
                      <span className="block font-medium">{product.name}</span>
                      <span className="text-xs text-slate-400">{product.description}</span>
                    </div>
                   </button>
                ))}
              </MobileAccordion>
              
               <MobileNavLink 
                 to="/vision" 
                 icon={Star} 
                 onClick={() => handleMobileNavigate('/vision')}
                 isActive={isActiveRoute('/vision')}
               >
                رؤيتنا
              </MobileNavLink>
              
               <MobileNavLink 
                 to="/subsidiaries" 
                 icon={Building2} 
                 onClick={() => handleMobileNavigate('/subsidiaries')}
                 isActive={isActiveRoute('/subsidiaries')}
               >
                شركاتنا
              </MobileNavLink>
              
              {/* Others Accordion */}
              <MobileAccordion
                label="أخرى"
                icon={Award}
                isOpen={mobileOthersOpen}
                onToggle={() => setMobileOthersOpen(!mobileOthersOpen)}
                 isActive={othersItems.some(i => isActiveRoute(i.href))}
              >
                {othersItems.map((item, index) => (
                   <button
                    key={index}
                     onClick={() => handleMobileNavigate(item.href)}
                     className={`w-full flex items-center gap-3 p-3 text-sm rounded-xl transition-colors text-start ${
                       isActiveRoute(item.href) 
                         ? 'text-blue-600 bg-blue-50 font-medium' 
                         : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                     }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                   </button>
                ))}
              </MobileAccordion>
              
               <MobileNavLink 
                 to="/contact" 
                 icon={Phone} 
                 onClick={() => handleMobileNavigate('/contact')}
                 isActive={isActiveRoute('/contact')}
               >
                تواصل معنا
              </MobileNavLink>
            </div>

            {/* Mobile Footer CTA */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 safe-area-inset-bottom">
               <button 
                 onClick={() => handleMobileNavigate('/book-consultation')}
                 className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-md active:scale-[0.98] transition-transform"
              >
                <HeadphonesIcon className="w-5 h-5" />
                 <span>احجز استشارة مجانية</span>
               </button>
              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500">
                <span>متاح الآن للخدمة</span>
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
         @keyframes slide-in-rtl {
           from { 
             transform: translateX(100%);
             opacity: 0;
           }
          to { transform: translateX(0); }
        }
         .animate-slide-in-rtl {
           animation: slide-in-rtl 0.3s cubic-bezier(0.32, 0.72, 0, 1);
        }
        .safe-area-inset-bottom {
          padding-bottom: max(1rem, env(safe-area-inset-bottom));
        }
      `}</style>
    </>
  );
};

// ===== SUB-COMPONENTS =====

 // Desktop Nav Link
 const NavLinkItem = ({
   to,
   children,
   isActive = false,
 }: {
   to: string;
   children: React.ReactNode;
   isActive?: boolean;
 }) => (
   <Link
     to={to}
     className={`relative px-4 py-2 text-sm font-medium transition-colors ${
       isActive ? "text-blue-600" : "text-slate-700 hover:text-blue-600"
     }`}
   >
     {children}
   </Link>
 );

// Desktop Dropdown Menu
const DropdownMenu = ({ 
  label, 
  isOpen, 
  onOpen, 
  onClose, 
   children,
   isActive = false
}: { 
  label: string; 
  isOpen: boolean; 
  onOpen: () => void; 
  onClose: () => void; 
  children: React.ReactNode;
   isActive?: boolean;
}) => (
  <div 
    className="relative"
    onMouseEnter={onOpen}
    onMouseLeave={onClose}
  >
     <button className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all group ${
       isActive || isOpen
         ? 'text-blue-600 bg-blue-50' 
         : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50/70'
     }`}>
      {label}
       <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ms-1 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    {isOpen && (
      <div 
         className="absolute top-full start-0 mt-1 min-w-[280px] bg-white rounded-2xl shadow-xl border border-slate-200/60 z-50"
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
      >
        {children}
      </div>
    )}
  </div>
);

 // Desktop Dropdown Item using React Router
const DropdownItem = ({ 
   to, 
  icon: Icon, 
   children,
   isActive = false
}: { 
   to: string; 
  icon: React.ElementType; 
  children: React.ReactNode;
   isActive?: boolean;
}) => (
   <Link
     to={to}
     className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-colors group ${
       isActive ? 'bg-blue-100' : 'hover:bg-blue-50'
     }`}
  >
     <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
       isActive ? 'bg-blue-600' : 'bg-blue-100 group-hover:bg-blue-600'
     }`}>
       <Icon className={`w-4 h-4 transition-colors ${
         isActive ? 'text-white' : 'text-blue-600 group-hover:text-white'
       }`} />
    </div>
     <span className={`text-sm transition-colors ${
       isActive ? 'text-blue-600 font-medium' : 'text-slate-700 group-hover:text-blue-600'
     }`}>{children}</span>
   </Link>
);

 // Mobile Nav Link
const MobileNavLink = ({ 
   to, 
  icon: Icon, 
  onClick, 
   children,
   isActive = false
}: { 
   to: string; 
  icon: React.ElementType; 
  onClick: () => void; 
  children: React.ReactNode;
   isActive?: boolean;
}) => (
   <button
    onClick={onClick}
     className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-colors active:scale-[0.98] ${
       isActive 
         ? 'text-blue-600 bg-blue-50' 
         : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
     }`}
  >
     <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
       isActive ? 'bg-blue-100' : 'bg-slate-100'
     }`}>
      <Icon className="w-5 h-5" />
    </div>
     <span className={`font-medium ${isActive ? 'text-blue-600' : ''}`}>{children}</span>
     {isActive && <ChevronLeft className="w-4 h-4 ms-auto text-blue-600" />}
   </button>
);

// Mobile Accordion
const MobileAccordion = ({ 
  label, 
  icon: Icon, 
  isOpen, 
  onToggle, 
   children,
   isActive = false
}: { 
  label: string; 
  icon: React.ElementType; 
  isOpen: boolean; 
  onToggle: () => void; 
  children: React.ReactNode;
   isActive?: boolean;
}) => (
  <div>
    <button
      onClick={onToggle}
       className={`w-full flex items-center justify-between gap-3 p-3.5 rounded-xl transition-colors active:scale-[0.98] ${
         isActive || isOpen
           ? 'text-blue-600 bg-blue-50' 
           : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
       }`}
    >
      <div className="flex items-center gap-3">
         <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
           isActive || isOpen ? 'bg-blue-100' : 'bg-slate-100'
         }`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-medium">{label}</span>
      </div>
       <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${
         isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'
       }`} />
    </button>
    {isOpen && (
       <div className="mt-1 me-5 ps-2 space-y-0.5 border-e-2 border-blue-200">
        {children}
      </div>
    )}
  </div>
);

export default Navigation;
