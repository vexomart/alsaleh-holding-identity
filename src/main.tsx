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

// Cache clear on version bump
const CACHE_KEY = 'app_cache_v26';
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
