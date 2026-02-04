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
  Sparkles,
  Search,
  User,
  LogIn,
  UserPlus,
  CreditCard,
  Briefcase,
  Target,
  Layers,
  Rocket,
  Eye
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
  const [activeTab, setActiveTab] = useState<'individuals' | 'business' | 'investors'>('individuals');
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

  // Primary nav items (like Riyad Bank's main categories)
  const primaryNavItems = [
    { name: "الأفراد", key: 'individuals' as const, active: true },
    { name: "الأعمال والشركات", key: 'business' as const },
    { name: "المستثمرين", key: 'investors' as const },
  ];

  // Secondary nav items (main services menu)
  const secondaryNavItems = [
    { name: "خدماتنا", href: "/services-catalog", hasDropdown: true, dropdownKey: 'services' },
    { name: "منتجاتنا", href: "/ready-projects", hasDropdown: true, dropdownKey: 'products' },
    { name: "أعمالنا", href: "/our-works" },
    { name: "رؤيتنا", href: "/vision" },
    { name: "شركاتنا", href: "/subsidiaries" },
    { name: "من نحن", href: "/about" },
    { name: "اكتشف المزيد", href: "/story", hasDropdown: true, dropdownKey: 'others' },
  ];

  return (
    <div dir="rtl">
      {/* ===== TOP UTILITY BAR ===== */}
      <div className="hidden lg:block fixed top-0 inset-x-0 z-50 h-11 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto h-full px-6">
          <div className="flex h-full items-center justify-between flex-row-reverse">
            {/* Left Side (appears on left in RTL) - Utility Links */}
            <div className="flex items-center gap-4 flex-row-reverse">
              {/* Sign Up Button */}
              <Link 
                to="/auth/register"
                className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-all flex-row-reverse"
              >
                <span>إنشاء حساب</span>
                <UserPlus className="w-4 h-4" />
              </Link>
              
              {/* Login Button */}
              <Link 
                to="/auth/login"
                className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:border-violet-400 hover:text-violet-600 transition-all flex-row-reverse"
              >
                <span>تسجيل الدخول</span>
                <LogIn className="w-4 h-4" />
              </Link>
              
              <div className="w-px h-4 bg-slate-300" />
              
              {/* Contact */}
              <a 
                href="/contact" 
                className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-violet-600 transition-colors flex-row-reverse"
              >
                <span className="font-medium">الدعم والتواصل</span>
                <HeadphonesIcon className="w-4 h-4" />
              </a>
              
              <div className="w-px h-4 bg-slate-300" />
              
              {/* Language Toggle */}
              <button className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-violet-600 transition-colors flex-row-reverse">
                <span className="font-medium">English</span>
                <Globe className="w-4 h-4" />
              </button>
            </div>
            
            {/* Right Side (appears on right in RTL) - Primary Tabs */}
            <div className="flex items-center gap-1 flex-row-reverse">
              {primaryNavItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`
                    relative px-4 py-2.5 text-sm font-medium transition-all duration-200
                    ${activeTab === item.key 
                      ? 'text-violet-700' 
                      : 'text-slate-600 hover:text-violet-600'
                    }
                  `}
                >
                  {item.name}
                  {activeTab === item.key && (
                    <span className="absolute bottom-0 inset-x-2 h-0.5 bg-violet-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN HEADER WITH LOGO ===== */}
      <header 
        className="fixed inset-x-0 z-40 top-0 lg:top-11"
      >
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="container mx-auto px-4 lg:px-6">
            {/* Main Nav Container */}
            <div className="flex items-center justify-between h-16 lg:h-20 flex-row-reverse">
              
              {/* ===== LOGO (Right in RTL) ===== */}
              <Link to="/" className="flex items-center gap-3 shrink-0 group">
                {/* Logo Icon */}
                <div className="relative">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <span className="text-white font-bold text-lg lg:text-xl">ASH</span>
                  </div>
                  <div className="absolute -top-1 -start-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                
                {/* Company Name */}
                <div className="hidden sm:block">
                  <h1 className="text-xl lg:text-2xl font-bold text-slate-900 group-hover:text-violet-700 transition-colors duration-300">
                    ASH HOLDING
                  </h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 font-medium">منذ 2016</span>
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-emerald-100 text-emerald-700 border-emerald-200 gap-1">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      موثق
                    </Badge>
                  </div>
                </div>
              </Link>

              {/* ===== SECONDARY NAV (Desktop) ===== */}
              <nav className="hidden lg:flex items-center gap-1">
                {secondaryNavItems.map((item, index) => {
                  if (item.hasDropdown && item.dropdownKey === 'services') {
                    return (
                      <DropdownMenu
                        key={index}
                        label={item.name}
                        isOpen={showServices}
                        onOpen={() => { clearTimeout(servicesHideRef.current); setShowServices(true); }}
                        onClose={() => { servicesHideRef.current = window.setTimeout(() => setShowServices(false), 150); }}
                      >
                        <div className="p-3 grid grid-cols-2 gap-1.5 max-h-[70vh] overflow-y-auto">
                          {services.map((service, idx) => (
                            <DropdownItem key={idx} href={service.href} icon={service.icon}>
                              {service.name}
                            </DropdownItem>
                          ))}
                        </div>
                      </DropdownMenu>
                    );
                  }
                  if (item.hasDropdown && item.dropdownKey === 'products') {
                    return (
                      <DropdownMenu
                        key={index}
                        label={item.name}
                        isOpen={showProducts}
                        onOpen={() => { clearTimeout(productsHideRef.current); setShowProducts(true); }}
                        onClose={() => { productsHideRef.current = window.setTimeout(() => setShowProducts(false), 150); }}
                      >
                        <div className="p-3 space-y-1.5">
                          {products.map((product, idx) => (
                            <a
                              key={idx}
                              href={product.href}
                              className="flex items-center gap-3 p-3 hover:bg-violet-50 rounded-xl transition-colors group"
                            >
                              <div className="w-10 h-10 bg-violet-100 group-hover:bg-violet-600 rounded-xl flex items-center justify-center transition-colors shrink-0">
                                <product.icon className="w-5 h-5 text-violet-600 group-hover:text-white transition-colors" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="block text-sm font-medium text-slate-700 group-hover:text-violet-600">{product.name}</span>
                                <span className="block text-xs text-slate-500 mt-0.5">{product.description}</span>
                              </div>
                              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-violet-600 opacity-0 group-hover:opacity-100 transition-all" />
                            </a>
                          ))}
                        </div>
                      </DropdownMenu>
                    );
                  }
                  if (item.hasDropdown && item.dropdownKey === 'others') {
                    return (
                      <DropdownMenu
                        key={index}
                        label={item.name}
                        isOpen={showOthers}
                        onOpen={() => { clearTimeout(othersHideRef.current); setShowOthers(true); }}
                        onClose={() => { othersHideRef.current = window.setTimeout(() => setShowOthers(false), 150); }}
                      >
                        <div className="p-3 space-y-1">
                          {othersItems.map((other, idx) => (
                            <DropdownItem key={idx} href={other.href} icon={other.icon}>
                              {other.name}
                            </DropdownItem>
                          ))}
                        </div>
                      </DropdownMenu>
                    );
                  }
                  return (
                    <NavLink key={index} href={item.href}>{item.name}</NavLink>
                  );
                })}
              </nav>

              {/* ===== SEARCH & MOBILE TOGGLE (Left in RTL) ===== */}
              <div className="flex items-center gap-3 shrink-0 flex-row-reverse">
                {/* Search Button (Desktop) */}
                <button className="hidden lg:flex items-center justify-center w-11 h-11 text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors">
                  <Search className="w-5 h-5" />
                </button>
                
                {/* Contact CTA (Desktop) */}
                <a 
                  href="/book-consultation"
                  className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg flex-row-reverse"
                >
                  <HeadphonesIcon className="w-4 h-4" />
                  <span>احجز استشارة</span>
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
          <div className="absolute top-0 end-0 h-full w-[85vw] max-w-sm bg-white shadow-2xl animate-slide-in-right overflow-hidden flex flex-col">
            {/* Mobile Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 bg-gradient-to-l from-slate-50 to-violet-50/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl flex items-center justify-center shadow">
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

            {/* Mobile Category Tabs */}
            <div className="flex items-center gap-1 px-4 py-3 border-b border-slate-100 shrink-0 overflow-x-auto">
              {primaryNavItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`
                    px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all
                    ${activeTab === item.key 
                      ? 'bg-violet-100 text-violet-700' 
                      : 'text-slate-600 hover:bg-slate-100'
                    }
                  `}
                >
                  {item.name}
                </button>
              ))}
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
                    className="flex items-center gap-3 p-3 text-sm text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
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
                    className="flex items-center gap-3 p-3 text-sm text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
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
              
              <MobileNavLink href="/vision" icon={Eye} onClick={() => setIsOpen(false)}>
                رؤيتنا
              </MobileNavLink>
              
              <MobileNavLink href="/subsidiaries" icon={Building2} onClick={() => setIsOpen(false)}>
                شركاتنا
              </MobileNavLink>
              
              <MobileNavLink href="/our-works" icon={Award} onClick={() => setIsOpen(false)}>
                أعمالنا
              </MobileNavLink>
              
              {/* Others Accordion */}
              <MobileAccordion
                label="المزيد"
                icon={Layers}
                isOpen={mobileOthersOpen}
                onToggle={() => setMobileOthersOpen(!mobileOthersOpen)}
              >
                {othersItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-center gap-3 p-3 text-sm text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
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

            {/* Mobile Auth Buttons */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2 shrink-0">
              <Link 
                to="/auth/login"
                className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-violet-700 bg-violet-100 rounded-xl hover:bg-violet-200 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول</span>
              </Link>
              <Link 
                to="/auth/register"
                className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <UserPlus className="w-4 h-4" />
                <span>إنشاء حساب جديد</span>
              </Link>
            </div>

            {/* Mobile Footer CTA */}
            <div className="p-4 border-t border-slate-200 bg-gradient-to-l from-violet-50 to-indigo-50 safe-area-inset-bottom shrink-0">
              <a 
                href="/book-consultation"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-l from-violet-600 to-indigo-600 text-white font-medium rounded-xl shadow-md active:scale-[0.98] transition-transform"
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
    </div>
  );
};

