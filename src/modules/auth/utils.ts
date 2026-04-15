import { routes } from "@/config/routes";
import type { AuthNoticeCode, AuthTokenResponse } from "@/modules/auth/types";

export const AUTH_TOKEN_COOKIE_NAME = "codesense_auth_token";
export const REFRESH_TOKEN_COOKIE_NAME = "codesense_refresh_token";
export const AUTH_TOKEN_TYPE_COOKIE_NAME = "codesense_auth_token_type";
export const AUTH_TOKEN_EXPIRES_AT_COOKIE_NAME = "codesense_access_token_expires_at";
export const GOOGLE_OAUTH_STATE_COOKIE_NAME = "codesense_google_oauth_state";
export const GOOGLE_OAUTH_STATE_MAX_AGE_SECONDS = 60 * 10;
export const GOOGLE_OAUTH_SCOPES = ["openid", "email", "profile"] as const;

export type OAuthErrorCode = "oauth_denied" | "oauth_state_mismatch" | "oauth_failed";
export const AUTH_SNACKBAR_DURATION_MS = 4_000;

const OAUTH_ERROR_MESSAGES: Record<OAuthErrorCode, string> = {
  oauth_denied: "Google sign-in was canceled before it completed.",
  oauth_state_mismatch: "Google sign-in could not be verified. Please try again.",
  oauth_failed: "Google sign-in failed. Please try again.",
};

const AUTH_NOTICE_MESSAGES: Record<AuthNoticeCode, string> = {
  session_expired: "Your session expired. Please log in again.",
};

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isAuthenticatedValue(authToken?: string | null): boolean {
  return Boolean(authToken);
}

export function buildGoogleRedirectUri(appUrl: string): string {
  return new URL(routes.auth.googleCallback, appUrl).toString();
}

export function buildGoogleAuthorizationUrl({
  appUrl,
  clientId,
  state,
}: {
  appUrl: string;
  clientId: string;
  state: string;
}): string {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", buildGoogleRedirectUri(appUrl));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", GOOGLE_OAUTH_SCOPES.join(" "));
  url.searchParams.set("state", state);

  return url.toString();
}

export function getOAuthErrorMessage(errorCode?: string | null): string | null {
  if (!errorCode || !Object.prototype.hasOwnProperty.call(OAUTH_ERROR_MESSAGES, errorCode)) {
    return null;
  }

  return OAUTH_ERROR_MESSAGES[errorCode as OAuthErrorCode];
}

export function getAuthNoticeMessage(noticeCode?: string | null): string | null {
  if (!noticeCode || !Object.prototype.hasOwnProperty.call(AUTH_NOTICE_MESSAGES, noticeCode)) {
    return null;
  }

  return AUTH_NOTICE_MESSAGES[noticeCode as AuthNoticeCode];
}

export function getSingleSearchParamValue(
  value?: string | string[] | null,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value ?? undefined;
}

export function getMaxAgeSecondsFromIso(value: string): number | null {
  const expiresAt = Date.parse(value);

  if (Number.isNaN(expiresAt)) {
    return null;
  }

  return Math.max(0, Math.ceil((expiresAt - Date.now()) / 1_000));
}

export function isAuthTokenResponse(value: unknown): value is AuthTokenResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "accessToken" in value &&
    typeof value.accessToken === "string" &&
    "refreshToken" in value &&
    typeof value.refreshToken === "string" &&
    "tokenType" in value &&
    typeof value.tokenType === "string" &&
    "accessTokenExpiresAt" in value &&
    typeof value.accessTokenExpiresAt === "string" &&
    "refreshTokenExpiresAt" in value &&
    typeof value.refreshTokenExpiresAt === "string"
  );
}
