/**
 * Navigation - Premium Enterprise Header Component
 * Complete RTL-native header system for ASH HOLDING
 */

import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Headphones, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HeaderLogo } from './header/HeaderLogo';
import { HeaderTopBar } from './header/HeaderTopBar';
import { HeaderDesktopNav } from './header/HeaderDesktopNav';
import { HeaderMobileMenu } from './header/HeaderMobileMenu';

function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const location = useLocation();

  // Scroll handler for sticky effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* ===== TOP INFO BAR (Desktop Only) ===== */}
      <HeaderTopBar />

      {/* ===== MAIN HEADER ===== */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          'fixed inset-x-0 z-40 transition-all duration-500 ease-out',
          isScrolled 
            ? 'top-0 shadow-xl' 
            : 'top-0 lg:top-10'
        )}
        role="banner"
      >
        <div className={cn(
          'bg-card/95 backdrop-blur-xl border-b transition-all duration-500',
          isScrolled 
            ? 'border-border/80 shadow-lg' 
            : 'border-border/30'
        )}>
          <div className="container mx-auto px-4 lg:px-6">
            {/* Main Nav Container - RTL Native Flow */}
            <div className="flex items-center justify-between h-14 lg:h-16" dir="rtl">
              
              {/* ===== LOGO (Right Side in RTL) ===== */}
              <HeaderLogo />

              {/* ===== DESKTOP NAVIGATION (Center) ===== */}
              <HeaderDesktopNav />

              {/* ===== CTA BUTTONS & MOBILE TOGGLE (Left Side in RTL) ===== */}
              <div className="flex items-center gap-2 lg:gap-3 shrink-0">
                
                {/* Mobile Menu Toggle */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={cn(
                    'lg:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300',
                    'hover:bg-muted active:bg-primary/10',
                    isMobileMenuOpen && 'bg-primary/10'
                  )}
                  aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-menu"
                >
                  <div className="w-5 h-4 flex flex-col justify-center items-center gap-1">
                    <motion.span 
                      animate={{ 
                        rotate: isMobileMenuOpen ? 45 : 0,
                        y: isMobileMenuOpen ? 6 : 0
                      }}
                      className="block w-5 h-0.5 bg-foreground rounded-full" 
                    />
                    <motion.span 
                      animate={{ 
                        opacity: isMobileMenuOpen ? 0 : 1,
                        scale: isMobileMenuOpen ? 0 : 1
                      }}
                      className="block w-5 h-0.5 bg-foreground rounded-full" 
                    />
                    <motion.span 
                      animate={{ 
                        rotate: isMobileMenuOpen ? -45 : 0,
                        y: isMobileMenuOpen ? -6 : 0
                      }}
                      className="block w-5 h-0.5 bg-foreground rounded-full" 
                    />
                  </div>
                </motion.button>

                {/* Customer Portal Button - Desktop */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link 
                    to="/app"
                    className={cn(
                      'hidden lg:inline-flex items-center gap-2 px-4 py-2.5',
                      'bg-muted border border-border text-foreground text-sm font-semibold rounded-xl',
                      'hover:bg-primary/10 hover:border-primary/30 hover:text-primary',
                      'transition-all duration-300'
                    )}
                  >
                    <User className="w-4 h-4" />
                    <span>بوابة العملاء</span>
                  </Link>
                </motion.div>

                {/* CTA Button - Desktop */}
                <motion.div 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                >
                  <Link 
                    to="/book-consultation"
                    className={cn(
                      'hidden lg:inline-flex items-center gap-2 px-5 py-2.5',
                      'bg-gradient-to-l from-primary via-primary-variant to-accent text-primary-foreground text-sm font-bold rounded-xl',
                      'hover:shadow-lg hover:shadow-primary/30',
                      'transition-all duration-300 relative overflow-hidden group'
                    )}
                  >
                    <Headphones className="w-4 h-4" />
                    <span>احجز استشارة</span>
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-l from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ===== MOBILE MENU ===== */}
      <HeaderMobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
}

export default Navigation;
