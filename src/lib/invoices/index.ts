/**
 * INVOICES MODULE
 * Clean export for invoice PDF generation system
 * Now using HTML template like disbursement voucher
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

// HTML Template System (NEW - Like Voucher)
export {
  renderInvoiceHTML,
  previewInvoice,
  downloadInvoiceAsHtml,
  printInvoice,
  type InvoiceRenderOptions,
} from './invoice-template';

// Legacy PDF Component (kept for backward compatibility)
export { InvoicePdf } from './InvoicePdf';
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
 * Combined function: Generate and download invoice (HTML version - like voucher)
 */
export async function downloadInvoicePdf(data: import('./types').InvoiceData): Promise<boolean> {
  const { normalizeInvoiceData, isLegacyInvoice } = await import('./types');
  const { downloadInvoiceAsHtml, previewInvoice } = await import('./invoice-template');
  const { toast } = await import('sonner');
  
  try {
    const invoiceNumber = isLegacyInvoice(data) ? data.invoiceNumber : data.invoice_number;
    const normalizedData = normalizeInvoiceData(data);
    
    console.log('[Invoice] Opening invoice preview for:', invoiceNumber);
    
    // Open in preview window (same as voucher behavior)
    const win = previewInvoice(normalizedData);
    
    if (win) {
      toast.success('تم فتح الفاتورة - يمكنك الطباعة أو الحفظ كـ PDF');
      return true;
    } else {
      // Fallback to HTML download
      downloadInvoiceAsHtml(normalizedData);
      toast.success('تم تحميل الفاتورة');
      return true;
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
