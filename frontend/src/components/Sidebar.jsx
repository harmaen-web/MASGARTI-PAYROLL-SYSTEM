import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Calculator, History, LayoutDashboard, LogOut, Menu, Users2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employees', label: 'Employees', icon: Users2 },
  { to: '/payroll/process', label: 'Payroll Processing', icon: Calculator },
  { to: '/payroll/history', label: 'Payroll History', icon: History },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };
  const initials = user?.name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="overlay-backdrop fixed inset-0 z-40 lg:hidden"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`app-sidebar fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col justify-between border-r border-border px-4 py-6 transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/masgarti-logo.svg" alt="Masgarti logo" className="h-10 w-10 shrink-0 object-contain" />
              <div>
                <p className="text-[13px] font-bold leading-tight text-text-primary">THE MASGARTI BUSINESS</p>
                <p className="text-[10px] font-medium text-text-muted">PAYROLL PROCESSING SYSTEM</p>
              </div>
            </div>
            <button type="button" className="rounded-lg p-1 text-text-secondary lg:hidden" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                    isActive
                      ? 'nav-link-active'
                      : 'font-medium text-text-secondary hover-app-elevated'
                  }`
                }
              >
                <Icon size={20} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="space-y-4 border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-magenta/10 text-sm font-semibold text-brand-magenta">
              {initials || 'AD'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary">{user?.name || 'Administrator'}</p>
              <p className="text-xs text-text-muted">{user?.role || 'HR Administrator'}</p>
            </div>
          </div>
          <button type="button" onClick={handleLogout} className="btn-secondary w-full">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export function MobileMenuButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-border bg-card p-2 text-text-secondary lg:hidden"
      aria-label="Open menu"
    >
      <Menu size={18} />
    </button>
  );
}
