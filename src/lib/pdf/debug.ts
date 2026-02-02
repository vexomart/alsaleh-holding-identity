/**
 * PDF DEBUG — System verification and test generation
 */

import pdfMake from './pdfmake';
import { ensurePdfReady, getPdfDiagnostics, ARABIC_FONT_NAME, FONT_FILES } from './pdf-init';
import { createPdfBlob, createBaseDocDefinition } from './pdf-render';
import { safeDownloadPdf } from './download';

/**
 * Debug PDF system status
 */
export async function debugPdfSystem(): Promise<void> {
  console.log('═══════════════════════════════════════════');
  console.log('[PDF DEBUG] Starting system verification...');
  console.log('═══════════════════════════════════════════');

  // Check before init
  console.log('\n1️⃣ Pre-initialization state:');
  console.log('   pdfMake exists:', !!pdfMake);
  console.log('   VFS exists:', !!pdfMake.vfs);
  console.log('   VFS keys count:', Object.keys(pdfMake.vfs || {}).length);
  console.log('   Cairo-Regular in VFS:', !!pdfMake.vfs?.[FONT_FILES.regular]);
  console.log('   Cairo-Bold in VFS:', !!pdfMake.vfs?.[FONT_FILES.bold]);
  console.log('   Fonts object:', !!pdfMake.fonts);
  console.log('   Cairo registered:', !!pdfMake.fonts?.[ARABIC_FONT_NAME]);

  // Initialize
  console.log('\n2️⃣ Initializing fonts...');
  try {
    await ensurePdfReady();
    console.log('   ✅ Initialization successful');
  } catch (error) {
    console.error('   ❌ Initialization failed:', error);
    return;
  }

  // Check after init
  console.log('\n3️⃣ Post-initialization state:');
  const diag = getPdfDiagnostics();
  console.log('   Ready:', diag.ready);
  console.log('   VFS keys:', diag.vfsKeys);
  console.log('   Font families:', diag.fontFamilies);
  console.log('   Cairo Regular size:', diag.cairoRegularSize, 'bytes');
  console.log('   Cairo Bold size:', diag.cairoBoldSize, 'bytes');

  // Generate test PDF
  console.log('\n4️⃣ Generating test PDF...');
  try {
    const testContent = [
      {
        text: 'اختبار نظام PDF',
        font: ARABIC_FONT_NAME,
        fontSize: 28,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 20],
      },
      {
        text: 'فاتورة ضريبية — Arabic RTL Test',
        font: ARABIC_FONT_NAME,
        fontSize: 16,
        alignment: 'center',
        margin: [0, 0, 0, 30],
      },
      {
        text: 'هذا نص عربي لاختبار تشكيل الحروف والاتجاه من اليمين إلى اليسار.',
        font: ARABIC_FONT_NAME,
        fontSize: 12,
        alignment: 'right',
        margin: [0, 0, 0, 10],
      },
      {
        text: 'رقم الفاتورة: INV-2025-001234',
        font: ARABIC_FONT_NAME,
        fontSize: 12,
        alignment: 'right',
        margin: [0, 0, 0, 10],
      },
      {
        text: 'المبلغ الإجمالي: 1,500.00 ر.س',
        font: ARABIC_FONT_NAME,
        fontSize: 14,
        bold: true,
        alignment: 'right',
        margin: [0, 0, 0, 20],
      },
      {
        table: {
          headerRows: 1,
          widths: [100, '*', 80],
          body: [
            [
              { text: 'الإجمالي', font: ARABIC_FONT_NAME, bold: true, alignment: 'right' },
              { text: 'الوصف', font: ARABIC_FONT_NAME, bold: true, alignment: 'right' },
              { text: 'الرقم', font: ARABIC_FONT_NAME, bold: true, alignment: 'right' },
            ],
            [
              { text: '500.00', font: ARABIC_FONT_NAME, alignment: 'left' },
              { text: 'خدمة استشارية', font: ARABIC_FONT_NAME, alignment: 'right' },
              { text: '1', font: ARABIC_FONT_NAME, alignment: 'center' },
            ],
            [
              { text: '1,000.00', font: ARABIC_FONT_NAME, alignment: 'left' },
              { text: 'تصميم وتطوير', font: ARABIC_FONT_NAME, alignment: 'right' },
              { text: '2', font: ARABIC_FONT_NAME, alignment: 'center' },
            ],
          ],
        },
        margin: [0, 0, 0, 20],
      },
      {
        text: '═══════════════════════════════════════',
        alignment: 'center',
        margin: [0, 20, 0, 10],
      },
      {
        text: '✅ إذا ظهر هذا النص بشكل صحيح فإن نظام PDF يعمل',
        font: ARABIC_FONT_NAME,
        fontSize: 12,
        alignment: 'center',
        color: '#22c55e',
      },
    ];

    const docDef = createBaseDocDefinition(testContent, {
      title: 'اختبار نظام PDF',
    });

    const blob = await createPdfBlob(docDef);
    console.log('   ✅ PDF blob created, size:', blob.size, 'bytes');

    // Download test PDF
    const result = safeDownloadPdf(blob, 'test-arabic-pdf.pdf');
    if (result.ok) {
      console.log('   ✅ Download initiated via:', result.method);
    } else {
      console.error('   ❌ Download failed:', (result as { error?: string }).error);
    }

  } catch (error) {
    console.error('   ❌ PDF generation failed:', error);
  }

  console.log('\n═══════════════════════════════════════════');
  console.log('[PDF DEBUG] Verification complete');
  console.log('═══════════════════════════════════════════');
}

// Expose to window for console access
if (typeof window !== 'undefined') {
  (window as any).debugPdfSystem = debugPdfSystem;
}
