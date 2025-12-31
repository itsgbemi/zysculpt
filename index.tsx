
// 1. SHIM IMMEDIATELY (Must be before any other imports)
const env = (import.meta as any).env || {};
const viteKey = env.VITE_API_KEY;

if (typeof window !== 'undefined') {
  (window as any).process = (window as any).process || { env: {} };
  (window as any).process.env = (window as any).process.env || {};
  if (viteKey) {
    (window as any).process.env.API_KEY = viteKey;
  }
}

// 2. REGULAR IMPORTS
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initDatadog } from './services/datadog';

// 3. Initialize Monitoring
initDatadog();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
