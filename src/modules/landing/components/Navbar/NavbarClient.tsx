"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { routes } from "@/config/routes";
import { ThemeToggle } from "@/modules/theme/components/ThemeToggle";

type NavItem = {
  label: string;
  href: string;
};

export default function NavbarClient({
  navigationItems,
}: {
  navigationItems: readonly NavItem[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2 lg:hidden">
        <ThemeToggle className="shrink-0" />
        <button
          type="button"
          aria-label="Toggle menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-card/80 text-foreground transition hover:bg-muted"
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-border/70 bg-background/95 px-6 py-5 md:hidden">
          <div className="space-y-4">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-3xl border border-border/70 bg-card/80 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <Link
              href={routes.public.login}
              onClick={() => setIsOpen(false)}
              className="rounded-3xl border border-border/70 bg-card/80 px-4 py-3 text-center text-sm font-medium text-foreground transition hover:bg-muted"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
