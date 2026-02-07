/**
 * Navigation Dark - ASH HOLDING
 * Clean sticky header - Simplified without dropdowns
 * Services, Products, Others moved to Footer
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Phone,
  Mail,
  LogIn,
  Sparkles,
  MessageCircle
} from "lucide-react";

// Navigation Data - Simple direct links
interface NavItem {
  label: string;
  href: string;
}

const navLinks: NavItem[] = [
  { label: "الرئيسية", href: "/" },
  { label: "من نحن", href: "/about" },
  { label: "خدماتنا", href: "/services-catalog" },
  { label: "منتجاتنا", href: "/software-products" },
  { label: "شركاتنا", href: "/subsidiaries" },
  { label: "تواصل معنا", href: "/contact" },
];

export function NavigationDark() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const openWhatsApp = () => {
    window.open('https://wa.me/966555812567?text=' + encodeURIComponent('مرحباً، أريد الاستفسار عن خدماتكم'), '_blank');
  };

  return (
    <>
      {/* Sticky Header Wrapper - iOS-like behavior */}
      <div 
        className="sticky top-0 z-50 w-full"
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          maxWidth: '100%',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      >
        {/* Top Bar */}
        <div className="hidden md:block bg-[hsl(222_50%_4%)] border-b border-[hsl(var(--hp-border)/0.5)]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-9 text-xs" dir="rtl">
              <div className="flex items-center gap-6 text-[hsl(var(--hp-text-muted))]">
                <a href="tel:0555812567" className="flex items-center gap-1.5 hover:text-[hsl(var(--hp-primary))] transition-colors">
                  <Phone className="w-3 h-3" />
                  <span className="ltr-token">0555812567</span>
                </a>
                <a href="mailto:info@ash-holding.sa" className="flex items-center gap-1.5 hover:text-[hsl(var(--hp-primary))] transition-colors">
                  <Mail className="w-3 h-3" />
                  <span className="ltr-token">info@ash-holding.sa</span>
                </a>
              </div>
              <div className="flex items-center gap-2 text-[hsl(var(--hp-text-muted))]">
                <Sparkles className="w-3 h-3 text-[hsl(var(--hp-secondary))]" />
                <span>شركة قابضة سعودية منذ 2016</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <header 
          dir="rtl"
          className={`w-full transition-all duration-300 ${
            isScrolled 
              ? 'bg-[hsl(222_50%_5%/0.98)] backdrop-blur-xl shadow-lg shadow-black/20' 
              : 'bg-[hsl(222_50%_5%)]'
          }`}
          style={{
            width: '100%',
            maxWidth: '100%',
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 group shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--hp-primary))] to-[hsl(var(--hp-secondary))] rounded-xl flex items-center justify-center shadow-lg shadow-[hsl(var(--hp-primary)/0.3)] group-hover:scale-105 transition-transform">
                  <span className="text-[hsl(222_50%_5%)] font-black text-sm">ASH</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg sm:text-xl font-black leading-tight">
                    <span className="text-[hsl(var(--hp-text))]">ASH</span>
                    <span className="hp-gradient-text"> HOLDING</span>
                  </span>
                  <span className="text-[10px] text-[hsl(var(--hp-text-subtle))] hidden sm:block">شركة قابضة</span>
                </div>
              </Link>

              {/* Desktop Navigation - Simple Links */}
              <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      location.pathname === link.href
                        ? 'text-[hsl(var(--hp-primary))] bg-[hsl(var(--hp-primary)/0.1)]'
                        : 'text-[hsl(var(--hp-text-muted))] hover:text-[hsl(var(--hp-text))] hover:bg-[hsl(var(--hp-bg-card))]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center gap-2 shrink-0">
                <button 
                  onClick={openWhatsApp}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[hsl(var(--hp-text-muted))] hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>واتساب</span>
                </button>
                
                <Link to="/auth?mode=login">
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[hsl(var(--hp-text-muted))] hover:text-[hsl(var(--hp-text))] hover:bg-[hsl(var(--hp-bg-card))] rounded-lg transition-colors">
                    <LogIn className="w-4 h-4" />
                    <span>دخول</span>
                  </button>
                </Link>
                
                <Link to="/book-consultation">
                  <button className="hp-btn-primary text-sm py-2.5 px-5">
                    <span>استشارة مجانية</span>
                  </button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 text-[hsl(var(--hp-text))] hover:bg-[hsl(var(--hp-bg-card))] rounded-lg transition-colors shrink-0"
                aria-label="القائمة"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Border Line */}
          <div className="h-px bg-gradient-to-r from-transparent via-[hsl(var(--hp-border))] to-transparent" />
        </header>
      </div>

      {/* Mobile Menu - Fixed below header */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-0 right-0 z-40 lg:hidden bg-[hsl(222_50%_5%)] border-b border-[hsl(var(--hp-border))] shadow-2xl shadow-black/30 top-16 md:top-[calc(4rem+36px)]"
            style={{
              width: '100%',
              maxWidth: '100%',
            }}
            dir="rtl"
          >
            <div className="container mx-auto px-4 py-4 max-h-[calc(100vh-5rem)] overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
              {/* Contact Info */}
              <div className="flex flex-row-reverse items-center justify-between pb-4 mb-4 border-b border-[hsl(var(--hp-border)/0.5)]">
                <a href="tel:0555812567" className="flex flex-row-reverse items-center gap-2 text-sm text-[hsl(var(--hp-text-muted))]">
                  <Phone className="w-4 h-4 text-[hsl(var(--hp-primary))]" />
                  <span className="ltr-token">0555812567</span>
                </a>
                <button 
                  onClick={openWhatsApp}
                  className="flex flex-row-reverse items-center gap-2 px-3 py-1.5 text-sm text-emerald-400 bg-emerald-500/10 rounded-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>واتساب</span>
                </button>
              </div>

              {/* Navigation Links - Simple */}
              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors text-end ${
                      location.pathname === link.href
                        ? 'text-[hsl(var(--hp-primary))] bg-[hsl(var(--hp-primary)/0.1)]'
                        : 'text-[hsl(var(--hp-text))] hover:bg-[hsl(var(--hp-bg-card))]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Actions */}
              <div className="mt-6 pt-4 border-t border-[hsl(var(--hp-border)/0.5)] space-y-3">
                <Link to="/auth?mode=login" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full hp-btn-secondary text-base py-3">
                    <LogIn className="w-5 h-5" />
                    <span>تسجيل الدخول</span>
                  </button>
                </Link>
                <Link to="/book-consultation" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full hp-btn-primary text-base py-3">
                    <span>احجز استشارة مجانية</span>
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default NavigationDark;
