"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Copy,
  FileCode2,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Loader2,
  MessageSquareText,
  Minus,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Diff, Hunk, markEdits, parseDiff, tokenize } from "react-diff-view";
import type { DiffType, FileData } from "react-diff-view";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import bashSyntax from "react-syntax-highlighter/dist/cjs/languages/prism/bash";
import css from "react-syntax-highlighter/dist/cjs/languages/prism/css";
import dartSyntax from "react-syntax-highlighter/dist/cjs/languages/prism/dart";
import groovySyntax from "react-syntax-highlighter/dist/cjs/languages/prism/groovy";
import javaSyntax from "react-syntax-highlighter/dist/cjs/languages/prism/java";
import jsSyntax from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
import jsxSyntax from "react-syntax-highlighter/dist/cjs/languages/prism/jsx";
import jsonSyntax from "react-syntax-highlighter/dist/cjs/languages/prism/json";
import kotlinSyntax from "react-syntax-highlighter/dist/cjs/languages/prism/kotlin";
import markdownSyntax from "react-syntax-highlighter/dist/cjs/languages/prism/markdown";
import markupSyntax from "react-syntax-highlighter/dist/cjs/languages/prism/markup";
import propertiesSyntax from "react-syntax-highlighter/dist/cjs/languages/prism/properties";
import pythonSyntax from "react-syntax-highlighter/dist/cjs/languages/prism/python";
import tomlSyntax from "react-syntax-highlighter/dist/cjs/languages/prism/toml";
import tsxSyntax from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
import tsSyntax from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import yamlSyntax from "react-syntax-highlighter/dist/cjs/languages/prism/yaml";
import oneLight from "react-syntax-highlighter/dist/cjs/styles/prism/one-light";
import refractor from "refractor";
import bash from "refractor/lang/bash";
import dart from "refractor/lang/dart";
import groovy from "refractor/lang/groovy";
import java from "refractor/lang/java";
import javascript from "refractor/lang/javascript";
import jsx from "refractor/lang/jsx";
import json from "refractor/lang/json";
import kotlin from "refractor/lang/kotlin";
import markup from "refractor/lang/markup";
import properties from "refractor/lang/properties";
import python from "refractor/lang/python";
import toml from "refractor/lang/toml";
import tsx from "refractor/lang/tsx";
import typescript from "refractor/lang/typescript";
import yaml from "refractor/lang/yaml";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { githubApi, GithubApiError } from "@/modules/github/api/github.api";
import { CodeReviewsPanel } from "@/modules/github/components/CodeReviewsPanel";
import type {
  GithubCodeReviewRun,
  GithubPullRequestDetails,
  GithubPullRequestFile,
} from "@/modules/github/types/github.types";
import { PrState } from "@/modules/github/types/github.types";

registerRefractorLanguages();
registerSyntaxHighlighterLanguages();

type DiffViewMode = "unified" | "split";

interface RepositoryPullRequestDetailsProps {
  repositoryId: string;
  pullRequestId: string;
}

