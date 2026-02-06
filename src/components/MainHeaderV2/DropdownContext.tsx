/**
 * Dropdown Context - Centralized State Management
 * 
 * Features:
 * - Single source of truth for all dropdowns
 * - Auto-close on route change
 * - ESC key handler
 * - Click outside handler
 * - No hover logic at all
 */

import * as React from 'react';
import { useLocation } from 'react-router-dom';

interface DropdownContextValue {
  activeDropdown: string | null;
  openDropdown: (id: string) => void;
  closeDropdown: () => void;
  toggleDropdown: (id: string) => void;
  registerDropdown: (id: string, triggerRef: React.RefObject<HTMLElement>, panelRef: React.RefObject<HTMLElement>) => void;
  unregisterDropdown: (id: string) => void;
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

interface DropdownRefs {
  trigger: React.RefObject<HTMLElement>;
  panel: React.RefObject<HTMLElement>;
}

export function DropdownProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const dropdownRefs = React.useRef<Map<string, DropdownRefs>>(new Map());

  // Open specific dropdown
  const openDropdown = React.useCallback((id: string) => {
    setActiveDropdown(id);
  }, []);

  // Close all dropdowns
  const closeDropdown = React.useCallback(() => {
    setActiveDropdown(null);
  }, []);

  // Toggle dropdown
  const toggleDropdown = React.useCallback((id: string) => {
    setActiveDropdown(prev => prev === id ? null : id);
  }, []);

  // Register dropdown refs
  const registerDropdown = React.useCallback((
    id: string, 
    triggerRef: React.RefObject<HTMLElement>, 
    panelRef: React.RefObject<HTMLElement>
  ) => {
    dropdownRefs.current.set(id, { trigger: triggerRef, panel: panelRef });
  }, []);

  // Unregister dropdown
  const unregisterDropdown = React.useCallback((id: string) => {
    dropdownRefs.current.delete(id);
  }, []);

  // Close on route change
  React.useEffect(() => {
    closeDropdown();
  }, [location.pathname, closeDropdown]);

  // ESC key handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeDropdown) {
        e.preventDefault();
        closeDropdown();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeDropdown, closeDropdown]);

  // Click outside handler
  React.useEffect(() => {
    if (!activeDropdown) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const refs = dropdownRefs.current.get(activeDropdown);
      
      if (!refs) return;

      // Check if click is inside trigger or panel
      const isInsideTrigger = refs.trigger.current?.contains(target);
      const isInsidePanel = refs.panel.current?.contains(target);

      if (!isInsideTrigger && !isInsidePanel) {
        closeDropdown();
      }
    };

    // Use mousedown for immediate response
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown, closeDropdown]);

  const value = React.useMemo(() => ({
    activeDropdown,
    openDropdown,
    closeDropdown,
    toggleDropdown,
    registerDropdown,
    unregisterDropdown,
  }), [activeDropdown, openDropdown, closeDropdown, toggleDropdown, registerDropdown, unregisterDropdown]);

  return (
    <DropdownContext.Provider value={value}>
      {children}
    </DropdownContext.Provider>
  );
}

export function useDropdown() {
  const context = React.useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdown must be used within DropdownProvider');
  }
  return context;
}
