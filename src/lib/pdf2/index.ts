/**
 * PDF2 — PUBLIC API
 * 
 * This is the ONLY entry point for PDF functionality.
 * All components must import from here.
 */

// Initialization
export { ensurePdfReady, assertFontsReady, getFontDiagnostics, FONT_NAME } from './init';

// Rendering (the ONLY place createPdf is called)
export { createPdfBlob, createPdfDataUrl, type DocDefinition } from './render';

// Download
export { safeDownloadPdf, downloadBlob, type DownloadResult, type DownloadMethod } from './download';

// Arabic helpers
export { 
  rtl, 
  ltr, 
  rtlText, 
  ltrToken, 
  formatCurrency, 
  formatArabicDate, 
  toArabicNumerals,
  createRtlTable,
  rtlKeyValue,
  containsArabic,
  arabicDefaultStyles,
} from './arabic';

// Templates
export { 
  buildInvoiceDocDefinition, 
  calculateTotals as calculateInvoiceTotals,
  orderToInvoiceData,
  sampleInvoiceData,
  type InvoiceData,
  type InvoiceItem,
} from './templates/invoice';

export { 
  buildContractDocDefinition, 
  defaultContractClauses,
  sampleContractData,
  type ContractData,
  type ContractParty,
  type ContractClause,
} from './templates/contract';

// Transaction Report
export {
  buildTransactionReportDocDefinition,
  createTransactionReportPDF,
  type TransactionSummary,
  type TransactionItem,
} from './templates/transaction-report';

// Debug (only exposed in development)
export { debugArabicPdfSystem, generateGoldenPack } from './debug';

/**
 * Convenience function: Generate and download invoice PDF
 */
export async function downloadInvoicePdf(data: import('./templates/invoice').InvoiceData): Promise<boolean> {
  const { buildInvoiceDocDefinition } = await import('./templates/invoice');
  const { createPdfBlob } = await import('./render');
  const { safeDownloadPdf } = await import('./download');
  
  try {
    const doc = buildInvoiceDocDefinition(data);
    const blob = await createPdfBlob(doc);
    const filename = `invoice-${data.invoiceNumber}.pdf`;
    const result = safeDownloadPdf(blob, filename);
    return result.ok;
  } catch (error) {
    console.error('[PDF2] Invoice download failed:', error);
    return false;
  }
}

/**
 * Convenience function: Generate and download contract PDF
 */
export async function downloadContractPdf(data: import('./templates/contract').ContractData): Promise<boolean> {
  const { buildContractDocDefinition } = await import('./templates/contract');
  const { createPdfBlob } = await import('./render');
  const { safeDownloadPdf } = await import('./download');
  
  try {
    const doc = buildContractDocDefinition(data);
    const blob = await createPdfBlob(doc);
    const filename = `contract-${data.contractNumber}.pdf`;
    const result = safeDownloadPdf(blob, filename);
    return result.ok;
  } catch (error) {
    console.error('[PDF2] Contract download failed:', error);
    return false;
  }
}