// ===== SUB-COMPONENTS =====

// Desktop Nav Link
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a 
    href={href}
    className="relative px-4 py-2 text-sm font-medium text-slate-700 hover:text-violet-600 rounded-lg hover:bg-violet-50/70 transition-all group"
  >
    {children}
    <span className="absolute bottom-0.5 start-1/2 -translate-x-1/2 w-0 h-0.5 bg-violet-600 rounded-full group-hover:w-2/3 transition-all" />
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
    <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 hover:text-violet-600 rounded-lg hover:bg-violet-50/70 transition-all group">
      {label}
      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    {isOpen && (
      <div 
        className="absolute top-full end-0 mt-2 min-w-[280px] bg-white rounded-2xl shadow-xl border border-slate-200/60 z-50"
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
    className="flex items-center gap-2.5 p-2.5 hover:bg-violet-50 rounded-xl transition-colors group"
  >
    <div className="w-8 h-8 bg-violet-100 group-hover:bg-violet-600 rounded-lg flex items-center justify-center transition-colors shrink-0">
      <Icon className="w-4 h-4 text-violet-600 group-hover:text-white transition-colors" />
    </div>
    <span className="text-sm text-slate-700 group-hover:text-violet-600 transition-colors">{children}</span>
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
    className="flex items-center gap-3 p-3.5 text-slate-700 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors active:scale-[0.98]"
  >
    <div className="w-10 h-10 bg-slate-100 hover:bg-violet-100 rounded-xl flex items-center justify-center shrink-0">
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
      className="w-full flex items-center justify-between gap-3 p-3.5 text-slate-700 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors active:scale-[0.98]"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-medium">{label}</span>
      </div>
      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-violet-600' : ''}`} />
    </button>
    {isOpen && (
      <div className="mt-1 ms-5 pe-2 space-y-0.5 border-s-2 border-violet-200">
        {children}
      </div>
    )}
  </div>
);

export default Navigation;
