import { NextResponse, type NextRequest } from "next/server";
import { getAuthEnv } from "@/config/env";
import { routes } from "@/config/routes";
import {
  AUTH_TOKEN_COOKIE_NAME,
  getJwtMaxAgeSeconds,
  GOOGLE_OAUTH_STATE_COOKIE_NAME,
  type OAuthErrorCode,
} from "@/modules/auth/utils";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const googleError = request.nextUrl.searchParams.get("error");

  if (googleError) {
    return redirectToLogin(request, "oauth_denied");
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const storedState = request.cookies.get(GOOGLE_OAUTH_STATE_COOKIE_NAME)?.value;

  if (!state || !storedState || state !== storedState) {
    return redirectToLogin(request, "oauth_state_mismatch");
  }

  if (!code) {
    return redirectToLogin(request, "oauth_failed");
  }

  try {
    const { apiUrl } = getAuthEnv();
    const oauthExchangeUrl = new URL("/api/v1/auth/oauth2/google", apiUrl);

    oauthExchangeUrl.searchParams.set("code", code);

    const backendResponse = await fetch(oauthExchangeUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!backendResponse.ok) {
      return redirectToLogin(request, "oauth_failed");
    }

    const data: unknown = await backendResponse.json();

    if (!isTokenResponse(data)) {
      return redirectToLogin(request, "oauth_failed");
    }

    const jwtMaxAgeSeconds = getJwtMaxAgeSeconds(data.token);

    if (typeof jwtMaxAgeSeconds === "number" && jwtMaxAgeSeconds <= 0) {
      return redirectToLogin(request, "oauth_failed");
    }

    const response = NextResponse.redirect(new URL(routes.app.dashboard, request.url));

    response.cookies.delete(GOOGLE_OAUTH_STATE_COOKIE_NAME);
    response.cookies.set(AUTH_TOKEN_COOKIE_NAME, data.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      priority: "high",
      ...(typeof jwtMaxAgeSeconds === "number" ? { maxAge: jwtMaxAgeSeconds } : {}),
    });

    return response;
  } catch {
    return redirectToLogin(request, "oauth_failed");
  }
}

function redirectToLogin(request: NextRequest, error: OAuthErrorCode) {
  const loginUrl = new URL(routes.public.login, request.url);

  loginUrl.searchParams.set("error", error);

  const response = NextResponse.redirect(loginUrl);

  response.cookies.delete(GOOGLE_OAUTH_STATE_COOKIE_NAME);

  return response;
}

function isTokenResponse(value: unknown): value is { token: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "token" in value &&
    typeof value.token === "string"
  );
}
