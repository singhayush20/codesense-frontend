"use client";

import { routes } from "@/config/routes";
import { dispatchAuthSessionExpired } from "@/modules/auth/events";
import { getAuthNoticeMessage } from "@/modules/auth/utils";

const SESSION_EXPIRED_MESSAGE =
  getAuthNoticeMessage("session_expired") ?? "Your session expired. Please log in again.";

let refreshPromise: Promise<boolean> | null = null;

export interface ApiFetchOptions extends RequestInit {
  skipAuthRefresh?: boolean;
}

export async function apiFetch(path: string, init: ApiFetchOptions = {}): Promise<Response> {
  const response = await issueBackendRequest(path, init);

  if (init.skipAuthRefresh || response.status !== 401) {
    return response;
  }

  const refreshSucceeded = await refreshSession();

  if (!refreshSucceeded) {
    return response;
  }

  return issueBackendRequest(path, init);
}

async function issueBackendRequest(path: string, init: ApiFetchOptions): Promise<Response> {
  const requestInit = { ...init };

  Reflect.deleteProperty(requestInit, "skipAuthRefresh");

  return fetch(`${routes.api.backend}${normalizeBackendPath(path)}`, {
    ...requestInit,
    cache: "no-store",
    credentials: "same-origin",
  });
}

function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

async function performRefresh(): Promise<boolean> {
  try {
    const response = await fetch(routes.auth.refresh, {
      method: "POST",
      cache: "no-store",
      credentials: "same-origin",
    });

    if (response.ok) {
      return true;
    }
  } catch {
    dispatchAuthSessionExpired(SESSION_EXPIRED_MESSAGE);
    return false;
  }

  dispatchAuthSessionExpired(SESSION_EXPIRED_MESSAGE);
  return false;
}

function normalizeBackendPath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}
