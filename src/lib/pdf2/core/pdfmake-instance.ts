/**
 * PDFMAKE SINGLETON INSTANCE
 * 
 * Single source of truth for pdfmake in the entire application.
 * Uses traditional vfs assignment for maximum compatibility.
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

// Initialize vfs from pdfmake fonts module
const fontModule = pdfFontsModule as { pdfMake?: { vfs?: Record<string, string> } };
const defaultVfs = fontModule.pdfMake?.vfs || {};

// Cast and setup instance with traditional vfs assignment
const instance = pdfMakeRaw as unknown as PdfMakeInstance;
instance.vfs = { ...defaultVfs };
instance.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf',
  },
};

export const pdfMake = instance;
export default pdfMake;
