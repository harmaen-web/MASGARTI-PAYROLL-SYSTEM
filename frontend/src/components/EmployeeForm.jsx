import { useState } from 'react';
import { toast } from 'sonner';
import { useCurrency } from '../context/CurrencyContext';

const initialState = {
  employee_id: '',
  name: '',
  department: '',
  designation: '',
  basic_salary: '',
  allowances: '',
  deductions: '',
};

export default function EmployeeForm({ initialValues = {}, onSubmit, onCancel, submitLabel }) {
  const { currencyInfo } = useCurrency();
  const [form, setForm] = useState({ ...initialState, ...initialValues });
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = [];
    if (!form.employee_id.trim()) nextErrors.push('Employee ID is required');
    if (!form.name.trim()) nextErrors.push('Employee name is required');
    if (!form.department.trim()) nextErrors.push('Department is required');
    if (!form.designation.trim()) nextErrors.push('Designation is required');

    ['basic_salary', 'allowances', 'deductions'].forEach((field) => {
      const value = Number(form[field]);
      if (form[field] === '' || Number.isNaN(value)) {
        nextErrors.push(`${field.replace('_', ' ')} must be a valid number`);
      } else if (value < 0) {
        nextErrors.push(`${field.replace('_', ' ')} cannot be negative`);
      }
    });

    const basic = Number(form.basic_salary);
    const allowances = Number(form.allowances);
    const deductions = Number(form.deductions);
    if (![basic, allowances, deductions].some(Number.isNaN) && deductions > basic + allowances) {
      nextErrors.push('Deductions cannot exceed gross salary (basic salary + allowances)');
    }

    setErrors(nextErrors);
    return nextErrors.length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      toast.error('Please fix the validation errors');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        basic_salary: Number(form.basic_salary),
        allowances: Number(form.allowances),
        deductions: Number(form.deductions),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      {errors.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-border dark:bg-danger-bg dark:text-danger-text">
          <ul className="list-disc pl-5">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Employee ID" name="employee_id" value={form.employee_id} onChange={handleChange} />
        <Field label="Employee Name" name="name" value={form.name} onChange={handleChange} />
        <Field label="Department" name="department" value={form.department} onChange={handleChange} />
        <Field label="Designation" name="designation" value={form.designation} onChange={handleChange} />
        <Field label={`Basic Salary (${currencyInfo.symbol})`} name="basic_salary" type="number" value={form.basic_salary} onChange={handleChange} />
        <Field label={`Allowances (${currencyInfo.symbol})`} name="allowances" type="number" value={form.allowances} onChange={handleChange} />
        <Field label={`Deductions (${currencyInfo.symbol})`} name="deductions" type="number" value={form.deductions} onChange={handleChange} />
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({ label, name, value, onChange, type = 'text' }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-text-secondary">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="input-field"
        min={type === 'number' ? 0 : undefined}
      />
    </label>
  );
}
