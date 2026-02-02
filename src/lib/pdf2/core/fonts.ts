/**
 * FONT MANAGEMENT FOR PDF GENERATION
 * 
 * Handles loading and registering Cairo fonts for Arabic RTL support.
 */

import { pdfMake } from './pdfmake-instance';

// Font configuration
export const FONT_NAME = 'Cairo';
export const FONT_FILES = {
  regular: 'Cairo-Regular.ttf',
  bold: 'Cairo-Bold.ttf',
} as const;

// Singleton state
const STATE_KEY = '__pdfFonts_v3__';

interface FontState {
  loading: boolean;
  ready: boolean;
  error: Error | null;
  promise: Promise<void> | null;
  cache: {
    regular: ArrayBuffer | null;
    bold: ArrayBuffer | null;
  };
}

function getState(): FontState {
  if (!(globalThis as Record<string, unknown>)[STATE_KEY]) {
    (globalThis as Record<string, unknown>)[STATE_KEY] = {
      loading: false,
      ready: false,
      error: null,
      promise: null,
      cache: { regular: null, bold: null },
    };
  }
  return (globalThis as Record<string, unknown>)[STATE_KEY] as FontState;
}

/**
 * Convert ArrayBuffer to base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 32768; // Process in chunks to avoid call stack issues
  
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(binary);
}

/**
 * Load font file as ArrayBuffer
 */
async function loadFont(filename: string): Promise<ArrayBuffer> {
  const url = new URL(`../../../assets/fonts/${filename}`, import.meta.url).href;
  
  const response = await fetch(url, { 
    cache: 'force-cache',
    credentials: 'same-origin',
  });
  
  if (!response.ok) {
    throw new Error(`FONT_LOAD_FAILED: ${filename} (${response.status})`);
  }
  
  return response.arrayBuffer();
}

/**
 * Validate TTF/OTF font signature
 */
function validateFontSignature(buffer: ArrayBuffer, filename: string): void {
  const bytes = new Uint8Array(buffer);
  
  if (bytes.length < 4) {
    throw new Error(`FONT_INVALID: ${filename} is too small`);
  }
  
  const isTTF = bytes[0] === 0x00 && bytes[1] === 0x01 && bytes[2] === 0x00 && bytes[3] === 0x00;
  const isOTF = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]) === 'OTTO';
  
  if (!isTTF && !isOTF) {
    console.warn(`[PDF FONTS] Unusual signature for ${filename}: ${bytes[0]}, ${bytes[1]}, ${bytes[2]}, ${bytes[3]}`);
  }
}

/**
 * Register fonts in pdfmake VFS using traditional assignment
 */
function registerFonts(regularBuffer: ArrayBuffer, boldBuffer: ArrayBuffer): void {
  // Convert to base64
  const regularBase64 = arrayBufferToBase64(regularBuffer);
  const boldBase64 = arrayBufferToBase64(boldBuffer);

  // Direct VFS assignment (most compatible method)
  pdfMake.vfs[FONT_FILES.regular] = regularBase64;
  pdfMake.vfs[FONT_FILES.bold] = boldBase64;

  // Register font family
  pdfMake.fonts[FONT_NAME] = {
    normal: FONT_FILES.regular,
    bold: FONT_FILES.bold,
    italics: FONT_FILES.regular,
    bolditalics: FONT_FILES.bold,
  };

  console.log('[PDF FONTS] ✅ Cairo fonts registered via direct VFS');
}

/**
 * Check if fonts are registered in VFS
 */
export function areFontsReady(): boolean {
  const state = getState();
  
  if (!state.ready) return false;
  
  // Verify VFS contains fonts (direct check)
  const hasRegular = Boolean(pdfMake.vfs?.[FONT_FILES.regular]);
  const hasBold = Boolean(pdfMake.vfs?.[FONT_FILES.bold]);
  const hasFamily = Boolean(pdfMake.fonts?.[FONT_NAME]);
  
  return hasRegular && hasBold && hasFamily;
}

/**
 * Initialize fonts - safe to call multiple times
 */
export async function initializeFonts(): Promise<void> {
  const state = getState();
  
  // Already ready
  if (areFontsReady()) {
    return;
  }
  
  // Recovery from cache
  if (state.cache.regular && state.cache.bold && !areFontsReady()) {
    console.log('[PDF FONTS] Recovering from cache...');
    registerFonts(state.cache.regular, state.cache.bold);
    state.ready = true;
    return;
  }
  
  // Already loading
  if (state.promise) {
    return state.promise;
  }
  
  // Start loading
  state.loading = true;
  state.promise = (async () => {
    try {
      console.log('[PDF FONTS] Loading Cairo fonts...');
      
      // Load in parallel
      const [regular, bold] = await Promise.all([
        loadFont(FONT_FILES.regular),
        loadFont(FONT_FILES.bold),
      ]);
      
      // Validate
      validateFontSignature(regular, FONT_FILES.regular);
      validateFontSignature(bold, FONT_FILES.bold);
      
      console.log(`[PDF FONTS] Loaded: Regular ${regular.byteLength}b, Bold ${bold.byteLength}b`);
      
      // Cache for recovery
      state.cache.regular = regular;
      state.cache.bold = bold;
      
      // Register
      registerFonts(regular, bold);
      
      state.ready = true;
      state.error = null;
      
    } catch (error) {
      state.error = error instanceof Error ? error : new Error(String(error));
      state.promise = null;
      state.ready = false;
      console.error('[PDF FONTS] Load failed:', error);
      throw error;
    } finally {
      state.loading = false;
    }
  })();
  
  return state.promise;
}

/**
 * Force reload fonts (emergency recovery)
 */
export async function forceReloadFonts(): Promise<void> {
  const state = getState();
  state.promise = null;
  state.ready = false;
  state.cache.regular = null;
  state.cache.bold = null;
  return initializeFonts();
}

/**
 * Get diagnostic info
 */
export function getFontDiagnostics(): {
  ready: boolean;
  loading: boolean;
  error: string | null;
  vfsKeys: string[];
  families: string[];
} {
  const state = getState();
  
  return {
    ready: state.ready,
    loading: state.loading,
    error: state.error?.message || null,
    vfsKeys: Object.keys(pdfMake.vfs || {}).filter(k => k.includes('Cairo')),
    families: Object.keys(pdfMake.fonts || {}),
  };
}
