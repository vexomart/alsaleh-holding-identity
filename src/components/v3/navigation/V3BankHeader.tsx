/**
 * V3 Bank Header - Customer Top Bar
 * 100% Custom - NO SHADCN
 * RTL-First Arabic Native
 */

import * as React from 'react';

export interface V3BankHeaderProps {
  greeting?: string;
  userName?: string;
  customerId?: string;
  isVerified?: boolean;
  balance?: number;
  actions?: React.ReactNode;
  notifications?: number;
  onNotifications?: () => void;
  onProfile?: () => void;
  onHelp?: () => void;
  language: 'ar' | 'en';
}

// Icon Components
const BellIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
  </svg>
);

const HelpIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
  </svg>
);

const VerifiedIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

const ChevronDownIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const styles = {
  header: (): React.CSSProperties => ({
    height: '4.5rem',
    background: 'hsl(var(--bank-bg-card))',
    borderBottom: '1px solid hsl(var(--bank-border-light))',
    boxShadow: 'var(--bank-shadow-sm)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 var(--v3-space-6)',
    gap: 'var(--v3-space-6)',
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

  greeting: (): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--v3-space-1)',
  }),

  greetingText: (): React.CSSProperties => ({
    fontSize: 'var(--v3-text-sm)',
    color: 'hsl(var(--bank-text-muted))',
    fontWeight: 400,
  }),

  userName: (): React.CSSProperties => ({
    fontSize: 'var(--v3-text-xl)',
    fontWeight: 700,
    color: 'hsl(var(--bank-text-primary))',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--v3-space-2)',
  }),

  verifiedBadge: (): React.CSSProperties => ({
    color: 'hsl(var(--bank-success))',
    display: 'inline-flex',
  }),

  customerIdBadge: (): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: 'var(--v3-space-1) var(--v3-space-3)',
    background: 'hsl(var(--bank-bg-accent))',
    borderRadius: 'var(--v3-radius-full)',
    fontSize: 'var(--v3-text-xs)',
    fontFamily: 'var(--v3-font-mono)',
    color: 'hsl(var(--bank-text-secondary))',
    fontWeight: 500,
    direction: 'ltr' as const,
  }),

  centerSection: (): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),

  balanceCard: (): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: 'var(--v3-space-3) var(--v3-space-6)',
    background: 'linear-gradient(135deg, hsl(var(--bank-brand-primary)), hsl(222 55% 32%))',
    borderRadius: 'var(--v3-radius-xl)',
    color: 'white',
    minWidth: '180px',
  }),

  balanceLabel: (): React.CSSProperties => ({
    fontSize: 'var(--v3-text-xs)',
    opacity: 0.8,
    fontWeight: 400,
  }),

  balanceAmount: (): React.CSSProperties => ({
    fontSize: 'var(--v3-text-2xl)',
    fontWeight: 700,
    fontFamily: 'var(--v3-font-mono)',
    direction: 'ltr' as const,
  }),

  rightSection: (): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--v3-space-2)',
  }),

  iconButton: (): React.CSSProperties => ({
    width: '2.75rem',
    height: '2.75rem',
    borderRadius: 'var(--v3-radius-xl)',
    border: '1px solid hsl(var(--bank-border-light))',
    background: 'hsl(var(--bank-bg-card))',
    color: 'hsl(var(--bank-text-secondary))',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    transition: 'all var(--v3-duration-normal) var(--v3-ease-out)',
    boxShadow: 'var(--bank-shadow-sm)',
  }),

  notificationDot: (): React.CSSProperties => ({
    position: 'absolute' as const,
    top: '0.5rem',
    insetInlineEnd: '0.5rem',
    width: '0.625rem',
    height: '0.625rem',
    background: 'hsl(var(--bank-error))',
    borderRadius: 'var(--v3-radius-full)',
    border: '2px solid hsl(var(--bank-bg-card))',
  }),

  profileButton: (): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--v3-space-3)',
    padding: 'var(--v3-space-2) var(--v3-space-4)',
    background: 'hsl(var(--bank-bg-accent))',
    border: '1px solid hsl(var(--bank-border-light))',
    borderRadius: 'var(--v3-radius-xl)',
    cursor: 'pointer',
    transition: 'all var(--v3-duration-normal) var(--v3-ease-out)',
    fontFamily: 'var(--v3-font-ar)',
  }),

  avatar: (): React.CSSProperties => ({
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: 'var(--v3-radius-xl)',
    background: 'linear-gradient(135deg, hsl(var(--bank-brand-secondary)), hsl(172 60% 28%))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'var(--v3-text-base)',
    fontWeight: 600,
    color: 'white',
  }),

  profileInfo: (): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    textAlign: 'start' as const,
  }),

  profileName: (): React.CSSProperties => ({
    fontSize: 'var(--v3-text-sm)',
    fontWeight: 600,
    color: 'hsl(var(--bank-text-primary))',
    lineHeight: 1.2,
  }),

  profileId: (): React.CSSProperties => ({
    fontSize: 'var(--v3-text-xs)',
    color: 'hsl(var(--bank-text-muted))',
    fontFamily: 'var(--v3-font-mono)',
    direction: 'ltr' as const,
    lineHeight: 1.2,
  }),
};

