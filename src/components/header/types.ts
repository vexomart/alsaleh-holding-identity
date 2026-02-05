/**
 * Header Types - Premium Enterprise Header System
 */

import { LucideIcon } from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
}

export interface NavDropdown {
  name: string;
  items: NavItem[];
}

export interface HeaderConfig {
  services: NavItem[];
  products: NavItem[];
  others: NavItem[];
}
