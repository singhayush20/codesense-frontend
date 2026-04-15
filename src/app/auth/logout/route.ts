import { NextResponse, type NextRequest } from "next/server";
import {
  AUTH_TOKEN_COOKIE_NAME,
  AUTH_TOKEN_TYPE_COOKIE_NAME,
} from "@/modules/auth/utils";
import { clearAuthCookies, logoutBackendSession } from "@/modules/auth/server/session";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value;
  const tokenType = request.cookies.get(AUTH_TOKEN_TYPE_COOKIE_NAME)?.value;

  await logoutBackendSession({ accessToken, tokenType });

  const response = new NextResponse(null, { status: 204 });

  clearAuthCookies(response);

  return response;
}
