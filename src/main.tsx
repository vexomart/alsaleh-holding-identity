import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

/**
 * RTL INITIALIZATION - CRITICAL
 * Apply RTL direction IMMEDIATELY at document level before React renders
 * This ensures the page loads with correct direction from the start
 * HARD RTL ENFORCEMENT for 100% Arabic support
 */
const initializeDirection = () => {
  if (typeof document === 'undefined') return;
  
  // Check saved language preference - default to Arabic
  const savedLang = localStorage.getItem('ash_language') || 'ar';
  const isRTL = savedLang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  
  // Apply to document root (html element) - CRITICAL
  document.documentElement.dir = dir;
  document.documentElement.lang = savedLang;
  document.documentElement.setAttribute('data-direction', dir);
  document.documentElement.style.direction = dir;
  document.documentElement.style.textAlign = isRTL ? 'right' : 'left';
  
  // Apply to body - CRITICAL
  document.body.dir = dir;
  document.body.setAttribute('data-lang', savedLang);
  document.body.style.direction = dir;
  document.body.style.textAlign = isRTL ? 'right' : 'left';
  
  // Add RTL/LTR classes for CSS targeting
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
  
  // Add CSS custom property for direction
  document.documentElement.style.setProperty('--direction', dir);
  document.documentElement.style.setProperty('--text-align', isRTL ? 'right' : 'left');
  
  // Force RTL on #root element when it exists
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.dir = dir;
    rootElement.style.direction = dir;
    rootElement.style.textAlign = isRTL ? 'right' : 'left';
  }
  
  console.log(`[RTL] Direction initialized: ${dir}, Language: ${savedLang}`);
};

// Initialize direction IMMEDIATELY before anything else
initializeDirection();

// Force cache bust on version change
const CACHE_KEY = 'app_cache_v37';
if (typeof sessionStorage !== 'undefined' && !sessionStorage.getItem(CACHE_KEY)) {
  // Clear old session keys
  Object.keys(sessionStorage).filter(k => k.startsWith('app_cache_')).forEach(k => sessionStorage.removeItem(k));
  sessionStorage.setItem(CACHE_KEY, '1');
  // Clear all caches
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
