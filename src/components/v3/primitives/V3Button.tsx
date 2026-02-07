/**
 * V3 Button - 100% Custom Component
 * NO SHADCN - Built from scratch
 * RTL-First Arabic Native
 */

import * as React from 'react';

export interface V3ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  context?: 'command' | 'bank';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
}

const styles = {
  base: `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-family: var(--v3-font-ar);
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all var(--v3-duration-normal) var(--v3-ease-out);
    white-space: nowrap;
    user-select: none;
    outline: none;
    position: relative;
    overflow: hidden;
  `.replace(/\s+/g, ' ').trim(),
  
  // Size variants
  size: {
    sm: 'padding: 0.375rem 0.75rem; font-size: var(--v3-text-sm); border-radius: var(--v3-radius-md); min-height: 2rem;',
    md: 'padding: 0.5rem 1rem; font-size: var(--v3-text-base); border-radius: var(--v3-radius-lg); min-height: 2.5rem;',
    lg: 'padding: 0.75rem 1.5rem; font-size: var(--v3-text-lg); border-radius: var(--v3-radius-xl); min-height: 3rem;',
  },
  
  // Command Center variants
  command: {
    primary: `
      background: linear-gradient(135deg, hsl(var(--cmd-accent-cyan)), hsl(var(--cmd-accent-blue)));
      color: hsl(var(--cmd-bg-deep));
      box-shadow: var(--cmd-glow-cyan);
    `,
    secondary: `
      background: hsl(var(--cmd-bg-elevated));
      color: hsl(var(--cmd-text-primary));
      border: 1px solid hsl(var(--cmd-border-default));
    `,
    ghost: `
      background: transparent;
      color: hsl(var(--cmd-text-secondary));
    `,
    danger: `
      background: hsl(var(--cmd-accent-red) / 0.15);
      color: hsl(var(--cmd-accent-red));
      border: 1px solid hsl(var(--cmd-accent-red) / 0.3);
    `,
    success: `
      background: hsl(var(--cmd-accent-green) / 0.15);
      color: hsl(var(--cmd-accent-green));
      border: 1px solid hsl(var(--cmd-accent-green) / 0.3);
    `,
  },
  
  // Banking Portal variants
  bank: {
    primary: `
      background: linear-gradient(135deg, hsl(var(--bank-brand-primary)), hsl(222 55% 32%));
      color: white;
      box-shadow: var(--bank-shadow-md);
    `,
    secondary: `
      background: hsl(var(--bank-bg-card));
      color: hsl(var(--bank-text-primary));
      border: 1px solid hsl(var(--bank-border-default));
      box-shadow: var(--bank-shadow-sm);
    `,
    ghost: `
      background: transparent;
      color: hsl(var(--bank-text-secondary));
    `,
    danger: `
      background: hsl(var(--bank-error) / 0.1);
      color: hsl(var(--bank-error));
      border: 1px solid hsl(var(--bank-error) / 0.2);
    `,
    success: `
      background: hsl(var(--bank-success) / 0.1);
      color: hsl(var(--bank-success));
      border: 1px solid hsl(var(--bank-success) / 0.2);
    `,
  },
  
  disabled: 'opacity: 0.5; cursor: not-allowed; pointer-events: none;',
  loading: 'cursor: wait;',
};

export const V3Button = React.forwardRef<HTMLButtonElement, V3ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    context = 'command',
    loading = false,
    icon,
    iconPosition = 'start',
    disabled,
    children,
    style,
    ...props 
  }, ref) => {
    const computedStyle: React.CSSProperties = {
      ...Object.fromEntries(
        styles.base.split(';')
          .filter(Boolean)
          .map(s => s.split(':').map(p => p.trim()))
          .filter(([k]) => k)
      ),
      ...Object.fromEntries(
        styles.size[size].split(';')
          .filter(Boolean)
          .map(s => s.split(':').map(p => p.trim()))
          .filter(([k]) => k)
      ),
      ...Object.fromEntries(
        styles[context][variant].replace(/\s+/g, ' ').trim().split(';')
          .filter(Boolean)
          .map(s => s.split(':').map(p => p.trim()))
          .filter(([k]) => k)
      ),
      ...(disabled ? Object.fromEntries(
        styles.disabled.split(';')
          .filter(Boolean)
          .map(s => s.split(':').map(p => p.trim()))
          .filter(([k]) => k)
      ) : {}),
      ...(loading ? Object.fromEntries(
        styles.loading.split(';')
          .filter(Boolean)
          .map(s => s.split(':').map(p => p.trim()))
          .filter(([k]) => k)
      ) : {}),
      ...style,
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        style={computedStyle}
        {...props}
      >
        {loading && (
          <svg 
            style={{ 
              width: '1em', 
              height: '1em', 
              animation: 'spin 1s linear infinite' 
            }}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="32"
              strokeDashoffset="12"
            />
          </svg>
        )}
        {icon && iconPosition === 'start' && !loading && icon}
        {children}
        {icon && iconPosition === 'end' && icon}
      </button>
    );
  }
);

V3Button.displayName = 'V3Button';
