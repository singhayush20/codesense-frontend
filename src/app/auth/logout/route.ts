import { NextResponse } from "next/server";
import {
  AUTH_TOKEN_COOKIE_NAME,
  GOOGLE_OAUTH_STATE_COOKIE_NAME,
} from "@/modules/auth/utils";

export const runtime = "nodejs";

export async function POST() {
  const response = new NextResponse(null, { status: 204 });

  response.cookies.delete(AUTH_TOKEN_COOKIE_NAME);
  response.cookies.delete(GOOGLE_OAUTH_STATE_COOKIE_NAME);

  return response;
}
