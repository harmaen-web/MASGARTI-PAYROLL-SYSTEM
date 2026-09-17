import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CurrencyProvider>
          <App />
          <Toaster richColors position="top-right" closeButton />
        </CurrencyProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
