import type { ReviewWorkflowStep, SSEEvent } from "@/types/review-workflow";
import { WORKFLOW_STEP_ORDER, ReviewWorkflowStepStatus } from "@/types/review-workflow";

export function mergeStepsWithEvents(
  initialSteps: ReviewWorkflowStep[],
  events: SSEEvent[],
): ReviewWorkflowStep[] {
  const stepMap = new Map<string, ReviewWorkflowStep>();
  for (const s of initialSteps) {
    stepMap.set(s.step, { ...s });
  }

  for (const event of events) {
    const d = event.data as Record<string, unknown> | undefined;
    const stepKey = d?.step as string | undefined;
    if (!stepKey) continue;

    const existing = stepMap.get(stepKey) ?? {
      step: stepKey,
      status: ReviewWorkflowStepStatus.PENDING,
      startedAt: null,
      completedAt: null,
      durationMs: null,
      errorMessage: null,
    };

    switch (event.type) {
      case "STEP_STARTED":
        stepMap.set(stepKey, {
          ...existing,
          status: ReviewWorkflowStepStatus.RUNNING,
          startedAt: (d?.timestamp as string | null) ?? existing.startedAt,
        });
        break;
      case "STEP_COMPLETED":
        stepMap.set(stepKey, {
          ...existing,
          status: ReviewWorkflowStepStatus.SUCCESS,
          completedAt: (d?.timestamp as string | null) ?? existing.completedAt,
          durationMs: (d?.durationMs as number | null) ?? existing.durationMs,
        });
        break;
      case "STEP_FAILED":
        stepMap.set(stepKey, {
          ...existing,
          status: ReviewWorkflowStepStatus.FAILED,
          completedAt: (d?.timestamp as string | null) ?? existing.completedAt,
          durationMs: (d?.durationMs as number | null) ?? existing.durationMs,
          errorMessage: (d?.errorMessage as string | null) ?? existing.errorMessage,
        });
        break;
    }
  }

  return WORKFLOW_STEP_ORDER
    .map((step) => stepMap.get(step))
    .filter((s): s is ReviewWorkflowStep => s !== undefined);
}

export function getRunStatusFromEvents(events: SSEEvent[]): {
  status: string | null;
  timestamp: string | null;
} {
  for (let i = events.length - 1; i >= 0; i--) {
    const event = events[i];
    const d = event.data as Record<string, unknown>;
    if (event.type === "RUN_COMPLETED") {
      return { status: "SUCCESS", timestamp: d.timestamp as string | null };
    }
    if (event.type === "RUN_FAILED") {
      return { status: "FAILED", timestamp: d.timestamp as string | null };
    }
    if (event.type === "RUN_CANCELLED") {
      return { status: "CANCELLED", timestamp: d.timestamp as string | null };
    }
    if (event.type === "RUN_SUPERSEDED") {
      return { status: "SUPERSEDED", timestamp: d.timestamp as string | null };
    }
  }
  return { status: null, timestamp: null };
}
