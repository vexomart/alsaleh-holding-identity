/**
 * RTL Enforcement System
 * 
 * Provides utilities for consistent RTL/LTR handling across the application.
 * Arabic is the default language - English switches to LTR cleanly.
 */

// RTL Direction utilities
export type Direction = 'rtl' | 'ltr';
export type Language = 'ar' | 'en';

/**
 * Get direction based on language
 */
export const getDirection = (lang: Language): Direction => {
  return lang === 'ar' ? 'rtl' : 'ltr';
};

/**
 * Check if current direction is RTL
 */
export const isRTL = (lang: Language): boolean => {
  return lang === 'ar';
};

/**
 * RTL-aware class name generator
 * Converts physical properties to logical equivalents
 */
export const rtlClass = (classes: string, isRtl: boolean = true): string => {
  if (!isRtl) return classes;
  
  // Map physical to logical properties
  const replacements: Record<string, string> = {
    'text-left': 'text-start',
    'text-right': 'text-end',
    'ml-': 'ms-',
    'mr-': 'me-',
    'pl-': 'ps-',
    'pr-': 'pe-',
    'left-': 'start-',
    'right-': 'end-',
    'border-l-': 'border-s-',
    'border-r-': 'border-e-',
    'rounded-l-': 'rounded-s-',
    'rounded-r-': 'rounded-e-',
    'rounded-tl-': 'rounded-ts-',
    'rounded-tr-': 'rounded-te-',
    'rounded-bl-': 'rounded-bs-',
    'rounded-br-': 'rounded-be-',
    'scroll-ml-': 'scroll-ms-',
    'scroll-mr-': 'scroll-me-',
    'scroll-pl-': 'scroll-ps-',
    'scroll-pr-': 'scroll-pe-',
  };
  
  let result = classes;
  for (const [physical, logical] of Object.entries(replacements)) {
    result = result.replace(new RegExp(physical, 'g'), logical);
  }
  
  return result;
};

/**
 * RTL-aware icon flip check
 * Returns true if icon should be mirrored in RTL
 */
export const shouldMirrorIcon = (iconName: string): boolean => {
  // Icons that should be mirrored in RTL
  const mirroredIcons = [
    'arrow-left',
    'arrow-right',
    'chevron-left',
    'chevron-right',
    'corner-down-left',
    'corner-down-right',
    'corner-left-down',
    'corner-left-up',
    'corner-right-down',
    'corner-right-up',
    'corner-up-left',
    'corner-up-right',
    'external-link',
    'forward',
    'log-in',
    'log-out',
    'move-left',
    'move-right',
    'redo',
    'reply',
    'share',
    'skip-back',
    'skip-forward',
    'trending-down',
    'trending-up',
    'undo',
  ];
  
  return mirroredIcons.some(icon => iconName.toLowerCase().includes(icon));
};

/**
 * Get RTL-aware animation direction
 */
export const getAnimationDirection = (
  direction: 'left' | 'right',
  isRtl: boolean
): 'left' | 'right' => {
  if (!isRtl) return direction;
  return direction === 'left' ? 'right' : 'left';
};

/**
 * Get RTL-aware transform value
 */
export const getTransformValue = (
  value: number,
  axis: 'x' | 'y',
  isRtl: boolean
): number => {
  if (axis === 'y' || !isRtl) return value;
  return -value;
};

/**
 * RTL Enforcement Checklist
 */
export const RTL_CHECKLIST = {
  html: {
    requirement: 'HTML dir="rtl" and lang="ar" for Arabic',
    status: 'implemented',
    location: 'index.html',
  },
  css: {
    requirement: 'CSS logical properties (margin-inline, padding-inline)',
    status: 'partial',
    notes: 'Some components still use physical properties',
  },
  icons: {
    requirement: 'Directional icons mirrored correctly',
    status: 'implemented',
    notes: 'Use shouldMirrorIcon() for conditional mirroring',
  },
  tables: {
    requirement: 'Tables RTL aligned with correct column order',
    status: 'implemented',
    notes: 'PDF tables auto-reverse columns for RTL',
  },
  pdfs: {
    requirement: 'PDFs match UI RTL direction',
    status: 'implemented',
    location: 'src/lib/pdf/arabic-pdf.ts',
  },
  animations: {
    requirement: 'Animations RTL-aware (slide directions)',
    status: 'implemented',
    notes: 'Use getAnimationDirection() for slide animations',
  },
  forms: {
    requirement: 'Form inputs right-aligned in RTL',
    status: 'implemented',
    location: 'src/styles/rtl-fixes.css',
  },
  numbers: {
    requirement: 'Numbers display correctly (LTR within RTL)',
    status: 'implemented',
    notes: 'Phone, prices keep LTR direction',
  },
} as const;

/**
 * CSS class utilities for RTL-aware spacing
 */
export const spacing = {
  // Margin inline
  ms: (size: number | string) => `ms-${size}`,
  me: (size: number | string) => `me-${size}`,
  // Padding inline
  ps: (size: number | string) => `ps-${size}`,
  pe: (size: number | string) => `pe-${size}`,
  // Text alignment
  textStart: 'text-start',
  textEnd: 'text-end',
  // Positioning
  start: (size: number | string) => `start-${size}`,
  end: (size: number | string) => `end-${size}`,
  // Border
  borderS: (size: number | string) => `border-s-${size}`,
  borderE: (size: number | string) => `border-e-${size}`,
} as const;
