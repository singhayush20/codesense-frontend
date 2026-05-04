"use client";

import { useCallback, useMemo, useState } from "react";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { githubApi } from "@/modules/github/api/github.api";
import {
  getStoredGithubAccounts,
  getStoredGithubRepositories,
  getStoredSelectedRepoIds,
  storeGithubAccounts,
  storeGithubRepositories,
  storeSelectedRepoIds,
} from "@/modules/github/store/github.store";
import type {
  GithubAccount,
  GithubAccountResponseDto,
  GithubRepository,
  GithubReposSyncResponse,
} from "@/modules/github/types/github.types";

function toConnectedAccount(account: GithubAccountResponseDto): GithubAccount {
  return {
    id: account.id,
    login: account.loginId,
    loginId: account.loginId,
    githubAccountId: account.githubAccountId,
    installationId: account.installationId,
    accountType: account.accountType,
    createdAt: account.createdAt instanceof Date ? account.createdAt.toISOString() : account.createdAt,
    isConnected: account.isConnected,
  };
}

export function useGithub() {
  const { showSnackbar } = useAuth();
  const [accounts, setAccounts] = useState<GithubAccount[]>(getStoredGithubAccounts);
  const [repositories, setRepositories] = useState<GithubRepository[]>(getStoredGithubRepositories);
  const [persistedSelectedRepositories, setPersistedSelectedRepositories] = useState<
    GithubRepository[]
  >([]);
  const [selectedRepoIds, setSelectedRepoIdsState] = useState<string[]>(getStoredSelectedRepoIds);
  const [hasLoadedAccounts, setHasLoadedAccounts] = useState(false);
  const [hasLoadedSelectedRepositories, setHasLoadedSelectedRepositories] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [isLoadingSelectedRepositories, setIsLoadingSelectedRepositories] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSavingSelection, setIsSavingSelection] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedRepositories = useMemo(
    () => repositories.filter((repository) => selectedRepoIds.includes(repository.repoId)),
    [repositories, selectedRepoIds],
  );

  const setSelectedRepoIds = useCallback((repoIds: string[]) => {
    setSelectedRepoIdsState(repoIds);
    storeSelectedRepoIds(repoIds);
  }, []);

  const loadAccounts = useCallback(async (): Promise<GithubAccount[]> => {
    setIsLoadingAccounts(true);
    setError(null);

    try {
      const nextAccounts = await githubApi.getAccounts();
      setAccounts(nextAccounts);
      storeGithubAccounts(nextAccounts);

      // If no account has an installationId, clear repositories to prevent stale data
      if (!nextAccounts.some((account) => account.installationId)) {
        setRepositories([]);
        storeGithubRepositories([]);
      }

      return nextAccounts;
    } catch {
      const message = "We could not load your connected GitHub accounts.";
      setError(message);
      showSnackbar(message);
      return [];
    } finally {
      setHasLoadedAccounts(true);
      setIsLoadingAccounts(false);
    }
  }, [showSnackbar]);

  const connectGithub = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const url = await githubApi.getOAuthUrl();
      window.location.assign(url);
    } catch {
      const message = "We could not start the GitHub authorization flow.";
      setError(message);
      showSnackbar(message);
      setIsConnecting(false);
    }
  }, [showSnackbar]);

  const completeOAuth = useCallback(
    async (code: string, state: string): Promise<boolean> => {
      setIsConnecting(true);
      setError(null);

      try {
        const response = await githubApi.handleOAuthCallback(code, state);
        const connectedAccount = toConnectedAccount(response);
        setAccounts([connectedAccount]);
        storeGithubAccounts([connectedAccount]);
        return true;
      } catch {
        const message = "We could not complete the GitHub authorization.";
        setError(message);
        showSnackbar(message);
        return false;
      } finally {
        setIsConnecting(false);
      }
    },
    [showSnackbar],
  );

  const configureInstallation = useCallback(
    async (githubAccountId: string) => {
      setIsConnecting(true);
      setError(null);

      try {
        const url = await githubApi.getInstallUrl(githubAccountId);
        window.location.assign(url);
      } catch {
        const message = "We could not start the GitHub installation flow.";
        setError(message);
        showSnackbar(message);
        setIsConnecting(false);
      }
    },
    [showSnackbar],
  );

  const syncRepositories = useCallback(
    async (installationId?: string): Promise<GithubReposSyncResponse | null> => {
      const selectedInstallationId = installationId ?? accounts[0]?.installationId;

      if (!selectedInstallationId) {
        const message = "Configure the GitHub App before syncing repositories.";
        setError(message);
        showSnackbar(message);
        return null;
      }

      setIsSyncing(true);
      setError(null);

      try {
        const syncResponse = await githubApi.syncRepositories(selectedInstallationId);
        setRepositories(syncResponse.repositories);
        storeGithubRepositories(syncResponse.repositories);
        return syncResponse;
      } catch {
        const message =
          "Repository sync failed. Please ensure the GitHub App is installed and try again.";
        setError(message);
        showSnackbar(message);
        return null;
      } finally {
        setIsSyncing(false);
      }
    },
    [accounts, showSnackbar],
  );

  const loadSelectedRepositories = useCallback(async (): Promise<GithubRepository[]> => {
    setIsLoadingSelectedRepositories(true);
    setError(null);

    try {
      const nextSelectedRepositories = await githubApi.getSelectedRepositories();
      setPersistedSelectedRepositories(nextSelectedRepositories);
      return nextSelectedRepositories;
    } catch {
      const message = "We could not load your selected repositories.";
      setError(message);
      showSnackbar(message);
      return [];
    } finally {
      setHasLoadedSelectedRepositories(true);
      setIsLoadingSelectedRepositories(false);
    }
  }, [showSnackbar]);

  const completeInstallation = useCallback(
    async (installationId: string): Promise<boolean> => {
      setIsConnecting(true);
      setError(null);

      try {
        const response = await githubApi.completeInstallation(installationId);

        if (!response.success) {
          throw new Error("Installation was not completed.");
        }

        // Refresh accounts to get the updated installationId
        const nextAccounts = await loadAccounts();
        const connectedAccount = nextAccounts.find((a) => a.id === response.accountId);

        if (connectedAccount && connectedAccount.installationId) {
          const syncResponse = await syncRepositories(connectedAccount.installationId);
          return Boolean(syncResponse);
        }

        return true;
      } catch {
        const message = "We could not finish connecting GitHub.";
        setError(message);
        showSnackbar(message);
        return false;
      } finally {
        setIsConnecting(false);
      }
    },
    [loadAccounts, showSnackbar, syncRepositories],
  );

  const saveSelectedRepositories = useCallback(
    async (repoIds: string[]): Promise<boolean> => {
      setIsSavingSelection(true);
      setError(null);
      setSelectedRepoIds(repoIds);

      try {
        // Map repoIds (GitHub IDs) to internal IDs from the available repositories
        const internalRepoIds = repoIds
          .map((rid) => repositories.find((r) => r.repoId === rid)?.id)
          .filter((id): id is string => Boolean(id));

        const response = await githubApi.saveSelectedRepositories(internalRepoIds);
        const persistedRepoIds = response.repositories.map((repository) => repository.repoId);
        setPersistedSelectedRepositories(response.repositories);
        setSelectedRepoIds(persistedRepoIds);
        showSnackbar("Selected repositories saved.");
        return true;
      } catch {
        const message = "We could not save your selected repositories.";
        setError(message);
        showSnackbar(message);
        return false;
      } finally {
        setIsSavingSelection(false);
      }
    },
    [repositories, setSelectedRepoIds, showSnackbar],
  );

  const unselectRepositories = useCallback(
    async (repoIds: string[]): Promise<boolean> => {
      setIsSavingSelection(true);
      setError(null);

      try {
        // Map repoIds (GitHub IDs) to internal IDs from the currently persisted selected repositories
        const internalRepoIds = repoIds
          .map((rid) => persistedSelectedRepositories.find((r) => r.repoId === rid)?.id)
          .filter((id): id is string => Boolean(id));

        await githubApi.unselectRepositories(internalRepoIds);

        setPersistedSelectedRepositories((prev) =>
          prev.filter((repo) => !repoIds.includes(repo.repoId)),
        );

        setSelectedRepoIdsState((prev) => {
          const next = prev.filter((id) => !repoIds.includes(id));
          storeSelectedRepoIds(next);
          return next;
        });

        showSnackbar("Repositories removed successfully.");
        return true;
      } catch {
        const message = "We could not remove the selected repositories.";
        setError(message);
        showSnackbar(message);
        return false;
      } finally {
        setIsSavingSelection(false);
      }
    },
    [persistedSelectedRepositories, showSnackbar],
  );

  const unlinkAccount = useCallback(
    async (accountId: string): Promise<boolean> => {
      setIsSavingSelection(true);
      setError(null);

      try {
        const response = await githubApi.signout(accountId);
        if (response.success) {
          showSnackbar("GitHub account disconnected successfully.");
          // Refresh the page to reset the app state and show the connect card
          window.location.href = "/dashboard";
          return true;
        }
        return false;
      } catch {
        const message = "We could not disconnect your GitHub account.";
        setError(message);
        showSnackbar(message);
        return false;
      } finally {
        setIsSavingSelection(false);
      }
    },
    [showSnackbar],
  );

  return {
    accounts,
    connectGithub,
    completeOAuth,
    configureInstallation,
    completeInstallation,
    error,
    hasLoadedAccounts,
    hasLoadedSelectedRepositories,
    isConnecting,
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
    selectedRepositories,
    setSelectedRepoIds,
    syncRepositories,
    unselectRepositories,
    unlinkAccount,
  };
}
