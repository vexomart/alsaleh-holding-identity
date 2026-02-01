/**
 * ASH Holding - Unified PDF Brand Design System
 * 
 * SINGLE SOURCE OF TRUTH for all PDF templates (invoices, contracts, reports).
 * 
 * CRITICAL RULE: NO hardcoded colors, fonts, margins in templates.
 * All values MUST reference these tokens.
 */

import { ARABIC_FONT_NAME } from './fonts';

// ============================================
// A) PAGE SETTINGS
// ============================================

export const page = {
  size: 'A4' as const,
  orientation: 'portrait' as const,
  // RTL aware margins: [left, top, right, bottom] - pdfmake uses [left, top, right, bottom]
  // But for RTL, we conceptually think: [right, top, left, bottom]
  margins: {
    document: [40, 50, 40, 50] as [number, number, number, number],
    header: [40, 20, 40, 15] as [number, number, number, number],
    footer: [40, 15, 40, 20] as [number, number, number, number],
  },
  width: 515, // A4 width minus margins (595 - 40 - 40)
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  section: 20, // Between major sections
  paragraph: 10, // Between paragraphs
  item: 6, // Between list items
};

// ============================================
// B) TYPOGRAPHY
// ============================================

export const typography = {
  fontFamily: ARABIC_FONT_NAME, // Cairo - Arabic font
  
  sizes: {
    h1: 28,
    h2: 20,
    h3: 16,
    h4: 14,
    body: 11,
    small: 10,
    tiny: 9,
    micro: 8,
  },
  
  weights: {
    normal: false,
    bold: true,
  },
  
  lineHeight: {
    tight: 1.3,
    normal: 1.5,
    relaxed: 1.7,
    loose: 2.0,
  },
  
  // Pre-built text styles
  styles: {
    documentTitle: {
      font: ARABIC_FONT_NAME,
      fontSize: 28,
      bold: true,
      alignment: 'center' as const,
      lineHeight: 1.3,
    },
    documentSubtitle: {
      font: ARABIC_FONT_NAME,
      fontSize: 14,
      bold: false,
      alignment: 'center' as const,
      lineHeight: 1.4,
    },
    sectionTitle: {
      font: ARABIC_FONT_NAME,
      fontSize: 16,
      bold: true,
      alignment: 'right' as const,
      lineHeight: 1.4,
    },
    subsectionTitle: {
      font: ARABIC_FONT_NAME,
      fontSize: 14,
      bold: true,
      alignment: 'right' as const,
      lineHeight: 1.4,
    },
    body: {
      font: ARABIC_FONT_NAME,
      fontSize: 11,
      bold: false,
      alignment: 'right' as const,
      lineHeight: 1.6,
    },
    bodySmall: {
      font: ARABIC_FONT_NAME,
      fontSize: 10,
      bold: false,
      alignment: 'right' as const,
      lineHeight: 1.5,
    },
    label: {
      font: ARABIC_FONT_NAME,
      fontSize: 10,
      bold: false,
      alignment: 'right' as const,
    },
    value: {
      font: ARABIC_FONT_NAME,
      fontSize: 11,
      bold: true,
      alignment: 'right' as const,
    },
    valueLTR: {
      font: ARABIC_FONT_NAME,
      fontSize: 11,
      bold: true,
      alignment: 'left' as const,
    },
  },
};

// ============================================
// C) COLORS - ASH Holding Brand
// ============================================

