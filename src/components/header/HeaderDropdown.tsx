/**
 * HeaderDropdown - Premium Dropdown Menu Component
 */

import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronLeft, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavItem } from './types';

interface HeaderDropdownProps {
  label: string;
  items: NavItem[];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  variant?: 'default' | 'mega';
}

export function HeaderDropdown({ 
  label, 
  items, 
  isOpen, 
  onOpen, 
  onClose,
  variant = 'default' 
}: HeaderDropdownProps) {
  const location = useLocation();
  const hideTimeoutRef = React.useRef<number>();

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    onOpen();
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = window.setTimeout(() => {
      onClose();
    }, 150);
  };

  const isActive = items.some(item => {
    if (item.href === '/') return location.pathname === '/';
    return location.pathname.startsWith(item.href);
  });

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button 
        className={cn(
          'flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
          isActive || isOpen
            ? 'text-primary bg-primary/5' 
            : 'text-foreground hover:text-primary hover:bg-muted'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown className={cn(
          'w-3.5 h-3.5 transition-transform duration-200',
          isOpen && 'rotate-180'
        )} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div 
          className={cn(
            'absolute top-full start-0 mt-2 bg-card rounded-2xl shadow-xl border border-border/50 z-50',
            'animate-in fade-in-0 zoom-in-95 duration-200',
            variant === 'mega' ? 'min-w-[400px]' : 'min-w-[280px]'
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="p-2">
            {variant === 'mega' ? (
              <div className="grid grid-cols-2 gap-1">
                {items.map((item, index) => (
                  <DropdownMegaItem key={index} item={item} />
                ))}
              </div>
            ) : (
              <div className="space-y-0.5">
                {items.map((item, index) => (
                  <DropdownItem key={index} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Standard Dropdown Item
function DropdownItem({ item }: { item: NavItem }) {
  const location = useLocation();
  const isActive = item.href === '/' 
    ? location.pathname === '/' 
    : location.pathname.startsWith(item.href);
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group',
        isActive 
          ? 'bg-primary/10 text-primary font-medium' 
          : 'text-foreground hover:bg-muted hover:text-primary'
      )}
    >
      {Icon && (
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
          isActive ? 'bg-primary text-white' : 'bg-muted group-hover:bg-primary/10'
        )}>
          <Icon className={cn('w-4 h-4', !isActive && 'group-hover:text-primary')} />
        </div>
      )}
      <span>{item.name}</span>
    </Link>
  );
}

// Mega Menu Item with Description
function DropdownMegaItem({ item }: { item: NavItem }) {
  const location = useLocation();
  const isActive = item.href === '/' 
    ? location.pathname === '/' 
    : location.pathname.startsWith(item.href);
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      className={cn(
        'flex items-start gap-3 p-3 rounded-xl text-sm transition-all duration-200 group',
        isActive 
          ? 'bg-primary/10' 
          : 'hover:bg-muted'
      )}
    >
      {Icon && (
        <div className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors',
          isActive 
            ? 'bg-primary text-white' 
            : 'bg-muted group-hover:bg-primary group-hover:text-white'
        )}>
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <span className={cn(
          'block font-medium mb-0.5',
          isActive ? 'text-primary' : 'text-foreground group-hover:text-primary'
        )}>
          {item.name}
        </span>
        {item.description && (
          <span className="block text-xs text-muted-foreground line-clamp-1">
            {item.description}
          </span>
        )}
      </div>
      <ChevronLeft className={cn(
        'w-4 h-4 mt-1 opacity-0 -translate-x-2 transition-all duration-200',
        'group-hover:opacity-100 group-hover:translate-x-0',
        isActive ? 'text-primary' : 'text-muted-foreground'
      )} />
    </Link>
  );
}
