import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "group overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.95)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/10 hover:bg-slate-900/90",
        className,
      )}
      {...props}
    />
  );
}
