/**
 * MainHeaderV2 - Desktop Navigation
 * RTL-native navigation with dropdowns
 */

import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { HeaderDropdown } from './HeaderDropdown';
import { primaryLinks, endLinks, servicesMenu, productsMenu, othersMenu } from './MainHeaderV2.data';
import { navStyles as s } from './MainHeaderV2.styles';

export function HeaderDesktopNav() {
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);

  // Check active route
  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  // Dropdown handlers
  const openDropdown = (name: string) => setActiveDropdown(name);
  const closeDropdown = () => setActiveDropdown(null);
  const toggleDropdown = (name: string) => {
    setActiveDropdown(prev => prev === name ? null : name);
  };

  return (
    <nav className={s.desktop} role="navigation" aria-label="القائمة الرئيسية">
      {/* Primary Links */}
      {primaryLinks.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className={cn(s.link, isActive(link.href) && s.linkActive)}
        >
          {link.label}
        </Link>
      ))}

      {/* Services Dropdown */}
      <HeaderDropdown
        label="خدماتنا"
        items={servicesMenu}
        variant="grid"
        isOpen={activeDropdown === 'services'}
        onToggle={() => toggleDropdown('services')}
        onClose={closeDropdown}
      />

      {/* Products Dropdown */}
      <HeaderDropdown
        label="منتجاتنا"
        items={productsMenu}
        variant="grid"
        isOpen={activeDropdown === 'products'}
        onToggle={() => toggleDropdown('products')}
        onClose={closeDropdown}
      />

      {/* Others Dropdown */}
      <HeaderDropdown
        label="أخرى"
        items={othersMenu}
        variant="list"
        isOpen={activeDropdown === 'others'}
        onToggle={() => toggleDropdown('others')}
        onClose={closeDropdown}
      />

      {/* End Links */}
      {endLinks.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className={cn(s.link, isActive(link.href) && s.linkActive)}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
