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
    
    // Create visible container for proper rendering
    const container = document.createElement('div');
    container.style.cssText = `
      position: absolute;
      left: -9999px;
      top: 0;
      width: 794px;
      min-height: 1123px;
      background: white;
      overflow: visible;
      z-index: -1;
    `;
    container.innerHTML = renderInvoiceHTML(normalizedData, { showAnimations: false, printMode: true });
    document.body.appendChild(container);
    
    // Wait for fonts and images to load
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get the invoice container
    const invoiceEl = container.querySelector('.invoice-container') as HTMLElement;
    if (!invoiceEl) throw new Error('Invoice container not found');
    
    // Force layout recalculation
    invoiceEl.style.width = '794px';
    invoiceEl.style.maxWidth = 'none';
    invoiceEl.style.overflow = 'visible';
    
    // Get actual height
    const actualHeight = invoiceEl.scrollHeight;
    console.log('[Invoice] Content height:', actualHeight);
    
    // Render to canvas with full height
    const canvas = await html2canvas(invoiceEl, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
      width: 794,
      height: actualHeight,
      windowWidth: 794,
      windowHeight: actualHeight,
      scrollX: 0,
      scrollY: 0,
    });
    
    console.log('[Invoice] Canvas size:', canvas.width, 'x', canvas.height);
    
    // A4 dimensions in mm
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 10;
    
    // Calculate image dimensions
    const imgWidth = pageWidth - (margin * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Handle multi-page if content is too long
    const usablePageHeight = pageHeight - (margin * 2);
    
    if (imgHeight <= usablePageHeight) {
      // Single page
      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
    } else {
      // Multi-page
      const imgData = canvas.toDataURL('image/png', 1.0);
      let heightLeft = imgHeight;
      let position = margin;
      let page = 0;
      
      while (heightLeft > 0) {
        if (page > 0) {
          pdf.addPage();
          position = margin;
        }
        
        const sourceY = page * usablePageHeight * (canvas.height / imgHeight);
        const sourceHeight = Math.min(usablePageHeight * (canvas.height / imgHeight), canvas.height - sourceY);
        const destHeight = Math.min(usablePageHeight, heightLeft);
        
        pdf.addImage(imgData, 'PNG', margin, position - (page * usablePageHeight), imgWidth, imgHeight);
        
        heightLeft -= usablePageHeight;
        page++;
      }
    }
    
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
