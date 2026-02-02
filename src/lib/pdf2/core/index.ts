/**
 * PDF CORE MODULE
 * 
 * Central exports for PDF generation infrastructure.
 */

// pdfmake instance
export { pdfMake, type PdfDocument, type PdfMakeInstance } from './pdfmake-instance';

// Font management
export { 
  FONT_NAME, 
  FONT_FILES,
  initializeFonts,
  areFontsReady,
  forceReloadFonts,
  getFontDiagnostics,
} from './fonts';

// Re-export FONT_NAME for convenience
export { FONT_NAME as PDF_FONT } from './fonts';

// PDF generation
export {
  generatePdfBlob,
  generatePdfDataUrl,
  generatePdfBuffer,
  type DocDefinition,
  type GenerateOptions,
} from './generator';

// Download engine
export {
  downloadPdfBlob,
  downloadBlob,
  type DownloadResult,
  type DownloadMethod,
} from './downloader';

// Branding
export {
  PDF_COLORS,
  PDF_TYPOGRAPHY,
  PDF_SPACING,
  arabicDocumentStyles,
  tableLayouts,
} from './brand';

// Bidirectional text
export {
  rtl,
  ltr,
  containsArabic,
  formatCurrency,
  formatArabicDate,
  formatShortDate,
  toArabicNumerals,
  toArabicOrdinal,
  formatPhone,
  formatPercent,
} from './bidi';

// Table utilities
export {
  createRtlTable,
  rtlKeyValue,
  createSummaryBox,
  type TableConfig,
} from './table-builder';