export const colors = {
  // Brand Primary - Navy Blue (professional, trustworthy)
  primary: '#0f3460',
  primaryLight: '#1a4980',
  primaryDark: '#0a2540',
  
  // Brand Accent - Gold (premium, excellence)
  accent: '#c5a030',
  accentLight: '#d4b44d',
  accentDark: '#a88a28',
  
  // Text Colors
  text: {
    primary: '#0f172a',
    secondary: '#334155',
    muted: '#64748b',
    disabled: '#94a3b8',
    inverse: '#ffffff',
  },
  
  // Background Colors
  background: {
    page: '#ffffff',
    section: '#f8fafc',
    card: '#f1f5f9',
    highlight: '#e0f2fe',
  },
  
  // Border Colors
  border: {
    light: '#e2e8f0',
    medium: '#cbd5e1',
    dark: '#94a3b8',
    accent: '#0f3460',
  },
  
  // Status Colors (for badges/chips)
  status: {
    success: {
      bg: '#dcfce7',
      text: '#166534',
      border: '#86efac',
    },
    warning: {
      bg: '#fef3c7',
      text: '#92400e',
      border: '#fcd34d',
    },
    danger: {
      bg: '#fee2e2',
      text: '#991b1b',
      border: '#fca5a5',
    },
    info: {
      bg: '#dbeafe',
      text: '#1e40af',
      border: '#93c5fd',
    },
    neutral: {
      bg: '#f1f5f9',
      text: '#475569',
      border: '#cbd5e1',
    },
  },
  
  // Invoice-specific
  invoice: {
    paid: '#10b981',
    pending: '#f59e0b',
    overdue: '#ef4444',
    cancelled: '#6b7280',
    vatHighlight: '#fef3c7',
  },
};

// ============================================
// D) COMPONENT STYLES
// ============================================

export const components = {
  // Header Bar (top line with brand color)
  headerBar: {
    height: 4,
    color: colors.primary,
    margin: [0, 0, 0, spacing.md] as [number, number, number, number],
  },
  
  // Info Card (buyer/seller blocks)
  infoCard: {
    background: colors.background.section,
    border: colors.border.light,
    borderWidth: 1,
    padding: [spacing.md, spacing.md, spacing.md, spacing.md] as [number, number, number, number],
    margin: [0, 0, 0, spacing.md] as [number, number, number, number],
    titleColor: colors.primary,
    titleSize: typography.sizes.h4,
    labelColor: colors.text.muted,
    valueColor: colors.text.primary,
  },
  
  // Table Styles
  table: {
    header: {
      background: colors.primary,
      textColor: colors.text.inverse,
      fontSize: typography.sizes.body,
      bold: true,
      padding: [spacing.sm, spacing.sm + 2, spacing.sm, spacing.sm + 2] as [number, number, number, number],
    },
    cell: {
      background: colors.background.page,
      textColor: colors.text.primary,
      fontSize: typography.sizes.small,
      padding: [spacing.sm, spacing.sm, spacing.sm, spacing.sm] as [number, number, number, number],
    },
    zebraRow: colors.background.section,
    border: colors.border.light,
    borderWidth: 1,
  },
  
  // Totals Box (subtotal/vat/total)
  totalsBox: {
    background: colors.background.section,
    border: colors.border.medium,
    borderWidth: 1,
    padding: spacing.md,
    labelColor: colors.text.secondary,
    valueColor: colors.text.primary,
    totalLabelColor: colors.primary,
    totalValueColor: colors.primary,
    totalSize: typography.sizes.h4,
    vatBadgeBackground: colors.status.warning.bg,
    vatBadgeColor: colors.status.warning.text,
  },
  
  // Badge/Chip (status indicator)
  badge: {
    fontSize: typography.sizes.small,
    padding: [spacing.xs, spacing.sm, spacing.xs, spacing.sm] as [number, number, number, number],
    borderRadius: 4,
    success: colors.status.success,
    warning: colors.status.warning,
    danger: colors.status.danger,
    info: colors.status.info,
    neutral: colors.status.neutral,
  },
  
  // Divider
  divider: {
    color: colors.border.light,
    width: 1,
    margin: [0, spacing.md, 0, spacing.md] as [number, number, number, number],
  },
  
  // Divider with accent
  dividerAccent: {
    color: colors.primary,
    width: 2,
    margin: [0, spacing.lg, 0, spacing.lg] as [number, number, number, number],
  },
  
  // Footer
  footer: {
    fontSize: typography.sizes.tiny,
    color: colors.text.muted,
    websiteColor: colors.primary,
    borderColor: colors.border.light,
    margin: [page.margins.document[0], 0, page.margins.document[2], spacing.sm] as [number, number, number, number],
  },
  
  // Signature Block
  signatureBlock: {
    background: colors.background.section,
    border: colors.border.medium,
    borderWidth: 1,
    padding: spacing.lg,
    labelColor: colors.primary,
    nameColor: colors.text.primary,
    lineColor: colors.border.dark,
  },
  
  // Clause Block (for contracts)
  clause: {
    numberColor: colors.primary,
    numberSize: typography.sizes.h4,
    titleColor: colors.text.primary,
    titleSize: typography.sizes.h4,
    contentColor: colors.text.secondary,
    contentSize: typography.sizes.body,
    subClauseColor: colors.text.secondary,
    bulletColor: colors.primary,
    spacing: spacing.md,
  },
};

