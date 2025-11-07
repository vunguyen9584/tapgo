import React from 'react';
 import { createRoot } from 'react-dom/client';
 import App from './App';
import { I18nProvider } from './lib/i18n';

 const rootEl = document.getElementById('root')!;
 createRoot(rootEl).render(
   <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
   </React.StrictMode>
 );
