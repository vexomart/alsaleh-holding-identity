/**
 * PDFMAKE SINGLETON INSTANCE
 * 
 * Single source of truth for pdfmake in the entire application.
 * 
 * CRITICAL FIX: Must assign pdfMake.vfs = pdfFonts.pdfMake.vfs directly
 * to use pdfmake's internal VFS reference, NOT copy the data.
 */

import pdfMakeModule from 'pdfmake/build/pdfmake';
import pdfFontsModule from 'pdfmake/build/vfs_fonts';

export interface PdfDocument {
  getBlob: (callback: (blob: Blob) => void) => void;
  getBuffer: (callback: (buffer: ArrayBuffer) => void) => void;
  getDataUrl: (callback: (dataUrl: string) => void) => void;
  download: (filename?: string) => void;
  open: () => void;
}

export interface PdfMakeInstance {
  vfs: Record<string, string>;
  fonts: Record<string, { normal: string; bold: string; italics: string; bolditalics: string }>;
  createPdf: (docDefinition: unknown) => PdfDocument;
}

// Global key to ensure singleton across HMR
const SINGLETON_KEY = '__pdfMakeSingleton_v6__';

function createPdfMakeInstance(): PdfMakeInstance {
  // Check for existing singleton
  if (typeof window !== 'undefined' && (window as any)[SINGLETON_KEY]) {
    console.log('[PDFMAKE] Using existing singleton instance');
    return (window as any)[SINGLETON_KEY];
  }
  
  console.log('[PDFMAKE] Creating new singleton instance');
  
  // Get the pdfmake instance
  const pdfMake = pdfMakeModule as unknown as PdfMakeInstance;
  
  // CRITICAL: Assign the VFS from pdfFonts module DIRECTLY
  // This is the key fix - we must use pdfmake's internal VFS reference
  const fontsVfs = (pdfFontsModule as any)?.pdfMake?.vfs || (pdfFontsModule as any)?.vfs || {};
  
  console.log('[PDFMAKE] Default VFS keys:', Object.keys(fontsVfs).length);
  
  // Assign VFS directly (not copy)
  pdfMake.vfs = fontsVfs;
  
  // Ensure fonts object exists
  if (!pdfMake.fonts) {
    pdfMake.fonts = {};
  }
  
  // Register Roboto as fallback (already in default VFS)
  pdfMake.fonts.Roboto = {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf',
  };
  
  console.log('[PDFMAKE] VFS initialized with', Object.keys(pdfMake.vfs).length, 'entries');
  console.log('[PDFMAKE] VFS sample keys:', Object.keys(pdfMake.vfs).slice(0, 5));
  console.log('[PDFMAKE] Fonts registered:', Object.keys(pdfMake.fonts));
  
  // Store singleton in window for HMR persistence
  if (typeof window !== 'undefined') {
    (window as any)[SINGLETON_KEY] = pdfMake;
  }
  
  return pdfMake;
}

export const pdfMake = createPdfMakeInstance();
export default pdfMake;
