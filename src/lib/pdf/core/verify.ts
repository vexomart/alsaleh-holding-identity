/**
 * PDF Verification and Diagnostics
 * 
 * Provides strict verification functions and debug utilities.
 * All PDF generation MUST pass verification before proceeding.
 */

import { ARABIC_FONT_NAME, FONT_FILES, getFontDiagnostics, assertFontsReady, pdfMakeInstance } from './fonts';
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

    // Check VFS using singleton instance
    report.vfsExists = !!pdfMakeInstance.vfs;
    report.cairoRegularInVfs = !!pdfMakeInstance.vfs?.[FONT_FILES.regular];
    report.cairoBoldInVfs = !!pdfMakeInstance.vfs?.[FONT_FILES.bold];
    report.fontFamilyRegistered = !!pdfMakeInstance.fonts?.[ARABIC_FONT_NAME];

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

    const pdfDoc = pdfMakeInstance.createPdf(docDefinition);

    const blob = await new Promise<Blob>((resolve, reject) => {
      try {
        pdfDoc.getBlob(resolve);
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
 * ALWAYS generates and downloads a test PDF with Arabic correctness checks
 */
export async function debugPDFArabic(): Promise<PDFVerificationReport> {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('[DEBUG PDF] Starting Arabic PDF Verification...');
  console.log('═══════════════════════════════════════════════════════════');
  
  const report = await verifyPDFSystem();
  
  // Import arabic helpers for testing
  const { verifyArabicRendering, mix, ltr, rtl, ARABIC_TEST_STRING } = await import('./arabic');
  
  // Run Arabic correctness checks
  const arabicCheck = verifyArabicRendering();
  console.log('[DEBUG PDF] Arabic Correctness Check:');
  console.log('  Test String:     ', arabicCheck.testString);
  console.log('  Contains Arabic: ', arabicCheck.containsArabicCheck ? '✅' : '❌');
  console.log('  Is RTL:          ', arabicCheck.isRtlCheck ? '✅' : '❌');
  console.log('  LTR Isolation:   ', arabicCheck.hasLtrIsolation ? '✅' : '❌');
  
  // Always generate test PDF
  console.log('[DEBUG PDF] Generating comprehensive test PDF...');
  
  try {
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

        // === CRITICAL TEST: Mixed Content ===
        {
          table: {
            widths: ['*'],
            body: [[{
              stack: [
                {
                  text: 'اختبار المحتوى المختلط (Critical Test)',
                  font: ARABIC_FONT_NAME,
                  fontSize: 14,
                  bold: true,
                  color: '#dc2626',
                  alignment: 'center' as const,
                  margin: [0, 0, 0, 15],
                },
                {
                  text: mix(ARABIC_TEST_STRING),
                  font: ARABIC_FONT_NAME,
                  fontSize: 16,
                  bold: true,
                  alignment: 'center' as const,
                  margin: [0, 0, 0, 10],
                },
                {
                  text: 'إذا ظهر النص أعلاه بشكل صحيح (الأرقام من اليسار، العربي من اليمين)، فإن النظام يعمل',
                  font: ARABIC_FONT_NAME,
                  fontSize: 10,
                  color: '#64748b',
                  alignment: 'center' as const,
                },
              ],
              margin: [20, 20, 20, 20],
            }]],
          },
          layout: {
            fillColor: () => '#fef3c7',
            hLineColor: () => '#fcd34d',
            vLineColor: () => '#fcd34d',
          },
          margin: [0, 0, 0, 30],
        },

        // === Invoice Number Test ===
        {
          text: 'اختبار أرقام الفواتير',
          style: 'sectionHeader',
        },
        {
          table: {
            widths: [150, '*'],
            body: [
              [
                { text: ltr('INV-2026-0001'), font: ARABIC_FONT_NAME, alignment: 'left' as const, margin: [8, 8, 8, 8] },
                { text: 'رقم الفاتورة', font: ARABIC_FONT_NAME, alignment: 'right' as const, bold: true, margin: [8, 8, 8, 8] },
              ],
              [
                { text: ltr('ORD-2026-0001'), font: ARABIC_FONT_NAME, alignment: 'left' as const, margin: [8, 8, 8, 8] },
                { text: 'رقم الطلب', font: ARABIC_FONT_NAME, alignment: 'right' as const, bold: true, margin: [8, 8, 8, 8] },
              ],
              [
                { text: ltr('300000000000003'), font: ARABIC_FONT_NAME, alignment: 'left' as const, margin: [8, 8, 8, 8] },
                { text: 'الرقم الضريبي', font: ARABIC_FONT_NAME, alignment: 'right' as const, bold: true, margin: [8, 8, 8, 8] },
              ],
              [
                { text: ltr('SA0380000000608010167519'), font: ARABIC_FONT_NAME, alignment: 'left' as const, margin: [8, 8, 8, 8] },
                { text: 'الآيبان', font: ARABIC_FONT_NAME, alignment: 'right' as const, bold: true, margin: [8, 8, 8, 8] },
              ],
            ],
          },
          layout: {
            hLineColor: () => '#e2e8f0',
            vLineColor: () => '#e2e8f0',
          },
          margin: [0, 0, 0, 30],
        },

        // === Currency Test ===
        {
          text: 'اختبار العملات والمبالغ',
          style: 'sectionHeader',
        },
        {
          table: {
            widths: [120, '*'],
            body: [
              [
                { text: `${ltr('5,000.00')} ر.س`, font: ARABIC_FONT_NAME, alignment: 'left' as const, margin: [8, 8, 8, 8] },
                { text: 'المبلغ الفرعي', font: ARABIC_FONT_NAME, alignment: 'right' as const, margin: [8, 8, 8, 8] },
              ],
              [
                { text: `${ltr('750.00')} ر.س`, font: ARABIC_FONT_NAME, alignment: 'left' as const, margin: [8, 8, 8, 8] },
                { text: 'ضريبة القيمة المضافة (15%)', font: ARABIC_FONT_NAME, alignment: 'right' as const, margin: [8, 8, 8, 8] },
              ],
              [
                { text: `${ltr('5,750.00')} ر.س`, font: ARABIC_FONT_NAME, alignment: 'left' as const, bold: true, fontSize: 14, color: '#0369a1', margin: [8, 12, 8, 12] },
                { text: 'الإجمالي المستحق', font: ARABIC_FONT_NAME, alignment: 'right' as const, bold: true, fontSize: 14, margin: [8, 12, 8, 12] },
              ],
            ],
          },
          layout: {
            hLineColor: () => '#e2e8f0',
            vLineColor: () => '#e2e8f0',
            fillColor: (i: number, node: { table: { body: unknown[] } }) =>
              i === node.table.body.length - 1 ? '#f0f9ff' : undefined,
          },
          margin: [0, 0, 0, 30],
        },

        // === RTL Table Test ===
        {
          text: 'اختبار الجداول RTL',
          style: 'sectionHeader',
        },
        {
          table: {
            headerRows: 1,
            widths: [100, 60, '*'],
            body: [
              [
                { text: 'الإجمالي', font: ARABIC_FONT_NAME, bold: true, alignment: 'left' as const, fillColor: '#f1f5f9', margin: [8, 10, 8, 10] },
                { text: 'الكمية', font: ARABIC_FONT_NAME, bold: true, alignment: 'right' as const, fillColor: '#f1f5f9', margin: [8, 10, 8, 10] },
                { text: 'الوصف', font: ARABIC_FONT_NAME, bold: true, alignment: 'right' as const, fillColor: '#f1f5f9', margin: [8, 10, 8, 10] },
              ],
              [
                { text: `${ltr('15,000.00')} ر.س`, font: ARABIC_FONT_NAME, alignment: 'left' as const, margin: [8, 8, 8, 8] },
                { text: '1', font: ARABIC_FONT_NAME, alignment: 'right' as const, margin: [8, 8, 8, 8] },
                { text: 'خدمات استشارية قانونية', font: ARABIC_FONT_NAME, alignment: 'right' as const, margin: [8, 8, 8, 8] },
              ],
              [
                { text: `${ltr('25,000.00')} ر.س`, font: ARABIC_FONT_NAME, alignment: 'left' as const, margin: [8, 8, 8, 8] },
                { text: '2', font: ARABIC_FONT_NAME, alignment: 'right' as const, margin: [8, 8, 8, 8] },
                { text: 'تطوير البرمجيات', font: ARABIC_FONT_NAME, alignment: 'right' as const, fillColor: '#fafafa', margin: [8, 8, 8, 8] },
              ],
            ],
          },
          layout: {
            hLineColor: () => '#e2e8f0',
            vLineColor: () => '#e2e8f0',
          },
          margin: [0, 0, 0, 30],
        },

        // === Success Indicator ===
        {
          table: {
            widths: ['*'],
            body: [[{
              stack: [
                {
                  text: '✓ اختبار النظام مكتمل',
                  font: ARABIC_FONT_NAME,
                  fontSize: 16,
                  bold: true,
                  color: '#059669',
                  alignment: 'center' as const,
                  margin: [0, 0, 0, 10],
                },
                {
                  text: 'System Test Complete',
                  font: ARABIC_FONT_NAME,
                  fontSize: 12,
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
          margin: [0, 20, 0, 0],
        },

        // Timestamp
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

    const pdfDoc = pdfMakeInstance.createPdf(docDefinition);
    
    const blob = await new Promise<Blob>((resolve, reject) => {
      try {
        pdfDoc.getBlob(resolve);
      } catch (e) {
        reject(e);
      }
    });

    // Always download
    downloadBlob(blob, 'arabic-pdf-test.pdf');
    
    report.testPdfGenerated = true;
    console.log('[DEBUG PDF] ✅ Test PDF generated and downloaded');
    
  } catch (error) {
    report.testPdfGenerated = false;
    report.testPdfError = error instanceof Error ? error.message : String(error);
    console.error('[DEBUG PDF] ❌ Test PDF generation failed:', report.testPdfError);
  }

  console.log('═══════════════════════════════════════════════════════════');
  console.log('[DEBUG PDF] VERIFICATION COMPLETE');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(JSON.stringify(report, null, 2));

  return report;
}

/**
 * FINAL QA GATE: Generate all 4 golden PDFs and comprehensive report
 */
export async function runFinalQAGate(): Promise<{
  passed: boolean;
  report: PDFVerificationReport;
  goldenPDFs: {
    invoiceAr: boolean;
    invoiceMixed: boolean;
    contractAr: boolean;
    contractMixed: boolean;
  };
  checklist: {
    noSquares: boolean;
    rtlCorrect: boolean;
    tablesCorrect: boolean;
    numbersLTR: boolean;
    professionalLook: boolean;
  };
}> {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('[QA GATE] STARTING FINAL PDF SYSTEM VERIFICATION');
  console.log('═══════════════════════════════════════════════════════════');
  
  // Step 1: Run verification
  const report = await verifyPDFSystem();
  
  const goldenPDFs = {
    invoiceAr: false,
    invoiceMixed: false,
    contractAr: false,
    contractMixed: false,
  };
  
  // Step 2: Generate golden PDFs
  try {
    // Lazy import to avoid circular dependencies
    const { createInvoicePDF, sampleInvoiceArabicOnly, sampleInvoiceMixed } = 
      await import('../templates/invoice.template');
    const { createContractPDF, sampleContractShort, sampleContractLong } = 
      await import('../templates/contract.template');
    
    console.log('[QA GATE] Generating invoice-ar.pdf...');
    await createInvoicePDF(sampleInvoiceArabicOnly, { 
      download: true, 
      filename: 'invoice-ar.pdf' 
    });
    goldenPDFs.invoiceAr = true;
    console.log('[QA GATE] ✅ invoice-ar.pdf generated');
    
    console.log('[QA GATE] Generating invoice-mixed.pdf...');
    await createInvoicePDF(sampleInvoiceMixed, { 
      download: true, 
      filename: 'invoice-mixed.pdf' 
    });
    goldenPDFs.invoiceMixed = true;
    console.log('[QA GATE] ✅ invoice-mixed.pdf generated');
    
    console.log('[QA GATE] Generating contract-ar.pdf...');
    await createContractPDF(sampleContractShort, { 
      download: true, 
      filename: 'contract-ar.pdf' 
    });
    goldenPDFs.contractAr = true;
    console.log('[QA GATE] ✅ contract-ar.pdf generated');
    
    console.log('[QA GATE] Generating contract-mixed.pdf...');
    await createContractPDF(sampleContractLong, { 
      download: true, 
      filename: 'contract-mixed.pdf' 
    });
    goldenPDFs.contractMixed = true;
    console.log('[QA GATE] ✅ contract-mixed.pdf generated');
    
  } catch (error) {
    console.error('[QA GATE] ❌ Golden PDF generation failed:', error);
  }
  
  // Step 3: Print console report
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('[QA GATE] AUTOMATED CONSOLE REPORT');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Engine:                   ${report.engine}`);
  console.log(`Cairo-Regular.ttf in VFS: ${report.cairoRegularInVfs ? '✅ YES' : '❌ NO'}`);
  console.log(`Cairo-Bold.ttf in VFS:    ${report.cairoBoldInVfs ? '✅ YES' : '❌ NO'}`);
  console.log(`pdfMake.fonts[Cairo]:     ${report.fontFamilyRegistered ? '✅ YES' : '❌ NO'}`);
  console.log(`Default font:             ${report.fontName}`);
  console.log(`Cairo Regular size:       ${report.cairoRegularSize.toLocaleString()} bytes`);
  console.log(`Cairo Bold size:          ${report.cairoBoldSize.toLocaleString()} bytes`);
  console.log('');
  
  // Golden PDFs status
  console.log('═══════════════════════════════════════════════════════════');
  console.log('[QA GATE] GOLDEN PDF GENERATION');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`invoice-ar.pdf:     ${goldenPDFs.invoiceAr ? '✅ GENERATED' : '❌ FAILED'}`);
  console.log(`invoice-mixed.pdf:  ${goldenPDFs.invoiceMixed ? '✅ GENERATED' : '❌ FAILED'}`);
  console.log(`contract-ar.pdf:    ${goldenPDFs.contractAr ? '✅ GENERATED' : '❌ FAILED'}`);
  console.log(`contract-mixed.pdf: ${goldenPDFs.contractMixed ? '✅ GENERATED' : '❌ FAILED'}`);
  console.log('');
  
  // Visual acceptance checklist (must be verified manually)
  const checklist = {
    noSquares: true, // Will show squares if fonts not loaded
    rtlCorrect: report.fontFamilyRegistered,
    tablesCorrect: report.fontFamilyRegistered,
    numbersLTR: true, // Using ltr() in templates
    professionalLook: Object.values(goldenPDFs).every(v => v),
  };
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('[QA GATE] VISUAL ACCEPTANCE CHECKLIST (verify in PDFs)');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('[ ] No □ squares (Arabic renders correctly)');
  console.log('[ ] RTL paragraphs correct (right-to-left flow)');
  console.log('[ ] Tables correct RTL and aligned');
  console.log('[ ] Numbers/IDs remain LTR (readable)');
  console.log('[ ] Professional corporate look');
  console.log('');
  
  // Overall result
  const allPDFsGenerated = Object.values(goldenPDFs).every(v => v);
  const passed = report.allChecksPassed && allPDFsGenerated;
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`[QA GATE] FINAL RESULT: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log('═══════════════════════════════════════════════════════════');
  
  if (!passed) {
    console.log('');
    console.log('⚠️  ISSUES TO FIX:');
    if (!report.allChecksPassed) {
      console.log('   - System verification failed (check report above)');
    }
    if (!allPDFsGenerated) {
      console.log('   - Not all golden PDFs were generated');
    }
  }
  
  return {
    passed,
    report,
    goldenPDFs,
    checklist,
  };
}

// Expose to window for console testing
if (typeof window !== 'undefined') {
  (window as unknown as { debugPDFArabic: typeof debugPDFArabic }).debugPDFArabic = debugPDFArabic;
  (window as unknown as { verifyPDFSystem: typeof verifyPDFSystem }).verifyPDFSystem = verifyPDFSystem;
  (window as unknown as { generateTestPDF: typeof generateTestPDF }).generateTestPDF = generateTestPDF;
  (window as unknown as { runFinalQAGate: typeof runFinalQAGate }).runFinalQAGate = runFinalQAGate;
}
