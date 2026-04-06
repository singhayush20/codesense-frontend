import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface OAuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: ReactNode;
  loading?: boolean;
}

export function OAuthButton({
  label,
  icon,
  loading = false,
  className,
  ...props
}: OAuthButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-border/70 bg-card/90 px-4 py-3 text-sm font-semibold text-foreground transition duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:cursor-wait disabled:opacity-80",
        className,
      )}
      disabled={loading}
      {...props}
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-foreground shadow-[var(--shadow-surface)]">
        {icon}
      </span>
      <span>{loading ? "Processing..." : label}</span>
    </button>
  );
}
