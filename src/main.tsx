import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

/**
 * RTL INITIALIZATION - CRITICAL
 * Apply RTL direction IMMEDIATELY at document level before React renders
 */
const initializeDirection = () => {
  if (typeof document === 'undefined') return;
  
  const savedLang = localStorage.getItem('ash_language') || 'ar';
  const isRTL = savedLang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  
  document.documentElement.dir = dir;
  document.documentElement.lang = savedLang;
  document.documentElement.setAttribute('data-direction', dir);
  document.body.dir = dir;
  document.body.setAttribute('data-lang', savedLang);
  
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
};

// Initialize direction immediately
initializeDirection();

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
