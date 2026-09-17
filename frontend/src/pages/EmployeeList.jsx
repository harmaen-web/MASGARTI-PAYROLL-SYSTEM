import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Edit2, Trash2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import FilterBar from '../components/FilterBar';
import useDebounce from '../hooks/useDebounce';
import { api } from '../services/api';
import { getCurrentMonth } from '../utils/format';

export default function EmployeeList() {
  const location = useLocation();
  const [employees, setEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [designation, setDesignation] = useState('All');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const loadEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        search: debouncedSearch,
        department,
        designation,
        min_salary: minSalary,
        max_salary: maxSalary,
      };
      const response = await api.getEmployees(params);
      setEmployees(response.data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const loadFilterOptions = async () => {
    try {
      const response = await api.getEmployees();
      setAllEmployees(response.data);
    } catch {
      setAllEmployees([]);
    }
  };

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [debouncedSearch, department, designation, minSalary, maxSalary]);

  const departments = useMemo(() => {
    const values = [...new Set(allEmployees.map((employee) => employee.department))];
    return ['All', ...values];
  }, [allEmployees]);

  const designations = useMemo(() => {
    const values = [...new Set(allEmployees.map((employee) => employee.designation))];
    return ['All', ...values];
  }, [allEmployees]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteEmployee(deleteTarget._id);
      toast.success('Employee deleted successfully');
      setDeleteTarget(null);
      loadEmployees();
      loadFilterOptions();
    } catch (err) {
      toast.error(err.message || 'Failed to delete employee');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setDepartment('All');
    setDesignation('All');
    setMinSalary('');
    setMaxSalary('');
  };

  return (
    <div>
      <PageHeader
        title="Employee Records"
        subtitle="Manage institutional staffing directory, departments, and active employee status."
        month={getCurrentMonth()}
        actions={
          <Link to="/employees/new" className="btn-primary">
            <UserPlus size={16} />
            Add Employee
          </Link>
        }
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        department={department}
        onDepartmentChange={setDepartment}
        departments={departments}
        designation={designation}
        onDesignationChange={setDesignation}
        designations={designations}
        minSalary={minSalary}
        onMinSalaryChange={setMinSalary}
        maxSalary={maxSalary}
        onMaxSalaryChange={setMaxSalary}
        onClear={clearFilters}
      />

      {loading ? (
        <LoadingState message="Loading employees..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadEmployees} />
      ) : employees.length === 0 ? (
        <EmptyState
          title="No employees found"
          description="Try adjusting your search or filters, or add a new employee."
          action={
            <Link to="/employees/new" className="btn-primary">
              Add Employee
            </Link>
          }
        />
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="app-elevated text-text-secondary">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="px-4 py-3 font-semibold">Designation</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id} className="border-t border-border">
                  <td className="px-4 py-4 font-semibold text-text-secondary">{employee.employee_id}</td>
                  <td className="px-4 py-4 font-medium">
                    <Link to={`/employees/${employee._id}`} className="hover:text-primary">
                      {employee.name}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-text-secondary">{employee.department}</td>
                  <td className="px-4 py-4 text-text-secondary">{employee.designation}</td>
                  <td className="px-4 py-4"><StatusBadge status="Active" /></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Link to={`/employees/${employee._id}/edit`} className="text-text-secondary hover:text-primary">
                        <Edit2 size={16} />
                      </Link>
                      <button type="button" onClick={() => setDeleteTarget(employee)} className="text-text-secondary hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
