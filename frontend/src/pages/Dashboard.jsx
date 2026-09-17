import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CircleCheck, CreditCard, Users2 } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { formatCurrency, formatDate, getCurrentMonth } from '../utils/format';

export default function Dashboard() {
  const { currency } = useCurrency();
  const [month, setMonth] = useState(getCurrentMonth());
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.getDashboardStats(month);
      setStats(response.data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [month]);

  if (loading) return <LoadingState message="Loading dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={loadStats} />;

  const cards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      subtitle: 'Active employees in the system',
      icon: Users2,
      iconBg: 'bg-blue-100 dark:bg-info-bg',
      iconColor: 'text-blue-600 dark:text-accent-blue',
    },
    {
      title: 'Pending Payout Run',
      value: stats.pendingCount,
      subtitle: 'Employees not yet processed, plus pending payroll records',
      icon: AlertTriangle,
      iconBg: 'bg-amber-100 dark:bg-warning-bg',
      iconColor: 'text-amber-600 dark:text-accent-yellow',
    },
    {
      title: 'Processed & Paid',
      value: stats.processedCount,
      subtitle: 'Employees successfully paid',
      icon: CircleCheck,
      iconBg: 'bg-emerald-100 dark:bg-success-bg',
      iconColor: 'text-emerald-600 dark:text-accent-green',
    },
    {
      title: 'Total Monthly Payroll',
      value: formatCurrency(stats.totalPayroll, currency),
      subtitle: 'Net payroll for selected month',
      icon: CreditCard,
      iconBg: 'bg-brand-pink/10 dark:bg-[rgba(217,70,239,0.12)]',
      iconColor: 'text-brand-magenta dark:text-accent-purple',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Payroll Overview"
        subtitle="Real-time summary of current billing cycles and payout status."
        month={month}
        onMonthChange={setMonth}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.title} className="card">
            <div className="mb-4 flex items-center justify-between">
              <p className="neon-label text-sm font-semibold">{card.title}</p>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.iconBg}`}>
                <card.icon size={16} className={card.iconColor} />
              </div>
            </div>
            <p className="neon-stat text-3xl font-bold">{card.value}</p>
            <p className="mt-1 text-sm text-text-muted">{card.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="card mt-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary">Recent Payroll Activity</h2>
          <Link to="/payroll/history" className="btn-secondary px-3 py-2 text-sm">
            View Details
          </Link>
        </div>

        {stats.recentActivity.length === 0 ? (
          <EmptyState
            title="No payroll activity yet"
            description="Process payroll to see recent activity here."
            action={<Link to="/payroll/process" className="btn-primary">Process Payroll</Link>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="app-elevated text-text-secondary">
                <tr>
                  <th className="px-4 py-3 font-semibold">Employee Name</th>
                  <th className="px-4 py-3 font-semibold">Gross Amount</th>
                  <th className="px-4 py-3 font-semibold">Payout Status</th>
                  <th className="px-4 py-3 font-semibold">Processed Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentActivity.map((record) => (
                  <tr key={record._id} className="border-t border-border">
                    <td className="px-4 py-4 font-medium">{record.employee_id?.name || '-'}</td>
                    <td className="px-4 py-4 font-semibold">{formatCurrency(record.gross_salary, currency)}</td>
                    <td className="px-4 py-4"><StatusBadge status={record.status} /></td>
                    <td className="px-4 py-4 text-text-secondary">{formatDate(record.processed_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
