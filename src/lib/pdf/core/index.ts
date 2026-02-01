/**
 * PDF Core Module Exports
 * 
 * Re-exports all core functionality from a single entry point.
 */

// Main PDF Core
export * from './pdf-core';

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
  type PDFVerificationReport,
} from './verify';
