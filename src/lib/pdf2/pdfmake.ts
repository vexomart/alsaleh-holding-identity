/**
 * SINGLE PDFMAKE WRAPPER — THE ONLY PDFMAKE IMPORT IN THE PROJECT
 * 
 * ALL other files MUST import from this file.
 * DO NOT import pdfmake directly anywhere else.
 */

import pdfMakeRaw from 'pdfmake/build/pdfmake';
import * as pdfFontsModule from 'pdfmake/build/vfs_fonts';

// Type for extended pdfMake with VFS and fonts
export interface PdfMakeInstance {
  vfs: Record<string, string>;
  fonts: Record<string, {
    normal: string;
    bold: string;
    italics: string;
    bolditalics: string;
  }>;
  createPdf: (docDefinition: unknown) => PdfDocument;
}

export interface PdfDocument {
  getBlob: (callback: (blob: Blob) => void) => void;
  getBuffer: (callback: (buffer: ArrayBuffer) => void) => void;
  download: (filename?: string) => void;
  open: () => void;
}

// Cast to our extended type
const pdfMake = pdfMakeRaw as unknown as PdfMakeInstance;

// Initialize with default VFS (Roboto fonts from vfs_fonts)
const vfsFonts = pdfFontsModule as unknown as { pdfMake?: { vfs?: Record<string, string> } };
if (vfsFonts.pdfMake?.vfs) {
  pdfMake.vfs = { ...vfsFonts.pdfMake.vfs };
}

// Ensure vfs and fonts exist
if (!pdfMake.vfs) pdfMake.vfs = {};
if (!pdfMake.fonts) pdfMake.fonts = {};

// Prevent duplicate instances via globalThis
const SINGLETON_KEY = '__pdfMakeSingleton_v2__';
if (!(globalThis as any)[SINGLETON_KEY]) {
  (globalThis as any)[SINGLETON_KEY] = pdfMake;
}

export default (globalThis as any)[SINGLETON_KEY] as PdfMakeInstance;
