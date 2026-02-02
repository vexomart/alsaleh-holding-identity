/**
 * PDF INITIALIZATION — SINGLETON FONT LOADER
 * 
 * MUST be called before any PDF generation.
 * Loads Cairo fonts and registers them in pdfMake VFS.
 */

import pdfMake from './pdfmake';
import { loadCairoTTFAsVfs } from './fonts/cairo-embedded';

// Constants
export const ARABIC_FONT_NAME = 'Cairo';
export const FONT_FILES = {
  regular: 'Cairo-Regular.ttf',
  bold: 'Cairo-Bold.ttf',
};

// Module state
let initPromise: Promise<void> | null = null;
let fontsReady = false;
let cachedRegular: string | null = null;
let cachedBold: string | null = null;

/**
 * Ensure PDF system is ready (singleton pattern)
 * Returns immediately if already initialized
 */
export async function ensurePdfReady(): Promise<void> {
  // Already initialized
  if (fontsReady && verifyCairoFonts()) {
    return;
  }

  // In progress
  if (initPromise) {
    return initPromise;
  }

  // Start initialization
  initPromise = initializePdfFonts();
  return initPromise;
}

/**
 * Internal initialization function
 */
async function initializePdfFonts(): Promise<void> {
  console.log('[PDF INIT] Loading Cairo fonts...');

  try {
    const cairo = await loadCairoTTFAsVfs();

    // Validate font data
    if (!cairo.regular || cairo.regular.length < 10000) {
      throw new Error('Cairo-Regular.ttf invalid or too small');
    }
    if (!cairo.bold || cairo.bold.length < 10000) {
      throw new Error('Cairo-Bold.ttf invalid or too small');
    }

    // Cache fonts for recovery
    cachedRegular = cairo.regular;
    cachedBold = cairo.bold;

    // Register in VFS with EXACT keys
    pdfMake.vfs[FONT_FILES.regular] = cairo.regular;
    pdfMake.vfs[FONT_FILES.bold] = cairo.bold;

    // Register Cairo font family
    pdfMake.fonts[ARABIC_FONT_NAME] = {
      normal: FONT_FILES.regular,
      bold: FONT_FILES.bold,
      italics: FONT_FILES.regular,
      bolditalics: FONT_FILES.bold,
    };

    // Hard verification
    assertCairoFonts();

    fontsReady = true;
    console.log('[PDF INIT] ✅ Cairo fonts ready');
    console.log('[PDF INIT] VFS keys:', Object.keys(pdfMake.vfs).filter(k => k.includes('Cairo')));
    console.log('[PDF INIT] Font families:', Object.keys(pdfMake.fonts));

  } catch (error) {
    console.error('[PDF INIT] ❌ Font loading failed:', error);
    initPromise = null; // Allow retry
    throw error;
  }
}

/**
 * Verify Cairo fonts are in VFS
 */
function verifyCairoFonts(): boolean {
  return !!(
    pdfMake.vfs?.[FONT_FILES.regular] &&
    pdfMake.vfs?.[FONT_FILES.bold] &&
    pdfMake.fonts?.[ARABIC_FONT_NAME]
  );
}

/**
 * Recover fonts from cache if VFS was cleared
 */
export function recoverFontsFromCache(): boolean {
  if (!cachedRegular || !cachedBold) {
    return false;
  }

  if (!pdfMake.vfs[FONT_FILES.regular]) {
    console.warn('[PDF INIT] Recovering Cairo-Regular from cache');
    pdfMake.vfs[FONT_FILES.regular] = cachedRegular;
  }

  if (!pdfMake.vfs[FONT_FILES.bold]) {
    console.warn('[PDF INIT] Recovering Cairo-Bold from cache');
    pdfMake.vfs[FONT_FILES.bold] = cachedBold;
  }

  if (!pdfMake.fonts[ARABIC_FONT_NAME]) {
    console.warn('[PDF INIT] Recovering Cairo font family');
    pdfMake.fonts[ARABIC_FONT_NAME] = {
      normal: FONT_FILES.regular,
      bold: FONT_FILES.bold,
      italics: FONT_FILES.regular,
      bolditalics: FONT_FILES.bold,
    };
  }

  return verifyCairoFonts();
}

/**
 * HARD ASSERTION — throws if fonts not ready
 */
export function assertCairoFonts(): void {
  // Try recovery first
  if (!verifyCairoFonts()) {
    recoverFontsFromCache();
  }

  const errors: string[] = [];

  if (!pdfMake.vfs?.[FONT_FILES.regular]) {
    errors.push(`${FONT_FILES.regular} missing from VFS`);
  }

  if (!pdfMake.vfs?.[FONT_FILES.bold]) {
    errors.push(`${FONT_FILES.bold} missing from VFS`);
  }

  if (!pdfMake.fonts?.[ARABIC_FONT_NAME]) {
    errors.push(`${ARABIC_FONT_NAME} font family not registered`);
  }

  const regularSize = pdfMake.vfs?.[FONT_FILES.regular]?.length || 0;
  const boldSize = pdfMake.vfs?.[FONT_FILES.bold]?.length || 0;

  if (regularSize < 10000) {
    errors.push(`Cairo-Regular.ttf invalid (size: ${regularSize})`);
  }

  if (boldSize < 10000) {
    errors.push(`Cairo-Bold.ttf invalid (size: ${boldSize})`);
  }

  if (errors.length > 0) {
    console.error('[PDF INIT] Font assertion failed:', errors);
    throw new Error('PDF_FONTS_NOT_READY: خط Cairo غير محمّل — ' + errors.join(', '));
  }
}

/**
 * Get diagnostic info
 */
export function getPdfDiagnostics(): {
  ready: boolean;
  vfsKeys: string[];
  fontFamilies: string[];
  cairoRegularSize: number;
  cairoBoldSize: number;
} {
  return {
    ready: fontsReady && verifyCairoFonts(),
    vfsKeys: Object.keys(pdfMake.vfs || {}).filter(k => k.includes('Cairo') || k.includes('.ttf')),
    fontFamilies: Object.keys(pdfMake.fonts || {}),
    cairoRegularSize: pdfMake.vfs?.[FONT_FILES.regular]?.length || 0,
    cairoBoldSize: pdfMake.vfs?.[FONT_FILES.bold]?.length || 0,
  };
}
