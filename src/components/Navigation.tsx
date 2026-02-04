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
  ChevronDown,
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
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

  // Top bar height for positioning
  const topBarHeight = 40;

  return (
    <>
      {/* ===== TOP BAR (Desktop Only) ===== */}
      <div className="hidden lg:block fixed top-0 inset-x-0 z-50 h-10 bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50">
        <div className="container mx-auto h-full px-6">
          <div className="flex h-full items-center justify-between">
            {/* Right Side (RTL: appears first) - Time & Location */}
            <div className="flex items-center gap-6 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 hover:text-blue-300 transition-colors">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-medium">الأحد - الخميس • 8:00 ص - 6:00 م</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-medium">جدة، المملكة العربية السعودية</span>
              </div>
            </div>
            
            {/* Left Side (RTL: appears last) - Contact & Status */}
            <div className="flex items-center gap-4">
              <a href="mailto:info@ash-holding.sa" className="flex items-center gap-1.5 text-slate-300 hover:text-blue-300 transition-colors">
                <Mail className="w-3.5 h-3.5" />
                <span className="font-medium text-xs">info@ash-holding.sa</span>
              </a>
              <a href="tel:0555812567" className="flex items-center gap-1.5 text-slate-300 hover:text-blue-300 transition-colors">
                <Phone className="w-3.5 h-3.5" />
                <span className="font-medium text-xs ltr" dir="ltr">0555812567</span>
              </a>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/20 rounded-full border border-emerald-400/30">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-300 font-semibold text-xs">متاح الآن</span>
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
            {/* Main Nav Container - Fixed Heights */}
            <div className="flex items-center justify-between h-14 lg:h-16">
              
              {/* ===== LOGO (Right in RTL) ===== */}
              <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
                {/* Logo Icon */}
                <div className="relative">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                    <span className="text-white font-bold text-sm sm:text-base">ASH</span>
                  </div>
                  <div className="absolute -top-0.5 -start-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
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
                      <ShieldCheck className="w-2.5 h-2.5" />
                      موثق
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
                <NavLink href="/">الرئيسية</NavLink>
                <NavLink href="/about">من نحن</NavLink>
                
                {/* Services Dropdown */}
                <DropdownMenu
                  label="خدماتنا"
                  isOpen={showServices}
                  onOpen={() => { clearTimeout(servicesHideRef.current); setShowServices(true); }}
                  onClose={() => { servicesHideRef.current = window.setTimeout(() => setShowServices(false), 150); }}
                >
                  <div className="p-3 grid grid-cols-2 gap-1.5 max-h-[70vh] overflow-y-auto">
                    {services.map((service, index) => (
                      <DropdownItem key={index} href={service.href} icon={service.icon}>
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
                >
                  <div className="p-3 space-y-1.5">
                    {products.map((product, index) => (
                      <a
                        key={index}
                        href={product.href}
                        className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-colors group"
                      >
                        <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-600 rounded-xl flex items-center justify-center transition-colors shrink-0">
                          <product.icon className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block text-sm font-medium text-slate-700 group-hover:text-blue-600">{product.name}</span>
                          <span className="block text-xs text-slate-500 mt-0.5">{product.description}</span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all" />
                      </a>
                    ))}
                  </div>
                </DropdownMenu>
                
                <NavLink href="/vision">رؤيتنا</NavLink>
                <NavLink href="/subsidiaries">شركاتنا</NavLink>
                
                {/* Others Dropdown */}
                <DropdownMenu
                  label="أخرى"
                  isOpen={showOthers}
                  onOpen={() => { clearTimeout(othersHideRef.current); setShowOthers(true); }}
                  onClose={() => { othersHideRef.current = window.setTimeout(() => setShowOthers(false), 150); }}
                >
                  <div className="p-3 space-y-1">
                    {othersItems.map((item, index) => (
                      <DropdownItem key={index} href={item.href} icon={item.icon}>
                        {item.name}
                      </DropdownItem>
                    ))}
                  </div>
                </DropdownMenu>
                
                <NavLink href="/contact">تواصل معنا</NavLink>
              </nav>

              {/* ===== CTA & MOBILE BUTTON (Left in RTL) ===== */}
              <div className="flex items-center gap-2 lg:gap-3 shrink-0">
                {/* Desktop CTA */}
                <a 
                  href="/book-consultation"
                  className="hidden lg:inline-flex items-center gap-2 px-4 xl:px-5 py-2.5 bg-gradient-to-l from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
                >
                  <span>احجز استشارة مجانية</span>
                  <HeadphonesIcon className="w-4 h-4" />
                </a>

                {/* Mobile Menu Toggle */}
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
          
          {/* Panel */}
          <div className="absolute top-0 end-0 h-full w-[85vw] max-w-sm bg-white shadow-2xl animate-slide-in-right">
            {/* Mobile Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 bg-gradient-to-l from-slate-50 to-blue-50/50">
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
              <button
                onClick={() => setIsOpen(false)}
                className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
                aria-label="إغلاق القائمة"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Mobile Nav Items */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-1">
              <MobileNavLink href="/" icon={Code} onClick={() => setIsOpen(false)}>
                الرئيسية
              </MobileNavLink>
              
              <MobileNavLink href="/about" icon={Users} onClick={() => setIsOpen(false)}>
                من نحن
              </MobileNavLink>
              
              {/* Services Accordion */}
              <MobileAccordion
                label="خدماتنا"
                icon={Settings}
                isOpen={mobileServicesOpen}
                onToggle={() => setMobileServicesOpen(!mobileServicesOpen)}
              >
                {services.map((service, index) => (
                  <a
                    key={index}
                    href={service.href}
                    className="flex items-center gap-3 p-3 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <service.icon className="w-4 h-4" />
                    <span>{service.name}</span>
                  </a>
                ))}
              </MobileAccordion>
              
              {/* Products Accordion */}
              <MobileAccordion
                label="منتجاتنا"
                icon={Package}
                isOpen={mobileProductsOpen}
                onToggle={() => setMobileProductsOpen(!mobileProductsOpen)}
              >
                {products.map((product, index) => (
                  <a
                    key={index}
                    href={product.href}
                    className="flex items-center gap-3 p-3 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <product.icon className="w-4 h-4" />
                    <div>
                      <span className="block font-medium">{product.name}</span>
                      <span className="text-xs text-slate-400">{product.description}</span>
                    </div>
                  </a>
                ))}
              </MobileAccordion>
              
              <MobileNavLink href="/vision" icon={Star} onClick={() => setIsOpen(false)}>
                رؤيتنا
              </MobileNavLink>
              
              <MobileNavLink href="/subsidiaries" icon={Building2} onClick={() => setIsOpen(false)}>
                شركاتنا
              </MobileNavLink>
              
              {/* Others Accordion */}
              <MobileAccordion
                label="أخرى"
                icon={Award}
                isOpen={mobileOthersOpen}
                onToggle={() => setMobileOthersOpen(!mobileOthersOpen)}
              >
                {othersItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-center gap-3 p-3 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </a>
                ))}
              </MobileAccordion>
              
              <MobileNavLink href="/contact" icon={Phone} onClick={() => setIsOpen(false)}>
                تواصل معنا
              </MobileNavLink>
            </div>

            {/* Mobile Footer CTA */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 safe-area-inset-bottom">
              <a 
                href="/book-consultation"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-l from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-md active:scale-[0.98] transition-transform"
                onClick={() => setIsOpen(false)}
              >
                <span>احجز استشارة مجانية</span>
                <HeadphonesIcon className="w-5 h-5" />
              </a>
              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>متاح الآن للخدمة</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
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
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a 
    href={href}
    className="relative px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 rounded-lg hover:bg-blue-50/70 transition-all group"
  >
    {children}
    <span className="absolute bottom-1 start-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 rounded-full group-hover:w-2/3 transition-all" />
  </a>
);

// Desktop Dropdown Menu
const DropdownMenu = ({ 
  label, 
  isOpen, 
  onOpen, 
  onClose, 
  children 
}: { 
  label: string; 
  isOpen: boolean; 
  onOpen: () => void; 
  onClose: () => void; 
  children: React.ReactNode;
}) => (
  <div 
    className="relative"
    onMouseEnter={onOpen}
    onMouseLeave={onClose}
  >
    <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 rounded-lg hover:bg-blue-50/70 transition-all group">
      {label}
      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    {isOpen && (
      <div 
        className="absolute top-full end-0 mt-1 min-w-[280px] bg-white rounded-2xl shadow-xl border border-slate-200/60 z-50"
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
      >
        {children}
      </div>
    )}
  </div>
);

// Desktop Dropdown Item
const DropdownItem = ({ 
  href, 
  icon: Icon, 
  children 
}: { 
  href: string; 
  icon: React.ElementType; 
  children: React.ReactNode;
}) => (
  <a
    href={href}
    className="flex items-center gap-2.5 p-2.5 hover:bg-blue-50 rounded-xl transition-colors group"
  >
    <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors shrink-0">
      <Icon className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
    </div>
    <span className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors">{children}</span>
  </a>
);

// Mobile Nav Link
const MobileNavLink = ({ 
  href, 
  icon: Icon, 
  onClick, 
  children 
}: { 
  href: string; 
  icon: React.ElementType; 
  onClick: () => void; 
  children: React.ReactNode;
}) => (
  <a
    href={href}
    onClick={onClick}
    className="flex items-center gap-3 p-3.5 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors active:scale-[0.98]"
  >
    <div className="w-10 h-10 bg-slate-100 hover:bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
      <Icon className="w-5 h-5" />
    </div>
    <span className="font-medium">{children}</span>
  </a>
);

// Mobile Accordion
const MobileAccordion = ({ 
  label, 
  icon: Icon, 
  isOpen, 
  onToggle, 
  children 
}: { 
  label: string; 
  icon: React.ElementType; 
  isOpen: boolean; 
  onToggle: () => void; 
  children: React.ReactNode;
}) => (
  <div>
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-3 p-3.5 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors active:scale-[0.98]"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-medium">{label}</span>
      </div>
      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
    </button>
    {isOpen && (
      <div className="mt-1 ms-5 pe-2 space-y-0.5 border-s-2 border-slate-200">
        {children}
      </div>
    )}
  </div>
);

export default Navigation;
