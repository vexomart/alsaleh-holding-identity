/**
 * PDF INITIALIZATION — SINGLETON FONT LOADER
 * 
 * MUST be called before any PDF generation.
 * Loads Cairo fonts and registers them in pdfMake VFS.
 */

import pdfMake from './pdfmake';

// Font configuration
export const FONT_NAME = 'Cairo';
export const FONT_FILES = {
  regular: 'Cairo-Regular.ttf',
  bold: 'Cairo-Bold.ttf',
} as const;

// Singleton state stored in globalThis for HMR persistence
const STATE_KEY = '__pdfFontState_v2__';

interface FontState {
  initPromise: Promise<void> | null;
  fontsReady: boolean;
  cachedRegular: string | null;
  cachedBold: string | null;
}

function getState(): FontState {
  if (!(globalThis as any)[STATE_KEY]) {
    (globalThis as any)[STATE_KEY] = {
      initPromise: null,
      fontsReady: false,
      cachedRegular: null,
      cachedBold: null,
    };
  }
  return (globalThis as any)[STATE_KEY];
}

/**
 * Load a font file and convert to base64
 */
async function loadFontAsBase64(fontName: string): Promise<string> {
  // Dynamic import to get the URL
  const fontUrl = new URL(`../../assets/fonts/${fontName}`, import.meta.url).href;
  
  console.log(`[PDF2 INIT] Fetching font: ${fontName} from ${fontUrl}`);
  
  const response = await fetch(fontUrl);
  if (!response.ok) {
    throw new Error(`PDF_FONT_FETCH_FAILED: ${fontName} (${response.status})`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  
  console.log(`[PDF2 INIT] Font ${fontName} loaded: ${bytes.length} bytes`);
  
  // Validate font signature (TTF starts with 0x00010000)
  if (bytes.length < 4) {
    throw new Error('PDF_FONT_INVALID: File too small');
  }
  
  const isTTF = bytes[0] === 0x00 && bytes[1] === 0x01 && bytes[2] === 0x00 && bytes[3] === 0x00;
  const isOTF = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]) === 'OTTO';
  
  if (!isTTF && !isOTF) {
    console.warn(`[PDF2 INIT] Font signature: ${bytes[0]}, ${bytes[1]}, ${bytes[2]}, ${bytes[3]}`);
    // Don't throw, some fonts have different signatures
  }
  
  // Convert to base64
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  return btoa(binary);
}

/**
 * Inject fonts into pdfMake VFS
 */
function injectFonts(regular: string, bold: string): void {
  if (typeof (pdfMake as any).addVirtualFileSystem !== 'function' || typeof (pdfMake as any).addFonts !== 'function') {
    throw new Error('PDF_INIT_FAILED: pdfMake browser extensions not available');
  }

  // IMPORTANT: pdfmake v0.3.x reads fonts from its INTERNAL virtualfs.
  // The correct way is addVirtualFileSystem + addFonts (NOT setting pdfMake.vfs).
  (pdfMake as any).addVirtualFileSystem({
    [FONT_FILES.regular]: regular,
    [FONT_FILES.bold]: bold,
  });

  (pdfMake as any).addFonts({
    [FONT_NAME]: {
      normal: FONT_FILES.regular,
      bold: FONT_FILES.bold,
      italics: FONT_FILES.regular,
      bolditalics: FONT_FILES.bold,
    },
  });

  const vfsKeys = Object.keys((pdfMake as any).virtualfs?.storage || {}).filter((k) => k.includes('Cairo'));
  const fontFamilies = Object.keys((pdfMake as any).fonts || {});
  console.log('[PDF2 INIT] Fonts registered into internal virtualfs');
  console.log('[PDF2 INIT] internal VFS keys:', vfsKeys);
  console.log('[PDF2 INIT] fonts families:', fontFamilies);
}

function hasFontInInternalVfs(fontFile: string): boolean {
  try {
    return !!(pdfMake as any).virtualfs?.existsSync?.(fontFile);
  } catch {
    return false;
  }
}

/**
 * Initialize PDF fonts — SINGLETON
 * Safe to call multiple times, will only load once.
 */
