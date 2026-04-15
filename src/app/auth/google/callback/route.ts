import { NextResponse, type NextRequest } from "next/server";
import { routes } from "@/config/routes";
import { GOOGLE_OAUTH_STATE_COOKIE_NAME, type OAuthErrorCode } from "@/modules/auth/utils";
import {
  clearAuthCookies,
  exchangeGoogleCodeForSession,
  setAuthCookies,
} from "@/modules/auth/server/session";

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
    const session = await exchangeGoogleCodeForSession(code);

    if (!session) {
      return redirectToLogin(request, "oauth_failed");
    }

    const response = NextResponse.redirect(new URL(routes.app.dashboard, request.url));

    response.cookies.delete(GOOGLE_OAUTH_STATE_COOKIE_NAME);
    setAuthCookies(response, session);

    return response;
  } catch {
    return redirectToLogin(request, "oauth_failed");
  }
}

function redirectToLogin(request: NextRequest, error: OAuthErrorCode) {
  const loginUrl = new URL(routes.public.login, request.url);

  loginUrl.searchParams.set("error", error);

  const response = NextResponse.redirect(loginUrl);

  clearAuthCookies(response);

  return response;
}
