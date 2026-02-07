/**
 * RTL-aware Icon Component
 * Automatically mirrors directional icons in RTL mode
 * Does NOT mirror: status, brand, UI state icons
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

// Icons that SHOULD be mirrored in RTL (directional/navigation only)
const MIRRORED_ICONS = new Set([
  // Arrows
  'ArrowLeft', 'ArrowRight',
  'ArrowBigLeft', 'ArrowBigRight',
  'ArrowLeftCircle', 'ArrowRightCircle',
  'ArrowLeftFromLine', 'ArrowRightFromLine',
  'ArrowLeftToLine', 'ArrowRightToLine',
  // Chevrons
  'ChevronLeft', 'ChevronRight',
  'ChevronsLeft', 'ChevronsRight',
  // Corners
  'CornerDownLeft', 'CornerDownRight',
  'CornerLeftDown', 'CornerLeftUp',
  'CornerRightDown', 'CornerRightUp',
  'CornerUpLeft', 'CornerUpRight',
  // Navigation
  'ExternalLink', 'Forward', 'Reply', 'ReplyAll',
  'LogIn', 'LogOut',
  'MoveLeft', 'MoveRight',
  // Actions
  'Redo', 'Redo2', 'Undo', 'Undo2',
  'Share', 'Share2',
  'SkipBack', 'SkipForward',
  'StepBack', 'StepForward',
]);

interface RTLIconProps {
  icon: LucideIcon;
  className?: string;
  size?: number | string;
  strokeWidth?: number;
  /** Force mirror regardless of RTL state */
  forceMirror?: boolean;
  /** Prevent mirroring even in RTL */
  noMirror?: boolean;
  /** Additional props passed to the icon */
  [key: string]: any;
}

export const RTLIcon: React.FC<RTLIconProps> = ({
  icon: Icon,
  className,
  size = 24,
  strokeWidth = 2,
  forceMirror = false,
  noMirror = false,
  ...props
}) => {
  const { isRTL } = useLanguage();
  
  // Get icon name from function name
  const iconName = Icon.displayName || Icon.name || '';
  const shouldMirror = MIRRORED_ICONS.has(iconName);
  
  // Determine if we should apply mirror transform
  const applyMirror = !noMirror && (forceMirror || (isRTL && shouldMirror));
  
  return (
    <Icon
      className={cn(
        'shrink-0',
        applyMirror && 'rtl-mirror',
        className
      )}
      size={size}
      strokeWidth={strokeWidth}
      style={applyMirror ? { transform: 'scaleX(-1)' } : undefined}
      data-mirror={applyMirror ? 'true' : 'false'}
      {...props}
    />
  );
};

/**
 * Icon with text - properly spaced for RTL/LTR
 */
interface IconTextProps extends Omit<RTLIconProps, 'children'> {
  children: React.ReactNode;
  /** Icon position relative to text */
  iconPosition?: 'start' | 'end';
  /** Gap between icon and text */
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  /** Wrapper className */
  wrapperClassName?: string;
}

export const IconText: React.FC<IconTextProps> = ({
  children,
  iconPosition = 'start',
  gap = 'sm',
  wrapperClassName,
  className,
  icon,
  ...iconProps
}) => {
  const gapClass = {
    xs: 'gap-1',
    sm: 'gap-1.5',
    md: 'gap-2',
    lg: 'gap-3',
  }[gap];
  
  return (
    <span className={cn("inline-flex items-center", gapClass, wrapperClassName)}>
      {iconPosition === 'start' && <RTLIcon icon={icon} className={className} {...iconProps} />}
      <span>{children}</span>
      {iconPosition === 'end' && <RTLIcon icon={icon} className={className} {...iconProps} />}
    </span>
  );
};

/**
 * Hook to get RTL-aware icon class
 */
export const useRTLIconClass = (iconName: string): string => {
  const { isRTL } = useLanguage();
  
  if (!isRTL) return '';
  
  // Check if icon should be mirrored
  const normalizedName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
  if (MIRRORED_ICONS.has(normalizedName)) {
    return 'rtl-mirror';
  }
  
  return '';
};

/**
 * Check if an icon should be mirrored
 */
export const shouldMirrorIcon = (iconName: string): boolean => {
  const normalizedName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
  return MIRRORED_ICONS.has(normalizedName);
};

export default RTLIcon;
