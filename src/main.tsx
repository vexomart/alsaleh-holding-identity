import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Main.tsx loaded successfully');
console.log('CSS file check - starting build process');

// Debug DOM and errors
console.log('Document state:', document.readyState);
console.log('Current URL:', window.location.href);

// Check for any existing errors
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error, e.message, e.filename);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

const rootElement = document.getElementById("root");
console.log('Root element found:', rootElement);
console.log('Root element HTML:', rootElement?.outerHTML);

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
