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
  Palette
} from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showServices, setShowServices] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    { name: "العروض الحالية", href: "#offers", icon: Gift },
    { name: "خدماتنا الاحترافية", href: "#services", icon: Settings },
    { name: "صناعة المحتوى", href: "#content-creation", icon: PenTool },
    { name: "حلول التصميم", href: "#design-solutions", icon: Palette },
    { name: "الاستثمار التقني", href: "/tech-investment", icon: Zap },
    { name: "التطوير والابتكار", href: "/development", icon: Building2 },
    { name: "الاستشارات الإستراتيجية", href: "/strategic-consulting", icon: Users },
    { name: "الحلول المتكاملة", href: "/integrated-solutions", icon: Award }
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="hidden sm:block bg-slate-900 text-white py-2 text-xs">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span>ساعات العمل: الأحد - الخميس 8:00 ص - 6:00 م</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                <span>المملكة العربية السعودية</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                <a href="mailto:info@ash.holdings" className="hover:text-gray-300 transition-colors">
                  info@ash.holdings
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3" />
                <a href="tel:+966555812567" className="hover:text-gray-300 transition-colors">
                  0555812567
                </a>
              </div>
              <Badge variant="secondary" className="bg-green-500 text-white text-xs">
                متاح الآن
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/98 backdrop-blur-lg border-b border-gray-200/30 shadow-sm' 
          : 'bg-slate-900/95 backdrop-blur-md'
      }`}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo & Company Name */}
            <div className="flex items-center gap-4">
              <a href="/" className="flex items-center gap-3">
                <img 
                  src="/lovable-uploads/1b40cb28-9cbb-4fdf-9a92-f739dad1a3a7.png" 
                  alt="ASH Holdings" 
                  className="h-10 lg:h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
                />
                <div className="hidden lg:block">
                  <div className={`font-bold text-base ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                    شركة علي صالح الشهري القابضة
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className={`text-xs ${isScrolled ? 'text-gray-500' : 'text-white/80'}`}>
                      شركة رائدة منذ 2016
                    </span>
                  </div>
                </div>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <a 
                href="/" 
                className={`font-medium transition-colors hover:text-primary ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                الرئيسية
              </a>
              <a 
                href="/about" 
                className={`font-medium transition-colors hover:text-primary ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                من نحن
              </a>
              
              {/* Services Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setShowServices(true)}
                onMouseLeave={() => setShowServices(false)}
              >
                <button 
                  className={`flex items-center gap-1 font-medium transition-colors hover:text-primary ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  خدماتنا
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showServices && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="p-2">
                      {services.map((service, index) => {
                        const IconComponent = service.icon;
                        return (
                          <a
                            key={index}
                            href={service.href}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors rounded-lg"
                            onClick={(e) => {
                              if (service.href.startsWith('#')) {
                                e.preventDefault();
                                const element = document.getElementById(service.href.substring(1));
                                element?.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <IconComponent className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-gray-700 font-medium text-sm">{service.name}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <a 
                href="/vision" 
                className={`font-medium transition-colors hover:text-primary ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                رؤيتنا
              </a>
              <a 
                href="#companies" 
                className={`font-medium transition-colors hover:text-primary ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                شركاتنا
              </a>
              <a 
                href="/contact" 
                className={`font-medium transition-colors hover:text-primary ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                تواصل معنا
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Contact Buttons - Desktop Only */}
              <div className="hidden xl:flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="ghost"
                  className={`flex items-center gap-2 ${isScrolled ? 'text-gray-600 hover:text-green-600' : 'text-white hover:text-green-400'}`}
                  asChild
                >
                  <a href="https://wa.me/966555812567" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 text-green-500" />
                    <span>واتساب</span>
                  </a>
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className={`flex items-center gap-2 ${isScrolled ? 'text-gray-600 hover:text-blue-600' : 'text-white hover:text-blue-400'}`}
                  asChild
                >
                  <a href="tel:+966555812567">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <span>اتصال فوري</span>
                  </a>
                </Button>
              </div>
              
              <Button 
                variant={isScrolled ? "default" : "secondary"}
                size="sm"
                className="hidden lg:flex font-semibold"
                asChild
              >
                <a href="https://ash.holdings" target="_blank" rel="noopener noreferrer">
                  ابدأ معنا
                </a>
              </Button>
              
              {/* Mobile Menu Button */}
              <button
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                }`}
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
                  href="#companies" 
                  className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  شركاتنا
                </a>
                <a 
                  href="/contact" 
                  className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  تواصل معنا
                </a>
                
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