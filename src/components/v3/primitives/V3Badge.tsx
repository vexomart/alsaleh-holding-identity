/**
 * V3 Badge - 100% Custom Component
 * NO SHADCN - Built from scratch
 * RTL-First Arabic Native
 */

import * as React from 'react';

export interface V3BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  context?: 'command' | 'bank';
  dot?: boolean;
  pulse?: boolean;
}

const getStyles = (
  context: 'command' | 'bank',
  variant: string,
  size: string,
  dot: boolean,
  pulse: boolean
): React.CSSProperties => {
  const sizeMap: Record<string, React.CSSProperties> = {
    sm: {
      fontSize: 'var(--v3-text-xs)',
      padding: dot ? '0' : '0.125rem 0.5rem',
      minWidth: dot ? '0.5rem' : 'auto',
      height: dot ? '0.5rem' : 'auto',
    },
    md: {
      fontSize: 'var(--v3-text-sm)',
      padding: dot ? '0' : '0.25rem 0.625rem',
      minWidth: dot ? '0.625rem' : 'auto',
      height: dot ? '0.625rem' : 'auto',
    },
    lg: {
      fontSize: 'var(--v3-text-base)',
      padding: dot ? '0' : '0.375rem 0.75rem',
      minWidth: dot ? '0.75rem' : 'auto',
      height: dot ? '0.75rem' : 'auto',
    },
  };

  const commandVariants: Record<string, React.CSSProperties> = {
    default: {
      background: 'hsl(var(--cmd-bg-elevated))',
      color: 'hsl(var(--cmd-text-primary))',
      border: '1px solid hsl(var(--cmd-border-default))',
    },
    success: {
      background: 'hsl(var(--cmd-accent-green) / 0.15)',
      color: 'hsl(var(--cmd-accent-green))',
      border: '1px solid hsl(var(--cmd-accent-green) / 0.3)',
    },
    warning: {
      background: 'hsl(var(--cmd-accent-amber) / 0.15)',
      color: 'hsl(var(--cmd-accent-amber))',
      border: '1px solid hsl(var(--cmd-accent-amber) / 0.3)',
    },
    danger: {
      background: 'hsl(var(--cmd-accent-red) / 0.15)',
      color: 'hsl(var(--cmd-accent-red))',
      border: '1px solid hsl(var(--cmd-accent-red) / 0.3)',
    },
    info: {
      background: 'hsl(var(--cmd-accent-cyan) / 0.15)',
      color: 'hsl(var(--cmd-accent-cyan))',
      border: '1px solid hsl(var(--cmd-accent-cyan) / 0.3)',
    },
    neutral: {
      background: 'hsl(var(--cmd-bg-hover))',
      color: 'hsl(var(--cmd-text-muted))',
      border: '1px solid hsl(var(--cmd-border-subtle))',
    },
  };

  const bankVariants: Record<string, React.CSSProperties> = {
    default: {
      background: 'hsl(var(--bank-bg-accent))',
      color: 'hsl(var(--bank-text-primary))',
      border: '1px solid hsl(var(--bank-border-default))',
    },
    success: {
      background: 'hsl(var(--bank-success) / 0.1)',
      color: 'hsl(var(--bank-success))',
      border: '1px solid hsl(var(--bank-success) / 0.2)',
    },
    warning: {
      background: 'hsl(var(--bank-warning) / 0.1)',
      color: 'hsl(var(--bank-warning))',
      border: '1px solid hsl(var(--bank-warning) / 0.2)',
    },
    danger: {
      background: 'hsl(var(--bank-error) / 0.1)',
      color: 'hsl(var(--bank-error))',
      border: '1px solid hsl(var(--bank-error) / 0.2)',
    },
    info: {
      background: 'hsl(var(--bank-info) / 0.1)',
      color: 'hsl(var(--bank-info))',
      border: '1px solid hsl(var(--bank-info) / 0.2)',
    },
    neutral: {
      background: 'hsl(var(--bank-bg-hover))',
      color: 'hsl(var(--bank-text-muted))',
      border: '1px solid hsl(var(--bank-border-light))',
    },
  };

  const variantStyles = context === 'command' ? commandVariants : bankVariants;

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--v3-font-ar)',
    fontWeight: 500,
    borderRadius: dot ? 'var(--v3-radius-full)' : 'var(--v3-radius-md)',
    whiteSpace: 'nowrap',
    transition: 'all var(--v3-duration-fast) var(--v3-ease-out)',
    animation: pulse ? 'v3-pulse 2s ease-in-out infinite' : 'none',
    ...sizeMap[size],
    ...variantStyles[variant],
  };
};

export const V3Badge = React.forwardRef<HTMLSpanElement, V3BadgeProps>(
  ({ 
    variant = 'default',
    size = 'md',
    context = 'command',
    dot = false,
    pulse = false,
    style,
    children,
    ...props 
  }, ref) => {
    return (
      <>
        <style>
          {`
            @keyframes v3-pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.6; }
            }
          `}
        </style>
        <span
          ref={ref}
          style={{ ...getStyles(context, variant, size, dot, pulse), ...style }}
          {...props}
        >
          {!dot && children}
        </span>
      </>
    );
  }
);

V3Badge.displayName = 'V3Badge';
