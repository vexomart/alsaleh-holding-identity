/**
 * PDF Debug Utility
 * 
 * Exposes the truth about the PDF generation setup.
 * Uses the singleton initializer for consistency.
 */

import pdfMake from 'pdfmake/build/pdfmake';
import { ensurePdfInitialized, isPdfInitialized, getPdfInitError } from './pdf-init';
import { downloadBlob } from './blob-download';

interface PDFDebugReport {
  engine: string;
  defaultFont: string | null;
  singletonInitialized: boolean;
  singletonError: string | null;
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
    defaultFont: 'Cairo',
    singletonInitialized: false,
    singletonError: null,
    vfsHasCairoRegular: false,
    vfsHasCairoBold: false,
    vfsKeys: [],
    registeredFonts: [],
    testPdfGenerated: false,
  };

  console.log('=== PDF DEBUG REPORT (SINGLETON) ===');
  console.log('1) PDF Engine: pdfmake');

  // Check singleton state BEFORE initialization
  console.log('2) Singleton state BEFORE ensurePdfInitialized():');
  console.log('   - isPdfInitialized():', isPdfInitialized());
  console.log('   - getPdfInitError():', getPdfInitError());

  try {
    // 3) Call singleton initializer
    console.log('3) Calling ensurePdfInitialized()...');
    await ensurePdfInitialized();
    
    report.singletonInitialized = isPdfInitialized();
    report.singletonError = getPdfInitError()?.message || null;
    
    console.log('4) Singleton state AFTER ensurePdfInitialized():');
    console.log('   - isPdfInitialized():', report.singletonInitialized);
    console.log('   - getPdfInitError():', report.singletonError);

    // 5) Check VFS state
    report.vfsKeys = Object.keys(pdfMakeAny.vfs || {});
    report.vfsHasCairoRegular = !!pdfMakeAny.vfs?.['Cairo-Regular.ttf'];
    report.vfsHasCairoBold = !!pdfMakeAny.vfs?.['Cairo-Bold.ttf'];
    
    console.log('5) VFS state:');
    console.log('   - Cairo-Regular.ttf in VFS:', report.vfsHasCairoRegular);
    console.log('   - Cairo-Bold.ttf in VFS:', report.vfsHasCairoBold);
    console.log('   - Cairo VFS keys:', report.vfsKeys.filter(k => k.includes('Cairo')));

    // 6) Check registered fonts
    report.registeredFonts = Object.keys(pdfMakeAny.fonts || {});
    console.log('6) Registered fonts:', report.registeredFonts);

    // 7) Generate test PDF
    console.log('7) Generating test PDF with Arabic text...');
    
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
          text: '=== SINGLETON STATUS ===',
          fontSize: 14,
          alignment: 'center' as const,
          color: '#3b82f6',
          margin: [0, 30, 0, 10],
        },
        {
          text: `isPdfInitialized(): ${report.singletonInitialized}`,
          fontSize: 12,
          alignment: 'center' as const,
          color: '#6b7280',
        },
        {
          text: `VFS has Cairo-Regular.ttf: ${report.vfsHasCairoRegular}`,
          fontSize: 12,
          alignment: 'center' as const,
          color: '#6b7280',
          margin: [0, 5, 0, 0],
        },
        {
          text: `VFS has Cairo-Bold.ttf: ${report.vfsHasCairoBold}`,
          fontSize: 12,
          alignment: 'center' as const,
          color: '#6b7280',
        },
        {
          text: `Registered fonts: ${report.registeredFonts.join(', ')}`,
          fontSize: 12,
          alignment: 'center' as const,
          color: '#6b7280',
          margin: [0, 5, 0, 0],
        },
      ],
    };

    const pdfDoc = pdfMake.createPdf(docDefinition as never);
    
    // Get blob and download
    const blob = await new Promise<Blob>((resolve) => {
      (pdfDoc as { getBlob: (cb: (blob: Blob) => void) => void }).getBlob(resolve);
    });

    downloadBlob(blob, 'arabic-debug-singleton.pdf');
    
    report.testPdfGenerated = true;
    console.log('8) ✅ Test PDF generated and download triggered!');

  } catch (error) {
    report.error = error instanceof Error ? error.message : String(error);
    report.singletonError = report.error;
    console.error('❌ ERROR during PDF debug:', report.error);
  }

  console.log('=== END PDF DEBUG REPORT ===');
  console.log('Full report:', JSON.stringify(report, null, 2));

  return report;
}

// Expose to window for console testing
if (typeof window !== 'undefined') {
  (window as unknown as { debugPDFArabic: typeof debugPDFArabic }).debugPDFArabic = debugPDFArabic;
}
