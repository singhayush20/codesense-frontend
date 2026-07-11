"use client";

import { Circle, CheckCircle2, XCircle, SkipForward, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReviewWorkflowStepStatus } from "@/types/review-workflow";

const iconMap: Record<string, typeof Circle> = {
  [ReviewWorkflowStepStatus.PENDING]: Circle,
  [ReviewWorkflowStepStatus.RUNNING]: Loader2,
  [ReviewWorkflowStepStatus.SUCCESS]: CheckCircle2,
  [ReviewWorkflowStepStatus.FAILED]: XCircle,
  [ReviewWorkflowStepStatus.CANCELLED]: Circle,
  [ReviewWorkflowStepStatus.SKIPPED]: SkipForward,
};

const colorMap: Record<string, string> = {
  [ReviewWorkflowStepStatus.PENDING]: "text-muted-foreground/40",
  [ReviewWorkflowStepStatus.RUNNING]: "text-blue-500",
  [ReviewWorkflowStepStatus.SUCCESS]: "text-emerald-500",
  [ReviewWorkflowStepStatus.FAILED]: "text-destructive",
  [ReviewWorkflowStepStatus.CANCELLED]: "text-muted-foreground/50",
  [ReviewWorkflowStepStatus.SKIPPED]: "text-muted-foreground/40",
};

export function StatusIcon({ status }: { status: ReviewWorkflowStepStatus }) {
  const Icon = iconMap[status] ?? Circle;

  return (
    <div className={cn("grid size-8 shrink-0 place-items-center rounded-full border-2", colorMap[status] ?? colorMap[ReviewWorkflowStepStatus.PENDING])}>
      <Icon
        className={cn(
          "size-4",
          status === ReviewWorkflowStepStatus.RUNNING && "animate-spin",
          status === ReviewWorkflowStepStatus.CANCELLED && "opacity-50",
        )}
      />
    </div>
  );
}
