import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, Zap, Phone, Mail } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-primary-dark to-primary border-b border-primary-foreground/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-12 text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                <Phone className="w-4 h-4 animate-pulse" />
                <a href="tel:+966501234567" className="hover:underline">
                  +966 50 123 4567
                </a>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                <Mail className="w-4 h-4 animate-pulse" />
                <a href="mailto:info@ash-holdings.com" className="hover:underline">
                  info@ash-holdings.com
                </a>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 text-primary-foreground/90">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 animate-spin-slow" />
                <span>نخدمكم على مدار الساعة</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="fixed top-12 w-full z-50 bg-primary/95 backdrop-blur-sm border-b border-primary-foreground/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="text-2xl font-bold text-primary-foreground group">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  شركة علي صالح الشهري
                  <span className="block text-sm text-secondary font-normal">القابضة</span>
                </div>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-reverse space-x-8">
              <a href="#home" className="text-primary-foreground hover:text-secondary transition-colors duration-200 relative group">
                الرئيسية
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#about" className="text-primary-foreground hover:text-secondary transition-colors duration-200 relative group">
                من نحن
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#vision" className="text-primary-foreground hover:text-secondary transition-colors duration-200 relative group">
                رؤيتنا
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#departments" className="text-primary-foreground hover:text-secondary transition-colors duration-200 relative group">
                الأقسام
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#companies" className="text-primary-foreground hover:text-secondary transition-colors duration-200 relative group">
                شركاتنا
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#contact" className="text-primary-foreground hover:text-secondary transition-colors duration-200 relative group">
                تواصل معنا
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
              </a>
              <Button 
                variant="secondary" 
                size="sm"
                className="font-semibold hover:shadow-glow transition-all duration-300 hover:scale-105"
              >
                ابدأ معنا
              </Button>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-primary-foreground hover:text-secondary transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden bg-primary/95 backdrop-blur-sm border-t border-primary-foreground/10 animate-fade-in">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a 
                  href="#home" 
                  className="block px-3 py-2 text-primary-foreground hover:text-secondary transition-colors duration-200 hover:bg-white/5 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  الرئيسية
                </a>
                <a 
                  href="#about" 
                  className="block px-3 py-2 text-primary-foreground hover:text-secondary transition-colors duration-200 hover:bg-white/5 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  من نحن
                </a>
                <a 
                  href="#vision" 
                  className="block px-3 py-2 text-primary-foreground hover:text-secondary transition-colors duration-200 hover:bg-white/5 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  رؤيتنا
                </a>
                <a 
                  href="#departments" 
                  className="block px-3 py-2 text-primary-foreground hover:text-secondary transition-colors duration-200 hover:bg-white/5 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  الأقسام
                </a>
                <a 
                  href="#companies" 
                  className="block px-3 py-2 text-primary-foreground hover:text-secondary transition-colors duration-200 hover:bg-white/5 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  شركاتنا
                </a>
                <a 
                  href="#contact" 
                  className="block px-3 py-2 text-primary-foreground hover:text-secondary transition-colors duration-200 hover:bg-white/5 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  تواصل معنا
                </a>
                
                {/* Contact Info in Mobile */}
                <div className="px-3 py-2 border-t border-primary-foreground/10 mt-2">
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 text-primary-foreground/90">
                      <Phone className="w-4 h-4" />
                      <a href="tel:+966501234567" className="hover:text-secondary">
                        +966 50 123 4567
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-primary-foreground/90">
                      <Mail className="w-4 h-4" />
                      <a href="mailto:info@ash-holdings.com" className="hover:text-secondary">
                        info@ash-holdings.com
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="px-3 py-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="w-full font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    ابدأ معنا
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