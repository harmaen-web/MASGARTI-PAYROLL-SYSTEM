const styles = {
  Paid: 'bg-emerald-100 text-emerald-600 dark:bg-success-bg dark:text-accent-green neon-badge-paid',
  Processed: 'bg-blue-100 text-blue-600 dark:bg-info-bg dark:text-accent-blue neon-badge-processed',
  Pending: 'bg-amber-100 text-amber-600 dark:bg-warning-bg dark:text-accent-yellow neon-badge-pending',
  Active: 'bg-emerald-100 text-emerald-600 dark:bg-success-bg dark:text-accent-green neon-badge-active',
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || 'bg-slate-100 text-slate-600 dark:bg-elevated dark:text-text-secondary'
      }`}
    >
      {status}
    </span>
  );
}
