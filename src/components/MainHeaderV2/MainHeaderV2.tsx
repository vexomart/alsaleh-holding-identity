/**
 * MainHeaderV2 - Main Header Component
 * Premium enterprise header with dark theme
 */

import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Headphones, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HeaderLogo } from './HeaderLogo';
import { HeaderDesktopNav } from './HeaderDesktopNav';
import { HeaderMobileNav } from './HeaderMobileNav';
import { headerStyles as h, buttonStyles as btn } from './MainHeaderV2.styles';

export function MainHeaderV2() {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const location = useLocation();

  // Scroll detection
  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className={cn(h.wrapper, isScrolled ? h.bgScrolled : h.bgDefault)}
        role="banner"
        dir="rtl"
      >
        <div className={h.container}>
          <div className={h.inner}>
            {/* Logo */}
            <HeaderLogo />

            {/* Desktop Navigation */}
            <HeaderDesktopNav />

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Mobile Toggle */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className={btn.mobileToggle}
                aria-label={isMobileOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                aria-expanded={isMobileOpen}
              >
                {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Customer Portal - Desktop */}
              <Link to="/app" className={cn(btn.secondary, 'hidden lg:inline-flex')}>
                <User className="w-4 h-4" />
                <span>بوابة العملاء</span>
              </Link>

              {/* CTA - Desktop */}
              <Link to="/book-consultation" className={cn(btn.primary, 'hidden lg:inline-flex')}>
                <Headphones className="w-4 h-4" />
                <span>احجز استشارة</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation */}
      <HeaderMobileNav 
        isOpen={isMobileOpen} 
        onClose={() => setIsMobileOpen(false)} 
      />
    </>
  );
}
