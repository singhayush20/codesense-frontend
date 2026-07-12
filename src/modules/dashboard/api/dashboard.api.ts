"use client";

import { apiFetch } from "@/lib/api";

export interface PullRequestsByState {
  state: string;
  count: number;
}

export interface ReviewsByStatus {
  status: string;
  count: number;
}

export interface ReviewsByProvider {
  provider: string;
  count: number;
}

export interface DashboardStats {
  totalRepositories: number;
  totalPullRequests: number;
  pullRequestsByState: PullRequestsByState[];
  totalReviewsGenerated: number;
  reviewsByStatus: ReviewsByStatus[];
  totalTokensConsumed: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalSelectedRepos: number;
  totalLlmConfigs: number;
  averageTokensPerReview: number;
  averageInputTokensPerReview: number;
  averageOutputTokensPerReview: number;
  reviewsByProvider: ReviewsByProvider[];
  averageFilesPerPr: number;
  averageReviewTimeMs: number;
}

class DashboardApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "DashboardApiError";
  }
}

async function parseJsonResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      body && typeof body === "object" && "message" in body && typeof body.message === "string"
        ? body.message
        : fallbackMessage;

    throw new DashboardApiError(message, response.status);
  }

  return body as T;
}

export const dashboardApi = {
  async getStats(): Promise<DashboardStats> {
    const response = await apiFetch("/api/v1/dashboard/stats");

    return parseJsonResponse<DashboardStats>(
      response,
      "Unable to load dashboard statistics.",
    );
  },
};

export { DashboardApiError };
