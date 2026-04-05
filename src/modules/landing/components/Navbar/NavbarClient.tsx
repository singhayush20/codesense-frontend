"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { routes } from "@/config/routes";

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
      {/* Mobile Toggle Button */}
      <button
        type="button"
        aria-label="Toggle menu"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-slate-200 transition hover:bg-slate-800/90 lg:hidden"
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-white/10 bg-slate-950/95 px-6 py-5 md:hidden">
          <div className="space-y-4">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-slate-800"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <Link
              href={routes.public.login}
              onClick={() => setIsOpen(false)}
              className="rounded-3xl border border-white/10 px-4 py-3 text-center text-sm font-medium text-slate-100 transition hover:bg-slate-800"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </>
  );
}