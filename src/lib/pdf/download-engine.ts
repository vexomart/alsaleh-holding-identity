/**
 * Guaranteed PDF Download Engine
 *
 * هدفه: جعل تنزيل PDF ينجح بأعلى موثوقية ممكنة عبر متصفحات حديثة
 * عبر 3 استراتيجيات متسلسلة: anchor → new tab → hidden iframe.
 */

import { toast } from 'sonner';

export type DownloadMethod = 'anchor' | 'tab' | 'iframe';

export type DownloadPdfGuaranteedResult =
  | { ok: true; method: DownloadMethod }
  | { ok: false; error: unknown; stage: 'download' };

type Args = {
  blob: Blob;
  filename: string;
};

function isIOS(): boolean {
  const ua = navigator.userAgent || '';
  // iPhone/iPad/iPod + iPadOS desktop mode
  return /iPad|iPhone|iPod/.test(ua) || (/(Macintosh)/.test(ua) && (navigator as any).maxTouchPoints > 1);
}

function supportsDownloadAttribute(): boolean {
  try {
    return 'download' in HTMLAnchorElement.prototype;
  } catch {
    return false;
  }
}

/**
 * تنزيل PDF مع فوالباك صارم.
 */
export function downloadPdfGuaranteed({ blob, filename }: Args): DownloadPdfGuaranteedResult {
  const url = URL.createObjectURL(blob);

  // Strategy 1: anchor download
  try {
    // iOS Safari غالباً يتجاهل download attribute — نوجّه مباشرة لبديل tab.
    if (!isIOS() && supportsDownloadAttribute()) {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.rel = 'noopener';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return { ok: true, method: 'anchor' };
    }
  } catch (error) {
    console.error('[PDF] Download anchor failed:', error);
    // continue to fallback
  }

  // Strategy 2: open in new tab
  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (win) {
      toast.info('تم فتح الملف في تبويب جديد — إذا لم يبدأ التحميل اضغط زر التنزيل من المتصفح');
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      return { ok: true, method: 'tab' };
    }
  } catch (error) {
    console.error('[PDF] Download tab failed:', error);
    // continue to fallback
  }

  // Strategy 3: hidden iframe (print-safe PDF viewer)
  try {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.src = url;

    document.body.appendChild(iframe);
    setTimeout(() => {
      try {
        iframe.remove();
      } catch {
        // ignore
      }
      URL.revokeObjectURL(url);
    }, 60_000);

    return { ok: true, method: 'iframe' };
  } catch (error) {
    console.error('[PDF] Download iframe failed:', error);
    try {
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
    return { ok: false, error, stage: 'download' };
  }
}
