/**
 * HeaderDesktopNav - Premium Desktop Navigation
 * Enterprise navigation with animated dropdowns
 */

import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { HeaderDropdown } from './HeaderDropdown';
import { headerConfig } from './config';

export function HeaderDesktopNav() {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);

  const isActiveRoute = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const navItems = [
    { href: '/', label: 'الرئيسية' },
    { href: '/about', label: 'من نحن' },
  ];

  const endNavItems = [
    { href: '/subsidiaries', label: 'شركاتنا' },
    { href: '/contact', label: 'تواصل معنا' },
  ];

  return (
    <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="القائمة الرئيسية">
      {/* Start Items */}
      {navItems.map((item) => (
        <NavLink key={item.href} href={item.href} isActive={isActiveRoute(item.href)}>
          {item.label}
        </NavLink>
      ))}

      {/* Services Dropdown */}
      <HeaderDropdown
        label="خدماتنا"
        items={headerConfig.services}
        isOpen={openDropdown === 'services'}
        onOpen={() => setOpenDropdown('services')}
        onClose={() => setOpenDropdown(null)}
        variant="mega"
      />

      {/* Products Dropdown */}
      <HeaderDropdown
        label="منتجاتنا"
        items={headerConfig.products}
        isOpen={openDropdown === 'products'}
        onOpen={() => setOpenDropdown('products')}
        onClose={() => setOpenDropdown(null)}
        variant="mega"
      />

      {/* Others Dropdown */}
      <HeaderDropdown
        label="أخرى"
        items={headerConfig.others}
        isOpen={openDropdown === 'others'}
        onOpen={() => setOpenDropdown('others')}
        onClose={() => setOpenDropdown(null)}
      />

      {/* End Items */}
      {endNavItems.map((item) => (
        <NavLink key={item.href} href={item.href} isActive={isActiveRoute(item.href)}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

// Premium NavLink Component
function NavLink({ 
  href, 
  isActive, 
  children 
}: { 
  href: string; 
  isActive: boolean; 
  children: React.ReactNode;
}) {
  return (
    <Link
      to={href}
      className={cn(
        'relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300',
        isActive 
          ? 'text-primary bg-primary/10 shadow-sm' 
          : 'text-foreground hover:text-primary hover:bg-muted/80'
      )}
    >
      <motion.span
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative z-10"
      >
        {children}
      </motion.span>
      
      {/* Active Indicator */}
      {isActive && (
        <motion.div
          layoutId="activeNavIndicator"
          className="absolute bottom-0 start-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-lg shadow-primary/30"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
}
