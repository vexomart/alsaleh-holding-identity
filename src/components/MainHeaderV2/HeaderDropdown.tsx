/**
 * MainHeaderV2 - Dropdown Component (Enterprise Rebuild)
 * 
 * Key Architecture Decisions:
 * 1. Dropdown stays in DOM always (no mount/unmount flickering)
 * 2. Visibility controlled via CSS (opacity, visibility, pointer-events)
 * 3. Smart delay system for closing (200ms with cancellation)
 * 4. Portal-based rendering to escape overflow/transform issues
 * 5. RTL-native with proper alignment
 */

import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
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

// Delay constants (in ms)
const CLOSE_DELAY = 200;
const POSITION_UPDATE_THROTTLE = 16; // ~60fps

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
  
  // Refs
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const closeTimerRef = React.useRef<number | null>(null);
  const positionTimerRef = React.useRef<number | null>(null);
  const isMountedRef = React.useRef(false);
  
  // State for position (calculated dynamically)
  const [position, setPosition] = React.useState({ top: 0, right: 0 });
  const [portalReady, setPortalReady] = React.useState(false);

  // Check if any item is active
  const hasActiveChild = React.useMemo(() => 
    items.some(item => 
      item.href === '/' ? location.pathname === '/' : location.pathname.startsWith(item.href)
    ), [items, location.pathname]
  );

  // Panel width based on variant
  const panelWidth = variant === 'grid' ? 540 : 288;

  // ============================================
  // POSITION CALCULATION
  // ============================================
  const calculatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;
    
    const rect = triggerRef.current.getBoundingClientRect();
    const newTop = rect.bottom + 12; // 12px gap
    const newRight = window.innerWidth - rect.right;
    
    setPosition(prev => {
      // Only update if position actually changed (prevents unnecessary re-renders)
      if (prev.top === newTop && prev.right === newRight) return prev;
      return { top: newTop, right: newRight };
    });
  }, []);

  // Throttled position update for scroll/resize
  const throttledPositionUpdate = React.useCallback(() => {
    if (positionTimerRef.current) return;
    
    positionTimerRef.current = window.requestAnimationFrame(() => {
      calculatePosition();
      positionTimerRef.current = null;
    });
  }, [calculatePosition]);

  // ============================================
  // CLOSE DELAY LOGIC (Smart Cancel System)
  // ============================================
  const scheduleClose = React.useCallback(() => {
    // Don't schedule if already scheduled
    if (closeTimerRef.current) return;
    
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      onClose();
    }, CLOSE_DELAY);
  }, [onClose]);

  const cancelClose = React.useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  // ============================================
  // EVENT HANDLERS
  // ============================================
  
  // Trigger hover enter
  const handleTriggerEnter = React.useCallback(() => {
    cancelClose();
    if (!isOpen) {
      calculatePosition();
      onToggle();
    }
  }, [cancelClose, isOpen, calculatePosition, onToggle]);

  // Trigger hover leave
  const handleTriggerLeave = React.useCallback(() => {
    scheduleClose();
  }, [scheduleClose]);

  // Panel hover enter
  const handlePanelEnter = React.useCallback(() => {
    cancelClose();
  }, [cancelClose]);

  // Panel hover leave
  const handlePanelLeave = React.useCallback(() => {
    scheduleClose();
  }, [scheduleClose]);

  // Trigger click (for mobile/touch)
  const handleTriggerClick = React.useCallback(() => {
    cancelClose();
    calculatePosition();
    onToggle();
  }, [cancelClose, calculatePosition, onToggle]);

  // Navigation handler
  const handleNavigate = React.useCallback((href: string) => {
    cancelClose();
    onClose();
    navigate(href);
  }, [cancelClose, onClose, navigate]);

  // ============================================
  // EFFECTS
  // ============================================

  // Portal mount detection
  React.useEffect(() => {
    setPortalReady(true);
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Position tracking when open
  React.useEffect(() => {
    if (!isOpen) return;
    
    // Initial position calculation
    calculatePosition();
    
    // Track scroll and resize
    window.addEventListener('scroll', throttledPositionUpdate, { passive: true });
    window.addEventListener('resize', throttledPositionUpdate, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledPositionUpdate);
      window.removeEventListener('resize', throttledPositionUpdate);
      if (positionTimerRef.current) {
        cancelAnimationFrame(positionTimerRef.current);
      }
    };
  }, [isOpen, calculatePosition, throttledPositionUpdate]);

  // Click outside handler
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      
      // Ignore clicks on trigger or panel
      if (triggerRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      
      onClose();
    };

    // Small delay to prevent immediate close on open click
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Cleanup timers on unmount
  React.useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      if (positionTimerRef.current) cancelAnimationFrame(positionTimerRef.current);
    };
  }, []);

  // ============================================
  // RENDER
  // ============================================

  // Dropdown panel (always in DOM, visibility controlled via CSS)
  const dropdownPanel = portalReady ? createPortal(
    <div
      ref={panelRef}
      onMouseEnter={handlePanelEnter}
      onMouseLeave={handlePanelLeave}
      className={cn(
        // Base styles
        'fixed rounded-2xl overflow-hidden',
        'bg-slate-800 border border-slate-600',
        'shadow-2xl shadow-black/50',
        // Transition for smooth appearance
        'transition-all duration-200 ease-out',
        // Visibility control (no mount/unmount, just CSS)
        isOpen ? [
          'opacity-100',
          'visible',
          'pointer-events-auto',
          'translate-y-0',
          'scale-100',
        ] : [
          'opacity-0',
          'invisible',
          'pointer-events-none',
          'translate-y-[-8px]',
          'scale-[0.98]',
        ]
      )}
      style={{
        top: position.top,
        right: position.right,
        width: panelWidth,
        zIndex: 10000,
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
  ) : null;

  return (
    <>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={handleTriggerClick}
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

      {/* Dropdown Panel (Portal) */}
      {dropdownPanel}
    </>
  );
}
