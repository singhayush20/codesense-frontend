import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "group overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-6 text-card-foreground shadow-[var(--shadow-surface)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:bg-card/95",
        className,
      )}
      {...props}
    />
  );
}
