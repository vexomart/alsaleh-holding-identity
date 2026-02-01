/**
 * PDF Font Management
 * 
 * Handles Cairo TTF font loading and registration into pdfMake VFS.
 * This module MUST be initialized before any PDF generation.
 */

import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { loadCairoTTFAsVfs } from '../fonts/cairo-embedded';

// Font configuration constants
export const ARABIC_FONT_NAME = 'Cairo';
export const FONT_FILES = {
  regular: 'Cairo-Regular.ttf',
  bold: 'Cairo-Bold.ttf',
};

// Module state
let fontsInitialized = false;
let initializationError: Error | null = null;
let initPromise: Promise<void> | null = null;

/**
 * Initialize default VFS from pdfmake bundle
 */
function initDefaultVfs(): void {
  const pdfFontsModule = pdfFonts as unknown as { pdfMake: { vfs: Record<string, string> } };
  const pdfMakeAny = pdfMake as unknown as { vfs?: Record<string, string> };
  
  if (pdfFontsModule.pdfMake?.vfs && !pdfMakeAny.vfs) {
    pdfMakeAny.vfs = pdfFontsModule.pdfMake.vfs;
  }
}

// Initialize default VFS immediately
initDefaultVfs();

/**
 * Load and register Cairo fonts into pdfMake
 */
async function loadCairoFonts(): Promise<void> {
  console.log('[PDF FONTS] Loading Cairo TTF fonts...');

  const cairo = await loadCairoTTFAsVfs();
  
  console.log('[PDF FONTS] Cairo fonts loaded:', {
    regularLength: cairo.regular.length,
    boldLength: cairo.bold.length,
  });

  // Access pdfMake directly
  const pdfMakeModule = pdfMake as unknown as {
    vfs: Record<string, string>;
    fonts: Record<string, unknown>;
  };

  // Ensure VFS exists
  if (!pdfMakeModule.vfs) {
    const pdfFontsModule = pdfFonts as unknown as { pdfMake: { vfs: Record<string, string> } };
    pdfMakeModule.vfs = pdfFontsModule.pdfMake?.vfs || {};
  }

  // Register font files in VFS
  pdfMakeModule.vfs[FONT_FILES.regular] = cairo.regular;
  pdfMakeModule.vfs[FONT_FILES.bold] = cairo.bold;

  // Verify registration
  if (!pdfMakeModule.vfs[FONT_FILES.regular] || !pdfMakeModule.vfs[FONT_FILES.bold]) {
    throw new Error('[PDF FONTS] Font registration failed - files not in VFS');
  }

  // Register font family
  if (!pdfMakeModule.fonts) {
    pdfMakeModule.fonts = {};
  }

  pdfMakeModule.fonts[ARABIC_FONT_NAME] = {
    normal: FONT_FILES.regular,
    bold: FONT_FILES.bold,
    italics: FONT_FILES.regular,
    bolditalics: FONT_FILES.bold,
  };

  console.log('[PDF FONTS] ✅ Cairo fonts registered successfully');
}

/**
 * Initialize fonts (singleton pattern)
 * Returns same promise for concurrent callers
 */
export function initializeFonts(): Promise<void> {
  // Already failed
  if (initializationError) {
    return Promise.reject(initializationError);
  }

  // Already initialized
  if (fontsInitialized) {
    return Promise.resolve();
  }

  // In progress
  if (initPromise) {
    return initPromise;
  }

  // Start initialization
  initPromise = loadCairoFonts()
    .then(() => {
      fontsInitialized = true;
      console.log('[PDF FONTS] Initialization complete');
    })
    .catch((error) => {
      initializationError = error instanceof Error ? error : new Error(String(error));
      console.error('[PDF FONTS] Initialization failed:', initializationError.message);
      throw initializationError;
    });

  return initPromise;
}

/**
 * Check if fonts are initialized
 */
export function areFontsInitialized(): boolean {
  return fontsInitialized;
}

/**
 * Get initialization error if any
 */
export function getFontInitError(): Error | null {
  return initializationError;
}

/**
 * Reset font initialization (for testing only)
 */
export function resetFontInit(): void {
  fontsInitialized = false;
  initializationError = null;
  initPromise = null;
  console.log('[PDF FONTS] State reset');
}

/**
 * HARD ASSERTION: Verify Cairo fonts are properly registered
 * Throws if fonts are not available
 */
export function assertFontsReady(): void {
  const pdfMakeRef = pdfMake as unknown as {
    fonts?: Record<string, unknown>;
    vfs?: Record<string, string>;
  };

  const errors: string[] = [];

  // Check initialization state
  if (!fontsInitialized) {
    errors.push('Fonts not initialized (call initializeFonts() first)');
  }

  // Check font family registration
  if (!pdfMakeRef.fonts?.[ARABIC_FONT_NAME]) {
    errors.push(`${ARABIC_FONT_NAME} font family not registered in pdfMake.fonts`);
  }

  // Check VFS files
  if (!pdfMakeRef.vfs?.[FONT_FILES.regular]) {
    errors.push(`${FONT_FILES.regular} missing from pdfMake.vfs`);
  }

  if (!pdfMakeRef.vfs?.[FONT_FILES.bold]) {
    errors.push(`${FONT_FILES.bold} missing from pdfMake.vfs`);
  }

  // Verify file sizes (empty files are invalid)
  const regularSize = pdfMakeRef.vfs?.[FONT_FILES.regular]?.length || 0;
  const boldSize = pdfMakeRef.vfs?.[FONT_FILES.bold]?.length || 0;

  if (regularSize < 10000) {
    errors.push(`${FONT_FILES.regular} appears invalid (size: ${regularSize})`);
  }

  if (boldSize < 10000) {
    errors.push(`${FONT_FILES.bold} appears invalid (size: ${boldSize})`);
  }

  if (errors.length > 0) {
    const message = `[PDF FONTS] ASSERTION FAILED:\n- ${errors.join('\n- ')}`;
    console.error(message);
    throw new Error(message);
  }

  console.log('[PDF FONTS] ✅ Font assertions passed');
}

/**
 * Get font diagnostic information
 */
export function getFontDiagnostics(): {
  initialized: boolean;
  error: string | null;
  vfsKeys: string[];
  registeredFonts: string[];
  cairoRegularSize: number;
  cairoBoldSize: number;
} {
  const pdfMakeRef = pdfMake as unknown as {
    fonts?: Record<string, unknown>;
    vfs?: Record<string, string>;
  };

  return {
    initialized: fontsInitialized,
    error: initializationError?.message || null,
    vfsKeys: Object.keys(pdfMakeRef.vfs || {}).filter(k => k.includes('Cairo') || k.includes('ttf')),
    registeredFonts: Object.keys(pdfMakeRef.fonts || {}),
    cairoRegularSize: pdfMakeRef.vfs?.[FONT_FILES.regular]?.length || 0,
    cairoBoldSize: pdfMakeRef.vfs?.[FONT_FILES.bold]?.length || 0,
  };
}
