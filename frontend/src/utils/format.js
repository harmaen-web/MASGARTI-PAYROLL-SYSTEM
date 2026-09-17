import { CURRENCIES } from '../context/CurrencyContext';

export const formatCurrency = (amount, currencyCode = 'INR') => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.INR;
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const getCurrentMonth = () =>
  new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

export const getMonthOptions = () => {
  const options = [];
  const now = new Date();
  for (let i = 0; i < 12; i += 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    options.push(date.toLocaleString('en-US', { month: 'long', year: 'numeric' }));
  }
  return options;
};
