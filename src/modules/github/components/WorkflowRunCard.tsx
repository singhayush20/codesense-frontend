"use client";

import {
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";
import type {
  ReviewWorkflowResponse,
  ReviewWorkflowStep,
} from "@/modules/github/types/github.types";
import { ReviewWorkflowStepStatus } from "@/modules/github/types/github.types";
import { cn } from "@/lib/utils";

const stepIcons: Record<string, typeof CheckCircle2> = {
  [ReviewWorkflowStepStatus.PENDING]: Circle,
  [ReviewWorkflowStepStatus.RUNNING]: Loader2,
  [ReviewWorkflowStepStatus.SUCCESS]: CheckCircle2,
  [ReviewWorkflowStepStatus.FAILED]: XCircle,
  [ReviewWorkflowStepStatus.CANCELLED]: XCircle,
  [ReviewWorkflowStepStatus.SKIPPED]: Circle,
};

const stepColors = {
  dot: {
    [ReviewWorkflowStepStatus.PENDING]:
      "border-muted-foreground/30 text-muted-foreground/30",
    [ReviewWorkflowStepStatus.RUNNING]:
      "border-blue-500 text-blue-500",
    [ReviewWorkflowStepStatus.SUCCESS]:
      "border-emerald-500 text-emerald-500",
    [ReviewWorkflowStepStatus.FAILED]:
      "border-destructive text-destructive",
    [ReviewWorkflowStepStatus.CANCELLED]:
      "border-muted-foreground/50 text-muted-foreground/50",
    [ReviewWorkflowStepStatus.SKIPPED]:
      "border-muted-foreground/30 text-muted-foreground/30",
  },
  bg: {
    [ReviewWorkflowStepStatus.PENDING]: "bg-muted/30",
    [ReviewWorkflowStepStatus.RUNNING]: "bg-blue-500/10",
    [ReviewWorkflowStepStatus.SUCCESS]: "bg-emerald-500/10",
    [ReviewWorkflowStepStatus.FAILED]: "bg-destructive/10",
    [ReviewWorkflowStepStatus.CANCELLED]: "bg-muted/20",
    [ReviewWorkflowStepStatus.SKIPPED]: "bg-muted/20",
  },
  label: {
    [ReviewWorkflowStepStatus.PENDING]: "Pending",
    [ReviewWorkflowStepStatus.RUNNING]: "Running",
    [ReviewWorkflowStepStatus.SUCCESS]: "Success",
    [ReviewWorkflowStepStatus.FAILED]: "Failed",
    [ReviewWorkflowStepStatus.CANCELLED]: "Cancelled",
    [ReviewWorkflowStepStatus.SKIPPED]: "Skipped",
  },
};

function formatStepName(name: string): string {
  return name
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatDuration(ms: number | null): string {
  if (ms === null) return "—";
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.round((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
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

function StepItem({
  step,
  isLast,
}: {
  step: ReviewWorkflowStep;
  isLast: boolean;
}) {
  const Icon = stepIcons[step.status] ?? Circle;
  const dotColor = stepColors.dot[step.status] ?? stepColors.dot.pending;
  const bgColor = stepColors.bg[step.status] ?? stepColors.bg.pending;
  const label = stepColors.label[step.status] ?? step.status;
  const isRunning = step.status === ReviewWorkflowStepStatus.RUNNING;

  return (
    <div className="relative flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "grid size-7 shrink-0 place-items-center rounded-full border-2",
            dotColor,
            bgColor,
          )}
        >
          <Icon
            className={cn("size-3.5", isRunning && "animate-spin")}
          />
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-border/60" />
        )}
      </div>

      <div className={cn("min-w-0 flex-1 pb-6", isLast && "pb-0")}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="text-sm font-medium text-foreground">
              {formatStepName(step.step)}
            </span>
            {step.status !== ReviewWorkflowStepStatus.PENDING && (
              <span
                className={cn(
                  "ml-2 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                  bgColor,
                  dotColor,
                )}
              >
                {isRunning ? (
                  <Loader2 className="mr-0.5 size-2.5 animate-spin" />
                ) : null}
                {label}
              </span>
            )}
          </div>
          {step.durationMs !== null && (
            <span className="shrink-0 whitespace-nowrap font-mono text-[11px] tabular-nums text-muted-foreground">
              {formatDuration(step.durationMs)}
            </span>
          )}
        </div>

        {(step.startedAt || step.completedAt) && (
          <div className="mt-0.5 flex items-center gap-3 text-[11px] text-muted-foreground/70">
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
          <p className="mt-1.5 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs leading-relaxed text-destructive">
            {step.errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export function WorkflowRunCard({
  workflow,
}: {
  workflow: ReviewWorkflowResponse;
}) {
  const totalDuration = workflow.steps.reduce(
    (sum, s) => sum + (s.durationMs ?? 0),
    0,
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60">
      <div className="shrink-0 space-y-2 border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">
            Workflow Run
          </span>
          <span className="text-border/60">/</span>
          <span className="font-mono">{workflow.run.provider}</span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
          <span>
            Total:{" "}
            <strong className="font-mono text-foreground/80">
              {formatDuration(totalDuration)}
            </strong>
          </span>
          <span>
            Steps:{" "}
            <strong className="font-mono text-foreground/80">
              {workflow.steps.length}
            </strong>
          </span>
          {workflow.run.createdAt && (
            <span>
              Created:{" "}
              <strong className="font-mono text-foreground/80">
                {formatTime(workflow.run.createdAt)}
              </strong>
            </span>
          )}
          {workflow.run.headSha && (
            <span>
              Head:{" "}
              <strong className="font-mono text-foreground/80">
                {workflow.run.headSha.slice(0, 7)}
              </strong>
            </span>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="space-y-0">
          {workflow.steps.map((step, idx) => (
            <StepItem
              key={step.step}
              step={step}
              isLast={idx === workflow.steps.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
