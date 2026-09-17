import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import useDebounce from '../hooks/useDebounce';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { formatCurrency, formatDate, getCurrentMonth } from '../utils/format';

export default function PayrollHistory() {
  const { currency } = useCurrency();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('');
  const [status, setStatus] = useState('All');
  const debouncedSearch = useDebounce(search);

  const loadHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.getPayrollHistory({
        search: debouncedSearch,
        month,
        status,
      });
      setRecords(response.data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to load payroll history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [debouncedSearch, month, status]);

  return (
    <div>
      <PageHeader
        title="Payroll History"
        subtitle="View previously processed payroll records and open individual payslips."
        month={getCurrentMonth()}
      />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row">
        <div className="relative w-full lg:w-[300px]">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee or ID..."
            className="input-field pl-10"
          />
        </div>
        <select value={month} onChange={(e) => setMonth(e.target.value)} className="input-field lg:w-[220px]">
          <option value="">All Months</option>
          {Array.from({ length: 12 }).map((_, index) => {
            const date = new Date();
            date.setMonth(date.getMonth() - index);
            const value = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
            return <option key={value} value={value}>{value}</option>;
          })}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field lg:w-[180px]">
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Processed">Processed</option>
          <option value="Paid">Paid</option>
        </select>
      </div>

      {loading ? (
        <LoadingState message="Loading payroll history..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadHistory} />
      ) : records.length === 0 ? (
        <EmptyState
          title="No payroll records found"
          description="Process payroll to build payroll history."
          action={<Link to="/payroll/process" className="btn-primary">Process Payroll</Link>}
        />
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="app-elevated text-text-secondary">
              <tr>
                <th className="px-4 py-3 font-semibold">Employee</th>
                <th className="px-4 py-3 font-semibold">Payroll Month</th>
                <th className="px-4 py-3 font-semibold">Gross Salary</th>
                <th className="px-4 py-3 font-semibold">Deductions</th>
                <th className="px-4 py-3 font-semibold">Net Salary</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Processed Date</th>
                <th className="px-4 py-3 font-semibold">Payslip</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record._id} className="border-t border-border">
                  <td className="px-4 py-4 font-medium">{record.employee_id?.name || '-'}</td>
                  <td className="px-4 py-4 text-text-secondary">{record.month}</td>
                  <td className="px-4 py-4">{formatCurrency(record.gross_salary, currency)}</td>
                  <td className="px-4 py-4">{formatCurrency(record.deductions, currency)}</td>
                  <td className="px-4 py-4 font-semibold">{formatCurrency(record.net_salary, currency)}</td>
                  <td className="px-4 py-4"><StatusBadge status={record.status} /></td>
                  <td className="px-4 py-4 text-text-secondary">{formatDate(record.processed_date)}</td>
                  <td className="px-4 py-4">
                    <Link to={`/payroll/${record._id}/payslip`} className="font-semibold text-brand-magenta hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
