/**
 * MainHeaderV2 - Desktop Navigation
 * RTL-native navigation with click-only dropdowns
 */

import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { HeaderDropdown } from './HeaderDropdown';
import { primaryLinks, endLinks, servicesMenu, productsMenu, othersMenu } from './MainHeaderV2.data';
import { navStyles as s } from './MainHeaderV2.styles';

export function HeaderDesktopNav() {
  const location = useLocation();

  // Check active route
  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
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
        id="services"
        label="خدماتنا"
        items={servicesMenu}
        variant="grid"
      />

      {/* Products Dropdown */}
      <HeaderDropdown
        id="products"
        label="منتجاتنا"
        items={productsMenu}
        variant="grid"
      />

      {/* Others Dropdown */}
      <HeaderDropdown
        id="others"
        label="أخرى"
        items={othersMenu}
        variant="list"
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
