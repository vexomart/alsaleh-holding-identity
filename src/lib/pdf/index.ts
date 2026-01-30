/**
 * Arabic PDF Generation Module
 * 
 * A complete PDF generation solution with full RTL and Arabic language support.
 * 
 * Features:
 * - 100% RTL layout (text direction, alignment, margins)
 * - Proper Arabic shaping and ligatures
 * - Arabic/Hindi numerals support
 * - RTL tables with correct column order
 * - RTL headers and footers
 * - Invoice, Report, and Contract generators
 * 
 * Usage:
 * ```typescript
 * import { createInvoicePDF, createReportPDF, createContractPDF } from '@/lib/pdf';
 * 
 * // Generate Invoice
 * await createInvoicePDF(invoiceData, { download: true });
 * 
 * // Generate Report
 * await createReportPDF(reportData, { download: true });
 * 
 * // Generate Contract
 * await createContractPDF(contractData, { download: true });
 * ```
 */

// Core PDF utilities
export {
  ArabicPDFGenerator,
  arabicPDF,
  createRTLTable,
  createRTLKeyValue,
  createRTLHeader,
  createRTLFooter,
  toArabicNumerals,
  toWesternNumerals,
  formatArabicCurrency,
  formatArabicDate,
  rtlStyles,
  type ArabicPDFConfig,
} from './arabic-pdf';

// Invoice generator
export {
  generateInvoiceContent,
  createInvoicePDF,
  type InvoiceData,
  type InvoiceItem,
} from './invoice-generator';

// Report generator
export {
  generateReportContent,
  createReportPDF,
  type ReportData,
  type ReportSection,
  type ReportTable,
  type ReportChart,
} from './report-generator';

// Contract generator
export {
  generateContractContent,
  createContractPDF,
  type ContractData,
  type ContractParty,
  type ContractClause,
} from './contract-generator';

// Sample data generators for testing
export { generateSampleInvoice, generateSampleReport, generateSampleContract } from './samples';
