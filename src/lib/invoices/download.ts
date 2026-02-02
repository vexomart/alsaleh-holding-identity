/**
 * INVOICE DOWNLOAD HELPER
 * Safe download using anchor element
 */

export type DownloadMethod = 'anchor' | 'tab' | 'failed';

export interface DownloadResult {
  success: boolean;
  method?: DownloadMethod;
  error?: string;
}

/**
 * Download a Blob as a file using anchor element
 * Falls back to opening in new tab if anchor fails
 */
export function downloadBlob(blob: Blob, filename: string): DownloadResult {
  console.log('[Download] Starting download:', filename, blob.size, 'bytes');
  
  try {
    // Strategy 1: Anchor element download (most reliable)
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';
    
    document.body.appendChild(anchor);
    anchor.click();
    
    // Cleanup after a short delay
    setTimeout(() => {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }, 100);
    
    console.log('[Download] ✅ Success via anchor');
    return { success: true, method: 'anchor' };
  } catch (anchorError) {
    console.warn('[Download] Anchor failed, trying tab:', anchorError);
    
    // Strategy 2: Open in new tab
    try {
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      
      if (win) {
        setTimeout(() => URL.revokeObjectURL(url), 10000);
        console.log('[Download] ✅ Success via new tab');
        return { success: true, method: 'tab' };
      }
      
      URL.revokeObjectURL(url);
      throw new Error('Popup blocked');
    } catch (tabError) {
      console.error('[Download] ❌ All methods failed:', tabError);
      return {
        success: false,
        method: 'failed',
        error: tabError instanceof Error ? tabError.message : 'Download failed',
      };
    }
  }
}

/**
 * Download invoice PDF
 */
export async function downloadInvoiceFile(blob: Blob, invoiceNumber: string): Promise<DownloadResult> {
  const filename = `invoice-${invoiceNumber}.pdf`;
  return downloadBlob(blob, filename);
}

export default downloadBlob;
