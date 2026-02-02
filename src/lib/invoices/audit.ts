/**
 * INVOICE GOLDEN PACK AUDIT
 * Generates 4 test PDFs to verify RTL, VAT, and download functionality
 */

import type { InvoiceDataNew } from './types';
import { SELLER_INFO } from './constants';

// Sample data generators
const SAMPLE_SELLER = {
  name: SELLER_INFO.name_en,
  name_ar: SELLER_INFO.name_ar,
  vat: SELLER_INFO.vat,
  address_ar: SELLER_INFO.address_ar,
  email: SELLER_INFO.email,
  phone: SELLER_INFO.phone,
};

const SAMPLE_BUYER = {
  name: 'عميل تجريبي',
  name_ar: 'عميل تجريبي',
  vat: '300987654321098',
  email: 'customer@example.com',
  phone: '+966 50 123 4567',
};

/**
 * Generate sample invoice data - Arabic only
 */
export function generateSampleInvoiceAr(): InvoiceDataNew {
  return {
    invoice_number: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
    issued_at: new Date().toISOString(),
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    seller: SAMPLE_SELLER,
    buyer: SAMPLE_BUYER,
    items: [
      {
        description: 'خدمة استشارات قانونية',
        description_ar: 'خدمة استشارات قانونية',
        qty: 1,
        unit_price: 5000,
      },
    ],
    vat_rate: 0.15,
    currency: 'SAR',
    notes: 'شكراً لتعاملكم معنا',
    notes_ar: 'شكراً لتعاملكم معنا',
  };
}

/**
 * Generate sample invoice data - Mixed Arabic/English with numbers
 */
export function generateSampleInvoiceMixed(): InvoiceDataNew {
  return {
    invoice_number: `INV-2026-00001`,
    issued_at: new Date().toISOString(),
    due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    seller: SAMPLE_SELLER,
    buyer: {
      ...SAMPLE_BUYER,
      name: 'محمد أحمد الشهري',
      name_ar: 'محمد أحمد الشهري',
    },
    items: [
      {
        description: 'تصميم موقع إلكتروني - Website Design',
        description_ar: 'تصميم موقع إلكتروني',
        qty: 1,
        unit_price: 15000,
      },
      {
        description: 'استضافة سنوية - Annual Hosting',
        description_ar: 'استضافة سنوية',
        qty: 12,
        unit_price: 250,
      },
    ],
    vat_rate: 0.15,
    currency: 'SAR',
    notes: 'الدفع خلال 15 يوم من تاريخ الفاتورة',
    notes_ar: 'الدفع خلال 15 يوم من تاريخ الفاتورة',
  };
}

/**
 * Generate sample invoice with contract reference
 */
export function generateSampleInvoiceWithContract(): InvoiceDataNew {
  return {
    invoice_number: `INV-2026-00002`,
    issued_at: new Date().toISOString(),
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    seller: SAMPLE_SELLER,
    buyer: {
      name: 'شركة النجاح للتجارة',
      name_ar: 'شركة النجاح للتجارة',
      vat: '300111222333444',
      address_ar: 'جدة، المملكة العربية السعودية',
      email: 'info@success-trading.sa',
      phone: '+966 12 345 6789',
    },
    items: [
      {
        description: 'خدمات محاسبية شهرية - العقد CTR-2026-00001',
        description_ar: 'خدمات محاسبية شهرية',
        qty: 1,
        unit_price: 8000,
      },
    ],
    vat_rate: 0.15,
    currency: 'SAR',
    order_id: 'ORD-20260101-0001',
    notes: 'مرتبط بالعقد رقم CTR-2026-00001',
    notes_ar: 'مرتبط بالعقد رقم CTR-2026-00001',
  };
}

/**
 * Generate sample invoice with multiple items
 */
export function generateSampleInvoiceMultiItems(): InvoiceDataNew {
  return {
    invoice_number: `INV-2026-00003`,
    issued_at: new Date().toISOString(),
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    seller: SAMPLE_SELLER,
    buyer: {
      name: 'مؤسسة البناء الحديث',
      name_ar: 'مؤسسة البناء الحديث',
      vat: '300555666777888',
      address_ar: 'الدمام، المملكة العربية السعودية',
      email: 'finance@modern-building.sa',
    },
    items: [
      {
        description: 'دراسة جدوى اقتصادية',
        description_ar: 'دراسة جدوى اقتصادية',
        qty: 1,
        unit_price: 25000,
      },
      {
        description: 'تحليل السوق والمنافسين',
        description_ar: 'تحليل السوق والمنافسين',
        qty: 1,
        unit_price: 12000,
      },
      {
        description: 'خطة تسويقية متكاملة',
        description_ar: 'خطة تسويقية متكاملة',
        qty: 1,
        unit_price: 18000,
      },
    ],
    vat_rate: 0.15,
    currency: 'SAR',
    notes: 'يشمل السعر جميع التعديلات حتى 3 مرات',
    notes_ar: 'يشمل السعر جميع التعديلات حتى 3 مرات',
  };
}

