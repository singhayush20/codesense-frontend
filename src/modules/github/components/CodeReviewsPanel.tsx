"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  FileCode2,
  Loader2,
  MessageSquare,
  XCircle,
} from "lucide-react";
import type { GithubCodeReviewRun } from "@/modules/github/types/github.types";
import { PullRequestReviewStatus } from "@/modules/github/types/github.types";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface CodeReviewsPanelProps {
  reviews: GithubCodeReviewRun[];
}

const severityConfig: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  CRITICAL: {
    bg: "bg-destructive/10",
    border: "border-destructive/20",
    text: "text-destructive",
  },
  WARNING: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
  },
  INFO: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-600 dark:text-blue-400",
  },
};

const statusConfig: Record<
  string,
  { icon: typeof CheckCircle2; bg: string; text: string; label: string }
> = {
  [PullRequestReviewStatus.SUCCESS]: {
    icon: CheckCircle2,
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    label: "Success",
  },
  [PullRequestReviewStatus.FAILED]: {
    icon: XCircle,
    bg: "bg-destructive/10",
    text: "text-destructive",
    label: "Failed",
  },
  [PullRequestReviewStatus.IN_PROGRESS]: {
    icon: Loader2,
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    label: "In Progress",
  },
  [PullRequestReviewStatus.CANCELLED]: {
    icon: XCircle,
    bg: "bg-muted/40",
    text: "text-muted-foreground",
    label: "Cancelled",
  },
  [PullRequestReviewStatus.SUPERSEDED]: {
    icon: XCircle,
    bg: "bg-muted/40",
    text: "text-muted-foreground",
    label: "Superseded",
  },
};

function formatCount(value: number | null): string {
  if (value === null) return "—";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

function getStatusMessage(run: GithubCodeReviewRun): string {
  switch (run.reviewStatus) {
    case PullRequestReviewStatus.IN_PROGRESS:
      return "The AI code review is currently running.";
    case PullRequestReviewStatus.CANCELLED:
      return "This review was manually cancelled.";
    case PullRequestReviewStatus.SUPERSEDED:
      return "Superseded by a newer run.";
    case PullRequestReviewStatus.FAILED:
      return "The review run encountered an error.";
    default:
      return "";
  }
}

function RunListCard({
  run,
  isSelected,
  onSelect,
}: {
  run: GithubCodeReviewRun;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const statusKey = run.reviewStatus ?? PullRequestReviewStatus.SUCCESS;
  const config = statusConfig[statusKey] ?? statusConfig.success;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full flex-col gap-2 rounded-xl border p-3 text-left transition-colors",
        isSelected
          ? "border-primary/30 bg-primary/5"
          : "border-border/60 bg-card/50 hover:bg-muted/30",
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em]",
            config.bg,
            config.text,
          )}
        >
          {run.reviewStatus === PullRequestReviewStatus.IN_PROGRESS ? (
            <Loader2 className="size-2.5 animate-spin" />
          ) : (
            <config.icon className="size-2.5" />
          )}
          {config.label}
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">
          {run.provider}
        </span>
      </div>

      {(run.reviewStatus === PullRequestReviewStatus.SUCCESS ||
        run.reviewStatus === PullRequestReviewStatus.FAILED) && (
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
          <span>in: {formatCount(run.totalInputTokens)}</span>
          <span>out: {formatCount(run.totalOutputTokens)}</span>
          <span>total: {formatCount(run.totalTokens)}</span>
          {run.reviewStatus === PullRequestReviewStatus.SUCCESS && (
            <span>{run.comments.length} comments</span>
          )}
        </div>
      )}

      {run.summary ? (
        <p className="line-clamp-2 text-xs leading-relaxed text-foreground/80">
          {run.summary}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          {getStatusMessage(run)}
        </p>
      )}
    </button>
  );
}

