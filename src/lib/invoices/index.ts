/**
 * INVOICES MODULE
 * Clean export for invoice PDF generation system
 */

// Types
export type {
  InvoiceData,
  InvoiceDataNew,
  InvoiceDataLegacy,
  InvoiceItem,
  InvoiceTotals,
  SellerInfo,
  BuyerInfo,
  ContractData,
  TransactionSummary,
  TransactionItem,
} from './types';

export { isLegacyInvoice, normalizeInvoiceData } from './types';

// Utilities
export {
  calculateInvoiceTotals,
  calculateLineTotal,
  formatCurrency,
  formatArabicDate,
  formatShortDate,
  orderToInvoiceData,
  generateSampleInvoice,
  DEFAULT_VAT_RATE,
} from './invoice-utils';

// RTL Helpers
export {
  forceRtlText,
  keepLtrToken,
  formatMoneySAR,
  formatPercentage,
  formatPhoneLtr,
  formatEmailLtr,
  formatInvoiceNumber,
  formatDateAr,
  formatDateShortLtr,
  containsArabic,
  smartDirection,
} from './rtl';

// PDF Component
export { InvoicePdf } from './InvoicePdf';

// Generator
export { generateInvoicePdf, generateInvoicePdfDataUrl } from './generateInvoicePdf';

// Download
export { downloadBlob, downloadInvoiceFile, type DownloadResult, type DownloadMethod } from './download';

// Audit
export {
  runPdfAudit,
  generateSampleInvoiceAr,
  generateSampleInvoiceMixed,
  generateSampleInvoiceWithContract,
  generateSampleInvoiceMultiItems,
  type AuditResult,
  type AuditReport,
} from './audit';

/**
 * Combined function: Generate and download invoice PDF
 */
export async function downloadInvoicePdf(data: import('./types').InvoiceData): Promise<boolean> {
  const { generateInvoicePdf } = await import('./generateInvoicePdf');
  const { downloadBlob } = await import('./download');
  const { isLegacyInvoice } = await import('./types');
  const { toast } = await import('sonner');
  
  try {
    const invoiceNumber = isLegacyInvoice(data) ? data.invoiceNumber : data.invoice_number;
    console.log('[Invoice] Generating PDF for:', invoiceNumber);
    
    const blob = await generateInvoicePdf(data);
    const result = downloadBlob(blob, `فاتورة-${invoiceNumber}.pdf`);
    
    if (result.success) {
      toast.success('تم تحميل الفاتورة بنجاح');
      return true;
    } else {
      throw new Error(result.error || 'Download failed');
    }
  } catch (error) {
    console.error('[Invoice] Download failed:', error);
    toast.error('فشل تحميل الفاتورة');
    return false;
  }
}

// Backward compatibility exports for contracts (stub for now)
export async function downloadContractPdf(data: import('./types').ContractData): Promise<boolean> {
  const { toast } = await import('sonner');
  toast.info('تحميل العقود قيد التطوير');
  console.log('[Contract] PDF download requested:', data.contractNumber);
  return false;
}

// Transaction report stub
export async function createTransactionReportPDF(
  summary: import('./types').TransactionSummary,
  options?: { language?: 'ar' | 'en'; download?: boolean }
): Promise<boolean> {
  const { toast } = await import('sonner');
  toast.info('تقرير المعاملات قيد التطوير');
  console.log('[Transaction Report] PDF requested:', summary);
  return false;
}
