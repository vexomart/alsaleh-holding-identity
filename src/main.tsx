import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
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

// Cache version - v66 forces complete rebuild
const CACHE_VERSION = 'v66';
const CACHE_KEY = `app_cache_${CACHE_VERSION}`;

// Force cache bust and reload on version change
if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
  const hasCurrentCache = sessionStorage.getItem(CACHE_KEY);
  
  if (!hasCurrentCache) {
    // Clear ALL old cache keys from sessionStorage
    const sessionKeys = Object.keys(sessionStorage);
    sessionKeys.forEach(key => {
      if (key.startsWith('app_cache_')) {
        sessionStorage.removeItem(key);
      }
    });
    
    // Clear from localStorage too
    const localKeys = Object.keys(localStorage);
    localKeys.forEach(key => {
      if (key.startsWith('app_cache_')) {
        localStorage.removeItem(key);
      }
    });
    
    // Set new cache key
    sessionStorage.setItem(CACHE_KEY, Date.now().toString());
    
    // Clear browser caches (including Vite deps cache)
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    
    // Force a hard reload to clear all module caches
    console.log(`[Cache] Version ${CACHE_VERSION} - forcing reload`);
    window.location.reload();
  }
}

// Mount React app
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
