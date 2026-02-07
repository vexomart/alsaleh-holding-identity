/**
 * V3 Command Header - Admin Top Bar
 * 100% Custom - NO SHADCN
 * RTL-First Arabic Native
 */

import * as React from 'react';
import { V3Badge } from '../primitives/V3Badge';

export interface V3CommandHeaderProps {
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  notifications?: number;
  onSearch?: () => void;
  onNotifications?: () => void;
  onProfile?: () => void;
  language: 'ar' | 'en';
}

// Icon Components
const SearchIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

const BellIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
  </svg>
);

const ActivityIcon: React.FC<{ size?: number }> = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
);

const styles = {
  header: (): React.CSSProperties => ({
    height: '3.5rem',
    background: 'hsl(var(--cmd-bg-panel))',
    borderBottom: '1px solid hsl(var(--cmd-border-subtle))',
    display: 'flex',
    alignItems: 'center',
    padding: '0 var(--v3-space-6)',
    gap: 'var(--v3-space-4)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
    fontFamily: 'var(--v3-font-ar)',
  }),

  leftSection: (): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--v3-space-4)',
    flex: 1,
  }),

  title: (): React.CSSProperties => ({
    fontSize: 'var(--v3-text-lg)',
    fontWeight: 600,
    color: 'hsl(var(--cmd-text-primary))',
    margin: 0,
  }),

  breadcrumbs: (): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--v3-space-2)',
    fontSize: 'var(--v3-text-sm)',
    color: 'hsl(var(--cmd-text-muted))',
  }),

  breadcrumbSeparator: (): React.CSSProperties => ({
    color: 'hsl(var(--cmd-text-dim))',
  }),

  breadcrumbItem: (isLast: boolean): React.CSSProperties => ({
    color: isLast ? 'hsl(var(--cmd-text-primary))' : 'hsl(var(--cmd-text-muted))',
    fontWeight: isLast ? 500 : 400,
    cursor: isLast ? 'default' : 'pointer',
    transition: 'color var(--v3-duration-fast)',
  }),

  statusIndicator: (): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--v3-space-2)',
    padding: 'var(--v3-space-2) var(--v3-space-3)',
    background: 'hsl(var(--cmd-accent-green) / 0.1)',
    borderRadius: 'var(--v3-radius-full)',
    fontSize: 'var(--v3-text-xs)',
    color: 'hsl(var(--cmd-accent-green))',
    fontWeight: 500,
  }),

  rightSection: (): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--v3-space-2)',
  }),

  iconButton: (hasNotification?: boolean): React.CSSProperties => ({
    width: '2.25rem',
    height: '2.25rem',
    borderRadius: 'var(--v3-radius-lg)',
    border: 'none',
    background: 'transparent',
    color: 'hsl(var(--cmd-text-secondary))',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    transition: 'all var(--v3-duration-normal) var(--v3-ease-out)',
  }),

  notificationDot: (): React.CSSProperties => ({
    position: 'absolute' as const,
    top: '0.25rem',
    insetInlineEnd: '0.25rem',
    width: '0.5rem',
    height: '0.5rem',
    background: 'hsl(var(--cmd-accent-red))',
    borderRadius: 'var(--v3-radius-full)',
    border: '2px solid hsl(var(--cmd-bg-panel))',
  }),

  searchButton: (): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--v3-space-2)',
    padding: 'var(--v3-space-2) var(--v3-space-3)',
    background: 'hsl(var(--cmd-bg-card))',
    border: '1px solid hsl(var(--cmd-border-subtle))',
    borderRadius: 'var(--v3-radius-lg)',
    color: 'hsl(var(--cmd-text-muted))',
    cursor: 'pointer',
    fontSize: 'var(--v3-text-sm)',
    transition: 'all var(--v3-duration-normal) var(--v3-ease-out)',
    fontFamily: 'var(--v3-font-ar)',
  }),

  kbd: (): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.125rem 0.375rem',
    background: 'hsl(var(--cmd-bg-elevated))',
    borderRadius: 'var(--v3-radius-sm)',
    fontSize: 'var(--v3-text-xs)',
    fontFamily: 'var(--v3-font-mono)',
    color: 'hsl(var(--cmd-text-dim))',
    marginInlineStart: 'var(--v3-space-4)',
  }),

  userButton: (): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--v3-space-3)',
    padding: 'var(--v3-space-2) var(--v3-space-3)',
    background: 'transparent',
    border: 'none',
    borderRadius: 'var(--v3-radius-lg)',
    cursor: 'pointer',
    transition: 'all var(--v3-duration-normal) var(--v3-ease-out)',
  }),

  avatar: (): React.CSSProperties => ({
    width: '2rem',
    height: '2rem',
    borderRadius: 'var(--v3-radius-lg)',
    background: 'linear-gradient(135deg, hsl(var(--cmd-accent-cyan)), hsl(var(--cmd-accent-blue)))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'var(--v3-text-sm)',
    fontWeight: 600,
    color: 'hsl(var(--cmd-bg-deep))',
  }),

  userInfo: (): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    textAlign: 'start' as const,
  }),

  userName: (): React.CSSProperties => ({
    fontSize: 'var(--v3-text-sm)',
    fontWeight: 500,
    color: 'hsl(var(--cmd-text-primary))',
    lineHeight: 1.2,
  }),

  userRole: (): React.CSSProperties => ({
    fontSize: 'var(--v3-text-xs)',
    color: 'hsl(var(--cmd-text-muted))',
    lineHeight: 1.2,
  }),
};

