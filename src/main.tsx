import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Cache invalidation keys - bump these to force cache clear
const SW_RESET_KEY = 'sw_reset_v25';
const PREVIEW_GUARD_KEY = 'preview_guard_v17';

async function clearCacheOnce() {
  const host = window.location.hostname;
  const isPreview = host.includes('lovableproject.com') || host.includes('lovable.app');
  
  const guardKey = isPreview ? PREVIEW_GUARD_KEY : SW_RESET_KEY;
  const storage = isPreview ? sessionStorage : localStorage;
  
  if (storage.getItem(guardKey) === '1') return;
  storage.setItem(guardKey, '1');
  
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
  } catch (e) {
    console.warn('Cache clear skipped:', e);
  }
}

void clearCacheOnce();

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}
