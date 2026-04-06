import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IconBoxProps extends HTMLAttributes<HTMLDivElement> {
  icon: ReactNode;
  title: string;
  description: string;
}

export function IconBox({ icon, title, description, className, ...props }: IconBoxProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-3xl border border-border/70 bg-card/75 p-6 text-left text-card-foreground shadow-[var(--shadow-surface)]",
        className,
      )}
      {...props}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-primary ring-1 ring-border/70">
        {icon}
      </div>
      <div>
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
