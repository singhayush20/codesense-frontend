import Link from "next/link";
import { Sparkles } from "lucide-react";
import { routes } from "@/config/routes";
import { ThemeToggle } from "@/modules/theme/components/ThemeToggle";
import NavbarClient from "./NavbarClient";

const navigationItems = [
  { label: "Features", href: "#features" },
  { label: "Documentation", href: "#docs" },
  { label: "Pricing", href: "#pricing" },
  { label: "Enterprise", href: "#enterprise" },
] as const;

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        <Link
          href={routes.public.home}
          className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.22em] text-foreground"
        >
          <Sparkles className="h-5 w-5 text-primary" />
          <span>CodeSense</span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Link
            href={routes.public.login}
            className="inline-flex items-center rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            Sign In
          </Link>
        </div>

        <NavbarClient navigationItems={navigationItems} />
      </div>
    </nav>
  );
}
