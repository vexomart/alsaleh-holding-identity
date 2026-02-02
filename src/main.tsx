import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Main.tsx loaded successfully - build refresh');
console.log('CSS file check - starting build process');

// Debug DOM and errors
console.log('Document state:', document.readyState);
console.log('Current URL:', window.location.href);

// Check for any existing errors
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error, e.message, e.filename);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

const rootElement = document.getElementById("root");
console.log('Root element found:', rootElement);
console.log('Root element HTML:', rootElement?.outerHTML);

// --- Cache / Service Worker hard reset ---
// ملاحظة: في بيئة الـ Preview/Dev قد يستمر الـSW بإرجاع ملفات prebundle قديمة مما يسبب
// Duplicate React وبالتالي أخطاء hooks مثل `useRef`.
// لذلك: في الـPreview/Dev نعمل unregister + clear cache على كل تحميل (بدون مرة واحدة).
// في الإنتاج (النطاق المنشور) نُبقي السلوك “مرة واحدة” لتفادي إعادة تحميل متكررة.
const SW_RESET_KEY = 'sw_reset_done_v13_react_alias';

async function hardResetServiceWorkerOnce() {
  try {
    const host = window.location.hostname;
    const isPreviewOrDev =
      // Vite dev
      (import.meta as any)?.env?.DEV === true ||
      // Lovable preview domains
      host.includes('lovableproject.com') ||
      host.includes('id-preview--') ||
      host.endsWith('.lovable.app');

    // Bump this key whenever we need to force a new one-time reset per tab.
    const PREVIEW_GUARD_KEY = 'sw_reset_preview_guard_v7';

    // In preview/dev: guard per-tab to avoid reload loops.
    if (isPreviewOrDev && sessionStorage.getItem(PREVIEW_GUARD_KEY) === '1') return;

    // In production/published: keep the one-time guard.
    if (!isPreviewOrDev && localStorage.getItem(SW_RESET_KEY) === '1') return;

    const hasSW = 'serviceWorker' in navigator;
    const hasCache = 'caches' in window;
    if (!hasSW && !hasCache) {
      if (!isPreviewOrDev) localStorage.setItem(SW_RESET_KEY, '1');
      return;
    }

    // Mark first to avoid reload loops even if something fails.
    if (isPreviewOrDev) sessionStorage.setItem(PREVIEW_GUARD_KEY, '1');
    else localStorage.setItem(SW_RESET_KEY, '1');

    // Unregister any existing SWs.
    if (hasSW) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }

    // Clear caches.
    if (hasCache) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }

    // Force a cache-busting navigation (more reliable than reload in some cached/CDN/SW edge cases).
    const url = new URL(window.location.href);
    url.searchParams.set('_cb', String(Date.now()));
    window.location.replace(url.toString());
  } catch (e) {
    // If anything fails, do not block app render.
    console.warn('[SW Reset] skipped due to error:', e);
  }
}

void hardResetServiceWorkerOnce();

// Service worker disabled to prevent caching delays

if (rootElement) {
  console.log('Creating React app...');
  try {
    createRoot(rootElement).render(<App />);
    console.log('React app rendered successfully');
  } catch (error) {
    console.error('Error rendering React app:', error);
  }
} else {
  console.error('Root element not found!');
}
