/**
 * Unified Arabic RTL PDF System
 * 
 * STRICT SINGLETON ARCHITECTURE
 * ═════════════════════════════════════════════════════════════════
 * 
 * This module is the ONLY entry point for PDF generation.
 * All PDF operations MUST go through these 4 functions:
 * 
 *   1. initPdf()           - Initialize fonts (auto-called by generators)
 *   2. debugPDFArabic()    - Debug & verify system
 *   3. createInvoicePDF()  - Generate tax invoice
 *   4. createContractPDF() - Generate contract document
 * 
 * USAGE:
 * ```typescript
 * import { initPdf, createInvoicePDF, createContractPDF, debugPDFArabic } from '@/lib/pdf';
 * 
 * // Optional: Pre-initialize (auto-called on first PDF)
 * await initPdf();
 * 
 * // Generate PDFs
 * await createInvoicePDF(invoiceData, { download: true });
 * await createContractPDF(contractData, { download: true });
 * 
 * // Debug
 * await debugPDFArabic();
 * ```
 * 
 * ARABIC CORRECTNESS LAYER:
 * - rtl(text)  - Wrap Arabic text with RTL markers
 * - ltr(text)  - Wrap LTR content (IDs, numbers) with isolation markers
 * - mix(text)  - Handle mixed Arabic + LTR content automatically
 * 
 * ═════════════════════════════════════════════════════════════════
 */

// ============================================
// PRIMARY EXPORTS (4 FUNCTIONS ONLY)
// ============================================

// 1. Initialize PDF system
export { initPdf, ensurePDFReady } from './core/pdf-core';

// 2. Debug & verify
export { debugPDFArabic } from './core/verify';

// 3. Invoice generator
export { createInvoicePDF } from './templates/invoice.template';

// 4. Contract generator
export { createContractPDF } from './templates/contract.template';

// ============================================
// ARABIC CORRECTNESS LAYER
// ============================================

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
} from './core/arabic';

// ============================================
// SUPPORTING TYPES (for type-safe usage)
// ============================================

// Invoice types
export type {
  InvoiceData,
  InvoiceItem,
  InvoiceCustomer,
  CompanyInfo,
  CreateInvoicePDFOptions,
} from './templates/invoice.template';

// Contract types
export type {
  ContractData,
  ContractParty,
  ContractClause,
  ContractPricing,
  ContractSignatureStatus,
  CreateContractPDFOptions,
} from './templates/contract.template';

// ============================================
// UTILITY EXPORTS (for advanced usage)
// ============================================

// Invoice utilities
export {
  orderToInvoiceData,
  calculateVAT,
  calculateInvoiceTotals,
  generateInvoiceContent,
  // Sample data for testing
  sampleInvoiceArabicOnly,
  sampleInvoiceMixed,
} from './templates/invoice.template';

// Contract utilities
export {
  dbContractToContractData,
  defaultContractClauses,
  generateContractContent,
  // Sample contracts for testing
  sampleContractShort,
  sampleContractLong,
} from './templates/contract.template';

// Arabic text utilities (legacy)
export {
  formatCurrency,
  formatArabicDate,
  toArabicNumerals,
  toWesternNumerals,
  toArabicOrdinal,
} from './core/arabic-utils';

// PDF verification (for diagnostics)
export {
  verifyPDFSystem,
  generateTestPDF,
  runFinalQAGate,
  type PDFVerificationReport,
} from './core/verify';

// Low-level (internal use)
export { ARABIC_FONT_NAME } from './core/fonts';
export { DEFAULT_COMPANY_INFO } from './core/pdf-core';
