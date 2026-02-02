/**
 * PDFMAKE SINGLETON INSTANCE
 * 
 * Single source of truth for pdfmake in the entire application.
 * Handles initialization and font registration.
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
  addFontContainer?: (fontContainer: { vfs: Record<string, unknown>; fonts: Record<string, unknown> }) => void;
  addVirtualFileSystem?: (vfs: Record<string, unknown>) => void;
  addFonts?: (fonts: Record<string, unknown>) => void;
  virtualfs?: { storage?: Record<string, unknown>; existsSync?: (path: string) => boolean };
  fonts?: Record<string, unknown>;
  createPdf: (docDefinition: unknown) => PdfDocument;
}

const SINGLETON_KEY = '__pdfMake_v3__';

function createInstance(): PdfMakeInstance {
  // Return existing instance if available
  if ((globalThis as Record<string, unknown>)[SINGLETON_KEY]) {
    return (globalThis as Record<string, unknown>)[SINGLETON_KEY] as PdfMakeInstance;
  }

  const instance = pdfMakeRaw as unknown as PdfMakeInstance;

  // Register default Roboto font container
  const fontContainer = (pdfFontsModule as Record<string, unknown>).pdfMake as {
    vfs?: Record<string, unknown>;
    fonts?: Record<string, unknown>;
  } | undefined;

  if (fontContainer?.vfs && fontContainer?.fonts && typeof instance.addFontContainer === 'function') {
    instance.addFontContainer(fontContainer as { vfs: Record<string, unknown>; fonts: Record<string, unknown> });
  } else if (fontContainer) {
    if (fontContainer.vfs && typeof instance.addVirtualFileSystem === 'function') {
      instance.addVirtualFileSystem(fontContainer.vfs);
    }
    if (fontContainer.fonts && typeof instance.addFonts === 'function') {
      instance.addFonts(fontContainer.fonts);
    }
  }

  // Store singleton
  (globalThis as Record<string, unknown>)[SINGLETON_KEY] = instance;
  
  return instance;
}

export const pdfMake = createInstance();
export default pdfMake;
