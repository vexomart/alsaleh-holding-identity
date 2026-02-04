import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

/**
 * RTL INITIALIZATION - CRITICAL
 * Apply RTL direction IMMEDIATELY at document level before React renders
 * This ensures the page loads with correct direction from the start
 */
const initializeDirection = () => {
  if (typeof document === 'undefined') return;
  
  // Check saved language preference
  const savedLang = localStorage.getItem('ash_language') || 'ar';
  const isRTL = savedLang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  
  // Apply to document root (html element)
  document.documentElement.dir = dir;
  document.documentElement.lang = savedLang;
  document.documentElement.setAttribute('data-direction', dir);
  
  // Apply to body
  document.body.dir = dir;
  document.body.setAttribute('data-lang', savedLang);
  
  // Add RTL/LTR classes
  if (isRTL) {
    document.documentElement.classList.add('rtl');
    document.documentElement.classList.remove('ltr');
    document.body.classList.add('rtl');
    document.body.classList.remove('ltr');
  } else {
    document.documentElement.classList.add('ltr');
    document.documentElement.classList.remove('rtl');
    document.body.classList.add('ltr');
    document.body.classList.remove('rtl');
  }
  
  console.log(`[RTL] Direction initialized: ${dir}, Language: ${savedLang}`);
};

// Initialize direction immediately
initializeDirection();

// Force cache bust on version change - v45 for services section redesign
const CACHE_KEY = 'app_cache_v45';
if (typeof sessionStorage !== 'undefined' && !sessionStorage.getItem(CACHE_KEY)) {
  // Clear old session keys
  Object.keys(sessionStorage).filter(k => k.startsWith('app_cache_')).forEach(k => sessionStorage.removeItem(k));
  Object.keys(localStorage).filter(k => k.startsWith('app_cache_')).forEach(k => localStorage.removeItem(k));
  sessionStorage.setItem(CACHE_KEY, '1');
  // Clear all caches including Vite deps
  if ('caches' in window) {
    caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
  }
  // Force reload on first visit with new version
  window.location.reload();
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}
