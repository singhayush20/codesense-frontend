interface AuthSnackbarProps {
  message: string | null;
}

export function AuthSnackbar({ message }: AuthSnackbarProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-center">
      <div
        role="alert"
        aria-live="polite"
        className="pointer-events-auto w-full max-w-md rounded-2xl border border-primary/20 bg-card/95 px-4 py-3 text-sm text-foreground shadow-[var(--shadow-surface)] backdrop-blur-xl"
      >
        <p className="font-medium">{message}</p>
      </div>
    </div>
  );
}
