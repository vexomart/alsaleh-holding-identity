/**
 * FINANCE CONTRACT PDF GENERATOR
 * Generates PDF Blob for finance contracts
 */

import { pdf } from '@react-pdf/renderer';
import { FinanceContractPdf, type FinanceContractData } from './FinanceContractPdf';

/**
 * Generate finance contract PDF as Blob
 */
export async function generateFinanceContractPdf(data: FinanceContractData): Promise<Blob> {
  console.log('[Contract PDF] Generating PDF for:', data.contract_number);
  
  try {
    // Create PDF document
    const doc = <FinanceContractPdf data={data} />;
    
    // Generate blob
    const blob = await pdf(doc).toBlob();
    
    console.log('[Contract PDF] ✅ Generated:', blob.size, 'bytes');
    return blob;
  } catch (error) {
    console.error('[Contract PDF] ❌ Generation failed:', error);
    throw new Error(`PDF_GENERATION_FAILED: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Download finance contract PDF
 */
export async function downloadFinanceContractPdf(data: FinanceContractData): Promise<boolean> {
  try {
    const blob = await generateFinanceContractPdf(data);
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `عقد-تمويل-${data.contract_number}.pdf`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    URL.revokeObjectURL(url);
    
    console.log('[Contract PDF] ✅ Download triggered');
    return true;
  } catch (error) {
    console.error('[Contract PDF] ❌ Download failed:', error);
    return false;
  }
}

export default { generateFinanceContractPdf, downloadFinanceContractPdf };