export const V3BankHeader: React.FC<V3BankHeaderProps> = ({
  greeting,
  userName,
  customerId,
  isVerified,
  balance,
  actions,
  notifications = 0,
  onNotifications,
  onProfile,
  onHelp,
  language,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <header style={styles.header()}>
      {/* Left Section - Greeting */}
      <div style={styles.leftSection()}>
        <div style={styles.greeting()}>
          {greeting && (
            <span style={styles.greetingText()}>{greeting}</span>
          )}
          <div style={styles.userName()}>
            <span>{userName || (language === 'ar' ? 'مرحباً' : 'Welcome')}</span>
            {isVerified && (
              <span style={styles.verifiedBadge()} title={language === 'ar' ? 'حساب موثق' : 'Verified Account'}>
                <VerifiedIcon />
              </span>
            )}
          </div>
        </div>
        {customerId && (
          <span style={styles.customerIdBadge()}>
            {customerId}
          </span>
        )}
      </div>

      {/* Center Section - Balance Card */}
      {balance !== undefined && (
        <div style={styles.centerSection()}>
          <div style={styles.balanceCard()}>
            <span style={styles.balanceLabel()}>
              {language === 'ar' ? 'رصيدك الحالي' : 'Available Balance'}
            </span>
            <span style={styles.balanceAmount()}>
              {formatCurrency(balance)}
            </span>
          </div>
        </div>
      )}

      {/* Right Section - Actions */}
      <div style={styles.rightSection()}>
        {/* Custom Actions */}
        {actions}

        {/* Help Button */}
        <button
          style={styles.iconButton()}
          onClick={onHelp}
          title={language === 'ar' ? 'المساعدة' : 'Help'}
        >
          <HelpIcon />
        </button>

        {/* Notifications */}
        <button
          style={styles.iconButton()}
          onClick={onNotifications}
          title={language === 'ar' ? 'الإشعارات' : 'Notifications'}
        >
          <BellIcon />
          {notifications > 0 && <span style={styles.notificationDot()} />}
        </button>

        {/* Profile Button */}
        <button style={styles.profileButton()} onClick={onProfile}>
          <div style={styles.avatar()}>
            {userName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div style={styles.profileInfo()}>
            <span style={styles.profileName()}>
              {userName || (language === 'ar' ? 'المستخدم' : 'User')}
            </span>
            {customerId && (
              <span style={styles.profileId()}>{customerId}</span>
            )}
          </div>
          <ChevronDownIcon />
        </button>
      </div>
    </header>
  );
};

V3BankHeader.displayName = 'V3BankHeader';
