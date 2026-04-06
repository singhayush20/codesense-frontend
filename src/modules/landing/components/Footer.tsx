import Link from "next/link";
import { Container } from "@/components/ui/Container";

const links = [
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Terms of Service", href: "#terms" },
  { label: "Security", href: "#security" },
  { label: "Status", href: "#status" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/70 bg-background/80 py-12">
      <Container className="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">CodeSense</p>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
            Precision for the high-cognition developer. Built to help teams keep architecture, security, and velocity aligned.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {links.map((link) => (
            <Link key={link.label} href={link.href} className="transition hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
}
