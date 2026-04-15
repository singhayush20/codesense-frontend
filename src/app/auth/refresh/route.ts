import { NextResponse, type NextRequest } from "next/server";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/modules/auth/utils";
import {
  clearAuthCookies,
  refreshSessionWithToken,
  setAuthCookies,
} from "@/modules/auth/server/session";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;

  if (!refreshToken) {
    return buildRefreshFailureResponse();
  }

  const session = await refreshSessionWithToken(refreshToken);

  if (!session) {
    return buildRefreshFailureResponse();
  }

  const response = new NextResponse(null, { status: 204 });
  setAuthCookies(response, session);
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