export function RepositoryPullRequestDetails({
  repositoryId,
  pullRequestId,
}: RepositoryPullRequestDetailsProps) {
  const router = useRouter();
  const [details, setDetails] = useState<GithubPullRequestDetails | null>(null);
  const [files, setFiles] = useState<GithubPullRequestFile[]>([]);
  const [reviews, setReviews] = useState<GithubCodeReviewRun[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [diffViewMode, setDiffViewMode] = useState<DiffViewMode>("unified");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncAbortControllerRef = useRef<AbortController | null>(null);

  const handleSync = async () => {
    if (syncAbortControllerRef.current) {
      syncAbortControllerRef.current.abort();
    }

    const controller = new AbortController();
    syncAbortControllerRef.current = controller;

    setIsSyncing(true);
    setSyncError(null);
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    try {
      await githubApi.syncPullRequest(pullRequestId, controller.signal);
      if (controller.signal.aborted) return;
      window.location.reload();
    } catch (err) {
      if (controller.signal.aborted) return;
      console.error("Failed to sync pull request:", err);

      if (err instanceof GithubApiError && err.status === 404) {
        setError("Pull request was not found.");
        return;
      }

      let friendlyMessage = "Unable to sync pull request. Please try again.";
      if (err instanceof GithubApiError) {
        if (err.status === 403 || err.status === 401) {
          friendlyMessage = "Access denied. Please check your permissions or log in again.";
        } else if (err.status === 429) {
          friendlyMessage = "Too many requests. Please wait a moment and try again.";
        } else if (err.status && err.status >= 500) {
          friendlyMessage = "A server error occurred. Please try again later.";
        } else if (err.message && err.message !== "Internal server error") {
          friendlyMessage = err.message;
        }
      } else if (err instanceof Error) {
        const lowerMessage = err.message.toLowerCase();
        if (lowerMessage.includes("fetch") || lowerMessage.includes("network")) {
          friendlyMessage = "Network error. Please check your internet connection.";
        }
      }

      setSyncError(friendlyMessage);
      syncTimeoutRef.current = setTimeout(() => {
        if (!controller.signal.aborted) {
          setSyncError(null);
        }
      }, 5000);
    } finally {
      if (!controller.signal.aborted) {
        setIsSyncing(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      if (syncAbortControllerRef.current) {
        syncAbortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDetails() {
      setIsLoading(true);
      setError(null);

      try {
        const [detailsResponse, filesResponse, reviewsResponse] =
          await Promise.all([
            githubApi.getPullRequest(pullRequestId),
            githubApi.getPullRequestFiles(pullRequestId),
            githubApi.getPullRequestReviews(pullRequestId),
          ]);

        if (controller.signal.aborted) return;

        setDetails(detailsResponse);
        setFiles(filesResponse.files);
        setReviews(reviewsResponse);
        setSelectedFileId(filesResponse.files[0]?.id ?? null);
      } catch (loadError) {
        if (controller.signal.aborted) return;

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load pull request details.",
        );
        setDetails(null);
        setFiles([]);
        setReviews([]);
        setSelectedFileId(null);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadDetails();

    return () => controller.abort();
  }, [pullRequestId, reloadKey]);

  const selectedFile = files.find((file) => file.id === selectedFileId) ?? null;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Card className="w-full max-w-xl rounded-2xl p-8 text-center hover:translate-y-0">
          <Loader2 className="mx-auto size-7 animate-spin text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">Loading pull request details...</p>
        </Card>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Card className="w-full max-w-xl rounded-2xl p-8 text-center hover:translate-y-0">
          <div className="mx-auto grid size-12 place-items-center rounded-xl bg-destructive/10 text-destructive">
            <AlertCircle className="size-6" aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-lg font-semibold text-foreground">
            Pull request details could not be loaded
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {error ?? "Pull request was not found."}
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()} className="gap-2">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back
            </Button>
            <Button
              type="button"
              onClick={() => setReloadKey((currentKey) => currentKey + 1)}
              className="gap-2"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex h-[calc(100dvh-8rem)] shrink-0 flex-col">
        <div className="shrink-0 border-b border-border/70 bg-card/40 px-5 py-4 backdrop-blur-xl">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <Link
              href={`/repositories/${repositoryId}`}
              replace={true}
              className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to repository
            </Link>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <GitPullRequest className="size-4 text-primary" aria-hidden="true" />
              <span className="font-mono text-xs font-semibold text-muted-foreground">
                #{details.prNumber}
              </span>
              <StateBadge state={details.state} />
              <h1 className="min-w-0 text-lg font-semibold leading-tight text-foreground sm:text-xl">
                {details.title}
              </h1>
            </div>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <span>Opened by {details.author}</span>
              <span className="hidden sm:inline">/</span>
              <span className="font-mono text-xs">
                {details.headBranch} {"->"} {details.baseBranch}
              </span>
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 shrink-0 xl:items-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSync}
              disabled={isSyncing}
              className="gap-2 font-medium transition-all hover:bg-muted/80"
            >
              <RefreshCw className={cn("size-3.5", isSyncing && "animate-spin")} aria-hidden="true" />
              {isSyncing ? "Syncing..." : "Sync PR"}
            </Button>
            {syncError && (
              <span className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="size-3.5" aria-hidden="true" />
                {syncError}
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <CompactMetric
            icon={<GitBranch className="size-4" aria-hidden="true" />}
            value={`${details.headBranch} -> ${details.baseBranch}`}
          />
          <CompactMetric
            icon={<GitCommit className="size-4" aria-hidden="true" />}
            value={`${details.commitCount.toLocaleString()} commits`}
          />
          <CompactMetric
            icon={<FileCode2 className="size-4" aria-hidden="true" />}
            value={`${details.changedFiles.toLocaleString()} files`}
          />
          <CompactMetric
            icon={<Copy className="size-4" aria-hidden="true" />}
            value={shortSha(details.headSha)}
          />
          <CompactMetric
            icon={<Plus className="size-4" aria-hidden="true" />}
            value={`+${details.additions.toLocaleString()}`}
            className="text-emerald-600 dark:text-emerald-300"
          />
          <CompactMetric
            icon={<Minus className="size-4" aria-hidden="true" />}
            value={`-${details.deletions.toLocaleString()}`}
            className="text-destructive"
          />
          <CompactMetric
            icon={<CalendarDays className="size-4" aria-hidden="true" />}
            value={`Created ${formatPullRequestDate(details.createdAt)}`}
          />
          <CompactMetric
            icon={<CalendarDays className="size-4" aria-hidden="true" />}
            value={`Updated ${formatPullRequestDate(details.updatedAt)}`}
          />
        </div>
      </div>

      <main className="grid min-h-0 flex-1 gap-4 overflow-hidden p-4 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-[var(--shadow-surface)]">
          <div className="shrink-0 border-b border-border/60 p-4">
            <h2 className="text-base font-semibold text-foreground">Changed files</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {files.length} {files.length === 1 ? "file" : "files"}
            </p>
          </div>
          <div className="min-h-0 flex-1 overflow-auto">
            {files.map((file) => (
              <button
                key={file.id}
                type="button"
                onClick={() => {
                  setSelectedFileId(file.id);
                }}
                className={cn(
                  "flex w-full flex-col gap-2 border-b border-border/50 p-3 text-left transition-colors hover:bg-muted/40",
                  selectedFileId === file.id && "bg-primary/5 hover:bg-primary/10",
                )}
              >
                <span className="break-all font-mono text-xs font-semibold text-foreground">
                  {file.fileName}
                </span>
                <span className="flex flex-wrap items-center gap-2">
                  <Badge className="tracking-[0.14em]">{file.status}</Badge>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                    +{file.additions.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-destructive">
                    -{file.deletions.toLocaleString()}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-[var(--shadow-surface)]">
          {selectedFile ? (
            <SelectedFileViewer
              file={selectedFile}
              diffViewMode={diffViewMode}
              onDiffViewModeChange={setDiffViewMode}
            />
          ) : (
            <div className="grid min-h-96 place-items-center p-8 text-center">
              <div>
                <FileCode2 className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
                <p className="mt-3 text-sm text-muted-foreground">No files were returned.</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>

      <section className="border-t border-border/70 px-5 py-6">
        <div className="flex items-center gap-2">
          <MessageSquareText className="size-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-foreground">Code Reviews</h2>
        </div>
        <div className="mt-4">
          <CodeReviewsPanel reviews={reviews} />
        </div>
      </section>
    </div>
  );
}

function SelectedFileViewer({
  file,
  diffViewMode,
  onDiffViewModeChange,
}: {
  file: GithubPullRequestFile;
  diffViewMode: DiffViewMode;
  onDiffViewModeChange: (mode: DiffViewMode) => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-border/60 p-4">
        <div className="min-w-0">
          <h2 className="break-all font-mono text-sm font-semibold text-foreground">
            {file.fileName}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {file.status} with +{file.additions.toLocaleString()} / -
            {file.deletions.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4">
        <div>
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-semibold text-foreground">Diff</h3>
            <div className="inline-flex w-fit rounded-lg border border-border/70 bg-background/60 p-1">
              <button
                type="button"
                onClick={() => onDiffViewModeChange("unified")}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                  diffViewMode === "unified"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                Inline
              </button>
              <button
                type="button"
                onClick={() => onDiffViewModeChange("split")}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                  diffViewMode === "split"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                Side by side
              </button>
            </div>
          </div>
          <GitDiffViewer file={file} viewMode={diffViewMode} />
        </div>
      </div>
    </div>
  );
}

function GitDiffViewer({
  file,
  viewMode,
}: {
  file: GithubPullRequestFile;
  viewMode: DiffViewMode;
}) {
  const parsedFile = useMemo(() => parsePatch(file), [file]);
  const language = getLanguageFromFileName(file.fileName);
  const tokens = useMemo(() => {
    if (!parsedFile || !isSupportedDiffLanguage(language)) return null;

    return tokenize(parsedFile.hunks, {
      highlight: true,
      language,
      refractor,
      enhancers: [markEdits(parsedFile.hunks)],
    });
  }, [language, parsedFile]);

  if (!file.patch?.trim()) {
    return (
      <div className="rounded-lg border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
        No patch was returned for this file.
      </div>
    );
  }

  if (!parsedFile) {
    return <CodeViewer fileName={`${file.fileName}.diff`} content={file.patch} />;
  }

  return (
    <div className="codesense-diff overflow-auto rounded-lg border border-border/60">
      <Diff
        viewType={viewMode}
        diffType={parsedFile.type as DiffType}
        hunks={parsedFile.hunks}
        tokens={tokens}
      >
        {(hunks) => hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)}
      </Diff>
    </div>
  );
}

function CodeViewer({ fileName, content }: { fileName: string; content: string }) {
  const language = getLanguageFromFileName(fileName);

  return (
    <div className="codesense-code overflow-hidden rounded-lg border border-border/60">
      <SyntaxHighlighter
        language={language}
        style={oneLight}
        showLineNumbers
        wrapLongLines
        customStyle={{
          margin: 0,
          background: "var(--card)",
          color: "var(--foreground)",
          fontSize: "12px",
          lineHeight: "1.6",
        }}
        lineNumberStyle={{
          color: "var(--muted-foreground)",
          minWidth: "3.5em",
        }}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
}

function CompactMetric({
  icon,
  value,
  className,
}: {
  icon: ReactNode;
  value: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 max-w-full items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-2.5 py-1 font-medium",
        className,
      )}
    >
      <span className={cn("shrink-0 text-muted-foreground", className)}>
        {icon}
      </span>
      <span className="truncate">{value}</span>
    </span>
  );
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

function parsePatch(file: GithubPullRequestFile): FileData | null {
  if (!file.patch?.trim()) return null;

  const escapedName = file.fileName.replaceAll("\\", "/");
  const oldPath = file.status === "added" ? "/dev/null" : `a/${escapedName}`;
  const newPath = file.status === "deleted" ? "/dev/null" : `b/${escapedName}`;
  const patch = [
    `diff --git a/${escapedName} b/${escapedName}`,
    `--- ${oldPath}`,
    `+++ ${newPath}`,
    file.patch,
  ].join("\n");

  return parseDiff(patch, { nearbySequences: "zip" })[0] ?? null;
}

function getLanguageFromFileName(fileName: string) {
  const normalizedName = fileName.replaceAll("\\", "/").split("/").pop()?.toLowerCase() ?? "";
  const extension = normalizedName.split(".").pop();

  if (normalizedName === "dockerfile") return "bash";
  if (normalizedName === "pubspec.yaml" || normalizedName === "pubspec.yml") return "yaml";
  if (normalizedName === "analysis_options.yaml") return "yaml";
  if (normalizedName.endsWith(".gradle") || normalizedName.endsWith(".gradle.kts")) {
    return "groovy";
  }

  switch (extension) {
    case "py":
    case "pyw":
    case "ipynb":
      return "python";
    case "java":
      return "java";
    case "dart":
      return "dart";
    case "kt":
    case "kts":
      return "kotlin";
    case "groovy":
    case "gvy":
      return "groovy";
    case "ts":
      return "typescript";
    case "tsx":
      return "tsx";
    case "js":
      return "javascript";
    case "jsx":
      return "jsx";
    case "json":
      return "json";
    case "html":
    case "xml":
    case "svg":
      return "markup";
    case "yaml":
    case "yml":
      return "yaml";
    case "css":
      return "css";
    case "scss":
      return "css";
    case "md":
      return "markdown";
    case "properties":
      return "properties";
    case "toml":
      return "toml";
    case "sh":
    case "bash":
    case "zsh":
    case "env":
      return "bash";
    default:
      return "text";
  }
}

function isSupportedDiffLanguage(language: string) {
  return [
    "bash",
    "css",
    "dart",
    "groovy",
    "java",
    "javascript",
    "jsx",
    "json",
    "kotlin",
    "markup",
    "properties",
    "python",
    "toml",
    "tsx",
    "typescript",
    "yaml",
  ].includes(language);
}

function registerRefractorLanguages() {
  try {
    refractor.register(bash);
    refractor.register(dart);
    refractor.register(groovy);
    refractor.register(java);
    refractor.register(markup);
    refractor.register(javascript);
    refractor.register(jsx);
    refractor.register(kotlin);
    refractor.register(typescript);
    refractor.register(tsx);
    refractor.register(json);
    refractor.register(properties);
    refractor.register(python);
    refractor.register(toml);
    refractor.register(yaml);
  } catch {
    // Refractor throws when a language is registered twice during hot reload.
  }
}

function registerSyntaxHighlighterLanguages() {
  SyntaxHighlighter.registerLanguage("bash", bashSyntax);
  SyntaxHighlighter.registerLanguage("css", css);
  SyntaxHighlighter.registerLanguage("dart", dartSyntax);
  SyntaxHighlighter.registerLanguage("groovy", groovySyntax);
  SyntaxHighlighter.registerLanguage("java", javaSyntax);
  SyntaxHighlighter.registerLanguage("javascript", jsSyntax);
  SyntaxHighlighter.registerLanguage("jsx", jsxSyntax);
  SyntaxHighlighter.registerLanguage("json", jsonSyntax);
  SyntaxHighlighter.registerLanguage("kotlin", kotlinSyntax);
  SyntaxHighlighter.registerLanguage("markdown", markdownSyntax);
  SyntaxHighlighter.registerLanguage("markup", markupSyntax);
  SyntaxHighlighter.registerLanguage("properties", propertiesSyntax);
  SyntaxHighlighter.registerLanguage("python", pythonSyntax);
  SyntaxHighlighter.registerLanguage("toml", tomlSyntax);
  SyntaxHighlighter.registerLanguage("tsx", tsxSyntax);
  SyntaxHighlighter.registerLanguage("typescript", tsSyntax);
  SyntaxHighlighter.registerLanguage("yaml", yamlSyntax);
}

function formatPullRequestDate(value: string | null) {
  if (!value) return "Not available";

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

function shortSha(value: string) {
  return value ? value.slice(0, 7) : "Unknown";
}
