export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms} ms`;
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}.${Math.floor((ms % 1000) / 100)} s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

export function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return new Date(isoDate).toLocaleTimeString();
}

import { ReviewWorkflowStepStatus } from "@/types/review-workflow";

export function formatStepDuration(durationMs: number | null, status: string, startedAt?: string | null): string {
  if (status === ReviewWorkflowStepStatus.RUNNING && startedAt) {
    return `Started ${formatRelativeTime(startedAt)}`;
  }
  if (status === ReviewWorkflowStepStatus.FAILED && durationMs != null) {
    return `Failed after ${formatDuration(durationMs)}`;
  }
  if (status === ReviewWorkflowStepStatus.CANCELLED && durationMs != null) {
    return `Cancelled after ${formatDuration(durationMs)}`;
  }
  if (status === ReviewWorkflowStepStatus.SKIPPED) return "Skipped";
  if (durationMs != null) return `Completed in ${formatDuration(durationMs)}`;
  return "";
}

export function formatLiveElapsed(startedAt: string): string {
  const elapsed = Date.now() - new Date(startedAt).getTime();
  return formatDuration(elapsed);
}
