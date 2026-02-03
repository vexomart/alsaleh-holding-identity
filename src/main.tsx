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

// Apply RTL IMMEDIATELY before React renders (Arabic is default)
if (typeof document !== 'undefined') {
  document.documentElement.dir = 'rtl';
  document.documentElement.lang = 'ar';
  document.body.dir = 'rtl';
  document.documentElement.classList.add('rtl');
}

// Simple cache clear on version bump (no reload loop)
const CACHE_KEY = 'app_cache_v31';
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
