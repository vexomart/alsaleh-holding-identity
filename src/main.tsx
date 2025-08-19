import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Optimized for FCP - minimal execution before render
const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(<App />);
} else {
  console.error('Root element not found!');
}

// Defer debugging and error handling to after initial render
if (import.meta.env.DEV) {
  // Only add debugging in development mode
  console.log('Main.tsx loaded successfully');
  console.log('Document state:', document.readyState);
  console.log('Current URL:', window.location.href);

  // Defer error handlers to not block FCP
  setTimeout(() => {
    window.addEventListener('error', (e) => {
      console.error('Global error:', e.error, e.message, e.filename);
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
    });
  }, 0);
}
