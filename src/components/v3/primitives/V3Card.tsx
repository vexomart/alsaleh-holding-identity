/**
 * V3 Card - 100% Custom Component
 * NO SHADCN - Built from scratch
 * RTL-First Arabic Native
 */

import * as React from 'react';

export interface V3CardProps extends React.HTMLAttributes<HTMLDivElement> {
  context?: 'command' | 'bank';
  variant?: 'default' | 'elevated' | 'bordered' | 'glass';
  interactive?: boolean;
  glow?: 'cyan' | 'green' | 'amber' | 'none';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const getStyles = (
  context: 'command' | 'bank',
  variant: string,
  interactive: boolean,
  glow: string,
  padding: string
): React.CSSProperties => {
  const base: React.CSSProperties = {
    fontFamily: 'var(--v3-font-ar)',
    borderRadius: 'var(--v3-radius-xl)',
    transition: 'all var(--v3-duration-normal) var(--v3-ease-out)',
    position: 'relative',
    overflow: 'hidden',
  };

  const paddingMap: Record<string, string> = {
    none: '0',
    sm: 'var(--v3-space-3)',
    md: 'var(--v3-space-5)',
    lg: 'var(--v3-space-8)',
  };

  const contextStyles: Record<string, Record<string, React.CSSProperties>> = {
    command: {
      default: {
        background: 'hsl(var(--cmd-bg-card))',
        border: '1px solid hsl(var(--cmd-border-subtle))',
        color: 'hsl(var(--cmd-text-primary))',
      },
      elevated: {
        background: 'hsl(var(--cmd-bg-elevated))',
        border: '1px solid hsl(var(--cmd-border-default))',
        color: 'hsl(var(--cmd-text-primary))',
        boxShadow: '0 4px 24px hsl(0 0% 0% / 0.4)',
      },
      bordered: {
        background: 'transparent',
        border: '1px solid hsl(var(--cmd-border-strong))',
        color: 'hsl(var(--cmd-text-primary))',
      },
      glass: {
        background: 'hsl(var(--cmd-bg-card) / 0.6)',
        backdropFilter: 'blur(12px)',
        border: '1px solid hsl(var(--cmd-border-subtle) / 0.5)',
        color: 'hsl(var(--cmd-text-primary))',
      },
    },
    bank: {
      default: {
        background: 'hsl(var(--bank-bg-card))',
        border: '1px solid hsl(var(--bank-border-light))',
        color: 'hsl(var(--bank-text-primary))',
        boxShadow: 'var(--bank-shadow-sm)',
      },
      elevated: {
        background: 'hsl(var(--bank-bg-card))',
        border: 'none',
        color: 'hsl(var(--bank-text-primary))',
        boxShadow: 'var(--bank-shadow-lg)',
      },
      bordered: {
        background: 'hsl(var(--bank-bg-card))',
        border: '2px solid hsl(var(--bank-border-default))',
        color: 'hsl(var(--bank-text-primary))',
      },
      glass: {
        background: 'hsl(var(--bank-bg-card) / 0.8)',
        backdropFilter: 'blur(16px)',
        border: '1px solid hsl(var(--bank-border-light) / 0.5)',
        color: 'hsl(var(--bank-text-primary))',
        boxShadow: 'var(--bank-shadow-md)',
      },
    },
  };

  const glowStyles: Record<string, string> = {
    cyan: 'var(--cmd-glow-cyan)',
    green: 'var(--cmd-glow-green)',
    amber: 'var(--cmd-glow-amber)',
    none: 'none',
  };

  return {
    ...base,
    ...contextStyles[context][variant],
    padding: paddingMap[padding],
    cursor: interactive ? 'pointer' : 'default',
    boxShadow: glow !== 'none' && context === 'command' 
      ? glowStyles[glow] 
      : contextStyles[context][variant].boxShadow,
  };
};

export const V3Card = React.forwardRef<HTMLDivElement, V3CardProps>(
  ({ 
    context = 'command',
    variant = 'default',
    interactive = false,
    glow = 'none',
    padding = 'md',
    style,
    children,
    onMouseEnter,
    onMouseLeave,
    ...props 
  }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const computedStyle = getStyles(context, variant, interactive, glow, padding);

    const hoverStyle: React.CSSProperties = isHovered && interactive ? {
      transform: 'translateY(-2px)',
      boxShadow: context === 'command' 
        ? '0 8px 32px hsl(0 0% 0% / 0.5)' 
        : 'var(--bank-shadow-xl)',
    } : {};

    return (
      <div
        ref={ref}
        style={{ ...computedStyle, ...hoverStyle, ...style }}
        onMouseEnter={(e) => {
          setIsHovered(true);
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          setIsHovered(false);
          onMouseLeave?.(e);
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

V3Card.displayName = 'V3Card';

// Sub-components for card structure
export const V3CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement> & { 
  context?: 'command' | 'bank' 
}> = ({ context = 'command', style, children, ...props }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 'var(--v3-space-4)',
      borderBottom: `1px solid ${context === 'command' ? 'hsl(var(--cmd-border-subtle))' : 'hsl(var(--bank-border-light))'}`,
      marginBottom: 'var(--v3-space-4)',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

export const V3CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement> & {
  context?: 'command' | 'bank'
}> = ({ context = 'command', style, children, ...props }) => (
  <h3
    style={{
      fontSize: 'var(--v3-text-lg)',
      fontWeight: 600,
      margin: 0,
      color: context === 'command' 
        ? 'hsl(var(--cmd-text-primary))' 
        : 'hsl(var(--bank-text-primary))',
      ...style,
    }}
    {...props}
  >
    {children}
  </h3>
);

export const V3CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  style, 
  children, 
  ...props 
}) => (
  <div style={{ ...style }} {...props}>
    {children}
  </div>
);

export const V3CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement> & {
  context?: 'command' | 'bank'
}> = ({ context = 'command', style, children, ...props }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 'var(--v3-space-3)',
      paddingTop: 'var(--v3-space-4)',
      borderTop: `1px solid ${context === 'command' ? 'hsl(var(--cmd-border-subtle))' : 'hsl(var(--bank-border-light))'}`,
      marginTop: 'var(--v3-space-4)',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);
