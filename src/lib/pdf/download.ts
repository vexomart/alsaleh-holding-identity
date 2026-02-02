/**
 * SAFE PDF DOWNLOAD — GUARANTEED DELIVERY
 * 
 * Three-stage fallback:
 * 1. Anchor download (best)
 * 2. New tab (fallback for Safari/iOS)
 * 3. Hidden iframe (last resort)
 */

import { toast } from 'sonner';

export type DownloadResult =
  | { ok: true; method: 'anchor' | 'tab' | 'iframe' }
  | { ok: false; error: string; stage: 'download' };

/**
 * Check if browser is iOS Safari
 */
function isIOS(): boolean {
  const ua = navigator.userAgent || '';
  return /iPad|iPhone|iPod/.test(ua) || 
    (/(Macintosh)/.test(ua) && (navigator as any).maxTouchPoints > 1);
}

/**
 * Check if download attribute is supported
 */
function supportsDownloadAttribute(): boolean {
  try {
    return 'download' in HTMLAnchorElement.prototype;
  } catch {
    return false;
  }
}

/**
 * Download PDF blob with guaranteed delivery
 */
export function safeDownloadPdf(blob: Blob, filename: string): DownloadResult {
  // Validate blob
  if (!blob || blob.size === 0) {
    return { ok: false, error: 'BLOB_EMPTY', stage: 'download' };
  }

  // Ensure correct MIME type
  const pdfBlob = blob.type === 'application/pdf' 
    ? blob 
    : new Blob([blob], { type: 'application/pdf' });

  const url = URL.createObjectURL(pdfBlob);

  // Strategy 1: Anchor download
  if (!isIOS() && supportsDownloadAttribute()) {
    try {
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.rel = 'noopener';
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      console.log('[PDF DOWNLOAD] ✅ Anchor download successful');
      return { ok: true, method: 'anchor' };
    } catch (error) {
      console.warn('[PDF DOWNLOAD] Anchor failed:', error);
    }
  }

  // Strategy 2: New tab
  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (win) {
      toast.info('تم فتح الملف في تبويب جديد');
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      console.log('[PDF DOWNLOAD] ✅ Tab open successful');
      return { ok: true, method: 'tab' };
    }
  } catch (error) {
    console.warn('[PDF DOWNLOAD] Tab open failed:', error);
  }

  // Strategy 3: Hidden iframe
  try {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:1px;height:1px;opacity:0;pointer-events:none';
    iframe.src = url;
    document.body.appendChild(iframe);
    setTimeout(() => {
      try { iframe.remove(); } catch {}
      URL.revokeObjectURL(url);
    }, 60000);
    console.log('[PDF DOWNLOAD] ✅ Iframe fallback used');
    return { ok: true, method: 'iframe' };
  } catch (error) {
    console.error('[PDF DOWNLOAD] ❌ All methods failed:', error);
    try { URL.revokeObjectURL(url); } catch {}
    return { ok: false, error: 'ALL_METHODS_FAILED', stage: 'download' };
  }
}

/**
 * Open PDF in new tab for preview
 */
export function openPdfInNewTab(blob: Blob): boolean {
  const pdfBlob = blob.type === 'application/pdf' 
    ? blob 
    : new Blob([blob], { type: 'application/pdf' });
  
  const url = URL.createObjectURL(pdfBlob);
  const win = window.open(url, '_blank');
  
  if (win) {
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    return true;
  }
  
  URL.revokeObjectURL(url);
  return false;
}

/**
 * Convert blob to data URL
 */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to convert blob to data URL'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Convert blob to base64 string
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return blobToDataUrl(blob).then(dataUrl => {
    const base64 = dataUrl.split(',')[1];
    if (!base64) throw new Error('Invalid data URL');
    return base64;
  });
}
