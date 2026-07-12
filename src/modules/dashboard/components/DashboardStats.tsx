"use client";

import { useEffect, useRef } from "react";
import {
  BookOpen,
  GitPullRequest,
  MessageSquare,
  Coins,
  Settings2,
  GitFork,
  Clock,
  FileText,
  Bot,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { useDashboard } from "@/modules/dashboard/hooks/useDashboard";
import type { DashboardStats as DashboardStatsType } from "@/modules/dashboard/api/dashboard.api";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatMs(ms: number): string {
  if (ms >= 60_000) return `${(ms / 60_000).toFixed(1)}m`;
  if (ms >= 1_000) return `${(ms / 1_000).toFixed(1)}s`;
  return `${ms.toFixed(0)}ms`;
}

function TokenCard({ stats }: { stats: DashboardStatsType }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-5 shadow-[var(--shadow-surface)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:bg-card/95">
      <div className="absolute right-0 top-0 size-32 translate-x-8 -translate-y-8 rounded-full opacity-[0.08] bg-[var(--color-warning)] blur-3xl" />
      <div className="flex items-start justify-between">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-muted text-primary ring-1 ring-border/70">
          <Coins className="size-5" />
        </div>
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
        {formatNumber(stats.totalTokensConsumed)}
      </p>
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        Total tokens
      </p>
      <div className="mt-2 flex gap-3 border-t border-border/50 pt-2 text-xs text-muted-foreground">
        <span>In: {formatNumber(stats.totalInputTokens)}</span>
        <span>Out: {formatNumber(stats.totalOutputTokens)}</span>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accentClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accentClass: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-5 shadow-[var(--shadow-surface)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:bg-card/95">
      <div className={`absolute right-0 top-0 size-32 translate-x-8 -translate-y-8 rounded-full opacity-[0.08] ${accentClass} blur-3xl`} />
      <div className="flex items-start justify-between">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-muted text-primary ring-1 ring-border/70">
          {icon}
        </div>
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function DonutChart({
  data,
  size = 96,
}: {
  data: { name: string; value: number; color: string }[];
  size?: number;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="relative flex items-center justify-center">
      <ResponsiveContainer width={size} height={size}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size * 0.31}
            outerRadius={size * 0.46}
            dataKey="value"
            stroke="none"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute flex flex-col items-center">
        <span className="text-xl font-bold text-foreground">{formatNumber(total)}</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">total</span>
      </div>
    </div>
  );
}

function Legend({ items }: { items: { label: string; value: number; color: string }[] }) {
  return (
    <div className="flex flex-1 flex-col gap-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </span>
          <span className="text-sm font-medium text-foreground">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function PRStateSection({ stats }: { stats: DashboardStatsType }) {
  const open = stats.pullRequestsByState.find((s) => s.state === "open")?.count ?? 0;
  const closed = stats.pullRequestsByState.find((s) => s.state === "closed")?.count ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-xl bg-muted text-primary ring-1 ring-border/70">
          <GitPullRequest className="size-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Pull Requests</p>
          <p className="text-xs text-muted-foreground">{stats.totalPullRequests} total</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <DonutChart
          data={[
            { name: "Open", value: open, color: "var(--color-success)" },
            { name: "Closed", value: closed, color: "var(--color-border-strong)" },
          ]}
        />
        <Legend
          items={[
            { label: "Open", value: open, color: "var(--color-success)" },
            { label: "Closed", value: closed, color: "var(--color-border-strong)" },
          ]}
        />
      </div>
    </div>
  );
}

function ReviewsStatusSection({ stats }: { stats: DashboardStatsType }) {
  const success = stats.reviewsByStatus.find((r) => r.status === "success")?.count ?? 0;
  const failed = stats.reviewsByStatus.find((r) => r.status === "failed")?.count ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-xl bg-muted text-primary ring-1 ring-border/70">
          <MessageSquare className="size-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Reviews</p>
          <p className="text-xs text-muted-foreground">{stats.totalReviewsGenerated} generated</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <DonutChart
          data={[
            { name: "Success", value: success, color: "var(--color-success)" },
            { name: "Failed", value: failed, color: "var(--color-danger)" },
          ]}
        />
        <Legend
          items={[
            { label: "Success", value: success, color: "var(--color-success)" },
            { label: "Failed", value: failed, color: "var(--color-danger)" },
          ]}
        />
      </div>
    </div>
  );
}

function TokenSplitSection({ stats }: { stats: DashboardStatsType }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-xl bg-muted text-primary ring-1 ring-border/70">
          <Coins className="size-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Token Usage</p>
          <p className="text-xs text-muted-foreground">{formatNumber(stats.totalTokensConsumed)} total</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <DonutChart
          data={[
            { name: "Input", value: stats.totalInputTokens, color: "var(--color-accent)" },
            { name: "Output", value: stats.totalOutputTokens, color: "var(--color-warning)" },
          ]}
        />
        <Legend
          items={[
            { label: "Input", value: stats.totalInputTokens, color: "var(--color-accent)" },
            { label: "Output", value: stats.totalOutputTokens, color: "var(--color-warning)" },
          ]}
        />
      </div>
    </div>
  );
}

function PerformanceSection({ stats }: { stats: DashboardStatsType }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-xl bg-muted text-primary ring-1 ring-border/70">
          <Clock className="size-4" />
        </div>
        <p className="text-sm font-semibold text-foreground">Performance</p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2">
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <Coins className="size-3.5" />
            Avg input tokens
          </span>
          <span className="text-sm font-medium text-foreground">
            {formatNumber(Math.round(stats.averageInputTokensPerReview))}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2">
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <Coins className="size-3.5" />
            Avg output tokens
          </span>
          <span className="text-sm font-medium text-foreground">
            {formatNumber(Math.round(stats.averageOutputTokensPerReview))}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2">
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="size-3.5" />
            Avg files / PR
          </span>
          <span className="text-sm font-medium text-foreground">
            {stats.averageFilesPerPr.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2">
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            Avg review time
          </span>
          <span className="text-sm font-medium text-foreground">
            {formatMs(stats.averageReviewTimeMs)}
          </span>
        </div>
      </div>
    </div>
  );
}

function ProviderSection({ stats }: { stats: DashboardStatsType }) {
  const barColors: Record<string, string> = {
    ollama: "var(--color-success)",
    gemini: "var(--color-accent)",
    nvidia: "var(--color-warning)",
  };

  const data = stats.reviewsByProvider.map((p) => ({
    name: p.provider.charAt(0).toUpperCase() + p.provider.slice(1),
    reviews: p.count,
    fill: barColors[p.provider] ?? "var(--color-accent)",
  }));

  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-2xl bg-muted text-primary ring-1 ring-border/70">
          <Bot className="size-4" />
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">Reviews by Provider</p>
          <p className="text-xs text-muted-foreground">{stats.reviewsByProvider.length} providers active</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} axisLine={false} tickLine={false} />
          <Bar dataKey="reviews" radius={[6, 6, 0, 0]} barSize={40}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function DashboardStats() {
  const { stats, error, isLoading, hasLoaded, loadStats } = useDashboard();
  const hasRequested = useRef(false);

  useEffect(() => {
    if (hasRequested.current) return;
    hasRequested.current = true;
    void loadStats();
  }, [loadStats]);

  if (!hasLoaded || isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <div className="h-12 w-48 animate-pulse rounded-xl bg-card/70" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-3xl border border-border/70 bg-card/70" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-3xl border border-border/70 bg-card/70" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded-3xl border border-border/70 bg-card/70" />
          <div className="h-64 animate-pulse rounded-3xl border border-border/70 bg-card/70" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-4 py-20">
        <p className="text-sm text-muted-foreground">{error ?? "No data available."}</p>
        <button
          type="button"
          onClick={() => void loadStats()}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Overview</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          icon={<GitFork className="size-5" />}
          label="Repositories"
          value={stats.totalRepositories}
          accentClass="bg-[var(--color-accent)]"
        />
        <StatCard
          icon={<GitPullRequest className="size-5" />}
          label="Pull Requests"
          value={stats.totalPullRequests}
          accentClass="bg-[var(--color-success)]"
        />
        <StatCard
          icon={<MessageSquare className="size-5" />}
          label="Reviews"
          value={stats.totalReviewsGenerated}
          accentClass="bg-[var(--color-accent)]"
        />
        <TokenCard stats={stats} />
        <StatCard
          icon={<Settings2 className="size-5" />}
          label="LLM Configs"
          value={stats.totalLlmConfigs}
          accentClass="bg-[var(--color-accent)]"
        />
        <StatCard
          icon={<BookOpen className="size-5" />}
          label="Selected Repos"
          value={stats.totalSelectedRepos}
          accentClass="bg-[var(--color-success)]"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <PRStateSection stats={stats} />
        </Card>
        <Card className="p-5">
          <ReviewsStatusSection stats={stats} />
        </Card>
        <Card className="p-5">
          <TokenSplitSection stats={stats} />
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ProviderSection stats={stats} />
        <Card className="p-5">
          <PerformanceSection stats={stats} />
        </Card>
      </div>
    </div>
  );
}
