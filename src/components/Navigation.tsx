/**
 * Navigation - Premium Enterprise Header Component
 * Complete RTL-native header system with solid backgrounds
 */

import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Headphones, User, Menu, X } from 'lucide-react';
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

  // Toggle mobile menu
  const toggleMobileMenu = React.useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  // Close mobile menu
  const closeMobileMenu = React.useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      {/* ===== TOP INFO BAR (Desktop Only) ===== */}
      <HeaderTopBar />

      {/* ===== MAIN HEADER ===== */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={cn(
          'fixed inset-x-0 z-40 transition-all duration-300',
          isScrolled ? 'top-0' : 'top-0 lg:top-10'
        )}
        role="banner"
      >
        {/* Header Background - SOLID WHITE */}
        <div 
          className={cn(
            'transition-all duration-300 bg-white',
            isScrolled 
              ? 'shadow-xl border-b border-gray-200' 
              : 'shadow-lg border-b border-gray-100'
          )}
        >
          <div className="container mx-auto px-4 lg:px-6">
            {/* Main Nav Container - RTL Native */}
            <div className="flex items-center justify-between h-16 lg:h-[72px]" dir="rtl">
              
              {/* ===== LOGO (Right Side in RTL) ===== */}
              <HeaderLogo />

              {/* ===== DESKTOP NAVIGATION (Center) ===== */}
              <HeaderDesktopNav />

              {/* ===== CTA BUTTONS & MOBILE TOGGLE (Left Side in RTL) ===== */}
              <div className="flex items-center gap-2 lg:gap-3 shrink-0">
                
                {/* Mobile Menu Toggle */}
                <button
                  onClick={toggleMobileMenu}
                  className={cn(
                    'lg:hidden flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200',
                    'bg-gray-100 hover:bg-gray-200 active:bg-primary/10',
                    isMobileMenuOpen && 'bg-primary/10 text-primary'
                  )}
                  aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5 text-gray-700" />
                  ) : (
                    <Menu className="w-5 h-5 text-gray-700" />
                  )}
                </button>

                {/* Customer Portal Button - Desktop */}
                <Link 
                  to="/app"
                  className={cn(
                    'hidden lg:inline-flex items-center gap-2 px-5 py-2.5',
                    'bg-gray-100 text-gray-700 text-sm font-bold rounded-xl',
                    'hover:bg-primary/10 hover:text-primary border border-gray-200',
                    'transition-all duration-200'
                  )}
                >
                  <User className="w-4 h-4" />
                  <span>بوابة العملاء</span>
                </Link>

                {/* Primary CTA Button - Desktop */}
                <Link 
                  to="/book-consultation"
                  className={cn(
                    'hidden lg:inline-flex items-center gap-2 px-6 py-2.5',
                    'bg-gradient-to-l from-primary via-primary to-accent text-white text-sm font-bold rounded-xl',
                    'hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02]',
                    'transition-all duration-200'
                  )}
                >
                  <Headphones className="w-4 h-4" />
                  <span>احجز استشارة</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ===== MOBILE MENU ===== */}
      <HeaderMobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={closeMobileMenu} 
      />
    </>
  );
}

export default Navigation;
