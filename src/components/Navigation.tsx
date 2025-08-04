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
      {/* Top Info Bar - Modern Corporate */}
      <div className="hidden lg:block bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-2 border-b border-slate-700/50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <Clock className="w-3 h-3" />
                </div>
                <span className="font-medium">الأحد - الخميس | 8:00 ص - 6:00 م</span>
              </div>
              <div className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity">
                <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <MapPin className="w-3 h-3" />
                </div>
                <span className="font-medium">الرياض، المملكة العربية السعودية</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 hover:text-blue-300 transition-colors cursor-pointer">
                <Mail className="w-4 h-4 text-blue-400" />
                <a href="mailto:info@ash.holdings" className="font-medium">info@ash.holdings</a>
              </div>
              <div className="flex items-center gap-2 hover:text-green-300 transition-colors cursor-pointer">
                <Phone className="w-4 h-4 text-green-400" />
                <a href="tel:+966555812567" className="font-medium">+966 555 812 567</a>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-semibold text-xs">متاح الآن</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation - Ultra Modern */}
      <nav className="fixed top-0 lg:top-[40px] w-full z-50 bg-white/95 backdrop-blur-xl transition-all duration-500 border-b border-gray-200/50 shadow-lg">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo & Brand - Redesigned */}
            <div className="flex items-center gap-4">
              <a href="/" className="flex items-center gap-4 group">
                <div className="relative">
                  {/* Logo with modern frame */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl blur-sm opacity-20 group-hover:opacity-40 transition-all duration-300"></div>
                  <div className="relative bg-white p-2 rounded-2xl shadow-lg border border-gray-200/50 group-hover:scale-105 transition-all duration-300">
                    <img 
                      src="/lovable-uploads/1b40cb28-9cbb-4fdf-9a92-f739dad1a3a7.png" 
                      alt="ASH Holdings" 
                      className="h-10 lg:h-12 w-auto object-contain"
                    />
                  </div>
                </div>
                
                {/* Brand Text */}
                <div className="hidden xl:block">
                  <div className="font-bold text-xl lg:text-2xl text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                    شركة علي صالح الشهري القابضة
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      رائدة منذ 2016 • مستوى عالمي
                    </span>
                  </div>
                </div>
                
                {/* Mobile Brand */}
                <div className="block xl:hidden">
                  <div className="font-bold text-lg text-gray-900">ASH Holdings</div>
                  <div className="text-xs text-blue-600 font-semibold">شركة عالمية رائدة</div>
                </div>
              </a>
            </div>

            {/* Navigation Links - Modern Design */}
            <div className="hidden lg:flex items-center gap-8">
              <a 
                href="/" 
                className="relative px-4 py-2 font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 group"
              >
                الرئيسية
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:w-full transition-all duration-300 rounded-full"></div>
              </a>
              <a 
                href="/about" 
                className="relative px-4 py-2 font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 group"
              >
                من نحن
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:w-full transition-all duration-300 rounded-full"></div>
              </a>
              
              {/* Services Dropdown - Modern */}
              <div 
                className="relative group"
                onMouseEnter={() => setShowServices(true)}
                onMouseLeave={() => setShowServices(false)}
              >
                <button 
                  className="relative flex items-center gap-2 px-4 py-2 font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300"
                >
                  خدماتنا
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:w-full transition-all duration-300 rounded-full"></div>
                </button>
                
                {showServices && (
                  <div className="absolute top-full right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-50 animate-fade-in">
                    <div className="p-3">
                      {services.map((service, index) => {
                        const IconComponent = service.icon;
                        return (
                          <a
                            key={index}
                            href={service.href}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/80 transition-all duration-300 rounded-xl group"
                            onClick={(e) => {
                              if (service.href.startsWith('#')) {
                                e.preventDefault();
                                const element = document.getElementById(service.href.substring(1));
                                element?.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                          >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <span className="text-gray-800 font-bold text-sm group-hover:text-blue-600 transition-colors">{service.name}</span>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <a 
                href="/vision" 
                className="relative px-4 py-2 font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 group"
              >
                رؤيتنا
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:w-full transition-all duration-300 rounded-full"></div>
              </a>
              <a 
                href="/subsidiaries"
                className="relative px-4 py-2 font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 group"
              >
                شركاتنا
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:w-full transition-all duration-300 rounded-full"></div>
              </a>
              <a 
                href="/ready-projects" 
                className="relative px-4 py-2 font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 group"
              >
                منتجاتنا
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:w-full transition-all duration-300 rounded-full"></div>
              </a>
              <a 
                href="/contact"
                className="relative px-4 py-2 font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 group"
              >
                تواصل معنا
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:w-full transition-all duration-300 rounded-full"></div>
              </a>
              
              {/* Others Dropdown - Modern */}
              <div 
                className="relative group"
                onMouseEnter={() => setShowOthers(true)}
                onMouseLeave={() => setShowOthers(false)}
              >
                <button 
                  className="relative flex items-center gap-2 px-4 py-2 font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300"
                >
                  أخرى
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:w-full transition-all duration-300 rounded-full"></div>
                </button>
                
                {showOthers && (
                  <div className="absolute top-full right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-50 animate-fade-in">
                    <div className="p-3">
                      {othersItems.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                          <a
                            key={index}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/80 transition-all duration-300 rounded-xl group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <span className="text-gray-800 font-bold text-sm group-hover:text-purple-600 transition-colors">{item.name}</span>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons - Modern */}
            <div className="flex items-center gap-3">
              {/* Contact Buttons */}
              <div className="hidden xl:flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 hover:bg-green-50 px-4 py-2 rounded-xl transition-all duration-300"
                  asChild
                >
                  <a href="https://wa.me/966555812567" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 text-green-500" />
                    <span className="font-semibold">واتساب</span>
                  </a>
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all duration-300"
                  asChild
                >
                  <a href="tel:+966555812567">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold">اتصال</span>
                  </a>
                </Button>
              </div>
              
              {/* Main CTA Button */}
              <Button 
                size="lg"
                className="hidden lg:flex font-bold bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0"
                asChild
              >
                <a href="https://ash.holdings" target="_blank" rel="noopener noreferrer">
                  <span>ابدأ معنا</span>
                  <Zap className="w-4 h-4 mr-2" />
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