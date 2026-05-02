"use client";

import { CheckCircle2, GitBranch, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useGithub } from "@/modules/github/hooks/useGithub";

const benefits = [
  {
    title: "Read-only access to repositories and pull requests",
    description: "We analyze metadata and diffs without modifying your codebase.",
    icon: CheckCircle2,
  },
  {
    title: "No write access without explicit action",
    description: "Status checks and comments are only enabled via project settings.",
    icon: ShieldCheck,
  },
  {
    title: "Secure installation via GitHub",
    description: "Granular permissions managed entirely through GitHub's app flow.",
    icon: LockKeyhole,
  },
] as const;

export function ConnectGithubCard() {
  const { connectGithub, error, isConnecting } = useGithub();

  return (
    <Card className="mx-auto w-full max-w-xl rounded-3xl border-white/10 bg-[#1d2944] p-8 text-white shadow-[0_28px_90px_-42px_rgba(0,0,0,0.65)] hover:translate-y-0 hover:bg-[#1d2944] dark:bg-[#1d2944] sm:p-10">
      <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-white/12 text-white shadow-[0_18px_50px_-24px_rgba(147,160,255,0.95)]">
        <GitBranch className="size-8" aria-hidden="true" />
      </div>

      <div className="mt-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Connect GitHub</h1>
        <p className="mx-auto mt-4 max-w-md text-sm font-medium leading-6 text-slate-300">
          Install the CodeSense GitHub App to securely access your repositories and analyze pull requests with deep architectural insight.
        </p>
      </div>

      <div className="mt-8 rounded-lg bg-[#111b34] p-5">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;

          return (
            <div
              key={benefit.title}
              className="flex gap-4 border-slate-700/60 py-4 first:pt-0 last:pb-0 [&:not(:last-child)]:border-b"
            >
              <Icon className="mt-0.5 size-5 shrink-0 text-emerald-300" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-white">{benefit.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">{benefit.description}</p>
              </div>
              <span className="sr-only">Benefit {index + 1}</span>
            </div>
          );
        })}
      </div>

      {error ? (
        <p role="alert" className="mt-5 text-center text-sm font-medium text-rose-200">
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col items-center gap-5">
        <Button
          type="button"
          size="lg"
          onClick={() => void connectGithub()}
          disabled={isConnecting}
          className="h-12 min-w-52 gap-2 rounded-xl bg-white px-7 text-xs font-bold uppercase tracking-[0.22em] text-indigo-700 shadow-[0_18px_45px_-22px_rgba(129,140,248,0.95)] hover:bg-indigo-50"
        >
          <GitBranch className="size-4" aria-hidden="true" />
          {isConnecting ? "Connecting..." : "Connect GitHub"}
        </Button>
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">
          Enterprise grade security protocols active
        </p>
      </div>
    </Card>
  );
}
