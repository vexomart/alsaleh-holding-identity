/**
 * DropdownPortal - Enterprise-grade Portal for Dropdowns
 * Renders dropdowns outside DOM hierarchy to avoid:
 * - overflow: hidden clipping
 * - transform stacking context issues
 * - z-index conflicts
 */

import * as React from 'react';
import { createPortal } from 'react-dom';

interface DropdownPortalProps {
  children: React.ReactNode;
  isOpen: boolean;
}

export function DropdownPortal({ children, isOpen }: DropdownPortalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Don't render if not mounted or not open
  if (!mounted || !isOpen) return null;

  // Render to document.body to escape all containers
  return createPortal(
    <div 
      className="dropdown-portal-root" 
      dir="rtl"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      {children}
    </div>,
    document.body
  );
}
