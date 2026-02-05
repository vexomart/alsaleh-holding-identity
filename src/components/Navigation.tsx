/**
 * Navigation - Premium Enterprise Header Component
 * ================================================
 * Complete RTL-native header system for ASH HOLDING
 * 
 * Features:
 * - Full RTL support with logical properties
 * - Responsive design (Mobile → Tablet → Desktop → Large screens)
 * - Transparent-to-solid scroll transition
 * - Premium dropdown navigation with mega menus
 * - Slide-in mobile menu from right (RTL)
 * - Sticky header with smooth animations
 * - WCAG accessible
 */

import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Headphones } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HeaderLogo } from './header/HeaderLogo';
import { HeaderTopBar } from './header/HeaderTopBar';
import { HeaderDesktopNav } from './header/HeaderDesktopNav';
import { HeaderMobileMenu } from './header/HeaderMobileMenu';

const Navigation = () => {
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
      <header 
        className={cn(
          'fixed inset-x-0 z-40 transition-all duration-300 ease-out',
          isScrolled 
            ? 'top-0 shadow-lg' 
            : 'top-0 lg:top-10'
        )}
        role="banner"
      >
        <div className={cn(
          'bg-card/95 backdrop-blur-xl border-b transition-all duration-300',
          isScrolled 
            ? 'border-border/80' 
            : 'border-border/50'
        )}>
          <div className="container mx-auto px-4 lg:px-6">
            {/* Main Nav Container - RTL Native Flow */}
            <div className="flex items-center justify-between h-14 lg:h-16" dir="rtl">
              
              {/* ===== LOGO (Right Side in RTL) ===== */}
              <HeaderLogo />

              {/* ===== DESKTOP NAVIGATION (Center) ===== */}
              <HeaderDesktopNav />

              {/* ===== CTA & MOBILE TOGGLE (Left Side in RTL) ===== */}
              <div className="flex items-center gap-2 lg:gap-3 shrink-0">
                
                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={cn(
                    'lg:hidden flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200',
                    'hover:bg-muted active:scale-95',
                    isMobileMenuOpen && 'bg-muted'
                  )}
                  aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-menu"
                >
                  <div className="w-6 h-5 flex flex-col justify-center items-center gap-1.5">
                    <span className={cn(
                      'block w-5 h-0.5 bg-foreground rounded-full transition-all duration-300',
                      isMobileMenuOpen && 'rotate-45 translate-y-2'
                    )} />
                    <span className={cn(
                      'block w-5 h-0.5 bg-foreground rounded-full transition-all duration-300',
                      isMobileMenuOpen && 'opacity-0 scale-0'
                    )} />
                    <span className={cn(
                      'block w-5 h-0.5 bg-foreground rounded-full transition-all duration-300',
                      isMobileMenuOpen && '-rotate-45 -translate-y-2'
                    )} />
                  </div>
                </button>

                {/* Desktop CTA Button */}
                <Link 
                  to="/book-consultation"
                  className={cn(
                    'hidden lg:inline-flex items-center gap-2 px-5 py-2.5',
                    'bg-gradient-to-l from-primary to-primary-variant',
                    'text-primary-foreground text-sm font-semibold rounded-xl',
                    'hover:from-primary-variant hover:to-primary',
                    'transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]'
                  )}
                >
                  <Headphones className="w-4 h-4" />
                  <span>احجز استشارة مجانية</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MOBILE MENU ===== */}
      <HeaderMobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
};

export default Navigation;