// ============================================
// E) COMPANY INFO - ASH Holding
// ============================================

export const companyInfo = {
  nameAr: 'آش هولدينج للتقنية والاستثمار',
  nameEn: 'ASH Holding',
  vatNumber: '300000000000003',
  crNumber: '4030000000',
  addressAr: 'جدة، المملكة العربية السعودية',
  phone: '+966 55 581 2567',
  email: 'info@ash-holding.sa',
  website: 'ash-holding.sa',
  logoUrl: undefined as string | undefined, // Can be set to base64 or URL
};

// ============================================
// F) STYLE DICTIONARY (for pdfmake)
// ============================================

export const stylesDictionary = {
  // Headers
  documentTitle: {
    font: typography.fontFamily,
    fontSize: typography.sizes.h1,
    bold: true,
    alignment: 'center' as const,
    color: colors.text.primary,
    margin: [0, 0, 0, spacing.xs],
  },
  documentSubtitle: {
    font: typography.fontFamily,
    fontSize: typography.sizes.h4,
    alignment: 'center' as const,
    color: colors.text.muted,
    margin: [0, 0, 0, spacing.lg],
  },
  sectionHeader: {
    font: typography.fontFamily,
    fontSize: typography.sizes.h3,
    bold: true,
    alignment: 'right' as const,
    color: colors.primary,
    margin: [0, spacing.lg, 0, spacing.sm],
  },
  subsectionHeader: {
    font: typography.fontFamily,
    fontSize: typography.sizes.h4,
    bold: true,
    alignment: 'right' as const,
    color: colors.text.secondary,
    margin: [0, spacing.md, 0, spacing.sm],
  },
  
  // Body
  body: {
    font: typography.fontFamily,
    fontSize: typography.sizes.body,
    alignment: 'right' as const,
    lineHeight: typography.lineHeight.relaxed,
    color: colors.text.primary,
  },
  bodySmall: {
    font: typography.fontFamily,
    fontSize: typography.sizes.small,
    alignment: 'right' as const,
    lineHeight: typography.lineHeight.normal,
    color: colors.text.secondary,
  },
  note: {
    font: typography.fontFamily,
    fontSize: typography.sizes.small,
    alignment: 'right' as const,
    color: colors.text.muted,
    margin: [0, spacing.xs, 0, spacing.xs],
  },
  
  // Table
  tableHeader: {
    font: typography.fontFamily,
    fontSize: components.table.header.fontSize,
    bold: components.table.header.bold,
    alignment: 'right' as const,
    fillColor: components.table.header.background,
    color: components.table.header.textColor,
    margin: components.table.header.padding,
  },
  tableCell: {
    font: typography.fontFamily,
    fontSize: components.table.cell.fontSize,
    alignment: 'right' as const,
    margin: components.table.cell.padding,
    color: components.table.cell.textColor,
  },
  tableCellLTR: {
    font: typography.fontFamily,
    fontSize: components.table.cell.fontSize,
    alignment: 'left' as const,
    margin: components.table.cell.padding,
    color: components.table.cell.textColor,
  },
  
  // Labels and Values
  label: {
    font: typography.fontFamily,
    fontSize: typography.sizes.small,
    color: colors.text.muted,
    alignment: 'right' as const,
  },
  value: {
    font: typography.fontFamily,
    fontSize: typography.sizes.body,
    bold: true,
    alignment: 'right' as const,
    color: colors.text.primary,
  },
  valueLTR: {
    font: typography.fontFamily,
    fontSize: typography.sizes.body,
    bold: true,
    alignment: 'left' as const,
    color: colors.text.primary,
  },
  
  // Financial
  total: {
    font: typography.fontFamily,
    fontSize: typography.sizes.h4,
    bold: true,
    alignment: 'right' as const,
    color: colors.primary,
  },
  currency: {
    font: typography.fontFamily,
    fontSize: typography.sizes.h4,
    alignment: 'left' as const,
    color: colors.text.primary,
  },
  
  // Clause
  clauseNumber: {
    font: typography.fontFamily,
    fontSize: components.clause.numberSize,
    bold: true,
    color: components.clause.numberColor,
    alignment: 'right' as const,
  },
  clauseTitle: {
    font: typography.fontFamily,
    fontSize: components.clause.titleSize,
    bold: true,
    color: components.clause.titleColor,
    alignment: 'right' as const,
  },
  clauseContent: {
    font: typography.fontFamily,
    fontSize: components.clause.contentSize,
    alignment: 'right' as const,
    lineHeight: typography.lineHeight.relaxed,
    color: components.clause.contentColor,
  },
  
  // Footer
  pageFooter: {
    font: typography.fontFamily,
    fontSize: components.footer.fontSize,
    alignment: 'center' as const,
    color: components.footer.color,
  },
};

