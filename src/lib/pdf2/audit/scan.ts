/**
 * PDF CODEBASE SCAN MODULE
 * 
 * Real scan using Vite's import.meta.glob for frontend-safe analysis.
 */

export interface ScanResult {
  createPdf: { count: number; paths: string[] };
  pdfmakeBuild: { count: number; paths: string[] };
  vfs: { count: number; paths: string[] };
  cairo: { count: number; paths: string[] };
  getBlob: { count: number; paths: string[] };
  getBuffer: { count: number; paths: string[] };
}

/**
 * Scan project for PDF-related references
 * Uses Vite's import.meta.glob for frontend-safe file scanning
 */
export function scanPdfReferences(): ScanResult {
  // Use Vite's glob import to get all source files
  const files = import.meta.glob('/src/**/*.{ts,tsx}', { as: 'raw', eager: true });
  
  const result: ScanResult = {
    createPdf: { count: 0, paths: [] },
    pdfmakeBuild: { count: 0, paths: [] },
    vfs: { count: 0, paths: [] },
    cairo: { count: 0, paths: [] },
    getBlob: { count: 0, paths: [] },
    getBuffer: { count: 0, paths: [] },
  };
  
  for (const [path, content] of Object.entries(files)) {
    const code = content as string;
    
    // Check for createPdf calls (excluding audit files for count)
    if (code.includes('createPdf(') && !path.includes('/audit/')) {
      result.createPdf.count++;
      result.createPdf.paths.push(path);
    }
    
    // Check for pdfmake/build/pdfmake imports
    if (code.includes('pdfmake/build/pdfmake')) {
      result.pdfmakeBuild.count++;
      result.pdfmakeBuild.paths.push(path);
    }
    
    // Check for VFS references
    if (code.includes('.vfs') || code.includes('vfs_fonts')) {
      result.vfs.count++;
      result.vfs.paths.push(path);
    }
    
    // Check for Cairo font references
    if (code.includes('Cairo-') || code.includes("'Cairo'") || code.includes('"Cairo"')) {
      result.cairo.count++;
      result.cairo.paths.push(path);
    }
    
    // Check for getBlob calls
    if (code.includes('getBlob(')) {
      result.getBlob.count++;
      result.getBlob.paths.push(path);
    }
    
    // Check for getBuffer calls
    if (code.includes('getBuffer(')) {
      result.getBuffer.count++;
      result.getBuffer.paths.push(path);
    }
  }
  
  return result;
}

/**
 * Validate scan results
 */
export function validateScanResults(scan: ScanResult): { ok: boolean; failures: string[] } {
  const failures: string[] = [];
  
  // createPdf must be in exactly ONE file (generator.ts)
  if (scan.createPdf.count === 0) {
    failures.push('FAIL: No createPdf calls found');
  } else if (scan.createPdf.count > 1) {
    failures.push(`FAIL: createPdf found in ${scan.createPdf.count} files: ${scan.createPdf.paths.join(', ')} — must be ONE`);
  }
  
  // pdfmake/build/pdfmake must be in exactly ONE file
  if (scan.pdfmakeBuild.count === 0) {
    failures.push('FAIL: No pdfmake/build/pdfmake imports found');
  } else if (scan.pdfmakeBuild.count > 1) {
    failures.push(`FAIL: pdfmake/build/pdfmake in ${scan.pdfmakeBuild.count} files — must be ONE (singleton)`);
  }
  
  return {
    ok: failures.length === 0,
    failures,
  };
}
