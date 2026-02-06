/**
 * HeaderDropdown - Click-Only Enterprise Dropdown
 * 
 * Architecture:
 * - Click to open/close (NO hover)
 * - Portal rendering (outside header DOM)
 * - Always in DOM after mount (visibility via CSS)
 * - RTL native
 * - 60fps animations
 * - Zero flickering guaranteed
 */

import * as React from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavLink } from './MainHeaderV2.data';
import { useDropdown } from './DropdownContext';
import { navStyles, dropdownStyles as s } from './MainHeaderV2.styles';

interface HeaderDropdownProps {
  id: string;
  label: string;
  items: NavLink[];
  variant?: 'grid' | 'list';
}

export function HeaderDropdown({
  id,
  label,
  items,
  variant = 'grid',
}: HeaderDropdownProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeDropdown, toggleDropdown, closeDropdown, registerDropdown, unregisterDropdown } = useDropdown();
  
  // Refs
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  
  // Mount state (ensures portal only renders client-side)
  const [isMounted, setIsMounted] = React.useState(false);
  
  // Position state
  const [position, setPosition] = React.useState({ top: 0, right: 0 });
  
  // Is this dropdown open?
  const isOpen = activeDropdown === id;
  
  // Panel width
  const panelWidth = variant === 'grid' ? 540 : 288;

  // Check active child
  const hasActiveChild = React.useMemo(() => 
    items.some(item => 
      item.href === '/' ? location.pathname === '/' : location.pathname.startsWith(item.href)
    ), [items, location.pathname]
  );

  // Calculate position
  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;
    
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 12,
      right: window.innerWidth - rect.right,
    });
  }, []);

  // Mount effect
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Register with context
  React.useEffect(() => {
    registerDropdown(id, triggerRef, panelRef);
    return () => unregisterDropdown(id);
  }, [id, registerDropdown, unregisterDropdown]);

  // Update position when opening
  React.useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, { passive: true });
      window.addEventListener('resize', updatePosition, { passive: true });
    }
    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  // Handle trigger click
  const handleTriggerClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updatePosition();
    toggleDropdown(id);
  }, [id, toggleDropdown, updatePosition]);

  // Handle navigation
  const handleNavigate = React.useCallback((href: string) => {
    closeDropdown();
    navigate(href);
  }, [closeDropdown, navigate]);

  return (
    <>
      {/* Trigger Button - Click Only */}
      <button
        ref={triggerRef}
        onClick={handleTriggerClick}
        className={cn(
          navStyles.dropdownTrigger,
          (isOpen || hasActiveChild) && navStyles.dropdownTriggerActive
        )}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={`dropdown-${id}`}
      >
        <span>{label}</span>
        <ChevronDown 
          className={cn(
            'w-4 h-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )} 
        />
      </button>

      {/* Portal - Only render after mount */}
      {isMounted && createPortal(
        <div
          ref={panelRef}
          className={cn(
            // Base
            'fixed rounded-2xl overflow-hidden',
            'bg-slate-800 border border-slate-600',
            'shadow-2xl shadow-black/50',
            // Animation (opacity + transform only, no height/reflow)
            'transition-[opacity,transform] duration-200 ease-out',
            'will-change-[opacity,transform]',
            // Visibility control
            isOpen ? [
              'opacity-100',
              'visible',
              'pointer-events-auto',
              'translate-y-0',
            ] : [
              'opacity-0',
              'invisible',
              'pointer-events-none',
              'translate-y-[-8px]',
            ]
          )}
          style={{
            top: position.top,
            right: position.right,
            width: panelWidth,
            zIndex: 99999,
          }}
          dir="rtl"
          role="menu"
          aria-hidden={!isOpen}
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
                  onClick={() => handleNavigate(item.href)}
                  className={cn(s.item, isActive && s.itemActive)}
                  role="menuitem"
                  tabIndex={isOpen ? 0 : -1}
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
        </div>,
        document.body
      )}
    </>
  );
}
