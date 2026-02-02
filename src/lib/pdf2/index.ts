/**
 * PDF2 — PUBLIC API
 * 
 * Single entry point for all PDF functionality.
 * All components should import from here.
 */

// ============ CORE ============
export {
  // pdfmake instance
  pdfMake,
  type PdfDocument,
  type PdfMakeInstance,
  
  // Font management
  FONT_NAME,
  FONT_FILES,
  initializeFonts,
  areFontsReady,
  forceReloadFonts,
  getFontDiagnostics,
  
  // PDF generation
  generatePdfBlob,
  generatePdfDataUrl,
  generatePdfBuffer,
  type DocDefinition,
  type GenerateOptions,
  
  // Download engine
  downloadPdfBlob,
  downloadBlob,
  type DownloadResult,
  type DownloadMethod,
  
  // Branding
  PDF_COLORS,
  PDF_TYPOGRAPHY,
  PDF_SPACING,
  arabicDocumentStyles,
  tableLayouts,
  
  // Bidirectional text
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
  
  // Table utilities
  createRtlTable,
  rtlKeyValue,
  createSummaryBox,
  type TableConfig,
} from './core';

// ============ TEMPLATES ============
export {
  // Invoice
  buildInvoiceDoc,
  calculateInvoiceTotals,
  orderToInvoiceData,
  sampleInvoiceData,
  type InvoiceData,
  type InvoiceItem,
  
  // Contract
  buildContractDoc,
  defaultContractClauses,
  sampleContractData,
  type ContractData,
  type ContractParty,
  type ContractClause,
  
  // Transaction Report
  buildTransactionReportDoc,
  type TransactionSummary,
  type TransactionItem,
  type TransactionReportOptions,
} from './templates';

// ============ COMPONENTS ============
export {
  PdfPreview,
  PdfDownloadButton,
  type PdfPreviewProps,
  type PdfPreviewRef,
  type PdfDownloadButtonProps,
} from './components';

// ============ SERVICES ============
export {
  uploadPdfToStorage,
  getSignedUrl,
  deletePdfFromStorage,
  listPdfs,
  type StorageResult,
  type UploadOptions,
} from './services';

// ============ AUDIT ============
export { runPdfAudit, type AuditReport } from './audit';

// ============ CONVENIENCE FUNCTIONS ============

/**
 * Generate and download invoice PDF
 */
export async function downloadInvoicePdf(data: import('./templates').InvoiceData): Promise<boolean> {
  const { buildInvoiceDoc } = await import('./templates');
  const { generatePdfBlob, downloadPdfBlob } = await import('./core');
  
  try {
    const doc = buildInvoiceDoc(data);
    const blob = await generatePdfBlob(doc);
    const filename = `invoice-${data.invoiceNumber}.pdf`;
    const result = downloadPdfBlob(blob, filename);
    return result.success;
  } catch (error) {
    console.error('[PDF2] Invoice download failed:', error);
    return false;
  }
}

/**
 * Generate and download contract PDF
 */
export async function downloadContractPdf(data: import('./templates').ContractData): Promise<boolean> {
  const { buildContractDoc } = await import('./templates');
  const { generatePdfBlob, downloadPdfBlob } = await import('./core');
  
  try {
    const doc = buildContractDoc(data);
    const blob = await generatePdfBlob(doc);
    const filename = `contract-${data.contractNumber}.pdf`;
    const result = downloadPdfBlob(blob, filename);
    return result.success;
  } catch (error) {
    console.error('[PDF2] Contract download failed:', error);
    return false;
  }
}

/**
 * Generate and download transaction report PDF
 */
export async function downloadTransactionReportPdf(
  summary: import('./templates').TransactionSummary,
  options?: import('./templates').TransactionReportOptions
): Promise<boolean> {
  const { buildTransactionReportDoc } = await import('./templates');
  const { generatePdfBlob, downloadPdfBlob } = await import('./core');
  
  try {
    const doc = buildTransactionReportDoc(summary, options);
    const blob = await generatePdfBlob(doc);
    const filename = `transactions-${summary.startDate}-${summary.endDate}.pdf`;
    const result = downloadPdfBlob(blob, filename);
    return result.success;
  } catch (error) {
    console.error('[PDF2] Transaction report download failed:', error);
    return false;
  }
}

// ============ LEGACY ALIASES (for backward compatibility) ============
export { buildInvoiceDoc as buildInvoiceDocDefinition } from './templates';
export { buildContractDoc as buildContractDocDefinition } from './templates';
export { buildTransactionReportDoc as buildTransactionReportDocDefinition } from './templates';
export { downloadPdfBlob as safeDownloadPdf } from './core';
export { generatePdfBlob as createPdfBlob } from './core';
export { generatePdfDataUrl as createPdfDataUrl } from './core';
export { initializeFonts as ensurePdfReady } from './core';
export { arabicDocumentStyles as arabicDefaultStyles } from './core';

// Legacy function alias
export async function createTransactionReportPDF(
  summary: import('./templates').TransactionSummary,
  options?: { language?: 'ar' | 'en'; download?: boolean }
): Promise<Blob> {
  const { buildTransactionReportDoc } = await import('./templates');
  const { generatePdfBlob, downloadPdfBlob } = await import('./core');
  
  const doc = buildTransactionReportDoc(summary, options);
  const blob = await generatePdfBlob(doc);
  
  if (options?.download) {
    const filename = `transactions-report-${summary.startDate}-${summary.endDate}.pdf`;
    downloadPdfBlob(blob, filename);
  }
  
  return blob;
}
