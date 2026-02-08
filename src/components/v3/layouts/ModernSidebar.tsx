/**
 * ModernSidebar - V3 Collapsible Sidebar
 * Stripe/Notion Inspired - Clean & Minimal
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
  X,
  Layers
} from 'lucide-react';
import '@/styles/v3/modern-theme.css';

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

export interface ModernSidebarProps {
  groups: SidebarNavGroup[];
  logo?: React.ReactNode;
  footer?: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const ModernSidebar: React.FC<ModernSidebarProps> = ({
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

  const getBadgeColor = (variant?: string) => {
    switch (variant) {
      case 'success': return 'hsl(var(--modern-success))';
      case 'warning': return 'hsl(var(--modern-warning))';
      case 'danger': return 'hsl(var(--modern-error))';
      default: return 'hsl(var(--modern-brand-primary))';
    }
  };

  const sidebarContent = (
    <>
      {/* Header with Logo/Toggle */}
      <div className="modern-sidebar-header">
        {isMobile && mobileOpen ? (
          <button
            className="modern-sidebar-toggle"
            onClick={onMobileClose}
            aria-label="إغلاق القائمة"
          >
            <X size={20} />
          </button>
        ) : (
          <div className="flex items-center gap-3 w-full justify-center">
            {isExpanded && (
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ 
                    background: 'hsl(var(--modern-brand-primary) / 0.1)',
                    color: 'hsl(var(--modern-brand-primary))'
                  }}
                >
                  <Layers size={18} />
                </div>
                <span 
                  className="font-bold text-sm tracking-wide"
                  style={{ color: 'hsl(var(--modern-text-primary))' }}
                  dir="ltr"
                >
                  ASH HOLDING
                </span>
              </div>
            )}
            {!isMobile && (
              <button
                className="modern-sidebar-toggle ms-auto"
                onClick={onToggle}
                title={isExpanded ? 'طي القائمة' : 'توسيع القائمة'}
              >
                {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Navigation Content */}
      <div className="modern-sidebar-content modern-scrollbar">
        {groups.map((group) => (
          <div key={group.id} className="modern-nav-group">
            {isExpanded && (
              <div className="modern-nav-group-label">
                {getLabel(group)}
              </div>
            )}
            {group.items.map((item) => {
              const active = isActive(item.href);
              
              return (
                <div
                  key={item.id}
                  className={cn(
                    'modern-nav-item',
                    active && 'active'
                  )}
                  onClick={() => handleNavClick(item.href)}
                  title={!isExpanded && !isMobile ? getLabel(item) : undefined}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleNavClick(item.href);
                    }
                  }}
                >
                  <span className="modern-nav-item-icon">
                    {item.icon}
                  </span>
                  {isExpanded && (
                    <>
                      <span className="modern-nav-item-label">
                        {getLabel(item)}
                      </span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span 
                          className="modern-nav-badge"
                          style={{ background: getBadgeColor(item.badgeVariant) }}
                        >
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      {footer && isExpanded && (
        <div className="modern-sidebar-footer">
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
            'modern-sidebar expanded',
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
            transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            width: 'var(--modern-sidebar-expanded)',
            zIndex: 50,
          }}
        >
          {sidebarContent}
        </aside>
        {mobileOpen && (
          <div 
            className="modern-sidebar-overlay"
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
        'modern-sidebar',
        isExpanded && 'expanded'
      )}
    >
      {sidebarContent}
    </aside>
  );
};

ModernSidebar.displayName = 'ModernSidebar';
