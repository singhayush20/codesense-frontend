"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { apiFetch } from "@/lib/api";

export default function TestPage() {
  const [publicResponse, setPublicResponse] = useState<string | null>(null);
  const [authResponse, setAuthResponse] = useState<string | null>(null);
  const [publicError, setPublicError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [publicLoading, setPublicLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  async function testPublic() {
    setPublicLoading(true);
    setPublicError(null);
    try {
      const res = await apiFetch("/api/v1/app/test");
      const text = await res.text();
      setPublicResponse(`${res.status} ${res.statusText}\n\n${text}`);
    } catch (e) {
      setPublicError(String(e));
    } finally {
      setPublicLoading(false);
    }
  }

  async function testAuth() {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await apiFetch("/api/v1/app/test/auth");
      const text = await res.text();
      setAuthResponse(`${res.status} ${res.statusText}\n\n${text}`);
    } catch (e) {
      setAuthError(String(e));
    } finally {
      setAuthLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 p-8">
      <h1 className="text-2xl font-bold">Check Status</h1>

      <Card className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">GET /api/v1/app/test</h2>
        <p className="text-muted-foreground text-sm">Public endpoint — no auth required</p>
        <Button onClick={testPublic} disabled={publicLoading} className="self-start">
          {publicLoading ? "Fetching..." : "Test Public"}
        </Button>
        {publicError && (
          <pre className="max-h-48 w-full overflow-auto rounded bg-red-100 p-3 text-sm text-red-700">
            {publicError}
          </pre>
        )}
        {publicResponse && (
          <pre className="max-h-48 w-full overflow-auto rounded bg-muted p-3 text-sm">
            {publicResponse}
          </pre>
        )}
      </Card>

      <Card className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">GET /api/v1/app/test/auth</h2>
        <p className="text-muted-foreground text-sm">JWT-protected — requires valid auth cookie</p>
        <Button onClick={testAuth} disabled={authLoading} className="self-start">
          {authLoading ? "Fetching..." : "Test Auth"}
        </Button>
        {authError && (
          <pre className="max-h-48 w-full overflow-auto rounded bg-red-100 p-3 text-sm text-red-700">
            {authError}
          </pre>
        )}
        {authResponse && (
          <pre className="max-h-48 w-full overflow-auto rounded bg-muted p-3 text-sm">
            {authResponse}
          </pre>
        )}
      </Card>
    </div>
  );
}
