export interface GithubAccount {
  id: string;
  login: string;
  githubAccountId: string;
  installationId: string;
  accountType: "USER" | "ORGANIZATION" | string;
  createdAt: string;
}

export interface GithubInstallAccount {
  id: string;
  login: string;
  installationId: string;
}

export interface GithubInstallCallbackResponse {
  success: boolean;
  account: GithubInstallAccount;
}

export interface GithubConnectResponse {
  url: string;
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
