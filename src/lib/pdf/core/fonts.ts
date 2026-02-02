/**
 * PDF Font Management — SINGLETON PATTERN
 * 
 * CRITICAL: This is the ONLY module that imports pdfmake directly.
 * All other PDF modules MUST import from this file.
 * 
 * Handles Cairo TTF font loading and registration into pdfMake VFS.
 * Uses aggressive protection against VFS resets (HMR, module side-effects).
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

// Module state (singleton)
let fontsInitialized = false;
let initializationError: Error | null = null;
let initPromise: Promise<void> | null = null;
let vfsPatched = false;

// Cairo font data cache (survives VFS resets)
let cachedCairoRegular: string | null = null;
let cachedCairoBold: string | null = null;

// Type-safe pdfMake singleton
export const pdfMakeInstance = pdfMake as unknown as {
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
};

// Immediately attach to globalThis to prevent other modules from creating new instances
(globalThis as any).pdfMake = pdfMakeInstance;

function getGlobalPdfMake(): typeof pdfMakeInstance | null {
  return (globalThis as any).pdfMake || null;
}

/**
 * Ensure Cairo fonts are in VFS (re-inject from cache if missing)
 */
function ensureCairoInVfs(): void {
  if (!pdfMakeInstance.vfs) {
    pdfMakeInstance.vfs = {};
  }
  
  // Re-inject from cache if fonts were wiped
  if (cachedCairoRegular && !pdfMakeInstance.vfs[FONT_FILES.regular]) {
    console.warn('[PDF FONTS] Cairo-Regular.ttf was wiped from VFS, re-injecting from cache');
    pdfMakeInstance.vfs[FONT_FILES.regular] = cachedCairoRegular;
  }
  
  if (cachedCairoBold && !pdfMakeInstance.vfs[FONT_FILES.bold]) {
    console.warn('[PDF FONTS] Cairo-Bold.ttf was wiped from VFS, re-injecting from cache');
    pdfMakeInstance.vfs[FONT_FILES.bold] = cachedCairoBold;
  }
  
  // Re-register font family if missing
  if (!pdfMakeInstance.fonts) {
    pdfMakeInstance.fonts = {};
  }
  
  if (cachedCairoRegular && cachedCairoBold && !pdfMakeInstance.fonts[ARABIC_FONT_NAME]) {
    console.warn('[PDF FONTS] Cairo font family was wiped, re-registering');
    pdfMakeInstance.fonts[ARABIC_FONT_NAME] = {
      normal: FONT_FILES.regular,
      bold: FONT_FILES.bold,
      italics: FONT_FILES.regular,
      bolditalics: FONT_FILES.bold,
    };
  }
  
  // Sync to global
  const g = getGlobalPdfMake();
  if (g && g !== pdfMakeInstance) {
    if (cachedCairoRegular) g.vfs = { ...(g.vfs || {}), [FONT_FILES.regular]: cachedCairoRegular };
    if (cachedCairoBold) g.vfs = { ...(g.vfs || {}), [FONT_FILES.bold]: cachedCairoBold };
  }
}

/**
 * Initialize default VFS from pdfmake bundle
 */
function initDefaultVfs(): void {
  const pdfFontsModule = pdfFonts as unknown as { pdfMake: { vfs: Record<string, string> } };
  
  if (!pdfMakeInstance.vfs) {
    pdfMakeInstance.vfs = {};
  }

  // Merge bundled fonts (Roboto) but preserve Cairo if already loaded
  if (pdfFontsModule.pdfMake?.vfs) {
    pdfMakeInstance.vfs = {
      ...pdfFontsModule.pdfMake.vfs,
      ...pdfMakeInstance.vfs,
    };
  }
  
  if (!pdfMakeInstance.fonts) {
    pdfMakeInstance.fonts = {};
  }
  
  // Re-inject Cairo from cache if available
  ensureCairoInVfs();
}

/**
 * Protect VFS from being replaced (merge instead)
 */
function patchVfsProtection(): void {
  if (vfsPatched) return;
  vfsPatched = true;

  let vfsStore: Record<string, string> = pdfMakeInstance.vfs || {};
  
  try {
    Object.defineProperty(pdfMakeInstance, 'vfs', {
      configurable: true,
      enumerable: true,
      get() {
        return vfsStore;
      },
      set(next: Record<string, string>) {
        // MERGE instead of REPLACE — preserve Cairo fonts
        const cairoRegular = vfsStore[FONT_FILES.regular] || cachedCairoRegular;
        const cairoBold = vfsStore[FONT_FILES.bold] || cachedCairoBold;
        
        vfsStore = { ...(next || {}) };
        
        // Always preserve Cairo
        if (cairoRegular) vfsStore[FONT_FILES.regular] = cairoRegular;
        if (cairoBold) vfsStore[FONT_FILES.bold] = cairoBold;
      },
    });
  } catch (e) {
    console.warn('[PDF FONTS] Could not patch VFS protection:', e);
  }
}

// Initialize on module load
initDefaultVfs();
patchVfsProtection();

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

    // CACHE the fonts for future VFS resets
    cachedCairoRegular = cairo.regular;
    cachedCairoBold = cairo.bold;

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

    // Sync to global
    ensureCairoInVfs();

    console.log('[PDF FONTS] ✅ Cairo fonts registered successfully');
    console.log('[PDF FONTS] VFS keys:', Object.keys(pdfMakeInstance.vfs).filter(k => k.includes('Cairo') || k.includes('.ttf')));
    console.log('[PDF FONTS] Font families:', Object.keys(pdfMakeInstance.fonts));

    const g = getGlobalPdfMake();
    console.log('[PDF FONTS] globalThis.pdfMake aligned:', {
      hasGlobal: !!g,
      sameInstance: g === pdfMakeInstance,
      globalHasCairoBold: !!g?.vfs?.[FONT_FILES.bold],
    });
    
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

  // Already initialized - try to recover from cache first
  if (fontsInitialized) {
    ensureCairoInVfs(); // Try to recover from cache
    
    // Verify fonts are still in VFS (might have been cleared)
    if (pdfMakeInstance.vfs?.[FONT_FILES.regular] && pdfMakeInstance.vfs?.[FONT_FILES.bold]) {
      return Promise.resolve();
    }
    
    // Fonts were cleared AND cache didn't help, need full reload
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
  // First, try to recover from cache if fonts were wiped
  ensureCairoInVfs();
  
  const errors: string[] = [];

  // Check initialization state
  if (!fontsInitialized && !cachedCairoRegular) {
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
    // تفاصيل تقنية للكونسول + رسالة عربية واضحة للمستخدم (مطلوب)
    console.error('[PDF FONTS] Cairo fonts missing from VFS:', errors);
    throw new Error('خط Cairo غير محمّل — لا يمكن توليد PDF');
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
