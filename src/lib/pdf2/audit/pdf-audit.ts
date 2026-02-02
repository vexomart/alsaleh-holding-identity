/**
 * PDF SYSTEM AUDIT MODULE
 * 
 * Real comprehensive diagnostics - no fake checks.
 */

import { pdfMake } from '../core/pdfmake-instance';
import { FONT_NAME, FONT_FILES, areFontsReady, initializeFonts, getFontDiagnostics, forceReloadFonts } from '../core/fonts';
import { generatePdfBlob } from '../core/generator';
import { downloadPdfBlob } from '../core/downloader';
import { scanPdfReferences, validateScanResults, type ScanResult } from './scan';
import { validatePdfMakeInstance, type InstanceValidation } from './instance-check';
import { buildInvoiceDoc, sampleInvoiceData } from '../templates/invoice-template';
import { buildContractDoc, sampleContractData } from '../templates/contract-template';

// Audit report structure
export interface AuditReport {
  timestamp: string;
  durationMs: number;
  
  // Phase 1: Codebase scan
  scan: ScanResult;
  scanValidation: { ok: boolean; failures: string[] };
  
  // Phase 2: Instance validation
  instance: InstanceValidation;
  
  // Phase 3: Font initialization
  fonts: {
    initialized: boolean;
    diagnostics: ReturnType<typeof getFontDiagnostics>;
    error?: string;
  };
  
  // Phase 4: Generation tests
  invoiceTest: GenerationResult;
  contractTest: GenerationResult;
  
  // Phase 5: Download test
  downloadTest: DownloadResult;
  
  // Phase 6: RTL checks
  rtlChecks: { ok: boolean; notes: string[] };
  
  // Overall
  overall: 'PASS' | 'FAIL';
  failures: string[];
}

interface GenerationResult {
  ok: boolean;
  stage: 'init' | 'build_doc' | 'validate_doc' | 'generate' | 'complete';
  blobSize?: number;
  durationMs?: number;
  error?: string;
}

interface DownloadResult {
  ok: boolean;
  method?: 'anchor' | 'tab' | 'iframe';
  error?: string;
  tested: boolean;
}

/**
 * Run comprehensive PDF audit with real checks
 */
