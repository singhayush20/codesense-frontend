"use client";

import { apiFetch } from "@/lib/api";
import type {
  GithubAccount,
  GithubAccountResponseDto,
  GithubInstallUrlResponse,
  GithubPullRequestDetails,
  GithubPullRequestFileContent,
  GithubPullRequestFilesResponse,
  GithubPullRequestsQuery,
  GithubPullRequestsResponse,
  GithubOAuthUrlResponse,
  GithubRepository,
  GithubReposSelectResponse,
  GithubReposSyncResponse,
  HandleInstallationResponseDto,
} from "@/modules/github/types/github.types";

const GITHUB_API_BASE = "/api/v1/github";
const PULL_REQUESTS_API_BASE = "/api/v1/pull-requests";

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

function isObjectWithStringId(value: unknown): value is { id: string } {
  return (
    value !== null &&
    typeof value === "object" &&
    "id" in value &&
    typeof value.id === "string"
  );
}

function isObjectWithStringFileId(value: unknown): value is { fileId: string } {
  return (
    value !== null &&
    typeof value === "object" &&
    "fileId" in value &&
    typeof value.fileId === "string"
  );
}

export const githubApi = {
  async getOAuthUrl(): Promise<string> {
    const response = await apiFetch(`${GITHUB_API_BASE}/oauth/url`);
    const data = await parseJsonResponse<GithubOAuthUrlResponse>(
      response,
      "Unable to start the GitHub OAuth flow.",
    );

    if (!data.url) {
      throw new GithubApiError("GitHub did not return an OAuth redirect URL.");
    }

    return data.url;
  },

  async handleOAuthCallback(code: string, state: string): Promise<GithubAccountResponseDto> {
    const searchParams = new URLSearchParams({ code, state });
    const response = await apiFetch(`${GITHUB_API_BASE}/oauth/callback?${searchParams}`);

    return parseJsonResponse<GithubAccountResponseDto>(
      response,
      "Unable to complete the GitHub OAuth authorization.",
    );
  },

  async getInstallUrl(accountId: string): Promise<string> {
    const searchParams = new URLSearchParams({ accountId });
    const response = await apiFetch(`${GITHUB_API_BASE}/install/url?${searchParams}`);
    const data = await parseJsonResponse<GithubInstallUrlResponse>(
      response,
      "Unable to get the GitHub installation URL.",
    );

    if (!data.url) {
      throw new GithubApiError("GitHub did not return an installation URL.");
    }

    return data.url;
  },

  async completeInstallation(installationId: string): Promise<HandleInstallationResponseDto> {
    const searchParams = new URLSearchParams({ installation_id: installationId });
    const response = await apiFetch(`${GITHUB_API_BASE}/install/callback?${searchParams}`);

    return parseJsonResponse<HandleInstallationResponseDto>(
      response,
      "Unable to complete the GitHub installation.",
    );
  },

  async syncRepositories(installationId: string): Promise<GithubReposSyncResponse> {
    const response = await apiFetch(`${GITHUB_API_BASE}/repos/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ installationId }),
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

  async getPullRequests(
    query: GithubPullRequestsQuery,
  ): Promise<GithubPullRequestsResponse> {
    const searchParams = new URLSearchParams();

    if (query.page) searchParams.set("page", String(query.page));
    if (query.limit) searchParams.set("limit", String(query.limit));
    if (query.repositoryId) searchParams.set("repositoryId", query.repositoryId);
    if (query.author?.trim()) searchParams.set("author", query.author.trim());
    if (query.search?.trim()) searchParams.set("search", query.search.trim());
    if (query.state) searchParams.set("state", query.state);

    const response = await apiFetch(`${PULL_REQUESTS_API_BASE}?${searchParams}`);

    return parseJsonResponse<GithubPullRequestsResponse>(
      response,
      "Unable to load pull requests.",
    );
  },

  async getPullRequest(id: string): Promise<GithubPullRequestDetails> {
    const response = await apiFetch(`${PULL_REQUESTS_API_BASE}/${id}`);
    const data = await parseJsonResponse<unknown>(
      response,
      "Unable to load pull request details.",
    );

    if (!isObjectWithStringId(data)) {
      throw new GithubApiError("Pull request was not found.", response.status);
    }

    return data as GithubPullRequestDetails;
  },

  async getPullRequestFiles(id: string): Promise<GithubPullRequestFilesResponse> {
    const response = await apiFetch(`${PULL_REQUESTS_API_BASE}/${id}/files`);

    return parseJsonResponse<GithubPullRequestFilesResponse>(
      response,
      "Unable to load pull request files.",
    );
  },

  async getPullRequestFileContent(fileId: string): Promise<GithubPullRequestFileContent> {
    const response = await apiFetch(`${PULL_REQUESTS_API_BASE}/files/${fileId}/content`);
    const data = await parseJsonResponse<unknown>(
      response,
      "Unable to load file content.",
    );

    if (!isObjectWithStringFileId(data)) {
      throw new GithubApiError("File content was not found.", response.status);
    }

    return data as GithubPullRequestFileContent;
  },

  async signout(accountId: string): Promise<{ success: boolean }> {
    const response = await apiFetch(`${GITHUB_API_BASE}/accounts/signout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accountId }),
    });

    return parseJsonResponse<{ success: boolean }>(response, "Unable to sign out of GitHub.");
  },
};

export { GithubApiError };
