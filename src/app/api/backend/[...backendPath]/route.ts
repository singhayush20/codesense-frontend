import { type NextRequest } from "next/server";
import { getAuthEnv } from "@/config/env";
import {
  appendSetCookieHeaders,
  getBackendAuthCookieHeader,
} from "@/modules/auth/server/session";

const BODYLESS_METHODS = new Set(["GET", "HEAD"]);
const DISALLOWED_REQUEST_HEADERS = new Set([
  "authorization",
  "connection",
  "content-length",
  "cookie",
  "host",
]);
const DISALLOWED_RESPONSE_HEADERS = new Set(["set-cookie"]);

interface BackendProxyRouteContext {
  params: Promise<{
    backendPath: string[];
  }>;
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: BackendProxyRouteContext) {
  return handleBackendProxy(request, context);
}

export async function POST(request: NextRequest, context: BackendProxyRouteContext) {
  return handleBackendProxy(request, context);
}

export async function PUT(request: NextRequest, context: BackendProxyRouteContext) {
  return handleBackendProxy(request, context);
}

export async function PATCH(request: NextRequest, context: BackendProxyRouteContext) {
  return handleBackendProxy(request, context);
}

export async function DELETE(request: NextRequest, context: BackendProxyRouteContext) {
  return handleBackendProxy(request, context);
}

export async function HEAD(request: NextRequest, context: BackendProxyRouteContext) {
  return handleBackendProxy(request, context);
}

export async function OPTIONS(request: NextRequest, context: BackendProxyRouteContext) {
  return handleBackendProxy(request, context);
}

async function handleBackendProxy(request: NextRequest, context: BackendProxyRouteContext) {
  try {
    const { apiUrl } = getAuthEnv();
    const { backendPath } = await context.params;
    const backendUrl = new URL(backendPath.join("/"), apiUrl);
    const headers = getForwardHeaders(
      request.headers,
      getBackendAuthCookieHeader(request),
    );
    const body = BODYLESS_METHODS.has(request.method) ? undefined : await request.arrayBuffer();

    backendUrl.search = request.nextUrl.search;

    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
    });

    const responseHeaders = getForwardResponseHeaders(response.headers);
    appendSetCookieHeaders(responseHeaders, response.headers);

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch {
    return Response.json(
      {
        message: "Unable to reach the backend API.",
      },
      { status: 502 },
    );
  }
}

function getForwardHeaders(
  incomingHeaders: Headers,
  authCookieHeader: string | null,
) {
  const headers = new Headers();

  for (const [name, value] of incomingHeaders.entries()) {
    if (DISALLOWED_REQUEST_HEADERS.has(name.toLowerCase())) {
      continue;
    }

    headers.set(name, value);
  }

  if (authCookieHeader) {
    headers.set("Cookie", authCookieHeader);
  }

  return headers;
}

function getForwardResponseHeaders(incomingHeaders: Headers) {
  const headers = new Headers();

  for (const [name, value] of incomingHeaders.entries()) {
    if (DISALLOWED_RESPONSE_HEADERS.has(name.toLowerCase())) {
      continue;
    }

    headers.set(name, value);
  }

  return headers;
}
