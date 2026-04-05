"use client";

import { useEffect, useRef, useState } from "react";
import { LoginCard } from "./LoginCard";
import { AuthPageFooter } from "./AuthPageFooter";

export function LoginPage() {
  const [activeAction, setActiveAction] = useState<"GitHub" | "Google" | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

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
    showToast(`Mock ${provider} sign in initiated`);
    window.setTimeout(() => setActiveAction(null), 700);
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-[#0A0F1C] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.12),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_20%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:64px_64px] opacity-40" />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-6">
        <LoginCard activeAction={activeAction} toastMessage={toastMessage} onOAuthClick={handleOAuthClick} />

        <div className="flex w-full max-w-md items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-3 text-xs text-slate-400 shadow-[0_16px_80px_-56px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <span className="font-medium text-slate-200">Enterprise Encrypted</span>
          <span className="text-slate-500">v2.4.0 Stable</span>
        </div>

        <AuthPageFooter />
      </div>
    </div>
  );
}
