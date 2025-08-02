import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Main.tsx loaded successfully');

const rootElement = document.getElementById("root");
console.log('Root element found:', rootElement);

if (rootElement) {
  console.log('Creating React app...');
  createRoot(rootElement).render(<App />);
  console.log('React app rendered successfully');
} else {
  console.error('Root element not found!');
}
