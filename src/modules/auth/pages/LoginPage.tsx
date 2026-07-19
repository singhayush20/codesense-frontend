"use client";

import { useEffect, useRef, useState } from "react";
import { routes } from "@/config/routes";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { LoginCard } from "../components/LoginCard";

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
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <LoginCard
            activeAction={activeAction}
            oauthErrorMessage={oauthErrorMessage}
            toastMessage={toastMessage}
            onOAuthClick={handleOAuthClick}
          />
        </div>
      </div>

    </div>
  );
}
