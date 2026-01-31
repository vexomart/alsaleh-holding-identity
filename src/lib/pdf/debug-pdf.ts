/**
 * PDF Debug Utility
 * 
 * Exposes the truth about the PDF generation setup.
 */

import pdfMake from 'pdfmake/build/pdfmake';
import { loadCairoTTFAsVfs } from './fonts/cairo-embedded';
import { downloadBlob } from './blob-download';

interface PDFDebugReport {
  engine: string;
  defaultFont: string | null;
  vfsHasCairoRegular: boolean;
  vfsHasCairoBold: boolean;
  vfsKeys: string[];
  registeredFonts: string[];
  testPdfGenerated: boolean;
  error?: string;
}

/**
 * Debug PDF setup and generate a test PDF with Arabic text
 */
export async function debugPDFArabic(): Promise<PDFDebugReport> {
  const pdfMakeAny = pdfMake as unknown as {
    vfs?: Record<string, string>;
    fonts?: Record<string, unknown>;
  };

  const report: PDFDebugReport = {
    engine: 'pdfmake',
    defaultFont: null,
    vfsHasCairoRegular: false,
    vfsHasCairoBold: false,
    vfsKeys: [],
    registeredFonts: [],
    testPdfGenerated: false,
  };

  // 1) PDF Engine
  console.log('=== PDF DEBUG REPORT ===');
  console.log('1) PDF Engine: pdfmake');

  // 2) Check current VFS state BEFORE loading fonts
  console.log('2) VFS state BEFORE loading Cairo:');
  console.log('   - vfs exists:', !!pdfMakeAny.vfs);
  console.log('   - vfs keys:', pdfMakeAny.vfs ? Object.keys(pdfMakeAny.vfs).slice(0, 10) : []);

  // 3) Load Cairo fonts
  try {
    console.log('3) Loading Cairo TTF fonts...');
    const cairo = await loadCairoTTFAsVfs();
    console.log('   - Cairo Regular loaded:', cairo.regular.length, 'chars (base64)');
    console.log('   - Cairo Bold loaded:', cairo.bold.length, 'chars (base64)');

    // Inject into VFS
    if (!pdfMakeAny.vfs) pdfMakeAny.vfs = {};
    pdfMakeAny.vfs['Cairo-Regular.ttf'] = cairo.regular;
    pdfMakeAny.vfs['Cairo-Bold.ttf'] = cairo.bold;

    // Register fonts
    pdfMakeAny.fonts = {
      ...(pdfMakeAny.fonts || {}),
      Cairo: {
        normal: 'Cairo-Regular.ttf',
        bold: 'Cairo-Bold.ttf',
        italics: 'Cairo-Regular.ttf',
        bolditalics: 'Cairo-Bold.ttf',
      },
    };

    console.log('4) VFS state AFTER loading Cairo:');
    report.vfsKeys = Object.keys(pdfMakeAny.vfs);
    report.vfsHasCairoRegular = 'Cairo-Regular.ttf' in pdfMakeAny.vfs;
    report.vfsHasCairoBold = 'Cairo-Bold.ttf' in pdfMakeAny.vfs;
    console.log('   - Cairo-Regular.ttf in VFS:', report.vfsHasCairoRegular);
    console.log('   - Cairo-Bold.ttf in VFS:', report.vfsHasCairoBold);
    console.log('   - All VFS keys:', report.vfsKeys);

    // 5) Check registered fonts
    report.registeredFonts = pdfMakeAny.fonts ? Object.keys(pdfMakeAny.fonts) : [];
    console.log('5) Registered fonts:', report.registeredFonts);

    // 6) Generate test PDF
    console.log('6) Generating test PDF with Arabic text...');
    
    const docDefinition = {
      pageSize: 'A4' as const,
      defaultStyle: {
        font: 'Cairo',
        fontSize: 24,
        alignment: 'right' as const,
      },
      content: [
        {
          text: 'فاتورة ضريبية - اختبار العربية',
          fontSize: 32,
          bold: true,
          alignment: 'center' as const,
          margin: [0, 100, 0, 50],
        },
        {
          text: 'إذا كنت ترى هذا النص بوضوح، فإن خط Cairo مدمج بشكل صحيح.',
          fontSize: 18,
          alignment: 'center' as const,
          margin: [0, 0, 0, 30],
        },
        {
          text: 'PDF Engine: pdfmake',
          fontSize: 14,
          alignment: 'center' as const,
          color: '#6b7280',
        },
        {
          text: `Default Font: Cairo`,
          fontSize: 14,
          alignment: 'center' as const,
          color: '#6b7280',
        },
        {
          text: `VFS has Cairo-Regular.ttf: ${report.vfsHasCairoRegular}`,
          fontSize: 12,
          alignment: 'center' as const,
          color: '#6b7280',
          margin: [0, 20, 0, 0],
        },
        {
          text: `VFS has Cairo-Bold.ttf: ${report.vfsHasCairoBold}`,
          fontSize: 12,
          alignment: 'center' as const,
          color: '#6b7280',
        },
      ],
    };

    report.defaultFont = 'Cairo';

    const pdfDoc = pdfMake.createPdf(docDefinition as never);
    
    // Get blob and download
    const blob = await new Promise<Blob>((resolve) => {
      (pdfDoc as { getBlob: (cb: (blob: Blob) => void) => void }).getBlob(resolve);
    });

    downloadBlob(blob, 'arabic-debug-test.pdf');
    
    report.testPdfGenerated = true;
    console.log('7) Test PDF generated and download triggered!');

  } catch (error) {
    report.error = error instanceof Error ? error.message : String(error);
    console.error('ERROR during PDF debug:', report.error);
  }

  console.log('=== END PDF DEBUG REPORT ===');
  console.log('Full report:', JSON.stringify(report, null, 2));

  return report;
}

// Expose to window for console testing
if (typeof window !== 'undefined') {
  (window as unknown as { debugPDFArabic: typeof debugPDFArabic }).debugPDFArabic = debugPDFArabic;
}
