import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import PageHeader from '../components/PageHeader';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import CurrencySelector from '../components/CurrencySelector';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { formatCurrency, getCurrentMonth, getMonthOptions } from '../utils/format';

export default function PayrollProcessing() {
  const { currency } = useCurrency();
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [month, setMonth] = useState(getCurrentMonth());
  const [status, setStatus] = useState('Processed');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const loadEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.getEmployees();
      setEmployees(response.data);
      if (response.data.length > 0) {
        setEmployeeId(response.data[0]._id);
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const loadPreview = async () => {
    if (!employeeId) return;
    try {
      const response = await api.previewPayroll(employeeId);
      setPreview(response.data);
      setError('');
    } catch (err) {
      setPreview(null);
      setError(err.message);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    loadPreview();
  }, [employeeId]);

  const handleProcess = async () => {
    setProcessing(true);
    setError('');
    try {
      const response = await api.processPayroll({ employeeId, month, status });
      toast.success(response.message || 'Payroll processed successfully');
      setPreview(response.calculation);
    } catch (err) {
      const message = err.data?.message || err.message || 'Payroll processing failed';
      setError(message);
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <LoadingState message="Loading payroll processing..." />;
  if (error && !preview && employees.length === 0) return <ErrorState message={error} onRetry={loadEmployees} />;

  return (
    <div>
      <PageHeader
        title="Payroll Processing"
        subtitle="Select an employee and payroll month to calculate and process salary."
        month={month}
        onMonthChange={setMonth}
      />

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card space-y-4">
          <h2 className="text-lg font-bold text-text-primary">Process Payroll</h2>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-text-secondary">Select Employee</span>
            <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="input-field">
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.employee_id} - {employee.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-text-secondary">Payroll Month</span>
            <select value={month} onChange={(e) => setMonth(e.target.value)} className="input-field">
              {getMonthOptions().map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-text-secondary">Payroll Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field">
              <option value="Pending">Pending</option>
              <option value="Processed">Processed</option>
              <option value="Paid">Paid</option>
            </select>
          </label>

          <CurrencySelector />

          <button type="button" onClick={handleProcess} disabled={processing || !employeeId} className="btn-primary">
            {processing ? 'Processing...' : 'Process Payroll'}
          </button>
        </div>

        <div className="card space-y-4">
          <h2 className="text-lg font-bold text-text-primary">Salary Calculation</h2>
          {preview ? (
            <>
              <Detail label="Basic Salary" value={formatCurrency(preview.basic_salary, currency)} />
              <Detail label="Allowances" value={formatCurrency(preview.allowances, currency)} />
              <Detail label="Gross Salary" value={formatCurrency(preview.gross_salary, currency)} highlight />
              <Detail label="Deductions" value={formatCurrency(preview.deductions, currency)} />
              <Detail label="Net Salary" value={formatCurrency(preview.net_salary, currency)} highlight />
            </>
          ) : (
            <p className="text-sm text-text-muted">Select an employee to preview salary calculation.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value, highlight = false }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3 last:border-b-0">
      <span className="text-sm text-text-muted">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? 'text-brand-magenta' : 'text-text-primary'}`}>{value}</span>
    </div>
  );
}
