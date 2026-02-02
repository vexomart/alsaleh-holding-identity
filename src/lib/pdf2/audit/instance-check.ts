/**
 * PDFMAKE INSTANCE VALIDATION
 * 
 * Validates the pdfMake instance is correctly configured.
 */

import type { PdfMakeInstance } from '../core/pdfmake-instance';

export interface InstanceValidation {
  hasCreatePdf: boolean;
  hasVfs: boolean;
  hasFonts: boolean;
  hasGetBlob: boolean;
  hasGetBuffer: boolean;
  vfsKeysSample: string[];
  vfsKeysCount: number;
  fontsKeys: string[];
  cairoInVfs: {
    regular: boolean;
    bold: boolean;
    regularSize: number;
    boldSize: number;
  };
  cairoInFonts: boolean;
  ok: boolean;
  issues: string[];
}

/**
 * Validate pdfMake instance configuration
 */
export function validatePdfMakeInstance(pdfMake: PdfMakeInstance): InstanceValidation {
  const issues: string[] = [];
  
  // Basic checks
  const hasCreatePdf = typeof pdfMake.createPdf === 'function';
  const hasVfs = typeof pdfMake.vfs === 'object' && pdfMake.vfs !== null;
  const hasFonts = typeof pdfMake.fonts === 'object' && pdfMake.fonts !== null;
  
  if (!hasCreatePdf) issues.push('createPdf is not a function');
  if (!hasVfs) issues.push('vfs is not an object');
  if (!hasFonts) issues.push('fonts is not an object');
  
  // VFS analysis
  const vfsKeys = hasVfs ? Object.keys(pdfMake.vfs) : [];
  const vfsKeysSample = vfsKeys.slice(0, 10);
  const vfsKeysCount = vfsKeys.length;
  
  // Cairo in VFS check
  const regularKey = 'Cairo-Regular.ttf';
  const boldKey = 'Cairo-Bold.ttf';
  const regularInVfs = hasVfs && regularKey in pdfMake.vfs;
  const boldInVfs = hasVfs && boldKey in pdfMake.vfs;
  const regularSize = regularInVfs ? (pdfMake.vfs[regularKey]?.length || 0) : 0;
  const boldSize = boldInVfs ? (pdfMake.vfs[boldKey]?.length || 0) : 0;
  
  if (!regularInVfs) issues.push('Cairo-Regular.ttf not in VFS');
  if (!boldInVfs) issues.push('Cairo-Bold.ttf not in VFS');
  if (regularInVfs && regularSize < 100000) issues.push(`Cairo-Regular.ttf base64 too small: ${regularSize} chars`);
  if (boldInVfs && boldSize < 100000) issues.push(`Cairo-Bold.ttf base64 too small: ${boldSize} chars`);
  
  // Fonts registration check
  const fontsKeys = hasFonts ? Object.keys(pdfMake.fonts) : [];
  const cairoInFonts = fontsKeys.includes('Cairo');
  
  if (!cairoInFonts) issues.push('Cairo font family not registered in pdfMake.fonts');
  
  // Check getBlob/getBuffer availability (requires creating a test doc)
  let hasGetBlob = false;
  let hasGetBuffer = false;
  
  if (hasCreatePdf) {
    try {
      const testDoc = { content: ['test'] };
      const pdfDoc = pdfMake.createPdf(testDoc as any);
      hasGetBlob = typeof pdfDoc.getBlob === 'function';
      hasGetBuffer = typeof pdfDoc.getBuffer === 'function';
    } catch (err) {
      issues.push(`createPdf test failed: ${err}`);
    }
  }
  
  if (!hasGetBlob && !hasGetBuffer) {
    issues.push('Neither getBlob nor getBuffer available on PDF document');
  }
  
  return {
    hasCreatePdf,
    hasVfs,
    hasFonts,
    hasGetBlob,
    hasGetBuffer,
    vfsKeysSample,
    vfsKeysCount,
    fontsKeys,
    cairoInVfs: {
      regular: regularInVfs,
      bold: boldInVfs,
      regularSize,
      boldSize,
    },
    cairoInFonts,
    ok: issues.length === 0,
    issues,
  };
}