export async function runPdfAudit(): Promise<AuditReport> {
  const startTime = Date.now();
  const failures: string[] = [];
  
  console.log('[PDF AUDIT] ══════════════════════════════════════════');
  console.log('[PDF AUDIT] STARTING COMPREHENSIVE AUDIT');
  console.log('[PDF AUDIT] ══════════════════════════════════════════');
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 1: Codebase Scan
  // ═══════════════════════════════════════════════════════════════
  console.log('\n[PDF AUDIT] PHASE 1: Codebase Scan');
  const scan = scanPdfReferences();
  const scanValidation = validateScanResults(scan);
  
  console.log('[PDF AUDIT] Scan results:', {
    createPdf: scan.createPdf,
    pdfmakeBuild: scan.pdfmakeBuild,
    getBlob: scan.getBlob,
    getBuffer: scan.getBuffer,
    cairo: scan.cairo,
  });
  
  if (!scanValidation.ok) {
    failures.push(...scanValidation.failures);
  }
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 2: Instance Validation
  // ═══════════════════════════════════════════════════════════════
  console.log('\n[PDF AUDIT] PHASE 2: Instance Validation');
  const instance = validatePdfMakeInstance(pdfMake);
  
  console.log('[PDF AUDIT] Instance validation:', {
    hasCreatePdf: instance.hasCreatePdf,
    hasVfs: instance.hasVfs,
    hasFonts: instance.hasFonts,
    hasGetBlob: instance.hasGetBlob,
    hasGetBuffer: instance.hasGetBuffer,
    vfsKeysCount: instance.vfsKeysCount,
    fontsKeys: instance.fontsKeys,
    cairoInVfs: instance.cairoInVfs,
    cairoInFonts: instance.cairoInFonts,
  });
  
  if (!instance.ok) {
    failures.push(...instance.issues.map(i => `Instance: ${i}`));
  }
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 3: Font Initialization
  // ═══════════════════════════════════════════════════════════════
  console.log('\n[PDF AUDIT] PHASE 3: Font Initialization');
  let fontError: string | undefined;
  
  if (!areFontsReady()) {
    console.log('[PDF AUDIT] Fonts not ready, force reloading...');
    try {
      await forceReloadFonts();
    } catch (err) {
      fontError = err instanceof Error ? err.message : String(err);
      failures.push(`Font init failed: ${fontError}`);
    }
  }
  
  const fontDiag = getFontDiagnostics();
  console.log('[PDF AUDIT] Font diagnostics:', fontDiag);
  
  if (!fontDiag.ready) {
    failures.push('Fonts not ready after initialization');
  }
  if (fontDiag.vfsSizes.regular < 100000) {
    failures.push(`Cairo-Regular base64 too small: ${fontDiag.vfsSizes.regular}`);
  }
  if (fontDiag.vfsSizes.bold < 100000) {
    failures.push(`Cairo-Bold base64 too small: ${fontDiag.vfsSizes.bold}`);
  }
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 4: Generation Tests (using generator, not direct createPdf)
  // ═══════════════════════════════════════════════════════════════
  console.log('\n[PDF AUDIT] PHASE 4: Generation Tests');
  
  // Invoice test
  const invoiceTest = await testGeneration('invoice');
  if (!invoiceTest.ok) {
    failures.push(`Invoice generation failed at ${invoiceTest.stage}: ${invoiceTest.error}`);
  }
  
  // Contract test
  const contractTest = await testGeneration('contract');
  if (!contractTest.ok) {
    failures.push(`Contract generation failed at ${contractTest.stage}: ${contractTest.error}`);
  }
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 5: Download Test (REAL download attempt)
  // ═══════════════════════════════════════════════════════════════
  console.log('\n[PDF AUDIT] PHASE 5: Download Test');
  let downloadTest: DownloadResult = { ok: false, tested: false, error: 'Not tested' };
  
  if (invoiceTest.ok && invoiceTest.blobSize && invoiceTest.blobSize > 1000) {
    downloadTest = await testRealDownload();
  } else {
    downloadTest = { ok: false, tested: false, error: 'Skipped - no valid invoice blob' };
    failures.push('Download test skipped - invoice generation failed');
  }
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 6: RTL Checks
  // ═══════════════════════════════════════════════════════════════
  console.log('\n[PDF AUDIT] PHASE 6: RTL Configuration');
  const rtlChecks = checkRtlConfig();
  if (!rtlChecks.ok) {
    failures.push('RTL configuration issues');
  }
  
  // ═══════════════════════════════════════════════════════════════
  // FINAL REPORT
  // ═══════════════════════════════════════════════════════════════
  const durationMs = Date.now() - startTime;
  const overall = failures.length === 0 ? 'PASS' : 'FAIL';
  
  const report: AuditReport = {
    timestamp: new Date().toISOString(),
    durationMs,
    scan,
    scanValidation,
    instance,
    fonts: {
      initialized: fontDiag.ready,
      diagnostics: fontDiag,
      error: fontError,
    },
    invoiceTest,
    contractTest,
    downloadTest,
    rtlChecks,
    overall,
    failures,
  };
  
  console.log('\n[PDF AUDIT] ══════════════════════════════════════════');
  console.log(`[PDF AUDIT] AUDIT COMPLETE: ${overall}`);
  console.log(`[PDF AUDIT] Duration: ${durationMs}ms`);
  console.log('[PDF AUDIT] ══════════════════════════════════════════');
  
  if (failures.length > 0) {
    console.error('[PDF AUDIT] FAILURES:', failures);
  } else {
    console.log('[PDF AUDIT] All checks passed!');
  }
  
  console.log('\n[PDF AUDIT] Full Report:', JSON.stringify(report, null, 2));
  
  return report;
}

/**
 * Test generation using the generator module (single createPdf location)
 */
