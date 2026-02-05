/**
 * HeaderDesktopNav - Premium Desktop Navigation
 * Professional navigation with dropdowns
 */

import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { HeaderDropdown } from './HeaderDropdown';
import { headerConfig } from './config';
import { LogIn, Headphones } from 'lucide-react';

export function HeaderDesktopNav() {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);

  const isActiveRoute = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="القائمة الرئيسية">
      {/* Home */}
      <NavLink href="/" isActive={isActiveRoute('/')}>
        الرئيسية
      </NavLink>

      {/* About */}
      <NavLink href="/about" isActive={isActiveRoute('/about')}>
        من نحن
      </NavLink>

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

      {/* Subsidiaries */}
      <NavLink href="/subsidiaries" isActive={isActiveRoute('/subsidiaries')}>
        شركاتنا
      </NavLink>

      {/* Contact */}
      <NavLink href="/contact" isActive={isActiveRoute('/contact')}>
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
        'relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
        isActive 
          ? 'text-primary bg-primary/5' 
          : 'text-foreground hover:text-primary hover:bg-muted'
      )}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 start-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
      )}
    </Link>
  );
}
