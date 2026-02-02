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

// --- Cache / Service Worker hard reset (one-time) ---
// بعض المستخدمين ما زال لديهم Service Worker قديم يعمل بـ cache-first ويُظهر نسخة قديمة من الواجهة.
// هذا الكود يقوم بإلغاء تسجيل الـSW ومسح الـCache **مرة واحدة فقط** ثم يعيد تحميل الصفحة لضمان
// وصول أحدث نسخة (وبالتالي ظهور UI Template v2.0 - 2026 داخل واجهة الفاتورة).
const SW_RESET_KEY = 'sw_reset_done_v3_2026_02_02';

async function hardResetServiceWorkerOnce() {
  try {
    if (localStorage.getItem(SW_RESET_KEY) === '1') return;

    const hasSW = 'serviceWorker' in navigator;
    const hasCache = 'caches' in window;
    if (!hasSW && !hasCache) {
      localStorage.setItem(SW_RESET_KEY, '1');
      return;
    }

    // Mark first to avoid reload loops even if something fails.
    localStorage.setItem(SW_RESET_KEY, '1');

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

    // Hard reload without cache.
    window.location.reload();
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
