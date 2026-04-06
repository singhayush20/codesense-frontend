import Link from "next/link";
import { Sparkles } from "lucide-react";
import { routes } from "@/config/routes";
import { ThemeToggle } from "@/modules/theme/components/ThemeToggle";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 pt-4 sm:px-6 sm:pt-6">
          <Link
            href={routes.public.home}
            className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm font-semibold text-foreground shadow-[var(--shadow-surface)] backdrop-blur-xl"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span>CodeSense</span>
          </Link>

          <ThemeToggle className="pointer-events-auto" />
        </div>
      </div>

      {children}
    </div>
  );
}
