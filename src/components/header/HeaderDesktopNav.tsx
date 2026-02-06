/**
 * HeaderDesktopNav - Premium Desktop Navigation
 * Enterprise navigation with animated dropdowns
 */

import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
        'relative px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-200',
        isActive 
          ? 'text-primary bg-primary/10' 
          : 'text-gray-700 hover:text-primary hover:bg-gray-100'
      )}
    >
      {children}
      
      {/* Active Indicator */}
      {isActive && (
        <span className="absolute bottom-1 start-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
      )}
    </Link>
  );
}
