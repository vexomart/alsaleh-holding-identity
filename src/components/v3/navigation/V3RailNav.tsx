/**
 * V3 Rail Navigation - Collapsible Icon Rail
 * 100% Custom - NO SHADCN
 * RTL-First Arabic Native
 */

import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface RailNavItem {
  id: string;
  labelAr: string;
  labelEn: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  badgeVariant?: 'default' | 'success' | 'warning' | 'danger';
}

export interface RailNavGroup {
  id: string;
  labelAr: string;
  labelEn: string;
  items: RailNavItem[];
}

export interface V3RailNavProps {
  context: 'command' | 'bank';
  groups: RailNavGroup[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  language: 'ar' | 'en';
}

const styles = {
  rail: (context: 'command' | 'bank', isExpanded: boolean): React.CSSProperties => ({
    width: isExpanded ? 'var(--rail-width-expanded)' : 'var(--rail-width-collapsed)',
    height: '100vh',
    position: 'sticky' as const,
    top: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    background: context === 'command' 
      ? 'linear-gradient(180deg, hsl(var(--cmd-bg-panel)) 0%, hsl(var(--cmd-bg-deep)) 100%)'
      : 'hsl(var(--bank-bg-card))',
    borderInlineEnd: context === 'command'
      ? '1px solid hsl(var(--cmd-border-subtle))'
      : '1px solid hsl(var(--bank-border-light))',
    transition: 'width 250ms cubic-bezier(0.33, 1, 0.68, 1)',
    overflow: 'hidden',
    zIndex: 1000,
    fontFamily: 'var(--v3-font-ar)',
  }),

  header: (context: 'command' | 'bank'): React.CSSProperties => ({
    padding: 'var(--v3-space-4)',
    borderBottom: context === 'command'
      ? '1px solid hsl(var(--cmd-border-subtle))'
      : '1px solid hsl(var(--bank-border-light))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '4rem',
  }),

  content: (): React.CSSProperties => ({
    flex: 1,
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
    padding: 'var(--v3-space-2)',
  }),

  group: (isExpanded: boolean): React.CSSProperties => ({
    marginBottom: 'var(--v3-space-4)',
  }),

  groupLabel: (context: 'command' | 'bank', isExpanded: boolean): React.CSSProperties => ({
    fontSize: 'var(--v3-text-xs)',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    color: context === 'command'
      ? 'hsl(var(--cmd-text-dim))'
      : 'hsl(var(--bank-text-muted))',
    padding: isExpanded ? 'var(--v3-space-2) var(--v3-space-3)' : 'var(--v3-space-2)',
    display: isExpanded ? 'block' : 'none',
    marginBottom: 'var(--v3-space-1)',
  }),

  navItem: (
    context: 'command' | 'bank', 
    isActive: boolean, 
    isExpanded: boolean
  ): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--v3-space-3)',
    padding: isExpanded ? 'var(--v3-space-3) var(--v3-space-4)' : 'var(--v3-space-3)',
    borderRadius: 'var(--v3-radius-lg)',
    cursor: 'pointer',
    transition: 'all var(--v3-duration-normal) var(--v3-ease-out)',
    justifyContent: isExpanded ? 'flex-start' : 'center',
    position: 'relative' as const,
    ...(context === 'command' ? {
      background: isActive 
        ? 'linear-gradient(90deg, hsl(var(--cmd-accent-cyan) / 0.15), transparent)'
        : 'transparent',
      color: isActive 
        ? 'hsl(var(--cmd-accent-cyan))'
        : 'hsl(var(--cmd-text-secondary))',
      borderInlineStart: isActive 
        ? '3px solid hsl(var(--cmd-accent-cyan))'
        : '3px solid transparent',
    } : {
      background: isActive 
        ? 'hsl(var(--bank-brand-primary) / 0.08)'
        : 'transparent',
      color: isActive 
        ? 'hsl(var(--bank-brand-primary))'
        : 'hsl(var(--bank-text-secondary))',
      borderInlineStart: isActive 
        ? '3px solid hsl(var(--bank-brand-primary))'
        : '3px solid transparent',
    }),
  }),

  navIcon: (context: 'command' | 'bank', isActive: boolean): React.CSSProperties => ({
    width: '1.5rem',
    height: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }),

  navLabel: (isExpanded: boolean): React.CSSProperties => ({
    fontSize: 'var(--v3-text-sm)',
    fontWeight: 500,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    opacity: isExpanded ? 1 : 0,
    width: isExpanded ? 'auto' : 0,
    transition: 'opacity 200ms, width 200ms',
  }),

  badge: (context: 'command' | 'bank', variant: string, isExpanded: boolean): React.CSSProperties => {
    const colors: Record<string, string> = context === 'command' ? {
      default: 'hsl(var(--cmd-accent-cyan))',
      success: 'hsl(var(--cmd-accent-green))',
      warning: 'hsl(var(--cmd-accent-amber))',
      danger: 'hsl(var(--cmd-accent-red))',
    } : {
      default: 'hsl(var(--bank-brand-primary))',
      success: 'hsl(var(--bank-success))',
      warning: 'hsl(var(--bank-warning))',
      danger: 'hsl(var(--bank-error))',
    };

    return {
      fontSize: 'var(--v3-text-xs)',
      fontWeight: 600,
      padding: '0.125rem 0.375rem',
      borderRadius: 'var(--v3-radius-full)',
      background: colors[variant],
      color: context === 'command' ? 'hsl(var(--cmd-bg-deep))' : 'white',
      marginInlineStart: 'auto',
      display: isExpanded ? 'inline-flex' : 'none',
    };
  },

  toggleButton: (context: 'command' | 'bank'): React.CSSProperties => ({
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: 'var(--v3-radius-lg)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--v3-duration-normal) var(--v3-ease-out)',
    ...(context === 'command' ? {
      background: 'hsl(var(--cmd-bg-elevated))',
      color: 'hsl(var(--cmd-text-secondary))',
    } : {
      background: 'hsl(var(--bank-bg-accent))',
      color: 'hsl(var(--bank-text-secondary))',
    }),
  }),

  footer: (context: 'command' | 'bank'): React.CSSProperties => ({
    padding: 'var(--v3-space-4)',
    borderTop: context === 'command'
      ? '1px solid hsl(var(--cmd-border-subtle))'
      : '1px solid hsl(var(--bank-border-light))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
};

// Chevron Icon Component
const ChevronIcon: React.FC<{ 
  direction: 'left' | 'right', 
  size?: number 
}> = ({ direction, size = 20 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ 
      transform: direction === 'left' ? 'rotate(180deg)' : 'none',
      transition: 'transform 200ms ease'
    }}
  >
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

export const V3RailNav: React.FC<V3RailNavProps> = ({
  context,
  groups,
  header,
  footer,
  isExpanded,
  onToggle,
  language,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === '/adminash' || href === '/portal') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const getLabel = (item: { labelAr: string; labelEn: string }) => 
    language === 'ar' ? item.labelAr : item.labelEn;

  return (
    <nav style={styles.rail(context, isExpanded)}>
      {/* Header */}
      <div style={styles.header(context)}>
        {header || (
          <button
            style={styles.toggleButton(context)}
            onClick={onToggle}
            title={isExpanded ? 'طي القائمة' : 'توسيع القائمة'}
          >
            <ChevronIcon direction={isExpanded ? 'left' : 'right'} />
          </button>
        )}
      </div>

      {/* Navigation Content */}
      <div style={styles.content()}>
        {groups.map((group) => (
          <div key={group.id} style={styles.group(isExpanded)}>
            <div style={styles.groupLabel(context, isExpanded)}>
              {getLabel(group)}
            </div>
            {group.items.map((item) => {
              const active = isActive(item.href);
              const hovered = hoveredItem === item.id;
              
              return (
                <div
                  key={item.id}
                  style={{
                    ...styles.navItem(context, active, isExpanded),
                    ...(hovered && !active ? {
                      background: context === 'command'
                        ? 'hsl(var(--cmd-bg-hover))'
                        : 'hsl(var(--bank-bg-hover))',
                    } : {}),
                  }}
                  onClick={() => navigate(item.href)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  title={!isExpanded ? getLabel(item) : undefined}
                >
                  <span style={styles.navIcon(context, active)}>
                    {item.icon}
                  </span>
                  <span style={styles.navLabel(isExpanded)}>
                    {getLabel(item)}
                  </span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span style={styles.badge(context, item.badgeVariant || 'default', isExpanded)}>
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
        <div style={styles.footer(context)}>
          {footer}
        </div>
      )}
    </nav>
  );
};

V3RailNav.displayName = 'V3RailNav';
