import Image from "next/image";
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
    <div className="relative w-full border border-border/70 bg-card/95 p-10 shadow-[var(--shadow-surface)] sm:p-14">
      <div className="space-y-8">
        <div className="space-y-5 text-center">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center bg-muted text-primary shadow-[var(--shadow-surface)]">
            <Compass className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Sign in to CodeSense</h1>
            <p className="text-sm text-muted-foreground">Use your Google account to get started</p>
          </div>
        </div>

        {oauthErrorMessage ? (
          <div
            role="alert"
            className="border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <p className="font-medium">{oauthErrorMessage}</p>
          </div>
        ) : null}

        {toastMessage ? (
          <div className="border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
            <p className="font-medium">{toastMessage}</p>
          </div>
        ) : null}

        <OAuthButton
          label="Sign in with Google"
          icon={
            <Image
              src="/google-icon.svg"
              alt="Google"
              width={20}
              height={20}
              className="h-5 w-5"
            />
          }
          onClick={() => onOAuthClick("Google")}
          loading={activeAction === "Google"}
        />

        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
