"use client";

import { useEffect, useRef, useState } from "react";
import { routes } from "@/config/routes";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { LoginCard } from "../components/LoginCard";
import { AuthPageFooter } from "../components/AuthPageFooter";

interface LoginPageProps {
  oauthErrorMessage?: string | null;
  authNoticeMessage?: string | null;
}

export function LoginPage({
  oauthErrorMessage = null,
  authNoticeMessage = null,
}: LoginPageProps) {
  const { showSnackbar } = useAuth();
  const [activeAction, setActiveAction] = useState<"GitHub" | "Google" | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const hasShownAuthNotice = useRef(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!authNoticeMessage || hasShownAuthNotice.current) {
      return;
    }

    hasShownAuthNotice.current = true;
    showSnackbar(authNoticeMessage);
  }, [authNoticeMessage, showSnackbar]);

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    toastTimer.current = setTimeout(() => {
      setToastMessage(null);
    }, 2100);
  };

  const handleOAuthClick = (provider: "GitHub" | "Google") => {
    setActiveAction(provider);

    if (provider === "Google") {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }

      setToastMessage("Redirecting to Google...");
      window.requestAnimationFrame(() => {
        window.location.assign(routes.auth.googleStart);
      });
      return;
    }

    showToast(`Mock ${provider} sign in initiated`);
    window.setTimeout(() => setActiveAction(null), 700);
  };

  return (
    <div className="relative min-h-screen bg-background px-6 py-24 text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--color-accent-soft),transparent_20%),radial-gradient(circle_at_bottom_right,var(--color-accent-soft),transparent_22%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--color-grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-grid-line)_1px,transparent_1px)] bg-[length:64px_64px] opacity-70" />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-6">
        <LoginCard
          activeAction={activeAction}
          oauthErrorMessage={oauthErrorMessage}
          toastMessage={toastMessage}
          onOAuthClick={handleOAuthClick}
        />

        <div className="flex w-full max-w-md items-center justify-between gap-4 rounded-3xl border border-border/70 bg-card/80 px-5 py-3 text-xs text-muted-foreground shadow-[var(--shadow-surface)] backdrop-blur-xl">
          <span className="font-medium text-foreground">Enterprise Encrypted</span>
          <span>v2.4.0 Stable</span>
        </div>

        <AuthPageFooter />
      </div>
    </div>
  );
}
