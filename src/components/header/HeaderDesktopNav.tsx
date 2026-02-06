/**
 * HeaderDesktopNav - Premium Enterprise Desktop Navigation
 * RTL-native with dropdowns and proper accessibility
 */

import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { HeaderDropdown } from './HeaderDropdown';
import { headerConfig, mainNavItems } from './config';

export function HeaderDesktopNav() {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);

  // Check if route is active
  const isActiveRoute = React.useCallback((href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  }, [location.pathname]);

  // Close dropdown handler
  const handleCloseDropdown = React.useCallback(() => {
    setOpenDropdown(null);
  }, []);

  // Open specific dropdown handler
  const handleOpenDropdown = React.useCallback((name: string) => {
    setOpenDropdown(name);
  }, []);

  return (
    <nav 
      className="hidden lg:flex items-center gap-1" 
      role="navigation" 
      aria-label="القائمة الرئيسية"
    >
      {/* Home Link */}
      <NavLink 
        href="/" 
        isActive={isActiveRoute('/')}
      >
        الرئيسية
      </NavLink>

      {/* About Link */}
      <NavLink 
        href="/about" 
        isActive={isActiveRoute('/about')}
      >
        من نحن
      </NavLink>

      {/* Services Dropdown */}
      <HeaderDropdown
        label="خدماتنا"
        items={headerConfig.services}
        isOpen={openDropdown === 'services'}
        onOpen={() => handleOpenDropdown('services')}
        onClose={handleCloseDropdown}
        variant="mega"
      />

      {/* Products Dropdown */}
      <HeaderDropdown
        label="منتجاتنا"
        items={headerConfig.products}
        isOpen={openDropdown === 'products'}
        onOpen={() => handleOpenDropdown('products')}
        onClose={handleCloseDropdown}
        variant="mega"
      />

      {/* Others Dropdown */}
      <HeaderDropdown
        label="أخرى"
        items={headerConfig.others}
        isOpen={openDropdown === 'others'}
        onOpen={() => handleOpenDropdown('others')}
        onClose={handleCloseDropdown}
        variant="default"
      />

      {/* Subsidiaries Link */}
      <NavLink 
        href="/subsidiaries" 
        isActive={isActiveRoute('/subsidiaries')}
      >
        شركاتنا
      </NavLink>

      {/* Contact Link */}
      <NavLink 
        href="/contact" 
        isActive={isActiveRoute('/contact')}
      >
        تواصل معنا
      </NavLink>
    </nav>
  );
}

// NavLink Component
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
        'relative px-4 py-2.5 text-sm font-bold rounded-xl',
        'transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        isActive 
          ? 'text-primary bg-primary/10' 
          : 'text-gray-700 hover:text-primary hover:bg-gray-100'
      )}
    >
      {children}
      
      {/* Active Indicator Dot */}
      {isActive && (
        <span 
          className="absolute bottom-1 start-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}