// ============================================
// G) HELPER FUNCTIONS
// ============================================

/**
 * Get status color config
 */
export function getStatusColors(status: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | string) {
  const statusMap: Record<string, typeof colors.status.success> = {
    success: colors.status.success,
    paid: colors.status.success,
    warning: colors.status.warning,
    pending: colors.status.warning,
    danger: colors.status.danger,
    overdue: colors.status.danger,
    cancelled: colors.status.neutral,
    info: colors.status.info,
    neutral: colors.status.neutral,
  };
  return statusMap[status] || colors.status.neutral;
}

/**
 * Create margin array from spacing tokens
 */
export function margin(
  top: keyof typeof spacing | number = 0,
  right: keyof typeof spacing | number = 0,
  bottom: keyof typeof spacing | number = 0,
  left: keyof typeof spacing | number = 0
): [number, number, number, number] {
  const resolve = (val: keyof typeof spacing | number) => 
    typeof val === 'number' ? val : spacing[val];
  return [resolve(left), resolve(top), resolve(right), resolve(bottom)];
}

// ============================================
// H) VALIDATION CONSTANTS
// ============================================

/**
 * All allowed colors in brand system
 * Used for verification to ensure no hardcoded colors
 */
export const allowedColors = new Set([
  colors.primary,
  colors.primaryLight,
  colors.primaryDark,
  colors.accent,
  colors.accentLight,
  colors.accentDark,
  colors.text.primary,
  colors.text.secondary,
  colors.text.muted,
  colors.text.disabled,
  colors.text.inverse,
  colors.background.page,
  colors.background.section,
  colors.background.card,
  colors.background.highlight,
  colors.border.light,
  colors.border.medium,
  colors.border.dark,
  colors.border.accent,
  colors.status.success.bg,
  colors.status.success.text,
  colors.status.success.border,
  colors.status.warning.bg,
  colors.status.warning.text,
  colors.status.warning.border,
  colors.status.danger.bg,
  colors.status.danger.text,
  colors.status.danger.border,
  colors.status.info.bg,
  colors.status.info.text,
  colors.status.info.border,
  colors.status.neutral.bg,
  colors.status.neutral.text,
  colors.status.neutral.border,
  colors.invoice.paid,
  colors.invoice.pending,
  colors.invoice.overdue,
  colors.invoice.cancelled,
  colors.invoice.vatHighlight,
]);

// Export brand as unified object
export const brand = {
  page,
  spacing,
  typography,
  colors,
  components,
  companyInfo,
  stylesDictionary,
  getStatusColors,
  margin,
  allowedColors,
};

export default brand;
