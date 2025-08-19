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
  ArrowUpRight,
  ChevronRight,
  Play,
  Shield
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
      {/* Top Bar */}
      <div className="hidden lg:block bg-primary text-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>الأحد - الخميس • 8:00 ص - 6:00 م</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>جدة، المملكة العربية السعودية</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="mailto:info@alialshehriholding.com" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Mail className="w-4 h-4" />
                <span>info@alialshehriholding.com</span>
              </a>
              <a href="tel:0555812567" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Phone className="w-4 h-4" />
                <span>0555812567</span>
              </a>
              <div className="flex items-center gap-2 bg-accent/20 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span className="text-accent font-semibold">متاح الآن</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <nav className={`${isScrolled ? 'fixed top-0' : 'sticky top-0 lg:top-[40px]'} w-full z-50 transition-all duration-300`}>
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-20">
              
              {/* Logo */}
              <div className="flex items-center">
                <a href="/" className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
                    <img 
                      src="/lovable-uploads/58f1dde7-91b4-4747-92a6-188055f11cee.png" 
                      alt="ASH Holdings" 
                      className="h-7 w-auto object-contain filter brightness-0 invert"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-foreground">شركة علي صالح الشهري القابضة</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-amber-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">شركة رائدة منذ 2016</span>
                      <Badge className="bg-accent/10 text-accent">معتمد</Badge>
                    </div>
                  </div>
                </a>
              </div>

              {/* Navigation */}
              <div className="hidden lg:flex items-center gap-8">
                <a href="/" className="text-foreground hover:text-primary font-semibold transition-colors border-b-2 border-transparent hover:border-primary py-2">
                  الرئيسية
                </a>
                <a href="/about" className="text-foreground hover:text-primary font-semibold transition-colors border-b-2 border-transparent hover:border-primary py-2">
                  من نحن
                </a>

                {/* Services Dropdown */}
                <div 
                  className="relative"
                  onMouseEnter={() => setShowServices(true)}
                  onMouseLeave={() => setShowServices(false)}
                >
                  <button className="flex items-center gap-1 text-foreground hover:text-primary font-semibold transition-colors border-b-2 border-transparent hover:border-primary py-2">
                    الخدمات
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {showServices && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[900px] bg-white shadow-2xl border rounded-2xl z-50">
                      <div className="p-8">
                        <div className="grid grid-cols-4 gap-6">
                          {services.map((service, index) => {
                            const IconComponent = service.icon;
                            return (
                              <a
                                key={index}
                                href={service.href}
                                className="flex flex-col items-center gap-3 p-4 hover:bg-primary/5 rounded-xl transition-all text-center group"
                              >
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                  <IconComponent className="w-6 h-6" />
                                </div>
                                <span className="text-sm font-semibold text-foreground group-hover:text-primary">{service.name}</span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <a href="/subsidiaries" className="text-foreground hover:text-primary font-semibold transition-colors border-b-2 border-transparent hover:border-primary py-2">
                  شركاتنا
                </a>
                <a href="/vision" className="text-foreground hover:text-primary font-semibold transition-colors border-b-2 border-transparent hover:border-primary py-2">
                  رؤيتنا
                </a>
                <a href="/contact" className="text-foreground hover:text-primary font-semibold transition-colors border-b-2 border-transparent hover:border-primary py-2">
                  اتصل بنا
                </a>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="hidden lg:flex">En</Button>
                <Button variant="outline" size="sm" className="hidden lg:flex" asChild>
                  <a href="https://wa.me/966555812567">واتساب</a>
                </Button>
                <Button asChild>
                  <a href="/start-with-us">ابدأ معنا</a>
                </Button>
                
                <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="container mx-auto px-6 py-4 space-y-4">
              <a href="/" className="block py-2 text-foreground hover:text-primary font-medium">الرئيسية</a>
              <a href="/about" className="block py-2 text-foreground hover:text-primary font-medium">من نحن</a>
              
              <div>
                <button 
                  className="flex items-center justify-between w-full py-2 text-foreground font-medium"
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                >
                  خدماتنا
                  <ChevronDown className={`w-5 h-5 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileServicesOpen && (
                  <div className="pl-4 mt-2 space-y-2">
                    {services.map((service, index) => (
                      <a key={index} href={service.href} className="block py-2 text-sm text-muted-foreground hover:text-primary">
                        {service.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <a href="/subsidiaries" className="block py-2 text-foreground hover:text-primary font-medium">شركاتنا</a>
              <a href="/vision" className="block py-2 text-foreground hover:text-primary font-medium">رؤيتنا</a>
              <a href="/contact" className="block py-2 text-foreground hover:text-primary font-medium">اتصل بنا</a>
              
              <Button className="w-full mt-4" asChild>
                <a href="/start-with-us">ابدأ معنا</a>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;