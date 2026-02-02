/**
 * GUARANTEED PDF DOWNLOAD ENGINE
 * 
 * Implements 3-level fallback strategy to ensure download works.
 * Strategy: Anchor → New Tab → Hidden Iframe
 */

import { toast } from 'sonner';

export type DownloadMethod = 'anchor' | 'tab' | 'iframe';

export interface DownloadResult {
  ok: boolean;
  method?: DownloadMethod;
  error?: string;
}

/**
 * Check if device is iOS (Safari has download attribute issues)
 */
function isIOS(): boolean {
  const ua = navigator.userAgent || '';
  return /iPad|iPhone|iPod/.test(ua) || 
    (/(Macintosh)/.test(ua) && 'ontouchend' in document);
}

/**
 * Check if browser supports download attribute
 */
function supportsDownloadAttribute(): boolean {
  try {
    return 'download' in HTMLAnchorElement.prototype;
  } catch {
    return false;
  }
}

/**
 * Strategy 1: Anchor download (most reliable for modern browsers)
 */
function tryAnchorDownload(url: string, filename: string): boolean {
  try {
    // iOS Safari ignores download attribute
    if (isIOS()) return false;
    if (!supportsDownloadAttribute()) return false;
    
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.rel = 'noopener';
    anchor.style.display = 'none';
    
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Strategy 2: Open in new tab
 */
function tryNewTabDownload(url: string): boolean {
  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    return !!win;
  } catch {
    return false;
  }
}

/**
 * Strategy 3: Hidden iframe (last resort)
 */
function tryIframeDownload(url: string): boolean {
  try {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:1px;height:1px;opacity:0;pointer-events:none';
    iframe.src = url;
    document.body.appendChild(iframe);
    
    // Cleanup after delay
    setTimeout(() => {
      try { iframe.remove(); } catch { /* ignore */ }
    }, 60000);
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Safe PDF download with 3-level fallback
 * 
 * @param blob - PDF blob to download
 * @param filename - Filename for the download
 * @returns DownloadResult with success status and method used
 */
export function safeDownloadPdf(blob: Blob, filename: string): DownloadResult {
  // Validate blob
  if (!blob || blob.size < 1000) {
    toast.error('فشل التحميل: ملف PDF غير صالح');
    return { ok: false, error: 'INVALID_BLOB' };
  }
  
  // Ensure correct MIME type
  const pdfBlob = blob.type === 'application/pdf' 
    ? blob 
    : new Blob([blob], { type: 'application/pdf' });
  
  // Create object URL
  const url = URL.createObjectURL(pdfBlob);
  
  // Strategy 1: Anchor download
  if (tryAnchorDownload(url, filename)) {
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    return { ok: true, method: 'anchor' };
  }
  
  // Strategy 2: New tab
  if (tryNewTabDownload(url)) {
    toast.info('تم فتح الملف في تبويب جديد');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    return { ok: true, method: 'tab' };
  }
  
  // Strategy 3: Hidden iframe
  if (tryIframeDownload(url)) {
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    return { ok: true, method: 'iframe' };
  }
  
  // All strategies failed
  URL.revokeObjectURL(url);
  toast.error('فشل تحميل الملف — جرب متصفحًا آخر');
  return { ok: false, error: 'ALL_STRATEGIES_FAILED' };
}

/**
 * Download blob directly (simple version)
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const result = safeDownloadPdf(blob, filename);
  if (!result.ok) {
    console.error('[PDF DOWNLOAD] Failed:', result.error);
  }
}
