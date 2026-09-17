import { CURRENCIES, useCurrency } from '../context/CurrencyContext';

export default function CurrencySelector({ className = '' }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-text-secondary">Display Currency</label>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="input-field"
      >
        {Object.values(CURRENCIES).map((item) => (
          <option key={item.code} value={item.code}>
            {item.symbol} {item.code}
          </option>
        ))}
      </select>
      <p className="mt-1 text-xs text-text-muted">Display only. Salary values are not converted.</p>
    </div>
  );
}
