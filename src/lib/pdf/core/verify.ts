/**
 * PDF Verification and Diagnostics
 * 
 * Provides strict verification functions and debug utilities.
 * All PDF generation MUST pass verification before proceeding.
 */

import pdfMake from 'pdfmake/build/pdfmake';
import { ARABIC_FONT_NAME, FONT_FILES, getFontDiagnostics, assertFontsReady } from './fonts';
import { corporateStyles } from './layout';
import { downloadBlob } from './download';

export interface PDFVerificationReport {
  timestamp: string;
  engine: string;
  fontName: string;

  // Initialization status
  fontsInitialized: boolean;
  initializationError: string | null;

  // VFS status
  vfsExists: boolean;
  vfsKeys: string[];
  cairoRegularInVfs: boolean;
  cairoBoldInVfs: boolean;
  cairoRegularSize: number;
  cairoBoldSize: number;

  // Font registration
  fontFamilyRegistered: boolean;
  registeredFonts: string[];

  // Test results
  testPdfGenerated: boolean;
  testPdfError: string | null;

  // Overall status
  allChecksPassed: boolean;
}

/**
 * Run comprehensive PDF verification
 */
export async function verifyPDFSystem(): Promise<PDFVerificationReport> {
  const report: PDFVerificationReport = {
    timestamp: new Date().toISOString(),
    engine: 'pdfmake',
    fontName: ARABIC_FONT_NAME,
    fontsInitialized: false,
    initializationError: null,
    vfsExists: false,
    vfsKeys: [],
    cairoRegularInVfs: false,
    cairoBoldInVfs: false,
    cairoRegularSize: 0,
    cairoBoldSize: 0,
    fontFamilyRegistered: false,
    registeredFonts: [],
    testPdfGenerated: false,
    testPdfError: null,
    allChecksPassed: false,
  };

  console.log('=== PDF SYSTEM VERIFICATION ===');

  try {
    // Get diagnostics
    const diagnostics = getFontDiagnostics();
    
    report.fontsInitialized = diagnostics.initialized;
    report.initializationError = diagnostics.error;
    report.vfsKeys = diagnostics.vfsKeys;
    report.registeredFonts = diagnostics.registeredFonts;
    report.cairoRegularSize = diagnostics.cairoRegularSize;
    report.cairoBoldSize = diagnostics.cairoBoldSize;

    // Check VFS
    const pdfMakeRef = pdfMake as unknown as {
      vfs?: Record<string, string>;
      fonts?: Record<string, unknown>;
    };

    report.vfsExists = !!pdfMakeRef.vfs;
    report.cairoRegularInVfs = !!pdfMakeRef.vfs?.[FONT_FILES.regular];
    report.cairoBoldInVfs = !!pdfMakeRef.vfs?.[FONT_FILES.bold];
    report.fontFamilyRegistered = !!pdfMakeRef.fonts?.[ARABIC_FONT_NAME];

    console.log('[VERIFY] Diagnostics:', {
      initialized: report.fontsInitialized,
      vfsExists: report.vfsExists,
      cairoRegular: report.cairoRegularInVfs,
      cairoBold: report.cairoBoldInVfs,
      fontFamily: report.fontFamilyRegistered,
    });

    // Try to run assertion
    try {
      assertFontsReady();
      console.log('[VERIFY] ✅ Font assertions passed');
    } catch (assertError) {
      report.initializationError = assertError instanceof Error ? assertError.message : String(assertError);
      console.error('[VERIFY] ❌ Font assertion failed:', report.initializationError);
    }

    // Determine overall status
    report.allChecksPassed = 
      report.fontsInitialized &&
      report.vfsExists &&
      report.cairoRegularInVfs &&
      report.cairoBoldInVfs &&
      report.fontFamilyRegistered &&
      report.cairoRegularSize > 10000 &&
      report.cairoBoldSize > 10000 &&
      !report.initializationError;

    console.log('[VERIFY] Overall status:', report.allChecksPassed ? '✅ PASSED' : '❌ FAILED');

  } catch (error) {
    report.initializationError = error instanceof Error ? error.message : String(error);
    console.error('[VERIFY] Error during verification:', report.initializationError);
  }

  console.log('=== END VERIFICATION ===');
  return report;
}

/**
 * Generate a test PDF with Arabic content
 * Used to verify the entire pipeline works
 */
