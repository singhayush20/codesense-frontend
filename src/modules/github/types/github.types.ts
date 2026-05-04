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
