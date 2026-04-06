import { Compass } from "lucide-react";
import { OAuthButton } from "./OAuthButton";

interface LoginCardProps {
  activeAction: "GitHub" | "Google" | null;
  oauthErrorMessage?: string | null;
  toastMessage: string | null;
  onOAuthClick: (provider: "GitHub" | "Google") => void;
}

export function LoginCard({
  activeAction,
  oauthErrorMessage,
  toastMessage,
  onOAuthClick,
}: LoginCardProps) {
  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-800 bg-slate-950/95 p-8 shadow-[0_32px_80px_-38px_rgba(0,0,0,0.8)] backdrop-blur-xl transition duration-300">
      <div className="absolute left-1/2 top-0 h-32 w-[160%] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
      <div className="relative z-10 space-y-6">
        <div className="space-y-3 text-center">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-800/95 text-slate-100 shadow-[0_16px_60px_-48px_rgba(15,23,42,0.9)]">
            <Compass className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-center text-3xl font-semibold tracking-tight">Sign in to CodeSense</h1>
            <p className="text-center text-xs uppercase tracking-[0.32em] text-slate-500">
              THE DIGITAL ARCHITECT ECOSYSTEM
            </p>
          </div>
        </div>

        {oauthErrorMessage ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100 shadow-sm shadow-red-500/10"
          >
            <p className="font-medium">{oauthErrorMessage}</p>
          </div>
        ) : null}

        {toastMessage ? (
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-100 shadow-sm shadow-indigo-500/10">
            <p className="font-medium">{toastMessage}</p>
          </div>
        ) : null}

        <div className="space-y-4">
          <OAuthButton
            label="Continue with GitHub"
            icon={<span className="text-lg">🐙</span>}
            onClick={() => onOAuthClick("GitHub")}
            loading={activeAction === "GitHub"}
          />
          <OAuthButton
            label="Sign in with Google"
            icon={
              <span className="grid h-7 w-7 place-items-center rounded-xl bg-white text-sm text-slate-950">
                G
              </span>
            }
            onClick={() => onOAuthClick("Google")}
            loading={activeAction === "Google"}
          />
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/60 px-4 py-4 text-center text-xs text-slate-500">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
}
