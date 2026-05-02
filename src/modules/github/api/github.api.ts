"use client";

import { apiFetch } from "@/lib/api";
import type {
  GithubAccount,
  GithubConnectResponse,
  GithubInstallCallbackResponse,
  GithubRepository,
  GithubReposSelectResponse,
  GithubReposSyncRequest,
  GithubReposSyncResponse,
} from "@/modules/github/types/github.types";

const GITHUB_API_BASE = "/api/v1/github";

class GithubApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "GithubApiError";
  }
}

async function parseJsonResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      body && typeof body === "object" && "message" in body && typeof body.message === "string"
        ? body.message
        : fallbackMessage;

    throw new GithubApiError(message, response.status);
  }

  return body as T;
}

export const githubApi = {
  async getConnectUrl(): Promise<string> {
    const response = await apiFetch(`${GITHUB_API_BASE}/connect`);
    const data = await parseJsonResponse<GithubConnectResponse>(
      response,
      "Unable to start the GitHub connection flow.",
    );

    if (!data.url) {
      throw new GithubApiError("GitHub did not return a redirect URL.");
    }

    return data.url;
  },

  async completeInstallation(installationId: string): Promise<GithubInstallCallbackResponse> {
    const searchParams = new URLSearchParams({ installation_id: installationId });
    const response = await apiFetch(`${GITHUB_API_BASE}/install/callback?${searchParams}`);

    console.log("GitHub installation callback response:", response);

    return parseJsonResponse<GithubInstallCallbackResponse>(
      response,
      "Unable to complete the GitHub installation.",
    );
  },

  async syncRepositories(accountId: string): Promise<GithubReposSyncResponse> {
    const body: GithubReposSyncRequest = { accountId };
    const response = await apiFetch(`${GITHUB_API_BASE}/repos/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return parseJsonResponse<GithubReposSyncResponse>(
      response,
      "Unable to sync repositories.",
    );
  },

  async getAccounts(): Promise<GithubAccount[]> {
    const response = await apiFetch(`${GITHUB_API_BASE}/accounts`);

    return parseJsonResponse<GithubAccount[]>(response, "Unable to load GitHub accounts.");
  },

  async saveSelectedRepositories(repoIds: string[]): Promise<GithubReposSelectResponse> {
    const response = await apiFetch(`${GITHUB_API_BASE}/repos/select`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repoIds }),
    });

    return parseJsonResponse<GithubReposSelectResponse>(
      response,
      "Unable to save selected repositories.",
    );
  },

  async unselectRepositories(repoIds: string[]): Promise<GithubReposSelectResponse> {
    const response = await apiFetch(`${GITHUB_API_BASE}/repos/unselect`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repoIds }),
    });

    return parseJsonResponse<GithubReposSelectResponse>(
      response,
      "Unable to unselect repositories.",
    );
  },

  async getSelectedRepositories(): Promise<GithubRepository[]> {
    const response = await apiFetch(`${GITHUB_API_BASE}/repos/selected`);

    return parseJsonResponse<GithubRepository[]>(
      response,
      "Unable to load selected repositories.",
    );
  },
};

export { GithubApiError };
