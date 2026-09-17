import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar, { MobileMenuButton } from './Sidebar';

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell flex min-h-screen">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className="app-shell flex min-h-screen flex-1 flex-col">
        <div className="app-sidebar flex items-center gap-3 border-b border-border px-4 py-3 lg:hidden">
          <MobileMenuButton onClick={() => setMobileOpen(true)} />
          <div className="flex items-center gap-2">
            <img src="/masgarti-logo.svg" alt="Masgarti logo" className="h-8 w-8 object-contain" />
            <span className="text-sm font-semibold text-text-primary">Masgarti Payroll</span>
          </div>
        </div>
        <div className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
