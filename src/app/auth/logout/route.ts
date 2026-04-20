import { NextResponse, type NextRequest } from "next/server";
import {
  appendSetCookieHeaders,
  clearAuthCookies,
  logoutBackendSession,
} from "@/modules/auth/server/session";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const backendResponse = await logoutBackendSession(request);

  const response = new NextResponse(null, { status: 204 });

  clearAuthCookies(response);

  if (backendResponse) {
    appendSetCookieHeaders(response.headers, backendResponse.headers);
  }

  return response;
}
