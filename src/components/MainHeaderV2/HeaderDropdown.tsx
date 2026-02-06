/**
 * MainHeaderV2 - Dropdown Component
 * Enterprise-grade with Portal rendering
 * Fixed positioning to avoid overflow/transform issues
 */

import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavLink } from './MainHeaderV2.data';
import { navStyles, dropdownStyles as s } from './MainHeaderV2.styles';
import { DropdownPortal } from './DropdownPortal';

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
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const closeTimerRef = React.useRef<number>();
  const [panelPosition, setPanelPosition] = React.useState({ top: 0, right: 0 });

  // Check if any item is active
  const hasActiveChild = items.some(item => 
    item.href === '/' ? location.pathname === '/' : location.pathname.startsWith(item.href)
  );

  // Calculate panel position based on trigger button
  const updatePosition = React.useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPanelPosition({
        top: rect.bottom + 16, // 16px gap below trigger
        right: window.innerWidth - rect.right, // RTL: align to right edge of trigger
      });
    }
  }, []);

  // Update position when opening
  React.useEffect(() => {
    if (isOpen) {
      updatePosition();
      // Also update on scroll/resize
      window.addEventListener('scroll', updatePosition, { passive: true });
      window.addEventListener('resize', updatePosition, { passive: true });
      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen, updatePosition]);

  // Handle click outside
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current && 
        !triggerRef.current.contains(target) &&
        panelRef.current &&
        !panelRef.current.contains(target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Handle mouse enter on trigger
  const handleTriggerEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = undefined;
    }
    if (!isOpen) {
      updatePosition();
      onToggle();
    }
  };

  // Handle mouse leave from trigger
  const handleTriggerLeave = () => {
    closeTimerRef.current = window.setTimeout(onClose, 150);
  };

  // Handle mouse enter on panel
  const handlePanelEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = undefined;
    }
  };

  // Handle mouse leave from panel
  const handlePanelLeave = () => {
    closeTimerRef.current = window.setTimeout(onClose, 150);
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

  // Panel width based on variant
  const panelWidth = variant === 'grid' ? 540 : 288;

  return (
    <>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={onToggle}
        onMouseEnter={handleTriggerEnter}
        onMouseLeave={handleTriggerLeave}
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

      {/* Dropdown Panel - Rendered via Portal */}
      <DropdownPortal isOpen={isOpen}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              onMouseEnter={handlePanelEnter}
              onMouseLeave={handlePanelLeave}
              className={cn(
                'bg-slate-800 rounded-2xl border border-slate-600',
                'shadow-2xl shadow-black/50 overflow-hidden'
              )}
              style={{
                position: 'fixed',
                top: panelPosition.top,
                right: panelPosition.right,
                width: panelWidth,
                pointerEvents: 'auto',
                zIndex: 10000,
              }}
              role="menu"
              dir="rtl"
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
                        className="w-4 h-4 opacity-0 translate-x-1 group-hover:opacity-70 group-hover:translate-x-0 transition-all duration-200 text-primary" 
                      />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DropdownPortal>
    </>
  );
}
