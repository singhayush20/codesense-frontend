import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routes } from "./src/config/routes";
import { AUTH_TOKEN_COOKIE_NAME } from "./src/modules/auth/utils";


export function proxy(request: NextRequest) {
  const authToken = request.cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;
  const isProtectedRoute =
    pathname.startsWith(routes.app.dashboard) || pathname.startsWith(routes.app.profile);

  if (isProtectedRoute && !authToken) {
    return NextResponse.redirect(new URL(routes.public.login, request.url));
  }

  if (pathname === routes.public.login && authToken) {
    return NextResponse.redirect(new URL(routes.app.dashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*", "/profile/:path*"],
};
