import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  if (!loading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const validate = () => {
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = 'Email is required';
    if (!form.password) nextErrors.password = 'Password is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(form);
      toast.success('Login successful');
    } catch (error) {
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Administrator Login</h2>
          <p className="text-sm text-text-muted">Sign in to manage employees and payroll.</p>
        </div>

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
            placeholder="Enter your password"
          />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
        </label>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Signing in...' : 'Login'}
        </button>

        <p className="text-center text-sm text-text-muted">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="neon-link hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
