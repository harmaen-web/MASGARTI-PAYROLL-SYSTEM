import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import PageHeader from '../components/PageHeader';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { formatCurrency } from '../utils/format';

export default function ViewEmployee() {
  const { id } = useParams();
  const { currency } = useCurrency();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEmployee = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.getEmployee(id);
      setEmployee(response.data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to load employee');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployee();
  }, [id]);

  if (loading) return <LoadingState message="Loading employee details..." />;
  if (error) return <ErrorState message={error} onRetry={loadEmployee} />;

  const grossSalary = employee.basic_salary + employee.allowances;
  const netSalary = grossSalary - employee.deductions;

  return (
    <div>
      <PageHeader
        title="Employee Details"
        subtitle="View complete employee and salary information."
        actions={<Link to={`/employees/${id}/edit`} className="btn-primary">Edit Employee</Link>}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card space-y-4">
          <h2 className="text-lg font-bold text-text-primary">Profile</h2>
          <Detail label="Employee ID" value={employee.employee_id} />
          <Detail label="Name" value={employee.name} />
          <Detail label="Department" value={employee.department} />
          <Detail label="Designation" value={employee.designation} />
        </div>

        <div className="card space-y-4">
          <h2 className="text-lg font-bold text-text-primary">Salary Structure</h2>
          <Detail label="Basic Salary" value={formatCurrency(employee.basic_salary, currency)} />
          <Detail label="Allowances" value={formatCurrency(employee.allowances, currency)} />
          <Detail label="Gross Salary" value={formatCurrency(grossSalary, currency)} />
          <Detail label="Deductions" value={formatCurrency(employee.deductions, currency)} />
          <Detail label="Net Salary" value={formatCurrency(netSalary, currency)} highlight />
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
