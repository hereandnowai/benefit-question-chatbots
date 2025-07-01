
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BRAND_INFO } from './constants'; // To potentially set favicon dynamically

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Dynamically set favicon from brand info
const faviconElement = document.getElementById('favicon') as HTMLLinkElement | null;
if (faviconElement && BRAND_INFO.brand.logo.favicon) {
  faviconElement.href = BRAND_INFO.brand.logo.favicon;
}
// Dynamically set document title
document.title = BRAND_INFO.brand.appName || "BenefitsBot";


const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
