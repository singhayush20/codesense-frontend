"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  GitPullRequest,
  Loader2,
  Minus,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { githubApi } from "@/modules/github/api/github.api";
import type { GithubPullRequest } from "@/modules/github/types/github.types";
import { PrState } from "@/modules/github/types/github.types";

const PAGE_SIZE = 20;

interface RepositoryPullRequestsProps {
  repositoryId: string;
}

export function RepositoryPullRequests({ repositoryId }: RepositoryPullRequestsProps) {
  const router = useRouter();
  const [pullRequests, setPullRequests] = useState<GithubPullRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [author, setAuthor] = useState("");
  const [state, setState] = useState<PrState | "">("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncedAuthor, setDebouncedAuthor] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const hasFilters = Boolean(search.trim() || author.trim() || state);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setDebouncedAuthor(author.trim());
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [author, search]);

  useEffect(() => {
    setPage(1);
  }, [state]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPullRequests() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await githubApi.getPullRequests({
          repositoryId,
          page,
          limit: PAGE_SIZE,
          search: debouncedSearch,
          author: debouncedAuthor,
          state: state || undefined,
        });

        if (controller.signal.aborted) return;

        setPullRequests(response.items);
        setTotal(response.total);
        setTotalPages(Math.max(response.totalPages, 1));
      } catch (loadError) {
        if (controller.signal.aborted) return;

        const message =
          loadError instanceof Error ? loadError.message : "Unable to load pull requests.";
        setError(message);
        setPullRequests([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadPullRequests();

    return () => controller.abort();
  }, [debouncedAuthor, debouncedSearch, page, reloadKey, repositoryId, state]);

  const rangeLabel = useMemo(() => {
    if (total === 0) return "No pull requests";

    const start = (page - 1) * PAGE_SIZE + 1;
    const end = Math.min(page * PAGE_SIZE, total);

    return `Showing ${start}-${end} of ${total}`;
  }, [page, total]);

  const clearFilters = () => {
    setSearch("");
    setAuthor("");
    setState("");
    setDebouncedSearch("");
    setDebouncedAuthor("");
    setPage(1);
  };

  const retry = () => {
    setDebouncedSearch(search.trim());
    setDebouncedAuthor(author.trim());
    setReloadKey((currentKey) => currentKey + 1);
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border-border/70 bg-card/80 p-4 shadow-[var(--shadow-surface)] hover:translate-y-0">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Pull requests</h2>
            <p className="mt-1 text-sm text-muted-foreground">{rangeLabel}</p>
          </div>

          <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,220px)_160px_auto] xl:min-w-[760px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search pull requests..."
                className="pl-9"
                aria-label="Search pull requests"
              />
            </div>

            <Input
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              placeholder="Filter by author"
              aria-label="Filter pull requests by author"
            />

            <select
              value={state}
              onChange={(event) => setState(event.target.value as PrState | "")}
              aria-label="Filter pull requests by state"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              <option value="">All states</option>
              <option value={PrState.OPEN}>Open</option>
              <option value={PrState.CLOSED}>Closed</option>
              <option value={PrState.MERGED}>Merged</option>
            </select>

            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
              disabled={!hasFilters || isLoading}
              className="gap-2"
            >
              <X className="size-4" aria-hidden="true" />
              Clear
            </Button>
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/80 p-0 shadow-[var(--shadow-surface)] hover:translate-y-0">
        {isLoading ? (
          <div className="grid min-h-[28rem] place-items-center p-8 text-center">
            <div>
              <Loader2 className="mx-auto size-7 animate-spin text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">Loading pull requests...</p>
            </div>
          </div>
        ) : error ? (
          <div className="grid min-h-[28rem] place-items-center p-8 text-center">
            <div>
              <div className="mx-auto grid size-12 place-items-center rounded-xl bg-destructive/10 text-destructive">
                <AlertCircle className="size-6" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Pull requests could not be loaded
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                {error}
              </p>
              <Button type="button" onClick={retry} className="mt-4 gap-2">
                <RefreshCw className="size-4" aria-hidden="true" />
                Retry
              </Button>
            </div>
          </div>
        ) : pullRequests.length === 0 ? (
          <div className="grid min-h-[28rem] place-items-center p-8 text-center">
            <div>
              <div className="mx-auto grid size-12 place-items-center rounded-xl bg-muted text-primary">
                <GitPullRequest className="size-6" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {hasFilters ? "No matching pull requests" : "No pull requests yet"}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                {hasFilters
                  ? "Try a different title, author, or state filter."
                  : "Pull requests synced for this repository will appear here."}
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {pullRequests.map((pullRequest) => (
              <PullRequestRow
                key={pullRequest.id}
                pullRequest={pullRequest}
                onSelect={() =>
                  router.push(`/repositories/${repositoryId}/pull-requests/${pullRequest.id}`)
                }
              />
            ))}
          </div>
        )}
      </Card>

      <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/60 p-4 text-sm text-muted-foreground shadow-[var(--shadow-surface)] sm:flex-row sm:items-center sm:justify-between">
        <span>{rangeLabel}</span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 1))}
            disabled={isLoading || page <= 1}
            className="gap-2"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            Previous
          </Button>
          <span className="min-w-24 text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Page {page} / {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            onClick={() => setPage((currentPage) => Math.min(currentPage + 1, totalPages))}
            disabled={isLoading || page >= totalPages}
            className="gap-2"
          >
            Next
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function PullRequestRow({
  pullRequest,
  onSelect,
}: {
  pullRequest: GithubPullRequest;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full flex-col gap-4 p-4 text-left transition-colors hover:bg-muted/40"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-semibold text-muted-foreground">
            #{pullRequest.prNumber}
          </span>
          <StateBadge state={pullRequest.state} />
        </div>
        <h3 className="mt-2 truncate text-base font-semibold text-foreground">
          {pullRequest.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">by {pullRequest.author}</p>
      </div>

      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <PullRequestMetric
          icon={<Plus className="size-4" aria-hidden="true" />}
          label="Additions"
          value={`+${pullRequest.additions.toLocaleString()}`}
          className="text-emerald-600 dark:text-emerald-300"
        />
        <PullRequestMetric
          icon={<Minus className="size-4" aria-hidden="true" />}
          label="Deletions"
          value={`-${pullRequest.deletions.toLocaleString()}`}
          className="text-destructive"
        />
        <PullRequestMetric
          icon={<CalendarDays className="size-4" aria-hidden="true" />}
          label="Created"
          value={formatPullRequestDate(pullRequest.createdAt)}
        />
      </div>
    </button>
  );
}

function PullRequestMetric({
  icon,
  label,
  value,
  className,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="flex min-h-16 min-w-0 items-center gap-3 rounded-xl border border-border/60 bg-background/60 px-3 py-2">
      <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground", className)}>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <p className={cn("mt-1 break-words text-sm font-semibold text-foreground", className)}>
          {value}
        </p>
      </div>
    </div>
  );
}

function formatPullRequestDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function StateBadge({ state }: { state: PrState }) {
  return (
    <Badge
      className={cn(
        "tracking-[0.14em]",
        state === PrState.OPEN &&
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
        state === PrState.CLOSED &&
          "border-destructive/20 bg-destructive/10 text-destructive",
        state === PrState.MERGED &&
          "border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-300",
      )}
    >
      {state}
    </Badge>
  );
}
