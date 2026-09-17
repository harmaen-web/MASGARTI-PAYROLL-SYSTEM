import ThemeToggle from './ThemeToggle';

export default function AuthLayout({ children }) {
  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-8">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img src="/masgarti-logo.svg" alt="Masgarti logo" className="mx-auto mb-4 h-16 w-16 object-contain" />
          <h1 className="text-2xl font-bold text-text-primary">The Masgarti Business</h1>
          <p className="mt-1 text-sm text-text-muted">Payroll Processing System</p>
        </div>
        {children}
      </div>
    </div>
  );
}
