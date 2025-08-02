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
  Bell
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
    { name: "الاستثمار التقني", href: "/tech-investment", icon: Zap },
    { name: "التطوير والابتكار", href: "/development", icon: Building2 },
    { name: "الاستشارات الإستراتيجية", href: "/strategic-consulting", icon: Users },
    { name: "الحلول المتكاملة", href: "/integrated-solutions", icon: Award }
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-secondary to-primary text-primary-foreground py-2 text-sm">
        <div className="container mx-auto px-6">
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
                <a href="mailto:info@ash.holdings" className="hover:text-secondary transition-colors">
                  info@ash.holdings
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3" />
                <a href="tel:+966555812567" className="hover:text-secondary transition-colors">
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
      <nav className={`fixed top-12 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg' 
          : 'bg-primary/95 backdrop-blur-sm border-b border-primary-foreground/10'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="block">
                <img 
                  src="/lovable-uploads/1b40cb28-9cbb-4fdf-9a92-f739dad1a3a7.png" 
                  alt="ASH Holdings - شركة علي صالح الشهري القابضة" 
                  className={`h-16 md:h-20 w-auto object-contain transition-all duration-500 cursor-pointer ${
                    isScrolled ? 'brightness-75' : 'brightness-110 contrast-110 drop-shadow-2xl'
                  } hover:scale-110`}
                />
              </a>
              <div className="hidden lg:block ml-4 border-l border-gray-300 pl-4">
                <div className={`text-xs ${isScrolled ? 'text-gray-600' : 'text-primary-foreground/80'}`}>
                  شركة علي صالح الشهري القابضة
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className={`text-xs ${isScrolled ? 'text-gray-500' : 'text-primary-foreground/70'}`}>
                    منذ 2020
                  </span>
                </div>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-reverse space-x-8">
              {/* Quick Contact */}
              <div className="flex items-center gap-4 border-l border-gray-300 pl-6">
                <Button 
                  size="sm" 
                  variant="ghost"
                  className={`${isScrolled ? 'text-gray-600 hover:text-green-600' : 'text-primary-foreground hover:text-green-400'}`}
                  asChild
                >
                  <a href="https://wa.me/966555812567" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 text-green-500 ml-1" />
                    واتساب
                  </a>
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className={`${isScrolled ? 'text-gray-600 hover:text-blue-600' : 'text-primary-foreground hover:text-blue-400'}`}
                  asChild
                >
                  <a href="/support">
                    <HeadphonesIcon className="w-4 h-4 text-blue-500 ml-1" />
                    الدعم
                  </a>
                </Button>
              </div>

              {/* Navigation Links */}
              <a 
                href="/" 
                className={`font-medium transition-colors duration-200 ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-primary' 
                    : 'text-primary-foreground hover:text-secondary'
                }`}
              >
                الرئيسية
              </a>
              <a 
                href="/about" 
                className={`font-medium transition-colors duration-200 ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-primary' 
                    : 'text-primary-foreground hover:text-secondary'
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
                  className={`flex items-center gap-1 font-medium transition-colors duration-200 ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-primary' 
                      : 'text-primary-foreground hover:text-secondary'
                  }`}
                >
                  خدماتنا
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showServices && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-fade-in">
                    {services.map((service, index) => {
                      const IconComponent = service.icon;
                      return (
                        <a
                          key={index}
                          href={service.href}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-gray-700 font-medium">{service.name}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              <a 
                href="/vision" 
                className={`font-medium transition-colors duration-200 ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-primary' 
                    : 'text-primary-foreground hover:text-secondary'
                }`}
              >
                رؤيتنا
              </a>
              <a 
                href="#companies" 
                className={`font-medium transition-colors duration-200 ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-primary' 
                    : 'text-primary-foreground hover:text-secondary'
                }`}
              >
                شركاتنا
              </a>
              <a 
                href="/contact" 
                className={`font-medium transition-colors duration-200 ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-primary' 
                    : 'text-primary-foreground hover:text-secondary'
                }`}
              >
                تواصل معنا
              </a>
              
              <Button 
                variant={isScrolled ? "default" : "secondary"}
                size="sm"
                className="font-semibold shadow-md hover:shadow-lg transition-shadow duration-200"
                asChild
              >
                <a href="/contact">
                  ابدأ معنا
                </a>
              </Button>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden transition-colors duration-200 ${
                isScrolled ? 'text-gray-700' : 'text-primary-foreground'
              }`}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Mobile Menu */}
          {isOpen && (
            <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Contact Info */}
                <div className="px-3 py-3 border-b border-gray-100 mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MessageCircle className="w-4 h-4 text-green-500" />
                      <a href="https://wa.me/966555812567" target="_blank" rel="noopener noreferrer" className="hover:text-green-600">
                        واتساب: 0555812567
                      </a>
                    </div>
                    <Badge variant="secondary" className="bg-green-500 text-white text-xs">
                      متاح الآن
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <HeadphonesIcon className="w-4 h-4 text-blue-500" />
                    <a href="/support" className="hover:text-blue-600">الدعم الفني</a>
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
                          onClick={() => setIsOpen(false)}
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
                    <a href="/contact">
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