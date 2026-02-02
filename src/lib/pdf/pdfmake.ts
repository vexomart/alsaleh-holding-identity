/**
 * SINGLE PDFMAKE WRAPPER — ALL PDF IMPORTS MUST COME FROM HERE
 * 
 * This is the ONLY file that imports pdfmake directly.
 * All other PDF modules MUST import from this file.
 */

import pdfMakeRaw from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Extended pdfMake type with vfs and fonts
export interface PdfMakeExtended {
  vfs: Record<string, string>;
  fonts: Record<string, {
    normal: string;
    bold: string;
    italics: string;
    bolditalics: string;
  }>;
  createPdf: (docDefinition: unknown) => {
    getBlob: (callback: (blob: Blob) => void) => void;
    download: (filename: string) => void;
    open: () => void;
  };
}

// Cast to extended type
const pdfMake = pdfMakeRaw as unknown as PdfMakeExtended;

// Initialize default VFS (Roboto fonts)
const pdfFontsModule = pdfFonts as unknown as { pdfMake: { vfs: Record<string, string> } };
if (pdfFontsModule.pdfMake?.vfs) {
  pdfMake.vfs = pdfFontsModule.pdfMake.vfs;
}

// Initialize empty objects if needed
if (!pdfMake.vfs) pdfMake.vfs = {};
if (!pdfMake.fonts) pdfMake.fonts = {};

// Attach to globalThis to prevent duplicate instances
(globalThis as any).__pdfMakeSingleton = pdfMake;

export default pdfMake;
