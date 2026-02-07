/**
 * V3 Input - 100% Custom Component
 * NO SHADCN - Built from scratch
 * RTL-First Arabic Native
 */

import * as React from 'react';

export interface V3InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  context?: 'command' | 'bank';
  inputSize?: 'sm' | 'md' | 'lg';
  label?: string;
  hint?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
}

const getContainerStyles = (context: 'command' | 'bank'): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--v3-space-2)',
  fontFamily: 'var(--v3-font-ar)',
});

const getLabelStyles = (context: 'command' | 'bank'): React.CSSProperties => ({
  fontSize: 'var(--v3-text-sm)',
  fontWeight: 500,
  color: context === 'command' 
    ? 'hsl(var(--cmd-text-secondary))' 
    : 'hsl(var(--bank-text-secondary))',
});

const getInputStyles = (
  context: 'command' | 'bank',
  size: string,
  hasIcon: boolean,
  iconPosition: string,
  hasError: boolean
): React.CSSProperties => {
  const sizeMap: Record<string, React.CSSProperties> = {
    sm: {
      height: '2.25rem',
      fontSize: 'var(--v3-text-sm)',
      paddingInlineStart: hasIcon && iconPosition === 'start' ? '2.5rem' : 'var(--v3-space-3)',
      paddingInlineEnd: hasIcon && iconPosition === 'end' ? '2.5rem' : 'var(--v3-space-3)',
    },
    md: {
      height: '2.75rem',
      fontSize: 'var(--v3-text-base)',
      paddingInlineStart: hasIcon && iconPosition === 'start' ? '3rem' : 'var(--v3-space-4)',
      paddingInlineEnd: hasIcon && iconPosition === 'end' ? '3rem' : 'var(--v3-space-4)',
    },
    lg: {
      height: '3.25rem',
      fontSize: 'var(--v3-text-lg)',
      paddingInlineStart: hasIcon && iconPosition === 'start' ? '3.5rem' : 'var(--v3-space-5)',
      paddingInlineEnd: hasIcon && iconPosition === 'end' ? '3.5rem' : 'var(--v3-space-5)',
    },
  };

  const contextStyles: Record<string, React.CSSProperties> = {
    command: {
      background: 'hsl(var(--cmd-bg-panel))',
      border: hasError 
        ? '1px solid hsl(var(--cmd-accent-red))' 
        : '1px solid hsl(var(--cmd-border-default))',
      color: 'hsl(var(--cmd-text-primary))',
      borderRadius: 'var(--v3-radius-lg)',
    },
    bank: {
      background: 'hsl(var(--bank-bg-card))',
      border: hasError 
        ? '2px solid hsl(var(--bank-error))' 
        : '1px solid hsl(var(--bank-border-default))',
      color: 'hsl(var(--bank-text-primary))',
      borderRadius: 'var(--v3-radius-lg)',
      boxShadow: 'var(--bank-shadow-sm)',
    },
  };

  return {
    width: '100%',
    fontFamily: 'var(--v3-font-ar)',
    outline: 'none',
    transition: 'all var(--v3-duration-normal) var(--v3-ease-out)',
    ...sizeMap[size],
    ...contextStyles[context],
  };
};

const getIconStyles = (
  context: 'command' | 'bank',
  position: string
): React.CSSProperties => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  [position === 'start' ? 'insetInlineStart' : 'insetInlineEnd']: 'var(--v3-space-3)',
  color: context === 'command' 
    ? 'hsl(var(--cmd-text-muted))' 
    : 'hsl(var(--bank-text-muted))',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const getHintStyles = (context: 'command' | 'bank', isError: boolean): React.CSSProperties => ({
  fontSize: 'var(--v3-text-xs)',
  color: isError 
    ? (context === 'command' ? 'hsl(var(--cmd-accent-red))' : 'hsl(var(--bank-error))')
    : (context === 'command' ? 'hsl(var(--cmd-text-dim))' : 'hsl(var(--bank-text-dim))'),
});

export const V3Input = React.forwardRef<HTMLInputElement, V3InputProps>(
  ({ 
    context = 'command',
    inputSize = 'md',
    label,
    hint,
    error,
    icon,
    iconPosition = 'start',
    style,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const focusStyles: React.CSSProperties = isFocused ? {
      borderColor: context === 'command' 
        ? 'hsl(var(--cmd-accent-cyan))' 
        : 'hsl(var(--bank-brand-primary))',
      boxShadow: context === 'command'
        ? '0 0 0 3px hsl(var(--cmd-accent-cyan) / 0.15)'
        : '0 0 0 3px hsl(var(--bank-brand-primary) / 0.1)',
    } : {};

    return (
      <div style={getContainerStyles(context)}>
        {label && (
          <label style={getLabelStyles(context)}>
            {label}
          </label>
        )}
        <div style={{ position: 'relative' }}>
          {icon && (
            <span style={getIconStyles(context, iconPosition)}>
              {icon}
            </span>
          )}
          <input
            ref={ref}
            style={{ 
              ...getInputStyles(context, inputSize, !!icon, iconPosition, !!error),
              ...focusStyles,
              ...style 
            }}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
        </div>
        {(hint || error) && (
          <span style={getHintStyles(context, !!error)}>
            {error || hint}
          </span>
        )}
      </div>
    );
  }
);

V3Input.displayName = 'V3Input';
