import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global React singleton
if (typeof window !== 'undefined') {
  (window as any).React = React;
  (window as any).ReactDOM = ReactDOM;
}

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

// Simple cache versioning (no reload loop)
const CACHE_KEY = 'app_cache_v32';
if (typeof sessionStorage !== 'undefined' && !sessionStorage.getItem(CACHE_KEY)) {
  sessionStorage.setItem(CACHE_KEY, '1');
  if ('caches' in window) {
    caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
  }
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}
