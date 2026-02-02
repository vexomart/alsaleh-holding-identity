/**
 * PDF INITIALIZATION — SINGLETON FONT LOADER
 * 
 * MUST be called before any PDF generation.
 * Loads Cairo fonts and registers them in pdfMake VFS.
 */

import pdfMake from './pdfmake';
import cairoRegularUrl from '@/assets/fonts/Cairo-Regular.ttf?url';
import cairoBoldUrl from '@/assets/fonts/Cairo-Bold.ttf?url';

// Font configuration
export const FONT_NAME = 'Cairo';
export const FONT_FILES = {
  regular: 'Cairo-Regular.ttf',
  bold: 'Cairo-Bold.ttf',
} as const;

// Singleton state
let initPromise: Promise<void> | null = null;
let fontsReady = false;
let cachedRegular: string | null = null;
let cachedBold: string | null = null;

/**
 * Load a font file and convert to base64
 */
async function loadFontAsBase64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`PDF_FONT_FETCH_FAILED: ${url} (${response.status})`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  
  // Validate font signature (TTF starts with 0x00010000)
  if (bytes.length < 4) {
    throw new Error('PDF_FONT_INVALID: File too small');
  }
  
  const isTTF = bytes[0] === 0x00 && bytes[1] === 0x01 && bytes[2] === 0x00 && bytes[3] === 0x00;
  const isOTF = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]) === 'OTTO';
  
  if (!isTTF && !isOTF) {
    throw new Error('PDF_FONT_INVALID: Not a valid TTF/OTF file');
  }
  
  // Convert to base64
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  return btoa(binary);
}

/**
 * Initialize PDF fonts — SINGLETON
 * Safe to call multiple times, will only load once.
 */
export async function ensurePdfReady(): Promise<void> {
  // Already ready
  if (fontsReady && verifyCairoFonts()) {
    return;
  }
  
  // Recovery: fonts were cleared (HMR)
  if (fontsReady && !verifyCairoFonts() && cachedRegular && cachedBold) {
    recoverFonts();
    return;
  }
  
  // First time or need to reload
  if (!initPromise) {
    initPromise = loadFontsInternal();
  }
  
  await initPromise;
}

/**
 * Internal font loading logic
 */
async function loadFontsInternal(): Promise<void> {
  console.log('[PDF2 INIT] Loading Cairo fonts...');
  
  try {
    // Load fonts in parallel
    const [regular, bold] = await Promise.all([
      loadFontAsBase64(cairoRegularUrl),
      loadFontAsBase64(cairoBoldUrl),
    ]);
    
    // Cache for recovery
    cachedRegular = regular;
    cachedBold = bold;
    
    // Inject into VFS with EXACT keys
    pdfMake.vfs[FONT_FILES.regular] = regular;
    pdfMake.vfs[FONT_FILES.bold] = bold;
    
    // Register font family
    pdfMake.fonts[FONT_NAME] = {
      normal: FONT_FILES.regular,
      bold: FONT_FILES.bold,
      italics: FONT_FILES.regular,
      bolditalics: FONT_FILES.bold,
    };
    
    // Mark as ready
    fontsReady = true;
    
    console.log('[PDF2 INIT] ✅ Cairo fonts ready');
    console.log('[PDF2 INIT] VFS:', FONT_FILES.regular, '=', regular.length, 'chars');
    console.log('[PDF2 INIT] VFS:', FONT_FILES.bold, '=', bold.length, 'chars');
    
    // Final verification
    assertFontsReady();
    
  } catch (error) {
    initPromise = null;
    fontsReady = false;
    throw error;
  }
}

/**
 * Verify fonts are present in VFS
 */
function verifyCairoFonts(): boolean {
  return !!(
    pdfMake.vfs[FONT_FILES.regular]?.length > 10000 &&
    pdfMake.vfs[FONT_FILES.bold]?.length > 10000 &&
    pdfMake.fonts[FONT_NAME]
  );
}

/**
 * Recover fonts from cache (HMR fix)
 */
function recoverFonts(): void {
  if (!cachedRegular || !cachedBold) return;
  
  console.warn('[PDF2 INIT] Recovering fonts from cache...');
  
  pdfMake.vfs[FONT_FILES.regular] = cachedRegular;
  pdfMake.vfs[FONT_FILES.bold] = cachedBold;
  
  pdfMake.fonts[FONT_NAME] = {
    normal: FONT_FILES.regular,
    bold: FONT_FILES.bold,
    italics: FONT_FILES.regular,
    bolditalics: FONT_FILES.bold,
  };
  
  console.log('[PDF2 INIT] ✅ Fonts recovered');
}

/**
 * HARD ASSERTION — throws if fonts not ready
 */
export function assertFontsReady(): void {
  const errors: string[] = [];
  
  if (!pdfMake.vfs[FONT_FILES.regular]) {
    errors.push(`${FONT_FILES.regular} missing from VFS`);
  } else if (pdfMake.vfs[FONT_FILES.regular].length < 10000) {
    errors.push(`${FONT_FILES.regular} too small (${pdfMake.vfs[FONT_FILES.regular].length})`);
  }
  
  if (!pdfMake.vfs[FONT_FILES.bold]) {
    errors.push(`${FONT_FILES.bold} missing from VFS`);
  } else if (pdfMake.vfs[FONT_FILES.bold].length < 10000) {
    errors.push(`${FONT_FILES.bold} too small (${pdfMake.vfs[FONT_FILES.bold].length})`);
  }
  
  if (!pdfMake.fonts[FONT_NAME]) {
    errors.push(`${FONT_NAME} font family not registered`);
  }
  
  if (errors.length > 0) {
    throw new Error(`PDF_FONTS_NOT_READY: ${errors.join(', ')}`);
  }
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
} {
  return {
    fontsReady,
    regularSize: pdfMake.vfs[FONT_FILES.regular]?.length || 0,
    boldSize: pdfMake.vfs[FONT_FILES.bold]?.length || 0,
    fontFamily: !!pdfMake.fonts[FONT_NAME],
    vfsKeys: Object.keys(pdfMake.vfs).filter(k => k.includes('Cairo')),
  };
}
