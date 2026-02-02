/**
 * PDF GENERATION ENGINE
 * 
 * Single point for all PDF generation. All templates go through here.
 */

import { pdfMake, type PdfDocument } from './pdfmake-instance';
import { initializeFonts, areFontsReady, forceReloadFonts, getFontDiagnostics } from './fonts';

// Document definition type
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

// Generation options
export interface GenerateOptions {
  timeout?: number;  // Default: 60000ms
  retries?: number;  // Default: 1
}

const DEFAULT_TIMEOUT = 60000; // 60 seconds

/**
 * Generate PDF blob from document definition
 */
export async function generatePdfBlob(
  docDefinition: DocDefinition,
  options: GenerateOptions = {}
): Promise<Blob> {
  const { timeout = DEFAULT_TIMEOUT, retries = 1 } = options;
  
  console.log('[PDF GEN] Starting generation...');
  
  // Ensure fonts are ready
  if (!areFontsReady()) {
    console.log('[PDF GEN] Fonts not ready, initializing...');
    try {
      await initializeFonts();
    } catch {
      console.warn('[PDF GEN] Font init failed, force reloading...');
      await forceReloadFonts();
    }
  }
  
  // Verify fonts
  const diag = getFontDiagnostics();
  console.log('[PDF GEN] Font status:', diag);
  
  if (!areFontsReady()) {
    throw new Error('PDF_FONTS_NOT_READY: Cairo fonts failed to initialize');
  }
  
  // Generate with retries
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const blob = await generateWithTimeout(docDefinition, timeout);
      console.log(`[PDF GEN] ✅ Success: ${blob.size} bytes`);
      return blob;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`[PDF GEN] Attempt ${attempt + 1} failed:`, lastError.message);
      
      // On timeout, try force reload fonts
      if (lastError.message.includes('TIMEOUT') && attempt < retries) {
        await forceReloadFonts();
      }
    }
  }
  
  throw lastError || new Error('PDF_GENERATE_FAILED: Unknown error');
}

/**
 * Internal: Generate with timeout protection
 */
function generateWithTimeout(docDefinition: DocDefinition, timeout: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    let settled = false;
    
    const timeoutId = setTimeout(() => {
      if (!settled) {
        settled = true;
        console.error(`[PDF GEN] TIMEOUT after ${timeout}ms`);
        reject(new Error(`PDF_GENERATE_TIMEOUT: Exceeded ${timeout}ms`));
      }
    }, timeout);
    
    try {
      console.log('[PDF GEN] Creating PDF document...');
      
      // Create PDF - ONLY pass docDefinition (no second parameter!)
      const pdfDoc: PdfDocument = pdfMake.createPdf(docDefinition);
      
      console.log('[PDF GEN] Extracting blob...');
      
      // Extract blob
      pdfDoc.getBlob((blob: Blob) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        
        console.log(`[PDF GEN] Blob received: ${blob?.size || 0} bytes`);
        
        if (!blob || blob.size < 500) {
          reject(new Error(`PDF_GENERATE_FAILED: Invalid blob size (${blob?.size || 0})`));
          return;
        }
        
        // Ensure MIME type
        const finalBlob = blob.type === 'application/pdf'
          ? blob
          : new Blob([blob], { type: 'application/pdf' });
        
        resolve(finalBlob);
      });
      
    } catch (error) {
      if (!settled) {
        settled = true;
        clearTimeout(timeoutId);
        const msg = error instanceof Error ? error.message : String(error);
        reject(new Error(`PDF_GENERATE_FAILED: ${msg}`));
      }
    }
  });
}

/**
 * Generate PDF as data URL (base64)
 */
export async function generatePdfDataUrl(
  docDefinition: DocDefinition,
  options?: GenerateOptions
): Promise<string> {
  const blob = await generatePdfBlob(docDefinition, options);
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('PDF_DATAURL_FAILED'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Generate PDF as ArrayBuffer
 */
export async function generatePdfBuffer(
  docDefinition: DocDefinition,
  options?: GenerateOptions
): Promise<ArrayBuffer> {
  const blob = await generatePdfBlob(docDefinition, options);
  return blob.arrayBuffer();
}
