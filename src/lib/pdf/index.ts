/**
 * Unified Arabic RTL PDF System
 * 
 * A complete, enterprise-grade PDF generation solution with:
 * - 100% RTL layout (text direction, alignment, margins)
 * - Proper Arabic shaping via embedded Cairo TTF font
 * - Strict font verification (hard-fail if fonts missing)
 * - Corporate-grade invoice and contract templates
 * 
 * USAGE:
 * ```typescript
 * import { 
 *   ensurePDFReady, 
 *   createInvoicePDF, 
 *   createContractPDF,
 *   debugPDFArabic 
 * } from '@/lib/pdf';
 * 
 * // Initialize once at app start (optional, auto-called on first PDF)
 * await ensurePDFReady();
 * 
 * // Generate Invoice PDF
 * await createInvoicePDF(invoiceData, { download: true });
 * 
 * // Generate Contract PDF
 * await createContractPDF(contractData, { download: true });
 * 
 * // Debug & verify PDF system
 * await debugPDFArabic();
 * ```
 * 
 * ARCHITECTURE:
 * - core/           - Shared PDF utilities (fonts, layout, arabic, verify)
 * - templates/      - Invoice and Contract document builders
 * - fonts/          - Cairo TTF font loader
 */

// ============================================
// CORE EXPORTS
// ============================================

// Main initialization and generation
export {
  ensurePDFReady,
  isPDFReady,
  generatePDFBlob,
  generateAndDownloadPDF,
  generateAndOpenPDF,
  generatePDFDataUrl,
  generatePDFBase64,
  createDocumentDefinition,
  DEFAULT_COMPANY_INFO,
  type PDFDocumentOptions,
} from './core/pdf-core';

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
} from './core/fonts';

// Arabic text utilities
export {
  toArabicNumerals,
  toWesternNumerals,
  formatCurrency,
  formatArabicDate,
  ltrToken,
  rtlToken,
  preprocessArabic,
  containsArabic,
  isRTL,
  toArabicOrdinal,
} from './core/arabic-utils';

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
} from './core/layout';

// Download utilities
export {
  downloadBlob,
  openBlobInNewTab,
  blobToDataUrl,
  blobToBase64,
} from './core/download';

// Verification and debugging
export {
  verifyPDFSystem,
  generateTestPDF,
  debugPDFArabic,
  type PDFVerificationReport,
} from './core/verify';

// ============================================
// TEMPLATE EXPORTS
// ============================================

// Invoice template
export {
  createInvoicePDF,
  generateInvoiceContent,
  calculateVAT,
  calculateInvoiceTotals,
  orderToInvoiceData,
  type InvoiceData,
  type InvoiceItem,
  type InvoiceCustomer,
  type CompanyInfo,
  type CreateInvoicePDFOptions,
} from './templates/invoice.template';

// Contract template
export {
  createContractPDF,
  generateContractContent,
  dbContractToContractData,
  defaultContractClauses,
  type ContractData,
  type ContractParty,
  type ContractClause,
  type ContractPricing,
  type CreateContractPDFOptions,
} from './templates/contract.template';

// ============================================
// LEGACY COMPATIBILITY (deprecated, will be removed)
// ============================================

// Re-export old names for backward compatibility
export { createInvoicePDF as generateInvoicePdf } from './templates/invoice.template';
export { formatCurrency as formatArabicCurrency } from './core/arabic-utils';
export { corporateStyles as rtlStyles } from './core/layout';

// Legacy class (deprecated)
export { ArabicPDFGenerator, arabicPDF } from './arabic-pdf';

// Legacy init (deprecated - use ensurePDFReady instead)
export { 
  ensurePdfInitialized, 
  isPdfInitialized, 
  getPdfInitError, 
  resetPdfInit 
} from './pdf-init';

// Sample generators (for testing)
export { 
  generateSampleInvoice, 
  generateSampleReport, 
  generateSampleContract,
  testArabicPDFRendering,
  testArabicTaxInvoice,
} from './samples';

// Report generator (legacy)
export {
  generateReportContent,
  createReportPDF,
  type ReportData,
  type ReportSection,
  type ReportTable,
  type ReportChart,
} from './report-generator';

// Old contract generator (deprecated - use createContractPDF from templates)
export { 
  generateContractContent as generateLegacyContractContent,
  createContractPDF as createLegacyContractPDF,
} from './contract-generator';

// Old invoice generator exports (deprecated)
export { 
  exampleInvoiceInput,
} from './invoice-generator';

// Old debug (deprecated - use debugPDFArabic from core/verify)
export { debugPDFArabic as debugPDFArabicLegacy } from './debug-pdf';
