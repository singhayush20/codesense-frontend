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
      <body className="min-h-full bg-background text-foreground">
        <Script id="codesense-theme-init" strategy="beforeInteractive">
          {getThemeInitializationScript()}
        </Script>
        <Providers initialIsAuthenticated={initialIsAuthenticated}>{children}</Providers>
      </body>
    </html>
  );
}
