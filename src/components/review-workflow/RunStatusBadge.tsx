"use client";

import { cn } from "@/lib/utils";

interface RunStatusBadgeProps {
  status: string;
  currentStep?: string;
  liveElapsed?: string;
}

const configs: Record<string, { label: string; variant: string }> = {
  IN_PROGRESS: { label: "RUNNING", variant: "running" },
  SUCCESS: { label: "SUCCESS", variant: "success" },
  FAILED: { label: "FAILED", variant: "failed" },
  CANCELLED: { label: "CANCELLED", variant: "cancelled" },
  SUPERSEDED: { label: "SUPERSEDED", variant: "superseded" },
};

const variantStyles: Record<string, string> = {
  running: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
  cancelled: "bg-muted/20 text-muted-foreground border-border/40",
  superseded: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

export function RunStatusBadge({ status, currentStep, liveElapsed }: RunStatusBadgeProps) {
  const config = configs[status] ?? configs.IN_PROGRESS;
  const variantStyle = variantStyles[config.variant] ?? variantStyles.running;

  return (
    <div className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1.5", variantStyle)}>
      <span className="text-xs font-bold uppercase tracking-wider">{config.label}</span>
      {(currentStep || liveElapsed) && (
        <span className="text-[11px] opacity-80">
          {currentStep && `– ${currentStep}`}
          {currentStep && liveElapsed && " "}
          {liveElapsed && `(${liveElapsed})`}
        </span>
      )}
    </div>
  );
}
