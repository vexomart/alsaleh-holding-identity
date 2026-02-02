/**
 * PDF BRAND SYSTEM
 * 
 * Design tokens and styles for consistent PDF branding.
 */

import { FONT_NAME } from './fonts';

// Color palette
export const PDF_COLORS = {
  primary: '#0f766e',      // Teal
  primaryLight: '#14b8a6',
  secondary: '#1e293b',    // Slate
  accent: '#f59e0b',       // Amber
  
  success: '#059669',
  warning: '#d97706',
  error: '#dc2626',
  
  text: '#1f2937',
  textMuted: '#6b7280',
  textLight: '#9ca3af',
  
  background: '#ffffff',
  backgroundAlt: '#f9fafb',
  backgroundMuted: '#f3f4f6',
  
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
} as const;

// Typography scales
export const PDF_TYPOGRAPHY = {
  fontFamily: FONT_NAME,
  
  sizes: {
    xs: 8,
    sm: 9,
    base: 10,
    md: 11,
    lg: 12,
    xl: 14,
    '2xl': 16,
    '3xl': 18,
    '4xl': 24,
  },
  
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;

// Spacing scale (in points)
export const PDF_SPACING = {
  0: 0,
  1: 2,
  2: 4,
  3: 6,
  4: 8,
  5: 10,
  6: 12,
  8: 16,
  10: 20,
  12: 24,
  16: 32,
  20: 40,
} as const;

// Default document styles for Arabic RTL
export const arabicDocumentStyles = {
  defaultStyle: {
    font: FONT_NAME,
    fontSize: PDF_TYPOGRAPHY.sizes.base,
    color: PDF_COLORS.text,
    alignment: 'right' as const,
    direction: 'rtl' as const,
    lineHeight: PDF_TYPOGRAPHY.lineHeights.normal,
  },
  
  styles: {
    // Headers
    header: {
      fontSize: PDF_TYPOGRAPHY.sizes['3xl'],
      bold: true,
      color: PDF_COLORS.secondary,
      alignment: 'right' as const,
      margin: [0, 0, 0, PDF_SPACING[5]],
    },
    subheader: {
      fontSize: PDF_TYPOGRAPHY.sizes.xl,
      bold: true,
      color: PDF_COLORS.secondary,
      alignment: 'right' as const,
      margin: [0, PDF_SPACING[5], 0, PDF_SPACING[2]],
    },
    sectionTitle: {
      fontSize: PDF_TYPOGRAPHY.sizes.lg,
      bold: true,
      color: PDF_COLORS.primary,
      alignment: 'right' as const,
      margin: [0, PDF_SPACING[4], 0, PDF_SPACING[2]],
    },
    
    // Text variants
    body: {
      fontSize: PDF_TYPOGRAPHY.sizes.base,
      color: PDF_COLORS.text,
    },
    muted: {
      fontSize: PDF_TYPOGRAPHY.sizes.sm,
      color: PDF_COLORS.textMuted,
    },
    small: {
      fontSize: PDF_TYPOGRAPHY.sizes.xs,
      color: PDF_COLORS.textLight,
    },
    
    // Table styles
    tableHeader: {
      bold: true,
      fontSize: PDF_TYPOGRAPHY.sizes.base,
      fillColor: PDF_COLORS.backgroundMuted,
      color: PDF_COLORS.secondary,
    },
    tableCell: {
      fontSize: PDF_TYPOGRAPHY.sizes.sm,
    },
    
    // Footer
    footer: {
      fontSize: PDF_TYPOGRAPHY.sizes.xs,
      color: PDF_COLORS.textMuted,
      alignment: 'center' as const,
    },
    
    // Status badges
    statusSuccess: {
      color: PDF_COLORS.success,
      bold: true,
    },
    statusWarning: {
      color: PDF_COLORS.warning,
      bold: true,
    },
    statusError: {
      color: PDF_COLORS.error,
      bold: true,
    },
  },
};

// Table layout presets
export const tableLayouts = {
  // Clean horizontal lines only
  clean: {
    hLineWidth: (i: number, node: { table: { body: unknown[] } }) => 
      (i === 0 || i === 1 || i === node.table.body.length) ? 0.5 : 0,
    vLineWidth: () => 0,
    hLineColor: () => PDF_COLORS.border,
    paddingLeft: () => PDF_SPACING[3],
    paddingRight: () => PDF_SPACING[3],
    paddingTop: () => PDF_SPACING[2],
    paddingBottom: () => PDF_SPACING[2],
  },
  
  // Full borders
  bordered: {
    hLineWidth: () => 0.5,
    vLineWidth: () => 0.5,
    hLineColor: () => PDF_COLORS.border,
    vLineColor: () => PDF_COLORS.border,
    paddingLeft: () => PDF_SPACING[3],
    paddingRight: () => PDF_SPACING[3],
    paddingTop: () => PDF_SPACING[2],
    paddingBottom: () => PDF_SPACING[2],
  },
  
  // No borders
  noBorders: {
    hLineWidth: () => 0,
    vLineWidth: () => 0,
    paddingLeft: () => PDF_SPACING[2],
    paddingRight: () => PDF_SPACING[2],
    paddingTop: () => PDF_SPACING[1],
    paddingBottom: () => PDF_SPACING[1],
  },
};
