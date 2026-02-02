/**
 * PDF RENDER — SINGLE createPdf CALL POINT
 * 
 * THIS IS THE ONLY FILE THAT CALLS pdfMake.createPdf()
 * All other modules must use this file for PDF generation.
 * 
 * FIXES: "Parameter 'options' has an invalid type" error
 * by NOT passing extra parameters to createPdf.
 */

import pdfMake from './pdfmake';
import { ensurePdfReady, assertCairoFonts, ARABIC_FONT_NAME } from './pdf-init';

// Use generic type for docDefinition to avoid import issues
export type DocDefinition = Record<string, unknown>;

/**
 * Create PDF blob from document definition
 * 
 * @param docDefinition - pdfmake document definition
 * @returns Promise<Blob> - PDF as blob
 */
export async function createPdfBlob(docDefinition: DocDefinition): Promise<Blob> {
  // STEP 1: Initialize fonts (singleton)
  await ensurePdfReady();

  // STEP 2: Hard assertion before generation
  assertCairoFonts();

  console.log('[PDF RENDER] Creating PDF document...');

  return new Promise((resolve, reject) => {
    let settled = false;
    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error('PDF_GENERATION_TIMEOUT: تجاوز المهلة (30 ثانية)'));
    }, 30000);

    // Handle unhandled rejections from pdfmake
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const message = String(event.reason?.message || event.reason || '');
      if (message.includes('virtual file system') || message.includes('Cairo')) {
        event.preventDefault?.();
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        window.removeEventListener('unhandledrejection', onUnhandledRejection);
        reject(new Error('PDF_FONT_ERROR: ' + message));
      }
    };

    try {
      window.addEventListener('unhandledrejection', onUnhandledRejection);

      // CRITICAL: Call createPdf with ONLY docDefinition
      // DO NOT pass null/undefined/extra parameters — this causes the "options invalid type" error
      const pdfDoc = pdfMake.createPdf(docDefinition);

      // Get blob
      pdfDoc.getBlob((blob: Blob) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        window.removeEventListener('unhandledrejection', onUnhandledRejection);

        if (blob && blob.size > 0) {
          console.log('[PDF RENDER] ✅ PDF blob created, size:', blob.size);
          resolve(blob);
        } else {
          reject(new Error('PDF_EMPTY_BLOB: الملف فارغ'));
        }
      });

    } catch (error) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
      console.error('[PDF RENDER] ❌ createPdf failed:', error);
      reject(error);
    }
  });
}

/**
 * Create a base document definition with Arabic defaults
 */
export function createBaseDocDefinition(
  content: unknown[],
  options: {
    title?: string;
    pageSize?: 'A4' | 'A3' | 'LETTER';
    pageOrientation?: 'portrait' | 'landscape';
    pageMargins?: [number, number, number, number];
    watermark?: string;
  } = {}
): DocDefinition {
  const {
    title = 'مستند PDF',
    pageSize = 'A4',
    pageOrientation = 'portrait',
    pageMargins = [40, 60, 40, 60],
    watermark,
  } = options;

  return {
    pageSize,
    pageOrientation,
    pageMargins,
    info: {
      title,
      author: 'الصالح القابضة',
    },
    defaultStyle: {
      font: ARABIC_FONT_NAME,
      fontSize: 11,
      alignment: 'right',
      lineHeight: 1.4,
    },
    styles: {
      header: { fontSize: 24, bold: true, alignment: 'center', margin: [0, 0, 0, 20] },
      subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
      tableHeader: { bold: true, fontSize: 11, fillColor: '#f1f5f9' },
      ltr: { alignment: 'left' },
    },
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
