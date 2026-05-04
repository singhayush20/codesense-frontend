"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { routes } from "@/config/routes";
import { RepoSelectionTable } from "@/modules/github/components/RepoSelectionTable";
import { useGithub } from "@/modules/github/hooks/useGithub";

export default function RepositoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedOnly = searchParams.get("view") === "selected";
  const loadedViewRef = useRef<string | null>(null);
  const {
    accounts,
    error,
    hasLoadedAccounts,
    hasLoadedSelectedRepositories,
    isLoadingAccounts,
    isLoadingSelectedRepositories,
    isSavingSelection,
    isSyncing,
    loadAccounts,
    loadSelectedRepositories,
    persistedSelectedRepositories,
    repositories,
    saveSelectedRepositories,
    selectedRepoIds,
    setSelectedRepoIds,
    syncRepositories,
    unselectRepositories,
  } = useGithub();

  useEffect(() => {
    const currentView = selectedOnly ? "selected" : "all";

    if (loadedViewRef.current === currentView) {
      return;
    }

    loadedViewRef.current = currentView;

    void loadAccounts().then((loadedAccounts) => {
      const account = loadedAccounts[0];

      if (!account) {
        return;
      }

      if (selectedOnly) {
        void loadSelectedRepositories();
        return;
      }

      void syncRepositories(account.installationId ?? undefined);
      void loadSelectedRepositories().then((selectedRepositories) => {
        setSelectedRepoIds(selectedRepositories.map((repository) => repository.repoId));
      });
    });
  }, [
    loadAccounts,
    loadSelectedRepositories,
    selectedOnly,
    setSelectedRepoIds,
    syncRepositories,
  ]);

  const displayedRepositories = selectedOnly ? persistedSelectedRepositories : repositories;
  const displayedSelectedRepoIds = selectedOnly
    ? persistedSelectedRepositories.map((repository) => repository.repoId)
    : selectedRepoIds;

  const handleSave = async (repoIds: string[]) => {
    await saveSelectedRepositories(repoIds);
  };

  const handleSync = async () => {
    if (selectedOnly) {
      await loadSelectedRepositories();
      return;
    }

    const account = accounts[0];

    if (account) {
      await syncRepositories(account.installationId ?? undefined);
    }
  };

  if (!hasLoadedAccounts || isLoadingAccounts) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <div className="h-28 animate-pulse rounded-[2rem] border border-border/70 bg-card/70" />
        <div className="h-[34rem] animate-pulse rounded-2xl border border-border/70 bg-card/70" />
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <Card className="mx-auto w-full max-w-4xl rounded-2xl hover:translate-y-0">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          GitHub repositories
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">
          No GitHub account connected
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Connect GitHub from the dashboard before choosing repositories.
        </p>
      </Card>
    );
  }

  const account = accounts[0];

  if (account && !account.installationId) {
    return (
      <Card className="mx-auto w-full max-w-4xl rounded-2xl p-8 hover:translate-y-0">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            GitHub integration
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
            GitHub App not configured
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">
            Your account is authorized, but the CodeSense GitHub App needs to be configured to access your repositories.
          </p>
          <div className="mt-8">
            <Button
              type="button"
              onClick={() => router.push(routes.app.settings)}
              className="h-11 min-w-48 gap-2 rounded-xl"
            >
              Go to Settings
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (
    !hasLoadedSelectedRepositories ||
    isLoadingSelectedRepositories ||
    (!selectedOnly && isSyncing && repositories.length === 0)
  ) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <div className="h-28 animate-pulse rounded-[2rem] border border-border/70 bg-card/70" />
        <div className="h-[34rem] animate-pulse rounded-2xl border border-border/70 bg-card/70" />
      </div>
    );
  }

  return (
    <>
      {error ? (
        <Card className="mx-auto mb-6 flex w-full max-w-7xl flex-col gap-4 rounded-2xl p-4 hover:translate-y-0 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button type="button" variant="outline" onClick={() => void handleSync()}>
            {selectedOnly ? "Retry load" : "Retry sync"}
          </Button>
        </Card>
      ) : null}
      <RepoSelectionTable
        repositories={displayedRepositories}
        selectedRepoIds={displayedSelectedRepoIds}
        selectedOnly={selectedOnly}
        isReadOnly={selectedOnly}
        lockedRepoIds={
          selectedOnly
            ? []
            : persistedSelectedRepositories.map((repository) => repository.repoId)
        }
        showDisconnectAction={selectedOnly}
        isSaving={isSavingSelection}
        isSyncing={isSyncing}
        onSave={selectedOnly ? undefined : handleSave}
        onUnselect={unselectRepositories}
        onSelectedRepoIdsChange={setSelectedRepoIds}
        onSync={selectedOnly ? undefined : handleSync}
      />
    </>
  );
}
