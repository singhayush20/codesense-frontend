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
  GithubInstallAccount,
  GithubRepository,
  GithubReposSyncResponse,
} from "@/modules/github/types/github.types";

function toConnectedAccount(account: GithubInstallAccount): GithubAccount {
  return {
    id: account.id,
    login: account.login,
    githubAccountId: account.id,
    installationId: account.installationId,
    accountType: "USER",
    createdAt: new Date().toISOString(),
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
      const url = await githubApi.getConnectUrl();
      window.location.assign(url);
    } catch {
      const message = "We could not start the GitHub connection flow.";
      setError(message);
      showSnackbar(message);
      setIsConnecting(false);
    }
  }, [showSnackbar]);

  const syncRepositories = useCallback(
    async (accountId?: string): Promise<GithubReposSyncResponse | null> => {
      const selectedAccountId = accountId ?? accounts[0]?.id;

      if (!selectedAccountId) {
        const message = "Connect a GitHub account before syncing repositories.";
        setError(message);
        showSnackbar(message);
        return null;
      }

      setIsSyncing(true);
      setError(null);

      try {
        const syncResponse = await githubApi.syncRepositories(selectedAccountId);
        setRepositories(syncResponse.repositories);
        storeGithubRepositories(syncResponse.repositories);
        return syncResponse;
      } catch {
        const message = "Repository sync failed. Please try again.";
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

        const connectedAccount = toConnectedAccount(response.account);
        setAccounts([connectedAccount]);
        storeGithubAccounts([connectedAccount]);

        const syncResponse = await syncRepositories(connectedAccount.id);
        return Boolean(syncResponse);
      } catch {
        const message = "We could not finish connecting GitHub.";
        setError(message);
        showSnackbar(message);
        return false;
      } finally {
        setIsConnecting(false);
      }
    },
    [showSnackbar, syncRepositories],
  );

  const saveSelectedRepositories = useCallback(
    async (repoIds: string[]): Promise<boolean> => {
      setIsSavingSelection(true);
      setError(null);
      setSelectedRepoIds(repoIds);

      try {
        const response = await githubApi.saveSelectedRepositories(repoIds);
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
    [setSelectedRepoIds, showSnackbar],
  );

  const unselectRepositories = useCallback(
    async (repoIds: string[]): Promise<boolean> => {
      setIsSavingSelection(true);
      setError(null);

      try {
        await githubApi.unselectRepositories(repoIds);

        // The API returns the unselected repositories, but we need the remaining ones.
        // Instead of relying on the response which might be confusing, we filter them out
        // or re-load them. Since we want to be efficient, let's filter them locally.
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
    [showSnackbar],
  );

  return {
    accounts,
    connectGithub,
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
  };
}
