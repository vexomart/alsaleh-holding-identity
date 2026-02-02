/**
 * INVOICE PDF GENERATOR
 * Generates PDF Blob using @react-pdf/renderer
 */

import { pdf } from '@react-pdf/renderer';
import { InvoicePdf } from './InvoicePdf';
import type { InvoiceData, InvoiceDataNew } from './types';
import { normalizeInvoiceData, isLegacyInvoice } from './types';

/**
 * Generate invoice PDF as Blob
 */
export async function generateInvoicePdf(data: InvoiceData): Promise<Blob> {
  // Normalize to new format
  const normalizedData: InvoiceDataNew = normalizeInvoiceData(data);
  const invoiceNumber = isLegacyInvoice(data) ? data.invoiceNumber : data.invoice_number;
  
  console.log('[Invoice PDF] Generating PDF for:', invoiceNumber);
  
  try {
    // Create PDF document
    const doc = <InvoicePdf data={normalizedData} />;
    
    // Generate blob
    const blob = await pdf(doc).toBlob();
    
    console.log('[Invoice PDF] ✅ Generated:', blob.size, 'bytes');
    return blob;
  } catch (error) {
    console.error('[Invoice PDF] ❌ Generation failed:', error);
    throw new Error(`PDF_GENERATION_FAILED: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate invoice PDF as base64 data URL
 */
export async function generateInvoicePdfDataUrl(data: InvoiceData): Promise<string> {
  const blob = await generateInvoicePdf(data);
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default generateInvoicePdf;
