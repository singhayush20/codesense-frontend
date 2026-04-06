import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { AUTH_TOKEN_COOKIE_NAME, isAuthenticatedValue } from "@/modules/auth/utils";

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

import { Providers } from "./providers";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const authToken = (await cookies()).get(AUTH_TOKEN_COOKIE_NAME)?.value;
  const initialIsAuthenticated = isAuthenticatedValue(authToken);

  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full bg-[#0A0F1C] text-slate-100">
        <Providers initialIsAuthenticated={initialIsAuthenticated}>{children}</Providers>
      </body>
    </html>
  );
}
