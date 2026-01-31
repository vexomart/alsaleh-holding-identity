/**
 * PDF Singleton Initialization Module
 * 
 * Ensures pdfMake fonts are loaded exactly ONCE before any PDF generation.
 * All callers receive the same promise — no race conditions.
 */

import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { loadCairoTTFAsVfs } from './fonts/cairo-embedded';

// Module-level state (singleton)
let initPromise: Promise<void> | null = null;
let initialized = false;
let initError: Error | null = null;

const ARABIC_FONT_NAME = 'Cairo';

/**
 * Initialize pdfMake with default Roboto fonts (built-in).
 * This is called once at module load to ensure vfs exists.
 */
function initDefaultVfs(): void {
  const pdfFontsModule = pdfFonts as unknown as { pdfMake: { vfs: Record<string, string> } };
  const pdfMakeAny = pdfMake as unknown as { vfs?: Record<string, string> };
  if (pdfFontsModule.pdfMake?.vfs && !pdfMakeAny.vfs) {
    pdfMakeAny.vfs = pdfFontsModule.pdfMake.vfs;
  }
}

// Run immediately on module load
initDefaultVfs();

/**
 * Check if PDF fonts have been initialized successfully.
 */
export function isPdfInitialized(): boolean {
  return initialized;
}

/**
 * Get the initialization error if any.
 */
export function getPdfInitError(): Error | null {
  return initError;
}

/**
 * Ensure PDF fonts are initialized.
 * Returns the same promise for all callers (singleton pattern).
 * 
 * IMPORTANT: If initialization fails, this throws and PDF generation MUST NOT proceed.
 */
export function ensurePdfInitialized(): Promise<void> {
  // If already failed, reject immediately
  if (initError) {
    return Promise.reject(initError);
  }

  // If already initialized, resolve immediately
  if (initialized) {
    return Promise.resolve();
  }

  // If initialization is in progress, return existing promise
  if (initPromise) {
    return initPromise;
  }

  // Start initialization (only happens once)
  initPromise = initializePdfFonts();
  return initPromise;
}

/**
 * Internal initialization logic — called only once.
 */
async function initializePdfFonts(): Promise<void> {
  console.log('[PDF INIT] Starting singleton font initialization...');

  try {
    // Load Cairo TTF fonts (with signature validation)
    const cairo = await loadCairoTTFAsVfs();
    console.log('[PDF INIT] Cairo fonts loaded (Regular:', cairo.regular.length, 'chars, Bold:', cairo.bold.length, 'chars)');

    const pdfMakeAny = pdfMake as unknown as {
      vfs?: Record<string, string>;
      fonts?: Record<string, unknown>;
    };

    // Ensure VFS exists
    if (!pdfMakeAny.vfs) {
      pdfMakeAny.vfs = {};
    }

    // Register font files in VFS
    Object.assign(pdfMakeAny.vfs, {
      'Cairo-Regular.ttf': cairo.regular,
      'Cairo-Bold.ttf': cairo.bold,
    });

    // Verify registration
    if (!pdfMakeAny.vfs['Cairo-Regular.ttf'] || !pdfMakeAny.vfs['Cairo-Bold.ttf']) {
      throw new Error('[PDF INIT] Font registration failed — files not in VFS after assignment');
    }

    // Register font family
    pdfMakeAny.fonts = {
      ...(pdfMakeAny.fonts || {}),
      [ARABIC_FONT_NAME]: {
        normal: 'Cairo-Regular.ttf',
        bold: 'Cairo-Bold.ttf',
        italics: 'Cairo-Regular.ttf',
        bolditalics: 'Cairo-Bold.ttf',
      },
    };

    console.log('[PDF INIT] VFS keys:', Object.keys(pdfMakeAny.vfs).filter(k => k.includes('Cairo')));
    console.log('[PDF INIT] Registered fonts:', Object.keys(pdfMakeAny.fonts || {}));

    initialized = true;
    console.log('[PDF INIT] ✅ Singleton initialization complete. initialized =', initialized);

  } catch (error) {
    initError = error instanceof Error ? error : new Error(String(error));
    console.error('[PDF INIT] ❌ Initialization FAILED:', initError.message);
    throw initError;
  }
}

/**
 * Reset initialization state (for testing/debugging only).
 */
export function resetPdfInit(): void {
  initPromise = null;
  initialized = false;
  initError = null;
  console.log('[PDF INIT] State reset');
}
