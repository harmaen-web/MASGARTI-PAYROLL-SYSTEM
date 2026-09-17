import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

export default function Signup() {
  const { register, isAuthenticated, loading } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  if (!loading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required';
    if (!form.email.trim()) nextErrors.email = 'Email is required';
    if (!form.password) nextErrors.password = 'Password is required';
    else if (form.password.length < 6) nextErrors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      toast.success('Account created successfully');
    } catch (error) {
      toast.error(error.data?.message || error.message || 'Failed to create account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Create an Account</h2>
          <p className="text-sm text-text-muted">Sign up to access the payroll management system.</p>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-text-secondary">Full Name</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className={`input-field ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-text-secondary">Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className={`input-field ${errors.email ? 'border-red-500' : ''}`}
            placeholder="admin@masgarti.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-text-secondary">Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            className={`input-field ${errors.password ? 'border-red-500' : ''}`}
            placeholder="Create a password"
          />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-text-secondary">Confirm Password</span>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            className={`input-field ${errors.confirmPassword ? 'border-red-500' : ''}`}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
        </label>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="text-center text-sm text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="neon-link hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
