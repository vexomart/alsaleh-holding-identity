/**
 * SINGLE PDFMAKE WRAPPER — THE ONLY PDFMAKE IMPORT IN THE PROJECT
 * 
 * ALL other files MUST import from this file.
 * DO NOT import pdfmake directly anywhere else.
 * 
 * CRITICAL: This module protects VFS from HMR resets.
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

// Singleton key for global storage
const SINGLETON_KEY = '__pdfMakeSingleton_v3__';
const VFS_STORAGE_KEY = '__pdfMakeVfsStorage__';
const FONTS_STORAGE_KEY = '__pdfMakeFontsStorage__';

// Initialize global storage for VFS
if (!(globalThis as any)[VFS_STORAGE_KEY]) {
  (globalThis as any)[VFS_STORAGE_KEY] = {};
}
if (!(globalThis as any)[FONTS_STORAGE_KEY]) {
  (globalThis as any)[FONTS_STORAGE_KEY] = {};
}

// Get or create singleton instance
function getOrCreateSingleton(): PdfMakeInstance {
  if ((globalThis as any)[SINGLETON_KEY]) {
    return (globalThis as any)[SINGLETON_KEY];
  }

  // Cast to our extended type
  const pdfMake = pdfMakeRaw as unknown as PdfMakeInstance;

  // Initialize with default VFS (Roboto fonts from vfs_fonts)
  const vfsFonts = pdfFontsModule as unknown as { pdfMake?: { vfs?: Record<string, string> } };
  if (vfsFonts.pdfMake?.vfs) {
    Object.assign((globalThis as any)[VFS_STORAGE_KEY], vfsFonts.pdfMake.vfs);
  }

  // Create protected VFS proxy that syncs with global storage
  const vfsHandler: ProxyHandler<Record<string, string>> = {
    get(target, prop: string) {
      return (globalThis as any)[VFS_STORAGE_KEY][prop];
    },
    set(target, prop: string, value: string) {
      (globalThis as any)[VFS_STORAGE_KEY][prop] = value;
      return true;
    },
    has(target, prop: string) {
      return prop in (globalThis as any)[VFS_STORAGE_KEY];
    },
    ownKeys() {
      return Object.keys((globalThis as any)[VFS_STORAGE_KEY]);
    },
    getOwnPropertyDescriptor(target, prop) {
      if (prop in (globalThis as any)[VFS_STORAGE_KEY]) {
        return {
          configurable: true,
          enumerable: true,
          value: (globalThis as any)[VFS_STORAGE_KEY][prop],
        };
      }
      return undefined;
    },
  };

  // Create protected fonts proxy
  const fontsHandler: ProxyHandler<Record<string, any>> = {
    get(target, prop: string) {
      return (globalThis as any)[FONTS_STORAGE_KEY][prop];
    },
    set(target, prop: string, value: any) {
      (globalThis as any)[FONTS_STORAGE_KEY][prop] = value;
      return true;
    },
    has(target, prop: string) {
      return prop in (globalThis as any)[FONTS_STORAGE_KEY];
    },
    ownKeys() {
      return Object.keys((globalThis as any)[FONTS_STORAGE_KEY]);
    },
    getOwnPropertyDescriptor(target, prop) {
      if (prop in (globalThis as any)[FONTS_STORAGE_KEY]) {
        return {
          configurable: true,
          enumerable: true,
          value: (globalThis as any)[FONTS_STORAGE_KEY][prop],
        };
      }
      return undefined;
    },
  };

  // Create proxied VFS and fonts
  const protectedVfs = new Proxy({} as Record<string, string>, vfsHandler);
  const protectedFonts = new Proxy({} as Record<string, any>, fontsHandler);

  // Override pdfMake properties with our protected versions
  Object.defineProperty(pdfMake, 'vfs', {
    get: () => protectedVfs,
    set: (newVfs: Record<string, string>) => {
      // Merge instead of replace to prevent data loss
      if (newVfs && typeof newVfs === 'object') {
        Object.assign((globalThis as any)[VFS_STORAGE_KEY], newVfs);
      }
    },
    configurable: false,
  });

  Object.defineProperty(pdfMake, 'fonts', {
    get: () => protectedFonts,
    set: (newFonts: Record<string, any>) => {
      // Merge instead of replace
      if (newFonts && typeof newFonts === 'object') {
        Object.assign((globalThis as any)[FONTS_STORAGE_KEY], newFonts);
      }
    },
    configurable: false,
  });

  // Store singleton
  (globalThis as any)[SINGLETON_KEY] = pdfMake;
  
  console.log('[PDF2] pdfMake singleton initialized with protected VFS');

  return pdfMake;
}

export default getOrCreateSingleton();