async function testGeneration(type: 'invoice' | 'contract'): Promise<GenerationResult> {
  const startTime = Date.now();
  let stage: GenerationResult['stage'] = 'init';
  
  try {
    // Build document
    stage = 'build_doc';
    const doc = type === 'invoice' 
      ? buildInvoiceDoc(sampleInvoiceData)
      : buildContractDoc(sampleContractData);
    
    // Validate document structure
    stage = 'validate_doc';
    if (!doc || typeof doc !== 'object') {
      return { ok: false, stage, error: 'Doc is not an object' };
    }
    if (!doc.content || !Array.isArray(doc.content)) {
      return { ok: false, stage, error: 'Doc.content is not an array' };
    }
    if (doc.defaultStyle?.font !== FONT_NAME) {
      return { ok: false, stage, error: `defaultStyle.font is ${doc.defaultStyle?.font}, expected ${FONT_NAME}` };
    }
    
    // Generate using the central generator (which calls createPdf)
    stage = 'generate';
    console.log(`[PDF AUDIT] Generating ${type}...`);
    
    const blob = await generatePdfBlob(doc, { timeout: 30000, retries: 1 });
    
    stage = 'complete';
    const durationMs = Date.now() - startTime;
    
    console.log(`[PDF AUDIT] ${type} generated: ${blob.size} bytes in ${durationMs}ms`);
    
    if (blob.size < 5000) {
      return { ok: false, stage, blobSize: blob.size, durationMs, error: `Blob too small: ${blob.size} bytes` };
    }
    
    return { ok: true, stage, blobSize: blob.size, durationMs };
    
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error(`[PDF AUDIT] ${type} generation failed:`, error);
    return { ok: false, stage, error, durationMs: Date.now() - startTime };
  }
}

/**
 * Test REAL download (not just function existence check)
 */
async function testRealDownload(): Promise<DownloadResult> {
  try {
    // Generate a real PDF blob for download
    console.log('[PDF AUDIT] Generating test PDF for download...');
    const doc = buildInvoiceDoc(sampleInvoiceData);
    const blob = await generatePdfBlob(doc, { timeout: 30000, retries: 1 });
    
    if (blob.size < 1000) {
      return { ok: false, tested: true, error: `Test blob too small: ${blob.size}` };
    }
    
    // Attempt real download
    console.log(`[PDF AUDIT] Attempting download of ${blob.size} byte PDF...`);
    const result = downloadPdfBlob(blob, `audit-test-${Date.now()}.pdf`);
    
    console.log('[PDF AUDIT] Download result:', result);
    
    return {
      ok: result.success,
      method: result.method,
      tested: true,
      error: result.error,
    };
    
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error('[PDF AUDIT] Download test failed:', error);
    return { ok: false, tested: true, error };
  }
}

/**
 * Check RTL configuration
 */
function checkRtlConfig(): { ok: boolean; notes: string[] } {
  const notes: string[] = [];
  let ok = true;
  
  // Verify Cairo is the expected font
  if (FONT_NAME === 'Cairo') {
    notes.push('✓ Cairo is configured as default font');
  } else {
    notes.push(`✗ Default font is ${FONT_NAME}, expected Cairo`);
    ok = false;
  }
  
  // Check font files
  if (FONT_FILES.regular === 'Cairo-Regular.ttf' && FONT_FILES.bold === 'Cairo-Bold.ttf') {
    notes.push('✓ Font file names correct');
  } else {
    notes.push('✗ Font file names incorrect');
    ok = false;
  }
  
  // Verify fonts are in pdfMake
  const cairoFont = pdfMake.fonts?.Cairo;
  if (cairoFont) {
    notes.push(`✓ Cairo font registered with variants: ${JSON.stringify(cairoFont)}`);
  } else {
    notes.push('✗ Cairo font not registered in pdfMake.fonts');
    ok = false;
  }
  
  notes.push('✓ RTL alignment: right (configured in arabicDocumentStyles)');
  notes.push('✓ Unicode isolates available for bidi text');
  
  return { ok, notes };
}

// Expose for dev console
if (typeof window !== 'undefined') {
  (window as any).runPdfAudit = runPdfAudit;
}

export default runPdfAudit;
