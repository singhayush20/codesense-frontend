"use client";

import { useEffect, useState } from "react";
import { Clock, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusIcon } from "@/components/review-workflow/StatusIcon";
import { formatDuration } from "@/utils/formatDuration";
import { STEP_LABELS, ReviewWorkflowStepStatus } from "@/types/review-workflow";
import type { ReviewWorkflowStep as ReviewWorkflowStepType } from "@/types/review-workflow";

interface WorkflowStepProps {
  step: ReviewWorkflowStepType;
  isLast: boolean;
  isCurrentStep?: boolean;
}

export function WorkflowStep({ step, isLast, isCurrentStep }: WorkflowStepProps) {
  const [liveDuration, setLiveDuration] = useState<string>("");

  useEffect(() => {
    if (step.status !== ReviewWorkflowStepStatus.RUNNING || !step.startedAt) return;

    const update = () => {
      const elapsed = Date.now() - new Date(step.startedAt!).getTime();
      setLiveDuration(`Started ${formatDuration(elapsed)} ago`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [step.status, step.startedAt]);

  let displayDuration: string;
  if (step.status === ReviewWorkflowStepStatus.RUNNING) {
    displayDuration = liveDuration;
  } else if (step.status === ReviewWorkflowStepStatus.FAILED && step.durationMs != null) {
    displayDuration = `Failed after ${formatDuration(step.durationMs)}`;
  } else if (step.status === ReviewWorkflowStepStatus.CANCELLED && step.durationMs != null) {
    displayDuration = `Cancelled after ${formatDuration(step.durationMs)}`;
  } else if (step.status === ReviewWorkflowStepStatus.SKIPPED) {
    displayDuration = "Skipped";
  } else if (step.durationMs != null) {
    displayDuration = `Completed in ${formatDuration(step.durationMs)}`;
  } else {
    displayDuration = "";
  }

  const label = STEP_LABELS[step.step] ?? step.step;

  return (
    <div className="relative flex gap-3">
      <div className="flex flex-col items-center">
        <StatusIcon status={step.status} />
        {!isLast && <div className={cn("w-px flex-1", isCurrentStep ? "bg-blue-500/40" : "bg-border/60")} />}
      </div>

      <div className={cn("min-w-0 flex-1", !isLast && "pb-8")}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span
              className={cn(
                "text-sm font-medium",
                step.status === ReviewWorkflowStepStatus.PENDING ? "text-muted-foreground/50" : "text-foreground",
              )}
            >
              {label}
            </span>
            {step.status !== ReviewWorkflowStepStatus.PENDING && (
              <span
                className={cn(
                  "ml-2 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                  step.status === ReviewWorkflowStepStatus.RUNNING && "bg-blue-500/10 text-blue-500",
                  step.status === ReviewWorkflowStepStatus.SUCCESS && "bg-emerald-500/10 text-emerald-500",
                  step.status === ReviewWorkflowStepStatus.FAILED && "bg-destructive/10 text-destructive",
                  step.status === ReviewWorkflowStepStatus.CANCELLED && "bg-muted/20 text-muted-foreground",
                  step.status === ReviewWorkflowStepStatus.SKIPPED && "bg-muted/20 text-muted-foreground/50",
                )}
              >
                {step.status === ReviewWorkflowStepStatus.RUNNING && <Loader2 className="mr-0.5 size-2.5 animate-spin" />}
                {step.status}
              </span>
            )}
          </div>

          {displayDuration && (
            <span className="shrink-0 whitespace-nowrap font-mono text-[11px] tabular-nums text-muted-foreground">
              {displayDuration}
            </span>
          )}
        </div>

        {(step.startedAt || step.completedAt) && (
          <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground/70">
            {step.startedAt && (
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" />
                {formatTime(step.startedAt)}
              </span>
            )}
            {step.completedAt && step.completedAt !== step.startedAt && (
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" />
                {formatTime(step.completedAt)}
              </span>
            )}
          </div>
        )}

        {step.errorMessage && (
          <div className="mt-2 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-xs leading-relaxed text-destructive">
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
            <span>{step.errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function formatTime(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}