export async function ensurePdfReady(): Promise<void> {
  const state = getState();
  
  // Check if fonts are already in INTERNAL virtualfs
  const hasRegular = hasFontInInternalVfs(FONT_FILES.regular);
  const hasBold = hasFontInInternalVfs(FONT_FILES.bold);
  const hasFamily = !!(pdfMake as any).fonts?.[FONT_NAME];
  
  // Already ready
  if (state.fontsReady && hasRegular && hasBold && hasFamily) {
    console.log('[PDF2 INIT] Fonts already ready');
    return;
  }
  
  // Recovery: fonts were cleared (HMR) but we have cache
  if (state.cachedRegular && state.cachedBold && (!hasRegular || !hasBold || !hasFamily)) {
    console.warn('[PDF2 INIT] Recovering fonts from cache...');
    injectFonts(state.cachedRegular, state.cachedBold);
    state.fontsReady = true;
    assertFontsReady();
    return;
  }
  
  // First time or need to reload
  if (!state.initPromise) {
    state.initPromise = loadFontsInternal();
  }
  
  await state.initPromise;
}

/**
 * Internal font loading logic
 */
async function loadFontsInternal(): Promise<void> {
  const state = getState();
  console.log('[PDF2 INIT] Loading Cairo fonts...');
  
  try {
    // Load fonts in parallel
    const [regular, bold] = await Promise.all([
      loadFontAsBase64(FONT_FILES.regular),
      loadFontAsBase64(FONT_FILES.bold),
    ]);
    
    console.log('[PDF2 INIT] Cairo-Regular base64 length:', regular.length);
    console.log('[PDF2 INIT] Cairo-Bold base64 length:', bold.length);
    
    // Cache for recovery
    state.cachedRegular = regular;
    state.cachedBold = bold;
    
    // Inject into pdfMake
    injectFonts(regular, bold);
    
    // Mark as ready
    state.fontsReady = true;
    
    console.log('[PDF2 INIT] ✅ Cairo fonts ready');
    
    // Final verification
    assertFontsReady();
    
  } catch (error) {
    state.initPromise = null;
    state.fontsReady = false;
    console.error('[PDF2 INIT] Font loading failed:', error);
    throw error;
  }
}

/**
 * HARD ASSERTION — throws if fonts not ready
 */
export function assertFontsReady(): void {
  const errors: string[] = [];

  const hasRegular = hasFontInInternalVfs(FONT_FILES.regular);
  const hasBold = hasFontInInternalVfs(FONT_FILES.bold);
  const hasFamily = !!(pdfMake as any).fonts?.[FONT_NAME];

  if (!hasRegular) errors.push(`${FONT_FILES.regular} missing from internal VFS`);
  if (!hasBold) errors.push(`${FONT_FILES.bold} missing from internal VFS`);
  if (!hasFamily) errors.push(`${FONT_NAME} font family not registered`);
  
  if (errors.length > 0) {
    console.error('[PDF2 INIT] Font assertion failed:', errors);
    console.error('[PDF2 INIT] internal VFS keys:', Object.keys((pdfMake as any).virtualfs?.storage || {}));
    console.error('[PDF2 INIT] Font families:', Object.keys((pdfMake as any).fonts || {}));
    throw new Error(`PDF_FONTS_NOT_READY: ${errors.join(', ')}`);
  }
  
  console.log('[PDF2 INIT] ✅ Font assertion passed');
}

/**
 * Force re-inject fonts (emergency recovery)
 */
export async function forceReloadFonts(): Promise<void> {
  const state = getState();
  state.initPromise = null;
  state.fontsReady = false;
  state.cachedRegular = null;
  state.cachedBold = null;
  await ensurePdfReady();
}

/**
 * Get font diagnostics
 */
export function getFontDiagnostics(): {
  fontsReady: boolean;
  regularSize: number;
  boldSize: number;
  fontFamily: boolean;
  vfsKeys: string[];
  fontFamilies: string[];
} {
  const state = getState();
  const storage = ((pdfMake as any).virtualfs?.storage || {}) as Record<string, any>;
  return {
    fontsReady: state.fontsReady,
    regularSize: (storage[FONT_FILES.regular]?.length || 0) as number,
    boldSize: (storage[FONT_FILES.bold]?.length || 0) as number,
    fontFamily: !!(pdfMake as any).fonts?.[FONT_NAME],
    vfsKeys: Object.keys(storage).filter((k) => k.includes('Cairo')),
    fontFamilies: Object.keys((pdfMake as any).fonts || {}),
  };
}
