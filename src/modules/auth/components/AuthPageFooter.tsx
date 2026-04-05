import Link from "next/link";
import { routes } from "@/config/routes";

const footerLinks = [
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Security", href: "#security" },
  { label: "Contact", href: "#contact" },
] as const;

export function AuthPageFooter() {
  return (
    <footer className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1 text-center text-slate-400 sm:text-left">
        <Link href={routes.public.home} className="font-semibold text-slate-200 transition hover:text-white">
          The Digital Architect
        </Link>
        <p>© 2024 THE DIGITAL ARCHITECT. PRECISION FOR THE HIGH-COGNITION DEVELOPER.</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500">
        {footerLinks.map((link) => (
          <Link key={link.label} href={link.href} className="transition hover:text-white">
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
