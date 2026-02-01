/**
 * PDF Core Module Exports
 * 
 * Re-exports all core functionality from a single entry point.
 */

// Main PDF Core
export * from './pdf-core';

// Brand Design System (SINGLE SOURCE OF TRUTH)
export {
  brand,
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
} from './brand';

// Shared Sections (Headers, Footers, Cards)
export {
  buildPdfHeader,
  buildPdfFooter,
  buildInfoCard,
  buildTotalsBox,
  buildBadge,
  buildSectionTitle,
  buildDivider,
  buildSignatureBlock,
  buildClause,
  type PdfHeaderOptions,
  type PdfFooterOptions,
  type InfoCardOptions,
  type TotalsBoxOptions,
  type BadgeVariant,
  type SignatureParty,
  type ClauseContent,
} from './shared-sections';

// Arabic correctness layer (NEW)
export {
  rtl,
  ltr,
  mix,
  currency,
  rtlTable,
  rtlKeyValue,
  rtlDocumentStyle,
  containsArabic,
  isRTL,
  verifyArabicRendering,
  ARABIC_TEST_STRING,
} from './arabic';

// Arabic utilities (legacy - kept for compatibility)
export {
  toArabicNumerals,
  toWesternNumerals,
  formatCurrency,
  formatArabicDate,
  ltrToken,
  rtlToken,
  preprocessArabic,
  toArabicOrdinal,
} from './arabic-utils';

// Font management
export {
  ARABIC_FONT_NAME,
  FONT_FILES,
  initializeFonts,
  areFontsInitialized,
  getFontInitError,
  resetFontInit,
  assertFontsReady,
  getFontDiagnostics,
} from './fonts';

// Layout utilities
export {
  corporateStyles,
  createRTLTable,
  createRTLKeyValue,
  createCompanyHeader,
  createSeparator,
  createSignatureBlock,
  createPageFooter,
  buildRtlTable,
  type PDFContent,
  type PDFStyle,
  type PDFStyleDictionary,
} from './layout';

// Download utilities
export {
  downloadBlob,
  openBlobInNewTab,
  blobToDataUrl,
  blobToBase64,
} from './download';

// Verification
export {
  verifyPDFSystem,
  generateTestPDF,
  debugPDFArabic,
  runFinalQAGate,
  type PDFVerificationReport,
} from './verify';
