/**
 * PDF Font Management
 * 
 * Handles Cairo TTF font loading and registration into pdfMake VFS.
 * This module MUST be initialized before any PDF generation.
 * 
 * CRITICAL: Uses singleton pdfMake module reference to avoid VFS reset issues.
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

// Singleton pdfMake reference to prevent module reload issues
// EXPORTED so all PDF modules use the SAME instance
export const pdfMakeInstance = pdfMake as unknown as {
  vfs: Record<string, string>;
  fonts: Record<string, {
    normal: string;
    bold: string;
    italics: string;
    bolditalics: string;
  }>;
  // Include createPdf method for PDF generation
  createPdf: (docDefinition: unknown) => {
    getBlob: (callback: (blob: Blob) => void) => void;
    download: (filename: string) => void;
    open: () => void;
  };
};

/**
 * Initialize default VFS from pdfmake bundle
 */
function initDefaultVfs(): void {
  const pdfFontsModule = pdfFonts as unknown as { pdfMake: { vfs: Record<string, string> } };
  
  // Only set if VFS doesn't exist yet
  if (!pdfMakeInstance.vfs && pdfFontsModule.pdfMake?.vfs) {
    pdfMakeInstance.vfs = { ...pdfFontsModule.pdfMake.vfs };
  } else if (!pdfMakeInstance.vfs) {
    pdfMakeInstance.vfs = {};
  }
  
  // Ensure fonts object exists
  if (!pdfMakeInstance.fonts) {
    pdfMakeInstance.fonts = {};
  }
}

// Initialize default VFS immediately on module load
initDefaultVfs();

/**
 * Load and register Cairo fonts into pdfMake
 */
async function loadCairoFonts(): Promise<void> {
  console.log('[PDF FONTS] Loading Cairo TTF fonts...');

  try {
    const cairo = await loadCairoTTFAsVfs();
    
    console.log('[PDF FONTS] Cairo fonts loaded:', {
      regularLength: cairo.regular.length,
      boldLength: cairo.bold.length,
    });

    // Ensure VFS exists before registration
    if (!pdfMakeInstance.vfs) {
      pdfMakeInstance.vfs = {};
    }

    // Register font files in VFS - MUST use exact filenames
    pdfMakeInstance.vfs[FONT_FILES.regular] = cairo.regular;
    pdfMakeInstance.vfs[FONT_FILES.bold] = cairo.bold;

    // Verify VFS registration immediately
    if (!pdfMakeInstance.vfs[FONT_FILES.regular]) {
      throw new Error(`Failed to register ${FONT_FILES.regular} in VFS`);
    }
    if (!pdfMakeInstance.vfs[FONT_FILES.bold]) {
      throw new Error(`Failed to register ${FONT_FILES.bold} in VFS`);
    }

    // Ensure fonts object exists
    if (!pdfMakeInstance.fonts) {
      pdfMakeInstance.fonts = {};
    }

    // Register font family mapping
    pdfMakeInstance.fonts[ARABIC_FONT_NAME] = {
      normal: FONT_FILES.regular,
      bold: FONT_FILES.bold,
      italics: FONT_FILES.regular,
      bolditalics: FONT_FILES.bold,
    };

    // Verify font family registration
    if (!pdfMakeInstance.fonts[ARABIC_FONT_NAME]) {
      throw new Error(`Failed to register ${ARABIC_FONT_NAME} font family`);
    }

    console.log('[PDF FONTS] ✅ Cairo fonts registered successfully');
    console.log('[PDF FONTS] VFS keys:', Object.keys(pdfMakeInstance.vfs).filter(k => k.includes('Cairo') || k.includes('.ttf')));
    console.log('[PDF FONTS] Font families:', Object.keys(pdfMakeInstance.fonts));
    
  } catch (error) {
    console.error('[PDF FONTS] ❌ Font loading failed:', error);
    throw error;
  }
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

  // Already initialized - double-check VFS still has fonts
  if (fontsInitialized) {
    // Verify fonts are still in VFS (might have been cleared)
    if (pdfMakeInstance.vfs?.[FONT_FILES.regular] && pdfMakeInstance.vfs?.[FONT_FILES.bold]) {
      return Promise.resolve();
    }
    // Fonts were cleared, need to reload
    console.warn('[PDF FONTS] Fonts were cleared from VFS, reloading...');
    fontsInitialized = false;
    initPromise = null;
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
  // Also check if VFS still contains fonts
  return fontsInitialized && 
    !!pdfMakeInstance.vfs?.[FONT_FILES.regular] && 
    !!pdfMakeInstance.vfs?.[FONT_FILES.bold];
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
  const errors: string[] = [];

  // Check initialization state
  if (!fontsInitialized) {
    errors.push('Fonts not initialized (call initializeFonts() first)');
  }

  // Check font family registration
  if (!pdfMakeInstance.fonts?.[ARABIC_FONT_NAME]) {
    errors.push(`${ARABIC_FONT_NAME} font family not registered in pdfMake.fonts`);
  }

  // Check VFS files
  if (!pdfMakeInstance.vfs?.[FONT_FILES.regular]) {
    errors.push(`${FONT_FILES.regular} missing from pdfMake.vfs`);
  }

  if (!pdfMakeInstance.vfs?.[FONT_FILES.bold]) {
    errors.push(`${FONT_FILES.bold} missing from pdfMake.vfs`);
  }

  // Verify file sizes (empty files are invalid)
  const regularSize = pdfMakeInstance.vfs?.[FONT_FILES.regular]?.length || 0;
  const boldSize = pdfMakeInstance.vfs?.[FONT_FILES.bold]?.length || 0;

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
  return {
    initialized: fontsInitialized,
    error: initializationError?.message || null,
    vfsKeys: Object.keys(pdfMakeInstance.vfs || {}).filter(k => k.includes('Cairo') || k.includes('ttf')),
    registeredFonts: Object.keys(pdfMakeInstance.fonts || {}),
    cairoRegularSize: pdfMakeInstance.vfs?.[FONT_FILES.regular]?.length || 0,
    cairoBoldSize: pdfMakeInstance.vfs?.[FONT_FILES.bold]?.length || 0,
  };
}
