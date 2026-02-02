/**
 * FONT MANAGEMENT FOR PDF GENERATION
 * 
 * Handles loading and registering Cairo fonts for Arabic RTL support.
 * Uses public/ folder for reliable production loading.
 */

import { pdfMake } from './pdfmake-instance';

// Font configuration
export const FONT_NAME = 'Cairo';
export const FONT_FILES = {
  regular: 'Cairo-Regular.ttf',
  bold: 'Cairo-Bold.ttf',
} as const;

// Singleton state key for HMR persistence
const STATE_KEY = '__pdfFontsState_v5__';

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
  const chunkSize = 32768;
  
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(binary);
}

/**
 * Load font file as ArrayBuffer from public/fonts/
 */
async function loadFont(filename: string): Promise<ArrayBuffer> {
  // ONLY load from public/fonts/ for reliability
  const url = `/fonts/${filename}`;
  
  console.log(`[PDF FONTS] Loading ${filename} from ${url}...`);
  
  try {
    const response = await fetch(url, { 
      cache: 'force-cache',
      credentials: 'same-origin',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const buffer = await response.arrayBuffer();
    
    if (buffer.byteLength < 10000) {
      throw new Error(`Font file too small: ${buffer.byteLength} bytes`);
    }
    
    console.log(`[PDF FONTS] ✓ Loaded ${filename}: ${buffer.byteLength} bytes`);
    return buffer;
    
  } catch (err) {
    console.error(`[PDF FONTS] ✗ Failed to load ${filename}:`, err);
    throw new Error(`FONT_LOAD_FAILED: ${filename} - ${err}`);
  }
}

/**
 * Validate TTF font signature
 */
function validateFontSignature(buffer: ArrayBuffer, filename: string): boolean {
  const bytes = new Uint8Array(buffer);
  
  if (bytes.length < 4) {
    console.error(`[PDF FONTS] ${filename} is too small (${bytes.length} bytes)`);
    return false;
  }
  
  // TTF signature: 0x00 0x01 0x00 0x00
  const isTTF = bytes[0] === 0x00 && bytes[1] === 0x01 && bytes[2] === 0x00 && bytes[3] === 0x00;
  // OTF signature: 'OTTO'
  const isOTF = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]) === 'OTTO';
  
  if (!isTTF && !isOTF) {
    console.warn(`[PDF FONTS] ${filename} has unusual signature: [${bytes[0]}, ${bytes[1]}, ${bytes[2]}, ${bytes[3]}]`);
  }
  
  return true;
}

/**
 * Register fonts in pdfmake VFS using direct assignment
 * CRITICAL: Must add to pdfMake.vfs directly (same object reference)
 */
function registerFonts(regularBuffer: ArrayBuffer, boldBuffer: ArrayBuffer): void {
  // Convert to base64
  const regularBase64 = arrayBufferToBase64(regularBuffer);
  const boldBase64 = arrayBufferToBase64(boldBuffer);
  
  console.log(`[PDF FONTS] Base64 sizes: Regular=${regularBase64.length}, Bold=${boldBase64.length}`);
  
  // Validate sizes (real fonts are ~300KB base64)
  if (regularBase64.length < 100000) {
    throw new Error(`FONT_BASE64_TOO_SMALL: Cairo-Regular only ${regularBase64.length} chars`);
  }
  if (boldBase64.length < 100000) {
    throw new Error(`FONT_BASE64_TOO_SMALL: Cairo-Bold only ${boldBase64.length} chars`);
  }
  
  // CRITICAL: Add to the existing VFS object (same reference pdfmake uses internally)
  // Do NOT create a new object or reassign pdfMake.vfs
  if (!pdfMake.vfs || typeof pdfMake.vfs !== 'object') {
    console.error('[PDF FONTS] VFS not initialized! This should not happen.');
    throw new Error('PDF_VFS_NOT_INITIALIZED');
  }
  
  // Add Cairo fonts to the VFS
  pdfMake.vfs[FONT_FILES.regular] = regularBase64;
  pdfMake.vfs[FONT_FILES.bold] = boldBase64;
  
  // Ensure fonts object exists
  if (!pdfMake.fonts) {
    pdfMake.fonts = {};
  }
  
  // Register font family with all variants
  pdfMake.fonts[FONT_NAME] = {
    normal: FONT_FILES.regular,
    bold: FONT_FILES.bold,
    italics: FONT_FILES.regular,
    bolditalics: FONT_FILES.bold,
  };
  
  // Verify registration by checking the VFS directly
  const vfsRegularSize = pdfMake.vfs[FONT_FILES.regular]?.length || 0;
  const vfsBoldSize = pdfMake.vfs[FONT_FILES.bold]?.length || 0;
  
  console.log('[PDF FONTS] ✓ Cairo fonts added to VFS');
  console.log(`[PDF FONTS] VFS verified: ${FONT_FILES.regular}=${vfsRegularSize}, ${FONT_FILES.bold}=${vfsBoldSize}`);
  console.log('[PDF FONTS] Total VFS entries:', Object.keys(pdfMake.vfs).length);
  console.log('[PDF FONTS] Font families:', Object.keys(pdfMake.fonts));
}

/**
 * Check if fonts are registered in VFS
 */
export function areFontsReady(): boolean {
  const state = getState();
  
  if (!state.ready) return false;
  
  // Verify VFS contains fonts with substantial data
  const hasRegular = Boolean(pdfMake.vfs?.[FONT_FILES.regular]);
  const hasBold = Boolean(pdfMake.vfs?.[FONT_FILES.bold]);
  const hasFamily = Boolean(pdfMake.fonts?.[FONT_NAME]);
  
  const regularSize = pdfMake.vfs?.[FONT_FILES.regular]?.length || 0;
  const boldSize = pdfMake.vfs?.[FONT_FILES.bold]?.length || 0;
  
  const isValid = hasRegular && hasBold && hasFamily && regularSize > 100000 && boldSize > 100000;
  
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
    console.log('[PDF FONTS] Already initialized and validated');
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
      console.log('[PDF FONTS] Loading Cairo fonts from /fonts/...');
      
      // Load in parallel
      const [regular, bold] = await Promise.all([
        loadFont(FONT_FILES.regular),
        loadFont(FONT_FILES.bold),
      ]);
      
      // Validate font signatures
      validateFontSignature(regular, FONT_FILES.regular);
      validateFontSignature(bold, FONT_FILES.bold);
      
      console.log(`[PDF FONTS] Loaded: Regular ${regular.byteLength}b, Bold ${bold.byteLength}b`);
      
      // Cache for recovery
      state.cache.regular = regular;
      state.cache.bold = bold;
      
      // Register in pdfMake
      registerFonts(regular, bold);
      
      state.ready = true;
      state.error = null;
      
      console.log('[PDF FONTS] ✓ Initialization complete');
      
    } catch (error) {
      state.error = error instanceof Error ? error : new Error(String(error));
      state.promise = null;
      state.ready = false;
      console.error('[PDF FONTS] ✗ Initialization failed:', error);
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
  vfsSizes: { regular: number; bold: number };
} {
  const state = getState();
  
  return {
    ready: state.ready,
    loading: state.loading,
    error: state.error?.message || null,
    vfsKeys: Object.keys(pdfMake.vfs || {}).filter(k => k.includes('Cairo') || k.includes('Roboto')),
    families: Object.keys(pdfMake.fonts || {}),
    vfsSizes: {
      regular: pdfMake.vfs?.[FONT_FILES.regular]?.length || 0,
      bold: pdfMake.vfs?.[FONT_FILES.bold]?.length || 0,
    },
  };
}
