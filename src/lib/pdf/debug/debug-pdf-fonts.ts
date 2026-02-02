/**
 * PDF Font Debug Utility
 * 
 * Call from console: import('@/lib/pdf/debug/debug-pdf-fonts').then(m => m.debugPdfFonts())
 * 
 * This verifies:
 * - pdfMake VFS exists and has Cairo fonts
 * - Font family is registered
 * - Can generate and download a test Arabic PDF
 */

import { 
  pdfMakeInstance, 
  FONT_FILES, 
  ARABIC_FONT_NAME,
  initializeFonts,
  areFontsInitialized,
  assertFontsReady,
  getFontDiagnostics,
} from '../core/fonts';
import { downloadBlob } from '../core/download';

/**
 * Print current VFS and font state to console
 */
export function printFontState(): void {
  console.log('══════════════════════════════════════════════════════');
  console.log('PDF FONT DIAGNOSTIC REPORT');
  console.log('══════════════════════════════════════════════════════');
  
  // Check if pdfMakeInstance exists
  console.log('1) pdfMakeInstance exists:', !!pdfMakeInstance);
  
  // Check VFS
  const vfs = pdfMakeInstance?.vfs;
  console.log('2) pdfMake.vfs exists:', !!vfs);
  console.log('   VFS total keys:', vfs ? Object.keys(vfs).length : 0);
  
  // Check Cairo files specifically
  const hasRegular = !!vfs?.[FONT_FILES.regular];
  const hasBold = !!vfs?.[FONT_FILES.bold];
  const regularSize = vfs?.[FONT_FILES.regular]?.length || 0;
  const boldSize = vfs?.[FONT_FILES.bold]?.length || 0;
  
  console.log('3) Cairo-Regular.ttf in VFS:', hasRegular, `(${(regularSize / 1024).toFixed(1)} KB)`);
  console.log('4) Cairo-Bold.ttf in VFS:', hasBold, `(${(boldSize / 1024).toFixed(1)} KB)`);
  
  // Check font family registration
  const fonts = pdfMakeInstance?.fonts;
  console.log('5) pdfMake.fonts exists:', !!fonts);
  console.log('   Registered font families:', fonts ? Object.keys(fonts) : []);
  
  const hasCairoFamily = !!fonts?.[ARABIC_FONT_NAME];
  console.log('6) Cairo font family registered:', hasCairoFamily);
  
  if (hasCairoFamily) {
    console.log('   Cairo config:', fonts[ARABIC_FONT_NAME]);
  }
  
  // Check global pdfMake
  const globalPdfMake = (globalThis as any).pdfMake;
  console.log('7) globalThis.pdfMake exists:', !!globalPdfMake);
  console.log('   Same as pdfMakeInstance:', globalPdfMake === pdfMakeInstance);
  
  if (globalPdfMake && globalPdfMake !== pdfMakeInstance) {
    console.log('   ⚠️ WARNING: Global pdfMake is different instance!');
    console.log('   Global VFS has Cairo-Regular:', !!globalPdfMake.vfs?.[FONT_FILES.regular]);
    console.log('   Global VFS has Cairo-Bold:', !!globalPdfMake.vfs?.[FONT_FILES.bold]);
  }
  
  // Module state
  console.log('8) Module state:');
  console.log('   areFontsInitialized():', areFontsInitialized());
  
  // Summary
  console.log('──────────────────────────────────────────────────────');
  const allGood = hasRegular && hasBold && hasCairoFamily && regularSize > 10000 && boldSize > 10000;
  if (allGood) {
    console.log('✅ VERDICT: Fonts appear correctly configured');
  } else {
    console.log('❌ VERDICT: Font configuration INCOMPLETE');
    if (!hasRegular) console.log('   - Missing: Cairo-Regular.ttf');
    if (!hasBold) console.log('   - Missing: Cairo-Bold.ttf');
    if (!hasCairoFamily) console.log('   - Missing: Cairo font family registration');
    if (regularSize <= 10000) console.log('   - Cairo-Regular too small (corrupted?)');
    if (boldSize <= 10000) console.log('   - Cairo-Bold too small (corrupted?)');
  }
  console.log('══════════════════════════════════════════════════════');
}

/**
 * Force re-initialize fonts and print state
 */
export async function reinitializeFonts(): Promise<void> {
  console.log('[DEBUG] Force re-initializing fonts...');
  
  // Print state before
  console.log('\n--- STATE BEFORE ---');
  printFontState();
  
  // Re-initialize
  try {
    await initializeFonts();
    console.log('[DEBUG] initializeFonts() completed');
  } catch (err) {
    console.error('[DEBUG] initializeFonts() FAILED:', err);
    throw err;
  }
  
  // Print state after
  console.log('\n--- STATE AFTER ---');
  printFontState();
  
  // Try assertion
  try {
    assertFontsReady();
    console.log('[DEBUG] ✅ assertFontsReady() passed');
  } catch (err) {
    console.error('[DEBUG] ❌ assertFontsReady() FAILED:', err);
    throw err;
  }
}

/**
 * Generate a minimal test PDF with Arabic text
 */
