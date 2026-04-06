import Link from "next/link";
import { routes } from "@/config/routes";

const footerLinks = [
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Security", href: "#security" },
  { label: "Contact", href: "#contact" },
] as const;

export function AuthPageFooter() {
  return (
    <footer className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1 text-center text-muted-foreground sm:text-left">
        <Link href={routes.public.home} className="font-semibold text-foreground transition hover:text-primary">
          CodeSense
        </Link>
        <p>Copyright 2024 CodeSense. Precision for the high-cognition developer.</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground">
        {footerLinks.map((link) => (
          <Link key={link.label} href={link.href} className="transition hover:text-foreground">
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
