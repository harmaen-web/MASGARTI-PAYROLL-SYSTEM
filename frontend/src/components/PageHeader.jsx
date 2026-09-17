import { CalendarRange } from 'lucide-react';

export default function PageHeader({
  title,
  subtitle,
  month,
  onMonthChange,
  actions,
}) {
  return (
    <div className="mb-5 flex flex-col gap-4 py-2 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-text-muted">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {month !== undefined && (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
            <CalendarRange size={16} className="text-text-secondary" />
            {onMonthChange ? (
              <select
                value={month}
                onChange={(e) => onMonthChange(e.target.value)}
                className="bg-transparent text-sm font-semibold text-text-secondary outline-none"
              >
                {Array.from({ length: 12 }).map((_, index) => {
                  const date = new Date();
                  date.setMonth(date.getMonth() - index);
                  const value = date.toLocaleString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  });
                  return (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
            ) : (
              <span className="text-sm font-semibold text-text-secondary">{month}</span>
            )}
          </div>
        )}
        {actions}
      </div>
    </div>
  );
}
