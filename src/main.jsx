import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import './assets/css/font-awesome-all.min.css';
import './index.css';
import './assets/css/style.css';

// Stale Workbox/PWA service workers (from older builds or other branches) intercept Vite dev
// requests and spam the console ("Precaching did not find a match for /node_modules/.vite/...").
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