export const V3CommandHeader: React.FC<V3CommandHeaderProps> = ({
  title,
  breadcrumbs,
  actions,
  user,
  notifications = 0,
  onSearch,
  onNotifications,
  onProfile,
  language,
}) => {
  const [searchHovered, setSearchHovered] = React.useState(false);

  return (
    <header style={styles.header()}>
      {/* Left Section */}
      <div style={styles.leftSection()}>
        {/* Breadcrumbs or Title */}
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav style={styles.breadcrumbs()}>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <span style={styles.breadcrumbSeparator()}>/</span>
                )}
                <span style={styles.breadcrumbItem(index === breadcrumbs.length - 1)}>
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </nav>
        ) : title && (
          <h1 style={styles.title()}>{title}</h1>
        )}

        {/* Live Status Indicator */}
        <div style={styles.statusIndicator()}>
          <ActivityIcon />
          <span>{language === 'ar' ? 'مباشر' : 'LIVE'}</span>
        </div>
      </div>

      {/* Right Section */}
      <div style={styles.rightSection()}>
        {/* Custom Actions */}
        {actions}

        {/* Search Button */}
        <button
          style={{
            ...styles.searchButton(),
            ...(searchHovered ? {
              background: 'hsl(var(--cmd-bg-elevated))',
              borderColor: 'hsl(var(--cmd-border-default))',
            } : {}),
          }}
          onClick={onSearch}
          onMouseEnter={() => setSearchHovered(true)}
          onMouseLeave={() => setSearchHovered(false)}
        >
          <SearchIcon />
          <span>{language === 'ar' ? 'بحث...' : 'Search...'}</span>
          <kbd style={styles.kbd()}>⌘K</kbd>
        </button>

        {/* Notifications */}
        <button
          style={styles.iconButton(notifications > 0)}
          onClick={onNotifications}
        >
          <BellIcon />
          {notifications > 0 && <span style={styles.notificationDot()} />}
        </button>

        {/* User Menu */}
        {user && (
          <button style={styles.userButton()} onClick={onProfile}>
            <div style={styles.avatar()}>
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} 
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div style={styles.userInfo()}>
              <span style={styles.userName()}>{user.name}</span>
              <span style={styles.userRole()}>{user.role}</span>
            </div>
          </button>
        )}
      </div>
    </header>
  );
};

V3CommandHeader.displayName = 'V3CommandHeader';