export interface AuditResult {
  name: string;
  success: boolean;
  blobSize: number;
  downloadMethod?: string;
  error?: string;
  duration: number;
}

export interface AuditReport {
  timestamp: string;
  overallPass: boolean;
  results: AuditResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
  };
}

/**
 * Run the Golden Pack audit
 * Generates 4 test PDFs and attempts download
 */
export async function runPdfAudit(): Promise<AuditReport> {
  const { generateInvoicePdf } = await import('./generateInvoicePdf');
  const { downloadBlob } = await import('./download');
  
  const tests = [
    { name: 'invoice-ar', generator: generateSampleInvoiceAr },
    { name: 'invoice-mixed', generator: generateSampleInvoiceMixed },
    { name: 'invoice-with-contract', generator: generateSampleInvoiceWithContract },
    { name: 'invoice-multi-items', generator: generateSampleInvoiceMultiItems },
  ];
  
  const results: AuditResult[] = [];
  
  console.log('[INVOICE AUDIT] Starting Golden Pack test...');
  
  for (const test of tests) {
    const startTime = performance.now();
    let result: AuditResult = {
      name: test.name,
      success: false,
      blobSize: 0,
      duration: 0,
    };
    
    try {
      console.log(`[INVOICE AUDIT] Generating ${test.name}...`);
      
      // Generate invoice data
      const invoiceData = test.generator();
      console.log(`[INVOICE AUDIT] Model built for ${test.name}:`, invoiceData.invoice_number);
      
      // Generate PDF blob
      const blob = await generateInvoicePdf(invoiceData);
      result.blobSize = blob.size;
      console.log(`[INVOICE AUDIT] Blob generated: ${blob.size} bytes`);
      
      // Validate blob size (must be > 5KB)
      if (blob.size < 5000) {
        throw new Error(`Blob too small: ${blob.size} bytes (minimum 5KB)`);
      }
      
      // Attempt download
      const downloadResult = downloadBlob(blob, `audit-${test.name}.pdf`);
      result.downloadMethod = downloadResult.method;
      
      if (!downloadResult.success) {
        throw new Error(`Download failed: ${downloadResult.error}`);
      }
      
      result.success = true;
      console.log(`[INVOICE AUDIT] ✅ ${test.name} PASSED (${downloadResult.method})`);
      
    } catch (error) {
      result.error = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[INVOICE AUDIT] ❌ ${test.name} FAILED:`, result.error);
    }
    
    result.duration = performance.now() - startTime;
    results.push(result);
  }
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const overallPass = failed === 0;
  
  const report: AuditReport = {
    timestamp: new Date().toISOString(),
    overallPass,
    results,
    summary: {
      total: results.length,
      passed,
      failed,
    },
  };
  
  // Print final report
  console.log('\n========================================');
  console.log('[INVOICE AUDIT] GOLDEN PACK REPORT');
  console.log('========================================');
  console.log(`Timestamp: ${report.timestamp}`);
  console.log(`Overall: ${overallPass ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Results: ${passed}/${results.length} passed`);
  console.log('----------------------------------------');
  results.forEach(r => {
    const status = r.success ? '✅' : '❌';
    console.log(`${status} ${r.name}: ${r.blobSize} bytes, ${r.duration.toFixed(0)}ms${r.error ? ` - ${r.error}` : ''}`);
  });
  console.log('========================================\n');
  
  return report;
}

// Expose to window for console testing
if (typeof window !== 'undefined') {
  (window as any).runPdfAudit = runPdfAudit;
  (window as any).generateSampleInvoice = generateSampleInvoiceMixed;
}

export default {
  runPdfAudit,
  generateSampleInvoiceAr,
  generateSampleInvoiceMixed,
  generateSampleInvoiceWithContract,
  generateSampleInvoiceMultiItems,
};
