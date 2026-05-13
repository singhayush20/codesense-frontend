"use client";

import { useEffect, useMemo, useState } from "react";
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
  Minus,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Diff, Hunk, markEdits, parseDiff, tokenize } from "react-diff-view";
import type { DiffType, FileData } from "react-diff-view";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import css from "react-syntax-highlighter/dist/cjs/languages/prism/css";
import jsSyntax from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
import jsxSyntax from "react-syntax-highlighter/dist/cjs/languages/prism/jsx";
import jsonSyntax from "react-syntax-highlighter/dist/cjs/languages/prism/json";
import markdownSyntax from "react-syntax-highlighter/dist/cjs/languages/prism/markdown";
import markupSyntax from "react-syntax-highlighter/dist/cjs/languages/prism/markup";
import tsxSyntax from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
import tsSyntax from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import yamlSyntax from "react-syntax-highlighter/dist/cjs/languages/prism/yaml";
import oneLight from "react-syntax-highlighter/dist/cjs/styles/prism/one-light";
import refractor from "refractor";
import javascript from "refractor/lang/javascript";
import jsx from "refractor/lang/jsx";
import json from "refractor/lang/json";
import markup from "refractor/lang/markup";
import tsx from "refractor/lang/tsx";
import typescript from "refractor/lang/typescript";
import yaml from "refractor/lang/yaml";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { githubApi } from "@/modules/github/api/github.api";
import type {
  GithubPullRequestDetails,
  GithubPullRequestFile,
} from "@/modules/github/types/github.types";
import { PrState } from "@/modules/github/types/github.types";

registerRefractorLanguages();
registerSyntaxHighlighterLanguages();

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
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDetails() {
      setIsLoading(true);
      setError(null);

      try {
        const [detailsResponse, filesResponse] = await Promise.all([
          githubApi.getPullRequest(pullRequestId),
          githubApi.getPullRequestFiles(pullRequestId),
        ]);

        if (controller.signal.aborted) return;

        setDetails(detailsResponse);
        setFiles(filesResponse.files);
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
    <div className="flex h-[calc(100vh-8rem)] min-h-0 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-border/70 bg-card/40 px-5 py-4 backdrop-blur-xl">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <Link
              href={`/repositories/${repositoryId}`}
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
  );
}

function SelectedFileViewer({
  file,
}: {
  file: GithubPullRequestFile;
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
          <h3 className="mb-3 text-sm font-semibold text-foreground">Diff</h3>
          <GitDiffViewer file={file} />
        </div>
      </div>
    </div>
  );
}

function GitDiffViewer({ file }: { file: GithubPullRequestFile }) {
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
        viewType="unified"
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
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
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
    case "md":
      return "markdown";
    default:
      return "text";
  }
}

function isSupportedDiffLanguage(language: string): language is "typescript" | "tsx" | "javascript" | "jsx" | "json" | "markup" | "yaml" {
  return ["typescript", "tsx", "javascript", "jsx", "json", "markup", "yaml"].includes(language);
}

function registerRefractorLanguages() {
  try {
    refractor.register(markup);
    refractor.register(javascript);
    refractor.register(jsx);
    refractor.register(typescript);
    refractor.register(tsx);
    refractor.register(json);
    refractor.register(yaml);
  } catch {
    // Refractor throws when a language is registered twice during hot reload.
  }
}

function registerSyntaxHighlighterLanguages() {
  SyntaxHighlighter.registerLanguage("css", css);
  SyntaxHighlighter.registerLanguage("javascript", jsSyntax);
  SyntaxHighlighter.registerLanguage("jsx", jsxSyntax);
  SyntaxHighlighter.registerLanguage("json", jsonSyntax);
  SyntaxHighlighter.registerLanguage("markdown", markdownSyntax);
  SyntaxHighlighter.registerLanguage("markup", markupSyntax);
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
