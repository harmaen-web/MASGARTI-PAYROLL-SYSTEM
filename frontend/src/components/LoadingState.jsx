export default function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-8 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary" />
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  );
}
