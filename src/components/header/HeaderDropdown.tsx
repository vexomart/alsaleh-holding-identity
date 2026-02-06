/**
 * HeaderDropdown - Premium Enterprise Mega Menu
 * RTL-native with smooth animations and proper accessibility
 */

import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowLeft, Sparkles, ExternalLink } from 'lucide-react';
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
  const navigate = useNavigate();
  const hideTimeoutRef = React.useRef<number>();
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Handle mouse enter with debounce clear
  const handleMouseEnter = React.useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = undefined;
    }
    onOpen();
  }, [onOpen]);

  // Handle mouse leave with delay
  const handleMouseLeave = React.useCallback(() => {
    hideTimeoutRef.current = window.setTimeout(() => {
      onClose();
    }, 150);
  }, [onClose]);

  // Handle click toggle
  const handleTriggerClick = React.useCallback(() => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  }, [isOpen, onOpen, onClose]);

  // Handle navigation
  const handleNavigate = React.useCallback((href: string) => {
    onClose();
    navigate(href);
  }, [navigate, onClose]);

  // Check if any child is active
  const isActive = React.useMemo(() => {
    return items.some(item => {
      if (item.href === '/') return location.pathname === '/';
      return location.pathname.startsWith(item.href);
    });
  }, [items, location.pathname]);

  // Keyboard navigation
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTriggerClick();
    }
  }, [onClose, handleTriggerClick]);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button 
        onClick={handleTriggerClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold rounded-xl',
          'transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
          isActive || isOpen
            ? 'text-primary bg-primary/10' 
            : 'text-gray-700 hover:text-primary hover:bg-gray-100'
        )}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`قائمة ${label}`}
      >
        <span>{label}</span>
        <ChevronDown 
          className={cn(
            'w-4 h-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )} 
        />
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'absolute top-full end-0 mt-2 rounded-2xl overflow-hidden',
              'bg-white border border-gray-200 shadow-2xl shadow-black/10',
              variant === 'mega' ? 'min-w-[520px]' : 'min-w-[300px]'
            )}
            style={{ zIndex: 100 }}
            role="menu"
            aria-orientation="vertical"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Top Accent Line */}
            <div className="h-1 bg-gradient-to-l from-primary via-accent to-secondary" />
            
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-gray-900">{label}</span>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {items.length} خيارات
                </span>
              </div>

              {/* Items Grid/List */}
              {variant === 'mega' ? (
                <div className="grid grid-cols-2 gap-2">
                  {items.map((item, index) => (
                    <MegaMenuItem 
                      key={item.href}
                      item={item}
                      onClick={() => handleNavigate(item.href)}
                      isActive={item.href === '/' 
                        ? location.pathname === '/' 
                        : location.pathname.startsWith(item.href)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {items.map((item, index) => (
                    <MenuItem 
                      key={item.href}
                      item={item}
                      onClick={() => handleNavigate(item.href)}
                      isActive={item.href === '/' 
                        ? location.pathname === '/' 
                        : location.pathname.startsWith(item.href)}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Standard Menu Item
function MenuItem({ 
  item, 
  onClick, 
  isActive 
}: { 
  item: NavItem; 
  onClick: () => void; 
  isActive: boolean;
}) {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-start',
        'transition-all duration-200 group',
        isActive 
          ? 'bg-primary/10 text-primary' 
          : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
      )}
      role="menuitem"
    >
      {Icon && (
        <div className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200',
          isActive 
            ? 'bg-primary text-white' 
            : 'bg-gray-100 text-gray-600 group-hover:bg-primary/10 group-hover:text-primary'
        )}>
          <Icon className="w-4 h-4" />
        </div>
      )}
      <span className="flex-1 font-medium">{item.name}</span>
      <ArrowLeft className={cn(
        'w-4 h-4 opacity-0 translate-x-2 transition-all duration-200',
        'group-hover:opacity-70 group-hover:translate-x-0'
      )} />
    </button>
  );
}

// Mega Menu Item with Description
function MegaMenuItem({ 
  item, 
  onClick, 
  isActive 
}: { 
  item: NavItem; 
  onClick: () => void; 
  isActive: boolean;
}) {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-start gap-3 p-3 rounded-xl text-start',
        'transition-all duration-200 group',
        isActive 
          ? 'bg-primary/10' 
          : 'hover:bg-gray-50'
      )}
      role="menuitem"
    >
      {Icon && (
        <div className={cn(
          'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200',
          isActive 
            ? 'bg-primary text-white shadow-lg shadow-primary/30' 
            : 'bg-gray-100 text-gray-600 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/20'
        )}>
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className="flex-1 min-w-0 pt-0.5">
        <span className={cn(
          'block font-bold text-sm mb-0.5 transition-colors',
          isActive ? 'text-primary' : 'text-gray-900 group-hover:text-primary'
        )}>
          {item.name}
        </span>
        {item.description && (
          <span className="block text-xs text-gray-500 leading-relaxed line-clamp-2">
            {item.description}
          </span>
        )}
      </div>
    </button>
  );
}
