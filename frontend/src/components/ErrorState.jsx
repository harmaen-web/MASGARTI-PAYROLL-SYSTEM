export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
      <h3 className="text-lg font-semibold text-red-700">Something went wrong</h3>
      <p className="max-w-md text-sm text-red-600">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-primary">
          Try Again
        </button>
      )}
    </div>
  );
}
