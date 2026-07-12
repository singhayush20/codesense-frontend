"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ConnectingState } from "@/modules/github/components/ConnectingState";
import { ConnectGithubCard } from "@/modules/github/components/ConnectGithubCard";
import { DashboardStats } from "@/modules/dashboard/components/DashboardStats";
import { useGithub } from "@/modules/github/hooks/useGithub";

function getValidInstallationId(value: string | null): string | null {
  return value && /^\d+$/.test(value) ? value : null;
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const hasRequestedAccounts = useRef(false);
  const { accounts, hasLoadedAccounts, isLoadingAccounts, loadAccounts } = useGithub();
  const installationId = getValidInstallationId(searchParams.get("installation_id"));
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  useEffect(() => {
    if (installationId || (code && state)) {
      return;
    }

    if (hasRequestedAccounts.current) {
      return;
    }

    hasRequestedAccounts.current = true;
    void loadAccounts();
  }, [installationId, code, state, loadAccounts]);

  if (installationId || (code && state)) {
    return <ConnectingState installationId={installationId} code={code} state={state} />;
  }

  if (!hasLoadedAccounts || isLoadingAccounts) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <div className="h-64 animate-pulse rounded-[2rem] border border-border/70 bg-card/70" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-44 animate-pulse rounded-3xl border border-border/70 bg-card/70" />
          <div className="h-44 animate-pulse rounded-3xl border border-border/70 bg-card/70" />
        </div>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-10rem)] w-full items-center justify-center">
        <ConnectGithubCard />
      </div>
    );
  }

  return <DashboardStats />;
}
