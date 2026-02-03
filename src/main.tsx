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

// AGGRESSIVE cache clear - bump version to force full refresh
const CACHE_KEY = 'app_cache_v30';
if (typeof sessionStorage !== 'undefined') {
  const cleared = sessionStorage.getItem(CACHE_KEY);
  if (!cleared) {
    // Clear everything
    sessionStorage.clear();
    sessionStorage.setItem(CACHE_KEY, '1');
    if ('caches' in window) {
      caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))));
    }
    // Force reload after cache clear
    window.location.reload();
  }
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}
