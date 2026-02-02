/**
 * PDFMAKE SINGLETON INSTANCE
 * 
 * Single source of truth for pdfmake in the entire application.
 * Uses traditional vfs assignment for maximum compatibility.
 * 
 * CRITICAL: This is the ONLY place where pdfMake is instantiated.
 */

import pdfMakeRaw from 'pdfmake/build/pdfmake';
import * as pdfFontsModule from 'pdfmake/build/vfs_fonts';

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
const SINGLETON_KEY = '__pdfMakeSingleton_v4__';

function createPdfMakeInstance(): PdfMakeInstance {
  // Check for existing singleton
  if (typeof window !== 'undefined' && (window as any)[SINGLETON_KEY]) {
    console.log('[PDFMAKE] Using existing singleton instance');
    return (window as any)[SINGLETON_KEY];
  }
  
  console.log('[PDFMAKE] Creating new singleton instance');
  
  // Get the raw pdfmake instance
  const instance = pdfMakeRaw as unknown as PdfMakeInstance;
  
  // Initialize VFS from pdfmake fonts module (contains Roboto)
  const fontModule = pdfFontsModule as { pdfMake?: { vfs?: Record<string, string> } };
  const defaultVfs = fontModule.pdfMake?.vfs || {};
  
  // CRITICAL: Ensure vfs and fonts objects exist and are mutable
  if (!instance.vfs || typeof instance.vfs !== 'object') {
    instance.vfs = {};
  }
  
  // Copy default VFS (Roboto fonts)
  Object.assign(instance.vfs, defaultVfs);
  
  // Initialize fonts object
  if (!instance.fonts || typeof instance.fonts !== 'object') {
    instance.fonts = {};
  }
  
  // Register Roboto as fallback
  instance.fonts.Roboto = {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf',
  };
  
  console.log('[PDFMAKE] VFS initialized with', Object.keys(instance.vfs).length, 'entries');
  console.log('[PDFMAKE] Fonts registered:', Object.keys(instance.fonts));
  
  // Store singleton in window for HMR persistence
  if (typeof window !== 'undefined') {
    (window as any)[SINGLETON_KEY] = instance;
  }
  
  return instance;
}

export const pdfMake = createPdfMakeInstance();
export default pdfMake;