function CommentsPanel({ run }: { run: GithubCodeReviewRun }) {
  const statusKey = run.reviewStatus ?? PullRequestReviewStatus.SUCCESS;
  const config = statusConfig[statusKey] ?? statusConfig.success;

  const tokenDetails = useMemo(() => {
    if (run.reviewStatus !== PullRequestReviewStatus.SUCCESS && run.reviewStatus !== PullRequestReviewStatus.FAILED) return null;
    return (
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>Input: <strong className="font-mono text-foreground/80">{formatCount(run.totalInputTokens)}</strong></span>
        <span>Output: <strong className="font-mono text-foreground/80">{formatCount(run.totalOutputTokens)}</strong></span>
        <span>Total: <strong className="font-mono text-foreground/80">{formatCount(run.totalTokens)}</strong></span>
      </div>
    );
  }, [run]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60">
      <div className="shrink-0 space-y-2 border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em]",
              config.bg,
              config.text,
            )}
          >
            {run.reviewStatus === PullRequestReviewStatus.IN_PROGRESS ? (
              <Loader2 className="size-2.5 animate-spin" />
            ) : (
              <config.icon className="size-2.5" />
            )}
            {config.label}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {run.provider}
          </span>
        </div>
        {tokenDetails}
        {run.summary && (
          <p className="text-xs leading-relaxed text-foreground/80">
            {run.summary}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2 border-b border-border/50 px-4 py-2">
        <MessageSquare className="size-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold text-muted-foreground">
          Comments ({run.comments.length})
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {run.comments.length > 0 ? (
          <div className="space-y-3">
            {run.comments.map((comment, index) => {
              const style = severityConfig[comment.severity] ?? {
                bg: "bg-muted/40",
                border: "border-border/50",
                text: "text-muted-foreground",
              };
              return (
                <div
                  key={index}
                  className={cn(
                    "rounded-xl border p-3.5",
                    style.border,
                    style.bg,
                  )}
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase leading-none tracking-[0.12em]",
                        style.bg,
                        style.border,
                        style.text,
                      )}
                    >
                      {comment.severity}
                    </span>
                    <Badge className="text-[11px] tracking-[0.12em]">
                      {comment.category}
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">
                    {comment.message}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <FileCode2 className="size-3.5 shrink-0" />
                    <span className="truncate font-mono">
                      {comment.filePath}
                    </span>
                    <span className="shrink-0">
                      :{comment.startLine}
                      {comment.endLine !== comment.startLine &&
                        `-${comment.endLine}`}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            {run.reviewStatus === PullRequestReviewStatus.IN_PROGRESS ? (
              <>
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Review in progress...
                </p>
              </>
            ) : run.reviewStatus === PullRequestReviewStatus.SUCCESS ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle2 className="size-6 text-emerald-500" />
                <p className="text-sm text-muted-foreground">
                  No issues found in this review run.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <MessageSquare className="size-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {getStatusMessage(run)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function CodeReviewsPanel({ reviews }: CodeReviewsPanelProps) {
  const [selectedRunId, setSelectedRunId] = useState<string>(
    reviews.length > 0 ? reviews[0].runId : "",
  );
  const selectedRun =
    reviews.find((r) => r.runId === selectedRunId) ?? null;

  if (reviews.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/60 p-4 shadow-[var(--shadow-surface)]">
        <MessageSquare className="size-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No code reviews available for this pull request.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
      <div className="flex shrink-0 flex-col lg:w-72">
        <div className="mb-2 text-xs font-semibold text-muted-foreground">
          Review Runs ({reviews.length})
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
          {reviews.map((run) => (
            <RunListCard
              key={run.runId}
              run={run}
              isSelected={run.runId === selectedRunId}
              onSelect={() => setSelectedRunId(run.runId)}
            />
          ))}
        </div>
      </div>

      {selectedRun ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <CommentsPanel run={selectedRun} />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 items-center justify-center rounded-2xl border border-border/60 bg-card/40">
          <p className="text-sm text-muted-foreground">
            Select a review run to view comments.
          </p>
        </div>
      )}
    </div>
  );
}
