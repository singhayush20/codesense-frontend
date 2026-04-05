import Link from "next/link";
import { Sparkles } from "lucide-react";
import { routes } from "@/config/routes";
import NavbarClient from "./NavbarClient";

const navigationItems = [
  { label: "Features", href: "#features" },
  { label: "Documentation", href: "#docs" },
  { label: "Pricing", href: "#pricing" },
  { label: "Enterprise", href: "#enterprise" },
] as const;

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
      
        <Link
          href={routes.public.home}
          className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-100"
        >
          <Sparkles className="h-5 w-5 text-violet-300" />
          <span>The Digital Architect</span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={routes.public.login}
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            Sign In
          </Link>
        </div>

        <NavbarClient navigationItems={navigationItems} />
      </div>
    </nav>
  );
}