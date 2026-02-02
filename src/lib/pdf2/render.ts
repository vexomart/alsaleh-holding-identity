/**
 * PDF RENDER — THE ONLY FILE THAT CALLS createPdf
 * 
 * ALL PDF generation MUST go through this file.
 * NO OTHER FILE may call pdfMake.createPdf().
 */

import pdfMake from './pdfmake';
import { ensurePdfReady, assertFontsReady, getFontDiagnostics, forceReloadFonts } from './init';

// Type for pdfmake document definition
export interface DocDefinition {
  content: unknown[];
  defaultStyle?: Record<string, unknown>;
  styles?: Record<string, unknown>;
  pageSize?: string;
  pageOrientation?: 'portrait' | 'landscape';
  pageMargins?: number[];
  info?: {
    title?: string;
    author?: string;
    subject?: string;
  };
  footer?: (currentPage: number, pageCount: number) => unknown;
  header?: (currentPage: number, pageCount: number) => unknown;
  [key: string]: unknown;
}

/**
 * Create PDF blob from document definition
 * 
 * THIS IS THE ONLY PLACE WHERE createPdf IS CALLED.
 * 
 * @param docDefinition - pdfmake document definition
 * @returns Promise<Blob> - PDF as Blob
 */
export async function createPdfBlob(docDefinition: DocDefinition): Promise<Blob> {
  console.log('[PDF2 RENDER] Starting PDF generation...');
  
  // 1. Ensure fonts are loaded
  try {
    await ensurePdfReady();
  } catch (error) {
    console.error('[PDF2 RENDER] Font initialization failed, attempting force reload...');
    await forceReloadFonts();
  }
  
  // 2. Assert fonts before generation
  const diagnostics = getFontDiagnostics();
  console.log('[PDF2 RENDER] Font diagnostics:', diagnostics);
  
  try {
    assertFontsReady();
  } catch (error) {
    console.error('[PDF2 RENDER] Font assertion failed, force reloading...');
    await forceReloadFonts();
    assertFontsReady(); // If this fails again, let it throw
  }
  
  // 3. Generate PDF with timeout
  return new Promise<Blob>((resolve, reject) => {
    const timeout = setTimeout(() => {
      console.error('[PDF2 RENDER] Generation timeout after 30s');
      reject(new Error('PDF_GENERATE_TIMEOUT: Generation took too long'));
    }, 30000);
    
    try {
      console.log('[PDF2 RENDER] Calling pdfMake.createPdf...');
      
      // CRITICAL: Call createPdf with ONLY docDefinition
      // DO NOT pass any second parameter — causes "options invalid type" error
      const pdfDoc = pdfMake.createPdf(docDefinition);
      
      console.log('[PDF2 RENDER] PDF document created, getting blob...');
      
      // Get blob
      pdfDoc.getBlob((blob: Blob) => {
        clearTimeout(timeout);
        
        console.log('[PDF2 RENDER] Blob received:', blob?.size, 'bytes');
        
        // Validate blob
        if (!blob || blob.size < 1000) {
          reject(new Error(`PDF_GENERATE_FAILED: Invalid blob (size: ${blob?.size || 0})`));
          return;
        }
        
        // Ensure correct MIME type
        const finalBlob = blob.type === 'application/pdf' 
          ? blob 
          : new Blob([blob], { type: 'application/pdf' });
        
        console.log('[PDF2 RENDER] ✅ PDF generated successfully:', finalBlob.size, 'bytes');
        resolve(finalBlob);
      });
      
    } catch (error) {
      clearTimeout(timeout);
      console.error('[PDF2 RENDER] createPdf error:', error);
      reject(new Error(`PDF_GENERATE_FAILED: ${error instanceof Error ? error.message : String(error)}`));
    }
  });
}

/**
 * Create PDF and get as base64 data URL
 */
export async function createPdfDataUrl(docDefinition: DocDefinition): Promise<string> {
  const blob = await createPdfBlob(docDefinition);
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('PDF_CONVERT_FAILED: Could not convert to data URL'));
    reader.readAsDataURL(blob);
  });
}
