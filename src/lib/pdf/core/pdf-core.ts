/**
 * PDF Core - Single Entry Point
 * 
 * This is the ONLY module that should be imported for PDF generation.
 * It provides:
 * - Singleton font initialization (initPdf)
 * - Strict verification before generation
 * - Invoice and contract generation functions
 * 
 * USAGE:
 * ```typescript
 * import { createInvoicePDF, createContractPDF, initPdf } from '@/lib/pdf';
 * 
 * // Initialize (auto-called by generators)
 * await initPdf();
 * 
 * // Generate PDFs
 * await createInvoicePDF(invoiceData, { download: true });
 * await createContractPDF(contractData, { download: true });
 * ```
 */

import { 
  initializeFonts, 
  assertFontsReady, 
  areFontsInitialized,
  getFontDiagnostics,
  ARABIC_FONT_NAME,
  pdfMakeInstance, // Use singleton instance
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
 * Initialize PDF system (singleton)
 * MUST be called before any PDF generation.
 * Auto-called by createInvoicePDF/createContractPDF.
 * 
 * @throws Error if Cairo fonts cannot be loaded
 */
export async function initPdf(): Promise<void> {
  if (areFontsInitialized()) {
    // Double-check with assertions
    assertFontsReady();
    return;
  }

  console.log('[PDF CORE] Initializing PDF system...');
  
  await initializeFonts();
  
  // Run assertions after initialization - throws if Cairo missing
  assertFontsReady();
  
  // Dev mode diagnostics
  if (import.meta.env.DEV) {
    const diag = getFontDiagnostics();
    console.log('═══════════════════════════════════════════');
    console.log('[PDF CORE] ✅ INITIALIZATION COMPLETE');
    console.log('───────────────────────────────────────────');
    console.log('Engine:         pdfmake');
    console.log('Font:           Cairo (Arabic RTL)');
    console.log('VFS Keys:       ' + diag.vfsKeys.length);
    console.log('Registered:     ' + diag.registeredFonts.join(', '));
    console.log('Cairo Regular:  ' + (diag.cairoRegularSize / 1024).toFixed(1) + ' KB');
    console.log('Cairo Bold:     ' + (diag.cairoBoldSize / 1024).toFixed(1) + ' KB');
    console.log('═══════════════════════════════════════════');
  } else {
    console.log('[PDF CORE] ✅ PDF system ready');
  }
}

/**
 * @deprecated Use initPdf() instead
 */
export const ensurePDFReady = initPdf;

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
  // Initialize PDF system (auto-init)
  await initPdf();

  const docDefinition = createDocumentDefinition(content, options);
  const pdfDoc = pdfMakeInstance.createPdf(docDefinition);

  return new Promise((resolve, reject) => {
    try {
      pdfDoc.getBlob(resolve);
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
