import { NextResponse, type NextRequest } from "next/server";
import { getAuthEnv } from "@/config/env";
import { routes } from "@/config/routes";
import {
  AUTH_TOKEN_COOKIE_NAME,
  buildGoogleAuthorizationUrl,
  GOOGLE_OAUTH_STATE_COOKIE_NAME,
  GOOGLE_OAUTH_STATE_MAX_AGE_SECONDS,
} from "@/modules/auth/utils";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const existingAuthToken = request.cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value;

  if (existingAuthToken) {
    return NextResponse.redirect(new URL(routes.app.dashboard, request.url));
  }

  const { appUrl, googleClientId } = getAuthEnv();
  const state = crypto.randomUUID();
  const authorizationUrl = buildGoogleAuthorizationUrl({
    appUrl,
    clientId: googleClientId,
    state,
  });

  const response = NextResponse.redirect(authorizationUrl);

  response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE_NAME, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: GOOGLE_OAUTH_STATE_MAX_AGE_SECONDS,
    priority: "high",
  });

  return response;
}