export async function generateTestPDF(download: boolean = false): Promise<{
  success: boolean;
  error?: string;
  blob?: Blob;
}> {
  console.log('[TEST PDF] Generating Arabic test PDF...');

  try {
    // Run assertions first
    assertFontsReady();

    const docDefinition = {
      pageSize: 'A4' as const,
      pageMargins: [40, 60, 40, 60],

      defaultStyle: {
        font: ARABIC_FONT_NAME,
        fontSize: 11,
        alignment: 'right' as const,
      },

      styles: corporateStyles,

      content: [
        // Title
        {
          text: 'اختبار نظام PDF العربي',
          style: 'documentTitle',
          margin: [0, 0, 0, 5],
        },
        {
          text: 'Arabic PDF System Test',
          font: ARABIC_FONT_NAME,
          fontSize: 12,
          color: '#64748b',
          alignment: 'center' as const,
          margin: [0, 0, 0, 30],
        },

        // Success indicator
        {
          table: {
            widths: ['*'],
            body: [[{
              stack: [
                {
                  text: '✓ إذا كنت ترى هذا النص بوضوح، فإن النظام يعمل بشكل صحيح',
                  font: ARABIC_FONT_NAME,
                  fontSize: 14,
                  bold: true,
                  color: '#059669',
                  alignment: 'center' as const,
                  margin: [0, 0, 0, 10],
                },
                {
                  text: 'If you can read this text clearly, the system is working correctly',
                  font: ARABIC_FONT_NAME,
                  fontSize: 11,
                  color: '#64748b',
                  alignment: 'center' as const,
                },
              ],
              margin: [20, 20, 20, 20],
            }]],
          },
          layout: {
            fillColor: () => '#f0fdf4',
            hLineColor: () => '#bbf7d0',
            vLineColor: () => '#bbf7d0',
          },
          margin: [0, 0, 0, 30],
        },

        // Test content sections
        {
          text: 'اختبار النص العربي',
          style: 'sectionHeader',
        },
        {
          text: 'هذا نص تجريبي للتأكد من عرض اللغة العربية بشكل صحيح في ملفات PDF. يجب أن يظهر النص من اليمين إلى اليسار مع دعم كامل للحروف العربية.',
          style: 'body',
          margin: [0, 0, 0, 20],
        },

        // RTL Table test
        {
          text: 'اختبار الجدول RTL',
          style: 'sectionHeader',
        },
        {
          table: {
            headerRows: 1,
            widths: [100, 60, '*'],
            body: [
              [
                { text: 'الإجمالي', style: 'tableHeader', font: ARABIC_FONT_NAME, alignment: 'right' as const },
                { text: 'الكمية', style: 'tableHeader', font: ARABIC_FONT_NAME, alignment: 'right' as const },
                { text: 'الوصف', style: 'tableHeader', font: ARABIC_FONT_NAME, alignment: 'right' as const },
              ],
              [
                { text: '15,000 ر.س', style: 'tableCellLTR', font: ARABIC_FONT_NAME, alignment: 'left' as const },
                { text: '1', style: 'tableCell', font: ARABIC_FONT_NAME, alignment: 'right' as const },
                { text: 'خدمات استشارية', style: 'tableCell', font: ARABIC_FONT_NAME, alignment: 'right' as const },
              ],
              [
                { text: '25,000 ر.س', style: 'tableCellLTR', font: ARABIC_FONT_NAME, alignment: 'left' as const },
                { text: '2', style: 'tableCell', font: ARABIC_FONT_NAME, alignment: 'right' as const },
                { text: 'تطوير البرمجيات', style: 'tableCell', font: ARABIC_FONT_NAME, alignment: 'right' as const },
              ],
            ],
          },
          layout: {
            hLineColor: () => '#e2e8f0',
            vLineColor: () => '#e2e8f0',
            fillColor: (i: number) => i === 0 ? '#f1f5f9' : undefined,
          },
          margin: [0, 0, 0, 30],
        },

        // Mixed content test
        {
          text: 'اختبار المحتوى المختلط',
          style: 'sectionHeader',
        },
        {
          text: [
            { text: 'رقم الفاتورة: ', font: ARABIC_FONT_NAME },
            { text: 'INV-2026-0001', font: ARABIC_FONT_NAME },
          ],
          style: 'body',
          margin: [0, 0, 0, 5],
        },
        {
          text: [
            { text: 'المبلغ الإجمالي: ', font: ARABIC_FONT_NAME },
            { text: '40,000 ر.س', font: ARABIC_FONT_NAME },
          ],
          style: 'body',
          margin: [0, 0, 0, 5],
        },
        {
          text: [
            { text: 'الرقم الضريبي: ', font: ARABIC_FONT_NAME },
            { text: '300000000000003', font: ARABIC_FONT_NAME },
          ],
          style: 'body',
          margin: [0, 0, 0, 20],
        },

        // Verification timestamp
        {
          text: `تم التحقق: ${new Date().toLocaleString('ar-SA')}`,
          font: ARABIC_FONT_NAME,
          fontSize: 9,
          color: '#94a3b8',
          alignment: 'center' as const,
          margin: [0, 30, 0, 0],
        },
      ],

      footer: (currentPage: number, pageCount: number) => ({
        text: `صفحة ${currentPage} من ${pageCount}`,
        font: ARABIC_FONT_NAME,
        fontSize: 9,
        color: '#94a3b8',
        alignment: 'center' as const,
        margin: [40, 0, 40, 20],
      }),
    };

    const pdfDoc = pdfMake.createPdf(docDefinition as never);

    const blob = await new Promise<Blob>((resolve, reject) => {
      try {
        (pdfDoc as { getBlob: (cb: (blob: Blob) => void) => void }).getBlob(resolve);
      } catch (e) {
        reject(e);
      }
    });

    if (download) {
      downloadBlob(blob, 'arabic-pdf-test.pdf');
    }

    console.log('[TEST PDF] ✅ Test PDF generated successfully');

    return { success: true, blob };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[TEST PDF] ❌ Failed:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Debug function for console testing
 * Exposed to window for easy debugging
 */
export async function debugPDFArabic(): Promise<PDFVerificationReport> {
  const report = await verifyPDFSystem();
  
  // Generate test PDF if verification passed
  if (report.allChecksPassed) {
    const testResult = await generateTestPDF(true);
    report.testPdfGenerated = testResult.success;
    report.testPdfError = testResult.error || null;
  }

  console.log('=== FULL DEBUG REPORT ===');
  console.log(JSON.stringify(report, null, 2));

  return report;
}

// Expose to window for console testing
if (typeof window !== 'undefined') {
  (window as unknown as { debugPDFArabic: typeof debugPDFArabic }).debugPDFArabic = debugPDFArabic;
  (window as unknown as { verifyPDFSystem: typeof verifyPDFSystem }).verifyPDFSystem = verifyPDFSystem;
  (window as unknown as { generateTestPDF: typeof generateTestPDF }).generateTestPDF = generateTestPDF;
}
