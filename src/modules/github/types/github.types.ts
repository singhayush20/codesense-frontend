export interface GithubAccount {
  id: string;
  login: string;
  loginId: string;
  githubAccountId: string;
  installationId?: string | null;
  accountType: "USER" | "ORGANIZATION" | string;
  createdAt: string;
  isConnected?: boolean;
}

export interface GithubAccountResponseDto {
  id: string;
  githubAccountId: string;
  loginId: string;
  accountType: string;
  isConnected: boolean;
  createdAt: Date | string;
  installationId?: string | null;
}

export interface GithubOAuthUrlResponse {
  url: string;
}

export interface GithubInstallUrlResponse {
  url: string;
}

export interface HandleInstallationResponseDto {
  success: boolean;
  installationId: string;
  accountId: string;
}

export interface GithubRepositoryPermissions {
  pull: boolean;
  push: boolean;
  admin: boolean;
  triage: boolean;
  maintain: boolean;
}

export interface GithubRepository {
  id: string;
  repoId: string;
  name: string;
  fullName: string;
  isPrivate: boolean;
  permissions?: GithubRepositoryPermissions;
}

export interface GithubReposSyncRequest {
  accountId: string;
}

export interface GithubReposSyncResponse {
  total: number;
  repositories: GithubRepository[];
}

export interface GithubReposSelectRequest {
  repoIds: string[];
}

export interface GithubReposSelectResponse {
  count: number;
  repositories: GithubRepository[];
}

export enum PrState {
  OPEN = "open",
  CLOSED = "closed",
  MERGED = "merged",
}

export interface GithubPullRequest {
  id: string;
  prNumber: number;
  title: string;
  author: string;
  state: PrState;
  changedFiles: number;
  additions: number;
  deletions: number;
  createdAt: string;
  updatedAt: string;
}

export interface GithubPullRequestDetails extends GithubPullRequest {
  baseBranch: string;
  headBranch: string;
  headSha: string;
  commitCount: number;
  mergedAt: string | null;
}

export interface GithubPullRequestFile {
  id: string;
  fileName: string;
  status: string;
  additions: number;
  deletions: number;
  patch?: string;
}

export interface GithubPullRequestFilesResponse {
  files: GithubPullRequestFile[];
}

export interface GithubPullRequestFileContent {
  fileId: string;
  content: string;
  sha: string;
}

export enum PullRequestReviewStatus {
  SUCCESS = "success",
  FAILED = "failed",
  IN_PROGRESS = "in_progress",
  CANCELLED = "cancelled",
  SUPERSEDED = "superseded",
}

export interface GithubCodeReviewComment {
  filePath: string;
  startLine: number;
  endLine: number;
  severity: string;
  category: string;
  message: string;
}

export interface GithubCodeReviewRun {
  runId: string;
  provider: string;
  pullRequestId: string;
  reviewStatus: PullRequestReviewStatus;
  totalInputTokens: number | null;
  totalOutputTokens: number | null;
  totalTokens: number | null;
  summary: string | null;
  headSha: string | null;
  baseSha: string | null;
  comments: GithubCodeReviewComment[];
}

export interface GithubPullRequestsQuery {
  page?: number;
  limit?: number;
  repositoryId?: string;
  author?: string;
  search?: string;
  state?: PrState;
}

export interface GithubPullRequestsResponse {
  items: GithubPullRequest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
