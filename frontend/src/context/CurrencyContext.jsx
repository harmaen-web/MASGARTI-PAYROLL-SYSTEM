import { createContext, useContext, useMemo, useState } from 'react';

const CurrencyContext = createContext(null);

export const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', locale: 'en-IN' },
  USD: { code: 'USD', symbol: '$', locale: 'en-US' },
};

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => localStorage.getItem('masgarti-currency') || 'INR');

  const setCurrencyCode = (code) => {
    setCurrency(code);
    localStorage.setItem('masgarti-currency', code);
  };

  const value = useMemo(
    () => ({
      currency,
      currencyInfo: CURRENCIES[currency] || CURRENCIES.INR,
      setCurrency: setCurrencyCode,
    }),
    [currency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};
