"use client";

import { useEffect, useRef, useState } from "react";
import { LogOut, RefreshCw, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { UnlinkConfirmDialog } from "@/modules/github/components/UnlinkConfirmDialog";
import { useGithub } from "@/modules/github/hooks/useGithub";
import { LLMProviderTab } from "@/modules/llm/components/LLMProviderTab";

type TabType = "github" | "llm";

export default function SettingsPage() {
  const hasRequestedAccounts = useRef(false);
  const [isSignoutDialogOpen, setIsSignoutDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("github");
  const {
    accounts,
    error,
    hasLoadedAccounts,
    isLoadingAccounts,
    isSyncing,
    isSavingSelection,
    loadAccounts,
    repositories,
    selectedRepoIds,
    syncRepositories,
    unlinkAccount,
    configureInstallation,
  } = useGithub();

  useEffect(() => {
    if (hasRequestedAccounts.current) {
      return;
    }

    hasRequestedAccounts.current = true;
    void loadAccounts();
  }, [loadAccounts]);

  const handleSync = async () => {
    const account = accounts[0];

    if (account) {
      await syncRepositories(account.installationId ?? undefined);
    }
  };

  const handleSignout = async () => {
    const account = accounts[0];
    if (account) {
      const success = await unlinkAccount(account.id);
      if (success) {
        setIsSignoutDialogOpen(false);
      }
    }
  };

  const handleConfigureApp = async () => {
    const account = accounts[0];
    if (account) {
      await configureInstallation(account.githubAccountId);
    }
  };

  if (!hasLoadedAccounts || isLoadingAccounts) {
    return (
      <div className="mx-auto h-80 w-full max-w-4xl animate-pulse rounded-[2rem] border border-border/70 bg-card/70" />
    );
  }

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: "github", label: "Github Account" },
    { id: "llm", label: "LLM Provider Settings" },

  ];

  return (
    <>
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {/* Tab Bar */}
        <div className="rounded-2xl border border-border/70 bg-card/80 p-1 backdrop-blur-xl">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "github" && (
          <>
            {accounts.length === 0 ? (
              <Card className="mx-auto w-full rounded-2xl hover:translate-y-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  GitHub settings
                </p>
                <h1 className="mt-3 text-2xl font-semibold text-foreground">
                  No GitHub account connected
                </h1>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Connect GitHub from the dashboard before managing repository settings.
                </p>
              </Card>
            ) : (
              <>
                {error ? (
                  <Card className="rounded-2xl p-4 text-sm text-muted-foreground hover:translate-y-0">
                    {error}
                  </Card>
                ) : null}

                <Card className="rounded-2xl hover:translate-y-0">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                        Connected account
                      </p>
                      <h2 className="mt-3 text-2xl font-semibold text-foreground">
                        {accounts[0].login}
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Login ID: {accounts[0].loginId}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        GitHub ID: {accounts[0].githubAccountId}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2"
                        onClick={() => void handleConfigureApp()}
                      >
                        <Settings2 className="size-4" aria-hidden="true" />
                        Configure GitHub App
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        className="gap-2"
                        onClick={() => setIsSignoutDialogOpen(true)}
                      >
                        <LogOut className="size-4" aria-hidden="true" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="rounded-2xl hover:translate-y-0">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                        Repository sync
                      </p>
                      <h2 className="mt-3 text-2xl font-semibold text-foreground">
                        {repositories.length} repositories found
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Tools are active on {selectedRepoIds.length} repositories.
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => void handleSync()}
                      disabled={isSyncing}
                      className="gap-2"
                    >
                      <RefreshCw className="size-4" aria-hidden="true" />
                      {isSyncing ? "Syncing..." : "Sync Repositories"}
                    </Button>
                  </div>
                </Card>
              </>
            )}
          </>
        )}

        {/* LLM Provider Settings Tab */}
        {activeTab === "llm" && (
          <LLMProviderTab />
        )}


      </section>

      <UnlinkConfirmDialog
        isOpen={isSignoutDialogOpen}
        onClose={() => setIsSignoutDialogOpen(false)}
        onConfirm={handleSignout}
        isUnlinking={isSavingSelection}
      />
    </>
  );
}
