import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthEnv } from "@/config/env";
import {
  AUTH_TOKEN_COOKIE_NAME,
  GOOGLE_OAUTH_STATE_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from "@/modules/auth/utils";

const AUTH_COOKIE_NAMES = [AUTH_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME] as const;
const LEGACY_AUTH_COOKIE_NAMES = [
  "codesense_auth_token_type",
  "codesense_access_token_expires_at",
] as const;
const AUTH_REQUEST_HEADERS = {
  Accept: "application/json",
};

export async function exchangeGoogleCodeForSession(
  code: string,
): Promise<Response | null> {
  const { apiUrl } = getAuthEnv();
  const oauthExchangeUrl = new URL("/api/v1/auth/oauth2/google", apiUrl);

  oauthExchangeUrl.searchParams.set("code", code);

  const response = await fetch(oauthExchangeUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  return response.ok ? response : null;
}

export async function refreshBackendSession(request: NextRequest): Promise<Response | null> {
  const { apiUrl } = getAuthEnv();
  const refreshUrl = new URL("/api/v1/auth/refresh", apiUrl);

  const response = await fetch(refreshUrl, {
    method: "POST",
    headers: getBackendAuthHeaders(request),
    cache: "no-store",
  });

  return response.ok ? response : null;
}

export async function logoutBackendSession(request: NextRequest): Promise<Response | null> {
  const { apiUrl } = getAuthEnv();
  const logoutUrl = new URL("/api/v1/auth/logout", apiUrl);

  try {
    return await fetch(logoutUrl, {
      method: "POST",
      headers: getBackendAuthHeaders(request),
      cache: "no-store",
    });
  } catch {
    return null;
  }
}

export function appendSetCookieHeaders(targetHeaders: Headers, sourceHeaders: Headers): void {
  for (const cookieHeader of getSetCookieHeaders(sourceHeaders)) {
    targetHeaders.append("Set-Cookie", cookieHeader);
  }
}

export function clearAuthCookies(response: NextResponse) {
  for (const cookieName of [...AUTH_COOKIE_NAMES, ...LEGACY_AUTH_COOKIE_NAMES]) {
    response.cookies.delete(cookieName);
  }

  response.cookies.delete(GOOGLE_OAUTH_STATE_COOKIE_NAME);
}

export function getBackendAuthCookieHeader(request: NextRequest): string | null {
  const authCookies = AUTH_COOKIE_NAMES.flatMap((cookieName) => {
    const cookie = request.cookies.get(cookieName);
    return cookie ? [`${cookie.name}=${cookie.value}`] : [];
  });

  return authCookies.length > 0 ? authCookies.join("; ") : null;
}

function getBackendAuthHeaders(request: NextRequest): Headers {
  const headers = new Headers(AUTH_REQUEST_HEADERS);
  const authCookieHeader = getBackendAuthCookieHeader(request);

  if (authCookieHeader) {
    headers.set("Cookie", authCookieHeader);
  }

  return headers;
}

function getSetCookieHeaders(headers: Headers): string[] {
  const headersWithSetCookie = headers as Headers & {
    getSetCookie?: () => string[];
  };
  const setCookieHeaders = headersWithSetCookie.getSetCookie?.();

  if (setCookieHeaders && setCookieHeaders.length > 0) {
    return setCookieHeaders;
  }

  const combinedSetCookieHeader = headers.get("set-cookie");
  return combinedSetCookieHeader ? [combinedSetCookieHeader] : [];
}
