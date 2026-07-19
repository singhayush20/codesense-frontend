import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import Script from "next/script";
import "@/styles/globals.css";
import { AUTH_TOKEN_COOKIE_NAME, isAuthenticatedValue } from "@/modules/auth/utils";
import { getThemeInitializationScript } from "@/modules/theme/utils";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeSense | AI-powered code review",
  description: "AI-driven architecture-first code review for modern engineering teams.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const authToken = (await cookies()).get(AUTH_TOKEN_COOKIE_NAME)?.value;
  const initialIsAuthenticated = isAuthenticatedValue(authToken);

  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className="min-h-full bg-background text-foreground"
        suppressHydrationWarning
      >
        <Script id="codesense-theme-init" strategy="beforeInteractive">
          {getThemeInitializationScript()}
        </Script>
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(var(--color-grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-grid-line)_1px,transparent_1px)] bg-[length:64px_64px] opacity-60" />
          <div className="absolute -top-48 -left-48 h-[600px] w-[600px] rounded-full bg-[var(--color-accent-soft)] blur-3xl opacity-40 animate-glow-pulse" />
          <div className="absolute -bottom-48 -right-48 h-[600px] w-[600px] rounded-full bg-[var(--color-accent-soft)] blur-3xl opacity-30 animate-glow-pulse" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/3 -right-32 h-[400px] w-[400px] rounded-full bg-[var(--color-accent-soft)] blur-3xl opacity-20 animate-float" />
          <div className="absolute -left-32 bottom-1/4 h-[350px] w-[350px] rounded-full bg-[var(--color-accent-soft)] blur-3xl opacity-15 animate-float" style={{ animationDelay: "3s" }} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-accent-soft)_0%,transparent_60%)] opacity-30" />
        </div>
        <div className="relative z-10">
          <Providers initialIsAuthenticated={initialIsAuthenticated}>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
