/**
 * UnifiedSidebar - V3 Collapsible Sidebar
 * Light Theme - Modern SaaS Style
 * RTL-First Arabic Native
 */

import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  ChevronLeft, 
  ChevronRight,
  X
} from 'lucide-react';
import '@/styles/v3/light-theme.css';

export interface SidebarNavItem {
  id: string;
  labelAr: string;
  labelEn: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  badgeVariant?: 'default' | 'success' | 'warning' | 'danger';
}

export interface SidebarNavGroup {
  id: string;
  labelAr: string;
  labelEn: string;
  items: SidebarNavItem[];
}

export interface UnifiedSidebarProps {
  groups: SidebarNavGroup[];
  logo?: React.ReactNode;
  footer?: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const UnifiedSidebar: React.FC<UnifiedSidebarProps> = ({
  groups,
  logo,
  footer,
  isExpanded,
  onToggle,
  mobileOpen = false,
  onMobileClose,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isRTL, language } = useLanguage();
  const isMobile = useIsMobile();
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === '/adminash' || href === '/portal') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const getLabel = (item: { labelAr: string; labelEn: string }) => 
    language === 'ar' ? item.labelAr : item.labelEn;

  const handleNavClick = (href: string) => {
    navigate(href);
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="v3-sidebar-header" style={{ flexDirection: 'row-reverse' }}>
        {isMobile && mobileOpen && (
          <button
            className="v3-sidebar-toggle"
            onClick={onMobileClose}
          >
            <X size={20} />
          </button>
        )}
        {logo || (
          <button
            className="v3-sidebar-toggle"
            onClick={onToggle}
            title={isExpanded ? 'طي القائمة' : 'توسيع القائمة'}
          >
            {/* In RTL: ChevronRight collapses (moves right), ChevronLeft expands (moves left) */}
            {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        )}
      </div>

      {/* Navigation Content */}
      <div className="v3-sidebar-content">
        {groups.map((group) => (
          <div key={group.id} className="v3-nav-group">
            <div className="v3-nav-group-label">
              {getLabel(group)}
            </div>
            {group.items.map((item) => {
              const active = isActive(item.href);
              const hovered = hoveredItem === item.id;
              
              return (
                <div
                  key={item.id}
                  className={cn(
                    'v3-nav-item',
                    active && 'active'
                  )}
                  onClick={() => handleNavClick(item.href)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  title={!isExpanded && !isMobile ? getLabel(item) : undefined}
                  style={{ flexDirection: 'row' }} /* Icon first, then text */
                >
                  <span className="v3-nav-item-icon">
                    {item.icon}
                  </span>
                  <span className="v3-nav-item-label">
                    {getLabel(item)}
                  </span>
                  {item.badge !== undefined && item.badge > 0 && isExpanded && (
                    <span 
                      className="v3-nav-badge"
                      style={{
                        background: item.badgeVariant === 'success' 
                          ? 'hsl(var(--v3-success))'
                          : item.badgeVariant === 'warning'
                          ? 'hsl(var(--v3-warning))'
                          : item.badgeVariant === 'danger'
                          ? 'hsl(var(--v3-error))'
                          : 'hsl(var(--v3-brand-primary))',
                        marginInlineStart: 'auto',
                      }}
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      {footer && (
        <div className="v3-sidebar-footer">
          {footer}
        </div>
      )}
    </>
  );

  // Mobile: Fixed sidebar with overlay
  if (isMobile) {
    return (
      <>
        <aside
          className={cn(
            'v3-sidebar expanded',
            mobileOpen ? 'open' : ''
          )}
          style={{
            position: 'fixed',
            insetInlineStart: 0,
            top: 0,
            transform: mobileOpen 
              ? 'translateX(0)' 
              : isRTL 
                ? 'translateX(100%)' 
                : 'translateX(-100%)',
            transition: 'transform 300ms cubic-bezier(0.33, 1, 0.68, 1)',
            width: 'var(--v3-sidebar-expanded)',
          }}
        >
          {sidebarContent}
        </aside>
        {mobileOpen && (
          <div 
            className="v3-sidebar-overlay"
            onClick={onMobileClose}
            style={{
              opacity: 1,
              pointerEvents: 'auto',
            }}
          />
        )}
      </>
    );
  }

  // Desktop: Collapsible sidebar
  return (
    <aside 
      className={cn(
        'v3-sidebar',
        isExpanded && 'expanded'
      )}
    >
      {sidebarContent}
    </aside>
  );
};

UnifiedSidebar.displayName = 'UnifiedSidebar';
