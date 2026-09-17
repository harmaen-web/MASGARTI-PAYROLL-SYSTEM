export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      <p className="max-w-md text-sm text-text-muted">{description}</p>
      {action}
    </div>
  );
}
