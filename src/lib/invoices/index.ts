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
 * Combined function: Generate and download invoice as PDF directly (single page)
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
    
    // Create container for rendering - fit to A4 single page
    const container = document.createElement('div');
    container.style.cssText = `
      position: absolute;
      left: -9999px;
      top: 0;
      width: 794px;
      background: white;
      z-index: -1;
    `;
    container.innerHTML = renderInvoiceHTML(normalizedData, { showAnimations: false, printMode: true });
    document.body.appendChild(container);
    
    // Wait for fonts to load
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 600));
    
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
    
    console.log('[Invoice] Canvas size:', canvas.width, 'x', canvas.height);
    
    // A4 dimensions in mm
    const pageWidth = 210;
    const pageHeight = 297;
    
    // Calculate dimensions to fit content in single page
    const imgRatio = canvas.width / canvas.height;
    const pageRatio = pageWidth / pageHeight;
    
    let imgWidth: number;
    let imgHeight: number;
    let offsetX = 0;
    let offsetY = 0;
    
    if (imgRatio > pageRatio) {
      // Content is wider - fit to width
      imgWidth = pageWidth;
      imgHeight = pageWidth / imgRatio;
      offsetY = (pageHeight - imgHeight) / 2;
    } else {
      // Content is taller - fit to height
      imgHeight = pageHeight;
      imgWidth = pageHeight * imgRatio;
      offsetX = (pageWidth - imgWidth) / 2;
    }
    
    // Create PDF - single page
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const imgData = canvas.toDataURL('image/png', 1.0);
    pdf.addImage(imgData, 'PNG', offsetX, offsetY, imgWidth, imgHeight);
    
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

// Contract PDF download - using HTML template like invoice
export async function downloadContractPdf(data: import('./types').ContractData): Promise<boolean> {
  const { renderServiceContractHTML } = await import('@/lib/contracts/service-contract-template');
  const { toast } = await import('sonner');
  const html2canvas = (await import('html2canvas')).default;
  const { jsPDF } = await import('jspdf');
  
  try {
    console.log('[Contract] Generating PDF for:', data.contractNumber);
    
    // Create container for rendering
    const container = document.createElement('div');
    container.style.cssText = `
      position: absolute;
      left: -9999px;
      top: 0;
      width: 794px;
      background: white;
      z-index: -1;
    `;
    container.innerHTML = renderServiceContractHTML(data, { showAnimations: false, printMode: true });
    document.body.appendChild(container);
    
    // Wait for fonts to load
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Get the contract container
    const contractEl = container.querySelector('.contract-container') as HTMLElement;
    if (!contractEl) throw new Error('Contract container not found');
    
    // Render to canvas
    const canvas = await html2canvas(contractEl, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
    });
    
    console.log('[Contract] Canvas size:', canvas.width, 'x', canvas.height);
    
    // A4 dimensions in mm
    const pageWidth = 210;
    const pageHeight = 297;
    
    // Calculate dimensions to fit content in single page
    const imgRatio = canvas.width / canvas.height;
    const pageRatio = pageWidth / pageHeight;
    
    let imgWidth: number;
    let imgHeight: number;
    let offsetX = 0;
    let offsetY = 0;
    
    if (imgRatio > pageRatio) {
      imgWidth = pageWidth;
      imgHeight = pageWidth / imgRatio;
      offsetY = (pageHeight - imgHeight) / 2;
    } else {
      imgHeight = pageHeight;
      imgWidth = pageHeight * imgRatio;
      offsetX = (pageWidth - imgWidth) / 2;
    }
    
    // Create PDF - single page
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const imgData = canvas.toDataURL('image/png', 1.0);
    pdf.addImage(imgData, 'PNG', offsetX, offsetY, imgWidth, imgHeight);
    
    // Download
    const filename = `contract-${data.contractNumber}.pdf`;
    pdf.save(filename);
    
    // Cleanup
    document.body.removeChild(container);
    
    console.log('[Contract] ✅ PDF downloaded:', filename);
    toast.success('تم تحميل العقد بنجاح');
    return true;
  } catch (error) {
    console.error('[Contract] Download failed:', error);
    toast.error('فشل تحميل العقد');
    return false;
  }
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
