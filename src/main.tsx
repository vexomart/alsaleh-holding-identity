// Force single React instance - import React first
import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure React is available globally (helps with duplicate instance issues)
if (typeof window !== 'undefined') {
  (window as any).React = React;
  (window as any).ReactDOM = ReactDOM;
}

console.log('Main.tsx loaded - React version:', React.version);

const rootElement = document.getElementById("root");

if (rootElement) {
  console.log('Creating React app...');
  try {
    createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('React app rendered successfully');
  } catch (error) {
    console.error('Error rendering React app:', error);
  }
} else {
  console.error('Root element not found!');
}
