"use client";

import { useMemo } from "react";
import { CalendarDays, GitCommit } from "lucide-react";
import { WorkflowStep } from "@/components/review-workflow/WorkflowStep";
import { RunStatusBadge } from "@/components/review-workflow/RunStatusBadge";
import { ConnectionStatus } from "@/components/review-workflow/ConnectionStatus";
import { mergeStepsWithEvents } from "@/utils/workflowMerge";
import { formatRelativeTime } from "@/utils/formatDuration";
import type { ReviewWorkflowResponse, SSEEvent } from "@/types/review-workflow";
import { ReviewWorkflowStepStatus } from "@/types/review-workflow";

interface ReviewWorkflowTimelineProps {
  workflow: ReviewWorkflowResponse;
  liveEvents?: SSEEvent[];
  connected?: boolean;
}

export function ReviewWorkflowTimeline({
  workflow,
  liveEvents = [],
  connected,
}: ReviewWorkflowTimelineProps) {
  const mergedSteps = useMemo(
    () => mergeStepsWithEvents(workflow.steps, liveEvents),
    [workflow.steps, liveEvents],
  );

  const currentStep = mergedSteps.find((s) => s.status === ReviewWorkflowStepStatus.RUNNING);
  const currentStepLabel = currentStep
    ? currentStep.step.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : undefined;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60">
      <div className="shrink-0 space-y-3 border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">
              Workflow Run
            </span>
            <span className="text-border/60">/</span>
            <span className="font-mono text-xs text-muted-foreground">
              {workflow.run.provider}
            </span>
          </div>
          {connected !== undefined && <ConnectionStatus connected={connected} />}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <RunStatusBadge
            status={workflow.run.status}
            currentStep={currentStepLabel}
          />
          {workflow.run.createdAt && (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <CalendarDays className="size-3" />
              {formatRelativeTime(workflow.run.createdAt)}
            </span>
          )}
          {workflow.run.headSha && (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <GitCommit className="size-3" />
              {workflow.run.headSha.slice(0, 7)}
            </span>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="space-y-0">
          {mergedSteps.map((step, index) => (
            <WorkflowStep
              key={step.step}
              step={step}
              isLast={index === mergedSteps.length - 1}
              isCurrentStep={index === mergedSteps.findIndex((s) => s.status === ReviewWorkflowStepStatus.RUNNING)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
