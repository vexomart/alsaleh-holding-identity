/**
 * SINGLE PDFMAKE WRAPPER — THE ONLY PDFMAKE IMPORT IN THE PROJECT
 *
 * IMPORTANT (pdfmake v0.3.x in browser):
 * - Fonts are stored in an internal VirtualFileSystem (virtualfs)
 * - The supported way to register fonts is via addFontContainer/addVirtualFileSystem/addFonts
 * - Do NOT rely on pdfMake.vfs being read during generation
 */

import pdfMakeRaw from 'pdfmake/build/pdfmake';
import * as pdfFontsModule from 'pdfmake/build/vfs_fonts';

export interface PdfDocument {
  getBlob: (callback: (blob: Blob) => void) => void;
  getBuffer: (callback: (buffer: ArrayBuffer) => void) => void;
  download: (filename?: string) => void;
  open: () => void;
}

export interface PdfMakeInstance {
  // Browser extension API
  addFontContainer?: (fontContainer: { vfs: Record<string, any>; fonts: Record<string, any> }) => void;
  addVirtualFileSystem?: (vfs: Record<string, any>) => void;
  addFonts?: (fonts: Record<string, any>) => void;

  // Exposed by pdfmake base class — useful for diagnostics
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  virtualfs?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fonts?: any;

  // PDF generation
  createPdf: (docDefinition: unknown) => PdfDocument;
}

const SINGLETON_KEY = '__pdfMakeSingleton_pdf2__';

function initPdfMakeOnce(): PdfMakeInstance {
  if ((globalThis as any)[SINGLETON_KEY]) {
    return (globalThis as any)[SINGLETON_KEY] as PdfMakeInstance;
  }

  const pdfMake = pdfMakeRaw as unknown as PdfMakeInstance;

  // Register default built-in font container (Roboto)
  // This also initializes internal virtualfs.
  const fontContainer = (pdfFontsModule as any).pdfMake;
  if (fontContainer?.vfs && fontContainer?.fonts && typeof pdfMake.addFontContainer === 'function') {
    pdfMake.addFontContainer(fontContainer);
  } else {
    // Fallback (should rarely be needed)
    if (fontContainer?.vfs && typeof pdfMake.addVirtualFileSystem === 'function') {
      pdfMake.addVirtualFileSystem(fontContainer.vfs);
    }
    if (fontContainer?.fonts && typeof pdfMake.addFonts === 'function') {
      pdfMake.addFonts(fontContainer.fonts);
    }
  }

  (globalThis as any)[SINGLETON_KEY] = pdfMake;
  return pdfMake;
}

export default initPdfMakeOnce();
