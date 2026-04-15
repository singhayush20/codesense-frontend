import { NextResponse } from "next/server";
import { getAuthEnv } from "@/config/env";
import type { AuthTokenResponse } from "@/modules/auth/types";
import {
  AUTH_TOKEN_COOKIE_NAME,
  AUTH_TOKEN_EXPIRES_AT_COOKIE_NAME,
  AUTH_TOKEN_TYPE_COOKIE_NAME,
  GOOGLE_OAUTH_STATE_COOKIE_NAME,
  getMaxAgeSecondsFromIso,
  isAuthTokenResponse,
  REFRESH_TOKEN_COOKIE_NAME,
} from "@/modules/auth/utils";

const SESSION_COOKIE_PRIORITY = "high" as const;
const SESSION_JSON_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export async function exchangeGoogleCodeForSession(
  code: string,
): Promise<AuthTokenResponse | null> {
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

  return parseAuthTokenResponse(response);
}

export async function refreshSessionWithToken(
  refreshToken: string,
): Promise<AuthTokenResponse | null> {
  const { apiUrl } = getAuthEnv();
  const refreshUrl = new URL("/api/v1/auth/refresh", apiUrl);

  const response = await fetch(refreshUrl, {
    method: "POST",
    headers: SESSION_JSON_HEADERS,
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });

  return parseAuthTokenResponse(response);
}

export async function logoutBackendSession({
  accessToken,
  tokenType,
}: {
  accessToken?: string | null;
  tokenType?: string | null;
}): Promise<void> {
  if (!accessToken) {
    return;
  }

  const { apiUrl } = getAuthEnv();
  const logoutUrl = new URL("/api/v1/auth/logout", apiUrl);

  try {
    await fetch(logoutUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `${tokenType ?? "Bearer"} ${accessToken}`,
      },
      cache: "no-store",
    });
  } catch {
    return;
  }
}

export function setAuthCookies(response: NextResponse, session: AuthTokenResponse) {
  const sessionMaxAge = getMaxAgeSecondsFromIso(session.refreshTokenExpiresAt);
  const accessTokenMaxAge = getMaxAgeSecondsFromIso(session.accessTokenExpiresAt);

  if (
    sessionMaxAge === null ||
    sessionMaxAge <= 0 ||
    accessTokenMaxAge === null ||
    accessTokenMaxAge <= 0
  ) {
    throw new Error("Auth token response contains expired or invalid timestamps.");
  }

  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    priority: SESSION_COOKIE_PRIORITY,
    maxAge: sessionMaxAge,
  };

  response.cookies.set(AUTH_TOKEN_COOKIE_NAME, session.accessToken, cookieOptions);
  response.cookies.set(REFRESH_TOKEN_COOKIE_NAME, session.refreshToken, cookieOptions);
  response.cookies.set(AUTH_TOKEN_TYPE_COOKIE_NAME, session.tokenType, cookieOptions);
  response.cookies.set(
    AUTH_TOKEN_EXPIRES_AT_COOKIE_NAME,
    session.accessTokenExpiresAt,
    cookieOptions,
  );
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.delete(AUTH_TOKEN_COOKIE_NAME);
  response.cookies.delete(REFRESH_TOKEN_COOKIE_NAME);
  response.cookies.delete(AUTH_TOKEN_TYPE_COOKIE_NAME);
  response.cookies.delete(AUTH_TOKEN_EXPIRES_AT_COOKIE_NAME);
  response.cookies.delete(GOOGLE_OAUTH_STATE_COOKIE_NAME);
}

async function parseAuthTokenResponse(response: Response): Promise<AuthTokenResponse | null> {
  if (!response.ok) {
    return null;
  }

  try {
    const data: unknown = await response.json();

    if (!isAuthTokenResponse(data)) {
      return null;
    }

    const accessTokenMaxAge = getMaxAgeSecondsFromIso(data.accessTokenExpiresAt);
    const refreshTokenMaxAge = getMaxAgeSecondsFromIso(data.refreshTokenExpiresAt);

    if (
      accessTokenMaxAge === null ||
      accessTokenMaxAge <= 0 ||
      refreshTokenMaxAge === null ||
      refreshTokenMaxAge <= 0
    ) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}
