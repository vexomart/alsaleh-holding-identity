/**
 * RTL-aware Icon Component
 * Automatically mirrors directional icons in RTL mode
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

// Icons that should be mirrored in RTL
const MIRRORED_ICONS = new Set([
  'ArrowLeft',
  'ArrowRight',
  'ChevronLeft',
  'ChevronRight',
  'ChevronsLeft',
  'ChevronsRight',
  'ArrowBigLeft',
  'ArrowBigRight',
  'ArrowLeftCircle',
  'ArrowRightCircle',
  'ArrowLeftFromLine',
  'ArrowRightFromLine',
  'ArrowLeftToLine',
  'ArrowRightToLine',
  'CornerDownLeft',
  'CornerDownRight',
  'CornerLeftDown',
  'CornerLeftUp',
  'CornerRightDown',
  'CornerRightUp',
  'CornerUpLeft',
  'CornerUpRight',
  'ExternalLink',
  'Forward',
  'LogIn',
  'LogOut',
  'MoveLeft',
  'MoveRight',
  'Redo',
  'Redo2',
  'Reply',
  'ReplyAll',
  'Share',
  'Share2',
  'SkipBack',
  'SkipForward',
  'StepBack',
  'StepForward',
  'Undo',
  'Undo2',
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
}

export const RTLIcon: React.FC<RTLIconProps> = ({
  icon: Icon,
  className,
  size = 24,
  strokeWidth = 2,
  forceMirror = false,
  noMirror = false,
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
        applyMirror && 'rtl-mirror',
        className
      )}
      size={size}
      strokeWidth={strokeWidth}
      style={applyMirror ? { transform: 'scaleX(-1)' } : undefined}
    />
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

export default RTLIcon;