export async function generateTestPdf(): Promise<Blob> {
  console.log('[DEBUG] Generating test PDF...');
  
  // Ensure fonts are ready
  await reinitializeFonts();
  
  const docDefinition = {
    pageSize: 'A4' as const,
    pageMargins: [40, 60, 40, 60] as [number, number, number, number],
    defaultStyle: {
      font: ARABIC_FONT_NAME,
      alignment: 'right' as const,
    },
    content: [
      {
        text: 'اختبار خط Cairo',
        font: ARABIC_FONT_NAME,
        fontSize: 24,
        bold: true,
        alignment: 'center' as const,
        margin: [0, 0, 0, 20] as [number, number, number, number],
      },
      {
        text: 'هذا نص تجريبي باللغة العربية للتحقق من عرض الخط بشكل صحيح.',
        font: ARABIC_FONT_NAME,
        fontSize: 14,
        alignment: 'right' as const,
        margin: [0, 0, 0, 15] as [number, number, number, number],
      },
      {
        text: 'نص عريض: اختبار Cairo Bold',
        font: ARABIC_FONT_NAME,
        fontSize: 14,
        bold: true,
        alignment: 'right' as const,
        margin: [0, 0, 0, 15] as [number, number, number, number],
      },
      {
        text: 'أرقام مختلطة: 123 ريال سعودي / INV-2026-001 / VAT: 15%',
        font: ARABIC_FONT_NAME,
        fontSize: 12,
        alignment: 'right' as const,
        margin: [0, 0, 0, 15] as [number, number, number, number],
      },
      {
        text: '────────────────────────────────',
        font: ARABIC_FONT_NAME,
        fontSize: 10,
        alignment: 'center' as const,
        color: '#94a3b8',
        margin: [0, 20, 0, 20] as [number, number, number, number],
      },
      {
        text: `Generated at: ${new Date().toISOString()}`,
        font: ARABIC_FONT_NAME,
        fontSize: 9,
        alignment: 'center' as const,
        color: '#64748b',
      },
    ],
  };
  
  console.log('[DEBUG] Creating PDF document...');
  console.log('[DEBUG] VFS state:', {
    vfsHasCairoRegular: !!pdfMakeInstance.vfs?.['Cairo-Regular.ttf'],
    vfsHasCairoBold: !!pdfMakeInstance.vfs?.['Cairo-Bold.ttf'],
  });
  
  return new Promise((resolve, reject) => {
    try {
      // CRITICAL FIX: Call createPdf with ONLY docDefinition
      // DO NOT pass null/extra params - this causes "options invalid type" error
      const pdfDoc = pdfMakeInstance.createPdf(docDefinition);
      
      pdfDoc.getBlob((blob: Blob) => {
        if (blob && blob.size > 0) {
          console.log('[DEBUG] ✅ Test PDF generated, size:', blob.size, 'bytes');
          resolve(blob);
        } else {
          reject(new Error('getBlob returned empty blob'));
        }
      });
    } catch (err) {
      console.error('[DEBUG] ❌ PDF creation failed:', err);
      reject(err);
    }
  });
}

/**
 * Full debug workflow: check state, reinitialize, generate and download test PDF
 */
export async function debugPdfFonts(): Promise<void> {
  console.clear();
  console.log('🔍 PDF FONT DEBUG - STARTING...\n');
  
  try {
    // Step 1: Print current state
    console.log('STEP 1: Current state');
    printFontState();
    
    // Step 2: Generate test PDF
    console.log('\nSTEP 2: Generate test PDF');
    const blob = await generateTestPdf();
    
    // Step 3: Download
    console.log('\nSTEP 3: Download test PDF');
    downloadBlob(blob, `pdf-font-test-${Date.now()}.pdf`);
    
    console.log('\n════════════════════════════════════════════════════');
    console.log('✅ DEBUG COMPLETE - Check downloaded PDF for Arabic rendering');
    console.log('════════════════════════════════════════════════════');
    
  } catch (err) {
    console.error('\n════════════════════════════════════════════════════');
    console.error('❌ DEBUG FAILED:', err);
    console.error('════════════════════════════════════════════════════');
    throw err;
  }
}

/**
 * Get full diagnostics as object (for programmatic use)
 */
export function getFullDiagnostics(): {
  pdfMakeExists: boolean;
  vfsExists: boolean;
  vfsKeyCount: number;
  cairoRegularExists: boolean;
  cairoRegularSize: number;
  cairoBoldExists: boolean;
  cairoBoldSize: number;
  cairoFamilyRegistered: boolean;
  fontsInitialized: boolean;
  globalPdfMakeSame: boolean;
} {
  const vfs = pdfMakeInstance?.vfs;
  const fonts = pdfMakeInstance?.fonts;
  const globalPdfMake = (globalThis as any).pdfMake;
  
  return {
    pdfMakeExists: !!pdfMakeInstance,
    vfsExists: !!vfs,
    vfsKeyCount: vfs ? Object.keys(vfs).length : 0,
    cairoRegularExists: !!vfs?.[FONT_FILES.regular],
    cairoRegularSize: vfs?.[FONT_FILES.regular]?.length || 0,
    cairoBoldExists: !!vfs?.[FONT_FILES.bold],
    cairoBoldSize: vfs?.[FONT_FILES.bold]?.length || 0,
    cairoFamilyRegistered: !!fonts?.[ARABIC_FONT_NAME],
    fontsInitialized: areFontsInitialized(),
    globalPdfMakeSame: globalPdfMake === pdfMakeInstance,
  };
}

// Export for console access
(window as any).debugPdfFonts = debugPdfFonts;
(window as any).printFontState = printFontState;
(window as any).reinitializeFonts = reinitializeFonts;
(window as any).getFullDiagnostics = getFullDiagnostics;

console.log('[PDF Debug] Functions available: window.debugPdfFonts(), window.printFontState(), window.reinitializeFonts()');
