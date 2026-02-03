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
 * Combined function: Generate and download invoice as PDF directly
 */
export async function downloadInvoicePdf(data: import('./types').InvoiceData): Promise<boolean> {
  const { normalizeInvoiceData, isLegacyInvoice } = await import('./types');
  const { renderInvoiceHTML } = await import('./invoice-template');
  const { toast } = await import('sonner');
  const html2canvas = (await import('html2canvas')).default;
  const { jsPDF } = await import('jspdf');
  
  try {
    const invoiceNumber = isLegacyInvoice(data) ? data.invoiceNumber : data.invoice_number;
    const normalizedData = normalizeInvoiceData(data);
    
    console.log('[Invoice] Generating PDF for:', invoiceNumber);
    
    // Create hidden container for rendering
    const container = document.createElement('div');
    container.style.cssText = 'position: fixed; left: -9999px; top: 0; width: 800px; background: white;';
    container.innerHTML = renderInvoiceHTML(normalizedData, { showAnimations: false, printMode: true });
    document.body.appendChild(container);
    
    // Wait for fonts to load
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get the invoice container
    const invoiceEl = container.querySelector('.invoice-container') as HTMLElement;
    if (!invoiceEl) throw new Error('Invoice container not found');
    
    // Render to canvas
    const canvas = await html2canvas(invoiceEl, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
    });
    
    // Create PDF
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF({
      orientation: imgHeight > 297 ? 'portrait' : 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const imgData = canvas.toDataURL('image/png', 1.0);
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // Download
    const filename = `invoice-${invoiceNumber}.pdf`;
    pdf.save(filename);
    
    // Cleanup
    document.body.removeChild(container);
    
    console.log('[Invoice] ✅ PDF downloaded:', filename);
    toast.success('تم تحميل الفاتورة بنجاح');
    return true;
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
