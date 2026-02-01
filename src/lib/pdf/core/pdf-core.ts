/**
 * PDF Core - Single Entry Point
 * 
 * This is the ONLY module that should be imported for PDF generation.
 * It provides:
 * - Singleton font initialization
 * - Strict verification before generation
 * - Invoice and contract generation functions
 * 
 * USAGE:
 * ```typescript
 * import { createInvoicePDF, createContractPDF, ensurePDFReady } from '@/lib/pdf';
 * 
 * // Ensure system is ready (call once at app start or before first PDF)
 * await ensurePDFReady();
 * 
 * // Generate PDFs
 * await createInvoicePDF(invoiceData, { download: true });
 * await createContractPDF(contractData, { download: true });
 * ```
 */

import pdfMake from 'pdfmake/build/pdfmake';
import { 
  initializeFonts, 
  assertFontsReady, 
  areFontsInitialized,
  getFontDiagnostics,
  ARABIC_FONT_NAME,
} from './fonts';
import { corporateStyles, createPageFooter, type PDFContent } from './layout';
import { downloadBlob, openBlobInNewTab, blobToDataUrl, blobToBase64 } from './download';
import { verifyPDFSystem, generateTestPDF } from './verify';

// Re-export everything needed
export { 
  // Font utilities
  ARABIC_FONT_NAME,
  initializeFonts,
  assertFontsReady,
  areFontsInitialized,
  getFontDiagnostics,
  
  // Layout utilities
  corporateStyles,
  createPageFooter,
  type PDFContent,
  
  // Download utilities
  downloadBlob,
  openBlobInNewTab,
  blobToDataUrl,
  blobToBase64,
  
  // Verification
  verifyPDFSystem,
  generateTestPDF,
};

// Re-export layout components
export { 
  createRTLTable, 
  createRTLKeyValue, 
  createCompanyHeader, 
  createSeparator,
  createSignatureBlock,
} from './layout';

// Re-export Arabic utilities
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
} from './arabic-utils';

/**
 * Ensure PDF system is ready for generation
 * This MUST be called before any PDF generation
 * 
 * @throws Error if initialization fails
 */
export async function ensurePDFReady(): Promise<void> {
  if (areFontsInitialized()) {
    // Double-check with assertions
    assertFontsReady();
    return;
  }

  console.log('[PDF CORE] Initializing PDF system...');
  
  await initializeFonts();
  
  // Run assertions after initialization
  assertFontsReady();
  
  console.log('[PDF CORE] ✅ PDF system ready');
}

/**
 * Check if PDF system is ready (without throwing)
 */
export function isPDFReady(): boolean {
  try {
    if (!areFontsInitialized()) return false;
    assertFontsReady();
    return true;
  } catch {
    return false;
  }
}

/**
 * Default company information for ASH Holding
 */
export const DEFAULT_COMPANY_INFO = {
  nameAr: 'شركة علي صالح الشهري القابضة',
  nameEn: 'Ali Saleh Al-Shehri Holding Company',
  vatNumber: '300000000000003',
  crNumber: '1010000000',
  addressAr: 'الرياض، المملكة العربية السعودية',
  phone: '+966 11 123 4567',
  email: 'info@ash-holding.sa',
  website: 'www.alialshehriholding.com',
};

/**
 * PDF Document Options
 */
export interface PDFDocumentOptions {
  pageSize?: 'A4' | 'A3' | 'LETTER' | 'LEGAL';
  pageOrientation?: 'portrait' | 'landscape';
  title?: string;
  author?: string;
  subject?: string;
  watermark?: string;
}

/**
 * Create a PDF document definition
 * This is the low-level function used by invoice and contract generators
 */
export function createDocumentDefinition(
  content: PDFContent[],
  options: PDFDocumentOptions = {}
): Record<string, unknown> {
  const {
    pageSize = 'A4',
    pageOrientation = 'portrait',
    title = 'مستند PDF',
    author = DEFAULT_COMPANY_INFO.nameAr,
    subject = '',
    watermark,
  } = options;

  return {
    pageSize,
    pageOrientation,
    pageMargins: [40, 60, 40, 60],

    info: {
      title,
      author,
      subject,
    },

    defaultStyle: {
      font: ARABIC_FONT_NAME,
      fontSize: 11,
      alignment: 'right',
      lineHeight: 1.4,
    },

    styles: {
      ...corporateStyles,
    },

    header: (currentPage: number, pageCount: number) => ({
      columns: [
        {
          text: title,
          font: ARABIC_FONT_NAME,
          fontSize: 9,
          color: '#94a3b8',
          alignment: 'center' as const,
        },
      ],
      margin: [40, 20, 40, 0],
    }),

    footer: createPageFooter(title),

    content,

    ...(watermark ? {
      watermark: {
        text: watermark,
        color: '#e2e8f0',
        opacity: 0.1,
        fontSize: 60,
        angle: -45,
      },
    } : {}),
  };
}

/**
 * Generate PDF blob from content
 */
export async function generatePDFBlob(
  content: PDFContent[],
  options: PDFDocumentOptions = {}
): Promise<Blob> {
  // Ensure system is ready
  await ensurePDFReady();

  const docDefinition = createDocumentDefinition(content, options);
  const pdfDoc = pdfMake.createPdf(docDefinition as never);

  return new Promise((resolve, reject) => {
    try {
      (pdfDoc as { getBlob: (cb: (blob: Blob) => void) => void }).getBlob(resolve);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate and download PDF
 */
export async function generateAndDownloadPDF(
  content: PDFContent[],
  filename: string,
  options: PDFDocumentOptions = {}
): Promise<void> {
  const blob = await generatePDFBlob(content, options);
  downloadBlob(blob, filename);
}

/**
 * Generate and open PDF in new tab
 */
export async function generateAndOpenPDF(
  content: PDFContent[],
  options: PDFDocumentOptions = {}
): Promise<void> {
  const blob = await generatePDFBlob(content, options);
  openBlobInNewTab(blob);
}

/**
 * Generate PDF as data URL (for preview)
 */
export async function generatePDFDataUrl(
  content: PDFContent[],
  options: PDFDocumentOptions = {}
): Promise<string> {
  const blob = await generatePDFBlob(content, options);
  return blobToDataUrl(blob);
}

/**
 * Generate PDF as base64 (for storage)
 */
export async function generatePDFBase64(
  content: PDFContent[],
  options: PDFDocumentOptions = {}
): Promise<string> {
  const blob = await generatePDFBlob(content, options);
  return blobToBase64(blob);
}
