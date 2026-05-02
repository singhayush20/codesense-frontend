"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { GitBranch, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { routes } from "@/config/routes";
import { useGithub } from "@/modules/github/hooks/useGithub";

interface ConnectingStateProps {
  installationId: string | null;
}

export function ConnectingState({ installationId }: ConnectingStateProps) {
  const router = useRouter();
  const hasStarted = useRef(false);
  const { completeInstallation, connectGithub, error, isConnecting, isSyncing } = useGithub();
  const missingInstallationError = installationId
    ? null
    : "GitHub did not return an installation id. You can restart the connection flow.";

  useEffect(() => {
    if (hasStarted.current) {
      return;
    }

    hasStarted.current = true;

    if (!installationId) {
      return;
    }

    void completeInstallation(installationId).then((success) => {
      if (success) {
        router.replace(routes.app.repositories);
      }
    });
  }, [completeInstallation, installationId, router]);

  const visibleError = missingInstallationError ?? error;
  const isWorking = isConnecting || isSyncing;

  return (
    <div className="mx-auto grid min-h-[calc(100vh-10rem)] w-full max-w-lg place-items-center px-4">
      <section className="w-full rounded-2xl border border-border/70 bg-card/90 p-8 text-center shadow-[var(--shadow-surface)] backdrop-blur-xl">
        <div className="mx-auto grid size-16 place-items-center rounded-xl bg-muted text-primary">
          <GitBranch className="size-8" aria-hidden="true" />
        </div>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
          {visibleError ? "Connection paused" : "Connecting GitHub..."}
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
          {visibleError ?? "Finalizing your setup. This will take a few seconds."}
        </p>

        <div className="mx-auto mt-8 h-1.5 w-40 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full w-1/2 rounded-full bg-primary transition-transform duration-700 data-[active=true]:animate-pulse"
            data-active={isWorking}
          />
        </div>

        <div className="mt-8 rounded-lg bg-muted px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
            {isSyncing ? "Syncing repositories" : "Connecting to GitHub account"}
          </p>
        </div>

        {visibleError ? (
          <div className="mt-6 flex justify-center">
            <Button
              type="button"
              onClick={() => void connectGithub()}
              disabled={isWorking}
              className="gap-2"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Retry connection
            </Button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
