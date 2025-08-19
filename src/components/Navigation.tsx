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
      {/* Premium Corporate Top Bar */}
      <div className="hidden lg:block bg-gradient-to-r from-primary/95 via-primary/90 to-primary/95 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-8 text-sm text-white/90">
              <div className="flex items-center gap-2 group hover:text-white transition-all duration-300 hover:scale-105">
                <div className="p-1.5 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all duration-300">
                  <Clock className="w-4 h-4 text-accent" />
                </div>
                <span className="font-medium">الأحد - الخميس • 8:00 ص - 6:00 م</span>
              </div>
              <div className="flex items-center gap-2 group hover:text-white transition-all duration-300 hover:scale-105">
                <div className="p-1.5 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all duration-300">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>
                <span className="font-medium">جدة، المملكة العربية السعودية</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="mailto:info@alialshehriholding.com" className="flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 group hover:scale-105">
                <div className="p-1.5 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all duration-300">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="font-medium hidden xl:inline">info@alialshehriholding.com</span>
              </a>
              <a href="tel:0555812567" className="flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 group hover:scale-105">
                <div className="p-1.5 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all duration-300">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="font-medium">0555812567</span>
              </a>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent/20 to-accent/10 rounded-full border border-accent/30 backdrop-blur-sm">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-lg shadow-accent/50"></div>
                <span className="text-accent font-bold text-sm">متاح الآن</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Elite Main Navigation */}
      <nav className={`fixed ${isScrolled ? 'top-0 shadow-2xl shadow-primary/20' : 'top-0 lg:top-[56px]'} w-full z-50 transition-all duration-500`}>
        <div className="bg-white/95 backdrop-blur-2xl border-b border-border/50">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex items-center justify-between h-16 lg:h-20">
              
              {/* Premium Logo & Company Brand */}
              <div className="flex items-center gap-3 lg:gap-4">
                <a href="/" className="flex items-center gap-3 group relative">
                  {/* Enhanced Logo */}
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:shadow-primary/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <img 
                        src="/lovable-uploads/58f1dde7-91b4-4747-92a6-188055f11cee.png" 
                        alt="ASH Holdings" 
                        className="h-6 w-auto sm:h-7 lg:h-8 object-contain filter brightness-0 invert group-hover:scale-110 transition-all duration-300"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent group-hover:from-white/30 transition-all duration-300"></div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-accent to-accent/80 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-primary to-primary/60 rounded-full border-2 border-white"></div>
                  </div>
                  
                  {/* Elite Company Name */}
                  <div className="hidden sm:block">
                    <h1 className="text-xl lg:text-2xl font-black bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:via-primary/80 group-hover:to-primary/60 transition-all duration-500">
                      <span className="hidden lg:inline">شركة علي صالح الشهري القابضة</span>
                      <span className="lg:hidden">علي الشهري القابضة</span>
                    </h1>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-amber-400 fill-current group-hover:text-amber-500 transition-all duration-300 hover:scale-125" />
                        ))}
                      </div>
                      <div className="h-4 w-px bg-border/50"></div>
                      <span className="text-sm text-muted-foreground font-semibold">
                        <span className="hidden lg:inline">شركة رائدة منذ 2016 • مستوى عالمي</span>
                        <span className="lg:hidden">منذ 2016</span>
                      </span>
                      <Badge variant="secondary" className="hidden xl:flex text-xs px-3 py-1 bg-gradient-to-r from-accent/10 to-accent/5 text-accent border-accent/20 hover:bg-accent/20 transition-all duration-300">
                        <Shield className="w-3 h-3 mr-1" />
                        معتمد
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Mobile Company Name */}
                  <div className="block sm:hidden">
                    <h1 className="text-lg font-black text-foreground group-hover:text-primary transition-colors duration-300">
                      علي الشهري
                    </h1>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 text-amber-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">2016</span>
                    </div>
                  </div>
                </a>
              </div>

              {/* Elite Navigation Menu */}
              <div className="hidden lg:flex items-center gap-2 xl:gap-3">
                <a 
                  href="/" 
                  className="relative px-5 py-3 text-sm font-semibold text-foreground hover:text-primary transition-all duration-300 group rounded-xl hover:bg-primary/5 overflow-hidden"
                >
                  <span className="relative z-10">الرئيسية</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-primary to-accent group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
                </a>
                <a 
                  href="/about" 
                  className="relative px-5 py-3 text-sm font-semibold text-foreground hover:text-primary transition-all duration-300 group rounded-xl hover:bg-primary/5 overflow-hidden"
                >
                  <span className="relative z-10">من نحن</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-primary to-accent group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
                </a>
              
                {/* Premium Services Mega Menu */}
                <div 
                  className="relative group"
                  onMouseEnter={() => { if (servicesHideRef.current) clearTimeout(servicesHideRef.current); setShowServices(true); }}
                  onMouseLeave={() => { servicesHideRef.current = window.setTimeout(() => setShowServices(false), 200); }}
                >
                  <button 
                    className="relative flex items-center gap-2 px-5 py-3 text-sm font-semibold text-foreground hover:text-primary transition-all duration-300 rounded-xl hover:bg-primary/5 group overflow-hidden"
                  >
                    <span className="relative z-10">خدماتنا</span>
                    <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-all duration-500 relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-primary to-accent group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
                  </button>
                  
                  {showServices && (
                    <div className="absolute top-full left-0 mt-4 w-[420px] bg-white/98 backdrop-blur-2xl rounded-3xl shadow-2xl border border-border/50 z-[60] max-h-[80vh] overflow-y-auto animate-fade-in"
                      style={{
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                      }}
                      onMouseEnter={() => { if (servicesHideRef.current) clearTimeout(servicesHideRef.current); setShowServices(true); }}
                      onMouseLeave={() => { servicesHideRef.current = window.setTimeout(() => setShowServices(false), 200); }}
                    >
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-3">
                          {services.map((service, index) => {
                            const IconComponent = service.icon;
                            return (
                              <a
                                key={index}
                                href={service.href}
                                className="flex items-start gap-3 p-4 hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent/5 transition-all duration-300 rounded-2xl group border border-transparent hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10"
                              >
                                <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center group-hover:from-primary group-hover:to-accent transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                  <IconComponent className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="text-sm font-semibold text-foreground group-hover:text-primary leading-tight block">{service.name}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:translate-x-1 opacity-0 group-hover:opacity-100" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Premium Others Menu */}
                <div 
                  className="relative group"
                  onMouseEnter={() => { if (othersHideRef.current) clearTimeout(othersHideRef.current); setShowOthers(true); }}
                  onMouseLeave={() => { othersHideRef.current = window.setTimeout(() => setShowOthers(false), 200); }}
                >
                  <button 
                    className="relative flex items-center gap-2 px-5 py-3 text-sm font-semibold text-foreground hover:text-primary transition-all duration-300 rounded-xl hover:bg-primary/5 group overflow-hidden"
                  >
                    <span className="relative z-10">أخرى</span>
                    <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-all duration-500 relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-primary to-accent group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
                  </button>
                  
                  {showOthers && (
                    <div className="absolute top-full left-0 mt-4 w-80 bg-white/98 backdrop-blur-2xl rounded-3xl shadow-2xl border border-border/50 z-[60] max-h-[80vh] overflow-y-auto animate-fade-in"
                      style={{
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                      }}
                      onMouseEnter={() => { if (othersHideRef.current) clearTimeout(othersHideRef.current); setShowOthers(true); }}
                      onMouseLeave={() => { othersHideRef.current = window.setTimeout(() => setShowOthers(false), 200); }}
                    >
                      <div className="p-6">
                        <div className="space-y-2">
                          {othersItems.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                              <a
                                key={index}
                                href={item.href}
                                className="flex items-center gap-4 p-4 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 transition-all duration-300 rounded-2xl group border border-transparent hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10"
                              >
                                <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center group-hover:from-primary group-hover:to-accent transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                  <IconComponent className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{item.name}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:translate-x-1 opacity-0 group-hover:opacity-100" />
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
                  className="relative px-5 py-3 text-sm font-semibold text-foreground hover:text-primary transition-all duration-300 group rounded-xl hover:bg-primary/5 overflow-hidden"
                >
                  <span className="relative z-10">رؤيتنا</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-primary to-accent group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
                </a>
                <a 
                  href="/subsidiaries"
                  className="relative px-5 py-3 text-sm font-semibold text-foreground hover:text-primary transition-all duration-300 group rounded-xl hover:bg-primary/5 overflow-hidden"
                >
                  <span className="relative z-10">شركاتنا</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-primary to-accent group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
                </a>
              
                {/* Premium Products Menu */}
                <div 
                  className="relative group"
                  onMouseEnter={() => { if (productsHideRef.current) clearTimeout(productsHideRef.current); setShowProducts(true); }}
                  onMouseLeave={() => { productsHideRef.current = window.setTimeout(() => setShowProducts(false), 200); }}
                >
                  <button 
                    className="relative flex items-center gap-2 px-5 py-3 text-sm font-semibold text-foreground hover:text-primary transition-all duration-300 rounded-xl hover:bg-primary/5 group overflow-hidden"
                  >
                    <span className="relative z-10">منتجاتنا</span>
                    <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-all duration-500 relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-primary to-accent group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
                  </button>
                  
                  {showProducts && (
                    <div className="absolute top-full left-0 mt-4 w-80 bg-white/98 backdrop-blur-2xl rounded-3xl shadow-2xl border border-border/50 z-[60] animate-fade-in"
                      style={{
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                      }}
                      onMouseEnter={() => { if (productsHideRef.current) clearTimeout(productsHideRef.current); setShowProducts(true); }}
                      onMouseLeave={() => { productsHideRef.current = window.setTimeout(() => setShowProducts(false), 200); }}
                    >
                      <div className="p-6 space-y-3">
                        <a
                          href="/ready-projects"
                          className="flex items-center gap-4 p-4 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 rounded-2xl transition-all duration-300 group border border-transparent hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10"
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center group-hover:from-primary group-hover:to-accent transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                            <Package className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-foreground group-hover:text-primary transition-colors duration-300">المشاريع الجاهزة</div>
                            <div className="text-sm text-muted-foreground mt-1">حلول جاهزة للتطبيق فوراً</div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:translate-x-1 opacity-0 group-hover:opacity-100" />
                        </a>
                        <Link
                          to="/software-products"
                          className="flex items-center gap-4 p-4 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 rounded-2xl transition-all duration-300 group border border-transparent hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10"
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center group-hover:from-primary group-hover:to-accent transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                            <Code className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-foreground group-hover:text-primary transition-colors duration-300">منتجاتنا البرمجية</div>
                            <div className="text-sm text-muted-foreground mt-1">برمجيات وتطبيقات متخصصة</div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:translate-x-1 opacity-0 group-hover:opacity-100" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            {/* Premium Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Elite Contact Buttons */}
              <div className="hidden lg:flex items-center gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="h-10 px-4 text-sm font-medium flex items-center gap-2 border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/50 transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <a href="https://wa.me/966555812567" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden xl:block">واتساب</span>
                  </a>
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="h-10 px-4 text-sm font-medium flex items-center gap-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <a href="tel:0555812567">
                    <Phone className="w-4 h-4" />
                    <span className="hidden xl:block">اتصال</span>
                  </a>
                </Button>
              </div>
              
              {/* Elite Main CTA */}
              <Button 
                size="sm"
                className="h-10 px-4 sm:px-6 text-sm font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 text-white shadow-xl hover:shadow-2xl hover:shadow-primary/25 transition-all duration-500 hover:scale-105 relative overflow-hidden group"
                asChild
              >
                <a href="/start-with-us">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <span className="relative z-10 hidden sm:block">ابدأ رحلتك معنا</span>
                  <span className="relative z-10 sm:hidden">ابدأ</span>
                  <Play className="w-4 h-4 mr-2 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                </a>
              </Button>
              
              {/* Premium Mobile Menu Button */}
              <button
                className="lg:hidden p-2.5 rounded-xl hover:bg-primary/10 transition-all duration-300 hover:scale-105 group"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? 
                  <X size={20} className="text-primary group-hover:rotate-90 transition-transform duration-300" /> : 
                  <Menu size={20} className="text-primary group-hover:scale-110 transition-transform duration-300" />
                }
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