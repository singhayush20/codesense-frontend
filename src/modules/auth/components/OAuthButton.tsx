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
        "inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-slate-950/85 px-4 py-3 text-sm font-semibold text-slate-100 transition duration-200 hover:bg-slate-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 disabled:cursor-wait disabled:opacity-80",
        className,
      )}
      disabled={loading}
      {...props}
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-slate-100 shadow-sm shadow-black/20">
        {icon}
      </span>
      <span>{loading ? "Processing…" : label}</span>
    </button>
  );
}
