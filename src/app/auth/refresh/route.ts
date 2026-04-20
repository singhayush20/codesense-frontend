import { NextResponse, type NextRequest } from "next/server";
import {
  appendSetCookieHeaders,
  clearAuthCookies,
  refreshBackendSession,
} from "@/modules/auth/server/session";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const backendResponse = await refreshBackendSession(request);

  if (!backendResponse) {
    return buildRefreshFailureResponse();
  }

  const response = new NextResponse(null, { status: 204 });
  appendSetCookieHeaders(response.headers, backendResponse.headers);
  return response;
}

function buildRefreshFailureResponse() {
  const response = NextResponse.json(
    {
      message: "Session refresh failed.",
    },
    { status: 401 },
  );

  clearAuthCookies(response);
  return response;
}
