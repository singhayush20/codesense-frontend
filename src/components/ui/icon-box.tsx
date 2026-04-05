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
        "flex items-start gap-4 rounded-3xl border border-white/10 bg-slate-950/70 p-6 text-left shadow-sm shadow-slate-950/20",
        className,
      )}
      {...props}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-100 ring-1 ring-white/10">
        {icon}
      </div>
      <div>
        <p className="text-base font-semibold text-slate-100">{title}</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
      </div>
    </div>
  );
}
