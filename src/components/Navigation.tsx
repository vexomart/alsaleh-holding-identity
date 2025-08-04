import { useState, useEffect } from "react";
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
  Heart,
  TrendingUp
} from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showOthers, setShowOthers] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    { name: "العروض الحالية", href: "/current-offers", icon: Gift },
    { name: "خدماتنا الاحترافية", href: "/professional-services", icon: Settings },
    { name: "صناعة المحتوى", href: "/content-creation", icon: PenTool },
    { name: "حلول التصميم", href: "/design-solutions", icon: Palette },
    { name: "الاستثمار التقني", href: "/tech-investment", icon: Zap },
    { name: "التطوير والابتكار", href: "/development", icon: Building2 },
    { name: "الاستشارات الإستراتيجية", href: "/strategic-consulting", icon: Users },
    { name: "الحلول المتكاملة", href: "/integrated-solutions", icon: Award }
  ];

  const othersItems = [
    { name: "طرق الدفع", href: "/payment-methods", icon: Phone },
    { name: "رحلة الإبداع والتميز", href: "/story", icon: Heart },
    { name: "قيمنا وثقافتنا", href: "/about", icon: TrendingUp },
  ];

  return (
    <>
      {/* Top Bar - Enhanced */}
      <div className="hidden lg:block bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white py-3 border-b border-indigo-800/30">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 text-sm font-medium">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <span>ساعات العمل: الأحد - الخميس 8:00 ص - 6:00 م</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>المملكة العربية السعودية - الرياض</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 text-sm font-medium hover:text-blue-300 transition-colors group">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <a href="mailto:info@ash.holdings" className="hover:underline">
                  info@ash.holdings
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium hover:text-green-300 transition-colors group">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <a href="tel:+966555812567" className="hover:underline">
                  +966 555 812 567
                </a>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-full border-0">
                  متاح الآن للدعم
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation - Enhanced */}
      <nav className="fixed top-0 lg:top-[52px] w-full z-50 bg-gradient-to-r from-slate-900/98 via-indigo-900/98 to-slate-900/98 backdrop-blur-xl transition-all duration-500 border-b border-indigo-800/20 shadow-2xl">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo & Company Name - Enhanced */}
            <div className="flex items-center gap-6">
              <a href="/" className="flex items-center gap-4 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <img 
                    src="/lovable-uploads/1b40cb28-9cbb-4fdf-9a92-f739dad1a3a7.png" 
                    alt="ASH Holdings" 
                    className="relative h-12 lg:h-16 w-auto object-contain transition-all duration-500 group-hover:scale-110 filter group-hover:brightness-110"
                  />
                </div>
                <div className="hidden xl:block">
                  <div className="font-bold text-lg lg:text-xl text-white group-hover:text-blue-300 transition-colors duration-300">
                    شركة علي صالح الشهري القابضة
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                    <span className="text-sm text-blue-200 font-medium">
                      رائدة منذ 2016 • مستوى عالمي
                    </span>
                  </div>
                </div>
                <div className="block xl:hidden">
                  <div className="font-bold text-base text-white">ASH Holdings</div>
                  <div className="text-xs text-blue-200">شركة عالمية</div>
                </div>
              </a>
            </div>

            {/* Desktop Navigation - Enhanced */}
            <div className="hidden lg:flex items-center gap-10">
              <a 
                href="/" 
                className="relative font-semibold text-lg transition-all duration-300 hover:text-blue-300 text-white group py-2"
              >
                الرئيسية
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 group-hover:w-full transition-all duration-300 rounded-full"></div>
              </a>
              <a 
                href="/about" 
                className="relative font-semibold text-lg transition-all duration-300 hover:text-blue-300 text-white group py-2"
              >
                من نحن
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 group-hover:w-full transition-all duration-300 rounded-full"></div>
              </a>
              
              {/* Services Dropdown - Enhanced */}
              <div 
                className="relative group"
                onMouseEnter={() => setShowServices(true)}
                onMouseLeave={() => setShowServices(false)}
              >
                <button 
                  className="relative flex items-center gap-2 font-semibold text-lg transition-all duration-300 hover:text-blue-300 text-white py-2"
                >
                  خدماتنا
                  <ChevronDown className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 group-hover:w-full transition-all duration-300 rounded-full"></div>
                </button>
                
                {showServices && (
                  <div className="absolute top-full right-0 mt-4 w-96 bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/30 rounded-2xl shadow-2xl border border-blue-200/50 overflow-hidden z-50 backdrop-blur-sm animate-fade-in">
                    <div className="p-4">
                      <div className="grid grid-cols-1 gap-2">
                        {services.map((service, index) => {
                          const IconComponent = service.icon;
                          return (
                            <a
                              key={index}
                              href={service.href}
                              className="flex items-center gap-4 px-4 py-4 hover:bg-gradient-to-r hover:from-blue-100/80 hover:to-indigo-100/60 transition-all duration-300 rounded-xl group border border-transparent hover:border-blue-200/50"
                              onClick={(e) => {
                                if (service.href.startsWith('#')) {
                                  e.preventDefault();
                                  const element = document.getElementById(service.href.substring(1));
                                  element?.scrollIntoView({ behavior: 'smooth' });
                                }
                              }}
                            >
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                                <IconComponent className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <span className="text-slate-700 font-bold text-base group-hover:text-blue-700 transition-colors duration-300">{service.name}</span>
                                <div className="text-xs text-slate-500 mt-0.5">خدمة احترافية متميزة</div>
                              </div>
                              <ChevronDown className="w-4 h-4 text-slate-400 -rotate-90 group-hover:translate-x-1 transition-transform duration-300" />
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
                className="relative font-semibold text-lg transition-all duration-300 hover:text-blue-300 text-white group py-2"
              >
                رؤيتنا
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 group-hover:w-full transition-all duration-300 rounded-full"></div>
              </a>
              <a 
                href="/subsidiaries"
                className="relative font-semibold text-lg transition-all duration-300 hover:text-blue-300 text-white group py-2"
              >
                شركاتنا
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 group-hover:w-full transition-all duration-300 rounded-full"></div>
              </a>
              <a 
                href="/ready-projects" 
                className="relative font-semibold text-lg transition-all duration-300 hover:text-blue-300 text-white group py-2"
              >
                منتجاتنا
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 group-hover:w-full transition-all duration-300 rounded-full"></div>
              </a>
              <a 
                href="/contact"
                className="relative font-semibold text-lg transition-all duration-300 hover:text-blue-300 text-white group py-2"
              >
                تواصل معنا
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 group-hover:w-full transition-all duration-300 rounded-full"></div>
              </a>
              
              {/* Others Dropdown - Enhanced */}
              <div 
                className="relative group"
                onMouseEnter={() => setShowOthers(true)}
                onMouseLeave={() => setShowOthers(false)}
              >
                <button 
                  className="relative flex items-center gap-2 font-semibold text-lg transition-all duration-300 hover:text-blue-300 text-white py-2"
                >
                  أخرى
                  <ChevronDown className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 group-hover:w-full transition-all duration-300 rounded-full"></div>
                </button>
                
                {showOthers && (
                  <div className="absolute top-full right-0 mt-4 w-80 bg-gradient-to-br from-white via-purple-50/50 to-pink-50/30 rounded-2xl shadow-2xl border border-purple-200/50 overflow-hidden z-50 backdrop-blur-sm animate-fade-in">
                    <div className="p-4">
                      {othersItems.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                          <a
                            key={index}
                            href={item.href}
                            className="flex items-center gap-4 px-4 py-4 hover:bg-gradient-to-r hover:from-purple-100/80 hover:to-pink-100/60 transition-all duration-300 rounded-xl group border border-transparent hover:border-purple-200/50"
                          >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <span className="text-slate-700 font-bold text-base group-hover:text-purple-700 transition-colors duration-300">{item.name}</span>
                              <div className="text-xs text-slate-500 mt-0.5">معلومات مهمة</div>
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-400 -rotate-90 group-hover:translate-x-1 transition-transform duration-300" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons - Enhanced */}
            <div className="flex items-center gap-4">
              {/* Contact Buttons - Desktop Only */}
              <div className="hidden xl:flex items-center gap-3">
                <Button 
                  size="lg" 
                  variant="ghost"
                  className="flex items-center gap-3 text-white hover:text-green-300 bg-white/5 hover:bg-green-500/20 border border-white/20 hover:border-green-400/50 px-6 py-3 rounded-xl transition-all duration-300 group backdrop-blur-sm"
                  asChild
                >
                  <a href="https://wa.me/966555812567" target="_blank" rel="noopener noreferrer">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold">واتساب</span>
                  </a>
                </Button>
                <Button 
                  size="lg" 
                  variant="ghost"
                  className="flex items-center gap-3 text-white hover:text-blue-300 bg-white/5 hover:bg-blue-500/20 border border-white/20 hover:border-blue-400/50 px-6 py-3 rounded-xl transition-all duration-300 group backdrop-blur-sm"
                  asChild
                >
                  <a href="tel:+966555812567">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold">اتصال فوري</span>
                  </a>
                </Button>
              </div>
              
              <Button 
                size="lg"
                className="hidden lg:flex font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-8 py-3 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0"
                asChild
              >
                <a href="https://ash.holdings" target="_blank" rel="noopener noreferrer">
                  <span>ابدأ معنا الآن</span>
                  <Zap className="w-5 h-5 mr-2" />
                </a>
              </Button>
              
              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 rounded-lg transition-colors text-white hover:bg-white/10"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isOpen && (
            <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Contact Info */}
                <div className="px-3 py-3 border-b border-gray-100 mb-2">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MessageCircle className="w-4 h-4 text-green-500" />
                      <a href="https://wa.me/966555812567?text=مرحباً، أحتاج للدعم الفني" target="_blank" rel="noopener noreferrer" className="hover:text-green-600">
                        دعم واتساب فوري
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <a href="tel:+966555812567" className="hover:text-blue-600">اتصال مباشر: 0555812567</a>
                  </div>
                </div>

                {/* Navigation Links */}
                <a 
                  href="/" 
                  className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  الرئيسية
                </a>
                <a 
                  href="/about" 
                  className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  من نحن
                </a>
                
                {/* Services in Mobile */}
                <div className="px-3 py-2">
                  <div className="text-gray-700 font-medium mb-2">خدماتنا</div>
                  <div className="space-y-1 mr-4">
                    {services.map((service, index) => {
                      const IconComponent = service.icon;
                      return (
                        <a
                          key={index}
                          href={service.href}
                          className="flex items-center gap-3 px-2 py-2 text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors duration-200 rounded-md"
                          onClick={(e) => {
                            setIsOpen(false);
                            if (service.href.startsWith('#')) {
                              e.preventDefault();
                              setTimeout(() => {
                                const element = document.getElementById(service.href.substring(1));
                                element?.scrollIntoView({ behavior: 'smooth' });
                              }, 100);
                            }
                          }}
                        >
                          <IconComponent className="w-4 h-4" />
                          <span className="text-sm">{service.name}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
                
                <a 
                  href="/vision" 
                  className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  رؤيتنا
                </a>
                <a 
                  href="/subsidiaries" 
                  className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  شركاتنا
                </a>
                <a 
                  href="/ready-projects" 
                  className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  منتجاتنا
                </a>
                <a 
                  href="/contact"
                  className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  تواصل معنا
                </a>
                
                {/* Others in Mobile */}
                <div className="px-3 py-2">
                  <div className="text-gray-700 font-medium mb-2">أخرى</div>
                  <div className="space-y-1 mr-4">
                    {othersItems.map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <a
                          key={index}
                          href={item.href}
                          className="flex items-center gap-3 px-2 py-2 text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors duration-200 rounded-md"
                          onClick={() => setIsOpen(false)}
                        >
                          <IconComponent className="w-4 h-4" />
                          <span className="text-sm">{item.name}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
                
                <div className="px-3 py-2">
                  <Button 
                    variant="default"
                    size="sm"
                    className="w-full font-semibold"
                    asChild
                  >
                    <a href="https://ash.holdings" target="_blank" rel="noopener noreferrer">
                      ابدأ معنا
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navigation;