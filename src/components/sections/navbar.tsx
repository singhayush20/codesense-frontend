"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";

const navigation = [
  { label: "Features", href: "#features" },
  { label: "Documentation", href: "#docs" },
  { label: "Pricing", href: "#pricing" },
  { label: "Enterprise", href: "#enterprise" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        <Link href="#" className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-100">
          <Sparkles className="h-5 w-5 text-violet-300" />
          <span>The Digital Architect</span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="#signin" className="text-sm font-medium text-slate-300 transition hover:text-white">
            Sign In
          </Link>
          <Button variant="secondary" size="lg" className="rounded-full px-5">
            Start Free
          </Button>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-slate-200 transition hover:bg-slate-800/90 lg:hidden"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-slate-950/95 px-6 py-5 md:hidden">
          <div className="space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-slate-800"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              href="#signin"
              onClick={() => setOpen(false)}
              className="rounded-3xl border border-white/10 px-4 py-3 text-center text-sm font-medium text-slate-100 transition hover:bg-slate-800"
            >
              Sign In
            </Link>
            <Button variant="secondary" size="lg" className="w-full rounded-full px-5">
              Start Free
            </Button>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
