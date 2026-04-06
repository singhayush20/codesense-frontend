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
    <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border/70 bg-card/95 p-8 shadow-[var(--shadow-surface)] backdrop-blur-xl transition duration-300">
      <div className="absolute left-1/2 top-0 h-32 w-[160%] -translate-x-1/2 rounded-full bg-[var(--color-accent-soft)] blur-3xl" />
      <div className="relative z-10 space-y-6">
        <div className="space-y-3 text-center">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-muted text-primary shadow-[var(--shadow-surface)]">
            <Compass className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-center text-3xl font-semibold tracking-tight text-foreground">Sign in to CodeSense</h1>
            <p className="text-center text-xs uppercase tracking-[0.32em] text-muted-foreground">
              THE DIGITAL ARCHITECT ECOSYSTEM
            </p>
          </div>
        </div>

        {oauthErrorMessage ? (
          <div
            role="alert"
            className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive shadow-[var(--shadow-surface)]"
          >
            <p className="font-medium">{oauthErrorMessage}</p>
          </div>
        ) : null}

        {toastMessage ? (
          <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary shadow-[var(--shadow-surface)]">
            <p className="font-medium">{toastMessage}</p>
          </div>
        ) : null}

        <div className="space-y-4">
          <OAuthButton
            label="Continue with GitHub"
            icon={<span className="text-xs font-semibold tracking-[0.16em]">GH</span>}
            onClick={() => onOAuthClick("GitHub")}
            loading={activeAction === "GitHub"}
          />
          <OAuthButton
            label="Sign in with Google"
            icon={
              <span className="grid h-7 w-7 place-items-center rounded-xl bg-background text-sm font-semibold text-primary">
                G
              </span>
            }
            onClick={() => onOAuthClick("Google")}
            loading={activeAction === "Google"}
          />
        </div>

        <div className="rounded-3xl border border-border/70 bg-background/60 px-4 py-4 text-center text-xs text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
}
