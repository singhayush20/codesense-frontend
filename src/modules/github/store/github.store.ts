"use client";

import type { GithubAccount, GithubRepository } from "@/modules/github/types/github.types";

const ACCOUNTS_KEY = "codesense.github.accounts";
const REPOSITORIES_KEY = "codesense.github.repositories";
const SELECTED_REPO_IDS_KEY = "codesense.github.selectedRepoIds";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getStoredGithubAccounts(): GithubAccount[] {
  return readJson<GithubAccount[]>(ACCOUNTS_KEY, []);
}

export function storeGithubAccounts(accounts: GithubAccount[]): void {
  writeJson(ACCOUNTS_KEY, accounts);
}

export function getStoredGithubRepositories(): GithubRepository[] {
  return readJson<GithubRepository[]>(REPOSITORIES_KEY, []);
}

export function storeGithubRepositories(repositories: GithubRepository[]): void {
  writeJson(REPOSITORIES_KEY, repositories);
}

export function getStoredSelectedRepoIds(): string[] {
  return readJson<string[]>(SELECTED_REPO_IDS_KEY, []);
}

export function storeSelectedRepoIds(repoIds: string[]): void {
  writeJson(SELECTED_REPO_IDS_KEY, repoIds);
}
