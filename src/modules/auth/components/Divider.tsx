export function Divider() {
  return (
    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      <span>OR</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
