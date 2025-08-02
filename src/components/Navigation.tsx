import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, Zap, Phone, Mail, MessageCircle } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-primary/95 backdrop-blur-sm border-b border-primary-foreground/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/1b40cb28-9cbb-4fdf-9a92-f739dad1a3a7.png" 
              alt="Ash Holdings Logo" 
              className="h-20 md:h-24 w-auto object-contain hover:scale-110 transition-all duration-500 drop-shadow-2xl brightness-110 contrast-110"
            />
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-reverse space-x-8">
            <div className="flex items-center gap-2 text-sm text-primary-foreground/90 hover:text-green-400 transition-colors">
              <MessageCircle className="w-4 h-4 text-green-400" />
              <a href="https://wa.me/966555812567" target="_blank" rel="noopener noreferrer" className="hover:text-green-400">واتساب: 0555812567</a>
            </div>
            <a href="/" className="text-primary-foreground hover:text-secondary transition-colors duration-200">
              الرئيسية
            </a>
            <a href="/about" className="text-primary-foreground hover:text-secondary transition-colors duration-200">
              من نحن
            </a>
            <a href="/vision" className="text-primary-foreground hover:text-secondary transition-colors duration-200">
              رؤيتنا
            </a>
            <a href="#companies" className="text-primary-foreground hover:text-secondary transition-colors duration-200">
              شركاتنا
            </a>
            <a href="/contact" className="text-primary-foreground hover:text-secondary transition-colors duration-200">
              تواصل معنا
            </a>
            <Button 
              variant="secondary" 
              size="sm"
              className="font-semibold"
            >
              ابدأ معنا
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-primary border-t border-primary-foreground/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="px-3 py-2 border-b border-primary-foreground/10 mb-2">
                <div className="flex items-center gap-2 text-sm text-primary-foreground/90 hover:text-green-400 transition-colors">
                  <MessageCircle className="w-4 h-4 text-green-400" />
                  <a href="https://wa.me/966555812567" target="_blank" rel="noopener noreferrer" className="hover:text-green-400">واتساب: 0555812567</a>
                </div>
              </div>
              <a 
                href="/" 
                className="block px-3 py-2 text-primary-foreground hover:text-secondary transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                الرئيسية
              </a>
              <a 
                href="/about" 
                className="block px-3 py-2 text-primary-foreground hover:text-secondary transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                من نحن
              </a>
              <a 
                href="/vision" 
                className="block px-3 py-2 text-primary-foreground hover:text-secondary transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                رؤيتنا
              </a>
              <a 
                href="#companies" 
                className="block px-3 py-2 text-primary-foreground hover:text-secondary transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                شركاتنا
              </a>
              <a 
                href="/contact" 
                className="block px-3 py-2 text-primary-foreground hover:text-secondary transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                تواصل معنا
              </a>
              <div className="px-3 py-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="w-full font-semibold"
                >
                  ابدأ معنا
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;