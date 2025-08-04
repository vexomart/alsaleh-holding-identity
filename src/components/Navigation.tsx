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
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileOthersOpen, setMobileOthersOpen] = useState(false);

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
    { name: "الشراكات", href: "/partnerships", icon: Users },
    { name: "طرق الدفع", href: "/payment-methods", icon: Phone },
    { name: "رحلة الإبداع والتميز", href: "/story", icon: Heart },
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
                <a href="mailto:info@ash.holdings">info@ash.holdings</a>
              </div>
              <div className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors">
                <Phone className="w-4 h-4" />
                <a href="tel:+966555812567">+966 555 812 567</a>
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
      <nav className="fixed top-0 lg:top-[48px] w-full z-50 bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Company Name - Left Side */}
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-2 group">
                {/* Logo */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                    <img 
                      src="/lovable-uploads/1b40cb28-9cbb-4fdf-9a92-f739dad1a3a7.png" 
                      alt="ASH Holdings" 
                      className="h-6 w-auto object-contain filter brightness-0 invert"
                    />
                  </div>
                </div>
                
                {/* Company Name */}
                <div className="hidden lg:block">
                  <h1 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                    شركة علي صالح الشهري القابضة
                  </h1>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      شركة رائدة منذ 2016 • مستوى عالمي
                    </span>
                  </div>
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
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
              </a>
              
              {/* Services Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setShowServices(true)}
                onMouseLeave={() => setShowServices(false)}
              >
                <button 
                  className="relative flex items-center gap-1 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 font-medium transition-all duration-300"
                >
                  خدماتنا
                  <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
                </button>
                
                {showServices && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
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
                onMouseEnter={() => setShowOthers(true)}
                onMouseLeave={() => setShowOthers(false)}
              >
                <button 
                  className="relative flex items-center gap-1 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 font-medium transition-all duration-300"
                >
                  أخرى
                  <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
                </button>
                
                {showOthers && (
                  <div className="absolute top-full left-0 mt-2 w-60 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
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
              <a 
                href="/ready-projects" 
                className="relative px-3 py-2 text-sm text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group"
              >
                منتجاتنا
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
              </a>
              <a 
                href="/contact"
                className="relative px-3 py-2 text-sm text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group"
              >
                تواصل معنا
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
              </a>
            </div>

            {/* Action Buttons - Right Side */}
            <div className="flex items-center gap-2">
              {/* Contact Buttons */}
              <div className="hidden xl:flex items-center gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs flex items-center gap-1.5 border-green-500 text-green-600 hover:bg-green-50"
                  asChild
                >
                  <a href="https://wa.me/966555812567" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-3 h-3" />
                    <span>واتساب</span>
                  </a>
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs flex items-center gap-1.5 border-blue-500 text-blue-600 hover:bg-blue-50"
                  asChild
                >
                  <a href="tel:+966555812567">
                    <Phone className="w-3 h-3" />
                    <span>اتصال</span>
                  </a>
                </Button>
              </div>
              
              {/* Main CTA */}
              <Button 
                size="sm"
                className="h-8 px-4 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <a href="https://ash.holdings" target="_blank" rel="noopener noreferrer">
                  <span>ابدأ معنا</span>
                  <Zap className="w-3 h-3 mr-1.5" />
                </a>
              </Button>
              
              {/* Mobile Menu */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isOpen && (
            <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
              <div className="px-4 py-3 space-y-3">
                <a 
                  href="/" 
                  className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  الرئيسية
                </a>
                <a 
                  href="/about" 
                  className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  من نحن
                </a>
                
                {/* خدماتنا في الموبايل */}
                <div className="border-b border-gray-200 pb-3">
                  <button 
                    className="flex items-center justify-between w-full py-2 text-gray-900 font-semibold hover:text-blue-600 transition-colors"
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  >
                    <span>خدماتنا</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileServicesOpen && (
                    <div className="grid grid-cols-1 gap-2 pr-4 mt-2">
                      {services.map((service, index) => {
                        const IconComponent = service.icon;
                        return (
                          <a
                            key={index}
                            href={service.href}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors rounded-lg"
                            onClick={() => setIsOpen(false)}
                          >
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <IconComponent className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm text-gray-700">{service.name}</span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <a 
                  href="/vision" 
                  className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  رؤيتنا
                </a>
                <a 
                  href="/subsidiaries" 
                  className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  شركاتنا
                </a>
                <a 
                  href="/ready-projects" 
                  className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  منتجاتنا
                </a>
                
                {/* أخرى في الموبايل */}
                <div className="border-b border-gray-200 pb-3">
                  <button 
                    className="flex items-center justify-between w-full py-2 text-gray-900 font-semibold hover:text-blue-600 transition-colors"
                    onClick={() => setMobileOthersOpen(!mobileOthersOpen)}
                  >
                    <span>أخرى</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileOthersOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileOthersOpen && (
                    <div className="grid grid-cols-1 gap-2 pr-4 mt-2">
                      {othersItems.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                          <a
                            key={index}
                            href={item.href}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors rounded-lg"
                            onClick={() => setIsOpen(false)}
                          >
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <IconComponent className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm text-gray-700">{item.name}</span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <a 
                  href="/contact"
                  className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  تواصل معنا
                </a>
                
                <div className="pt-3 border-t border-gray-200">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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