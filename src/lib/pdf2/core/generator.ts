/**
 * PDF GENERATION ENGINE
 * 
 * Single point for all PDF generation. All templates go through here.
 * FIXED: Added getBuffer fallback and proper error handling.
 */

import { pdfMake, type PdfDocument } from './pdfmake-instance';
import { initializeFonts, areFontsReady, forceReloadFonts, getFontDiagnostics, FONT_NAME } from './fonts';

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
  timeout?: number;  // Default: 30000ms
  retries?: number;  // Default: 2
}

const DEFAULT_TIMEOUT = 30000; // 30 seconds (reduced for faster failure detection)
const DEFAULT_RETRIES = 2;

/**
 * Validate document definition before generation
 */
function validateDocDefinition(doc: DocDefinition): void {
  if (!doc) {
    throw new Error('PDF_INVALID_DOC: Document definition is null');
  }
  if (!doc.content || !Array.isArray(doc.content)) {
    throw new Error('PDF_INVALID_DOC: content must be an array');
  }
  if (doc.defaultStyle?.font && doc.defaultStyle.font !== FONT_NAME) {
    console.warn(`[PDF GEN] Warning: defaultStyle.font is ${doc.defaultStyle.font}, expected ${FONT_NAME}`);
  }
}

/**
 * Generate PDF blob from document definition
 */
export async function generatePdfBlob(
  docDefinition: DocDefinition,
  options: GenerateOptions = {}
): Promise<Blob> {
  const { timeout = DEFAULT_TIMEOUT, retries = DEFAULT_RETRIES } = options;
  
  console.log('[PDF GEN] Starting generation...');
  
  // Validate document
  validateDocDefinition(docDefinition);
  
  // Ensure fonts are ready
  if (!areFontsReady()) {
    console.log('[PDF GEN] Fonts not ready, initializing...');
    try {
      await initializeFonts();
    } catch (err) {
      console.warn('[PDF GEN] Font init failed, force reloading...', err);
      await forceReloadFonts();
    }
  }
  
  // Verify fonts after initialization
  const diag = getFontDiagnostics();
  console.log('[PDF GEN] Font status:', diag);
  
  if (!areFontsReady()) {
    throw new Error('PDF_FONTS_NOT_READY: Cairo fonts failed to initialize');
  }
  
  // Generate with retries
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(`[PDF GEN] Attempt ${attempt + 1}/${retries + 1}...`);
      const blob = await generateWithTimeout(docDefinition, timeout);
      console.log(`[PDF GEN] ✅ Success: ${blob.size} bytes`);
      return blob;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`[PDF GEN] Attempt ${attempt + 1} failed:`, lastError.message);
      
      // On timeout or font error, try force reload fonts
      if ((lastError.message.includes('TIMEOUT') || lastError.message.includes('FONT')) && attempt < retries) {
        console.log('[PDF GEN] Reloading fonts before retry...');
        await forceReloadFonts();
      }
    }
  }
  
  throw lastError || new Error('PDF_GENERATE_FAILED: Unknown error');
}

/**
 * Internal: Generate with timeout protection
 * Uses getBlob with getBuffer fallback
 */
function generateWithTimeout(docDefinition: DocDefinition, timeout: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    let settled = false;
    let pdfDoc: PdfDocument | null = null;
    
    const timeoutId = setTimeout(() => {
      if (!settled) {
        settled = true;
        console.error(`[PDF GEN] TIMEOUT after ${timeout}ms`);
        reject(new Error(`PDF_GENERATE_TIMEOUT: Exceeded ${timeout}ms`));
      }
    }, timeout);
    
    const cleanup = () => {
      clearTimeout(timeoutId);
    };
    
    const handleSuccess = (blob: Blob) => {
      if (settled) return;
      settled = true;
      cleanup();
      
      console.log(`[PDF GEN] Blob received: ${blob?.size || 0} bytes`);
      
      if (!blob || blob.size < 100) {
        reject(new Error(`PDF_GENERATE_FAILED: Invalid blob size (${blob?.size || 0})`));
        return;
      }
      
      // Ensure MIME type
      const finalBlob = blob.type === 'application/pdf'
        ? blob
        : new Blob([blob], { type: 'application/pdf' });
      
      resolve(finalBlob);
    };
    
    const handleError = (error: unknown) => {
      if (settled) return;
      settled = true;
      cleanup();
      const msg = error instanceof Error ? error.message : String(error);
      reject(new Error(`PDF_GENERATE_FAILED: ${msg}`));
    };
    
    try {
      console.log('[PDF GEN] Creating PDF document...');
      
      // Create PDF - ONLY pass docDefinition (no second parameter!)
      pdfDoc = pdfMake.createPdf(docDefinition);
      
      if (!pdfDoc) {
        handleError(new Error('createPdf returned null'));
        return;
      }
      
      console.log('[PDF GEN] Extracting blob (primary method)...');
      
      // Primary method: getBlob
      let blobCallbackCalled = false;
      
      pdfDoc.getBlob((blob: Blob) => {
        blobCallbackCalled = true;
        handleSuccess(blob);
      });
      
      // Fallback: If getBlob doesn't call back within 5 seconds, try getBuffer
      setTimeout(() => {
        if (!blobCallbackCalled && !settled && pdfDoc) {
          console.log('[PDF GEN] getBlob timeout, trying getBuffer fallback...');
          
          try {
            pdfDoc.getBuffer((buffer: ArrayBuffer) => {
              if (settled) return;
              console.log(`[PDF GEN] Buffer received: ${buffer?.byteLength || 0} bytes`);
              
              if (!buffer || buffer.byteLength < 100) {
                handleError(new Error('Buffer too small'));
                return;
              }
              
              const blob = new Blob([buffer], { type: 'application/pdf' });
              handleSuccess(blob);
            });
          } catch (bufferErr) {
            console.error('[PDF GEN] getBuffer also failed:', bufferErr);
            // Don't reject here, let the main timeout handle it
          }
        }
      }, 5000);
      
    } catch (error) {
      handleError(error);
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
