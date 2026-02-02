/**
 * PDF DEBUG & TESTING UTILITIES
 * 
 * Provides debugging tools and test PDF generation.
 */

import pdfMake from './pdfmake';
import { ensurePdfReady, getFontDiagnostics, FONT_NAME, FONT_FILES } from './init';
import { createPdfBlob } from './render';
import { safeDownloadPdf } from './download';
import { rtl, ltr, arabicDefaultStyles } from './arabic';
import { buildInvoiceDocDefinition, sampleInvoiceData } from './templates/invoice';
import { buildContractDocDefinition, sampleContractData } from './templates/contract';
import type { DocDefinition } from './render';

/**
 * Debug the PDF system and print diagnostics
 */
export async function debugArabicPdfSystem(): Promise<void> {
  console.group('🔍 PDF2 SYSTEM DIAGNOSTICS');
  
  // Initial state
  const beforeInit = getFontDiagnostics();
  console.log('Before init:', beforeInit);
  
  // Initialize
  try {
    await ensurePdfReady();
    console.log('✅ ensurePdfReady() completed');
  } catch (error) {
    console.error('❌ ensurePdfReady() failed:', error);
    console.groupEnd();
    return;
  }
  
  // After init
  const afterInit = getFontDiagnostics();
  console.log('After init:', afterInit);
  
  // VFS check
  console.log('VFS keys:', Object.keys(pdfMake.vfs).filter(k => k.includes('Cairo')));
  console.log('Fonts registered:', Object.keys(pdfMake.fonts));
  
  // Generate test PDF
  console.log('📄 Generating test PDF...');
  try {
    const blob = await createPdfBlob(buildTestDocDefinition());
    console.log('✅ Test PDF generated:', blob.size, 'bytes');
    
    // Download
    const result = safeDownloadPdf(blob, 'test-arabic-rtl.pdf');
    console.log('Download result:', result);
  } catch (error) {
    console.error('❌ Test PDF generation failed:', error);
  }
  
  console.groupEnd();
}

/**
 * Build a test document definition for Arabic RTL testing
 */
function buildTestDocDefinition(): DocDefinition {
  return {
    ...arabicDefaultStyles,
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    content: [
      // Arabic title
      {
        text: rtl('اختبار نظام PDF العربي'),
        fontSize: 24,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 20],
      },
      
      // Test cases
      { text: rtl('اختبارات النص العربي'), style: 'subheader', margin: [0, 20, 0, 10] },
      
      // Pure Arabic
      { text: rtl('هذا نص عربي خالص يجب أن يظهر من اليمين إلى اليسار.'), margin: [0, 5, 0, 5] },
      
      // Mixed Arabic + numbers
      { text: `${rtl('رقم الفاتورة:')} ${ltr('INV-2025-001')}`, margin: [0, 5, 0, 5] },
      { text: `${rtl('المبلغ:')} ${ltr('1,234.56')} ${ltr('SAR')}`, margin: [0, 5, 0, 5] },
      { text: `${rtl('الهاتف:')} ${ltr('+966 50 123 4567')}`, margin: [0, 5, 0, 5] },
      
      // Status badge
      {
        text: rtl('الحالة: نشط ✓'),
        color: '#059669',
        bold: true,
        margin: [0, 10, 0, 10],
      },
      
      // Test table
      { text: rtl('جدول اختباري'), style: 'subheader', margin: [0, 20, 0, 10] },
      {
        table: {
          headerRows: 1,
          widths: ['*', 100, 100],
          body: [
            [
              { text: rtl('الإجمالي'), bold: true, alignment: 'right', fillColor: '#f3f4f6' },
              { text: rtl('الكمية'), bold: true, alignment: 'right', fillColor: '#f3f4f6' },
              { text: rtl('البند'), bold: true, alignment: 'right', fillColor: '#f3f4f6' },
            ],
            [
              { text: ltr('5,000 SAR'), alignment: 'right' },
              { text: ltr('10'), alignment: 'right' },
              { text: rtl('خدمات استشارية'), alignment: 'right' },
            ],
            [
              { text: ltr('15,000 SAR'), alignment: 'right' },
              { text: ltr('1'), alignment: 'right' },
              { text: rtl('تطوير برمجيات'), alignment: 'right' },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
      },
      
      // Footer text
      {
        text: rtl('تم إنشاء هذا الملف بنجاح — نظام PDF2 يعمل بشكل صحيح'),
        fontSize: 10,
        color: '#6b7280',
        alignment: 'center',
        margin: [0, 40, 0, 0],
      },
    ],
    info: {
      title: 'اختبار PDF العربي',
      author: 'PDF2 Debug System',
    },
  };
}

/**
 * Generate the golden pack (test PDFs for validation)
 */
export async function generateGoldenPack(): Promise<void> {
  console.group('📦 GENERATING GOLDEN PACK');
  
  await ensurePdfReady();
  
  const packs = [
    { name: 'invoice-ar.pdf', doc: buildInvoiceDocDefinition(sampleInvoiceData) },
    { name: 'contract-ar.pdf', doc: buildContractDocDefinition(sampleContractData) },
    { name: 'test-arabic-rtl.pdf', doc: buildTestDocDefinition() },
  ];
  
  for (const pack of packs) {
    try {
      console.log(`Generating ${pack.name}...`);
      const blob = await createPdfBlob(pack.doc);
      const result = safeDownloadPdf(blob, pack.name);
      console.log(`✅ ${pack.name}:`, result.ok ? 'Downloaded' : 'Failed', result.method || result.error);
    } catch (error) {
      console.error(`❌ ${pack.name} failed:`, error);
    }
  }
  
  console.groupEnd();
}

// Expose to window for console debugging
if (typeof window !== 'undefined') {
  (window as any).debugArabicPdfSystem = debugArabicPdfSystem;
  (window as any).generateGoldenPack = generateGoldenPack;
  (window as any).pdf2 = {
    pdfMake,
    ensurePdfReady,
    getFontDiagnostics,
    createPdfBlob,
    safeDownloadPdf,
    buildInvoiceDocDefinition,
    buildContractDocDefinition,
    sampleInvoiceData,
    sampleContractData,
  };
}
