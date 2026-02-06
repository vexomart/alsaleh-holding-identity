/**
 * MainHeaderV2 - Dropdown Component
 * Clean mega menu with RTL support
 */

import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavLink } from './MainHeaderV2.data';
import { navStyles, dropdownStyles as s } from './MainHeaderV2.styles';

interface HeaderDropdownProps {
  label: string;
  items: NavLink[];
  variant?: 'grid' | 'list';
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function HeaderDropdown({
  label,
  items,
  variant = 'grid',
  isOpen,
  onToggle,
  onClose,
}: HeaderDropdownProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const closeTimerRef = React.useRef<number>();

  // Check if any item is active
  const hasActiveChild = items.some(item => 
    item.href === '/' ? location.pathname === '/' : location.pathname.startsWith(item.href)
  );

  // Handle mouse enter
  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = undefined;
    }
    if (!isOpen) onToggle();
  };

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    closeTimerRef.current = window.setTimeout(onClose, 120);
  };

  // Handle navigation
  const handleNav = (href: string) => {
    onClose();
    navigate(href);
  };

  // Cleanup timer
  React.useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <button
        onClick={onToggle}
        className={cn(
          navStyles.dropdownTrigger,
          (isOpen || hasActiveChild) && navStyles.dropdownTriggerActive
        )}
        aria-expanded={isOpen}
        aria-haspopup="menu"
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
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className={cn(s.panel, variant === 'list' && s.panelSmall)}
            role="menu"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Accent Line */}
            <div 
              className="absolute top-0 inset-x-0 h-px bg-gradient-to-l from-primary via-accent to-primary" 
              aria-hidden="true"
            />
            
            {/* Header */}
            <div className={s.header}>
              <div className="flex items-center justify-between">
                <span className={s.headerTitle}>{label}</span>
                <span className={s.headerCount}>{items.length} خيارات</span>
              </div>
            </div>

            {/* Items */}
            <div className={variant === 'grid' ? s.grid : s.list}>
              {items.map((item) => {
                const isActive = item.href === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <button
                    key={item.href}
                    onClick={() => handleNav(item.href)}
                    className={cn(s.item, isActive && s.itemActive)}
                    role="menuitem"
                  >
                    {Icon && (
                      <div className={cn(s.itemIcon, isActive && s.itemIconActive)}>
                        <Icon className="w-5 h-5" />
                      </div>
                    )}
                    <div className={s.itemText}>
                      <span className={s.itemLabel}>{item.label}</span>
                      {item.desc && <span className={s.itemDesc}>{item.desc}</span>}
                    </div>
                    <ArrowLeft 
                      className="w-4 h-4 opacity-0 translate-x-1 group-hover:opacity-50 group-hover:translate-x-0 transition-all duration-200" 
                    />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
