import { routes } from "@/config/routes";

export const AUTH_TOKEN_COOKIE_NAME = "codesense_auth_token";
export const GOOGLE_OAUTH_STATE_COOKIE_NAME = "codesense_google_oauth_state";
export const GOOGLE_OAUTH_STATE_MAX_AGE_SECONDS = 60 * 10;
export const GOOGLE_OAUTH_SCOPES = ["openid", "email", "profile"] as const;

export type OAuthErrorCode = "oauth_denied" | "oauth_state_mismatch" | "oauth_failed";

const OAUTH_ERROR_MESSAGES: Record<OAuthErrorCode, string> = {
  oauth_denied: "Google sign-in was canceled before it completed.",
  oauth_state_mismatch: "Google sign-in could not be verified. Please try again.",
  oauth_failed: "Google sign-in failed. Please try again.",
};

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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

export function getSingleSearchParamValue(
  value?: string | string[] | null,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value ?? undefined;
}

export function getJwtMaxAgeSeconds(token: string): number | undefined {
  const payload = decodeJwtPayload(token);
  const exp = payload?.exp;

  if (typeof exp !== "number" || !Number.isFinite(exp)) {
    return undefined;
  }

  return Math.max(0, exp - Math.floor(Date.now() / 1000));
}

function decodeJwtPayload(token: string): { exp?: number } | null {
  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(payload)) as { exp?: number };
  } catch {
    return null;
  }
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));

  return atob(`${normalized}${padding}`);
}
