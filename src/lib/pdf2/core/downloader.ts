/**
 * PDF DOWNLOAD ENGINE
 * 
 * Multi-strategy download with guaranteed fallbacks.
 * Strategy: Anchor → New Tab → Iframe
 */

import { toast } from 'sonner';

export type DownloadMethod = 'anchor' | 'tab' | 'iframe';

export interface DownloadResult {
  success: boolean;
  method?: DownloadMethod;
  error?: string;
}

/**
 * Detect iOS (Safari has download attribute issues)
 */
function isIOS(): boolean {
  const ua = navigator.userAgent || '';
  return /iPad|iPhone|iPod/.test(ua) || 
    (ua.includes('Macintosh') && 'ontouchend' in document);
}

/**
 * Check download attribute support
 */
function supportsDownloadAttribute(): boolean {
  try {
    return 'download' in HTMLAnchorElement.prototype;
  } catch {
    return false;
  }
}

/**
 * Strategy 1: Anchor element download
 */
function tryAnchorDownload(url: string, filename: string): boolean {
  try {
    if (isIOS() || !supportsDownloadAttribute()) {
      return false;
    }
    
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.rel = 'noopener';
    anchor.style.cssText = 'position:fixed;left:-9999px;opacity:0';
    
    document.body.appendChild(anchor);
    anchor.click();
    
    // Cleanup after brief delay
    setTimeout(() => {
      try { anchor.remove(); } catch { /* ignore */ }
    }, 100);
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Strategy 2: New tab
 */
function tryNewTabDownload(url: string): boolean {
  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    return Boolean(win);
  } catch {
    return false;
  }
}

/**
 * Strategy 3: Hidden iframe
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
 * Download PDF blob with fallback strategies
 */
export function downloadPdfBlob(blob: Blob, filename: string): DownloadResult {
  // Validate blob
  if (!blob || blob.size < 500) {
    toast.error('فشل التحميل: ملف PDF غير صالح');
    return { success: false, error: 'INVALID_BLOB' };
  }
  
  // Ensure PDF MIME type
  const pdfBlob = blob.type === 'application/pdf'
    ? blob
    : new Blob([blob], { type: 'application/pdf' });
  
  // Create object URL
  const url = URL.createObjectURL(pdfBlob);
  
  // Strategy 1: Anchor
  if (tryAnchorDownload(url, filename)) {
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    return { success: true, method: 'anchor' };
  }
  
  // Strategy 2: New tab
  if (tryNewTabDownload(url)) {
    toast.info('تم فتح الملف في تبويب جديد');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    return { success: true, method: 'tab' };
  }
  
  // Strategy 3: Iframe
  if (tryIframeDownload(url)) {
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    return { success: true, method: 'iframe' };
  }
  
  // All failed
  URL.revokeObjectURL(url);
  toast.error('فشل تحميل الملف — جرب متصفحًا آخر');
  return { success: false, error: 'ALL_STRATEGIES_FAILED' };
}

/**
 * Simple download helper
 */
export function downloadBlob(blob: Blob, filename: string): boolean {
  const result = downloadPdfBlob(blob, filename);
  if (!result.success) {
    console.error('[PDF DOWNLOAD] Failed:', result.error);
  }
  return result.success;
}
