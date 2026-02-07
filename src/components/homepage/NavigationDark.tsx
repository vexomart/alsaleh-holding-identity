/**
 * Navigation Dark - MaxioCore Inspired
 * Clean sticky header with dark theme
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Sun, 
  ChevronDown,
  Globe,
  Code2,
  Palette,
  TrendingUp,
  Phone,
  User,
  LogIn
} from "lucide-react";

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { 
    label: "خدماتنا", 
    href: "/integrated-services",
    submenu: [
      { label: "التسويق الرقمي", href: "/digital-marketing", icon: TrendingUp },
      { label: "البرمجة والتطوير", href: "/development", icon: Code2 },
      { label: "التصميم الإبداعي", href: "/design-services", icon: Palette },
      { label: "خدمات رقمية", href: "/digital-services", icon: Globe },
    ]
  },
  { label: "من نحن", href: "/about" },
  { label: "الأسعار", href: "/pricing" },
  { label: "تواصل معنا", href: "/contact" },
];

export function NavigationDark() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header 
        dir="rtl"
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[hsl(222_50%_5%/0.95)] backdrop-blur-xl border-b border-[hsl(var(--hp-border))]' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[hsl(var(--hp-primary))] to-[hsl(var(--hp-secondary))] rounded-lg flex items-center justify-center">
                <span className="text-[hsl(222_50%_5%)] font-black text-xs">ASH</span>
              </div>
              <span className="text-xl sm:text-2xl font-black">
                <span className="text-[hsl(var(--hp-text))]">ASH</span>
                <span className="hp-gradient-text"> HOLDING</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div 
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => link.submenu && setActiveSubmenu(link.href)}
                  onMouseLeave={() => setActiveSubmenu(null)}
                >
                  <Link
                    to={link.href}
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      location.pathname === link.href
                        ? 'text-[hsl(var(--hp-primary))] bg-[hsl(var(--hp-primary)/0.1)]'
                        : 'text-[hsl(var(--hp-text-muted))] hover:text-[hsl(var(--hp-text))] hover:bg-[hsl(var(--hp-bg-card))]'
                    }`}
                  >
                    {link.label}
                    {link.submenu && <ChevronDown className="w-4 h-4" />}
                  </Link>

                  {/* Submenu */}
                  <AnimatePresence>
                    {link.submenu && activeSubmenu === link.href && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-2 w-56 bg-[hsl(var(--hp-bg-card))] border border-[hsl(var(--hp-border))] rounded-xl shadow-xl overflow-hidden"
                      >
                        {link.submenu.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-[hsl(var(--hp-text-muted))] hover:text-[hsl(var(--hp-text))] hover:bg-[hsl(var(--hp-bg-card-hover))] transition-colors"
                          >
                            <item.icon className="w-4 h-4 text-[hsl(var(--hp-primary))]" />
                            {item.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <button className="p-2 text-[hsl(var(--hp-text-muted))] hover:text-[hsl(var(--hp-text))] hover:bg-[hsl(var(--hp-bg-card))] rounded-lg transition-colors">
                <Sun className="w-5 h-5" />
              </button>
              
              <Link to="/auth?mode=login">
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[hsl(var(--hp-text-muted))] hover:text-[hsl(var(--hp-text))] hover:bg-[hsl(var(--hp-bg-card))] rounded-lg transition-colors">
                  <LogIn className="w-4 h-4" />
                  <span>تسجيل الدخول</span>
                </button>
              </Link>
              
              <Link to="/auth?mode=signup">
                <button className="hp-btn-primary text-sm py-2 px-4">
                  <span>ابدأ الآن</span>
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[hsl(var(--hp-text))] hover:bg-[hsl(var(--hp-bg-card))] rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-40 lg:hidden bg-[hsl(var(--hp-bg))] border-t border-[hsl(var(--hp-border))]"
            dir="rtl"
          >
            <div className="container mx-auto px-4 py-6">
              <nav className="space-y-2">
                {navLinks.map((link) => (
                  <div key={link.href}>
                    <Link
                      to={link.href}
                      className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                        location.pathname === link.href
                          ? 'text-[hsl(var(--hp-primary))] bg-[hsl(var(--hp-primary)/0.1)]'
                          : 'text-[hsl(var(--hp-text))] hover:bg-[hsl(var(--hp-bg-card))]'
                      }`}
                    >
                      {link.label}
                    </Link>
                    {link.submenu && (
                      <div className="mr-4 mt-1 space-y-1">
                        {link.submenu.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[hsl(var(--hp-text-muted))] hover:text-[hsl(var(--hp-text))] hover:bg-[hsl(var(--hp-bg-card))] rounded-lg transition-colors"
                          >
                            <item.icon className="w-4 h-4 text-[hsl(var(--hp-primary))]" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Mobile Actions */}
              <div className="mt-6 space-y-3">
                <Link to="/auth?mode=login" className="block">
                  <button className="w-full hp-btn-secondary text-base py-3">
                    <LogIn className="w-5 h-5" />
                    <span>تسجيل الدخول</span>
                  </button>
                </Link>
                <Link to="/auth?mode=signup" className="block">
                  <button className="w-full hp-btn-primary text-base py-3">
                    <span>ابدأ الآن مجاناً</span>
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
