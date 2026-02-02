/**
 * FONT MANAGEMENT FOR PDF GENERATION
 * 
 * Handles loading and registering Cairo fonts for Arabic RTL support.
 * Uses direct VFS assignment for maximum compatibility.
 */

import { pdfMake } from './pdfmake-instance';

// Font configuration
export const FONT_NAME = 'Cairo';
export const FONT_FILES = {
  regular: 'Cairo-Regular.ttf',
  bold: 'Cairo-Bold.ttf',
} as const;

// Singleton state key for HMR persistence
const STATE_KEY = '__pdfFontsState_v4__';

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
  if (typeof window !== 'undefined' && (window as any)[STATE_KEY]) {
    return (window as any)[STATE_KEY];
  }
  
  const state: FontState = {
    loading: false,
    ready: false,
    error: null,
    promise: null,
    cache: { regular: null, bold: null },
  };
  
  if (typeof window !== 'undefined') {
    (window as any)[STATE_KEY] = state;
  }
  
  return state;
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
  // Try multiple paths for font loading
  const paths = [
    `/src/assets/fonts/${filename}`,
    `./src/assets/fonts/${filename}`,
    new URL(`../../../assets/fonts/${filename}`, import.meta.url).href,
  ];
  
  let lastError: Error | null = null;
  
  for (const url of paths) {
    try {
      const response = await fetch(url, { 
        cache: 'force-cache',
        credentials: 'same-origin',
      });
      
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        if (buffer.byteLength > 1000) {
          console.log(`[PDF FONTS] Loaded ${filename} from ${url}`);
          return buffer;
        }
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }
  
  throw lastError || new Error(`FONT_LOAD_FAILED: ${filename} not found`);
}

/**
 * Validate TTF/OTF font signature
 */
function validateFontSignature(buffer: ArrayBuffer, filename: string): boolean {
  const bytes = new Uint8Array(buffer);
  
  if (bytes.length < 4) {
    console.error(`[PDF FONTS] ${filename} is too small (${bytes.length} bytes)`);
    return false;
  }
  
  const isTTF = bytes[0] === 0x00 && bytes[1] === 0x01 && bytes[2] === 0x00 && bytes[3] === 0x00;
  const isOTF = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]) === 'OTTO';
  
  if (!isTTF && !isOTF) {
    console.warn(`[PDF FONTS] Unusual signature for ${filename}: ${bytes.slice(0, 4).join(',')}`);
  }
  
  return true;
}

/**
 * Register fonts in pdfmake VFS using direct assignment
 */
function registerFonts(regularBuffer: ArrayBuffer, boldBuffer: ArrayBuffer): void {
  // Convert to base64
  const regularBase64 = arrayBufferToBase64(regularBuffer);
  const boldBase64 = arrayBufferToBase64(boldBuffer);
  
  console.log(`[PDF FONTS] Base64 sizes: Regular=${regularBase64.length}, Bold=${boldBase64.length}`);
  
  // Ensure VFS exists
  if (!pdfMake.vfs) {
    pdfMake.vfs = {};
  }
  
  // Direct VFS assignment (most compatible method)
  pdfMake.vfs[FONT_FILES.regular] = regularBase64;
  pdfMake.vfs[FONT_FILES.bold] = boldBase64;
  
  // Ensure fonts object exists
  if (!pdfMake.fonts) {
    pdfMake.fonts = {};
  }
  
  // Register font family
  pdfMake.fonts[FONT_NAME] = {
    normal: FONT_FILES.regular,
    bold: FONT_FILES.bold,
    italics: FONT_FILES.regular,
    bolditalics: FONT_FILES.bold,
  };
  
  console.log('[PDF FONTS] ✅ Cairo fonts registered');
  console.log('[PDF FONTS] VFS keys:', Object.keys(pdfMake.vfs).filter(k => k.includes('Cairo')));
  console.log('[PDF FONTS] Font families:', Object.keys(pdfMake.fonts));
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
  
  // Double-check the base64 data is substantial
  const regularSize = pdfMake.vfs?.[FONT_FILES.regular]?.length || 0;
  const boldSize = pdfMake.vfs?.[FONT_FILES.bold]?.length || 0;
  
  const isValid = hasRegular && hasBold && hasFamily && regularSize > 10000 && boldSize > 10000;
  
  if (!isValid && state.ready) {
    console.warn('[PDF FONTS] Font validation failed, resetting state');
    state.ready = false;
  }
  
  return isValid;
}

/**
 * Initialize fonts - safe to call multiple times
 */
export async function initializeFonts(): Promise<void> {
  const state = getState();
  
  // Already ready and validated
  if (areFontsReady()) {
    console.log('[PDF FONTS] Already initialized');
    return;
  }
  
  // Recovery from cache
  if (state.cache.regular && state.cache.bold) {
    console.log('[PDF FONTS] Recovering from cache...');
    registerFonts(state.cache.regular, state.cache.bold);
    state.ready = true;
    
    if (areFontsReady()) {
      return;
    }
  }
  
  // Already loading - wait for it
  if (state.promise) {
    console.log('[PDF FONTS] Already loading, waiting...');
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
  console.log('[PDF FONTS] Force reloading...');
  const state = getState();
  state.promise = null;
  state.ready = false;
  // Keep cache if available
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
  vfsSizes: { regular: number; bold: number };
} {
  const state = getState();
  
  return {
    ready: state.ready,
    loading: state.loading,
    error: state.error?.message || null,
    vfsKeys: Object.keys(pdfMake.vfs || {}).filter(k => k.includes('Cairo')),
    families: Object.keys(pdfMake.fonts || {}),
    vfsSizes: {
      regular: pdfMake.vfs?.[FONT_FILES.regular]?.length || 0,
      bold: pdfMake.vfs?.[FONT_FILES.bold]?.length || 0,
    },
  };
}
