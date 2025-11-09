import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/abadan-ai.css';

// Initialize i18n first, but don't block rendering
import('./lib/i18n').catch((error) => {
  console.warn('Failed to load i18n:', error);
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

try {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  rootElement.innerHTML = '<div style="padding: 20px; text-align: center; font-family: system-ui;"><h1>Error loading application</h1><p>Please check the console for details.</p><pre style="text-align: left; background: #f5f5f5; padding: 10px; border-radius: 4px; margin-top: 10px;">' + String(error) + '</pre></div>';
}
